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
      //
      alert('NODE CREATED: ' + node)
    }

    watch(() => bus.value.get('focusSFX'), async (sfxId) => {
      if(!sfxId[0] || !sfxId[0].includes("_")){
        return
      }

      const {row, col} = sfxId[0].split('_')[0];

      // const audioGraph = new AudioGraph(store)
      //
      // console.log(audioGraph.getNodes()[row][col])

      console.log('this.store.state.getNodeRows()', store.state.getNodeRows())

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