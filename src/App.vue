<!-- frontend/src/App.vue -->

<template>
  <suspense>
    <asset-selector></asset-selector>
  </suspense>
  <composer-grid></composer-grid>
  <composer-controls></composer-controls>
  <global-track-values></global-track-values>
</template>

<script lang="js">
import {defineComponent, provide} from "vue";
import AssetSelector from './components/AssetSelector.vue'
import ComposerControls from './components/ComposerControls.vue'
import ComposerGrid from './components/ComposerGrid.vue'
import store from './store/store'
import GlobalTrackValues from "./components/GlobalTrackValues.vue";

let url;
const root = document.querySelector('#app')
if (root) {
  url = root.textContent;
}

export default defineComponent({
  setup() {
    provide('store', store)
    if (typeof url === 'string') {
      store.state.staticUrl = url.trim()
    }

    return {}
  },
  components: {
    GlobalTrackValues,
    AssetSelector,
    ComposerControls,
    ComposerGrid,
  }
});
</script>