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
import {defineComponent, ref, shallowRef} from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import useEventsBus from "../events/eventBus";
import GridProcessor from "../processors/grid-processor";
import store from "../store/store";

export default defineComponent({
  components: {
    Codemirror
  },
  name: "CodeWorkletEditor",
  setup() {
    const code = ref(`
    registerProcessor('gain-processor',class extends AudioWorkletProcessor {
    static get parameterDescriptors() { return [{name:'gain',defaultValue:0.2}] }
    process(inputs, outputs, parameters) {
        const input = inputs[0],output = outputs[0]
        if (parameters.gain.length === 1) {
            for (let i=0;i<inputs[0].length;++i) {
                for (let j=0;j<inputs[0][i].length;++j) {
                    outputs[0][i][j] = inputs[0][i][j] * parameters.gain[0]
                }
            }
        } else {
            for (let i=0;i<inputs[0].length;++i) {
                for (let j=0;j<inputs[0][i].length;++j) {
                    outputs[0][i][j] = inputs[0][i][j] * parameters.gain[j]
                }
            }
        }
        return true
    }
})
    `)
    const extensions = [javascript(), oneDark]
    const {bus, emit} = useEventsBus()

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }


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
      alert(value)
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