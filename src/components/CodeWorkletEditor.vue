<template>
  <div class="w-1/2">
    <div class="w-full flex">
      <label for="loadFX" class="text-white mr-2">FX:</label>
      <select id="loadFX" v-model="selectedFX" @change="onSelectChange($event)"
              class="py-1 px-2 mr-4 mb-4 w-4/6 text-black text-m font-bold rounded-lg bg-gray-100">
        <option :value="item.value" v-for="item in sfxOptions">{{ item.label }}</option>
      </select>

      <label for="filterFX" class="text-white mr-2">FILTER:</label>
      <select id="filterFX" v-model="selectedFXFilter" @change="onSelectChange($event)"
              class="py-1 px-2 mr-4 mb-4 w-4/6 text-black text-m font-bold rounded-lg bg-gray-100">
        <option :value="item" v-for="item in sfxFilterOptions">{{ item }}</option>
      </select>
    </div>

    <button class="w-60 h-8 mb-2 bg-white" @click="evalCode">RUN DAT SHIT</button>
    <button @click="saveCode" class="w-60 h-8 mb-2 bg-green-500">SAVE</button>
    <button @click="newSFXDialog" class="w-40 h-8 mb-2 bg-orange-600">New FX</button>
    <div class="w-8 h-8 p-2" :class="fxColorId">ID</div>

    <div class="border-white border-2">
      <label for="wetOption" class="text-white">WET</label>
      <input type="radio"
             id="wetOption"
             value="wet"
             @change="wetDryChecked"
             v-model="wetDrySelected"/>
      <label for="dryOption" class="text-white">DRY</label>
      <input type="radio"
             id="dryOption"
             value="dry"
             @change="wetDryChecked"
             v-model="wetDrySelected"/>

      <button class="w-8- h-8 bg-yellow-500" @click="previewFX">PREVIEW</button>

    </div>

    <!--    <input v-model="currentSFX.name" />-->



    <codemirror
        v-model="currentSFX.code"
        :placeholder="placeholderText"
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
import {defineComponent, inject, nextTick, onMounted, ref, shallowRef, watch} from 'vue'
import {Codemirror} from 'vue-codemirror'
import {javascript} from '@codemirror/lang-javascript'
import {oneDark} from '@codemirror/theme-one-dark'
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
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
    const store = inject('store')
    const toast = inject('toast')

    const sfxOptions = ref([])
    const sfxFilterOptions = ref(['all', 'public', 'yours'])
    const placeholderText = ref('Code goes here...')

    const wetDrySelected = ref(['wet'])

    const fxColorId = ref('bg-gray-500')
    const setFXColor = () => {
      fxColorId.value = store.fxColorGenerator.getFxColor(currentSFX.value.id)
    }

    const loadSFXOptions = async () => {
      const sfxApi = new SFXApi()
      const data = await sfxApi.getSFX(store.token, selectedFXFilter.value)
      const options = data.flatMap(sfx => ({value: sfx.sfx_id, label: sfx.name}))
      sfxOptions.value = options
    }

    const clearSFXConsole = () => {
      currentSFX.value.name = undefined
      currentSFX.value.id = -1
      currentSFX.value.description = ''
      currentSFX.value.code = placeholderText.value
      setFXColor()
    }

    onMounted(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await loadSFXOptions()
      // if(sfxOptions.value && sfxOptions.value.length > 0){
      //   console.log('THERE ARE OPTIONS', sfxOptions.value[0].value)
      //   selectedFX.value = sfxOptions.value[0].value
      //   const sfxApi = new SFXApi()
      //   const response = await sfxApi.getSFXById(store.token, sfxOptions.value[0].value)
      //   currentSFX.value.name = response[0].name
      //   currentSFX.value.id = response[0].sfx_id
      //   currentSFX.value.description = response[0].description
      //   currentSFX.value.code = response[0].source_code
      //   setFXColor()
      // } else {
      //   clearSFXConsole()
      // }
    });

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    let selectedFX = ref(null)
    let selectedFXFilter = ref('all')

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
      if (!currentSFX.value.name || currentSFX.value.name === '') {
        errMsg += 'Please enter a name for your SFX'
      }

      if (!currentSFX.value.code || currentSFX.value.code === '') {
        errMsg += '\nPlease enter some code for your SFX'
      }

      if (errMsg !== '') {
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
      if(response){
        toast.success('SFX Saved!')
      } else {
        toast.error('Error! Are you logged in & the FX owner?')
        return
      }

      currentSFX.value.id = response.sfx_id
      currentSFX.value.name = response.name
      currentSFX.value.description = response.description
      currentSFX.value.code = response.source_code
      setFXColor()
    }


    const initSFX = async () => {
      currentSFX.value.name = 'untitled-sfx'
      currentSFX.value.id = -1
      currentSFX.value.description = 'add a description here'
      currentSFX.value.code = ''
      setFXColor()
    }

    const onSelectChange = async (e) => {
      if (e.target.id === 'filterFX') {
        await loadSFXOptions()

        //IF THERE ARE OPTIONS IN THE SELECT, THEN SELECT THE FIRST ONE
        if(sfxOptions.value && sfxOptions.value.length > 0){
          selectedFX.value = sfxOptions.value[0].value
          const sfxApi = new SFXApi()
          const response = await sfxApi.getSFXById(store.token, sfxOptions.value[0].value)
          currentSFX.value.name = response[0].name
          currentSFX.value.id = response[0].sfx_id
          currentSFX.value.description = response[0].description
          currentSFX.value.code = response[0].source_code
          setFXColor()
        } else {
          clearSFXConsole()
        }

        return
      }

      // console.log('currentSFX.value', currentSFX.value)
      // if (!currentSFX.value || !currentSFX.value.id || currentSFX.value.id === -1) {
      //   //IF NOTHING IS SELECTED, THEN DO NOTHING
      //   return
      // }

      if(e.target.id === 'loadFX'){
        const sfxApi = new SFXApi()
        const response = await sfxApi.getSFXById(store.token, selectedFX.value)
        currentSFX.value.name = response[0].name
        currentSFX.value.id = response[0].sfx_id
        currentSFX.value.description = response[0].description
        currentSFX.value.code = response[0].source_code
        setFXColor()
      }


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
      setFXColor()

      //LOAD OPTIONS
      const data = await sfxApi.getSFX(store.token, selectedFXFilter.value)
      const options = data.flatMap(sfx => ({value: sfx.sfx_id, label: sfx.name}))
      sfxOptions.value = options

      //SET SELECTED
      selectedFX.value = sfxId
    }

    const wetDryChecked = () => {
      console.log('checked', wetDrySelected.value)
    }

    const previewFX= () => {
      console.log('previewFX CLICKED')
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
          if(response){
            toast.success('SFX Saved!')
          } else {
            toast.error('Error! Are you logged in & the FX owner?')
            return
          }

          currentSFX.value.id = response.sfx_id
          currentSFX.value.name = response.name
          currentSFX.value.description = response.description
          currentSFX.value.code = response.source_code
          setFXColor()

          //LOAD OPTIONS
          const data = await sfxApi.getSFX(store.token, selectedFXFilter.value)
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
      fxColorId,
      handleReady,
      initSFX,
      onSelectChange,
      placeholderText,
      previewFX,
      saveCode,
      selectedFX,
      selectedFXFilter,
      stageCode,
      sfxFilterOptions,
      sfxOptions,
      newSFXDialog,
      wetDrySelected,
      wetDryChecked
    }
  }
})
</script>