<template xmlns="http://www.w3.org/1999/html">
  <div class="rounded-lg w-11/12"
       v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.3) ' + progressBar + '%,  gray ' + progressBar + '%' }">
    <div v-for="gridRow in getGridRows()" class="flex justify-between">
      <div v-for="gridRowItem in gridRow.value"
           class="m-1 w-20 h-20 overflow-hidden relative rounded-lg shadow-lg hover:bg-gray-400 hover:cursor-pointer"
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
import {reactive, ref, inject, watch} from 'vue'
import useEventsBus from "../events/eventBus";
import Asset from "./Asset";
import GridGenerator from "../generators/grid-generator";
import CompatibilityProcessor from "../processors/compatibility-processor";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";

export default {
  name: 'ComposerGrid',
  components: {Asset, ComposerControlsScrollBar},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()

    store.state.grid = new GridGenerator().initGrid(4, 12)

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
          if (store.state.grid[row].value[col].bpm) {
            bpm = store.state.grid[row].value[col].bpm
          }
        }
      }

      store.state.globalBpm = bpm
    }

    const updateGlobalKey = () => {
      let key = undefined
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          if (store.state.grid[row].value[col].key) {
            key = store.state.grid[row].value[col].key
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

      const gridItem = store.state.grid[row].value[col]
      gridItem.sectionId = stem.sectionId
      gridItem.bpm = stem.bpm
      gridItem.key = stem.key
      gridItem.type = stem.type
      gridItem.variationId = stem.variationId
      gridItem.source = stem.source
      gridItem.stem = stem //TODO IF YOU HAVE THE STEM WHY THE DUPLICATION

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
      gridItem.bpm = undefined
      gridItem.key = undefined
      gridItem.type = undefined
      gridItem.variationId = undefined
      gridItem.source = undefined
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

      const gridItem = store.state.grid[row].value[col]
      // if(!gridItem.stem.id){
      //   alert('id:' + gridItem.stem.id)
      // }

      /*
       get the current if set:

       - global key
       - global bpm
       - selected type
       - current chords

       - filter accordingly
       */

      let key = undefined
      let chords = store.state.getChordsForCol(col)
      if (ROW_TO_TYPE_MAP[row] == 'drum') {
        console.log("ROW IS DRUM")
        chords = 'all'
        key = 'all'
      }

      let updateParam = {
        filterKey: key,
        clipType: ROW_TO_TYPE_MAP[row],
        chords: chords ? chords : 'all',
      }

      console.log("BEFORE FIRE", updateParam)

      emit('updateAssetSelection', updateParam)
    }

    const evalCompatibility = (stem) => {
      const compatibilityProcessor = new CompatibilityProcessor(stem, store.state)

      //compatibilityProcessor.processFilledGridItems()

      compatibilityProcessor.eval()

      //GO THROUGH EVERY GRID ITEM
      // for (let row = 0; row < store.state.grid.length; row++) {
      //   for (let col = 0; col < store.state.grid[row].value.length; col++) {
      //     if (!store.state.grid[row].value[col].stem) {
      //       //get type for row
      //       if (ROW_TO_TYPE_MAP[row] != stem.type) {
      //         store.state.grid[row].value[col].compatibility = 0
      //       }
      //
      //       if (store.state.globalBpm && store.state.globalBpm != stem.bpm) {
      //         store.state.grid[row].value[col].compatibility = 0
      //       }
      //
      //       //IF NOT SET THEN MAKE IT GREEN
      //       if (store.state.grid[row].value[col].compatibility === undefined) {
      //         store.state.grid[row].value[col].compatibility = 2
      //       }
      //     }
      //   }
      // }


    }

    const resetCompatibility = () => {
      //TODO MAYBE ADD A LITTLE DELAY ???
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          store.state.grid[row].value[col].compatibility = undefined
        }
      }
    }

    watch(() => bus.value.get('assetSelected'), (stem) => {
      evalCompatibility(stem[0])
    })

    watch(() => bus.value.get('assetReleased'), () => {
      resetCompatibility()
    })

    const progressBar = ref(0)
    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
      progressBar.value = progressInt
    })

    return {
      getGridRows,
      getGridByRow,
      handleGridItemClick,
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