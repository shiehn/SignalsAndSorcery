<template>
  <div class="ml-8">
    <div class="font-bold text-lg">Name:
      <span class="ml-2">default</span>
    </div>
    <div class="font-bold text-lg">BPM:
      <span v-if="store.state.globalBpm" class="ml-2">{{ store.state.globalBpm }}</span>
      <span v-if="!store.state.globalBpm" class="ml-2"> ---</span>
    </div>
    <div class="font-bold text-lg">KEY:
      <span v-if="store.state.globalKey" class="ml-2">{{ store.state.globalKey }}</span>
      <span v-if="!store.state.globalKey" class="ml-2"> ---</span>
    </div>
  </div>
</template>

<script>
import {inject, ref} from "vue";

export default {
  name: "GlobalTrackValues",
  setup() {
    const store = inject('store')

    // const bpm = ref(65);
    const key = ref('eb')

    // bpm.value = store.state.globalBpm

    return {store}
  }
}
</script>

<style scoped>

</style>