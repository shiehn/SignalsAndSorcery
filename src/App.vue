<!-- frontend/src/App.vue -->

<template>
  <top-panels-wrapper></top-panels-wrapper>
  <composer-grid-wrapper></composer-grid-wrapper>
  <arpeggiator-wrapper></arpeggiator-wrapper>
  <modal></modal>
</template>

<script lang="js">
import {defineComponent, ref, provide, watch} from "vue";
import store from './store/store'
import GlobalTrackValues from "./components/GlobalTrackValues.vue";
import ComposerGridWrapper from "./components/ComposerGridWrapper";
import TopPanelsWrapper from "./components/TopPanelsWrapper";
import Modal from "./components/Modal";
import {onMounted} from "vue";
import SASApi from "./dal/sas-api";

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
      const token = document.getElementById('token').value
      const isMobileEl = document.getElementById('isMobile')
      if (isMobileEl && isMobileEl.value === 'True') {
        store.isMobile = true
      }

      //FORCE IT!!
      store.isMobile = true

      console.log('mobile from appvue', store.isMobile)

      store.state.authorName = await new SASApi().getLoggedInUser(token)
    })

    return {}
  },
  components: {
    Modal,
    TopPanelsWrapper,
    ComposerGridWrapper,
    GlobalTrackValues,
  }
});
</script>