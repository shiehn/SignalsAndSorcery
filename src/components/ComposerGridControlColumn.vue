<template>
  <div class="flex flex-col min-w-fit bg-gray-200 w-1/12 border-2 border-black rounded-lg mr-2 pt-2  px-2">
    <button @click="addSection" class="flex mb-4 w-full justify-center">
      <img :src=imageUrls.plusIcon class="w-6 h-6">
    </button>
    <div class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2">
      <img :src=imageUrls.hiIcon class="w-10 h-10">
    </div>
    <div class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2">
      <img :src=imageUrls.midIcon class="w-10 h-10">
    </div>
    <div class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2">
      <img :src=imageUrls.lowIcon class="w-10 h-10">
    </div>
    <div class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg">
      <img :src=imageUrls.drumIcon class="w-10 h-10">
    </div>

    <composer-controls></composer-controls>
  </div>
</template>

<script>
import {inject} from "vue";
import ComposerControls from "./ComposerControls";
import GridProcessor from "../processors/grid-processor";
import {v4} from "uuid";
import useEventsBus from "../events/eventBus";

export default {
  name: "ComposerGridControlColumn",
  components: {
    ComposerControls
  },
  setup() {
    const store = inject('store')
    const {emit} = useEventsBus()
    const toast = inject('toast');
    const imageUrls = {
      hiIcon: store.state.staticUrl + "icons/eq-hi.png",
      midIcon: store.state.staticUrl + "icons/eq-mid.png",
      lowIcon: store.state.staticUrl + "icons/eq-low.png",
      drumIcon: store.state.staticUrl + "icons/eq-drum.png",
      plusIcon: store.state.staticUrl + "icons/plus.png",
    }

    const addSection = () => {
      new GridProcessor(store.state.grid).addSection(v4())
      emit('renderMixIfNeeded')
    }

    return {
      addSection,
      imageUrls
    }
  },
}
</script>

<style scoped>

</style>