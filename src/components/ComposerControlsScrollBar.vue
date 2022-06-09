<template>
  <div class="bg-gray-500 rounded-lg h-6 hover:cursor-pointer" @click="scrubToPosition($event)" v-bind:style="{backgroundImage: 'linear-gradient(to right, green ' + progressBar + '%, rgb(227, 213, 182) ' + progressBar + '%' }">
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