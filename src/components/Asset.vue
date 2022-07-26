<template>

  <li v-if="enableDragAndDrop"
      class="drag-el list-none bg-cover w-16 h-16 relative rounded-lg overflow-hidden shadow-lg"
      draggable="true"
      @dragstart="startDrag($event, stem)"
      @dragend="endDrag($event)"
      v-on:mouseover="mouseOverGridItem(stem)"
      v-on:mouseleave="mouseLeaveGridItem(stem)"
      @click="onPlayClip(stem)"
      v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  }">

    <div class="w-full h-full absolute top-0 left-0 hover:shadow-lg hover:cursor-move"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <div v-if="stem.type != 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">
        {{ stem.chords }}
      </div>
      <div v-if="stem.type == 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">drum
      </div>
      <img :src=stem.previewIconPath class="w-4 h-4 absolute bottom-0 m-0.5">
      <div class="absolute bottom-0 right-0 p-1 text-xs bg-red-200 bg-opacity-50">{{ stem.bpm }}</div>
      <audio :ref="el => { audioTag = el }" loop>
        <source v-bind:src=stem.source type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </li>

  <li v-else
      class="list-none bg-cover w-16 h-16 relative rounded-lg overflow-hidden shadow-lg"
      v-on:mouseover="mouseOverGridItem(stem)"
      v-on:mouseleave="mouseLeaveGridItem(stem)"
      @click="onPlayOrTransferClip(stem)"
      v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  }">

    <div class="w-full h-full absolute top-0 left-0 hover:shadow-lg hover:cursor-move"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.5) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <div v-if="stem.type != 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">
        {{ stem.chords }}
      </div>
      <div v-if="stem.type == 'drum'" class="absolute w-full text-2xs top-0 bg-gray-500 text-white text-center">drum
      </div>
      <img :src=stem.previewIconPath class="w-4 h-4 absolute bottom-0 m-0.5">
      <div class="absolute bottom-0 right-0 p-1 text-xs bg-red-200 bg-opacity-50">{{ stem.bpm }}</div>
      <audio :ref="el => { audioTag = el }" loop>
        <source v-bind:src=stem.source type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </li>
</template>

<script>
import {inject, onBeforeUpdate, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
import {v4} from "uuid";

export default {
  name: "Asset",
  props: ['stem'],
  setup(props) {
    let ignoreSelf = false
    const store = inject('store')
    const enableDragAndDrop = ref(store.isMobile ? false : true)
    const {bus, emit} = useEventsBus()

    const audioTag = ref({})
    const progressBar = ref(0)

    let currentTime = 0
    let duration = 0

    // Make sure to reset the refs before each update.
    onBeforeUpdate(() => {
      audioTag.value = {};
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

    const onPlayClip = (stem) => {
      duration = 0
      currentTime = 0

      emit('stopAllAudio', stem.instanceId)

      if (isPlaying()) {
        audioTag.value.pause()
        stem.previewIconPath = stem.previewPlayIconPath
      } else {
        audioTag.value.load()
        audioTag.value.play()
        audioTag.value.onloadedmetadata = function () {
          duration = audioTag.value.duration
        };

        stem.previewIconPath = stem.previewStopIconPath
      }
    }

    const onPlayOrTransferClip = (stemInput) => {
      //CHECK IF A GRID ITEM IS SET TO ACCEPT MOBILE TRANSFER
      const mobileTransferEnabledGridItem = new GridProcessor(store.state.grid).getMobileTransferEnabledGridItem()

      if (mobileTransferEnabledGridItem) {
        //DO THE TRANSFER
        const stemStr = JSON.stringify(stemInput)
        const stem = JSON.parse(stemStr)
        stem.instanceId = v4() //each stem should have a unique instanceId but possible the same stem id

        const targetRow = mobileTransferEnabledGridItem[0]
        const targetCol = mobileTransferEnabledGridItem[1]
        const gridItem = store.state.grid[targetRow].value[targetCol]
        gridItem.stem = stem
        gridItem['deleteIconPath'] = store.state.staticUrl + 'icons/delete-x.png'
        gridItem['previewIconPath'] = store.state.staticUrl + 'icons/play-button.png'

        store.state.updateGlobalBpm()
        store.state.updateGlobalKey()

        emit('updateAssetSelection', {
          row: targetRow,
          col: targetCol,
        })
        emit('renderMixIfNeeded')
        //CLEAR THE TRANSFER FLAG
        new GridProcessor(store.state.grid).clearAcceptMobileTransfer()
      } else {
        //PLAY THE CLIP
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
          props.stem.previewIconPath = props.stem.previewPlayIconPath + "?x-request=html" //s3 hack to prevent request from 2 origins
          progressBar.value = 0
        }
      }
    })

    setInterval(updateDurations, 100)

    return {
      audioTag,
      endDrag,
      enableDragAndDrop,
      mouseOverGridItem,
      mouseLeaveGridItem,
      onPlayClip,
      onPlayOrTransferClip,
      progressBar,
      startDrag
    }
  }
}
</script>

<style scoped>

</style>