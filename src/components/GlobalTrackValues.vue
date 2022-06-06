<template>
  <div class="border-2">
    <h4>BPM:
      <span v-if="store.state.globalBpm">{{ store.state.globalBpm }}</span>
      <span v-if="!store.state.globalBpm"> ---</span>
    </h4>
    <h4>KEY:
      <span v-if="store.state.globalKey">{{ store.state.globalKey }}</span>
      <span v-if="!store.state.globalKey"> ---</span>
    </h4>
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