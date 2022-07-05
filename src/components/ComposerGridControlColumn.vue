<template>
  <div class="flex flex-col min-w-fit bg-gray-200 w-1/12 border-2 border-black rounded-lg mr-2 pt-2  px-2">
    <button @click="addSectionPrompt" class="flex mb-2 w-full justify-center hover:cursor-pointer">
      <img :src=imageUrls.plusIcon class="w-6 h-6">
    </button>
    <div @click="handleClick('arp')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer">
      <img :src=imageUrls.hiIcon class="w-10 h-10">
    </div>
    <div @click="handleClick('hi')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer">
      <img :src=imageUrls.hiIcon class="w-10 h-10">
    </div>
    <div @click="handleClick('mid')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer">
      <img :src=imageUrls.midIcon class="w-10 h-10">
    </div>
    <div @click="handleClick('low')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer">
      <img :src=imageUrls.lowIcon class="w-10 h-10">
    </div>
    <div @click="handleClick('drum')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer">
      <img :src=imageUrls.drumIcon class="w-10 h-10">
    </div>
    <div @click="handleClick('fill')"
         class="flex justify-center items-center w-16 h-16 bg-white border-2 border-black rounded-lg hover:cursor-pointer">
      <img :src=imageUrls.fillIcon class="w-10 h-10">
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
import ModalOpenPayload from "./ModalOpenPayload";
import {watch} from "vue";

export default {
  name: "ComposerGridControlColumn",
  components: {
    ComposerControls
  },
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast');
    const imageUrls = {
      drumIcon: store.state.staticUrl + "icons/eq-drum.png",
      fillIcon: store.state.staticUrl + "icons/eq-fill.png",
      hiIcon: store.state.staticUrl + "icons/eq-hi.png",
      lowIcon: store.state.staticUrl + "icons/eq-low.png",
      midIcon: store.state.staticUrl + "icons/eq-mid.png",
      plusIcon: store.state.staticUrl + "icons/plus.png",
    }

    const addSection = (sectionName) => {
      if (!sectionName) {
        sectionName = v4()
      }

      new GridProcessor(store.state.grid).addSection(sectionName)
      emit('renderMixIfNeeded')
      emit('resetPlayhead')
    }

    const addSectionModalId = 'addSectionModalId'
    const addSectionPrompt = () => {
      const modalOpenPayload = new ModalOpenPayload(
          addSectionModalId,
          'Add Section',
          'Provide a name for the section',
          'Add',
          'Cancel',
          true,
      )

      emit('launchModal', modalOpenPayload)
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === addSectionModalId) {
        if (modalResponsePayload[0].getResponse()) {
          addSection(modalResponsePayload[0].getResponse())
        }
      }
    })

    const handleClick = (type) => {
      let updateParam = {
        clipType: type,
        chords: 'all',
        //TODO: is this a problem not passing row/col for arpeggiator?
      }

      emit('updateAssetSelection', updateParam)
    }

    return {
      addSectionPrompt,
      handleClick,
      imageUrls
    }
  }
  ,
}
</script>

<style scoped>

</style>