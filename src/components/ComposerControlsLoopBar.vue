<template>
  <div ref="loopBar" class="relative w-auto h-6 hover:cursor-pointer"
       @click="clickedLoopBar($event)">
    <img ref="startLoop"
         :src="imageAssets.loopStartMarker"
         draggable="true"
         @drag="finishStartLoopDrag($event)"
         class="absolute w-8 h-6"/>
    <img ref="endLoop"
         :src="imageAssets.loopEndMarker"
         draggable="true"
         @drag="finishEndLoopDrag($event)"
         class="absolute w-8 h-6"/>
  </div>
</template>

<script>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsLoopBar",
  setup() {
    const store = inject('store')
    const {bus} = useEventsBus()
    const loopBar = ref(null)
    const startLoop = ref(null)
    const endLoop = ref(null)

    const imageAssets = {
      loopStartMarker: store.state.staticUrl + 'icons/loop-start-marker.png',
      loopEndMarker: store.state.staticUrl + 'icons/loop-end-marker.png',
    }

    const getMouseXPosPercentage = (event) => {
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
      nextTick(() => {
        startLoop.value.style.marginLeft = (store.state.playBack.loopStartPercent * 0.01 * loopBar.value.clientWidth) + 'px'
        endLoop.value.style.marginLeft = (store.state.playBack.loopEndPercent * 0.01 * loopBar.value.clientWidth) + 'px'
      })
    })

    const getPointBetweenStartAndEnd = () => {
      const start = parseInt(startLoop.value.style.marginLeft.replace('px', ''))
      const end = parseInt(endLoop.value.style.marginLeft.replace('px', ''))

      return (end - start) / 2
    }

    const moveStartOrEndMarker = (event) => {
      const start = parseInt(startLoop.value.style.marginLeft.replace('px', ''))

      const mousePosX = event.clientX - event.target.getBoundingClientRect().x

      if (mousePosX < (getPointBetweenStartAndEnd() + start)) {
        return 'start'
      }

      return 'end'
    }

    const getXPosOfCurrentColStart = (mousePosPer) => {
      const numOfCol = store.state.grid[0].value.length
      const widthOfCol = loopBar.value.getBoundingClientRect().width / numOfCol
      const currentCol = Math.round(numOfCol * mousePosPer * 0.01)
      const xPosOfCurrentCol = (currentCol) * widthOfCol
      return xPosOfCurrentCol
    }

    const getXPosOfCurrentColEnd = (mousePosPer) => {
      const numOfCol = store.state.grid[0].value.length
      const widthOfCol = loopBar.value.getBoundingClientRect().width / numOfCol
      const currentCol = Math.round(numOfCol * mousePosPer * 0.01)
      const xPosOfCurrentCol = (currentCol) * widthOfCol
      return xPosOfCurrentCol
    }

    const clickedLoopBar = (event) => {
      event.preventDefault()
      const mouseXPosPercentage = getMouseXPosPercentage(event)

      if (moveStartOrEndMarker(event) === 'start') {
        const marginLeft = getXPosOfCurrentColStart(mouseXPosPercentage)
        //set the visual start loop marker
        startLoop.value.style.marginLeft = marginLeft + 'px'
        //set the playback start loop point
        store.state.playBack.loopStartPercent = Math.round(marginLeft / loopBar.value.clientWidth * 100)
      } else { //move end marker
        //set the visual end loop marker
        endLoop.value.style.marginLeft = getXPosOfCurrentColEnd(mouseXPosPercentage) - endLoop.value.getBoundingClientRect().width + 'px'
        //set the playback end loop point
        store.state.playBack.loopEndPercent = Math.round(getXPosOfCurrentColEnd(mouseXPosPercentage) / loopBar.value.clientWidth * 100)
      }
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

    watch(() => bus.value.get('resetPlayhead'), (gridDrawCompletedParams) => {
      store.state.playBack.loopStartPercent = 0
      store.state.playBack.loopEndPercent = 100
      startLoop.value.style.marginLeft = '0px'
      endLoop.value.style.marginLeft = loopBar.value.getBoundingClientRect().width - endLoop.value.getBoundingClientRect().width + 'px'
    })

    const finishStartLoopDrag = ($event) => {
      const mousePosRelativeToBar = $event.clientX - loopBar.value.getBoundingClientRect().x
      const scrollBarWidth = loopBar.value.getBoundingClientRect().width
      const endLoopXRelativeToBar = endLoop.value.getBoundingClientRect().x - endLoop.value.getBoundingClientRect().width - loopBar.value.getBoundingClientRect().x
      if (mousePosRelativeToBar > 0 && mousePosRelativeToBar < scrollBarWidth && mousePosRelativeToBar < endLoopXRelativeToBar) {

        const mouseXPosPercentage = Math.round(mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100)
        const marginLeft = getXPosOfCurrentColStart(mouseXPosPercentage)
        startLoop.value.style.marginLeft = marginLeft + 'px'
        store.state.playBack.loopStartPercent = Math.round(marginLeft / loopBar.value.clientWidth * 100)
      }
    }

    const finishEndLoopDrag = ($event) => {
      const mousePosRelativeToBar = $event.clientX - loopBar.value.getBoundingClientRect().x
      const scrollBarWidth = loopBar.value.getBoundingClientRect().width
      const startLoopXRelativeToBar = startLoop.value.getBoundingClientRect().x - loopBar.value.getBoundingClientRect().x
      if (mousePosRelativeToBar > 0 && mousePosRelativeToBar < scrollBarWidth && mousePosRelativeToBar > startLoopXRelativeToBar + startLoop.value.getBoundingClientRect().width + endLoop.value.getBoundingClientRect().width) {


        const mouseXPosPercentage = Math.round(mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100)
        endLoop.value.style.marginLeft = getXPosOfCurrentColEnd(mouseXPosPercentage) - endLoop.value.getBoundingClientRect().width + 'px'
        store.state.playBack.loopEndPercent = Math.round(getXPosOfCurrentColEnd(mouseXPosPercentage) / loopBar.value.clientWidth * 100)


       // dkdkdkdkdkdkdkdkdk

        // endLoop.value.style.marginLeft = mousePosRelativeToBar - endLoop.value.getBoundingClientRect().width + 'px'
        // store.state.playBack.loopEndPercent = mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100

      }
    }

    return {clickedLoopBar, endLoop, finishEndLoopDrag, finishStartLoopDrag, imageAssets, loopBar, startLoop}
  }
}
</script>

<style scoped>

</style>