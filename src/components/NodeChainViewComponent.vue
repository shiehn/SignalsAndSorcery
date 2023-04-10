<template>
  <div class="w-2/3 border-2 border-white rounded-lg p-2 bg-orange-300">{{nodeId}}</div>
</template>

<script>
import {ref, watch} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "NodeChainViewComponent",
  setup() {
    const {bus, emit} = useEventsBus()
    const nodeId = ref('undefined')

    watch(() => bus.value.get('focusSFX'), async (sfxId) => {

      console.log('sfxId[0]', sfxId[0])

      nodeId.value = sfxId[0]
    })

    return {
      nodeId
    }
  }
}
</script>

<style scoped>

</style>