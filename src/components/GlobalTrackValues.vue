<template>
  <div class="w-full flex flex-col overflow-hidden">
    <div class="mt-2 mb-2 nowrap">
      <span class="font-bold text-sm  nowrap">NAME:</span>
      <span class="ml-2 bg-black text-white px-2 nowrap">Ultra Dope</span>
    </div>
    <div class="mb-2">
      <span class="font-bold text-sm">ARTIST:</span>
      <span class="ml-2">Steve Hiehn</span>
    </div>
    <div class="mb-2">
      <span class="font-bold text-sm">BPM:</span>
      <span v-if="store.state.globalBpm" class="ml-2">{{ store.state.globalBpm }}</span>
      <span v-if="!store.state.globalBpm" class="ml-2"> ---</span>
    </div>
    <div class="mb-2">
      <span class="font-bold text-sm">KEY:</span>
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