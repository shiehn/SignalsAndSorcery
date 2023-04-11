
export default class NodeAndFxChain {
    constructor() {
        this._node = undefined;
        this._fxChain = [];
    }

    setBaseNode(node) {
        this._node = node;
    }

    getBaseNode() {
        return this._node;
    }

    pushFxNode(node, audioCtx) {

        console.log('PUSH CONTEXT', audioCtx)
        this._fxChain.push(node);
        //audioCtx.suspend()
        this._node.disconnect();
        this._node.connect(this._fxChain[0]).connect(audioCtx.destination);

        // audioCtx.resume()
    }
}