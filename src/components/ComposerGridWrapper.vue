<template>
  <div class="flex w-full">
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