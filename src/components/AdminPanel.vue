<template>
  <div class="w-1/6 h-48 border-2 border-black rounded-lg p-2 my-2 nowrap overflow-hidden" style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>
    <div class="flex justify-between">
      <button @click="openProject()" class="border-2 border-black p-1 rounded-md"><img
          :src="imageAssets.loadBtn" class="h-6 "/>
      </button>
      <button @click="saveProject()" class="border-2 border-black p-1 rounded-md"><img
          :src="imageAssets.saveBtn" class="h-6"/>
      </button>
      <button @click="downloadMix()" class="border-2 border-black p-1 rounded-md"><img
          :src="imageAssets.downloadBtn" class="h-6"/>
      </button>
    </div>
  </div>
</template>

<script>
import GlobalTrackValues from "./GlobalTrackValues";
import {inject} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "AdminPanel",
  components: {GlobalTrackValues},
  setup() {
    const {emit} = useEventsBus()
    const store = inject('store')
    const toast = inject('toast');
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      saveBtn: store.state.staticUrl + 'icons/save-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    const downloadMix = () => {
      emit('downloadMix')
    }

    const openProject = () => {
      toast.error('Load project Not yet Implemented :(')
    }

    const saveProject = () => {
      toast.error('Load project Not yet Implemented :(')
    }

    return {
      downloadMix,
      openProject,
      saveProject,
      imageAssets,
    }
  },
}
</script>

<style scoped>

</style>