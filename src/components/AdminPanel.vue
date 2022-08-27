<template>

  <div v-if="isMobile" class="flex w-full border-2 border-black rounded-lg p-2 my-2 nowrap overflow-hidden"
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
              class="border-2 border-black p-1 mr-1  rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
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

  <div v-if="!isMobile" class="w-1/6 h-48 border-2 border-black rounded-lg p-2 my-2 nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">
    <global-track-values></global-track-values>
    <div class="flex justify-between">
      <button @click="newProjectDialog()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.newProject" class="h-6"/>
      </button>
      <button @click="saveProject()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.saveBtn" class="h-6"/>
      </button>
      <button @click="downloadMix()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.downloadMP3" class="h-6"/>
      </button>
      <button @click="exportProject()"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.downloadBtn" class="h-6"/>
      </button>
    </div>
  </div>

  <project-board v-if="showProjectsBoard"></project-board>

  <loading-spinner :showLoadingProp="showLoadingSpinner"></loading-spinner>
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

export default {
  name: "AdminPanel",
  components: {ProjectBoard, GlobalTrackValues, LoadingSpinner},
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)
    const showLoadingSpinner = ref(false)
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

      showLoadingSpinner.value = true
      const res = await new ComposerAPI().exportComposition(store.token, store.state.projectId)
      showLoadingSpinner.value = false

      if (res) {
        window.location.href = res;
        toast.success('Export Complete!')
      } else {
        toast.error('Error exporting project')
      }
    }

    const createNewProject = async () => {
      const numOfGridRows = 5
      let numOfGridCols = 6
      let numOfSections = 2

      if (isMobile.value) {
        numOfGridCols = 2
        numOfSections = 1
      }

      store.state.projectId = undefined
      store.state.projectVersionId = undefined
      store.state.projectName = 'New Project'
      store.state.authorName = 'New Author'
      store.state.globalBpm = undefined
      store.state.globalKey = undefined
      store.state.grid = new GridGenerator().initGrid(numOfGridRows, numOfGridCols, numOfSections)

      emit('renderMix')
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
          const res = await new ComposerAPI().save(store.token, saveFormat)
          showLoadingSpinner.value = false

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

    const createNewProjectDialogModalId = 'newProjectWarning'
    const newProjectDialog = (projectId) => {
      const modalPayload = new ModalOpenPayload(
          createNewProjectDialogModalId,
          'Warning',
          'You are about to create a new project. This will erase all current data. Are you sure?',
          'Continue',
          'Cancel',
          false,
          projectId
      )

      emit('launchModal', modalPayload)
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === createNewProjectDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          createNewProject()
        }
      }
    })

    watch(() => bus.value.get('saveProjectToLocalStorage'), async () => {
      if (store.state.grid && store.state.grid.length > 0) {
        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(store.state)
        localStorage.setItem("sas-save", JSON.stringify(saveFormat));
      }
    })

    watch(() => bus.value.get('loadProjectFromLocalStorage'), async () => {
      if (localStorage.getItem("sas-save")) {
        const retrievedData = JSON.parse(localStorage.getItem("sas-save"))
        const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(retrievedData)
        store.state.projectId = retrievedRestoredData.projectId;
        store.state.projectVersionId = retrievedRestoredData.projectId;
        store.state.projectName = retrievedRestoredData.projectName;
        store.state.authorName = retrievedRestoredData.authorName;
        store.state.globalBpm = retrievedRestoredData.globalBpm;
        store.state.globalKey = retrievedRestoredData.globalKey;
        store.state.grid = retrievedRestoredData.grid;
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
      newProjectDialog,
      saveProject,
      showProjectsBoard,
      showLoadingSpinner,
      toggleProjectsBoard
    }
  },
}
</script>

<style scoped>

</style>