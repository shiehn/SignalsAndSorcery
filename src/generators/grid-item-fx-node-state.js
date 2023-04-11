


export default class GridItemFxNodeState {

    constructor() {
        this.fxNodeId = null
        this.fxNodeState = null
    }

    setFxNodeId(fxNodeId){
        this.fxNodeId = fxNodeId
    }

    getFxNodeId(){
        return this.fxNodeId
    }

    setFxNodeState(fxNodeState){
        this.fxNodeState = fxNodeState
    }

    getFxNodeState(){
        return this.fxNodeState
    }
}