<template>
  <div v-if="isMobile" class="flex w-full border-4 border-black rounded-lg p-2 my-2 nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>
    <div class="flex w-2/4 justify-between">
      <button @click="newProjectDialog()"
              class="border-2 border-black p-1 mr-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.newProject" class="w-8 h-6"/>
      </button>
      <button @click="saveProject()"
              class="border-2 border-black p-1 mr-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.saveBtn" class="w-8 h-6"/>
      </button>
      <button @click="downloadMix()"
              class="border-2 border-black p-1 mr-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.downloadMP3" class="w-8 h-6"/>
      </button>
      <button @click="toggleProjectsBoard()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="showProjectsBoard ? imageAssets.closeBtn : imageAssets.loadBtn"
          class="w-8 h-6"/>
      </button>
    </div>
  </div>

  <div v-if="!isMobile" class="flex w-4/12 h-32 p-2 border-2 border-black rounded-lg nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>

    <div class="flex flex-col 1/6 justify-evenly">

        <button @click="saveProject()"
                class="w-8 h-8 border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
          <img
              :src="imageAssets.saveBtn" class="h-5"/>
        </button>
        <button @click="downloadMix()"
                class="w-8 h-8 border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
          <img
              :src="imageAssets.downloadMP3" class="h-5"/>
        </button>
    </div>


  </div>

  <project-board v-if="showProjectsBoard"></project-board>
</template>

<script>
import GlobalTrackValues from "./GlobalTrackValues";
import {inject, nextTick, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import LoadingSpinner from "./LoadingSpinner";
import ComposerAPI from "../dal/ComposerAPI";
import ProjectBoard from "./ProjectBoard";
import GridGenerator from "../generators/grid-generator";
import ModalOpenPayload from "./ModalOpenPayload";
import Analytics from "../analytics/Analytics";
import store from "../store/store";

export default {
  name: "AdminPanel",
  components: {ProjectBoard, GlobalTrackValues, LoadingSpinner},
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)
    const imageAssets = {
      closeBtn: store.state.staticUrl + "icons/delete-x.png",
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      saveBtn: store.state.staticUrl + 'icons/save-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
      downloadMP3: store.state.staticUrl + 'icons/file-symbol-mp3.png',
      newProject: store.state.staticUrl + 'icons/new-icon.png',

    }
    const showProjectsBoard = ref(false)


    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    const downloadMix = () => {
      emit('downloadMix')
    }

    const exportProject = async () => {
      await saveProject()

      emit('showLoadingSpinner')
      const res = await new ComposerAPI().exportComposition(store.token, store.state.projectId)
      emit('hideLoadingSpinner')

      if (res) {
        window.location.href = res;
        toast.success('Export Complete!')
      } else {
        toast.error('Error exporting project')
      }


      new Analytics().trackExportPackage()
    }






    const saveProject = async () => {
      if (store.state.clipCount() < 1) {
        toast.warning('Project is empty. Please add clips before saving.')
        return
      }

      if (store.state.grid && store.state.grid.length > 0) {
        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(store.state)

        if (store.token) {
          emit('showLoadingSpinner')
          const res = await new ComposerAPI().save(store.token, saveFormat)
          emit('hideLoadingSpinner')

          if (res) {
            store.state.projectId = res['projectId']
            store.state.projectVersionId = res['projectVersionId']
            store.state.projectName = res['projectName']
            store.state.authorName = res['authorName']
            store.state.globalBpm = res['globalBpm']
            store.state.globalKey = res['globalKey']

            emit('refreshProjects', 0)
            emit('refreshLeaderBoard', 0)
            toast.success('Project saved successfully.')
          } else {
            if (store.token && store.token != 'None') {
              toast.error('Error saving project.')
            } else {
              toast.error('Please login to save project.')
            }
          }
        }

        emit('saveProjectToLocalStorage')

        new Analytics().trackSave()
      }
    }

    const toggleProjectsBoard = () => {
      showProjectsBoard.value = !showProjectsBoard.value
    }

    const logDebug = () => {
      let arpArray = []

      for (let i = 0; i < store.state.grid[0].value.length; i++) {
        arpArray.push(store.state.grid[0].value[i].arpeggio)
      }
    }

    const debugGrid = () => {
      console.log('GRID', store.state.grid)
    }

    const newProjectDialog = () => {
      emit('newProjectDialog')
    }

    watch(() => bus.value.get('saveProjectToLocalStorage'), async () => {
      if (store.state.grid && store.state.grid.length > 0) {
        const currentSaveData = JSON.parse(localStorage.getItem("sas-save"))
        if(currentSaveData){
          //SET THE CURRENT SAVED DATA TO BACKUP
          localStorage.setItem("sas-save-n-1", JSON.stringify(currentSaveData));
        }

        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(store.state)
        localStorage.setItem("sas-save", JSON.stringify(saveFormat));
      }
    })

    const loadSavedProject = (retrievedData) => {
      const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(retrievedData)
      store.state.projectId = retrievedRestoredData.projectId;
      store.state.projectVersionId = retrievedRestoredData.projectId;
      store.state.projectName = retrievedRestoredData.projectName;
      store.state.authorName = retrievedRestoredData.authorName;
      store.state.globalBpm = retrievedRestoredData.globalBpm;
      store.state.globalKey = retrievedRestoredData.globalKey;
      store.state.grid = retrievedRestoredData.grid;

      store.state.updateGlobalChords()

      emit('renderMixIfNeeded')
    }

    watch(() => bus.value.get('loadProjectBackupFromLocalStorage'), async () => {
      if (localStorage.getItem("sas-save-n-1")) {
        const retrievedData = JSON.parse(localStorage.getItem("sas-save-n-1"))
        loadSavedProject(retrievedData);

        emit('resetCompatibility')
      }
    })

    watch(() => bus.value.get('loadProjectFromLocalStorage'), async () => {
      if (localStorage.getItem("sas-save")) {
        const retrievedData = JSON.parse(localStorage.getItem("sas-save"))
        loadSavedProject(retrievedData);
        emit('resetCompatibility')
      }
    })

    watch(() => bus.value.get('closeProjectsBoard'), async () => {
      showProjectsBoard.value = false
    })

    return {
      downloadMix,
      exportProject,
      imageAssets,
      isMobile,
      logDebug,
      debugGrid,
      saveProject,
      newProjectDialog,
      showProjectsBoard,
      toggleProjectsBoard
    }
  },
}
</script>

<style scoped>

</style>