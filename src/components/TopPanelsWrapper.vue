<template>
  <div class="flex w-full justify-between py-4">
    <admin-panel></admin-panel>
    <asset-selector></asset-selector>
  </div>

</template>

<script>
import AssetSelector from "./AssetSelector";
import AdminPanel from "./AdminPanel";

export default {
  name: "TopPanelsWrapper",
  components: {
    AdminPanel,
    AssetSelector,
  }

}
</script>

<style scoped>

</style>