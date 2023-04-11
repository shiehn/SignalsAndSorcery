
export default class NodeAndFxChain {
    constructor() {
        this._node = undefined;
        this._fxChain = [];
    }

    setRootNode(node) {
        this._node = node;
    }

    getRootNode() {
        return this._node;
    }
}