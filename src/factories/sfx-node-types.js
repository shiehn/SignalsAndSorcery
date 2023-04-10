

const NODE_TYPES = [
    {
        name: 'BigMuff',
        pluginSrc: 'wam/BigMuff/index.js',
    }
]

export default class SFXNodeTypes {
    constructor() {
        this.nodeTypes = NODE_TYPES
    }

    getNodeTypeByName(sfxNodeName) {
        return this.nodeTypes.find(nodeType => nodeType.name === sfxNodeName)
    }
}