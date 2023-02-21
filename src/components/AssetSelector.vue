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

      <button @click="unlockAll()"
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
          <div class="w-1/6 flex justify-center items-center">
            <img v-if="lockBpm"
                 :src="staticImages.lockBtn" @click.stop="toggleBpmLock"
                 class="w-5 h-5 p-0.5 rounded-full ring-2 ring-red-500"/>
            <img v-if="!lockBpm"
                 :src="staticImages.unlockBtn" @click.stop="toggleBpmLock"
                 class="w-5 h-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          </div>
          <div class="w-1/6 text-sm">BPM</div>
          <select v-model="store.state.globalBpm" @input="onBpmInput"
                  class="py-1 px-2 mr-4 w-4/6 text-black text-m font-bold rounded-lg bg-gray-100">
            <option :value="item" v-for="item in filterBpmOptions.arr">{{ item }}
            </option>
          </select>

        </div>

        <div class="flex w-full h-8 justify-around items-center my-1">
          <div class="w-1/6 flex justify-center items-center">
            <img v-if="lockKey"
                 :src="staticImages.lockBtn" @click.stop="toggleKeyLock"
                 class="w-5 h-5 p-0.5 rounded-full ring-2 ring-red-500"/>
            <img v-if="!lockKey"
                 :src="staticImages.unlockBtn" @click.stop="toggleKeyLock"
                 class="w-5 h-5 p-0.5 rounded-full hover:ring-2 hover:ring-green-500"/>
          </div>
          <label class="w-1/6 text-sm">KEY</label>
          <select v-model="store.state.globalKey" @input="onKeyInput"
                  class="w-4/6 py-1 px-2 mr-4 text-black text-m font-bold rounded-lg bg-gray-100">
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
          <label class="w-1/5 my-2 text-sm">CHORDS</label>
          <div class="w-3/5 h-full"></div>
        </div>
        <div class="flex w-full h-8 justify-around items-center my-1">
          <select v-model="store.state.globalChords" id="chord-filter"
                  class="w-full py-1 px-2 text-black text-m font-bold rounded-lg bg-gray-100" disabled>
            <option :value="item" v-for="item in filterChordOptions.arr">{{ item }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

</template>
<script>

import {computed, inject, nextTick, onMounted, reactive, ref} from 'vue'
import {StemsAPI} from "../dal/StemsAPI";
import Asset from "./Asset.vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import store from "../store/store";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import GridProcessor from "../processors/grid-processor";
import ModalOpenPayload from "./ModalOpenPayload";
import ComposerAPI from "../dal/ComposerAPI";
import SaveAndLoadAdapter from "../persistence/save-load-adapter";
import Analytics from "../analytics/Analytics";
import GridGenerator from "../generators/grid-generator";
import LoadingSpinner from "./LoadingSpinner.vue";
import LockProcessor from "../processors/lock-processor";

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

    const pageIndex = ref(0)
    const numOfResultsMobile = 4
    const numOfResultsDesktop = 16
    let numOfResults = numOfResultsMobile //assume mobile then adjust for desktop

    let totalResults = 0
    let prevFilterBpm = 0;

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
      let numOfGridCols = 4
      let numOfSections = 1

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

      let bpm = lockBpm.value ?  store.state.globalBpm : undefined
      let key = lockKey.value ?  store.state.globalKey : undefined

      await createEmptyProject() //THIS IS A HACK BE CLEAR THE GRID

      emit('showLoadingSpinner')
      const project = await new ComposerAPI().generateComposition(bpm, key)
      emit('hideLoadingSpinner')

      emit('resetInnerGridContainer') //in the event that the grid is smaller than the previous project

      const retrievedRestoredData = new SaveAndLoadAdapter().loadFromSaveFormat(project)
 
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

    const unlockAll = () => {
      lockKey.value = false
      lockBpm.value = false

      new LockProcessor(store.state.grid).unlockAll()
      emit('updateAssetLocks')
      emit('updateColumnLocks')
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

    const bpmChangeWarningDialogModalId = 'bpmChangeWarningDialogModalId'
    const bpmChangeDialog = (prevBpm) => {
      const modalPayload = new ModalOpenPayload(
          bpmChangeWarningDialogModalId,
          'Force Refresh?',
          'WARNING: Changing the BPM will force a full refresh!',
          'Ok',
          '',
          'Cancel',
          false,
          prevBpm,
      )

      emit('launchModal', modalPayload)
    }


    const keyChangeWarningDialogModalId = 'keyChangeWarningDialogModalId'
    const keyChangeDialog = (prevKey) => {
      const modalPayload = new ModalOpenPayload(
          keyChangeWarningDialogModalId,
          'Force Refresh?',
          'WARNING: Changing the KEY will force a full refresh!',
          'Ok',
          '',
          'Cancel',
          false,
          prevKey,
      )

      emit('launchModal', modalPayload)
    }

    const onBpmInput = (e) => {
      if (lockBpm.value) {
        e.target.value = store.state.getGlobalBpm()
      } else {
        let prevBpm = JSON.parse(JSON.stringify(store.state.getGlobalBpm()))
        store.state.globalBpm = JSON.parse(JSON.stringify(e.target.value))
        bpmChangeDialog(prevBpm)
      }
    }

    const onKeyInput = (e) => {
      if (lockKey.value) {
        e.target.value = store.state.getGlobalKey()
      } else {
        let prevKey = JSON.parse(JSON.stringify(store.state.getGlobalKey()))
        store.state.globalKey = JSON.parse(JSON.stringify(e.target.value))
        keyChangeDialog(prevKey)
      }
    }

    const toggleKeyLock = () => {
      lockKey.value = !lockKey.value
    }
    const toggleBpmLock = () => {
      lockBpm.value = !lockBpm.value
    }

    watch(() => bus.value.get('newProjectDialog'), () => {
      newProjectDialog()
    })

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === createNewProjectWarningDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          const projectType = modalResponsePayload[0].getRelayData().toLowerCase()
          if (projectType === 'empty') {
            createEmptyProject()
          } else if (projectType === 'random') {
            createRandomProject()
          } else {
            toast.error('Error creating new project')
          }
        }
      }

      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === bpmChangeWarningDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          lockBpm.value = true
          createRandomProject()
        } else {
          store.state.globalBpm = modalResponsePayload[0].getRelayData()
        }
      }

      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === keyChangeWarningDialogModalId) {
        if (modalResponsePayload[0].getResponse()) {
          lockKey.value = true
          createRandomProject()
        } else {
          store.state.globalKey = modalResponsePayload[0].getRelayData()
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
      newProjectDialog,
      onBpmInput,
      onKeyInput,
      pageNext,
      pagePrev,
      staticImages,
      stemSelections,
      store,
      toggleBpmLock,
      toggleKeyLock,
      unlockAll,
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