<template>
  <div class="flex flex-col min-w-fit w-1/12 border-2 border-black rounded-lg mr-2 pt-2  px-2"
       style="background-color: rgba(255,255,255,0.9);">
    <button @click="addSectionPrompt" class="flex mb-2 w-full justify-center hover:cursor-pointer">
      <img :src=imageUrls.plusIcon class="w-6 h-6 hover:shadow-lg rounded-full hover:ring-4 hover:ring-green-500">
    </button>

    <!--    <div class="flex">-->
    <!--      <div @click="handleClick('arp')"-->
    <!--           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2-->
    <!--            hover:cursor-pointer hover:shadow-lg hover:border-green-500">-->
    <!--        <div class="">-->
    <!--          <img :src=imageUrls.arpIcon class="w-8 h-8">-->
    <!--          <div class="w-full text-center text-white bg-black text-xs mt-1">Arp</div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div class="pl-2">-->
    <!--        <div class="bg-white border-2 border-black rounded-lg text-xs p-1 mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500" @click="handleFX('arp')">FX</div>-->
    <!--        <div class="bg-white border-2 border-black rounded-lg text-xs p-1 hover:cursor-pointer hover:shadow-lg hover:border-green-500" @click="handleVol('arp')">Vol</div>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="flex">
      <div @click="handleClick('hi')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.hiIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1">Hi</div>
        </div>
      </div>

      <div class="flex flex-col justify-evenly h-16 pl-2">
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleFX('hi')">FX
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleVol('hi')">Vol
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleClearRow('hi')">Clr
        </div>
      </div>
    </div>

    <div class="flex">
      <div @click="handleClick('mid')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.midIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1">Mid</div>
        </div>
      </div>

      <div class="flex flex-col justify-evenly h-16 pl-2">
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleFX('mid')">FX
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleVol('mid')">Vol
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleClearRow('mid')">Clr
        </div>
      </div>
    </div>

    <div class="flex">
      <div @click="handleClick('low')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.lowIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1">Bass</div>
        </div>
      </div>

      <div class="flex flex-col justify-evenly h-16 pl-2">
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleFX('low')">FX
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleVol('low')">Vol
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleClearRow('low')">Clr
        </div>
      </div>
    </div>

    <div class="flex">
      <div @click="handleClick('drum')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.drumIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1">Drum</div>
        </div>
      </div>

      <div class="flex flex-col justify-evenly h-16 pl-2">
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleFX('drum')">FX
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleVol('drum')">Vol
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleClearRow('drum')">Clr
        </div>
      </div>
    </div>

    <div class="flex">
      <div @click="handleClick('fill')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.fillIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1">Fill</div>
        </div>
      </div>

      <div class="flex flex-col justify-evenly h-16 pl-2">
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleFX('fill')">FX
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleVol('fill')">Vol
        </div>
        <div
            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"
            @click="handleClearRow('fill')">Clr
        </div>
      </div>
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
import {ROW_TO_TYPE_MAP} from "../constants/constants";

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
      arpIcon: store.state.staticUrl + "icons/eq-arp.png",
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


    const handleClick = (type) => {
      let updateParam = {
        clipType: type,
        chords: 'all',
        //TODO: is this a problem not passing row/col for arpeggiator?
      }

      emit('updateAssetSelection', updateParam)
    }

    const handleFX = (type) => {
      toast.warning(`FX for '${type}' has not yet been implemented.`);
    }

    const handleVol = (type) => {
      toast.warning(`VOL for '${type}' has not yet been implemented.`);
    }

    const clearRow = (type) => {
      const rowIndex = ROW_TO_TYPE_MAP.findIndex((rowType) => rowType === type)
      new GridProcessor(store.state.grid).clearRow(rowIndex)
      emit('renderMixIfNeeded')
    }

    const clearRowModalId = 'clearRowModalId'
    const handleClearRow = (type) => {
      alert(type)
      const modalClearRowConfirmPayload = new ModalOpenPayload(
          clearRowModalId,
          'Clear Row?',
          'Are you sure you want to clear the row?',
          'Yes',
          'Cancel',
          false,
          type
      )

      emit('launchModal', modalClearRowConfirmPayload)
    }

    watch(() => bus.value.get('modalResponse'), (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === addSectionModalId) {
        if (modalResponsePayload[0].getResponse()) {
          addSection(modalResponsePayload[0].getResponse())
        }
      }

      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === clearRowModalId) {
        if (modalResponsePayload[0].getResponse()) {
          clearRow(modalResponsePayload[0].getRelayData())
        }
      }
    })

    return {
      addSectionPrompt,
      handleClick,
      handleFX,
      handleVol,
      handleClearRow,
      imageUrls
    }
  }
  ,
}
</script>

<style scoped>

</style>