<template>
  <li v-if="isMobile"
      class="list-none bg-contain w-32 h-16 relative overflow-hidden shadow-lg"
      :class="{
        'w-16': hostType==='selector',
        'rounded-lg': hostType==='selector'
      }"
      v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  }">

    <div class="w-full h-full hover:shadow-lg hover:cursor-move"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <div class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">
        {{ stem.type }} - {{ stem.bpm }} bpm
      </div>

      <div class="w-full h-full flex items-center">
        <div class="w-1/3 h-full flex justify-evenly items-center" @click="onPlayClip(stem)">
          <img :src=stem.previewPlayIconPath
               class="h-6 w-6 ml-2 aspect-square hover:border-2 hover:border-green-600 rounded-full hover:cursor-pointer">
        </div>

        <div class="w-1/3 h-full flex justify-center items-center">
          <img :src="stem.refreshIconPath"
               @click.stop="refreshGridItem()"
               class="w-10 h-10 aspect-square hover:border-2 hover:border-green-600 rounded-full hover:cursor-pointer">
        </div>

        <div class="w-1/3 h-full flex justify-evenly items-center">
          <img v-if="!excludeMode" :src="stem.deleteIconPath"
               @click="onRemoveClip"
               class="h-6 w-6 mr-2 aspect-square hover:border-2 hover:border-red-600 rounded-full hover:cursor-pointer">

          <img v-if="excludeMode" :src="stem.deleteIconPath"
               @click="onExcludeClip"
               class="h-6 w-6 mr-2 aspect-square border-2 border-red-600 rounded-full hover:cursor-pointer">
        </div>
      </div>

      <audio :ref="el => { audioTag = el }" loop>
        <source v-bind:src=stem.source type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </li>

  <li v-if="!isMobile"
      class="drag-el list-none bg-cover h-16 rounded-r-lg shadow-lg"
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

    <div class="w-full h-full hover:shadow-lg hover:cursor-move absolute
    z-12"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">

      <div class="w-full h-full flex items-center">
        <div class="w-1/3 h-full flex justify-evenly items-center" @click="onPlayClip(stem)">
          <img :src=stem.previewPlayIconPath
               class="h-6 w-6 ml-2 aspect-square hover:border-2 hover:border-green-600 rounded-full hover:cursor-pointer">

          <img v-if="excludeMode && evaluateGenAssetMode" :src="stem.lockIconPath"
               @click.stop="onEvaluateGenAsset(true)"
               class="h-6 w-6 ml-2 bg-white p-0.5 border-green-500 border-2 border-2 rounded-full aspect-square">

          <img v-if="excludeMode && evaluateGenAssetMode" :src="stem.lockIconPath"
               @click.stop="onEvaluateGenAsset(false)"
               class="h-6 w-6 ml-2 bg-white p-0.5 border-red-500 border-2 border-2 rounded-full aspect-square">

          <img v-if="locked && !excludeMode && !evaluateGenAssetMode" :src="stem.lockIconPath"
               @click.stop="lockUnlock"
               class="h-6 w-6 ml-2 bg-white p-0.5 border-red-500 border-2 hover:border-2 hover:border-yellow-600 rounded-full aspect-square">

          <img v-if="!locked && !excludeMode && !evaluateGenAssetMode" :src="stem.unlockIconPath"
               @click.stop="lockUnlock"
               class="h-6 w-6 ml-2 bg-white p-0.5 border-black border-2 hover:border-yellow-600 rounded-full aspect-square">
        </div>

        <div class="w-1/3 h-full flex justify-center items-center">
          <img :src="stem.refreshIconPath"
               @click.stop="refreshGridItem()"
               class="w-10 h-10 aspect-square hover:border-2 hover:border-green-600 rounded-full hover:cursor-pointer">
        </div>

        <div class="w-1/3 h-full flex justify-evenly items-center">
          <img :src="stem.downloadIconPath"
               @click="downloadGridItem(stem)"
               class="h-6 w-6 p-1 mr-2 aspect-square bg-white border-2 border-black hover:border-2 hover:border-yellow-600 rounded-full hover:cursor-pointer">

          <img v-if="!excludeMode" :src="stem.deleteIconPath"
               @click="onRemoveClip"
               class="h-6 w-6 mr-2 aspect-square hover:border-2 hover:border-red-600 rounded-full hover:cursor-pointer">

          <img v-if="excludeMode" :src="stem.deleteIconPath"
               @click="showDebugInfo"
               class="h-6 w-6 mr-2 aspect-square border-2 border-green-600 rounded-full hover:cursor-pointer">

          <img v-if="excludeMode" :src="stem.deleteIconPath"
               @click="onExcludeClip"
               class="h-6 w-6 mr-2 aspect-square border-2 border-red-600 rounded-full hover:cursor-pointer">
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
import ComposerAPI from "../dal/ComposerAPI";
import axios from "axios";
import ModalOpenPayload from "./ModalOpenPayload";

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
    const excludeMode = ref(store.state.excludemode ? true : false)
    const evaluateGenAssetMode = ref(props.stem.asset_class === 'asset_generated' && excludeMode.value == true)
    const {bus, emit} = useEventsBus()

    const audioTag = ref({})
    const progressBar = ref(0)

    const hostType = ref(props.stem.host)

    let currentTime = 0
    let duration = 0

    const locked = ref(props.locked)

    const lockUnlock = () => {
      locked.value = !locked.value

      const lockProcessor = new LockProcessor(store.state.grid)
      lockProcessor.setLock(props.row, props.col, locked.value)

      emit('updateColumnLocks')
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

    const onExcludeClip = () => {
      emit('excludeGridItem', [props.row, props.col])
    }

    const onEvaluateGenAsset = async (evaluation) => {
      const gridItem = store.state.grid[props.row].value[props.col]
      const assetId = gridItem.stem.id
      const res = await new ComposerAPI().evaluateGeneratedAsset(store.token, assetId, evaluation)
      alert(res)
    }

    const showDebugInfo = () => {
      console.log('STEM', props.stem)
      const debugInfo = JSON.stringify(props.stem);
      alert(debugInfo)
    }


    const downloadGridItem = async (stem) => {

      const source = new URL(stem.source).pathname.split("/").pop()

      let midiResource = await new ComposerAPI().getMidiResource(source)

      if(midiResource){
        const midiPath = stem.source.replace(source, midiResource)

        const audioAndMidiSource = {
          'audio': stem.source,
          'midi': midiPath,
        }

        const downloadAssetDialogModalId = 'downloadAssetDialogModalId'
        const modalPayload = new ModalOpenPayload(
            downloadAssetDialogModalId,
            'Audio Or MIDI',
            'Would you like to download the audio or Midi file?',
            'Audio',
            'Midi',
            'Cancel',
            false,
            audioAndMidiSource,
        )

        emit('launchModal', modalPayload)
      } else {
        //ONLY AUDIO, just start the audio download
        new Analytics().trackDownloadSingleWAV(stem.source)
        window.location.href = stem.source
      }
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
      if (callerId[0] != props.stem.instanceId) {
        if (isPlaying()) {
          audioTag.value.pause()
          props.stem.previewPlayIconPath = store.state.staticUrl + 'icons/play-button.png' + "?x-request=html" //s3 hack to prevent request from 2 origins
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
      excludeMode,
      evaluateGenAssetMode,
      onEvaluateGenAsset,
      onExcludeClip,
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
      showDebugInfo,
      startDrag,
      refreshGridItem,
    }
  }
}
</script>

<style scoped>

</style>