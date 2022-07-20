<template>

  <div class="flex justify-center px-2">
    <div class="rounded-lg">
      <div class="flex m-auto center align-middle rounded-lg">
        <label for="arpCtrlPattern" class="text-sm">TYPE</label>
        <select v-if="arpCtrlPattern != undefined" v-model="arpCtrlPattern" @change="handleSelection($event)"
                id="arpCtrlPattern"
                class="w-2 h-2 px-4 m-auto center align-middle overflow-hidden text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlPatternOptions">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="w-20 h-20 border-2 border-black rounded-lg p-2 mt-1">
        <svg viewBox="0 0 10 10" xmlns:xlink="http://www.w3.org/1999/xlink">
          <polyline :points='arpCtrlSVG.polyline'></polyline>
        </svg>
      </div>
    </div>
  </div>

</template>

<script>
import {inject, reactive, ref} from "vue";
import useEventsBus from "../../../events/eventBus";

export default {
  name: "PatternSelector",
  setup(props, {emit}) {
    const store = inject('store')
    const {bus} = useEventsBus()

    const arpCtrlSVG = reactive({
      steps: '',
      polyline: ''
    })
    const arpCtrlPattern = ref('1315')
    const arpCtrlPatternOptions = ref(['1315', '1135', '1151', '8531', '1813'])

    const renderSelectedArp = (index) => {
      let selectedPattern = arpCtrlPatternOptions.value[index]

      arpCtrlSVG.steps = selectedPattern.split('').join(' ')
      arpCtrlSVG.polyline = ''

      let xSpacing = 2
      let currentXSpacing = 0
      let selectedPatternArray = selectedPattern.split('')
      for (let i = 0; i < selectedPatternArray.length; i++) {
        currentXSpacing += xSpacing
        arpCtrlSVG.polyline += currentXSpacing + ',' + (8 - selectedPatternArray[i]) + ' '
      }
      arpCtrlSVG.polyline.trim()
    }

    renderSelectedArp(0)

    const handleSelection = (event) => {
      renderSelectedArp(event.target.selectedIndex)

      emit('handleArpChanges', 'pattern', arpCtrlPattern.value)
    }


    // let patterns = []
    // for (let p = 0; p < arpCtrlPatternOptions.value.length; p++) {
    //   patterns.push(arpCtrlPatternOptions.value[p].split(''))
    // }
    //
    // let svgArps = reactive([])
    // const xSpacing = 2

    // for(let i=0; i<patterns.length; i++){
    //   const svgArp = {
    //     steps: patterns[i].join(' '),
    //     polyline: '',
    //   }
    //
    //   let currentXSpacing = 0
    //   for(let j=0; j<patterns[i].length; j++){
    //     svgArp.polyline += currentXSpacing + xSpacing + ',' + (8-patterns[i][j]) + ' '
    //     currentXSpacing = currentXSpacing + xSpacing
    //   }
    //   svgArp.polyline = svgArp.polyline.trim()
    //
    //   svgArps.push(svgArp)
    // }

    return {
      arpCtrlPattern,
      arpCtrlPatternOptions,
      handleSelection,
      arpCtrlSVG,
    }
  }
}
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

svg polyline {
  fill: none;
  stroke: black;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>