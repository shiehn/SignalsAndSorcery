<!-- frontend/src/App.vue -->

<template>
  <top-panels-wrapper></top-panels-wrapper>
  <composer-grid-wrapper></composer-grid-wrapper>
  <bottom-panels-wrapper></bottom-panels-wrapper>
  <loading-spinner></loading-spinner>
  <modal></modal>
</template>

<script lang="js">
import {defineComponent, ref, provide, watch} from "vue";
import store from './store/store'
import GlobalTrackValues from "./components/GlobalTrackValues.vue";
import ComposerGridWrapper from "./components/ComposerGridWrapper";
import TopPanelsWrapper from "./components/TopPanelsWrapper";
import BottomPanelsWrapper from "./components/BottomPanelsWrapper";
import Modal from "./components/Modal";
import {onMounted} from "vue";
import SASApi from "./dal/sas-api";
import LoadingSpinner from "./components/LoadingSpinner.vue";

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

    onMounted(async () => {
      const token = document.getElementById('token') == null ? '' : document.getElementById('token').value
      const isMobileEl = document.getElementById('isMobile')
      if (isMobileEl && isMobileEl.value === 'True') {
        store.isMobile = true
      }

      const urlParams = new URLSearchParams(window.location.search);
      const excludemode = urlParams.get('excludemode');
      store.state.excludemode = !!(excludemode && excludemode === 'true');

      store.state.authorName = await new SASApi().getLoggedInUser(token)
      store.token = token
    })

    return {}
  },
  components: {
    LoadingSpinner,
    BottomPanelsWrapper,
    ComposerGridWrapper,
    GlobalTrackValues,
    Modal,
    TopPanelsWrapper,
  }
});
</script>