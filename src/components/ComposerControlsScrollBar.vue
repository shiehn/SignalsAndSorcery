<template>
  <div ref="clickBar" class="w-auto bg-gray-500 rounded-lg h-6 hover:cursor-pointer mt-4"
       @click="scrubToPosition($event)"
       v-bind:style="{backgroundImage: 'linear-gradient(to right, green ' + progressBar + '%, rgb(227, 213, 182) ' + progressBar + '%' }">
  </div>
</template>

<script>
import {nextTick, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsScrollBar",
  setup() {
    const {bus, emit} = useEventsBus()
    const progressBar = ref(0)
    const clickBar = ref(null)

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

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    watch(() => bus.value.get('gridDrawCompleted'), (gridDrawCompletedParams) => {
      const w16 = 4 /* assuming each grid item is tailwind w-16 ==  4rem */
      const m1 = 0.25 /* assuming each grid item has tailwind mr-1 ==  0.25rem */
      let gridWidthRem = gridDrawCompletedParams[0].numOfGridCols * (w16 + m1)

      if(convertRemToPixels(gridWidthRem) < gridDrawCompletedParams[0].gridContainerRowWidth) {
        console.log('xxx calculated less than width')
        clickBar.value.style.width = gridDrawCompletedParams[0].gridContainerRowWidth + 'px'
      } else {
        console.log('xxx calculated greater than width')
        clickBar.value.style.width = gridWidthRem + 'rem'
      }
    })

    return {clickBar, progressBar, scrubToPosition}
  }
}
</script>

<style scoped>

</style>