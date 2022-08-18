<template>
  <div v-if="!isMobile" class="w-full overflow-hidden">
    <div class="flex w-full h-6 mt-2 mb-2 overflow-clip">
      <div class="w-1/3 m-auto font-bold text-sm">NAME:</div>
      <input v-model="store.state.projectName" placeholder="project"
             class="w-2/3 ml-2 bg-black text-white text-sm px-2"/>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
      <div class="w-1/3 m-auto font-bold text-sm">AUTHOR:</div>
      <input v-model="store.state.authorName" placeholder="author"
             class="w-2/3 ml-2 text-sm px-2"/>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
      <div class="w-1/3 m-auto font-bold text-sm">BPM:</div>
      <div v-if="store.state.globalBpm" class="w-2/3 ml-2">{{ store.state.globalBpm }}</div>
      <div v-if="!store.state.globalBpm" class="w-2/3 ml-2"> ---</div>
    </div>
    <div class="flex w-full h-6 mb-2 overflow-clip">
      <div class="w-1/3 m-auto font-bold text-sm">KEY:</div>
      <div v-if="store.state.globalKey" class="w-2/3 ml-2">{{ store.state.globalKey }}</div>
      <div v-if="!store.state.globalKey" class="w-2/3 ml-2"> ---</div>
    </div>
  </div>

  <div v-if="isMobile" class="flex w-2/4 overflow-hidden">
    <div class="flex w-full h-6 mt-2 mb-2 overflow-clip">
      <input v-model="store.state.projectName" placeholder="project"
             class="w-3/4 ml-2 bg-black text-white text-sm px-2"/>
    </div>
  </div>
</template>

<script>
import {inject, nextTick, onMounted, ref} from "vue";

export default {
  name: "GlobalTrackValues",
  setup() {
    const store = inject('store')
    const key = ref('eb')
    const isMobile = ref(store.isMobile ? true : false)

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    return {isMobile, store}
  }
}
</script>

<style scoped>

</style>