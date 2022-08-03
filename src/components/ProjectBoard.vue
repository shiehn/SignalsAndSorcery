<template>
  <div class="w-1/3 border-2 ml-4 border-white rounded-lg p-2">
    <h4 class="text-white p-2">Yours</h4>

    <div v-for="project in savedProjects" class="flex justify-between w-full border-2 border-gray-500 rounded-lg mb-2">
      <div class="text-white m-auto">{{ project.projectName }}</div>
      <button @click="openProjectDialog(project.id)"
              class="border-2 border-black p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500"><img
          :src="imageAssets.loadBtn" class="h-6 "/>
      </button>
    </div>
  </div>
</template>

<script>
import {inject, onMounted, ref, watch} from "vue";
import ComposerAPI from "../dal/ComposerAPI";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import ModalOpenPayload from "./ModalOpenPayload";
import useEventsBus from "../events/eventBus";

export default {
  name: "ProjectBoard",
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')
    const isMobile = ref(store.isMobile ? true : false)
    const savedProjects = ref([])
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    onMounted(() => {

      setTimeout(async () => {
        isMobile.value = store.isMobile ? true : false

        if (store.token) {
          const projects = await new ComposerAPI().getSavedCompositions(store.token)

          projects.forEach((project) => {
            savedProjects.value.push(project)
          })

          console.log('LOADED PROJECTS', projects)
        }
      }, 1000)
    });

    const loadProject = async (projectId) => {
      const projects = await new ComposerAPI().getSavedCompositions(store.token)

      let project = projects.find(p => p.id === projectId)

      const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(project)
      store.state.projectName = retrievedRestoredData.projectName;
      store.state.authorName = retrievedRestoredData.authorName;
      store.state.globalBpm = retrievedRestoredData.globalBpm;
      store.state.globalKey = retrievedRestoredData.globalKey;
      store.state.grid = retrievedRestoredData.grid;

      /*
            //   const retrievedData = JSON.parse(localStorage.getItem("sas-save"))
      //   const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(retrievedData)
      //
      //   store.state.projectName = retrievedRestoredData.projectName;
      //   store.state.authorName = retrievedRestoredData.authorName;
      //   store.state.globalBpm = retrievedRestoredData.globalBpm;
      //   store.state.globalKey = retrievedRestoredData.globalKey;
      //   store.state.grid = retrievedRestoredData.grid;
       */
    }

    const openProjectDialogModalId = 'openProjectWarning'
    const openProjectDialog = (projectId) => {
      const modalPayload = new ModalOpenPayload(
          openProjectDialogModalId,
          'Warning',
          'You are about to open a project. This will erase all current data. Are you sure?',
          'Continue',
          'Cancel',
          false,
          projectId
      )

      emit('launchModal', modalPayload)
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === openProjectDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          loadProject(modalResponsePayload[0].getRelayData())
        }
      }
    })

    return {
      imageAssets,
      isMobile,
      loadProject,
      openProjectDialog,
      savedProjects
    }
  }
}
</script>

<style scoped>

</style>