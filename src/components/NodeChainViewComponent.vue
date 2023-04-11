<template>
  <div class="w-2/3 border-2 border-white rounded-lg p-2 bg-orange-300">{{nodeId}}

    <button class="w-12 h-12"><img v-if="nodeId" :src="imageUrls.plusIcon" @click="addNodeClicked()"></button>
  </div>

</template>

<script>
import {inject, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";
import SFXNodeFactory from "../factories/sfx-node-factory";
import store from "../store/store";
import AudioGraph from "../audioengine/audio-graph";

export default {
  name: "NodeChainViewComponent",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const nodeId = ref(undefined)

    const imageUrls = { 
      plusIcon: store.state.staticUrl + "icons/plus.png" + "?x-request=html", 
    }

    let currentRow = -1;
    let currentCol = -1;

    /*
        constructor(staticUrl) {
        this.sfxNodeTypes = new SFXNodeTypes(staticUrl)
    }
//this.store.state.getHostGroupId(), this.store.audioCtx
    async createNode(nodeType, groupHostId, audioCtx) {
     */

    const nodeFactory = new SFXNodeFactory(store.state.staticUrl)


    const addNodeClicked = async () => {
      const node = await nodeFactory.createNode('BigMuff', store.state.getHostGroupId(), store.audioCtx)

      alert(currentRow + ' ' + currentCol)
      console.log('store.nodeRows', store.nodeRows)

      store.nodeRows[currentRow][currentCol].pushFxNode(node, store.audioCtx)

      console.log('getFxChain()[0]', store.nodeRows[currentRow][currentCol].getFxChain()[0])



      await store.nodeRows[currentRow][currentCol].getFxChain()[0]._audioNode._output.setBigMuffDrive(100)//-3 to 100
      await store.nodeRows[currentRow][currentCol].getFxChain()[0]._audioNode._output.setBigMuffTone(1)//0 to 1
      await store.nodeRows[currentRow][currentCol].getFxChain()[0]._audioNode._output.setBigMuffBypass(0)//0 to 1
      await store.nodeRows[currentRow][currentCol].getFxChain()[0]._audioNode._output.setBigMuffOutput(50)//50 to 100
      await store.nodeRows[currentRow][currentCol].getFxChain()[0]._audioNode._output.setBigMuffInput(12)//-24 to 12

      // await pluginInstance._audioNode._output.setBigMuffDrive(100)//-3 to 100
      // await pluginInstance._audioNode._output.setBigMuffTone(1)//0 to 1
      // await pluginInstance._audioNode._output.setBigMuffBypass(0)//0 to 1
      // await pluginInstance._audioNode._output.setBigMuffOutput(50)//50 to 100
      // await pluginInstance._audioNode._output.setBigMuffInput(12)//-24 to 12
    }

    watch(() => bus.value.get('focusSFX'), async (sfxId) => {

      currentRow = sfxId[0];
      currentCol = sfxId[1];

      // if(!sfxId[0] || !sfxId[0].includes("_")){
      //   return
      // }
      //
      // const {row, col} = sfxId[0].split('_');
      // currentRow = row;
      // currentCol = col;
      //
      //
      //
      //
      // // const audioGraph = new AudioGraph(store)
      // //
      // // console.log(audioGraph.getNodes()[row][col])
      //
      nodeId.value = sfxId[0]
    })

    return {
      addNodeClicked,
      imageUrls,
      nodeId
    }
  }
}
</script>

<style scoped>

</style>