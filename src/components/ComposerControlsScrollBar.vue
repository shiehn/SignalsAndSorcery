<template>
  <div class="w-full absolute bg-gray-500 rounded-full h-2.5" @click="scrubToPosition($event)" v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(200, 247, 197,0.3) ' + progressBar + '%, white ' + progressBar + '%' }">
  </div>
</template>

<script>
import {ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsScrollBar",
  setup() {
    const {bus, emit} = useEventsBus()
    const progressBar = ref(0)

    const scrubToPosition = (event) => {
      event.preventDefault()

      let horizontalPercentage = Math.round((event.clientX - event.target.getBoundingClientRect().x) / event.target.getBoundingClientRect().width * 100)

      const isInt = (value) => {
        let x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
      }

      if (!horizontalPercentage || !isInt(horizontalPercentage)) {
        horizontalPercentage = 0
      }

      emit('scrubTo', horizontalPercentage)
    }

    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
      progressBar.value = progressInt
    })

    return {progressBar, scrubToPosition}
  }
}
</script>

<style scoped>

</style>