<template>

  <div class="flex justify-center px-2">
    <div>
      SYNTH
      <div class="w-20 h-20 border-2 border-black rounded-lg p-2">
        <select v-if="arpCtrlRate != undefined" v-model="arpCtrlRate" @change="handleSelection()"
                id="arpCtrlRate"
                class="w-2/3 text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlRateOptions">
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
    const arpCtrlRate = ref('quarter')
    const arpCtrlRateOptions = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']

    const handleSelection = () => {
      emit('handleArpChanges', arpCtrlRate.value)
    }

    return {
      arpCtrlRate,
      arpCtrlRateOptions,
      handleSelection,
    }
  },
}
</script>

<style scoped>

</style>