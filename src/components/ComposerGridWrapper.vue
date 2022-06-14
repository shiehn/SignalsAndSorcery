<template>
  <div class="flex w-full border-2 border-black rounded-lg bg-gray-600 p-2">
    <composer-grid-control-column></composer-grid-control-column>
    <composer-grid></composer-grid>
  </div>

</template>

<script>
import ComposerControls from "./ComposerControls";
import ComposerGrid from "./ComposerGrid";
import ComposerGridControlColumn from "./ComposerGridControlColumn";

export default {
  name: "ComposerGridWrapper",
  components: {
    ComposerGrid,
    ComposerGridControlColumn,
  }
}
</script>

<style scoped>

</style>