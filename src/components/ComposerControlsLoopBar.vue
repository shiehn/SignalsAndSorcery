<template>
  <div ref="loopBar" class="relative w-auto bg-green-500 h-6 hover:cursor-pointer"
       @click="clickedLoopBar($event)">
    <div ref="startLoop" class="absolute w-8 h-6 bg-white">START</div>
    <div ref="endLoop" class="absolute w-8 h-6 bg-black text-white">END</div>
  </div>
</template>

<script>
import {inject, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsLoopBar",
  setup() {
    const store = inject('store')
    const {bus} = useEventsBus()
    const loopBar = ref(null)
    const startLoop = ref(null)
    const endLoop = ref(null)

    const getXPosPercentage = (event) => {
      let clickXPosPercentage = Math.round((event.clientX - event.target.getBoundingClientRect().x) / event.target.getBoundingClientRect().width * 100)

      const isInt = (value) => {
        let x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
      }

      if (!clickXPosPercentage || !isInt(clickXPosPercentage)) {
        clickXPosPercentage = 0
      }

      return clickXPosPercentage
    }

    onMounted(() => {
      startLoop.value.style.marginLeft = 0 + 'px'
      endLoop.value.style.marginLeft = 400 + 'px'
    })

    const getPointBetweenStartAndEnd = () => {
      const start = parseInt(startLoop.value.style.marginLeft.replace('px', ''))
      const end = parseInt(endLoop.value.style.marginLeft.replace('px', ''))

      return (end - start) / 2
    }

    const moveStartOrEndMarker = (event) => {
      const start = parseInt(startLoop.value.style.marginLeft.replace('px', ''))

      const mousePosX = event.clientX - event.target.getBoundingClientRect().x

      if(mousePosX < (getPointBetweenStartAndEnd() + start)){
        return 'start'
      }

      return 'end'
    }

    const clickedLoopBar = (event) => {
      event.preventDefault()

      console.log('middle', getPointBetweenStartAndEnd())

      if(moveStartOrEndMarker(event) === 'start') {
        startLoop.value.style.marginLeft = Math.round((event.clientX - event.target.getBoundingClientRect().x)) + 'px'
      } else { //move end marker
        endLoop.value.style.marginLeft = Math.round((event.clientX - event.target.getBoundingClientRect().x)) + 'px'
      }


      //console.log('startLoop.value.style.marginLeft', Math.round((event.clientX - event.target.getBoundingClientRect().x)) + 'px')

      // console.log('LOOP_BAR_WIDTH', event.target.getBoundingClientRect().width)
      // console.log('LOOP_BAR_CLICK_POS', getXPosPercentage(event))
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

    return {clickedLoopBar, endLoop, loopBar, startLoop}
  }
}
</script>

<style scoped>

</style>