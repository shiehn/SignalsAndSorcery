<template>
  <div v-if="open" class="modal w-1/3 bg-white border-2 border-black rounded-lg p-4 shadow-lg">
    <div class="bg-gray-100 rounded-lg p-2 mb-2">
      <p>TITLE = {{ title }}</p>
      <p>OPEN = {{ open }}</p>
    </div>
    <div class="flex justify-end">
      <button v-if="cancelBtnText" @click="cancelClick()" class="border-2 border-black p-1 rounded-md">{{cancelBtnText}}</button>
      <button v-if="confirmBtnText" @click="confirmClick()" class="border-2 border-black p-1 rounded-md">{{confirmBtnText}}</button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import useEventsBus from "../events/eventBus";
import {watch} from "vue";

export default {
  name: "Modal",
  setup() {
    const {bus, emit} = useEventsBus()

    const id = ref(undefined)
    const title = ref(undefined)
    const body = ref(undefined)
    const confirmBtnText = ref(undefined)
    const cancelBtnText = ref(undefined)
    const open = ref(false)

    const closeModal = () => {
      id.value = undefined
      title.value = undefined
      body.value = undefined
      confirmBtnText.value = undefined
      cancelBtnText.value = undefined
      open.value = false
    }

    const cancelClick = () => {
      //emit('modal-cancel-click', id.value)
      closeModal()
    }

    const confirmClick = () => {
      //emit('modal-confirm-click', id.value)
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
      open,
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