<!-- frontend/src/App.vue -->

<template>
  <top-panels-wrapper></top-panels-wrapper>
  <composer-grid-wrapper></composer-grid-wrapper>
  <modal></modal>
</template>

<script lang="js">
import {defineComponent, ref, provide, watch} from "vue";
import store from './store/store'
import GlobalTrackValues from "./components/GlobalTrackValues.vue";
import ComposerGridWrapper from "./components/ComposerGridWrapper";
import TopPanelsWrapper from "./components/TopPanelsWrapper";
import Modal from "./components/Modal";
import useEventsBus from "./events/eventBus";

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



    return {
    }
  },
  components: {
    Modal,
    TopPanelsWrapper,
    ComposerGridWrapper,
    GlobalTrackValues,
  }
});
</script>