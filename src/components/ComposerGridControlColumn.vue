<template>

  <div v-if="isMobile" class="fixed bottom-0 left-0 z-20 flex flex-col w-full border-2 border-black rounded-lg"
       style="background-color: rgba(255,255,255,0.9);">
    <composer-controls></composer-controls>
  </div>

  <div v-if="!isMobile" class="flex flex-col min-w-fit w-1/12 border-2 border-black rounded-lg mr-2 pt-2  px-2"
       style="background-color: rgba(255,255,255,0.9);">
    <!--    <button @click="addSectionPrompt" class="flex mb-2 w-full justify-center hover:cursor-pointer">-->
    <!--      <img :src=imageUrls.plusIcon class="w-6 h-6 hover:shadow-lg rounded-full hover:ring-4 hover:ring-green-500">-->
    <!--    </button>-->

    <div class="flex justify-center">
      <div @click="handleClick('hi')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.hiIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Hi</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleFX('hi')">FX-->
        <!--        </div>-->
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleVol('hi')">Vol-->
        <!--        </div>-->

        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('hi')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('hi')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>

    <div class="flex justify-center">
      <div @click="handleClick('mid')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.midIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Mid</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleFX('mid')">FX-->
        <!--        </div>-->
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleVol('mid')">Vol-->
        <!--        </div>-->
        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('mid')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('mid')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>

    <div class="flex justify-center">
      <div @click="handleClick('low')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.lowIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Bass</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleFX('low')">FX-->
        <!--        </div>-->
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleVol('low')">Vol-->
        <!--        </div>-->
        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('low')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('low')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>

    <div class="flex justify-center">
      <div @click="handleClick('drum')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.drumIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Drum</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleFX('drum')">FX-->
        <!--        </div>-->
        <!--        <div-->
        <!--            class="bg-black rounded-md text-white text-xs px-1 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-lg"-->
        <!--            @click="handleVol('drum')">Vol-->
        <!--        </div>-->
        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('drum')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('drum')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>

    <div class="flex justify-center">
      <div @click="handleClick('fill')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.fillIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Fill</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('fill')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('fill')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>

    <div class="flex justify-center">
      <div @click="handleClick('melodic')"
           class="flex justify-center items-center w-12 h-16 bg-white border-2 border-black rounded-lg mb-2 hover:cursor-pointer hover:shadow-lg hover:border-green-500">
        <div class="">
          <img :src=imageUrls.vocalIcon class="w-8 h-8">
          <div class="w-full text-center text-white bg-black text-xs mt-1 rounded-bl rounded-br">Voc</div>
        </div>
      </div>
      <div class="flex flex-col justify-evenly h-16 pl-2">
        <img :src=imageUrls.removeIcon class="w-4 h-4" @click="handleClearRow('melodic')">
        <img :src=imageUrls.refreshIcon class="w-4 h-4" @click="handleRefreshRow('melodic')">
        <img :src=imageUrls.unlockIcon class="w-4 h-4">
      </div>
    </div>


  </div>

</template>

<script>
import {inject, nextTick, onMounted, ref} from "vue";
import ComposerControls from "./ComposerControls";
import GridProcessor from "../processors/grid-processor";
import {v4} from "uuid";
import useEventsBus from "../events/eventBus";
import ModalOpenPayload from "./ModalOpenPayload";
import {watch} from "vue";
import {ROW_TO_TYPE_MAP, TYPE_DRUM, TYPE_FILL, TYPE_HI, TYPE_LOW, TYPE_MELODIC, TYPE_MID} from "../constants/constants";

export default {
  name: "ComposerGridControlColumn",
  components: {
    ComposerControls
  },
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const isMobile = ref(store.isMobile ? true : false)
    const toast = inject('toast');
    const imageUrls = {
      arpIcon: store.state.staticUrl + "icons/eq-arp.png" + "?x-request=html",
      drumIcon: store.state.staticUrl + "icons/eq-drum.png" + "?x-request=html",
      fillIcon: store.state.staticUrl + "icons/eq-fill.png" + "?x-request=html",
      vocalIcon: store.state.staticUrl + "icons/eq-mic.png" + "?x-request=html",
      hiIcon: store.state.staticUrl + "icons/eq-hi.png" + "?x-request=html",
      lowIcon: store.state.staticUrl + "icons/eq-low.png" + "?x-request=html",
      midIcon: store.state.staticUrl + "icons/eq-mid.png" + "?x-request=html",
      plusIcon: store.state.staticUrl + "icons/plus.png" + "?x-request=html",
      lockIcon: store.state.staticUrl + "icons/lock.png" + "?x-request=html",
      unlockIcon: store.state.staticUrl + "icons/unlock.png" + "?x-request=html",
      refreshIcon: store.state.staticUrl + "icons/refresh-icon.png" + "?x-request=html",
      removeIcon: store.state.staticUrl + "icons/remove.png" + "?x-request=html",
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
          undefined,
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
      const modalClearRowConfirmPayload = new ModalOpenPayload(
          clearRowModalId,
          'Clear Row?',
          'Are you sure you want to clear the row?',
          'Yes',
          undefined,
          'Cancel',
          false,
          type
      )

      emit('launchModal', modalClearRowConfirmPayload)
    }

    const handleRefreshRow = (type) => {
      clearRow(type)
      emit('refreshRow', type)
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    });

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
      isMobile: isMobile,
      handleClick,
      handleFX,
      handleVol,
      handleClearRow,
      handleRefreshRow,
      imageUrls
    }
  }
  ,
}
</script>

<style scoped>
/*.footer {*/
/*  background: red;*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  height: 50px;*/
/*}*/
</style>