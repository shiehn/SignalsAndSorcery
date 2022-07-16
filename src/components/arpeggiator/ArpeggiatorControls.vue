<template>
  <!--    TOP ROW-->
  <div class="w-full">
    <div class="flex w-full h-2/3  justify-evenly">
      <div class="">
        <h1 class="text-lg mb-2">ARPEGGIATOR</h1>
        <!--        <div>ARP ID: {{ arpId }}</div>-->
        <!--        <div class="w-full mb-4">-->
        <!--          <span class="text-xs">CHORDS:</span>-->
        <div class="w-full bg-black mb-4 text-white text-xs">{{ arpCtrlChords }}</div>
        <!--        </div>-->
        <div class="flex justify-start">
          <button class="bg-gray-400 rounded-lg p-1 text-sm text-black mr-4">PREVIEW</button>
          <button v-if="displayRenderBtn" class="bg-green-600 rounded-lg p-1 text-sm text-black" @click="renderArpeggios()">RENDER</button>
        </div>
      </div>

      <div class="w-1 h-full bg-gray-300"></div>

      <synth-selector @handleArpChanges="handleArpChanges"></synth-selector>
      <rate-selector></rate-selector>
      <type-selector></type-selector>

      <!--    <div class="flex h-8 justify-between my-1">-->
      <!--      <label for="arpCtrlPattern" class="w-1/3 my-2 text-sm">PATTERN</label>-->
      <!--      <select v-if="arpCtrlPattern != undefined" v-model="arpCtrlPattern" @change="handleArpChanges($event)"-->
      <!--              id="arpCtrlPattern"-->
      <!--              class="w-2/3 text-xs rounded-lg">-->
      <!--        <option :value="item" v-for="item in arpCtrlPatternOptions">{{ item }}-->
      <!--        </option>-->
      <!--      </select>-->
      <!--    </div>-->
      <!--    <div class="flex h-8 justify-between my-1">-->
      <!--      <label for="arpCtrlSynth" class="w-1/3 my-2 text-sm">SYNTH</label>-->
      <!--      <select v-if="arpCtrlSynth != undefined" v-model="arpCtrlSynth" @change="handleArpChanges($event)"-->
      <!--              id="arpCtrlSynth"-->
      <!--              class="w-2/3 text-xs rounded-lg">-->
      <!--        <option :value="item" v-for="item in arpCtrlSynthOptions">{{ item }}-->
      <!--        </option>-->
      <!--      </select>-->
      <!--    </div>-->



    </div>

    <f-x-wrapper></f-x-wrapper>
  </div>
</template>

<script>
import store from "../../store/store";
import {inject, nextTick, ref, watch} from "vue";
import useEventsBus from "../../events/eventBus";
import GridProcessor from "../../processors/grid-processor";
import ArpeggioRenderer from "./arpeggio-renderer";
import RateSelector from "./selector/RateSelector";
import TypeSelector from "./selector/TypeSelector";
import FXWrapper from "./fx/FXWrapper";
import SynthSelector from "./selector/SynthSelector";

export default {
  name: "ArpeggiatorControls",
  components: {SynthSelector, FXWrapper, TypeSelector, RateSelector},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const arpId = ref('arp_id')
    const arpCtrlChords = ref('chords')
    const arpCtrlPattern = ref('pattern_1')
    const arpCtrlPatternOptions = ['pattern_1']
    const arpCtrlRate = ref('quarter')
    const arpCtrlRateOptions = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']
    const arpCtrlSynth = ref('synth_1')
    const arpCtrlSynthOptions = ['synth_1']
    const displayRenderBtn = ref(false)

    let currentRow = undefined
    let currentCol = undefined

    const renderCompleteCallback = function (id) {
      console.log('CALLBACK COMPLETE', id)
      displayRenderBtn.value = true
      new GridProcessor(store.state.grid).updateArpeggioBuffersRendered(id)
    }

    const handleArpChanges = (selection) => {
      alert('HELLO FROM CHILD:' + selection)
      if (currentRow != undefined && currentCol != undefined) {
        const arpeggio = store.state.grid[currentRow].value[currentCol].arpeggio
        if (!arpeggio) {
          console.log('error: arpeggio not found at row:' + currentRow + ' col:' + currentCol)
          return
        }

        new GridProcessor(store.state.grid).updateArpeggioToUnRendered(arpId.value)

        arpeggio.pattern = arpCtrlPattern.value
        arpeggio.rate = arpCtrlRate.value
        arpeggio.chords = arpCtrlChords.value
        arpeggio.synth = arpCtrlSynth.value
        //arpeggio.rendered = false //FLAG THE ARPEGGIO AS UN-RENDERED

        displayRenderBtn.value = arpeggio.on && arpeggio.bufferRendered && !arpeggio.renderedInMix

        console.log('TRIGGER handleArpChanges')
        new ArpeggioRenderer(store).renderBuffer(renderCompleteCallback, arpId.value)
      }
    }

    watch(() => bus.value.get('updateArpeggioControls'), (assetFilter) => {
      if (assetFilter[0].row == undefined || assetFilter[0].col == undefined) {
        return
      }

      currentRow = assetFilter[0].row
      currentCol = assetFilter[0].col

      const arpeggio = store.state.grid[assetFilter[0].row].value[assetFilter[0].col].arpeggio
      if (!arpeggio) {
        return
      }

      //get the chords from the column
      let chords = []
      let chordsStr = store.state.getChordsForCol(assetFilter[0].col)
      if (chordsStr) {
        chords = chordsStr.split(':')
      }

      const globalKey = store.state.globalKey
      if (chords.length < 1 && globalKey) {
        chords = [globalKey, globalKey, globalKey, globalKey]
      }

      arpId.value = arpeggio.id
      displayRenderBtn.value = arpeggio.on && arpeggio.bufferRendered && !arpeggio.renderedInMix
      arpCtrlChords.value = chords.length > 0 ? chords : arpeggio.chords
      arpCtrlPattern.value = arpeggio.pattern
      arpCtrlRate.value = arpeggio.rate

      // if(arpeggio.on) {
      //   console.log('TRIGGER updateArpeggioControls')
      //   new ArpeggioRenderer(store).renderBuffer(renderCompleteCallback, arpId.value)
      // }
    })

    const renderArpeggios = () => {
      console.log('renderArpeggios')
      displayRenderBtn.value = false
      emit('renderMix')
    }

    return {
      arpCtrlChords,
      arpId,
      arpCtrlPattern,
      arpCtrlPatternOptions,
      arpCtrlRate,
      arpCtrlRateOptions,
      arpCtrlSynth,
      arpCtrlSynthOptions,
      displayRenderBtn,
      renderArpeggios,
      handleArpChanges,
    }
  }
}
</script>

<style scoped>

</style>