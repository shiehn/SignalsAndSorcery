<template>
  <!-- LOADING SPINNER | START -->
  <div class="flex justify-center items-center w-full h-full z-100 fixed inset-0 bg-gradient-to-b from-gray-500"
       v-show="showLoading"
       ref="loading-modal">

    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <!-- LOADING SPINNER | END -->
</template>

<script>
import {ref, toRefs, watch} from "vue";
import useEventsBus from "../events/eventBus";
const {bus, emit} = useEventsBus()

export default {
  name: "LoadingSpinner",
  props: {
  },
  setup() {
    const showLoading = ref(false)

    watch(() => bus.value.get('showLoadingSpinner'), () => {
      showLoading.value = true
    })

    watch(() => bus.value.get('hideLoadingSpinner'), () => {
      showLoading.value = false
    })

    return {
      showLoading
    };
  }
}
</script>

<style scoped>

</style>