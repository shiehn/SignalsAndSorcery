export default class SFXNodeTypes {

    NODE_TYPES = [
        {
            name: 'BigMuff',
            pluginSrc: "wam/BigMuff/index.js"
        },
        {
            name: 'BigMuff',
            pluginSrc: "wam/stonephaser/index.js"
        }
    ]


    constructor(staticUrl) {
        this.NODE_TYPES.forEach(nodeType => {
            nodeType.pluginSrc = `${staticUrl}${nodeType.pluginSrc}`
        })
    }

    getNodeTypeByName(sfxNodeName) {
        return this.NODE_TYPES.find(nodeType => nodeType.name === sfxNodeName)
    }
}