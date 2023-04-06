import {initializeWamHost} from "@webaudiomodules/sdk";
import OperableAudioBuffer from "./operable-audio-buffer";
import MyWam from "./my-wam";

export default class AudioGraph {

    plugin1Url = "http://localhost:8000/static/wam/stonephaser/index.js";
    plugin2Url = "http://localhost:8000/static/wam/BigMuff/index.js";


    constructor(store) {

        this.store = store

        this.pluginInstance1 = undefined
        this.pluginDomElement1 = ''

        this.pluginInstance2 = undefined
        this.pluginDomElement2 = ''


        this.nodeRows = [
            new Array(4),
            new Array(4),
            new Array(4),
            new Array(4),
            new Array(4),
            new Array(4),
        ]
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

    getNodes = () => {
        return this.nodeRows
    }

    init = async () => {



        let secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, this.store.state.getGlobalBpm());
        const bufferSizePerLoop = secondsInLoop * this.store.audioCtx.sampleRate;

        console.log('GLOBAL BPM AT BOOTSTRAP', this.store.state.getGlobalBpm())
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////
        // /////////////////////////// LOADING SPINNER ///////////////////////////



        //await store.audioCtx.suspend();
        /* Import from the Web Audio Modules 2.0 SDK to initialize Wam Host.
            It initializes a unique ID for the current AudioContext. */
        //const {default: initializeWamHost} = await import("../lib/sdk/initializeWamHost.js");
        const [hostGroupId] = await initializeWamHost(this.store.audioCtx);
        // Import our custom WAM Processor and the plugins.
        const {default: WAM1} = await import(/* webpackIgnore: true */ this.plugin1Url);
        const {default: WAM2} = await import(/* webpackIgnore: true */ this.plugin2Url);

        // Creating the Instance of the WAM plugins.
        this.pluginInstance1 = await WAM1.createInstance(hostGroupId, this.store.audioCtx);
        this.pluginDomElement1 = await this.pluginInstance1.createGui();
        this.pluginInstance2 = await WAM2.createInstance(hostGroupId, this.store.audioCtx);
        this.pluginDomElement2 = await this.pluginInstance2.createGui();


        for(let row = 0; row< this.nodeRows.length; row++){
            for(let col = 0; col < this.nodeRows[row].length; col++){
                //Create an empty buffer to be used as a placeholder for the audio.
                const emptyBuffer = this.generateEmptyBuffer(this.store.audioCtx, bufferSizePerLoop, this.store.audioCtx.sampleRate)

                // Create Operable Buffer from empty buffer
                let operableBuffer = Object.setPrototypeOf(emptyBuffer, OperableAudioBuffer.prototype);

                // Create an instance of our Processor for each node
                const wamInstance = await MyWam.createInstance(hostGroupId, this.store.audioCtx);
                this.nodeRows[row][col] = wamInstance.audioNode;



//JUST FOR TESTING

                // const response0_0 = await fetch(audioUrl0_0);
                // const audioArrayBuffer0_0 = await response0_0.arrayBuffer();
                // const audioBuffer0_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_0);
                // // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
                // operableBuffer = Object.setPrototypeOf(audioBuffer0_0, OperableAudioBuffer.prototype);


                //JUST FOR TESTING






                //SET THE AUDIO IN THE NODE
                this.nodeRows[row][col].setAudio(operableBuffer.toArray(false, row,col, this.store.audioCtx, this.store.state.getGlobalBpm()));

                //CONNECT THE NODE TO THE OUTPUT with any plugins
                this.nodeRows[row][col].connect(this.pluginInstance1._audioNode).connect(this.store.audioCtx.destination);

                //SET THE PROCESS TO STOP by default
                this.nodeRows[row][col].parameters.get("playing").value = 0;
                this.nodeRows[row][col].parameters.get("loop").value = 0;
            }
        }
    }
}