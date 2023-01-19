<template>
  <div v-if="!isMobile"
       class="flex w-7/12 h-32 mr-2 p-2 border-2 border-black rounded-lg justify-between font-bold nowrap overflow-hidden"
       style="background-color: rgba(255,255,255,0.9);">

    <div class="w-1/5 h-full flex justify-around items-center">
      <button @click="newProjectDialog()"
              class="h-16 w-16">
        <img
            :src="staticImages.refreshBtn" class="rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>

      <button @click="newProjectDialog()"
              class="h-6 w-6">
        <img v-if="lockGlobal"
             :src="staticImages.lockBtn" class="rounded-full p-0.5 bg-white ring-2 ring-black hover:ring-green-500"/>
        <img v-if="!lockGlobal"
             :src="staticImages.unlockBtn" class="rounded-full p-0.5 bg-white ring-2 ring-black hover:ring-green-500"/>
      </button>

      <div class="w-0.5 h-4/5 bg-gray-600 py-2"></div>
    </div>

    <div class="w-2/5 flex justify-around items-center">
      <div class="w-full h-full p-1 flex flex-col justify-center items-center">
        <div class="flex w-full h-8 justify-around items-center my-1">
          <img v-if="lockBpm"
               :src="staticImages.lockBtn" class="w-1/5 h-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <img v-if="!lockBpm"
               :src="staticImages.unlockBtn" class="w-1/5 h-5 w-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <div class="w-1/5 text-sm">BPM</div>
          <select v-model="store.state.globalBpm" class="w-3/5 text-xs rounded-lg bg-gray-100">
            <option :value="item" v-for="item in filterBpmOptions.arr">{{ item }}
            </option>
          </select>

        </div>

        <div class="flex w-full h-8 justify-around items-center my-1">
          <img v-if="lockKey"
               :src="staticImages.lockBtn" class="w-1/5 h-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <img v-if="!lockKey"
               :src="staticImages.unlockBtn" class="w-1/5 h-5 w-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <label class="w-1/5 text-sm">KEY</label>
          <select v-model="store.state.globalKey" id="key-filter" class="w-3/5 text-xs rounded-lg bg-gray-100">
            <option :value="item" v-for="item in filterKeyOptions.arr">{{ item }}
            </option>
          </select>
        </div>
      </div>
      <div class="w-0.5 h-4/5 bg-gray-600 py-2"></div>
    </div>

    <div class="w-2/5 flex flex-col justify-around items-center p-2">
      <div class="w-full h-full p-1 flex flex-col justify-center items-center">
        <div class="flex w-full h-8 justify-around items-center my-1">
          <img v-if="lockChord"
               :src="staticImages.lockBtn" class="w-1/5 h-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <img v-if="!lockChord"
               :src="staticImages.unlockBtn" class="w-1/5 h-5 w-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          <label class="w-1/5 my-2 text-sm">CHORDS</label>
          <div class="w-3/5 h-full"></div>
        </div>
        <div class="flex w-full h-8 justify-around items-center my-1">
          <select v-model="store.state.globalChords" id="chord-filter"
                  class="w-full text-xs rounded-lg bg-gray-100">
            <option :value="item" v-for="item in filterChordOptions.arr">{{ item }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <loading-spinner :showLoadingProp="showLoadingSpinner"></loading-spinner>

</template>
<script>

import {computed, inject, nextTick, onMounted, reactive, ref} from 'vue'
import {StemsAPI} from "../dal/StemsAPI";
import Asset from "./Asset.vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import store from "../store/store";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import AssetSelectionFilter from "../filters/AssetSelectionFilter";
import GridProcessor from "../processors/grid-processor";
import ModalOpenPayload from "./ModalOpenPayload";
import ComposerAPI from "../dal/ComposerAPI";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import Analytics from "../analytics/Analytics";
import GridGenerator from "../generators/grid-generator";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AssetSelector",
  components: {LoadingSpinner, Asset},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()

    const isMobile = ref(store.isMobile ? true : false)
    const filterBpm = ref()
    const filterBpmOptions = reactive({arr: [0]})
    const filterKeyOptions = reactive({arr: ['C']})
    const filterChordOptions = reactive({arr: []})
    const animateSelector = ref(false)

    const lockGlobal = ref(false)
    const lockBpm = ref(false)
    const lockKey = ref(false)
    const lockChord = ref(false)

    const pageIndex = ref(0)
    const numOfResultsMobile = 4
    const numOfResultsDesktop = 16
    let numOfResults = numOfResultsMobile //assume mobile then adjust for desktop

    let totalResults = 0
    let prevFilterBpm = 0;

    const showLoadingSpinner = ref(false)
    const staticImages = {
      pageLeftImgSrc: store.state.staticUrl + 'icons/shuffle-left.png',
      pageRightImgSrc: store.state.staticUrl + 'icons/shuffle-right.png',
      refreshBtn: store.state.staticUrl + 'icons/refresh-icon.png',
      lockBtn: store.state.staticUrl + 'icons/lock.png',
      unlockBtn: store.state.staticUrl + 'icons/unlock.png',
    }

    const pageNext = () => {
      if (pageIndex.value <= totalResults - numOfResults) {
        pageIndex.value = pageIndex.value + numOfResults
      }
    }

    const pagePrev = () => {
      if (pageIndex.value >= numOfResults) {
        pageIndex.value = pageIndex.value - numOfResults
      }
    }

    const stemSelections = reactive({
      arr: [],
    });

    const createEmptyProject = async () => {
      const numOfGridRows = 6
      let numOfGridCols = 6
      let numOfSections = 2

      if (isMobile.value) {
        numOfGridCols = 4
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
      emit('resetInnerGridContainer') //in the event that the grid is smaller than the previous project
      emit('disableAnimateSelector')
      emit('resetCompatibility')

      new Analytics().trackCreateEmpty()
    }

    const createRandomProject = async () => {
      await createEmptyProject() //THIS IS A HACK BE CLEAR THE GRID

      showLoadingSpinner.value = true
      const project = await new ComposerAPI().generateComposition()
      showLoadingSpinner.value = false

      emit('resetInnerGridContainer') //in the event that the grid is smaller than the previous project

      const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(project)

      console.log('retrievedRestoredData', retrievedRestoredData)

      store.state.projectId = retrievedRestoredData.projectId
      store.state.projectVersionId = retrievedRestoredData.projectVersionId
      store.state.projectName = retrievedRestoredData.projectName;
      store.state.authorName = retrievedRestoredData.authorName;
      store.state.globalBpm = retrievedRestoredData.globalBpm;
      store.state.globalKey = retrievedRestoredData.globalKey;
      store.state.grid = retrievedRestoredData.grid;
      store.state.updateGlobalChords()

      emit('renderMix')
      emit('closeProjectsBoard')
      emit('saveProjectToLocalStorage')
      emit('resetCompatibility')

      new Analytics().trackCreateRandom()
    }

    const createNewProjectWarningDialogModalId = 'newProjectWarning'
    const newProjectDialog = (projectId) => {
      const modalPayload = new ModalOpenPayload(
          createNewProjectWarningDialogModalId,
          'Empty or Random',
          'Would you like an empty or random project? WARNING: Either option will erase all current data.',
          'Empty',
          'Random',
          'Cancel',
          false,
          projectId
      )

      emit('launchModal', modalPayload)
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === createNewProjectWarningDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          const projectType = modalResponsePayload[0].getRelayData().toLowerCase()
          if (projectType === 'empty') {
            createEmptyProject()
          } else if (projectType === 'random') {
            createRandomProject()
            // createEmptyProject()
          } else {
            toast.error('Error creating new project')
          }
        }
      }
    })


    watch(() => bus.value.get('disableAnimateSelector'), () => {
      animateSelector.value = false
      new GridProcessor(store.state.grid).clearAcceptMobileTransfer()
    })

    watch(() => bus.value.get('updateAssetSelection'), (assetFilter) => {

      if (store.state.globalBpm) {
        filterBpm.value = store.state.globalBpm
      } else {
        filterBpm.value = 0
      }

      if (new GridProcessor(store.state.grid).isAcceptingMobileTransfers()) {
        animateSelector.value = true
      }
    })

    onMounted(async () => {
          const stemsApi = new StemsAPI()
          let stems = await stemsApi.getStemsAndOptions()

          stems.stems.forEach((stem) => {
            stem['waveform'] = stem['waveform'] ? stem['waveform'] : stem['source'].replace('.mp3', '.png')
            stem['showPreviewIcon'] = false
            stem['previewPlayIconPath'] = store.state.staticUrl + 'icons/play-button.png'
            stem['previewPlayIconPath'] = store.state.staticUrl + 'icons/play-button.png'
            stem['previewStopIconPath'] = store.state.staticUrl + 'icons/stop-button.png'
            stemSelections.arr.push(stem)
          })

          stems.options.bpms.forEach(bpm => {
            filterBpmOptions.arr.push(Math.round(bpm))
          })

          stems.options.keys.forEach(t => {
            filterKeyOptions.arr.push(t)
          })

          stems.options.chords.forEach(t => {
            filterChordOptions.arr.push(t)
          })

          await nextTick(() => {
            isMobile.value = store.isMobile ? true : false
            numOfResults = isMobile.value ? numOfResultsMobile : numOfResultsDesktop

            let updateParam = {
              filterKey: 'all',
              clipType: ROW_TO_TYPE_MAP[0],
              chords: 'all',
              row: 0,
              col: 0,
            }
            emit('updateAssetSelection', updateParam)
          })
        }
    )

    return {
      animateSelector,
      isMobile,
      filterBpmOptions,
      filterKeyOptions,
      filterChordOptions,
      lockGlobal,
      lockBpm,
      lockKey,
      lockChord,
      newProjectDialog,
      pageNext,
      pagePrev,
      showLoadingSpinner,
      staticImages,
      stemSelections,
      store,
    }
  },
}
</script>

<style scoped>
.init-pulse {
  animation: border-pulsate 2s infinite;
}

@keyframes border-pulsate {
  0% {
    border-color: rgba(34, 197, 94, 1);
  }
  50% {
    border-color: rgba(34, 197, 94, 0);
  }
  100% {
    border-color: rgba(34, 197, 94, 1);
  }
}
</style>