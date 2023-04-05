
import getProcessor from "./wam-audio-player-processor.js";
import {addFunctionModule, WamNode} from "@webaudiomodules/sdk";
import store from "../store/store";

/**
 * @class
 * @extends WamNode
 *
 * Class that extends WamNode, use to add our own processor, (see getProcessor).
 */
export default class MyWamNode extends WamNode {

    /**
     * Registers scripts required for the processor. Must be called before constructor.
     * @param {BaseAudioContext} audioContext
     * @param {string} moduleId
     */
    static async addModules(moduleId) {
        let {audioWorklet} = store.audioCtx;
        await super.addModules(store.audioCtx, moduleId);
        await addFunctionModule(audioWorklet, getProcessor, moduleId);
    }

    constructor(module) {
        super(module,
            {
                processorOptions: {
                    numberOfInputs: 1,
                    numberOfOutputs: 1,
                    outputChannelCount: [2],
                    useSab: true
                }
            });
    }

    /**
     * @property {Function} setAudio Sends the audio buffer.
     *
     * @param {Float32Array[]} audio Audio Buffer to be transferred to the processor in the audio to process.
     */
    setAudio(audio) {
        console.log('------------------SET AUDIO------------------');
        this.port.postMessage({audio});
    }
}