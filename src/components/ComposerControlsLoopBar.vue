<template>
  <div v-if="!isMobile" ref="loopBar" id="loopBar" class="grid grid-cols-8 justify-between w-full h-6 rounded overflow-hidden opacity-75 hover:cursor-pointer"
       v-bind:style="{backgroundSize: bgGridWidth + 'px ' + bgGridHeight + 'px' }"
       :class="{ 'h-24': isMobile, 'h-6': !isMobile }"
       @click="clickedLoopBar($event)">

    <!-- ONE ONE ONE -->
    <div class="w-1/8 h-6 grid justify-items-start"
         :class="{ 'bg-gradient-to-r from-black': loopOneStart }"
         @click="onLoopBarClicked(0, true)">
          <img v-show="loopOneStart" :src="imageAssets.loopStartMarker" class="w-6 h-6" />
    </div>
    <div class="w-1/8 h-6 grid justify-items-end"
         :class="{ 'bg-gradient-to-l from-black': loopOneEnd }"
         @click="onLoopBarClicked(0, false)">
      <img v-show="loopOneEnd" :src="imageAssets.loopEndMarker" class="w-6 h-6" />
    </div>

    <!-- TWO TWO TWO -->
    <div class="w-1/8 h-6 grid justify-items-start"
         :class="{ 'bg-gradient-to-r from-black': loopTwoStart, 'border-l-2 border-black': loopOneEnd }"
         @click="onLoopBarClicked(1, true)">
      <img v-show="loopTwoStart" :src="imageAssets.loopStartMarker" class="w-6 h-6" />
    </div>
    <div class="w-1/8 h-6 grid justify-items-end"
         :class="{ 'bg-gradient-to-l from-black': loopTwoEnd }"
         @click="onLoopBarClicked(1, false)">
      <img v-show="loopTwoEnd" :src="imageAssets.loopEndMarker" class="w-6 h-6" />
    </div>

    <!-- THREE THREE THREE -->
    <div class="w-1/8 h-6 grid justify-items-start"
         :class="{ 'bg-gradient-to-r from-black': loopThreeStart, 'border-l-2 border-black': loopTwoEnd }"
         @click="onLoopBarClicked(2, true)">
      <img v-show="loopThreeStart" :src="imageAssets.loopStartMarker" class="w-6 h-6" />
    </div>
    <div class="w-1/8 h-6 grid justify-items-end"
         :class="{ 'bg-gradient-to-l from-black': loopThreeEnd }"
         @click="onLoopBarClicked(2, false)">
      <img v-show="loopThreeEnd" :src="imageAssets.loopEndMarker" class="w-6 h-6" />
    </div>

    <!-- FOUR FOUR FOUR -->
    <div class="w-1/8 h-6 grid justify-items-start"
         :class="{ 'bg-gradient-to-r from-black': loopFourStart, 'border-l-2 border-black': loopThreeEnd}"
         @click="onLoopBarClicked(3, true)">
      <img v-show="loopFourStart" :src="imageAssets.loopStartMarker" class="w-6 h-6" />
    </div>
    <div class="w-1/8 h-6 grid justify-items-end"
               :class="{ 'bg-gradient-to-l from-black': loopFourEnd }"
               @click="onLoopBarClicked(3, false)">
      <img v-show="loopFourEnd" :src="imageAssets.loopFarEndMarker" class="w-6 h-6" />
    </div>


  </div>
</template>

<script>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerControlsLoopBar",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const loopBar = ref(null)

    const bgGridWidth = ref(50)
    const bgGridHeight = ref(20)
    const isMobile = ref(store.isMobile ? true : false)

    const imageAssets = {
      loopStartMarker: store.state.staticUrl + 'icons/loop-bar-left-white.png',
      loopEndMarker: store.state.staticUrl + 'icons/loop-bar-right-white.png',
      loopFarEndMarker: store.state.staticUrl + 'icons/loop-bar-right-white-end.png',
    }

    const loopOneActive = ref(false)
    const loopTwoActive = ref(false)
    const loopThreeActive = ref(false)
    const loopFourActive = ref(false)

    const loopOneStart = ref(false)
    const loopOneEnd = ref(false)

    const loopTwoStart = ref(false)
    const loopTwoEnd = ref(false)

    const loopThreeStart = ref(false)
    const loopThreeEnd = ref(false)

    const loopFourStart = ref(false)
    const loopFourEnd = ref(false)



    // const getLeftActive = (bars) => {
    //   for (let i = 0; i < bars.length; i++) {
    //     if (bars[i].value) {
    //       return i
    //     }
    //   }
    //
    //   return -1
    // }
    //
    // const getRightActive = (bars) => {
    //   for (let i = bars.length - 1; i >= 0; i--) {
    //     if (bars[i].value) {
    //       return i
    //     }
    //   }
    //
    //   return -1
    // }

    // const fillLoopBarGaps = (left, right) => {
    //   let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
    //
    //   for (let i = left; i < right + 1; i++) {
    //     bars[i].value = true
    //   }
    // }

    // const setMarkers = (left, right) => {
    //   switch (left) {
    //     case 0:
    //       loopOneStart.value = true
    //       break
    //     case 1:
    //       loopTwoStart.value = true
    //       break
    //     case 2:
    //       loopThreeStart.value = true
    //       break
    //     case 3:
    //       loopFourStart.value = true
    //       break
    //   }
    //
    //   switch (right) {
    //     case 0:
    //       loopOneEnd.value = true
    //       break
    //     case 1:
    //       loopTwoEnd.value = true
    //       break
    //     case 2:
    //       loopThreeEnd.value = true
    //       break
    //     case 3:
    //       loopFourEnd.value = true
    //       break
    //   }
    // }

    const clearMarkers = () => {
      loopOneStart.value = false
      loopOneEnd.value = false

      loopTwoStart.value = false
      loopTwoEnd.value = false

      loopThreeStart.value = false
      loopThreeEnd.value = false

      loopFourStart.value = false
      loopFourEnd.value = false
    }

    const clearLoops = () => {
      loopOneActive.value = false
      loopTwoActive.value = false
      loopThreeActive.value = false
      loopFourActive.value = false
    }

    const setDefaultLoopsAndMakers = () => {
      loopOneActive.value = true
      loopTwoActive.value = true
      loopThreeActive.value = true
      loopFourActive.value = true

      clearMarkers()

      loopOneStart.value = true
      loopFourEnd.value = true
    }

    // const handleLoopBars = () => {
    //   let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
    //
    //   const leftActive = getLeftActive(bars)
    //   const rightActive = getRightActive(bars)
    //
    //   if (leftActive != -1 && rightActive != -1) {
    //     fillLoopBarGaps(leftActive, rightActive)
    //
    //     store.state.playBack.loopStartPercent = leftActive * 25
    //     store.state.playBack.loopEndPercent = (rightActive + 1) * 25
    //
    //     //SET MARKERS
    //     clearMarkers()
    //     setMarkers(leftActive, rightActive)
    //   } else {
    //     store.state.playBack.loopStartPercent = 0
    //     store.state.playBack.loopEndPercent = 100
    //   }
    // }

    // const getNumberOfLoopedBars = () => {
    //   let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
    //   let count = 0
    //
    //   for (let i = 0; i < bars.length; i++) {
    //     if (bars[i].value) {
    //       count++
    //     }
    //   }
    //
    //   return count
    // }

    // const isCurrentBarLooped = (barNumber) => {
    //   let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
    //   return bars[barNumber].value
    // }

    const getCurStartPos = () => {
      let bars = [loopOneStart, loopTwoStart, loopThreeStart, loopFourStart]
      for (let i = 0; i < bars.length; i++) {
        if (bars[i].value) {
          return i
        }
      }
      return -1
    }

    const getCurrentEndPos = () => {
      let bars = [loopOneEnd, loopTwoEnd, loopThreeEnd, loopFourEnd]
      for (let i = 0; i < bars.length; i++) {
        if (bars[i].value) {
          return i
        }
      }
      return -1
    }

    const clearActiveLeftOf = (index) => {
      let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
      let startMarkers = [loopOneStart, loopTwoStart, loopThreeStart, loopFourStart]
      let endMarkers = [loopOneEnd, loopTwoEnd, loopThreeEnd, loopFourEnd]
      for (let i = 0; i < bars.length; i++) {
        if(i<index){
          bars[i].value = false
          startMarkers[i].value = false
          endMarkers[i].value = false
        }
      }
    }

    const clearActiveRightOf = (index) => {
      let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
      let startMarkers = [loopOneStart, loopTwoStart, loopThreeStart, loopFourStart]
      let endMarkers = [loopOneEnd, loopTwoEnd, loopThreeEnd, loopFourEnd]
      for (let i = 0; i < bars.length; i++) {
        if(i>index){
          bars[i].value = false
          startMarkers[i].value = false
          endMarkers[i].value = false
        }
      }
    }

    const setStartMarker = (index) => {
      let startMarkers = [loopOneStart, loopTwoStart, loopThreeStart, loopFourStart]
      for (let i = 0; i < startMarkers.length; i++) {
        if(i===index){
          startMarkers[i].value = true
        } else {
          startMarkers[i].value = false
        }
      }
    }

    const setEndMarker = (index) => {
      let endMarkers = [loopOneEnd, loopTwoEnd, loopThreeEnd, loopFourEnd]
      for (let i = 0; i < endMarkers.length; i++) {
        if(i===index){
          endMarkers[i].value = true
        } else {
          endMarkers[i].value = false
        }
      }
    }

    const setActiveBetweenStartEndMakers = () => {
      let bars = [loopOneActive, loopTwoActive, loopThreeActive, loopFourActive]
      let startMarkers = [loopOneStart, loopTwoStart, loopThreeStart, loopFourStart]
      let endMarkers = [loopOneEnd, loopTwoEnd, loopThreeEnd, loopFourEnd]
      let start = -1
      let end = -1
      for (let i = 0; i < bars.length; i++) {
        if(startMarkers[i].value){
          start = i
        }
        if(endMarkers[i].value){
          end = i
        }
      }
      if(start !== -1 && end !== -1){
        for (let i = 0; i < bars.length; i++) {
          if(i>=start && i<=end){
            bars[i].value = true
          } else {
            bars[i].value = false
          }
        }
      }
    }

    const onLoopBarClicked = (loopNumber, isStartMarker) => {
      const prevStartPos = getCurStartPos()
      const prevEndPos = getCurrentEndPos()

      if (isStartMarker){
        //START MAKER CODE
        //right or left of prev start

        if (loopNumber > prevStartPos) {
          //SHIFT START RIGHT
          if(loopNumber > prevEndPos){
            //clear everything, set start and end
            setStartMarker(loopNumber)
            setEndMarker(loopNumber)
            setActiveBetweenStartEndMakers()
          } else {
            setStartMarker(loopNumber)
            setActiveBetweenStartEndMakers()
          }
        } else {
          //SHIFT START LEFT
          clearActiveLeftOf(loopNumber)
          setStartMarker(loopNumber)
          setActiveBetweenStartEndMakers()
        }

      }else{
        //END MAKER CODE
        if(loopNumber < prevEndPos){
          //SHIFT END LEFT
          if (loopNumber < prevStartPos){
            //CLEAR EVERYTHING AND SET START AND END
            setStartMarker(loopNumber)
            setEndMarker(loopNumber)
            setActiveBetweenStartEndMakers()
          } else {
            //SHIFT END LEFT
            setEndMarker(loopNumber)
            clearActiveRightOf(loopNumber)
          }
        } else {
          //SHIFT END RIGHT
          setEndMarker(loopNumber)
          setActiveBetweenStartEndMakers()
        }
      }

      store.state.playBack.loopStartPercent = getCurStartPos() * 25
      store.state.playBack.loopEndPercent = (getCurrentEndPos() + 1) * 25

      emit('updateLoopPositions')
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
        if (isMobile.value) {
          bgGridHeight.value = bgGridHeight.value * 4
        }

        setDefaultLoopsAndMakers()
      })
    })

    const clickedLoopBar = (event) => {
      event.preventDefault()
      //emit('stopAllAudio', 'loopBar')
    }

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    const getRelativeWidthOfCol = () => {
      return Math.round(loopBar.value.getBoundingClientRect().width / store.state.grid[0].value.length)
    }

    const getGridLabels = () => {
      const gridLabels = []

      for (let i = 0; i < store.state.grid[0].value.length; i++) {
        gridLabels.push(i)
      }

      return gridLabels
    }

    watch(() => bus.value.get('clearLoops'), () => {
      setDefaultLoopsAndMakers()

      store.state.playBack.loopStartPercent = 0
      store.state.playBack.loopEndPercent = 100
    })

    watch(() => bus.value.get('gridDrawCompleted'), (gridDrawCompletedParams) => {
      if (!loopBar.value) {
        return
      }

      const w16 = 4 /* assuming each grid item is tailwind w-16 ==  4rem */
      const m1 = 0.25 /* assuming each grid item has tailwind mr-1 ==  0.25rem */
      let calculatedGridWidthRem = store.state.grid[0].value.length * (w16 + m1)

      if (convertRemToPixels(calculatedGridWidthRem) < gridDrawCompletedParams[0].gridContainerRowWidth) {
        loopBar.value.style.width = gridDrawCompletedParams[0].gridContainerRowWidth + 'px'
      } else {
        loopBar.value.style.width = calculatedGridWidthRem + 'rem'
      }

      //SET START/END LOOP MARKER POSITIONS
      // startLoop.value.style.marginLeft = getXPosOfCurrentColStart(loopMarketStartXPercentCache) + 'px'
      // endLoop.value.style.marginLeft = getXPosOfCurrentColEnd(loopMarketEndXPercentCache) - endLoop.value.getBoundingClientRect().width + 'px'

      //SET THE GRID RULER COLUMN WIDTH
      bgGridWidth.value = getRelativeWidthOfCol()
      // bgGridLabels.value = getGridLabels()
    })

    watch(() => bus.value.get('resetPlayhead'), (gridDrawCompletedParams) => {
      store.state.playBack.loopStartPercent = 0
      store.state.playBack.loopEndPercent = 100
      // startLoop.value.style.marginLeft = '0px'
      // endLoop.value.style.marginLeft = loopBar.value.getBoundingClientRect().width - endLoop.value.getBoundingClientRect().width + 'px'
    })

    // const finishStartLoopDrag = ($event) => {
    //   const mousePosRelativeToBar = $event.clientX - loopBar.value.getBoundingClientRect().x
    //   const scrollBarWidth = loopBar.value.getBoundingClientRect().width
    //   const endLoopXRelativeToBar = endLoop.value.getBoundingClientRect().x - endLoop.value.getBoundingClientRect().width - loopBar.value.getBoundingClientRect().x
    //   if (mousePosRelativeToBar > 0 && mousePosRelativeToBar < scrollBarWidth && mousePosRelativeToBar < endLoopXRelativeToBar) {
    //     const mouseXPosPercentage = Math.round(mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100)
    //     const marginLeft = getXPosOfCurrentColStart(mouseXPosPercentage)
    //     startLoop.value.style.marginLeft = marginLeft + 'px'
    //
    //     const loopStartPos = marginLeft / loopBar.value.clientWidth * 100
    //     store.state.playBack.loopStartPercent = loopStartPos
    //
    //     //cache da shit
    //     loopMarketStartXPercentCache = loopStartPos
    //   }
    //
    //   emit('stopAllAudio', 'loopBar')
    // }

    // const finishEndLoopDrag = ($event) => {
    //   const mousePosRelativeToBar = $event.clientX - loopBar.value.getBoundingClientRect().x
    //   const scrollBarWidth = loopBar.value.getBoundingClientRect().width
    //   const startLoopXRelativeToBar = startLoop.value.getBoundingClientRect().x - loopBar.value.getBoundingClientRect().x
    //   if (mousePosRelativeToBar > 0 && mousePosRelativeToBar < scrollBarWidth && mousePosRelativeToBar > startLoopXRelativeToBar + startLoop.value.getBoundingClientRect().width + endLoop.value.getBoundingClientRect().width) {
    //     const mouseXPosPercentage = Math.round(mousePosRelativeToBar / loopBar.value.getBoundingClientRect().width * 100)
    //     const marginLeft = getXPosOfCurrentColEnd(mouseXPosPercentage) - endLoop.value.getBoundingClientRect().width
    //     endLoop.value.style.marginLeft = marginLeft + 'px'
    //     store.state.playBack.loopEndPercent = getXPosOfCurrentColEnd(mouseXPosPercentage) / loopBar.value.clientWidth * 100
    //
    //     //cache da shit
    //     loopMarketEndXPercentCache = Math.round(marginLeft / loopBar.value.clientWidth * 100)
    //   }
    //
    //   emit('stopAllAudio', 'loopBar')
    // }

    return {
      // bgGridLabels,
      bgGridWidth,
      bgGridHeight,
      clickedLoopBar,
      // endLoop,
      // finishEndLoopDrag,
      // finishStartLoopDrag,
      loopOneActive,
      loopTwoActive,
      loopThreeActive,
      loopFourActive,
      loopOneStart,
      loopOneEnd,
      loopTwoStart,
      loopTwoEnd,
      loopThreeStart,
      loopThreeEnd,
      loopFourStart,
      loopFourEnd,
      onLoopBarClicked,
      imageAssets,
      isMobile,
      loopBar,
      // startLoop
    }
  }
}
</script>

<style scoped>
#loopBar {
  background-color: #eee;
  background-image: linear-gradient(90deg,
  rgba(73, 73, 73, 0.5) 0,
  rgba(73, 73, 73, 0.5) 2%,
  transparent 2%
  ),
  linear-gradient(180deg,
      #ddd 50%,
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
      #ddd 70%,
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