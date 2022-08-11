<template>
  <div v-if="!isMobile" class="w-1/6 h-48 border-2 border-black rounded-lg p-2 my-2 nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>
    <div class="flex justify-between">
      <button @click="saveProject()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.saveBtn" class="h-6"/>
      </button>
      <button @click="downloadMix()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.downloadBtn" class="h-6"/>
      </button>
    </div>
  </div>

  <div v-else class="flex w-full border-2 border-black rounded-lg p-2 my-2 nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>
    <div class="flex w-1/4 justify-between">
      <button @click="saveProject()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.saveBtn" class="w-8 h-6"/>
      </button>
      <button @click="downloadMix()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.downloadBtn" class="w-8 h-6"/>
      </button>
    </div>
  </div>

  <loading-spinner :showLoadingProp="showLoadingSpinner"></loading-spinner>
</template>

<script>
import GlobalTrackValues from "./GlobalTrackValues";
import {inject, nextTick, onMounted, ref} from "vue";
import useEventsBus from "../events/eventBus";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import LoadingSpinner from "./LoadingSpinner";
import ComposerAPI from "../dal/ComposerAPI";

export default {
  name: "AdminPanel",
  components: {GlobalTrackValues, LoadingSpinner},
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)
    const showLoadingSpinner = ref(false)
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      saveBtn: store.state.staticUrl + 'icons/save-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }


    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    const downloadMix = () => {
      emit('downloadMix')
    }

    const saveProject = async () => {
      if (store.state.clipCount() < 1) {
        toast.warning('Project is empty. Please add clips before saving.')
        return
      }

      if (store.state.grid && store.state.grid.length > 0) {
        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(store.state)

        if (store.token) {
          showLoadingSpinner.value = true
          await new ComposerAPI().save(store.token, saveFormat)
          showLoadingSpinner.value = false

          toast.success('Project saved successfully.')
        }

        localStorage.setItem("sas-save", JSON.stringify(saveFormat));
      }
    }

    const logDebug = () => {
      let arpArray = []

      for (let i = 0; i < store.state.grid[0].value.length; i++) {
        arpArray.push(store.state.grid[0].value[i].arpeggio)
      }
    }

    return {
      downloadMix,
      imageAssets,
      isMobile,
      logDebug,
      saveProject,
      showLoadingSpinner
    }
  },
}
</script>

<style scoped>

</style>