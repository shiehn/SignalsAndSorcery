<template>
  <div ref="loopBar" class="flex w-auto bg-green-500 h-6 hover:cursor-pointer"
       @click="clickedLoopBar($event)">
    <div class="w-8 h-6 bg-white">START</div>
    <div class="w-8 h-6 bg-black text-white">END</div>
  </div>
</template>

<script>
import {inject, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsLoopBar",
  setup() {
    const store = inject('store')
    const {bus} = useEventsBus()
    const loopBar = ref(null)

    const clickedLoopBar = (event) => {
      event.preventDefault()

      let horizontalPercentage = Math.round((event.clientX - event.target.getBoundingClientRect().x) / event.target.getBoundingClientRect().width * 100)

      const isInt = (value) => {
        let x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
      }

      if (!horizontalPercentage || !isInt(horizontalPercentage)) {
        horizontalPercentage = 0
      }

      console.log('LOOP_BAR_CLICK_POS', horizontalPercentage)
    }

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    watch(() => bus.value.get('gridDrawCompleted'), (gridDrawCompletedParams) => {
      const w16 = 4 /* assuming each grid item is tailwind w-16 ==  4rem */
      const m1 = 0.25 /* assuming each grid item has tailwind mr-1 ==  0.25rem */
      let calculatedGridWidthRem = store.state.grid[0].value.length * (w16 + m1)

      if (convertRemToPixels(calculatedGridWidthRem) < gridDrawCompletedParams[0].gridContainerRowWidth) {
        loopBar.value.style.width = gridDrawCompletedParams[0].gridContainerRowWidth + 'px'
      } else {
        loopBar.value.style.width = calculatedGridWidthRem + 'rem'
      }
    })

    return {clickedLoopBar, loopBar}
  }
}
</script>

<style scoped>

</style>