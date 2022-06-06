<template>
  <li class="drag-el bg-cover w-16 h-16 relative"
      draggable="true"
      @dragstart="startDrag($event, stem)"
      @dragend="endDrag($event)"
      v-on:mouseover="mouseOverGridItem(stem)"
      v-on:mouseleave="mouseLeaveGridItem(stem)"
      @click="onPlayClip(stem)"
      v-bind:style="{ backgroundImage: 'url(' + stem.waveform + ')',  }">
    >

    <div class="w-full h-full absolute top-0 left-0"
         v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.3) ' + progressBar + '%, rgba(255, 255, 255, 0) ' + progressBar + '%' }">
      <div class="absolute text-xs top-0 bg-green-500 bg-opacity-25">{{ stem.chords }}</div>
      <img :src=stem.previewIconPath class="w-4 h-4 absolute bottom-0">
      <div class="absolute bottom-0 right-0 bg-red-500 bg-opacity-25">{{ stem.bpm }}</div>
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

export default {
  name: "Asset",
  props: ['stem'],
  setup(props) {
    let ignoreSelf = false
    const store = inject('store')
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

    watch(() => bus.value.get('stopAllAudio'), (callerId) => {
      if (callerId != props.stem.id) {
        audioTag.value.pause()
        props.stem.previewIconPath = props.stem.previewPlayIconPath
      }
    })

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

      emit('stopAllAudio', stem.id)

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

    setInterval(updateDurations, 100)

    return {audioTag, startDrag, endDrag, mouseOverGridItem, mouseLeaveGridItem, onPlayClip, progressBar}
  }
}
</script>

<style scoped>

</style>