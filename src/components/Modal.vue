<template>
  <div v-if="open" class="modal w-1/3 bg-white border-2 border-black rounded-lg p-4 shadow-lg">
    <div class="bg-gray-100 rounded-lg p-2 mb-2">
      <h4 v-if="title" class="w-full border-b-2 border-gray-600">{{ title }}</h4>
      <p v-if="body" class="my-2">{{ body }}</p>
      <input v-if="isTextInput" class="w-full h-10 p-2" v-model="textInput">
    </div>
    <div class="flex justify-end">
      <button v-if="cancelBtnText" @click="cancelClick()" class="border-2 border-black ml-2 p-1 rounded-md">
        {{ cancelBtnText }}
      </button>
      <button v-if="confirmBtnText" @click="confirmClick()" class="border-2 border-black ml-2 p-1 rounded-md">
        {{ confirmBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import useEventsBus from "../events/eventBus";
import {watch} from "vue";
import ModalResponsePayload from "./ModalResponsePayload";

export default {
  name: "Modal",
  setup() {
    const {bus, emit} = useEventsBus()

    const id = ref(undefined)
    const title = ref(undefined)
    const body = ref(undefined)
    const isTextInput = ref(false)
    const confirmBtnText = ref(undefined)
    const cancelBtnText = ref(undefined)
    const open = ref(false)
    const textInput = ref(undefined)

    const closeModal = () => {
      id.value = undefined
      title.value = undefined
      body.value = undefined
      isTextInput.value = false
      confirmBtnText.value = undefined
      cancelBtnText.value = undefined
      open.value = false
      textInput.value = undefined
    }

    const cancelClick = () => {
      const modalResponsePayload = new ModalResponsePayload(id.value, false)
      emit('modalResponse', modalResponsePayload)
      closeModal()
    }

    const confirmClick = () => {
      let response = true
      if (isTextInput.value) {
        response = textInput.value
      }

      const modalResponsePayload = new ModalResponsePayload(id.value, response)
      emit('modalResponse', modalResponsePayload)
      closeModal()
    }

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
        cancelBtnText.value = modalPayload[0].getCancelText()
        open.value = true
      }
    })

    return {
      title,
      body,
      cancelBtnText,
      cancelClick,
      confirmBtnText,
      confirmClick,
      isTextInput,
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