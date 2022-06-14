<template>
  <div class="w-1/6 h-48 border-2 border-black rounded-lg p-2 my-2">
    <global-track-values></global-track-values>
    <button class="h-10 w-10" @click="downloadMix()"><img
        :src="imageAssets.downloadBtn" class="h-24"/>
    </button>
  </div>
</template>

<script>
import GlobalTrackValues from "./GlobalTrackValues";
import {inject} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "AdminPanel",
  components: {GlobalTrackValues},
  setup() {
    const {emit} = useEventsBus()
    const store = inject('store')

    const downloadMix = () => {
      emit('downloadMix')
    }

    const imageAssets = {
      // playBtn: store.state.staticUrl + 'icons/play-button.png',
      // pauseBtn: store.state.staticUrl + 'icons/pause-button.png',
      // stopBtn: store.state.staticUrl + 'icons/stop-button.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    return {
      downloadMix,
      imageAssets,
    }
  },
}
</script>

<style scoped>

</style>