<template>
  <div v-if="isMobile" class="flex flex-col w-full justify-between ">
    <admin-panel></admin-panel>
    <asset-selector></asset-selector>
  </div>

  <div v-if="!isMobile" class="flex w-full justify-between h-32 mb-2">
    <composer-controls></composer-controls>
    <asset-selector></asset-selector>
    <admin-panel></admin-panel>

  </div>
</template>

<script>
import AssetSelector from "./AssetSelector";
import AdminPanel from "./AdminPanel";
import {inject, nextTick, onMounted, ref} from "vue";
import PlayerControls from "./PlayerControls.vue";
import ComposerControls from "./ComposerControls.vue";

export default {
  name: "TopPanelsWrapper",
  components: {
    ComposerControls,
    PlayerControls,
    AdminPanel,
    AssetSelector,
  },
  setup() {
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