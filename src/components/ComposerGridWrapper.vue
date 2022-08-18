<template>
  <div v-if="isMobile" class="flex flex-col w-full">
    <composer-grid></composer-grid>
    <composer-grid-control-column></composer-grid-control-column>
  </div>

  <div v-if="!isMobile" class="flex w-full">
    <composer-grid-control-column></composer-grid-control-column>
    <composer-grid></composer-grid>
  </div>
</template>

<script>
import ComposerGrid from "./ComposerGrid";
import ComposerGridControlColumn from "./ComposerGridControlColumn";
import {inject, nextTick, onMounted, ref} from "vue";

export default {
  name: "ComposerGridWrapper",
  components: {
    ComposerGrid,
    ComposerGridControlColumn,
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
      isMobile,
    };
  },
}
</script>

<style scoped>

</style>