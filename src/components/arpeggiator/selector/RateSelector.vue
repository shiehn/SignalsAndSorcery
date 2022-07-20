<template>

  <div class="flex justify-center px-2">
    <div class="rounded-lg">
      <div class="flex m-auto center align-middle rounded-lg">
        <label for="arpCtrlRate" class="text-sm">RATE</label>
        <select v-if="arpCtrlRate != undefined" v-model="arpCtrlRate" @change="handleSelection()"
                id="arpCtrlRate"
                class="w-2 h-2 px-4 m-auto center align-middle overflow-hidden text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlRateOptions" class="w-2 h-2">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="w-20 h-20 border-2 border-black rounded-lg p-2 mt-1">
        <img :src="arpCtrlRateImg">
      </div>
    </div>
  </div>

</template>

<script>
import {inject, ref, watch} from "vue";
import useEventsBus from "../../../events/eventBus";

export default {
  name: "RateSelector",
  setup(props, {emit}) {
    const store = inject('store')
    const {bus} = useEventsBus()
    const imageUrls = {
      'whole': store.state.staticUrl + "icons/note-whole.png",
      'half': store.state.staticUrl + "icons/note-half.png",
      'quarter': store.state.staticUrl + "icons/note-quarter.png",
      'eighth': store.state.staticUrl + "icons/note-eighth.png",
      'sixteenth': store.state.staticUrl + "icons/note-sixteenth.png",
    }

    const arpCtrlRate = ref('quarter')
    const arpCtrlRateOptions = ref(['whole', 'half', 'quarter', 'eighth', 'sixteenth'])
    const arpCtrlRateImg = ref(imageUrls[arpCtrlRate.value])

    const handleSelection = () => {
      arpCtrlRateImg.value = imageUrls[arpCtrlRate.value]
      emit('handleArpChanges', 'rate', arpCtrlRate.value)
    }

    watch(() => bus.value.get('updateArpeggioControls'), (assetFilter) => {
      if (assetFilter[0].row == undefined || assetFilter[0].col == undefined) {
        return
      }

      const arpeggio = store.state.grid[assetFilter[0].row].value[assetFilter[0].col].arpeggio
      if (!arpeggio) {
        return
      }


      watch(() => bus.value.get('updateArpeggioControls'), (assetFilter) => {
        if (assetFilter[0].row == undefined || assetFilter[0].col == undefined) {
          return
        }

        const arpeggio = store.state.grid[assetFilter[0].row].value[assetFilter[0].col].arpeggio
        if (!arpeggio) {
          return
        }

        arpCtrlRate.value = arpeggio.rate
      })

      //get the chords from the column
      // let chords = []
      // let chordsStr = store.state.getChordsForCol(assetFilter[0].col)
      // if (chordsStr) {
      //   chords = chordsStr.split(':')
      // }
      //
      // const globalKey = store.state.globalKey
      // if (chords.length < 1 && globalKey) {
      //   chords = [globalKey, globalKey, globalKey, globalKey]
      // }

      // arpId.value = arpeggio.id
      // displayRenderBtn.value = arpeggio.on && arpeggio.bufferRendered && !arpeggio.renderedInMix
      // arpCtrlChords.value = chords.length > 0 ? chords : arpeggio.chords
      // arpCtrlPattern.value = arpeggio.pattern
      // arpCtrlRate.value = arpeggio.rate

      // if(arpeggio.on) {
      //   console.log('TRIGGER updateArpeggioControls')
      //   new ArpeggioRenderer(store).renderBuffer(renderCompleteCallback, arpId.value)
      // }
    })

    return {
      arpCtrlRate,
      arpCtrlRateImg,
      arpCtrlRateOptions,
      handleSelection,
    }
  },
}
</script>

<style scoped>

</style>