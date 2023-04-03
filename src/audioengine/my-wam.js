import {WebAudioModule} from "@webaudiomodules/sdk";
import MyWamNode from "./wam-audio-player-node";


/**
 * @class
 * @extends WebAudioModule
 *
 * Overriding the WebAudioModule to set up the custom WAM processor.
 */
export default class MyWam extends WebAudioModule {
    /**
     * @property {Function} createAudioNode
     * @override
     * @param initialState
     * @return {Promise<MyWamNode>}
     */
    async createAudioNode(initialState) {
        await MyWamNode.addModules(this.moduleId);
        const node = new MyWamNode(this);

        // Initialize the node audio node. Register the processor in the audio context and the WAM group.
        node._initialize();
        return node;
    }
}