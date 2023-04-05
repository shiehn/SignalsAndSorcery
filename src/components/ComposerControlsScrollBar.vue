<template>


<!--  -->
<!--  -->
  <div ref="clickBar" class="w-auto h-6 relative hover:cursor-pointer"

       @click="scrubToPosition($event)" :class="{'h-6': !isMobile, 'h-24': isMobile}">

    <div class="w-full h-1 absolute mt-3"
        v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9) ' + progressBarStart + '%, rgba(200, 247, 197,0.9) ' + progressBar + '%,  rgba(100,100,100,0.9) ' + progressBar + '%' }"
    ></div>


<!--  <div ref="clickBar" class="w-auto h-6 hover:cursor-pointer"-->
<!--       v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9) ' + progressBarStart + '%, rgba(200, 247, 197,0.9) ' + progressBar + '%,  rgba(255,255,255,0.9) ' + progressBar + '%' }"-->
<!--    <div ref="playHead" class="w-2 h-full bg-black"></div>-->
    <div ref="playHead" class="h-3 w-3 absolute bg-white rounded-full mt-2 -ml-2"></div>

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
    const progressBarStart = ref(0)
    const clickBar = ref(null)
    const playHead = ref(null)
    const isMobile = ref(store.isMobile ? true : false)

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

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

      console.log('horizontalPercentage', horizontalPercentage)

      emit('scrubTo', horizontalPercentage)
    }

    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
      progressBar.value = progressInt[0]

      playHead.value.style.marginLeft = (clickBar.value.clientWidth * (.01 * progressInt[0]) - (playHead.value.clientWidth/2)) + 'px'

      // if (progressInt == 0) {
      //   //move the playhead to the startloop
      //   playHead.value.style.marginLeft = (store.state.playBack.loopStartPercent * 0.01 * clickBar.value.clientWidth) + 'px'
      //   return
      // }
      //
      // playHead.value.style.marginLeft = (progressInt * 0.01 * clickBar.value.clientWidth) + 'px'
    })

    const convertRemToPixels = (rem) => {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    watch(() => bus.value.get('gridDrawCompleted'), (gridDrawCompletedParams) => {
      let w16 = 4 /* assuming each grid item is tailwind w-16 ==  4rem */
      let m1 = 0.25 /* assuming each grid item has tailwind mr-1 ==  0.25rem */

      if (store.isMobile) {
        w16 = 8 // mobile support has grid items twice the size of desktop
      }

      let calculatedGridWidthRem = store.state.grid[0].value.length * (w16 + m1)

      if (convertRemToPixels(calculatedGridWidthRem) < gridDrawCompletedParams[0].gridContainerRowWidth) {
        clickBar.value.style.width = gridDrawCompletedParams[0].gridContainerRowWidth + 'px'
      } else {
        clickBar.value.style.width = calculatedGridWidthRem + 'rem'
      }
    })

    return {
      clickBar,
      isMobile,
      playHead,
      progressBar,
      progressBarStart,
      scrubToPosition
    }
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

.noisy {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==');
}
</style>