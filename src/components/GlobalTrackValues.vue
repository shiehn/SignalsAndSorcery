<template>
  <div class="w-full flex flex-col overflow-hidden">
    <div class="flex w-full h-6 mt-2 mb-2 overflow-clip">
      <span class="font-bold text-sm">NAME:</span>
      <input v-model="store.state.projectName" placeholder="Default Name"
             class="ml-2 bg-black text-white text-sm px-2"/>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
      <span class="font-bold text-sm">AUTHOR:</span>
      <span class="ml-2">{{ store.state.authorName }}</span>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
      <span class="font-bold text-sm">BPM:</span>
      <span v-if="store.state.globalBpm" class="ml-2">{{ store.state.globalBpm }}</span>
      <span v-if="!store.state.globalBpm" class="ml-2"> ---</span>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
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