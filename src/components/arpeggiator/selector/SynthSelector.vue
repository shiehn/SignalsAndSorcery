<template>

  <div class="flex justify-center px-2">
    <div>
      SYNTH
      <div class="w-20 h-20 border-2 border-black rounded-lg p-2">
        <select v-if="arpCtrlSynth != undefined" v-model="arpCtrlSynth" @change="handleSelection()"
                id="arpCtrlRate"
                class="w-2/3 text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlSynthOptions">
            {{ item }}
          </option>
        </select>
      </div>
    </div>
  </div>

</template>

<script>
import {ref} from "vue";

export default {
  name: "SynthSelector",
  setup(props, {emit}) {
    const arpCtrlSynth = ref('synth_b')
    const arpCtrlSynthOptions = ['synth_a', 'synth_b', 'synth_c']

    const handleSelection = () => {
      emit('handleArpChanges', 'synth', arpCtrlSynth.value)
    }

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