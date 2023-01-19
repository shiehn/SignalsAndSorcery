<template>
  <!-- LOADING SPINNER | START -->
  <div class="flex justify-center items-center w-full h-full fixed inset-0 bg-gradient-to-b from-gray-500"
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
import {toRefs} from "vue";

export default {
  name: "LoadingSpinner",
  props: {
    showLoadingProp: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const showLoading = toRefs(props).showLoadingProp

    return {
      showLoading
    };
  }
}
</script>

<style scoped>

</style>