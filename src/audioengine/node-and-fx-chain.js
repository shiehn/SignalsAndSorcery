
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
}