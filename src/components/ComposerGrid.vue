<template xmlns="http://www.w3.org/1999/html">
  <div class="rounded-lg w-11/12 overflow-x-scroll border-2 border-black p-2"
       style="background-color: rgba(255,255,255,0.9);">

    <!--    SECTIONS-->
    <div v-for="(gridRow, i) in getGridRows()">
      <div v-if="i == 0" class="flex flex-none justify-between">
        <div v-for="(gridRowItem, j) in gridRow.value" class="ml-1 mb-2 w-16 flex-none">
          <div v-if="gridRowItem.section.position == 'start'" style="white-space: nowrap"
               class="ml-1 w-16 h-6 flex overflow-visible nowrap items-center border-l-2 border-black">
            <span class="ml-2 hover:cursor-move">{{ gridRowItem.section.name }}</span>
          </div>

          <div v-if="gridRowItem.section.position == 'end'" class="ml-1 w-16 h-6 flex">
            <button @click="editSection(gridRowItem.section.id)">
              <img :src=imageUrls.editIcon class="w-4 h-4">
            </button>

            <button @click="columnAdd(gridRowItem.section.id)">
              <img :src=imageUrls.plusIcon class="w-4 h-4 ml-1">
            </button>

            <button @click="columnRemove(gridRowItem.section.id)">
              <img :src=imageUrls.minusIcon class="w-4 h-4 ml-1">
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--    SECTIONS-->

    <div v-for="(gridRow, i) in getGridRows()" :key="i" :ref="(el) => (gridContainerRows[i] = el)"
         class="flex flex-none justify-between">
      <div v-for="gridRowItem in gridRow.value"
           class="ml-1 mb-2 w-16 h-16 flex-none overflow-hidden relative rounded-lg shadow-lg  hover:bg-gray-400 hover:cursor-pointer"
           :class="{ 'animate-pulse bg-gray-500': i===0 && gridRowItem.arpeggio.on, 'bg-green-100': gridRowItem.compatibility === 2, 'bg-yellow-100': gridRowItem.compatibility === 1, 'bg-red-100': gridRowItem.compatibility === 0 }"
           @drop="onDrop($event, gridRowItem.row, gridRowItem.col)"
           @dragover.prevent
           @dragenter.prevent
           v-on:mouseover="mouseOverGridItem(gridRowItem.row, gridRowItem.col)"
           v-on:mouseleave="mouseLeaveGridItem(gridRowItem.row, gridRowItem.col)"
           @click.stop="handleGridItemClick(gridRowItem.row, gridRowItem.col)">
        <div v-if="i===0" class="w-full h-full flex justify-center content-center items-center">
            <label class="inline-flex relative items-center cursor-pointer">
              <input v-model="gridRowItem.arpeggio.on" :id="item" type="checkbox" value="" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-800"></div>
            </label>
        </div>
        <asset v-if="gridRowItem.stem" :stem="gridRowItem.stem" class="absolute top-0 left-0"></asset>
        <img v-if="gridRowItem.showDeleteIcon" :src=gridRowItem.deleteIconPath
             @click.stop="removeGridItem(gridRowItem.row, gridRowItem.col)"
             class="w-4 h-4 absolute top-0 left-0 bg-white ml-1 mt-1 rounded-md">
      </div>
    </div>

    <composer-controls-loop-bar></composer-controls-loop-bar>
    <composer-controls-scroll-bar></composer-controls-scroll-bar>
  </div>

</template>

<script>
import {ref, inject, watch, onMounted, nextTick} from 'vue'
import useEventsBus from "../events/eventBus";
import Asset from "./Asset";
import GridGenerator from "../generators/grid-generator";
import CompatibilityProcessor from "../processors/compatibility-processor";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";
import GridProcessor from "../processors/grid-processor";
import ModalOpenPayload from "./ModalOpenPayload";
import {v4} from "uuid";
import ComposerControlsLoopBar from "./ComposerControlsLoopBar";
import GridItem from "../generators/grid-item";
import GridItemArpeggio from "../generators/grid-item-arpeggio";

export default {
  name: 'ComposerGrid',
  components: {Asset, ComposerControlsLoopBar, ComposerControlsScrollBar},
  setup() {

    // v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.3) ' + progressBar + '%,  gray ' + progressBar + '%' }"

    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast');
    const gridContainerRows = ref([]);
    const imageUrls = {
      editIcon: store.state.staticUrl + 'icons/edit.png',
      plusIcon: store.state.staticUrl + "icons/plus.png",
      minusIcon: store.state.staticUrl + "icons/minus.png",
    }

    const numOfGridRows = 6
    const numOfGridCols = 6
    const numOfSections = 2

    store.state.grid = new GridGenerator().initGrid(numOfGridRows, numOfGridCols, numOfSections)

    //add a 2nd section by default
    new GridProcessor(store.state.grid).addSection('part_2', 6)

    const getGridRows = () => {
      return store.state.grid
    }

    const getGridByRow = (row) => {
      return store.state.grid[row].value.filter((grid) => grid.row === row)
    }

    const onDrop = (evt, row, col) => {
      if (store.state.grid[row].value[col].compatibility === 0 || store.state.grid[row].value[col].compatibility === -1) {
        //NOT COMPATIBLE/PREVENT DROP
        return
      }

      const stemStr = evt.dataTransfer.getData('stem')
      const stem = JSON.parse(stemStr)

      console.log('DROPPED STEM', stem)

      const gridItem = store.state.grid[row].value[col]
      gridItem.stem = stem
      gridItem['deleteIconPath'] = store.state.staticUrl + 'icons/delete-x.png'
      gridItem['previewIconPath'] = store.state.staticUrl + 'icons/play-button.png'

      store.state.updateGlobalBpm()
      store.state.updateGlobalKey()


      emit('updateAssetSelection', {
        row: row,
        col: col,
      })
      emit('renderMixIfNeeded')
    }

    const removeGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]

      gridItem.sectionId = undefined
      gridItem.stem = undefined //TODO IF YOU HAVE THE STEM WHY THE DUPLICATION
      gridItem['deleteIconPath'] = undefined

      store.state.updateGlobalBpm()
      store.state.updateGlobalKey()

      emit('updateAssetSelection', {
        row: row,
        col: col,
      })
      emit('renderMixIfNeeded')
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
        chords = 'all'
        key = 'all'
      }

      let updateParam = {
        filterKey: key,
        clipType: ROW_TO_TYPE_MAP[row],
        chords: chords ? chords : 'all',
        row: row,
        col: col,
      }

      //emit('updateAssetSelection', updateParam)

      //TODO: THIS IS A HACK TO GET THE MODAL TO OPEN by firing twice
      //TODO: FIX THIS
      //if (row === 0) {
        setTimeout(() => {
          emit('updateAssetSelection', updateParam)
        }, 200)
      //}
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
          'Cancel',
          true,
          sectionId
      )

      emit('launchModal', modalOpenPayload)
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

    onMounted(() => {
      nextTick(() => {
        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })

      window.addEventListener('resize', () => {
        // if (currentGridWidth == gridContainerRows.value[0].clientWidth &&
        //     currentColCount == gridContainerRows.value[0].length) {
        //   return
        // }
        //
        // currentGridWidth = gridContainerRows.value[0].clientWidth
        // currentColCount = gridContainerRows.value[0].length
        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })
    });

    watch(store.state.grid, () => {
      // if (currentGridWidth == gridContainerRows.value[0].clientWidth &&
      //     currentColCount == gridContainerRows.value[0].length) {
      //   return
      // }
      //
      // console.log('FIRED', gridContainerRows.value[0].length)
      //
      // currentGridWidth = gridContainerRows.value[0].clientWidth
      // currentColCount = gridContainerRows.value[0].length
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

    const progressBar = ref(0)
    // watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
    //   progressBar.value = progressInt
    // })

    return {
      columnAdd,
      columnRemove,
      editSection,
      getGridRows,
      getGridByRow,
      gridContainerRows,
      handleGridItemClick,
      imageUrls,
      mouseOverGridItem,
      mouseLeaveGridItem,
      onDrop,
      progressBar,
      removeGridItem,
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

.pulse-effect {
  /*transform: translateX(0.5rem);*/
  /*-webkit-animation: pulse 200ms ease-in-out infinite alternate;*/
  /*animation: pulse 200ms ease-in-out infinite alternate;*/
}

@-webkit-keyframes pulse {
  from {
    transform: translateX(0.5rem) scale(1);
  }
  to {
    transform: translateX(0.5rem) scale(1.1);
  }
}

@keyframes pulse {
  from {
    transform: translateX(0.5rem) scale(1);
  }
  to {
    transform: translateX(0.5rem) scale(1.1);
  }
}
</style>