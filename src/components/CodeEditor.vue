<template>
  <div class="w-1/2">
  <button class="w-60 h-10 mb-2 bg-white" @click="evalCode">RUN DAT SHIT</button>
  <codemirror
      v-model="code"
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
import {defineComponent, inject, ref, shallowRef} from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
import store from "../store/store";
import SFXApi from "../dal/sfx-api";

export default defineComponent({
  components: {
    Codemirror
  },
  name: "CodeEditor",
  setup() {
    const code = ref(`
    // play()

    // addFX(0,0,'test')
    // removeFX(row, col, fxId)
    // removeAllFX()
    `)
    const extensions = [javascript(), oneDark]
    const {bus, emit} = useEventsBus()

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    let stagedCode = ''

    const toast = inject('toast');

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
      alert(value)
    }

    const play = () => {
      emit('scrubTo', 0)
    }

    const addFX = async (row, col, fxName, params) => {

      const fxList = await new SFXApi().getSFX(store.token)

      const fx = fxList.find(fx => fx.name === fxName)

      if (!fx) {
        toast.error('Unable to find FX: ' + fxName)
        return
      }



      //VALID FX IS WORKING
      //VALID FX IS WORKING
      //VALID FX IS WORKING
      if(!fx.source_code || fx.source_code === '') {
        toast.error('FX INVALID: ' + fxName + ' has no source code')
        return
      }
      //VALID FX IS WORKING
      //VALID FX IS WORKING
      //VALID FX IS WORKING

      const fxObj = {
        id: fx.sfx_id,
        params: fx.name,
      }

      new GridProcessor(store.state.grid).addGridItemFX(row, col, fxObj)

      toast.success('FX: ' + fxName + ' has been added to grid')
    }

    const removeFX = (row, col, fxId) => {
      new GridProcessor(store.state.grid).removeGridItemFxById(row, col, fxId)
    }

    const removeAllFX = () => {
      new GridProcessor(store.state.grid).removeAllGridItemFx()
    }

    const stageCode = (e) => {
      stagedCode = e
    }

    const evalCode = () => {
      eval(stagedCode)
    }

    return {
      code,
      extensions,
      handleReady,
      stageCode,
      evalCode,
    }
  }
})
</script>