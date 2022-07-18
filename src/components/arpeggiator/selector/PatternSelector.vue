<template>
  <div class="flex justify-center px-2">
    <div>
      TYPE
      <div class="w-20 h-20 border-2 border-black rounded-lg p-2">
        <select v-if="arpCtrlPattern != undefined" v-model="arpCtrlPattern" @change="handleSelection()"
                id="arpCtrlPattern"
                class="w-full text-xs rounded-lg">
          <option :value="item" v-for="item in arpCtrlPatternOptions">
            {{ item }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import {inject, ref} from "vue";
import useEventsBus from "../../../events/eventBus";

export default {
  name: "PatternSelector",
  setup(props, {emit}) {
    const store = inject('store')
    const {bus} = useEventsBus()

    const arpCtrlPattern = ref('131581')
    const arpCtrlPatternOptions = ref(['1315', '87575813', '1351', '113', '131581'])

    const handleSelection = () => {
      emit('handleArpChanges', 'pattern', arpCtrlPattern.value)
    }

    return {
      arpCtrlPattern,
      arpCtrlPatternOptions,
      handleSelection,
    }
  }
}
</script>

<style scoped>

</style>