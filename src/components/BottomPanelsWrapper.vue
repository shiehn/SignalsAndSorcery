<template>
  <div v-if="!isMobile" class="flex w-full justify-between py-4">
    <leader-board></leader-board>
    <project-board></project-board>
  </div>
</template>

<script>
import {inject, nextTick, onMounted, ref} from "vue";
import LeaderBoard from "./LeaderBoard";
import ProjectBoard from "./ProjectBoard";

export default {
  name: "BottomPanelsWrapper",
  components: {ProjectBoard, LeaderBoard},
  setup(){
    const store = inject('store')
    const isMobile = ref(store.isMobile ? true : false)

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

    return {
      isMobile
    }
  }
}
</script>

<style scoped>

</style>