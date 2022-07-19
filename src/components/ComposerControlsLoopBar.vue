<template>
  <div ref="loopBar" id="loopBar" class="relative w-auto h-6 hover:cursor-pointer"
       v-bind:style="{backgroundSize: bgGridWidth + 'px ' + bgGridHeight + 'px' }"
       @click="clickedLoopBar($event)">
<!--    <label v-for="item in bgGridLabels">{{item}}</label>-->
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

    const bgGridWidth = ref(50)
    const bgGridHeight = ref(20)
    // const bgGridLabels = ref([])

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

    let loopMarketStartXPercentCache = 0
    let loopMarketEndXPercentCache = 50

    const clickedLoopBar = (event) => {
      event.preventDefault()
      const mouseXPosPercentage = getMouseXPosPercentage(event)

      if (moveStartOrEndMarker(event) === 'start') {
        const marginLeft = getXPosOfCurrentColStart(mouseXPosPercentage)
        //set the visual start loop marker
        startLoop.value.style.marginLeft = marginLeft + 'px'
        //set the playback start loop point

        const loopStartPos = Math.round(marginLeft / loopBar.value.clientWidth * 100)
        store.state.playBack.loopStartPercent = loopStartPos
        //CACHE THE PERCENT FOR RESIZE PURPOSES
        loopMarketStartXPercentCache = loopStartPos
      } else { //move end marker
        //set the visual end loop marker
        const marginLeft = getXPosOfCurrentColEnd(mouseXPosPercentage) - endLoop.value.getBoundingClientRect().width
        endLoop.value.style.marginLeft = marginLeft + 'px'
        //set the playback end loop point
        store.state.playBack.loopEndPercent = Math.round(getXPosOfCurrentColEnd(mouseXPosPercentage) / loopBar.value.clientWidth * 100)
        //CACHE THE PERCENT FOR RESIZE PURPOSES
        loopMarketEndXPercentCache = Math.round(marginLeft / loopBar.value.clientWidth * 100)
      }
    }

    /*

     */

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    const getRelativeWidthOfCol = () => {
      return Math.round(loopBar.value.getBoundingClientRect().width / store.state.grid[0].value.length)
    }

    const getGridLabels = () => {
      const gridLabels = []

      for(let i=0; i<store.state.grid[0].value.length; i++) {
        gridLabels.push(i)
      }

      return gridLabels
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

      //SET START/END LOOP MARKER POSITIONS
      startLoop.value.style.marginLeft = getXPosOfCurrentColStart(loopMarketStartXPercentCache) + 'px'
      endLoop.value.style.marginLeft = getXPosOfCurrentColEnd(loopMarketEndXPercentCache) - endLoop.value.getBoundingClientRect().width + 'px'

      //SET THE GRID RULER COLUMN WIDTH
      bgGridWidth.value = getRelativeWidthOfCol()
      // bgGridLabels.value = getGridLabels()
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

        const loopStartPos = Math.round(marginLeft / loopBar.value.clientWidth * 100)
        store.state.playBack.loopStartPercent = loopStartPos

        //cache da shit
        loopMarketStartXPercentCache = loopStartPos
      }
    }

    const finishEndLoopDrag = ($event) => {
      const mousePosRelativeToBar = $event.clientX - loopBar.value.getBoundingClientRect().x
      const scrollBarWidth = loopBar.value.getBoundingClientRect().width
      const startLoopXRelativeToBar = startLoop.value.getBoundingClientRect().x - loopBar.value.getBoundingClientRect().x
      if (mousePosRelativeToBar > 0 && mousePosRelativeToBar < scrollBarWidth && mousePosRelativeToBar > startLoopXRelativeToBar + startLoop.value.getBoundingClientRect().width + endLoop.value.getBoundingClientRect().width) {
        const mouseXPosPercentage = Math.round(mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100)
        const marginLeft = getXPosOfCurrentColEnd(mouseXPosPercentage) - endLoop.value.getBoundingClientRect().width
        endLoop.value.style.marginLeft = marginLeft + 'px'
        store.state.playBack.loopEndPercent = Math.round(getXPosOfCurrentColEnd(mouseXPosPercentage) / loopBar.value.clientWidth * 100)

        //cache da shit
        loopMarketEndXPercentCache = Math.round(marginLeft / loopBar.value.clientWidth * 100)
      }
    }

    return {
      // bgGridLabels,
      bgGridWidth,
      bgGridHeight,
      clickedLoopBar,
      endLoop,
      finishEndLoopDrag,
      finishStartLoopDrag,
      imageAssets,
      loopBar,
      startLoop
    }
  }
}
</script>

<style scoped>
#loopBar {
  background-color: #ffffff;
  background-image: linear-gradient(90deg,
  rgba(73, 73, 73, 0.5) 0,
  rgba(73, 73, 73, 0.5) 2%,
  transparent 2%
  ),
  linear-gradient(180deg,
      #ffffff 50%,
      transparent 50%
  ),
  linear-gradient(90deg,
      transparent 25%,
      rgba(73, 73, 73, 0.5) 25%,
      rgba(73, 73, 73, 0.5) 27%,
      transparent 27%,
      transparent 50%,
      rgba(73, 73, 73, 0.5) 50%,
      rgba(73, 73, 73, 0.5) 52%,
      transparent 52%,
      transparent 75%,
      rgba(73, 73, 73, 0.5) 75%,
      rgba(73, 73, 73, 0.5) 77%,
      transparent 77%
  ),
  linear-gradient(180deg,
      #ffffff 70%,
      transparent 70%
  ),
  linear-gradient(90deg,
      transparent 12.5%,
      rgba(73, 73, 73, 0.4) 12.5%,
      rgba(73, 73, 73, 0.4) 14.5%,
      transparent 12.5%,
      transparent 37.5%,
      rgba(73, 73, 73, 0.4) 37.5%,
      rgba(73, 73, 73, 0.4) 39.5%,
      transparent 39.5%,
      transparent 62.5%,
      rgba(73, 73, 73, 0.4) 62.5%,
      rgba(73, 73, 73, 0.4) 64.5%,
      transparent 64.5%,
      transparent 87.5%,
      rgba(73, 73, 73, 0.4) 87.5%,
      rgba(73, 73, 73, 0.4) 89.5%,
      transparent 89.5%
  );
  /*background-size: 50px 20px;*/
  background-repeat: repeat-x;
  min-height: 20px;

  /* only needed for labels */
  white-space: nowrap;
  font-size: 0;
  margin: 0;
  padding: 0;
}

/*label {*/
/*  font-size: 9px;*/
/*  padding-top: 2px;*/
/*  display: inline-block;*/
/*  width: 100px;*/
/*  text-indent: 3px;*/
/*}*/
</style>