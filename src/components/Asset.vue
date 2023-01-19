<template>
  <li v-if="isMobile"
      class="list-none bg-contain w-32 h-16 relative overflow-hidden shadow-lg"
      :class="{
        'w-16': hostType==='selector',
        'rounded-lg': hostType==='selector'
      }"
      v-on:mouseover="mouseOverGridItem(stem)"
      v-on:mouseleave="mouseLeaveGridItem(stem)"
      @click="onPlayOrTransferClip(stem)"
      v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  }">

    <div class="w-full h-full hover:shadow-lg hover:cursor-move"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <div v-if="stem.type != 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">
        {{ stem.chords }}
      </div>
      <div v-if="stem.type == 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">drum
      </div>
      <img :src=stem.previewPlayIconPath class="w-4 h-4 absolute bottom-2 m-0.5" :class="{
        'bottom-0': hostType==='selector',
      }">
      <div class="absolute bottom-0 right-0 p-1 text-xs bg-red-200 bg-opacity-50">{{ stem.bpm }}</div>
      <audio :ref="el => { audioTag = el }" loop>
        <source v-bind:src=stem.source type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </li>

  <li v-if="!isMobile"
      class="drag-el list-none bg-cover h-16 rounded-lg shadow-lg"
      :class="{ 'w-full': isGrid == true, 'w-16': isGrid == false }"
      draggable="true"
      @dragstart="startDrag($event, stem)"
      @dragend="endDrag($event)"
      v-on:mouseover="mouseOverGridItem(stem)"
      v-on:mouseleave="mouseLeaveGridItem(stem)"
  >

    <div class="w-full h-full absolute z-0"
         v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  'background-size': '100% 100%', 'opacity': '0.8' }">
    </div>

    <div class="w-full h-full hover:shadow-lg hover:cursor-move absolute z-50"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <!--      <div v-if="stem.type != 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">-->
      <!--        {{ stem.chords }} <span v-if="isGrid"> - {{ stem.bpm }}</span>-->
      <!--      </div>-->
      <!--      <div v-if="stem.type == 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">drum-->
      <!--      </div>-->


      <div class="w-full h-full flex items-center">
        <div class="w-1/3 h-full flex justify-evenly items-center" @click="onPlayClip(stem)">
          <img :src=stem.previewPlayIconPath
               class="h-6 w-6 ml-2 aspect-square bg-white border-2 border-black rounded-full hover:cursor-pointer">

          <img v-if="locked" :src="stem.lockIconPath"
               @click.stop="lockUnlock"
               class="h-6 w-6 ml-2 aspect-square">

          <img v-if="!locked" :src="stem.unlockIconPath"
               @click.stop="lockUnlock"
               class="h-6 w-6 ml-2 aspect-square">
        </div>

        <div class="w-1/3 h-full flex justify-center items-center">
          <img :src="stem.refreshIconPath"
               @click.stop="refreshGridItem()"
               class="w-10 h-10 aspect-square bg-white border-2 border-black rounded-full hover:cursor-pointer">
        </div>

        <div class="w-1/3 h-full flex justify-evenly items-center">
          <img :src="stem.downloadIconPath"
               @click="downloadGridItem(stem)"
               class="h-6 w-6 p-1 mr-2 aspect-square bg-white border-2 border-black rounded-full hover:cursor-pointer">

          <img :src="stem.deleteIconPath"
               @click="onRemoveClip"
               class="h-6 w-6 mr-2 aspect-square bg-white border-2 border-black rounded-full hover:cursor-pointer">
        </div>
      </div>

      <audio :ref="el => { audioTag = el }" loop>
        <source v-bind:src=stem.source type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </li>
</template>

<script>
import {inject, onBeforeUpdate, nextTick, onMounted, ref, watch, toRefs} from "vue";
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
import {v4} from "uuid";
import store from "../store/store";
import {ROW_TO_TYPE_MAP} from "../constants/constants";
import Analytics from "../analytics/Analytics";
import ComposerControlsLoopBar from "./ComposerControlsLoopBar.vue";
import LockProcessor from "../processors/lock-processor";

export default {
  name: "Asset",
  components: {ComposerControlsLoopBar},
  inheritAttrs: false,
  props: {
    stem: Object,
    row: Number,
    col: Number,
    locked: Boolean,
    grid: Boolean,
  },
  setup(props) {
    let ignoreSelf = false
    const store = inject('store')
    const isMobile = ref(store.isMobile ? true : false)
    const isGrid = ref(props.grid ? true : false)
    const {bus, emit} = useEventsBus()

    const audioTag = ref({})
    const progressBar = ref(0)

    const hostType = ref(props.stem.host)

    let currentTime = 0
    let duration = 0

    const locked  = ref(props.locked)

    const lockUnlock = () => {
      locked.value = !locked.value

      const lockProcessor = new LockProcessor(store.state.grid)
      lockProcessor.setLock(props.row, props.col, locked.value)
    }

    //by default the play button should be showing
    props.stem.previewPlayIconPath = store.state.staticUrl + 'icons/play-button.png' + "?x-request=html"
    props.stem.refreshIconPath = store.state.staticUrl + 'icons/refresh-icon.png' + "?x-request=html"
    props.stem.deleteIconPath = store.state.staticUrl + 'icons/remove.png' + "?x-request=html"
    props.stem.downloadIconPath = store.state.staticUrl + 'icons/download-icon.svg' + "?x-request=html"
    props.stem.lockIconPath = store.state.staticUrl + 'icons/lock.png' + "?x-request=html"
    props.stem.unlockIconPath = store.state.staticUrl + 'icons/unlock.png' + "?x-request=html"

    // Make sure to reset the refs before each update.
    onBeforeUpdate(() => {
      audioTag.value = {};
    });

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    const startDrag = (evt, stem) => {
      evt.dataTransfer.setData('stem', JSON.stringify(stem))

      emit('assetSelected', stem)
    }

    const endDrag = (evt, stem) => {
      emit('assetReleased', stem)
    }

    const mouseOverGridItem = (stem) => {
      stem.showPreviewIcon = true
    }

    const mouseLeaveGridItem = (stem) => {
      stem.showPreviewIcon = false
    }

    const isPlaying = () => {
      return audioTag.value
          && audioTag.value.currentTime > 0
          && !audioTag.value.paused
          && !audioTag.value.ended
          && audioTag.value.readyState > 2;
    }

    const onRemoveClip = () => {
      emit('removeGridItem', [props.row, props.col])
    }

    const downloadGridItem = (stem) => {
      //const gridItem = store.state.grid[row].value[col]
      new Analytics().trackDownloadSingleWAV(stem.source)
      window.location.href = stem.source
    }

    const onPlayClip = (stem) => {
      duration = 0
      currentTime = 0

      emit('stopAllAudio', stem.instanceId)

      if (isPlaying()) {
        audioTag.value.pause()
        stem.previewPlayIconPath = store.state.staticUrl + 'icons/play-button.png'
      } else {
        audioTag.value.load()
        audioTag.value.play()
        audioTag.value.onloadedmetadata = function () {
          duration = audioTag.value.duration
        };
        stem.previewPlayIconPath = store.state.staticUrl + 'icons/stop-button.png'

        new Analytics().trackPlayAsset()
      }
    }

    function is_row_type_match(targetRow, stem) {
      let stemType = stem.type
      if (stemType == 'hit' || stemType == 'riser') {
        stemType = 'fill'
      }

      return targetRow != ROW_TO_TYPE_MAP.indexOf(stemType);
    }

    const refreshGridItem = () => {
      emit('refreshGridItem', {
        row: props.row,
        col: props.col,
      })
    }



    const onPlayOrTransferClip = (stemInput) => {
      //CHECK IF A GRID ITEM IS SET TO ACCEPT MOBILE TRANSFER
      const mobileTransferEnabledGridItem = new GridProcessor(store.state.grid).getMobileTransferEnabledGridItem()

      if (mobileTransferEnabledGridItem) {
        //DO THE TRANSFER
        const stemStr = JSON.stringify(stemInput)
        const stem = JSON.parse(stemStr)

        const targetRow = mobileTransferEnabledGridItem[0]
        const targetCol = mobileTransferEnabledGridItem[1]

        //first determine if the row is the same
        if (is_row_type_match(targetRow, stem)) {
          return
        }

        const gridItem = store.state.grid[targetRow].value[targetCol]

        if (gridItem && gridItem.stem && gridItem.stem.instanceId === stem.instanceId) {
          onPlayClip(stemInput)
          return
        }

        stem.instanceId = v4() //each stem should have a unique instanceId but possible the same stem id
        stem['host'] = 'grid' //THIS ALLOWS THE ASSET TO CHANGE DIMENSIONS DYNAMICALLY

        gridItem.stem = stem
        gridItem['deleteIconPath'] = store.state.staticUrl + 'icons/delete-x.png'
        gridItem['previewPlayIconPath'] = store.state.staticUrl + 'icons/play-button.png'
        store.state.updateGlobalBpm()
        store.state.updateGlobalKey()

        emit('updateAssetSelection', {
          row: targetRow,
          col: targetCol,
        })
        emit('renderMixIfNeeded')
        //CLEAR THE TRANSFER FLAG
        new GridProcessor(store.state.grid).clearAcceptMobileTransfer()
        emit('disableAnimateSelector')
      } else {
        onPlayClip(stemInput)
      }
    }

    let updateDurations = async () => {
      if (!isPlaying()) {
        return
      }

      currentTime = audioTag.value.currentTime

      let progress = Math.round(currentTime / duration * 100)
      if (Number.isInteger(progress)) {
        progressBar.value = progress
      }
    }

    watch(() => bus.value.get('stopAllAudio'), (callerId) => {
      if (callerId != props.stem.instanceId) {
        if (isPlaying()) {
          audioTag.value.pause()
          props.stem.previewPlayIconPath = props.stem.previewPlayIconPath + "?x-request=html" //s3 hack to prevent request from 2 origins
          progressBar.value = 0
        }
      }
    })

    watch(() => bus.value.get('updateAssetLocks'), () => {
      const lockProcessor = new LockProcessor(store.state.grid)

      locked.value = lockProcessor.getLockState(props.row, props.col)
    })

    setInterval(updateDurations, 100)

    return {
      audioTag,
      downloadGridItem,
      endDrag,
      hostType,
      isGrid,
      isMobile,
      locked,
      lockUnlock,
      mouseOverGridItem,
      mouseLeaveGridItem,
      onPlayClip,
      onPlayOrTransferClip,
      onRemoveClip,
      progressBar,
      startDrag,
      refreshGridItem,
    }
  }
}
</script>

<style scoped>

</style>