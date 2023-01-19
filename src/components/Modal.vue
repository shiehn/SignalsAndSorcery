<template>
  <div v-if="open" class="modal bg-white border-2 border-black rounded-lg p-4 shadow-lg" :class="{'w-2/3': isMobile, 'w-1/3': !isMobile}">
    <div class="bg-gray-100 rounded-lg p-2 mb-2">
      <h4 v-if="title" class="w-full border-b-2 border-gray-600">{{ title }}</h4>
      <p v-if="body" class="my-2">{{ body }}</p>
      <input v-if="isTextInput" class="w-full h-10 p-2" v-model="textInput">
    </div>
    <div class="flex justify-end">
      <button v-if="cancelBtnText" @click="cancelClick()"
              class="border-2 border-black ml-2 p-1 rounded-md hover:shadow-lg hover:border-red-500">
        {{ cancelBtnText }}
      </button>
      <button v-if="confirmBtnText" @click="confirmClick()"
              class="border-2 border-black ml-2 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        {{ confirmBtnText }}
      </button>
      <button v-if="confirmBtnTextTwo" @click="confirmClickTwo()"
              class="border-2 border-black ml-2 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        {{ confirmBtnTextTwo }}
      </button>
    </div>
  </div>
</template>

<script>
import {ref, watch, nextTick, onMounted} from 'vue'
import useEventsBus from "../events/eventBus";
import ModalResponsePayload from "./ModalResponsePayload";
import store from "../store/store";

export default {
  name: "Modal",
  setup() {
    const {bus, emit} = useEventsBus()

    const id = ref(undefined)
    const title = ref(undefined)
    const body = ref(undefined)
    const isTextInput = ref(false)
    const isMobile = ref(store.isMobile ? true : false)
    const confirmBtnText = ref(undefined)
    const confirmBtnTextTwo = ref(undefined)
    const cancelBtnText = ref(undefined)
    const open = ref(false)
    const textInput = ref(undefined)
    let relayData = undefined

    const closeModal = () => {
      id.value = undefined
      title.value = undefined
      body.value = undefined
      isTextInput.value = false
      confirmBtnText.value = undefined
      confirmBtnTextTwo.value = undefined
      cancelBtnText.value = undefined
      open.value = false
      textInput.value = undefined
      relayData = undefined
    }

    const cancelClick = () => {
      const modalResponsePayload = new ModalResponsePayload(id.value, false, relayData)
      emit('modalResponse', modalResponsePayload)
      closeModal()
    }

    const confirmClick = () => {
      let response = true
      if (isTextInput.value) {
        response = textInput.value
      }

      if(confirmBtnTextTwo.value){
        relayData = confirmBtnText.value
      }

      const modalResponsePayload = new ModalResponsePayload(id.value, response, relayData)
      emit('modalResponse', modalResponsePayload)
      closeModal()
    }

    const confirmClickTwo = () => {
      let response = true
      if (isTextInput.value) {
        response = textInput.value
      }

      if(confirmBtnTextTwo.value){
        relayData = confirmBtnTextTwo.value
      }

      const modalResponsePayload = new ModalResponsePayload(id.value, response, relayData)
      emit('modalResponse', modalResponsePayload)
      closeModal()
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })
    })

    watch(() => bus.value.get('launchModal'), (modalPayload) => {
      if (open.value) {
        console.log('A modal is already open')
      }

      if (modalPayload[0]) {
        id.value = modalPayload[0].getInstanceId()
        title.value = modalPayload[0].getTitle()
        body.value = modalPayload[0].getBody()
        isTextInput.value = modalPayload[0].getIsTextInput()
        confirmBtnText.value = modalPayload[0].getConfirmText()
        confirmBtnTextTwo.value = modalPayload[0].getConfirmTextTwo()
        cancelBtnText.value = modalPayload[0].getCancelText()
        open.value = true
        relayData = modalPayload[0].getRelayData()
      }
    })

    return {
      title,
      body,
      cancelBtnText,
      cancelClick,
      confirmBtnText,
      confirmBtnTextTwo,
      confirmClick,
      confirmClickTwo,
      isTextInput,
      isMobile,
      open,
      textInput,
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  margin-left: -150px;
}
</style>