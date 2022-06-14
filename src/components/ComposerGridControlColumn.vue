<template>
  <div class="flex flex-col bg-gray-200 w-1/12 border-2 border-black rounded-lg mr-2 p-2">
    <div class="m-1 p-2 w-100 h-20 bg-white border-2 border-black rounded-lg">
      <img :src=imageUrls.hiIcon class="w-14 h-14">
    </div>
    <div class="m-1 p-2 w-100 h-20 bg-white border-2 border-black rounded-lg">
      <img :src=imageUrls.midIcon class="w-14 h-14">
    </div>
    <div class="m-1 p-2 w-100 h-20 bg-white border-2 border-black rounded-lg">
      <img :src=imageUrls.lowIcon class="w-14 h-14">
    </div>
    <div class="m-1 p-2 w-100 h-20 bg-white border-2 border-black rounded-lg">
      <img :src=imageUrls.drumIcon class="w-14 h-14">
    </div>

    <composer-controls></composer-controls>
  </div>
</template>

<script>
import {inject} from "vue";
import ComposerControls from "./ComposerControls";

export default {
  name: "ComposerGridControlColumn",
  components: {
    ComposerControls
  },
  setup() {
    const store = inject('store')
    const imageUrls = {
      hiIcon: store.state.staticUrl + "icons/eq-hi.png",
      midIcon: store.state.staticUrl + "icons/eq-mid.png",
      lowIcon: store.state.staticUrl + "icons/eq-low.png",
      drumIcon: store.state.staticUrl + "icons/eq-drum.png",
    }

    console.log("imageUrls", imageUrls)


    return {
      imageUrls
    }
  },
}
</script>

<style scoped>

</style>