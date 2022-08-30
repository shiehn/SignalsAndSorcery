<template>
  <div v-if="isMobile" class="w-full border-2 border-white rounded-lg p-2">
    <div class="flex justify-between">
      <h4 class="text-white m-4">Your Projects</h4>
      <div class="flex text-white mr-4">
        <button v-if="hasPrevPage" @click="pageResults('prev')" class="mr-2"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pagePrev"/></button>
        <button v-else class="mr-2 opacity-50"><img class="h-6 w-6" :src="imageAssets.pagePrev"/></button>
        <button v-if="hasNextPage" @click="pageResults('next')" class="mr-4"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pageNext"/></button>
        <button v-else class="mr-4"><img class="h-6 w-6 opacity-50" :src="imageAssets.pageNext"/></button>
      </div>
    </div>

    <div v-if="!isLoggedIn" class="w-full h-full text-center center mx-auto my-24">
      <a href="/accounts/login/" class="text-gray-400 text-sm">Login to see projects</a>
    </div>

    <div v-if="isLoggedIn" v-for="project in savedProjects"
         class="flex justify-between w-full border-b-2 border-gray-700 p-2 mb-2">
      <div class="text-white my-auto">{{ project.projectName }}</div>
      <div>
        <button @click="openDeleteProjectDialog(project.projectId)"
                class="border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500 mr-2">
          <img :src="imageAssets.deleteBtn" class="h-6 h-6 m-auto"/></button>
        <button @click="openProjectDialog(project.projectId)"
                class="border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
          <img
              :src="imageAssets.loadBtn" class="h-6 h-6 m-auto"/>
        </button>
      </div>
    </div>
  </div>

  <div v-if="!isMobile" class="w-full border-2 ml-4 border-white rounded-lg p-2"
       :class="{ 'w-full': isMobile, 'w-1/3': !isMobile }">
    <div class="flex justify-between">
      <h4 class="text-white m-4">Your Projects</h4>
      <div class="flex text-white mr-4">
        <button v-if="hasPrevPage" @click="pageResults('prev')" class="mr-2"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pagePrev"/></button>
        <button v-else class="mr-2 opacity-50"><img class="h-6 w-6" :src="imageAssets.pagePrev"/></button>
        <button v-if="hasNextPage" @click="pageResults('next')" class="mr-4"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pageNext"/></button>
        <button v-else class="mr-4"><img class="h-6 w-6 opacity-50" :src="imageAssets.pageNext"/></button>
      </div>
    </div>

    <div v-if="!isLoggedIn" class="w-full h-full text-center center mx-auto my-24">
      <a href="/accounts/login/" class="text-gray-400 text-sm">Login to see projects</a>
    </div>

    <div v-if="isLoggedIn" v-for="project in savedProjects"
         class="flex justify-between w-full border-b-2 border-gray-700 p-2 mb-2">
      <div class="text-white my-auto">{{ project.projectName }}</div>
      <div>
        <button @click="openDeleteProjectDialog(project.projectId)"
                class="border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500 mr-2">
          <img :src="imageAssets.deleteBtn" class="h-6 h-6 m-auto"/></button>
        <button @click="openProjectDialog(project.projectId)"
                class="border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
          <img
              :src="imageAssets.loadBtn" class="h-6 h-6 m-auto"/>
        </button>
      </div>
    </div>
  </div>

  <loading-spinner :showLoadingProp="showLoadingSpinner"></loading-spinner>
</template>

<script>
import {inject, onMounted, ref, watch} from "vue";
import ComposerAPI from "../dal/ComposerAPI";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import ModalOpenPayload from "./ModalOpenPayload";
import useEventsBus from "../events/eventBus";
import LoadingSpinner from "./LoadingSpinner";

export default {
  name: "ProjectBoard",
  components: {LoadingSpinner},
  setup() {
    const {bus, emit} = useEventsBus()
    const store = inject('store')

    const hasNextPage = ref(false)
    const hasPrevPage = ref(false)
    const isMobile = ref(store.isMobile ? true : false)
    const isLoggedIn = ref(undefined)
    const savedProjects = ref([])
    const showLoadingSpinner = ref(false)

    let currentPage = 0
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
      pagePrev: store.state.staticUrl + 'icons/shuffle-left-white.png',
      pageNext: store.state.staticUrl + 'icons/shuffle-right-white.png',
      deleteBtn: store.state.staticUrl + 'icons/bin.png',
    }

    onMounted(() => {
      setTimeout(async () => {
        if (store.token && store.token != 'None') {
          isLoggedIn.value = true
        } else {
          isLoggedIn.value = false
        }

        isMobile.value = store.isMobile ? true : false

        if (isLoggedIn.value) {
          emit('refreshProjects', currentPage)
        }
      }, 1000)
    });

    const deleteProject = async (projectId) => {
      showLoadingSpinner.value = true
      const res = await new ComposerAPI().deleteComposition(store.token, projectId)
      showLoadingSpinner.value = false

      emit('stopAllAudio')
      emit('refreshProjects', currentPage)
    }

    const loadProject = async (projectId) => {
      showLoadingSpinner.value = true
      const project = await new ComposerAPI().getSavedComposition(store.token, projectId)
      showLoadingSpinner.value = false

      const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(project)

      store.state.projectId = retrievedRestoredData.projectId
      store.state.projectVersionId = retrievedRestoredData.projectVersionId
      store.state.projectName = retrievedRestoredData.projectName;
      store.state.authorName = retrievedRestoredData.authorName;
      store.state.globalBpm = retrievedRestoredData.globalBpm;
      store.state.globalKey = retrievedRestoredData.globalKey;
      store.state.grid = retrievedRestoredData.grid;

      console.log('retrievedRestoredData.grid', retrievedRestoredData.grid)

      emit('renderMix')
      emit('closeProjectsBoard')
      emit('saveProjectToLocalStorage')
    }

    const openDeleteProjectDialogModalId = 'openDeleteProjectWarning'
    const openDeleteProjectDialog = (projectId) => {
      const modalPayload = new ModalOpenPayload(
          openDeleteProjectDialogModalId,
          'Warning',
          'You are about to permanently delete a project. Are you sure?',
          'Continue',
          'Cancel',
          false,
          projectId
      )

      emit('launchModal', modalPayload)
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

    const pageResults = (direction) => {
      if (direction === 'next') {
        currentPage = currentPage + 1
        emit('refreshProjects', currentPage)
      } else if (direction === 'prev') {
        currentPage = currentPage - 1
        emit('refreshProjects', currentPage)
      } else {
        console.log('ERROR: unexpected paging direction')
      }
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === openProjectDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          loadProject(modalResponsePayload[0].getRelayData())
        }
      }

      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === openDeleteProjectDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          deleteProject(modalResponsePayload[0].getRelayData())
        }
      }
    })

    watch(() => bus.value.get('refreshProjects'), async (page) => {
      if (!page[0]) {
        page[0] = 0
      }

      showLoadingSpinner.value = true
      const response = await new ComposerAPI().getSavedCompositions(store.token, page[0])
      showLoadingSpinner.value = false

      savedProjects.value = []
      if (response['compositions']) {
        response['compositions'].forEach((project) => {
          savedProjects.value.push(project)
        })
      }

      currentPage = response['pagination']['page']
      hasNextPage.value = response['pagination']['has_next']
      hasPrevPage.value = response['pagination']['has_prev']
    })

    return {
      hasPrevPage,
      hasNextPage,
      isLoggedIn,
      imageAssets,
      isMobile,
      openDeleteProjectDialog,
      openProjectDialog,
      pageResults,
      savedProjects,
      showLoadingSpinner
    }
  }
}
</script>

