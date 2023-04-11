import SFXNodeTypes from './sfx-node-types'

export default class SFXNodeFactory {

    constructor(staticUrl) {
        this.sfxNodeTypes = new SFXNodeTypes(staticUrl)
    }
//this.store.state.getHostGroupId(), this.store.audioCtx
    async createNode(nodeType, groupHostId, audioCtx) {
        const nodeTypeInfo = this.sfxNodeTypes.getNodeTypeByName(nodeType)


        alert(nodeTypeInfo.pluginSrc)

        // Import our custom WAM Processor and the plugins.
        const {default: WAM} = await import(/* webpackIgnore: true */ nodeTypeInfo.pluginSrc);

        console.log('FACTORY_CONTEXT', audioCtx)

        // Creating the Instance of the WAM plugins.
        const pluginInstance = await WAM.createInstance(groupHostId, audioCtx);

        //THIS IS IF WE WANT TO USE THE WAM GUI
        //this.pluginDomElement = await this.pluginInstance.createGui();

        //THIS IS HOW TO GET PARAM VALUES
        // console.log('PLUGIN_1_INFO', await pluginInstance1._audioNode.getParameterInfo())
        // console.log('PLUGIN_1_getParameterValues', await pluginInstance1._audioNode.getParameterValues())

        // this.getNodes()[row][col].connect(pluginInstance2._audioNode).connect(this.store.audioCtx.destination);
        // await pluginInstance2._audioNode._output.setBigMuffDrive(100)//-3 to 100
        // await pluginInstance2._audioNode._output.setBigMuffTone(1)//0 to 1
        // await pluginInstance2._audioNode._output.setBigMuffBypass(0)//0 to 1
        // await pluginInstance2._audioNode._output.setBigMuffOutput(50)//50 to 100
        // await pluginInstance2._audioNode._output.setBigMuffInput(12)//-24 to 12

        return pluginInstance
    }
}