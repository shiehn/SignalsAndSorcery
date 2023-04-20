import {initializeWamHost} from "@webaudiomodules/sdk";
import OperableAudioBuffer from "./operable-audio-buffer";
import MyWam from "./my-wam";
import axios from "axios";
import {BASE_URL} from "../constants/constants";
import store from "../store/store";

export default class AudioGraph {


    constructor(store) {

        this.isPopulatingBuffers = false

        this.store = store

        this.pluginInstance1 = undefined
        this.pluginDomElement1 = ''

        this.pluginInstance2 = undefined
        this.pluginDomElement2 = ''


        this.plugin1Url = this.store.state.staticUrl + "wam/stonephaser/index.js";
        this.plugin2Url = this.store.state.staticUrl + "wam/BigMuff/index.js";
    }

    getNodes = () => {
        return this.store.state.getNodeRows()
    }

    getLoopLengthFromBarsAndBPM = (barCount, bpm) => {
        let msPerBeatAtBpm = 60000 / bpm;
        let totalBeats = 4 * barCount;
        return msPerBeatAtBpm * totalBeats / 1000
    }


    generateEmptyBuffer = async (actx, frameCount, sampleRate) => {
        //THIS IS LIKELY SILENCE SO GENERATE AN EMPTY BUFFER
        let emptyBuffer = actx.createBuffer(2, frameCount, sampleRate);
        // for (let channel = 0; channel < emptyBuffer.numberOfChannels; channel++) {
        //     let nowBuffering = emptyBuffer.getChannelData(channel);
        //     for (let i = 0; i < emptyBuffer.length; i++) {
        //         nowBuffering[i] = 0;
        //     }
        // }
        return emptyBuffer;
    }


    destroyAndRecreateGraph = () => {
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        console.log('DESTROY!!!!!!')
        for (let row = 0; row < this.getNodes().length; row++) {
            for (let col = 0; col < this.getNodes()[row].length; col++) {
                this.getNodes()[row][col].disconnect();
                this.getNodes()[row][col] = undefined;
            }
        }

        this.store.audioCtx.close();
        this.store.audioCtx = new AudioContext()


        this.init()

    }

    init = async () => {

        this.store.state.initNodeRows()

        let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
        const bufferSizePerLoop = secondsInLoop * this.store.audioCtx.sampleRate;

        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////

        //await this.store.audioCtx.suspend();
        /* Import from the Web Audio Modules 2.0 SDK to initialize Wam Host.
            It initializes a unique ID for the current AudioContext. */
        //const {default: initializeWamHost} = await import("../lib/sdk/initializeWamHost.js");

        const [hostGroupId] = await initializeWamHost(this.store.audioCtx);

        this.store.state.setHostGroupId(hostGroupId);
        // Import our custom WAM Processor and the plugins.
        // const {default: WAM1} = await import(/* webpackIgnore: true */ this.plugin1Url);
        // const {default: WAM2} = await import(/* webpackIgnore: true */ this.plugin2Url);

        // Creating the Instance of the WAM plugins.
        // this.pluginInstance1 = await WAM1.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
        // this.pluginDomElement1 = await this.pluginInstance1.createGui();
        // this.pluginInstance2 = await WAM2.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
        // this.pluginDomElement2 = await this.pluginInstance2.createGui();

        for (let row = 0; row < this.getNodes().length; row++) {
            for (let col = 0; col < this.getNodes()[row].length; col++) {
                //Create an empty buffer to be used as a placeholder for the audio.

                const emptyBufferX4 = await this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop * 4, this.store.audioCtx.sampleRate)

                // Create Operable Buffer from empty buffer
                let operableBuffer = Object.setPrototypeOf(emptyBufferX4, OperableAudioBuffer.prototype);

                // Create an instance of our Processor for each node
                const wamInstance = await MyWam.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
                this.getNodes()[row][col] = wamInstance.audioNode;


//JUST FOR TESTING

                // const response0_0 = await fetch(audioUrl0_0);
                // const audioArrayBuffer0_0 = await response0_0.arrayBuffer();
                // const audioBuffer0_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_0);
                // // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
                // operableBuffer = Object.setPrototypeOf(audioBuffer0_0, OperableAudioBuffer.prototype);


                //JUST FOR TESTING


                //SET THE AUDIO IN THE NODE
                this.getNodes()[row][col].setAudio(operableBuffer.toArray(false));

                //CONNECT THE NODE TO THE OUTPUT with any plugins
                this.getNodes()[row][col].connect(this.store.audioCtx.destination);

                //SET THE PROCESS TO STOP by default
                this.getNodes()[row][col].parameters.get("playing").value = 0;
                this.getNodes()[row][col].parameters.get("loop").value = 0;
            }
        }


        //await this.store.audioCtx.resume();
    }

    getBufferInRow = async (row, trackSourceUrls, audioCtx) => {
        let downloadTasks = []
        let buffer_list = [];
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
                let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
                let bufferSizePerLoop = secondsInLoop * audioCtx.sampleRate;
                let emptyBuffer = await this.generateEmptyBuffer(audioCtx, bufferSizePerLoop, audioCtx.sampleRate)
                buffer_list[x] = emptyBuffer;
            }
        }
        await Promise.all(downloadTasks)

        return {'buffer_list': buffer_list, 'row': row}
    }

    getBufferInRowSync = async (trackSourceUrls, audioCtx) => {
        let buffer_list = [];
        for (let x = 0; x < trackSourceUrls.length; x++) {

            if (!trackSourceUrls[x]) {
                let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
                let bufferSizePerLoop = secondsInLoop * audioCtx.sampleRate;

                buffer_list[x] = await this.generateEmptyBuffer(audioCtx, bufferSizePerLoop, audioCtx.sampleRate)

                continue
            }


            let response = await axios.get(trackSourceUrls[x] + "?x-request=js" /*s3 hack to prevent request from 2 origins */, {
                responseType: 'arraybuffer'
            })

            let audioData = response.data;
            if (audioData) {
                let buffer = await audioCtx.decodeAudioData(audioData);
                buffer_list[x] = buffer;
            }
        }

        return buffer_list;
    }

    getTrackListByRow = (row) => {
        if (!this.store.state.grid[row]) {
            return new Array(4).fill(undefined)
        }

        const tracks = this.store.state.grid[row].value.map((t) => {
            if (t.stem && t.stem.source) {
                return t.stem.source
            }
        })
        return tracks
    }

    setEmptyBuffersToMatchBPM = async () => {

        //this.store.state.initNodeRows()

        let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
        const bufferSizePerLoop = secondsInLoop * this.store.audioCtx.sampleRate;

        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////

        //await this.store.audioCtx.suspend();
        /* Import from the Web Audio Modules 2.0 SDK to initialize Wam Host.
            It initializes a unique ID for the current AudioContext. */
        //const {default: initializeWamHost} = await import("../lib/sdk/initializeWamHost.js");

        // const [hostGroupId] = await initializeWamHost(this.store.audioCtx);
        //
        // this.store.state.setHostGroupId(hostGroupId);
        // Import our custom WAM Processor and the plugins.
        // const {default: WAM1} = await import(/* webpackIgnore: true */ this.plugin1Url);
        // const {default: WAM2} = await import(/* webpackIgnore: true */ this.plugin2Url);

        // Creating the Instance of the WAM plugins.
        // this.pluginInstance1 = await WAM1.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
        // this.pluginDomElement1 = await this.pluginInstance1.createGui();
        // this.pluginInstance2 = await WAM2.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
        // this.pluginDomElement2 = await this.pluginInstance2.createGui();

        for (let row = 0; row < this.getNodes().length; row++) {
            for (let col = 0; col < this.getNodes()[row].length; col++) {
                //Create an empty buffer to be used as a placeholder for the audio.


                const emptyBufferX4 = await this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop * 4, this.store.audioCtx.sampleRate)


                // Create Operable Buffer from empty buffer
                let operableBuffer = Object.setPrototypeOf(emptyBufferX4, OperableAudioBuffer.prototype);

                // Create an instance of our Processor for each node


                //this.getNodes()[row][col]destroy()

                // const wamInstance = await MyWam.createInstance(this.store.state.getHostGroupId(), this.store.audioCtx);
                // this.getNodes()[row][col] = wamInstance.audioNode;


                //JUST FOR TESTING


                //SET THE AUDIO IN THE NODE
                // this.getNodes()[row][col].setAudio(operableBuffer.toArray(false));
                //
                // //CONNECT THE NODE TO THE OUTPUT with any plugins
                // this.getNodes()[row][col].connect(this.store.audioCtx.destination);

                //SET THE PROCESS TO STOP by default
                // this.getNodes()[row][col].parameters.get("playing").value = 0;
                // this.getNodes()[row][col].parameters.get("loop").value = 0;
            }
        }


        //await this.store.audioCtx.resume();
    }

    populateNodeWithBuffer = async (rowTarget, colTarget) => {
        if (this.isPopulatingBuffers) {
            return
        }

        //await this.store.audioCtx.suspend();
        this.isPopulatingBuffers = true

        try {
            let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
            const bufferSizePerLoop = Math.round(secondsInLoop * this.store.audioCtx.sampleRate);

            const downloadedBuffers = [[], [], [], [], [], []]

            for (let row = 0; row < this.getNodes().length; row++) {

                if (row != rowTarget) {
                    continue
                }


                //TODO: THIS SHOULD ONLY DOWNLOD THE SINGLE BUFFER THAT IS NEEDED, NOT THE WHOLE ROW

                let tracksInRow = this.getTrackListByRow(row)


                let buffer_list_row = await this.getBufferInRow(row, tracksInRow, this.store.audioCtx);

                downloadedBuffers[row] = buffer_list_row.buffer_list


            }


            const emptyBufferX4 = await this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop * 4, this.store.audioCtx.sampleRate)

            //SWAPPED THE BUFFER
            await this.swapBuffers(rowTarget, colTarget, downloadedBuffers[rowTarget][colTarget], emptyBufferX4)
// //SET THE AUDIO IN THE NODE
//             this.getNodes()[row][col].setAudio(operableBuffer.toArray(false));
//
//             //CONNECT THE NODE TO THE OUTPUT with any plugins
//             this.getNodes()[row][col].connect(this.store.audioCtx.destination);


        } catch (e) {
            console.error(e)
        } finally {
            this.isPopulatingBuffers = false
            //await this.store.audioCtx.resume();
        }
    }


    // stopAllNodes = () => {
    //     for (let row = 0; row < this.getNodes()[0].length; row++) {
    //         for (let col = 0; col < this.getNodes()[row].length; col++) {
    //             //SET THE PROCESS TO STOP by default
    //             this.getNodes()[row][col].parameters.get("playing").value = 0;
    //             this.getNodes()[row][col].parameters.get("loop").value = 0;
    //         }
    //     }
    // }

    populateNodesWithBuffers = async () => {
        if (this.isPopulatingBuffers) {
            return
        }

        //console.log('POPULATING NODES WITH BUFFERS')

        // this.stopAllNodes()

        //await this.store.audioCtx.suspend();
        this.isPopulatingBuffers = true

        try {
            let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
            const bufferSizePerLoop = Math.round(secondsInLoop * this.store.audioCtx.sampleRate);

            const downloadedBuffers = [[], [], [], [], [], []]

            let getBufferInRowParams = []
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

                getBufferInRowParams.push({'row':row, 'tracksInRow': tracksInRow, 'audioCtx': this.store.audioCtx})
            }

            let buffer_list_row_results = await Promise.all(getBufferInRowParams.map(params => this.getBufferInRow(params.row, params.tracksInRow, params.audioCtx)))

            for (let row = 0; row < buffer_list_row_results.length; row++) {
                downloadedBuffers[buffer_list_row_results[row].row] = buffer_list_row_results[row].buffer_list
            }

            let emptyBuffersParams = []
            for (let row = 0; row < downloadedBuffers.length; row++) {
                for (let col = 0; col < downloadedBuffers[row].length; col++) {
                    emptyBuffersParams.push({'audioCtx': this.store.audioCtx, 'bufferSizePerLoop': bufferSizePerLoop*4, 'sampleRate': this.store.audioCtx.sampleRate})
                }
            }
            let newEmptyBuffers = await Promise.all(emptyBuffersParams.map(params => this.generateEmptyBuffer(params.audioCtx, params.bufferSizePerLoop, params.sampleRate)))


            let swapBufferTaskParams = []
            let emptyBufferIndex = 0
            for (let row = 0; row < downloadedBuffers.length; row++) {
                for (let col = 0; col < downloadedBuffers[row].length; col++) {
                    swapBufferTaskParams.push({row, col, 'downloadedBuffer':downloadedBuffers[row][col], 'newEmptyBuffer':newEmptyBuffers[emptyBufferIndex]})
                    emptyBufferIndex++
                }
            }

            await Promise.all(swapBufferTaskParams.map(task => this.swapBuffers(task.row, task.col, task.downloadedBuffer, task.newEmptyBuffer)))
        } catch (e) {
            console.error(e)
        } finally {
            this.isPopulatingBuffers = false
            //await this.store.audioCtx.resume();
        }
    }

    swapBuffers = async (row, col, loopBuffer, emptyBigBuffer) => {
        if (!this.getNodes()[row][col]) {
            return
        }

        const operableAudioBuffer = Object.setPrototypeOf(emptyBigBuffer, OperableAudioBuffer.prototype);
        const bufferArray = await operableAudioBuffer.toArrayExtended(false, row, col, this.store.audioCtx, loopBuffer, this.store.state.getGlobalBpm())
        await this.getNodes()[row][col].setAudio(bufferArray);
    }

    populateNodeWithEmptyBuffer = async (row, col) => {
        let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
        const bufferSizePerLoop = Math.round(secondsInLoop * this.store.audioCtx.sampleRate);
        const emptyBuffer = await this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop, this.store.audioCtx.sampleRate)
        const emptyBufferX4 = await this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop * 4, this.store.audioCtx.sampleRate)
        await this.swapBuffers(row, col, emptyBuffer, emptyBufferX4)
    }
}