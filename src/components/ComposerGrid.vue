<template xmlns="http://www.w3.org/1999/html">
  <div v-if="isMobile" ref="gridContainer"
       class="w-full rounded-lg overflow-x-scroll">

    <div ref="gridInnerContainer" class="w-full"
         :style="playHeadCSS">
      <div v-for="(gridRow, i) in getGridRows()" :key="i" :ref="(el) => (gridContainerRows[i] = el)"
           class="flex flex-none justify-between">

        <div v-for="gridRowItem in gridRow.value"
             class="overflow-auto mr-1 mb-2 w-32 h-16 flex-none overflow-hidden relative rounded-lg shadow-lg bg-white opacity-40 border-4 border-gray-500 hover:cursor-pointer"
             :class="{
              'init-pulse': gridRowItem.acceptMobileTransfer,
              'border-pulsate': gridRowItem.acceptMobileTransfer,
              'opacity-95': gridRowItem.acceptMobileTransfer,
              'border-4': gridRowItem.acceptMobileTransfer,
              'opacity-100': gridRowItem.stem,
              'bg-green-100': gridRowItem.compatibility === 2,
              'bg-yellow-100': gridRowItem.compatibility === 1,
              'bg-red-100': gridRowItem.compatibility === 0
        }"
             v-on:mouseover="mouseOverGridItem(gridRowItem.row, gridRowItem.col)"
             v-on:mouseleave="mouseLeaveGridItem(gridRowItem.row, gridRowItem.col)"
             @click.stop="handleGridItemClick(gridRowItem.row, gridRowItem.col)">
          <asset v-if="gridRowItem.stem" :stem="gridRowItem.stem"></asset>
          <img v-if="gridRowItem.showDeleteIcon" :src="imageUrls.deleteIconPath"
               @click.stop="removeGridItem(gridRowItem.row, gridRowItem.col)"
               class="w-8 h-8 absolute top-0 right-0 bg-white ml-1 mt-1 rounded-md">
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isMobile" ref="gridContainer" class="rounded-lg w-11/12"
       :style="playHeadCSS">

    <div v-for="(gridRow, i) in getGridRows()" :key="i" :ref="(el) => (gridContainerRows[i] = el)"
         class="flex flex-none justify-between mb-2">
      <div v-for="gridRowItem in gridRow.value" class="w-1/4 h-16 pr-2">
        <div
            class="w-full h-full overflow-hidden relative rounded-lg shadow-lg opacity-40 hover:bg-gray-500"
            :class="{
            'opacity-100': gridRowItem.stem,
            'bg-green-100': gridRowItem.compatibility === 2,
            'bg-yellow-100': gridRowItem.compatibility === 1,
            'bg-red-100': gridRowItem.compatibility === 0
        }"
            @drop="onDrop($event, gridRowItem.row, gridRowItem.col)"
            @dragover.prevent
            @dragenter.prevent
            v-on:mouseover="mouseOverGridItem(gridRowItem.row, gridRowItem.col)"
            v-on:mouseleave="mouseLeaveGridItem(gridRowItem.row, gridRowItem.col)"
            @click.stop="handleGridItemClick(gridRowItem.row, gridRowItem.col)">

          <asset v-if="gridRowItem.stem" :stem="gridRowItem.stem" :locked="gridRowItem.locked" :row="gridRowItem.row" :col="gridRowItem.col"
                 :grid=true></asset>
          <div class="w-1/3 h-full absolute left-1/3 flex justify-center items-center">
            <img :src="imageUrls.refreshIconPath"
                 @click.stop="refreshGridItem(gridRowItem)"
                 :class="[gridRowItem.refreshing ? 'animate-spin' : '']"
                 class="w-10 h-10 aspect-square bg-white border-2 border-black rounded-full hover:cursor-pointer">
          </div>

        </div>
      </div>
    </div>


    <composer-controls-loop-bar></composer-controls-loop-bar>
    <composer-controls-scroll-bar></composer-controls-scroll-bar>
    <div class="w-full h-10 flex flex-none justify-between text-white">
      <div
          class="w-1/4 h-full flex justify-center items-center mr-2 rounded-b-lg border-b-2 border-white rounded-lg hover:cursor-pointer"
          @click="showAltInfo()">alt 1
      </div>
      <div
          class="w-1/4 h-full flex justify-center items-center mr-2 rounded-b-lg border-b-2 border-white rounded-lg hover:cursor-pointer"
          @click="showAltInfo()">alt 2
      </div>
      <div
          class="w-1/4 h-full flex justify-center items-center mr-2 rounded-b-lg border-b-2 border-white rounded-lg hover:cursor-pointer"
          @click="showAltInfo()">alt 3
      </div>
      <div
          class="w-1/4 h-full flex justify-center items-center rounded-b-lg border-b-2 border-white rounded-lg hover:cursor-pointer"
          @click="showAltInfo()">alt 4
      </div>
    </div>
  </div>
</template>

<script>
import {ref, inject, watch, onMounted, nextTick, reactive} from 'vue'
import useEventsBus from "../events/eventBus";
import Asset from "./Asset";
import GridGenerator from "../generators/grid-generator";
import CompatibilityProcessor from "../processors/compatibility-processor";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";
import GridProcessor from "../processors/grid-processor";
import ModalOpenPayload from "./ModalOpenPayload";
import ComposerControlsLoopBar from "./ComposerControlsLoopBar";
import {v4} from "uuid";
import store from "../store/store";
import Analytics from "../analytics/Analytics";
import ComposerAPI from "../dal/ComposerAPI";

export default {
  name: 'ComposerGrid',
  components: {Asset, ComposerControlsLoopBar, ComposerControlsScrollBar},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const gridContainerRows = ref([]);
    const gridContainer = ref(null);
    const gridInnerContainer = ref(null);
    const imageUrls = {
      staticUrl: store.state.staticUrl,
      editIcon: store.state.staticUrl + 'icons/edit.png',
      plusIcon: store.state.staticUrl + "icons/plus.png",
      minusIcon: store.state.staticUrl + "icons/minus.png",
      // deleteIconPath: store.state.staticUrl + 'icons/delete-x.png',
      // downloadIconPath: store.state.staticUrl + 'icons/download-icon.svg',
      refreshIconPath: store.state.staticUrl + 'icons/refresh-icon.png',
    }
    const isMobile = ref(store.isMobile ? true : false)

    const numOfGridRows = 6
    let numOfGridCols = 6
    let numOfSections = 2

    store.state.grid = new GridGenerator().initGrid(numOfGridRows, numOfGridCols, numOfSections)

    const getGridRows = () => {
      return store.state.grid
    }

    const getGridByRow = (row) => {
      return store.state.grid[row].value.filter((grid) => grid.row === row)
    }

    const onDrop = (evt, row, col) => {
      if (store.state.grid[row].value[col].compatibility === 0 || store.state.grid[row].value[col].compatibility === -1) {
        //NOT COMPATIBLE/PREVENT DROP
        //alert('NOT COMPATIBLE')
        return
      }

      const stemStr = evt.dataTransfer.getData('stem')
      const stem = JSON.parse(stemStr)
      stem.instanceId = v4() //each stem should have a unique instanceId but possible the same stem id

      //update the stems row and col
      // stem.row = row
      // stem.col = col

      console.log('on drop: ', row, col)

      const gridItem = store.state.grid[row].value[col]
      gridItem.stem = stem
      // gridItem['deleteIconPath'] = 'icons/delete-x.png'
      gridItem['previewPlayIconPath'] = imageUrls.staticUrl + 'icons/play-button.png'

      store.state.updateGlobalBpm()
      store.state.updateGlobalKey()

      emit('updateAssetSelection', {
        row: row,
        col: col,
      })
      emit('renderMixIfNeeded')

      //NOT SURE IF THIS NEEDS TO HAPPEN ON EVERY DROP
      emit('saveProjectToLocalStorage')
    }

    const removeGridItem = (row, col) => {

      const gridItem = store.state.grid[row].value[col]

      gridItem.sectionId = undefined
      gridItem.stem = undefined //TODO IF YOU HAVE THE STEM WHY THE DUPLICATION
      gridItem['deleteIconPath'] = undefined
      gridItem['locked'] = false
      gridItem['refreshing'] = false

      store.state.updateGlobalBpm()
      store.state.updateGlobalKey()

      emit('updateAssetSelection', {
        row: row,
        col: col,
      })
      emit('renderMixIfNeeded')
      emit('disableAnimateSelector')
    }

    const mouseOverGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]
      if (gridItem && !gridItem.showDeleteIcon && gridItem.stem) {
        gridItem.showDeleteIcon = true
      }
    }

    const mouseLeaveGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]
      if (gridItem) {
        gridItem.showDeleteIcon = false
        gridItem.showPreviewIcon = false
      }
    }

    const handleGridItemClick = (row, col) => {
      let key = undefined
      let chords = store.state.getChordsForCol(col)
      if (ROW_TO_TYPE_MAP[row] == 'drum') {
        chords = 'all'
        key = 'all'
      }

      if (ROW_TO_TYPE_MAP[row] == 'fill') {
        key = 'all'
      }

      let updateParam = {
        filterKey: key,
        clipType: ROW_TO_TYPE_MAP[row],
        chords: chords ? chords : 'all',
        row: row,
        col: col,
      }

      if (isMobile.value) {
        new GridProcessor(store.state.grid).setAcceptMobileTransfer(row, col)
      }

      emit('updateAssetSelection', updateParam)
    }

    const evalCompatibility = (stem) => {
      const compatibilityProcessor = new CompatibilityProcessor(stem, store.state)
      compatibilityProcessor.eval()
    }

    const resetCompatibility = () => {
      //TODO MAYBE ADD A LITTLE DELAY ???
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          store.state.grid[row].value[col].compatibility = undefined
        }
      }
    }

    const refreshGridItem = async (gridItem) => {
      //showLoadingSpinner.value = true

      const token = store.state.token
      const bpm = store.state.getGlobalBpm()
      const key = store.state.getGlobalKey()
      const chords = store.state.getGlobalChords()
      const type = ROW_TO_TYPE_MAP[gridItem.row]

      const row = gridItem.row
      const col = gridItem.col

      removeGridItem(row, col)

      store.state.grid[row].value[col].refreshing = true



      const res = await new ComposerAPI().getAssetAlternative(token, bpm, key, chords, type)
      store.state.grid[row].value[col].refreshing = false


      store.state.grid[row].value[col].stem = res
    }

    const columnAdd = (sectionId) => {
      new GridProcessor(store.state.grid).addColumn(sectionId)
      emit('renderMixIfNeeded')
      emit('resetPlayhead')
    }

    const columnRemove = (sectionId) => {
      new GridProcessor(store.state.grid).removeColumn(sectionId)
      emit('renderMixIfNeeded')
      emit('resetPlayhead')
    }

    const renameSectionModalId = 'renameSectionModal'
    const editSection = (sectionId) => {
      const modalOpenPayload = new ModalOpenPayload(
          renameSectionModalId,
          'Rename Section',
          undefined,
          'Rename',
          undefined,
          'Cancel',
          true,
          sectionId
      )

      emit('launchModal', modalOpenPayload)
    }

    const arpeggioToggled = (arpId) => {
      if (arpId) {

        const renderCompleteCallback = function (id) {
          new GridProcessor(store.state.grid).updateArpeggioBuffersRendered(id)
          emit('displayRenderBtn', true)
        }

        new ArpeggioRenderer(store).renderBuffer(renderCompleteCallback, arpId)
      }
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === renameSectionModalId) {
        if (modalResponsePayload[0].getResponse()) {
          if (modalResponsePayload[0].getRelayData()) {
            new GridProcessor(store.state.grid).renameSection(modalResponsePayload[0].getRelayData(), modalResponsePayload[0].getResponse())
          }
        }
      }
    })

    watch(() => bus.value.get('removeGridItem'), (rowCol) => {
      removeGridItem(rowCol[0][0], rowCol[0][1])
    })


    watch(() => bus.value.get('refreshGridItem'), (rowCol) => {
      refreshGridItem(rowCol[0])
    })

    watch(() => bus.value.get('refreshRow'), async (type) => {
      const token = store.state.token
      const bpm = store.state.getGlobalBpm()
      const key = store.state.getGlobalKey()
      const chords = store.state.getGlobalChords()

      const res = await new ComposerAPI().getAssetRowAlternative(token, bpm, key, chords, type[0])
      const rowIdx = ROW_TO_TYPE_MAP.findIndex((rowType) => rowType === type[0])

      for (let i = 0; res.stems.length > i; i++) {
        if (res.stems[i] && res.stems[i]['bpm']) {
          console.log('STEM', i, res.stems[i])
          store.state.grid[rowIdx].value[i].stem = res.stems[i]
        }
      }
    })

    const resizeInnerGridContainer = () => {
      if (!isMobile.value) {
        return
      }

      if (gridInnerContainer.value.clientWidth != gridContainerRows.value[0].scrollWidth) {
        if (gridInnerContainer.value) {
          gridInnerContainer.value.style.width = gridContainerRows.value[0].scrollWidth + 'px'
        }
      }
    }

    const resetInnerGridContainer = () => {
      if (!isMobile.value) {
        return
      }

      if (gridInnerContainer.value) {
        gridInnerContainer.value.style.width = screen.availWidth + 'px'
      }
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false

        if (isMobile.value) {
          numOfGridCols = 4
          numOfSections = 1
        }

        store.state.grid = new GridGenerator().initGrid(numOfGridRows, numOfGridCols, numOfSections)

        //add a 2nd section by default
        if (!isMobile.value) {
          new GridProcessor(store.state.grid).addSection('part_2', 6)
        }

        if (localStorage.getItem("sas-save")) {
          emit('loadProjectFromLocalStorage')
        } else {
          //GENERATE RANDOM
          emit('generateRandomProject')
        }
      })

      nextTick(() => {
        if (!gridContainerRows.value[0]) {
          return
        }

        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })

      window.addEventListener('resize', () => {
        if (!gridContainerRows.value[0]) {
          return
        }

        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })
    });

    const showAltInfo = () => {
      const modalOpenPayload = new ModalOpenPayload(
          'altInfoModal',
          'Alternative Versions',
          'Each project can have up to 4 versions.  All 4 versions are available when the project is loaded from within the DAW Plugin.',
          undefined,
          undefined,
          'Close',
          false,
          undefined
      )

      emit('launchModal', modalOpenPayload)
    }

    watch(store.state.grid, () => {
      emit('gridDrawCompleted', {
        'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
      })
    })

    watch(() => bus.value.get('assetSelected'), (stem) => {
      evalCompatibility(stem[0])
    })

    watch(() => bus.value.get('assetReleased'), () => {
      resetCompatibility()
    })

    watch(() => bus.value.get('resetCompatibility'), () => {
      resetCompatibility()
    })

    const progressBarStart = ref(0)
    const progressBarMidA = ref(0)
    const progressBarMidB = ref(0)
    const progressBar = ref(0)

    const playHeadCSS = reactive({
      // 'background-image': 'linear-gradient(rgba(255,255,255,1),rgba(255,255,255,1))',
      'background-image': 'linear-gradient(red,red)',
      'background-size': '2px 100%',
      'background-repeat': 'no-repeat',
      'background-position': '0px center'
    })

    watch(() => bus.value.get('resetInnerGridContainer'), (progressInt) => {
      resetInnerGridContainer()
    })

    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {

      resizeInnerGridContainer()

      progressBar.value = Math.round(progressInt * 0.01 * gridContainer.value.scrollWidth)
      //console.log('gridContainer.value.scrollWidth', gridContainer.value.scrollWidth)
      // progressBarStart.value = progressInt - 5
      progressBarStart.value = progressBar.value > 60 ? progressBar.value - 60 : 0
      progressBarMidA.value = progressBar.value - 10
      progressBarMidB.value = progressBar.value - 9


      playHeadCSS['background-position'] = progressBar.value + 'px center'

      // if(progressInt == 0){
      //   //move the playhead to the startloop
      //   gridContainer.value.style.marginLeft = (store.state.playBack.loopStartPercent * 0.01 * gridContainer.value.clientWidth) + 'px'
      //   return
      // }

      //gridContainer.value.style.marginLeft = (progressInt * 0.01 * gridContainer.value.clientWidth) + 'px'
    })

    return {
      arpeggioToggled,
      columnAdd,
      columnRemove,
      editSection,
      isMobile,
      getGridRows,
      getGridByRow,
      gridContainer,
      gridInnerContainer,
      gridContainerRows,
      handleGridItemClick,
      imageUrls,
      mouseOverGridItem,
      mouseLeaveGridItem,
      onDrop,
      progressBar,
      progressBarStart,
      progressBarMidA,
      progressBarMidB,
      playHeadCSS,
      showAltInfo,
      removeGridItem,
      refreshGridItem,
    }
  },
}
</script>

<style scoped>
.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}

/*.pulse-effect {*/
/*  transform: translateX(0.5rem);*/
/*  -webkit-animation: pulse 200ms ease-in-out infinite alternate;*/
/*  animation: pulse 200ms ease-in-out infinite alternate;*/
/*}*/

/*@-webkit-keyframes pulse {*/
/*  from {*/
/*    transform: translateX(0.5rem) scale(1);*/
/*  }*/
/*  to {*/
/*    transform: translateX(0.5rem) scale(1.1);*/
/*  }*/
/*}*/

/*@keyframes pulse {*/
/*  from {*/
/*    transform: translateX(0.5rem) scale(1);*/
/*  }*/
/*  to {*/
/*    transform: translateX(0.5rem) scale(1.1);*/
/*  }*/
/*}*/

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