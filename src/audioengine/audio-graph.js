import {initializeWamHost} from "@webaudiomodules/sdk";
import OperableAudioBuffer from "./operable-audio-buffer";
import MyWam from "./my-wam";
import axios from "axios";

export default class AudioGraph {

    plugin1Url = "http://localhost:8000/static/wam/stonephaser/index.js";
    plugin2Url = "http://localhost:8000/static/wam/BigMuff/index.js";


    constructor(store) {

        this.isPopulatingBuffers = false

        this.store = store

        this.pluginInstance1 = undefined
        this.pluginDomElement1 = ''

        this.pluginInstance2 = undefined
        this.pluginDomElement2 = ''
    }

    getNodes = () => {
        return this.store.state.getNodeRows()
    }

    getLoopLengthFromBarsAndBPM = (barCount, bpm) => {
        let msPerBeatAtBpm = 60000 / bpm;
        let totalBeats = 4 * barCount;
        return msPerBeatAtBpm * totalBeats / 1000
    }


    generateEmptyBuffer = (actx, frameCount, sampleRate) => {
        //THIS IS LIKELY SILENCE SO GENERATE AN EMPTY BUFFER
        let emptyBuffer = actx.createBuffer(2, frameCount, sampleRate);
        for (let channel = 0; channel < emptyBuffer.numberOfChannels; channel++) {
            let nowBuffering = emptyBuffer.getChannelData(channel);
            for (let i = 0; i < emptyBuffer.length; i++) {
                nowBuffering[i] = 0;
            }
        }
        return emptyBuffer;
    }

    init = async () => {

        this.store.state.initNodeRows()

        let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
        const bufferSizePerLoop = secondsInLoop * this.store.audioCtx.sampleRate;

        console.log('GLOBAL BPM AT BOOTSTRAP', this.store.state.getGlobalBpm())
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////

        await this.store.audioCtx.suspend();
        /* Import from the Web Audio Modules 2.0 SDK to initialize Wam Host.
            It initializes a unique ID for the current AudioContext. */
        //const {default: initializeWamHost} = await import("../lib/sdk/initializeWamHost.js");
        const [hostGroupId] = await initializeWamHost(this.store.audioCtx);
        // Import our custom WAM Processor and the plugins.
        const {default: WAM1} = await import(/* webpackIgnore: true */ this.plugin1Url);
        const {default: WAM2} = await import(/* webpackIgnore: true */ this.plugin2Url);

        // Creating the Instance of the WAM plugins.
        // this.pluginInstance1 = await WAM1.createInstance(hostGroupId, this.store.audioCtx);
        // this.pluginDomElement1 = await this.pluginInstance1.createGui();
        // this.pluginInstance2 = await WAM2.createInstance(hostGroupId, this.store.audioCtx);
        // this.pluginDomElement2 = await this.pluginInstance2.createGui();

        const emptyBufferX4 = this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop*4, this.store.audioCtx.sampleRate)

        for(let row = 0; row< this.getNodes().length; row++){
            for(let col = 0; col < this.getNodes()[row].length; col++){
                //Create an empty buffer to be used as a placeholder for the audio.


                // Create Operable Buffer from empty buffer
                let operableBuffer = Object.setPrototypeOf(emptyBufferX4, OperableAudioBuffer.prototype);

                // Create an instance of our Processor for each node
                const wamInstance = await MyWam.createInstance(hostGroupId, this.store.audioCtx);
                this.getNodes()[row][col] = wamInstance.audioNode;



//JUST FOR TESTING

                // const response0_0 = await fetch(audioUrl0_0);
                // const audioArrayBuffer0_0 = await response0_0.arrayBuffer();
                // const audioBuffer0_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_0);
                // // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
                // operableBuffer = Object.setPrototypeOf(audioBuffer0_0, OperableAudioBuffer.prototype);


                //JUST FOR TESTING






                //SET THE AUDIO IN THE NODE
                this.getNodes()[row][col].setAudio(operableBuffer.toArray(false, row,col, this.store.audioCtx, emptyBufferX4, this.store.state.getGlobalBpm()));

                //CONNECT THE NODE TO THE OUTPUT with any plugins
                this.getNodes()[row][col].connect(this.store.audioCtx.destination);

                //SET THE PROCESS TO STOP by default
                this.getNodes()[row][col].parameters.get("playing").value = 0;
                this.getNodes()[row][col].parameters.get("loop").value = 0;
            }
        }





        await this.store.audioCtx.resume();
    }

    getBufferInRow = async (trackSourceUrls, emptyBuffer, audioCtx) => {
        let downloadTasks = []
        let buffer_list = new Array();
        for (let x = 0; x < trackSourceUrls.length; x++) {
            if (trackSourceUrls[x]) {
                downloadTasks.push(new Promise(function (resolve) {
                    axios.get(trackSourceUrls[x] + "?x-request=js" /*s3 hack to prevent request from 2 origins */, {
                        responseType: 'arraybuffer'
                    }).then(function (response) {
                        let audioData = response.data;
                        if (audioData) {
                            audioCtx.decodeAudioData(audioData, function (buffer) {
                                    buffer_list[x] = buffer;
                                    resolve()
                                },
                                function (e) {
                                    console.log(e.err);
                                });
                        } else {
                            console.error("problem!!");
                        }
                    })
                        .catch(function (error) {
                            console.error("problem!! downloading " + error);
                        })
                }))
            } else {
                buffer_list[x] = emptyBuffer;
            }
        }
        await Promise.all(downloadTasks)

        console.log('trackSourceUrls', trackSourceUrls)
        console.log('BUFFER ROW DOWNLOADED', buffer_list)
        return buffer_list;
    }

    getTrackListByRow = (row) => {
        const tracks = this.store.state.grid[row].value.map((t) => {
            if (t.stem && t.stem.source) {
                return t.stem.source
            }
        })
        return tracks
    }

    populateNodesWithBuffers = async () => {
        if(this.isPopulatingBuffers){
            return
        }

        await this.store.audioCtx.suspend();
        this.isPopulatingBuffers = true

        try {
            let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
            const bufferSizePerLoop = secondsInLoop * this.store.audioCtx.sampleRate;
            const emptyBuffer = this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop, this.store.audioCtx.sampleRate)


            const downloadedBuffers = [[],[],[],[],[],[]]

            for (let row = 0; row < this.getNodes().length; row++) {
                //CHECK IF THE ROW IS ALREADY CACHED
                // if (!this.store.state.hasRowStateChanged(n) && BUFFER_ROW_CACHE[n]) {
                //     listOfTrimmedRowBuffers[n] = BUFFER_ROW_CACHE[n]
                //     continue
                // }
                //GET THE LOOP SOURCE FOR ONE ROW
                let tracksInRow = this.getTrackListByRow(row)
                //console.log('tracksInRow-'+row, tracksInRow)
                //DOWNLOAD AND GET BUFFER FOR EACH LOOP IN ROW
                let buffer_list_row = await this.getBufferInRow(tracksInRow, emptyBuffer, this.store.audioCtx);

                downloadedBuffers[row] = buffer_list_row

                // for (let b = 0; b < buffer_list_row.length; b++) {
                //     await this.swapBuffers(row, b, buffer_list_row[b])
                // }
            }


            console.log('downloadedBuffers', downloadedBuffers)

            const emptyBufferX4 = this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop*4, this.store.audioCtx.sampleRate)

            for (let row = 0; row < downloadedBuffers.length; row++) {
                for (let col = 0; col < downloadedBuffers[row].length; col++) {
                    //THIS IS SYNCRONOUS!!!!
                    await this.swapBuffers(row, col, downloadedBuffers[row][col], emptyBufferX4)
                }
            }




        }catch (e) {
            console.error(e)
        } finally {
            this.isPopulatingBuffers = false
            await this.store.audioCtx.resume();
        }

    }

    swapBuffers = async (row, col, audioBuffer, emptyBuffer) => {
        const operableAudioBuffer = Object.setPrototypeOf(audioBuffer, OperableAudioBuffer.prototype);
        this.getNodes()[row][col].setAudio(operableAudioBuffer.toArray(false, row,col, this.store.audioCtx, emptyBuffer, this.store.state.getGlobalBpm()));
    }
}