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
</template>

<script>
import GlobalTrackValues from "./GlobalTrackValues";
import {inject, watch, nextTick, onMounted, ref} from "vue";
import useEventsBus from "../events/eventBus";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import ModalOpenPayload from "./ModalOpenPayload";
import ComposerAPI from "../dal/ComposerAPI";

export default {
  name: "AdminPanel",
  components: {GlobalTrackValues},
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')
    const toast = inject('toast');
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      saveBtn: store.state.staticUrl + 'icons/save-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }
    const isMobile = ref(store.isMobile ? true : false)

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    const downloadMix = () => {
      emit('downloadMix')
    }

    const saveProject = async () => {
      console.log('STATE BEFORE SAVE FORMAT', store.state)

      if (store.state.clipCount() < 1) {
        toast.warning('Project is empty. Please add clips before saving.')
        return
      }

      if (store.state.grid && store.state.grid.length > 0) {
        //logged in or note
        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(store.state)
        console.log('SAVE_FORMAT', saveFormat)

        if (store.token) {
          const composerApi = new ComposerAPI()
          await composerApi.save(store.token, saveFormat)

          toast.success('Project saved successfully.')
        }

        localStorage.setItem("sas-save", JSON.stringify(saveFormat));
        //toast.info('Project saved in browser storage')
      }
    }

    const logDebug = () => {
      let arpArray = []

      for (let i = 0; i < store.state.grid[0].value.length; i++) {
        arpArray.push(store.state.grid[0].value[i].arpeggio)
      }
    }

    return {
      logDebug,
      downloadMix,
      saveProject,
      imageAssets,
      isMobile,
    }
  },
}
</script>

<style scoped>

</style>