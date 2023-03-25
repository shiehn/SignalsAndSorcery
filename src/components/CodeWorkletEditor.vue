<template>
  <div class="w-1/2">
    <label for="loadFX" class="text-white mr-4">LOAD SFX:</label>
    <select id="loadFX" v-model="selectedFX" @change="onSelectChange($event)"
            class="py-1 px-2 mr-4 mb-4 w-4/6 text-black text-m font-bold rounded-lg bg-gray-100">
      <option :value="item.value" v-for="item in sfxOptions">{{ item.label }}</option>
    </select>
    <button class="w-60 h-8 mb-2 bg-white" @click="evalCode">RUN DAT SHIT</button>
    <button @click="saveCode" class="w-60 h-8 mb-2 bg-green-500">SAVE</button>
    <button @click="newSFXDialog" class="w-40 h-8 mb-2 bg-orange-600">New FX</button>

<!--    <input v-model="currentSFX.name" />-->

    <codemirror
        v-model="currentSFX.code"
        placeholder="Code goes here..."
        :style="{
        'height': '400px',
        'width': '100%',
        'border-radius': '25px',
        'border': '2px solid #fff',
        'padding': '20px',
      }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
        @change="stageCode"
    />
  </div>
  <!--      @focus="log('focus', $event)"-->
  <!--      @blur="log('blur', $event)"-->
</template>

<script>
import {defineComponent, nextTick, onMounted, ref, shallowRef, watch} from 'vue'
import {Codemirror} from 'vue-codemirror'
import {javascript} from '@codemirror/lang-javascript'
import {oneDark} from '@codemirror/theme-one-dark'
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
import store from "../store/store";
import SFXApi from "../dal/sfx-api";
import ModalOpenPayload from "./ModalOpenPayload";
import {StemsAPI} from "../dal/StemsAPI";
import {ROW_TO_TYPE_MAP} from "../constants/constants";

export default defineComponent({
  components: {
    Codemirror
  },
  name: "CodeWorkletEditor",
  setup() {
    const currentSFX = ref({
      name: ref('untitled-sfx'),
      id: ref(-1),
      description: ref(''),
      code: ref('')
    })

    const extensions = [javascript(), oneDark]
    const {bus, emit} = useEventsBus()

    const sfxOptions = ref([])

    onMounted(async () => {

      await new Promise(resolve => setTimeout(resolve, 1000));

      const sfxApi = new SFXApi()
      const data = await sfxApi.getSFX(store.token)
      const options = data.flatMap(sfx => ({value: sfx.sfx_id, label: sfx.name}))
      sfxOptions.value = options
    });

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    let selectedFX = ref(null)

    let stagedCode = ''

    // Status is available at all times via Codemirror EditorView
    const getCodemirrorStates = () => {
      const state = view.value.state
      const ranges = state.selection.ranges
      const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
      const cursor = ranges[0].anchor
      const length = state.doc.length
      const lines = state.doc.lines
      // more state info ...
      // return ...
    }

    const broadCastCode = (value) => {
      //alert(value)
    }

    const play = () => {
      emit('scrubTo', 0)
    }

    const addFX = (row, col, fxId) => {
      new GridProcessor(store.state.grid).addGridItemFX(row, col, fxId)
    }

    const removeFX = (row, col, fxId) => {
      new GridProcessor(store.state.grid).removeGridItemFxById(row, col, fxId)
    }

    const extractSFXName = () => {
      registerProcessor
    }

    const stageCode = (e) => {
      //alert(e)
      stagedCode = e
    }

    const evalCode = () => {
      eval(stagedCode)
    }

    const saveCode = async () => {

      let errMsg = ''
      if (!currentSFX.value.name || currentSFX.value.name === ''){
        errMsg += 'Please enter a name for your SFX'
      }

      if (!currentSFX.value.code || currentSFX.value.code === ''){
        errMsg += '\nPlease enter some code for your SFX'
      }

      if (errMsg !== ''){
        alert(errMsg)
        return
      }

      const payload = {
        'sfx_id': currentSFX.value.id,
        'name': currentSFX.value.name,
        'description': currentSFX.value.description,
        'source_code': currentSFX.value.code,
        'fx_type': 'JS',
        'public': true,
      }

      const sfxApi = new SFXApi()
      const response = await sfxApi.saveSFX(store.token, payload)
      currentSFX.value.id = response.sfx_id
      currentSFX.value.name = response.name
      currentSFX.value.description = response.description
      currentSFX.value.code = response.source_code
    }




    const initSFX = async () => {
      currentSFX.value.name = 'untitled-sfx'
      currentSFX.value.id = -1
      currentSFX.value.description = 'add a description here'
      currentSFX.value.code = ''
    }

    const onSelectChange = async (e) => {
      const sfxApi = new SFXApi()
      const response = await sfxApi.getSFXById(store.token, selectedFX.value)
      currentSFX.value.name = response[0].name
      currentSFX.value.id = response[0].sfx_id
      currentSFX.value.description = response[0].description
      currentSFX.value.code = response[0].source_code
    }

    const createNewSFXDialogModalId = 'newSFXDialog'
    const newSFXDialog = () => {
      const modalPayload = new ModalOpenPayload(
          createNewSFXDialogModalId,
          'New Audio Worklet FX',
          'Enter a name for your new SFX.',
          'Create',
          '',
          'Cancel',
          true,
          undefined,
          true,
      )

      emit('launchModal', modalPayload)
    }

    watch(() => bus.value.get('focusSFX'), async (sfxId) => {
      await focusSFX(sfxId[0])
    })

    const focusSFX = async (sfxId) => {

      const sfxApi = new SFXApi()
      const response = await sfxApi.getSFXById(store.token, sfxId)
      currentSFX.value.name = response[0].name
      currentSFX.value.id = response[0].sfx_id
      currentSFX.value.description = response[0].description
      currentSFX.value.code = response[0].source_code 

      //LOAD OPTIONS
      const data = await sfxApi.getSFX(store.token)
      const options = data.flatMap(sfx => ({value: sfx.sfx_id, label: sfx.name}))
      sfxOptions.value = options

      //SET SELECTED
      selectedFX.value = sfxId
    }

    watch(() => bus.value.get('modalResponse'), async (modalResponsePayload) => {
      if (modalResponsePayload[0] && modalResponsePayload[0].getInstanceId() === createNewSFXDialogModalId) {

        if (modalResponsePayload[0].getResponse() && modalResponsePayload[0].getResponse() != '') {

          const payload = {
            'name': modalResponsePayload[0].getResponse(),
            'description': '',
            'source_code': '',
            'fx_type': 'JS',
            'public': true,
          }

          const sfxApi = new SFXApi()
          const response = await sfxApi.saveSFX(store.token, payload)
          currentSFX.value.id = response.sfx_id
          currentSFX.value.name = response.name
          currentSFX.value.description = response.description
          currentSFX.value.code = response.source_code

          //LOAD OPTIONS
          const data = await sfxApi.getSFX(store.token)
          const options = data.flatMap(sfx => ({value: sfx.sfx_id, label: sfx.name}))
          sfxOptions.value = options

          //SET SELECTED
          selectedFX.value = response.sfx_id
        }
      }
    })

    return {
      currentSFX,
      extensions,
      evalCode,
      handleReady,
      initSFX,
      onSelectChange,
      saveCode,
      selectedFX,
      stageCode,
      sfxOptions,
      newSFXDialog,
    }
  }
})
</script>