<template>
  <div ref="clickBar" class="w-auto horizontal-line rounded-lg h-6 hover:cursor-pointer"
       @click="scrubToPosition($event)">
    <div ref="playHead" class="w-2 h-full bg-black"></div>
  </div>
</template>

<script>
import {nextTick, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";
import {inject} from "vue";
//v-bind:style="{backgroundImage: 'linear-gradient(to right, green ' + progressBar + '%, rgb(227, 213, 182) ' + progressBar + '%' }"
export default {
  name: "ComposerControlsScrollBar",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const progressBar = ref(0)
    const clickBar = ref(null)
    const playHead = ref(null)

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
      if(progressInt == 0){
        //move the playhead to the startloop
        playHead.value.style.marginLeft = (store.state.playBack.loopStartPercent * 0.01 * clickBar.value.clientWidth) + 'px'
        return
      }

      playHead.value.style.marginLeft = (progressInt * 0.01 * clickBar.value.clientWidth) + 'px'
    })

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    watch(() => bus.value.get('gridDrawCompleted'), (gridDrawCompletedParams) => {
      const w16 = 4 /* assuming each grid item is tailwind w-16 ==  4rem */
      const m1 = 0.25 /* assuming each grid item has tailwind mr-1 ==  0.25rem */
      let calculatedGridWidthRem = store.state.grid[0].value.length * (w16 + m1)

      if(convertRemToPixels(calculatedGridWidthRem) < gridDrawCompletedParams[0].gridContainerRowWidth) {
        clickBar.value.style.width = gridDrawCompletedParams[0].gridContainerRowWidth + 'px'
      } else {
        clickBar.value.style.width = calculatedGridWidthRem + 'rem'
      }
    })

    return {clickBar, playHead, progressBar, scrubToPosition}
  }
}
</script>

<style scoped>
.horizontal-line {
  background: linear-gradient(180deg,
  rgba(0, 0, 0, 0) calc(50% - 1px),
  rgba(192, 192, 192, 1) calc(50%),
  rgba(0, 0, 0, 0) calc(50% + 1px)
  );
}
</style>