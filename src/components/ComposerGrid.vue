<template xmlns="http://www.w3.org/1999/html">
  <div class="rounded-lg w-11/12 overflow-x-scroll border-2 border-black p-2"
       style="background-color: rgba(255,255,255,0.9);">

    <!--    SECTIONS-->
    <div v-for="(gridRow, i) in getGridRows()">
      <div v-if="i == 0" class="flex flex-none justify-between">
        <div v-for="(gridRowItem, j) in gridRow.value" class="ml-1 mb-2 w-16 flex-none">
          <div v-if="gridRowItem.section.position == 'start'" style="white-space: nowrap"
               class="ml-1 w-16 h-6 flex overflow-visible nowrap items-center border-l-2 border-black">
            <span class="ml-2 hover:cursor-move">{{ gridRowItem.section.id }}</span>
          </div>

          <div v-if="gridRowItem.section.position == 'end'" class="ml-1 w-16 h-6 flex">
            <button @click="columnAdd(gridRowItem.section.id)">
              <img :src=imageUrls.plusIcon class="w-4 h-4 ml-2">
            </button>

            <button @click="columnRemove(gridRowItem.section.id)">
              <img :src=imageUrls.minusIcon class="w-4 h-4 ml-2">
            </button>
          </div>
          <!--          <div v-if="i == 0 && j == 4" style="white-space: nowrap"-->
          <!--               class="ml-1 w-16 h-6 flex overflow-visible nowrap items-center border-l-2 border-black">-->
          <!--            <span class="ml-2 hover:cursor-move">VERSE</span>-->
          <!--          </div>-->
          <!--          <div v-if="i == 0 && j == 11" class="ml-1 w-16 h-6 flex border-r-2 border-black items-center">-->
          <!--            <button @click="columnAdd('columnId')">-->
          <!--              <img :src=imageUrls.plusIcon class="w-4 h-4 ml-2">-->
          <!--            </button>-->

          <!--            <button @click="columnAdd('columnId')">-->
          <!--              <img :src=imageUrls.minusIcon class="w-4 h-4 ml-2">-->
          <!--            </button>-->
          <!--          </div>-->

          <!--          <div v-if="i == 0 && j != 0 && j !=3 && j !=11" class="ml-1 w-16 h-6 flex-none">-->
          <!--          </div>-->

        </div>
      </div>
    </div>
    <!--    SECTIONS-->

    <div v-for="(gridRow, i) in getGridRows()" :key="i" :ref="(el) => (gridContainerRows[i] = el)"
         class="flex flex-none justify-between">
      <div v-for="gridRowItem in gridRow.value"
           class="ml-1 mb-2 w-16 h-16 flex-none overflow-hidden relative rounded-lg shadow-lg  hover:bg-gray-400 hover:cursor-pointer"
           :class="{ 'bg-green-100': gridRowItem.compatibility === 2, 'bg-yellow-100': gridRowItem.compatibility === 1, 'bg-red-100': gridRowItem.compatibility === 0 }"
           @drop="onDrop($event, gridRowItem.row, gridRowItem.col)"
           @dragover.prevent
           @dragenter.prevent
           v-on:mouseover="mouseOverGridItem(gridRowItem.row, gridRowItem.col)"
           v-on:mouseleave="mouseLeaveGridItem(gridRowItem.row, gridRowItem.col)"
           @click="handleGridItemClick(gridRowItem.row, gridRowItem.col)">
        <asset v-if="gridRowItem.stem" :stem="gridRowItem.stem" class="absolute top-0 left-0"></asset>
        <img v-if="gridRowItem.showDeleteIcon" :src=gridRowItem.deleteIconPath
             @click.stop="removeGridItem(gridRowItem.row, gridRowItem.col)"
             class="w-4 h-4 absolute top-0 left-0 bg-white ml-1 mt-1 rounded-md">
      </div>
    </div>

    <composer-controls-scroll-bar></composer-controls-scroll-bar>
  </div>

</template>

<script>
import {reactive, ref, inject, watch, onMounted, nextTick} from 'vue'
import useEventsBus from "../events/eventBus";
import Asset from "./Asset";
import GridGenerator from "../generators/grid-generator";
import CompatibilityProcessor from "../processors/compatibility-processor";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";
import GridProcessor from "../processors/grid-processor";

export default {
  name: 'ComposerGrid',
  components: {Asset, ComposerControlsScrollBar},
  setup() {

    // v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.3) ' + progressBar + '%,  gray ' + progressBar + '%' }"

    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast');
    const gridContainerRows = ref([]);
    const imageUrls = {
      plusIcon: store.state.staticUrl + "icons/plus.png",
      minusIcon: store.state.staticUrl + "icons/minus.png",
    }

    let numOfGridCols = 12

    store.state.grid = new GridGenerator().initGrid(5, numOfGridCols)

    const getGridRows = () => {
      return store.state.grid
    }

    const getGridByRow = (row) => {
      return store.state.grid[row].value.filter((grid) => grid.row === row)
    }

    const updateGlobalBpm = () => {
      let bpm = undefined
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          if (store.state.grid[row].value[col].stem && store.state.grid[row].value[col].stem.bpm) {
            bpm = store.state.grid[row].value[col].stem.bpm
          }
        }
      }

      store.state.globalBpm = bpm
    }

    const updateGlobalKey = () => {
      let key = undefined
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          if (store.state.grid[row].value[col].stem && store.state.grid[row].value[col].stem.key) {
            key = store.state.grid[row].value[col].stem.key
          }
        }
      }

      store.state.globalKey = key
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

      updateGlobalBpm()
      updateGlobalKey()

      emit('updateAssetSelection', {})
      emit('renderMixIfNeeded')
    }

    const removeGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]

      gridItem.sectionId = undefined
      gridItem.stem = undefined //TODO IF YOU HAVE THE STEM WHY THE DUPLICATION
      gridItem['deleteIconPath'] = undefined

      updateGlobalBpm()
      updateGlobalKey()

      emit('updateAssetSelection', {})
      emit('renderMixIfNeeded')
    }

    const mouseOverGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]
      if (!gridItem.showDeleteIcon && gridItem.stem) {
        gridItem.showDeleteIcon = true
      }
    }

    const mouseLeaveGridItem = (row, col) => {
      const gridItem = store.state.grid[row].value[col]
      gridItem.showDeleteIcon = false
      gridItem.showPreviewIcon = false
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

    const columnAdd = (sectionId) => {
      new GridProcessor(store.state.grid).addColumn(sectionId)
      emit('renderMixIfNeeded')
    }

    const columnRemove = (sectionId) => {
      new GridProcessor(store.state.grid).removeColumn(sectionId)
      emit('renderMixIfNeeded')
    }

    onMounted(() => {
      nextTick(() => {
        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })

      window.addEventListener('resize', () => {
        emit('gridDrawCompleted', {
          'gridContainerRowWidth': gridContainerRows.value[0].clientWidth,
        })
      })
    });

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
      getGridRows,
      getGridByRow,
      gridContainerRows,
      handleGridItemClick,
      imageUrls,
      mouseOverGridItem,
      mouseLeaveGridItem,
      onDrop,
      progressBar,
      removeGridItem
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
</style>