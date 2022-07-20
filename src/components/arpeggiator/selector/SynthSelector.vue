<template>
  <div class="flex justify-center px-2">
    <div class="rounded-lg">
      <div class="flex m-auto center align-middle rounded-lg">
        <label for="arpCtrlRate" class=" text-sm">SYNTH</label>
        <select v-if="arpCtrlSynth != undefined" v-model="arpCtrlSynth" @change="handleSelection()"
                id="arpCtrlRate"
                class="w-2 h-2 px-4 m-auto center align-middle overflow-hidden text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlSynthOptions">
            {{ item }}
          </option>
        </select>
      </div>

      <div class="flex w-20 h-20 m-auto center border-2 border-black rounded-lg p-2 mt-1">
        <span class="bg-black text-white m-auto center p-1">{{arpCtrlSynth}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {inject, ref, watch} from "vue";
import useEventsBus from "../../../events/eventBus";

export default {
  name: "SynthSelector",
  setup(props, {emit}) {
    const store = inject('store')
    const {bus} = useEventsBus()
    const arpCtrlSynth = ref('synth_a')
    const arpCtrlSynthOptions = ['synth_a', 'synth_b', 'synth_c']

    const handleSelection = () => {
      emit('handleArpChanges', 'synth', arpCtrlSynth.value)
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

        arpCtrlSynth.value = arpeggio.synth
      })
    })

    return {
      arpCtrlSynth,
      arpCtrlSynthOptions,
      handleSelection,
    }
  },
}
</script>

<style scoped>

</style>