
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

    async pushFxNode(node, audioCtx) {
        audioCtx.suspend()
        console.log('PUSH CONTEXT', audioCtx)
        this._fxChain.push(node);

        await this._node.disconnect(audioCtx.destination);
        await this._node.connect(this._fxChain[0]._audioNode)
        await this._fxChain[0]._audioNode.connect(audioCtx.destination);

        audioCtx.resume()
    }

    getFxChain() {
        return this._fxChain;
    }
}