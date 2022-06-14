<!-- frontend/src/App.vue -->

<template>
  <top-panels-wrapper></top-panels-wrapper>
  <composer-grid-wrapper></composer-grid-wrapper>
</template>

<script lang="js">
import {defineComponent, provide} from "vue";
import AssetSelector from './components/AssetSelector.vue'
import ComposerControls from './components/ComposerControls.vue'
import ComposerGrid from './components/ComposerGrid.vue'
import store from './store/store'
import GlobalTrackValues from "./components/GlobalTrackValues.vue";
import ComposerGridWrapper from "./components/ComposerGridWrapper";
import TopPanelsWrapper from "./components/TopPanelsWrapper";

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
    TopPanelsWrapper,
    ComposerGridWrapper,
    GlobalTrackValues,
  }
});
</script>