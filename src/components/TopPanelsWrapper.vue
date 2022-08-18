<template>
  <div v-if="isMobile" class="flex flex-col w-full justify-between ">
    <admin-panel></admin-panel>
    <asset-selector></asset-selector>
  </div>

  <div v-if="!isMobile" class="flex w-full justify-between py-4">
    <admin-panel></admin-panel>
    <asset-selector></asset-selector>
  </div>
</template>

<script>
import AssetSelector from "./AssetSelector";
import AdminPanel from "./AdminPanel";
import {inject, nextTick, onMounted, ref} from "vue";

export default {
  name: "TopPanelsWrapper",
  components: {
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