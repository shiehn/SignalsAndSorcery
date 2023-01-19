<template>
  <div v-if="!isMobile" class="w-5/6 flex flex-col px-2 justify-evenly">
    <div class="flex w-full h-6 overflow-clip">
      <div class="w-1/3 font-bold text-sm">NAME:</div>
      <input v-model="store.state.projectName" placeholder="project"
             class="w-2/3 bg-black text-white text-sm px-2"/>
    </div>
    <div class="flex w-full h-6 overflow-clip">
      <div class="w-1/3 font-bold text-sm">AUTHOR:</div>
      <input readonly v-model="store.state.authorName" placeholder="author"
             class="w-2/3 text-sm px-2"/>
    </div>
  </div>

  <div v-if="isMobile" class="flex w-2/4 overflow-hidden">
    <div class="flex w-full h-6 mt-2 mb-2 overflow-clip">
      <input v-model="store.state.projectName" placeholder="project"
             class="w-5/6 ml-2 bg-black text-white text-sm px-2"/>
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