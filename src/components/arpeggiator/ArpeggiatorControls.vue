<template>
  <!--    TOP ROW-->
  <div class="w-full">
    <div class="flex w-full h-2/3  justify-evenly">
      <div class="">
        <h1 class="text-lg mb-2">ARPEGGIATOR</h1>
        <!--                <div class="text-xs">ARP ID: {{ arpId }}</div>-->
        <!--        <div class="w-full mb-4">-->
        <!--          <span class="text-xs">CHORDS:</span>-->
        <div class="w-full bg-black mb-4 text-white text-xs">{{ arpCtrlChords }}</div>
        <!--        </div>-->
        <div class="flex justify-start">
          <button class="bg-gray-400 rounded-lg p-1 text-sm text-black mr-4" @click="previewArpeggios">PREVIEW</button>
          <button class="bg-gray-400 rounded-lg p-1 text-sm text-black mr-4" @click="stopPreviewArpeggios">STOP</button>
        </div>
      </div>

      <div class="w-1 h-full bg-gray-300"></div>

      <synth-selector @handleArpChanges="handleArpChanges"></synth-selector>
      <rate-selector @handleArpChanges="handleArpChanges"></rate-selector>
      <type-selector></type-selector>
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
import RateSelector from "./selector/RateSelector.vue";
import TypeSelector from "./selector/TypeSelector.vue";
import FXWrapper from "./fx/FXWrapper.vue";
import SynthSelector from "./selector/SynthSelector.vue";

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
    const arpCtrlSynth = ref('synth_1')
    const arpCtrlSynthOptions = ['synth_1']
    const toast = inject('toast');

    let currentRow = undefined
    let currentCol = undefined

    const renderCompleteCallback = function (id) {
      console.log('buffer callback arp-ctrl')
      new GridProcessor(store.state.grid).updateArpeggioBuffersRendered(id)
      emit('displayRenderBtn', true)
    }

    const handleArpChanges = (type, selection) => {
      if (currentRow != undefined && currentCol != undefined) {
        const arpeggio = store.state.grid[currentRow].value[currentCol].arpeggio
        if (!arpeggio) {
          console.log('error: arpeggio not found at row:' + currentRow + ' col:' + currentCol)
          return
        }

        new GridProcessor(store.state.grid).updateArpeggioToUnRendered(arpId.value)

        if (type === 'rate') {
          arpeggio.rate = selection
        } else if (type === 'synth') {
          arpeggio.synth = selection
        }

        new ArpeggioRenderer(store).renderBuffer(renderCompleteCallback, arpId.value)
      }
    }

    const previewArpeggios = () => {
      const arp = new GridProcessor(store.state.grid).getArpeggioById(arpId.value)
      if (!arp) {
        toast.warning('Please Select Arpeggio to Preview')
        return
      }

      new ArpeggioRenderer(store).preview(arp.chords, arp.rate, arp.synth)
    }

    const stopPreviewArpeggios = () => {
      new ArpeggioRenderer(store).stopPreview()
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

      arpCtrlChords.value = chords.length > 0 ? chords : arpeggio.chords
      arpCtrlPattern.value = arpeggio.pattern
      arpCtrlRate.value = arpeggio.rate
    })

    const showRenderBtnIfNeeded = () => {
      if (currentRow == undefined || currentCol == undefined) {
        return
      }

      // console.log('ROW', store.state.grid[currentRow].value)
      const arpeggio = store.state.grid[currentRow].value[currentCol].arpeggio

      if (!arpeggio) {
        return
      }

      //IS THERE ANY STATE CHANGE IN ARPEGGIOS
      //IF SO DETERMINE IF ITS THIS COLUMN
      //let displayRenderButton = false
      if (store.state.hasArpeggioStateChanged()) {
        //IF THERE IS ANY DIFF SHOW THE RENDER BUTTON
        //displayRenderButton = true

        const stateDiff = store.state.getArpeggioStateDiff()
        for (let i = 0; i < stateDiff.length; i++) {
          // if (stateDiff[i].col === currentCol) {
          //   displayRenderButton = true
          // }

          const arp = store.state.grid[0].value[stateDiff[i].col].arpeggio
          if (arp && arp.renderedInMix) {
            arp.renderedInMix = false
          }
        }
      }
      //displayRenderBtn.value = displayRenderButton
    }

    setInterval(() => {
      showRenderBtnIfNeeded()
    }, 1000)

    return {
      arpCtrlChords,
      arpId,
      arpCtrlPattern,
      arpCtrlPatternOptions,
      arpCtrlSynth,
      arpCtrlSynthOptions,
      handleArpChanges,
      previewArpeggios,
      stopPreviewArpeggios,
    }
  }
}
</script>

<style scoped>

</style>