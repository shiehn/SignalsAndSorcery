<template>
  <div v-if="!isMobile"
      class="flex flex-col w-1/3 h-48 border-2 border-black rounded-lg justify-between font-bold p-2 m-2 nowrap overflow-hidden"
      style="background-color: rgba(255,255,255,0.9);">



    <div class="w-1/2">
      <button @click="newProjectDialog()"
              class="h-16 w-16">
        <img
            :src="staticImages.refreshBtn" class="rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>

      <button @click="newProjectDialog()"
              class="h-6 w-6">
        <img
            :src="staticImages.unlockBtn" class="rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>
    </div>





    <div class="flex w-full h-8 justify-between my-1">
      <label for="bpm-filter" class="w-1/3 my-2 text-sm">BPM</label>
      <select v-if="filterBpm != undefined" v-model="filterBpm" id="bpm-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterBpmOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="type-filter" class="w-1/3 my-2 text-sm">TYPE</label>
      <select v-if="filterType != undefined" v-model="filterType" id="type-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterTypeOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="key-filter" class="w-1/3 my-2 text-sm">KEY</label>
      <select v-if="filterKey != undefined" v-model="filterKey" id="key-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterKeyOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="chord-filter" class="w-1/3 my-2 text-sm">CHORD</label>
      <select v-if="filterChord != undefined" v-model="filterChord" id="chord-filter"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterChordOptions.arr">{{ item }}
        </option>
      </select>
    </div>
  </div>

<!--  <div v-if="!isMobile" class="flex w-4/6 h-48 justify-center border-2 border-black my-2 pt-4 rounded-lg"-->
<!--       style="background-color: rgba(255,255,255,0.9);">-->
<!--    <div-->
<!--        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer text-4xl opacity-25 hover:opacity-75"-->
<!--        @click="pagePrev">-->
<!--      <img :src="staticImages.pageLeftImgSrc" class="w-8 h-8">-->
<!--    </div>-->

<!--    <ul class="grid grid-cols-8 gap-2">-->
<!--      <asset v-for="stem in getFilteredStems" :stem=stem></asset>-->
<!--    </ul>-->
<!--    <div-->
<!--        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer text-4xl opacity-25 hover:opacity-75"-->
<!--        @click="pageNext">-->
<!--      <img :src="staticImages.pageRightImgSrc" class="w-8 h-8">-->
<!--    </div>-->
<!--  </div>-->

<!--  <div v-if="isMobile" class="flex w-full justify-center border-4 border-black my-2 py-4 rounded-lg"-->
<!--       :class="{-->
<!--        'border-4': animateSelector,-->
<!--        'init-pulse': animateSelector,-->
<!--        'border-pulsate': animateSelector,-->
<!--        }"-->
<!--       style="background-color: rgba(255,255,255,0.9);">-->
<!--    <div-->
<!--        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer opacity-25 hover:opacity-75"-->
<!--        @click="pagePrev">-->
<!--      <img :src="staticImages.pageLeftImgSrc" class="object-scale-down">-->
<!--    </div>-->

<!--    <ul class="grid grid-cols-4 gap-2">-->
<!--      <asset v-for="stem in getFilteredStems" :stem=stem></asset>-->
<!--    </ul>-->

<!--    <div-->
<!--        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer opacity-25 hover:opacity-75"-->
<!--        @click="pageNext">-->
<!--      <img :src="staticImages.pageRightImgSrc" class="object-scale-down">-->
<!--    </div>-->
<!--  </div>-->


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
    const filterType = ref()
    const filterTypeOptions = reactive({arr: ['all']})
    const filterKey = ref()
    const filterKeyOptions = reactive({arr: ['all']})
    const filterChord = ref()
    const filterChordOptions = reactive({arr: ['all']})
    const animateSelector = ref(false)
    const pageIndex = ref(0)
    const numOfResultsMobile = 4
    const numOfResultsDesktop = 16
    let numOfResults = numOfResultsMobile //assume mobile then adjust for desktop

    let totalResults = 0
    let prevFilterBpm = 0;
    let prevFilterType = 0;

    const showLoadingSpinner = ref(false)
    const staticImages = {
      pageLeftImgSrc: store.state.staticUrl + 'icons/shuffle-left.png',
      pageRightImgSrc: store.state.staticUrl + 'icons/shuffle-right.png',
      refreshBtn: store.state.staticUrl + 'icons/refresh-icon.png',
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

    const getFilteredStems = computed(() => {

      if (filterBpm.value != prevFilterBpm || filterType.value != prevFilterType) {
        prevFilterBpm = filterBpm.value;
        prevFilterType = filterType.value;
        pageIndex.value = 0
      }

      const filteredStems = new AssetSelectionFilter(stemSelections.arr, filterBpm.value, filterType.value, filterKey.value, filterChord.value).filter()

      if(isMobile.value){
        filteredStems.forEach(stem => {
          stem['host'] = 'selector'
        })
      }

      totalResults = filteredStems.length

      const pagedResults = filteredStems.slice(pageIndex.value, pageIndex.value + numOfResults)

      return pagedResults
    })

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

      /*
      For now, we are not going to filter by key.  But this might need to change when melodies are introduced.
       */

      // if (store.state.globalKey) {
      //   filterKey.value = store.state.globalKey.toLowerCase()
      // } else {
        filterKey.value = 'all'
      // }

      if (store.state.globalBpm) {
        filterBpm.value = store.state.globalBpm
      } else {
        filterBpm.value = 0
      }

      if (assetFilter[0].filterKey) {
        //IN THIS CASE WE EXPLICITLY OVERRIDE THE GLOBAL KEY
        filterKey.value = assetFilter[0].filterKey
      }

      if (!assetFilter[0]) {
        filterType.value = 'all'
        return
      }

      if (assetFilter[0].clipType) {
        filterType.value = assetFilter[0].clipType
      }

      if (assetFilter[0].chords) {
        filterChord.value = assetFilter[0].chords //TODO DO NOT LOWERCASE
      }

      if(new GridProcessor(store.state.grid).isAcceptingMobileTransfers()){
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
          filterBpm.value = 0

          stems.options.types.forEach(t => {
            if (ROW_TO_TYPE_MAP.includes(t)) {
              filterTypeOptions.arr.push(t)
            }
          })
          filterType.value = 'all'

          stems.options.keys.forEach(t => {
            filterKeyOptions.arr.push(t)
          })
          filterKey.value = 'all'

          stems.options.chords.forEach(t => {
            filterChordOptions.arr.push(t)
          })
          filterChord.value = 'all'

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
      filterBpm,
      filterBpmOptions,
      filterType,
      filterTypeOptions,
      filterKey,
      filterKeyOptions,
      filterChord,
      filterChordOptions,
      getFilteredStems,
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
  0%   { border-color: rgba(34, 197, 94, 1); }
  50% { border-color: rgba(34, 197, 94, 0); }
  100%   { border-color: rgba(34, 197, 94, 1); }
}
</style>