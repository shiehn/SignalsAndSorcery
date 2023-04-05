<template>
  <div v-if="isMobile" class="flex justify-center"
       v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9) ' + progressBarStart + '%, rgba(200, 247, 197,0.9) ' + progressBar + '%,  rgba(255,255,255,0.9) ' + progressBar + '%' }">
    <div class="flex w-full justify-center my-2">
      <button @click="randomizeButton()"><img :src="imageAssets.randomizeBtn"
                                              class="h-10 w-10 rounded-full hover:ring-4 hover:ring-orange-500"/>
      </button>
      <button v-if="isPlaying === 0" @click="play()"><img
          :src="imageAssets.playBtn"
          class="h-16 w-16 ml-4 rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>
      <button v-if="isPlaying === 1" @click="pause()" class=""><img
          :src="imageAssets.pauseBtn"
          class="h-16 w-16 ml-4 rounded-full hover:ring-4 hover:ring-orange-500"/>
      </button>
      <button @click="stopButton()"><img :src="imageAssets.stopBtn"
                                         class="h-10 w-10 ml-4 rounded-full hover:ring-4 hover:ring-red-500"/></button>
    </div>
  </div>

  <div v-if="!isMobile"
       class="relative w-1/12 h-32 px-2 mr-2 min-w-fit border-2 border-black rounded-lg bg-white"
       style="background-color: rgba(255,255,255,0.9);">


    <div class="w-full mt-7"></div>

    <div class="w-full flex justify-center">

      <div id="pedalboard" ref="pedalBoard"></div>


      <button v-if="isPlaying === 0" @click="play()"><img :src="imageAssets.playBtn"
                                                          class="h-10 w-10 mr-1 rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>
      <button v-if="isPlaying === 1" @click="pause()"><img :src="imageAssets.pauseBtn"
                                                           class="h-10 w-10 mr-1 rounded-full hover:ring-4 hover:ring-orange-500"/>
      </button>
      <button @click="stopButton()"><img :src="imageAssets.stopBtn"
                                         class="h-6 w-6 ml-1 rounded-full hover:ring-4 hover:ring-red-500"/></button>
    </div>

    <div class="w-full mt-2">
      <button class="w-full text-center text-white bg-black text-xs mt-1 rounded hover:ring-4 hover:ring-yellow-500"
              @click="onUndoClicked">UNDO
      </button>
    </div>
  </div>


  <!--  <div v-html="renderHTMLTest" class="pedal draggable" style="box-sizing: border-box; transform: none;" id="pedal" data-x="13.31640625" data-y="-282.8828125">-->
  <!--  </div>-->


  <div v-if="showInitAudio" class="modal w-full flex justify-center">
    <div class="bg-white border-2 border-black rounded-lg p-4 shadow-lg"
         :class="{'w-3/4': isMobile, 'w-1/3': !isMobile}">
      <div class="bg-gray-100 rounded-lg p-2 mb-2">
        <p class="my-2 text-sm">This application requires the WebAudioApi to be explicitly enabled via user action.</p>
      </div>
      <div class="flex justify-end">
        <audio ref=initAudioTag class="w-full h-12">
          <source v-bind:src=initAudioSrc type="audio/mpeg"/>
          Your browser does not support the audio element.
        </audio>
        <button class="sas-green-btn w-full py-2 px-4" @click="initAudio">Enable Web Audio</button>
      </div>
    </div>
  </div>
</template>

<script>
import {inject, onMounted, ref} from "vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import axios from "axios";
import Crunker from "crunker";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";
import {BUILD_NUMBER} from "../constants/constants";
import LoadingSpinner from "./LoadingSpinner";
import Analytics from "../analytics/Analytics";
import {useKeypress} from 'vue3-keypress';
import OperableAudioBuffer from "../audioengine/operable-audio-buffer";
import {initializeWamHost} from "@webaudiomodules/sdk";
import MyWam from "../audioengine/my-wam";

// function cloneAudioBuffer(fromAudioBuffer) {
//   const audioBuffer = new AudioBuffer({
//     length: fromAudioBuffer.length,
//     numberOfChannels: fromAudioBuffer.numberOfChannels,
//     sampleRate: fromAudioBuffer.sampleRate
//   });
//   for (let channelI = 0; channelI < audioBuffer.numberOfChannels; ++channelI) {
//     const samples = fromAudioBuffer.getChannelData(channelI);
//     audioBuffer.copyToChannel(samples, channelI);
//   }
//   return audioBuffer;
// }

// async function applyFXToBuffer(bufferSizePerLoop, bufferSampleRate, inputBuffer) {
//
//   const offlineCtx = new OfflineAudioContext(2, bufferSizePerLoop, bufferSampleRate);
//
//   const now = new Date()
//   await offlineCtx.audioWorklet.addModule('http://localhost:8000/api/worklet?cachebuster=' + now.getTime())
//   let workletNode = await new AudioWorkletNode(offlineCtx, 'gain-processor')
//
//   let offlineSource = offlineCtx.createBufferSource();
//   offlineSource.buffer = inputBuffer;
//   offlineSource.connect(workletNode)
//   workletNode.connect(offlineCtx.destination);
//
//   // filter.connect(overdrive)
//   // overdrive.connect(delay)
//   //delay.connect(offlineCtx.destination);
//   offlineSource.start(0);
//   let renderedBuffer = await offlineCtx.startRendering()
//   //console.log('RENDING OFFLINE BEESH - COMPLETE')
//
//   return renderedBuffer
// }

export default {
  name: "ComposerControls",
  components: {ComposerControlsScrollBar, LoadingSpinner},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)

    const initAudioTag = ref({})
    const showInitAudio = ref(true)
    const initAudioSrc = ref('https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/init-audio-sample.mp3')

    // let BUFFER_CACHE = {}
    // let BUFFER_ROW_CACHE = []
    const displayRenderBtn = ref(false)

    let sourceNode = undefined;
    let buffer = undefined;
    let startedAt = 0
    let pausedAt = 0
    // let playBtnEnabled = false
    const isPlaying = ref(0)
    const isRendering = ref(false)

    const progressBarStart = ref(0)
    const progressBar = ref(0)

    const imageAssets = {
      playBtn: store.state.staticUrl + 'icons/play-button.png',
      pauseBtn: store.state.staticUrl + 'icons/pause-button.png',
      stopBtn: store.state.staticUrl + 'icons/stop-button.png',
      randomizeBtn: store.state.staticUrl + 'icons/refresh-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }


    const plugin1Url = "http://localhost:8000/static/wam/stonephaser/index.js";
    const plugin2Url = "http://localhost:8000/static/wam/BigMuff/index.js";
    //NEW CODE
    // index.js

    //COL 0
    const audioUrl0_0 = "http://localhost:8000/static/deleteme/00.wav";
    const audioUrl1_0 = "http://localhost:8000/static/deleteme/10.wav";
    const audioUrl2_0 = "http://localhost:8000/static/deleteme/20.wav";
    const audioUrl3_0 = "http://localhost:8000/static/deleteme/30.wav";
    const audioUrl4_0 = "http://localhost:8000/static/deleteme/40.wav";
    const audioUrl5_0 = "http://localhost:8000/static/deleteme/40.wav";

    //COL 1
    const audioUrl0_1 = "http://localhost:8000/static/deleteme/01.wav";
    const audioUrl1_1 = "http://localhost:8000/static/deleteme/11.wav";
    const audioUrl2_1 = "http://localhost:8000/static/deleteme/21.wav";
    const audioUrl3_1 = "http://localhost:8000/static/deleteme/31.wav";
    const audioUrl4_1 = "http://localhost:8000/static/deleteme/41.wav";
    const audioUrl5_1 = "http://localhost:8000/static/deleteme/41.wav";

    //COL 2
    const audioUrl0_2 = "http://localhost:8000/static/deleteme/00.wav";
    const audioUrl1_2 = "http://localhost:8000/static/deleteme/10.wav";
    const audioUrl2_2 = "http://localhost:8000/static/deleteme/20.wav";
    const audioUrl3_2 = "http://localhost:8000/static/deleteme/30.wav";
    const audioUrl4_2 = "http://localhost:8000/static/deleteme/40.wav";
    const audioUrl5_2 = "http://localhost:8000/static/deleteme/50.wav";

    //COL 3
    const audioUrl0_3 = "http://localhost:8000/static/deleteme/01.wav";
    const audioUrl1_3 = "http://localhost:8000/static/deleteme/11.wav";
    const audioUrl2_3 = "http://localhost:8000/static/deleteme/21.wav";
    const audioUrl3_3 = "http://localhost:8000/static/deleteme/31.wav";
    const audioUrl4_3 = "http://localhost:8000/static/deleteme/41.wav";
    const audioUrl5_3 = "http://localhost:8000/static/deleteme/51.wav";

    //COL 4
    const audioUrl0_4 = "http://localhost:8000/static/deleteme/00.wav";
    const audioUrl1_4 = "http://localhost:8000/static/deleteme/10.wav";
    const audioUrl2_4 = "http://localhost:8000/static/deleteme/20.wav";
    const audioUrl3_4 = "http://localhost:8000/static/deleteme/30.wav";
    const audioUrl4_4 = "http://localhost:8000/static/deleteme/40.wav";
    const audioUrl5_4 = "http://localhost:8000/static/deleteme/50.wav";

    //COL 5
    const audioUrl0_5 = "http://localhost:8000/static/deleteme/01.wav";
    const audioUrl1_5 = "http://localhost:8000/static/deleteme/11.wav";
    const audioUrl2_5 = "http://localhost:8000/static/deleteme/21.wav";
    const audioUrl3_5 = "http://localhost:8000/static/deleteme/31.wav";
    const audioUrl4_5 = "http://localhost:8000/static/deleteme/41.wav";
    const audioUrl5_5 = "http://localhost:8000/static/deleteme/51.wav";



// Initialize the Audio Context
    store.audioCtx = new AudioContext();
    //const btnStart = document.getElementById("btn-start");


    let audioArrayBuffer = undefined
    let audioBuffer = undefined
    let operableAudioBuffer = undefined

    //COL 0
    let nodeLayer0_0 = undefined
    let nodeLayer1_0 = undefined
    let nodeLayer2_0 = undefined
    let nodeLayer3_0 = undefined
    let nodeLayer4_0 = undefined
    let nodeLayer5_0 = undefined

    //COL 1
    let nodeLayer0_1 = undefined
    let nodeLayer1_1 = undefined
    let nodeLayer2_1 = undefined
    let nodeLayer3_1 = undefined
    let nodeLayer4_1 = undefined
    let nodeLayer5_1 = undefined

    //COL 2
    let nodeLayer0_2 = undefined
    let nodeLayer1_2 = undefined
    let nodeLayer2_2 = undefined
    let nodeLayer3_2 = undefined
    let nodeLayer4_2 = undefined
    let nodeLayer5_2 = undefined

    //COL 3
    let nodeLayer0_3 = undefined
    let nodeLayer1_3 = undefined
    let nodeLayer2_3 = undefined
    let nodeLayer3_3 = undefined
    let nodeLayer4_3 = undefined
    let nodeLayer5_3 = undefined

    //COL 4
    let nodeLayer0_4 = undefined
    let nodeLayer1_4 = undefined
    let nodeLayer2_4 = undefined
    let nodeLayer3_4 = undefined
    let nodeLayer4_4 = undefined
    let nodeLayer5_4 = undefined

    //COL 5
    let nodeLayer0_5 = undefined
    let nodeLayer1_5 = undefined
    let nodeLayer2_5 = undefined
    let nodeLayer3_5 = undefined
    let nodeLayer4_5 = undefined
    let nodeLayer5_5 = undefined


    let pluginInstance1 = undefined
    let pluginDomElement1 = ''

    let pluginInstance2 = undefined
    let pluginDomElement2 = ''


    //PROGRESS BAR
    let progress = 0

    onMounted(async () => {
      isMobile.value = store.isMobile ? true : false
      showInitAudio.value = isMobile.value


      //await store.audioCtx.suspend();
      /* Import from the Web Audio Modules 2.0 SDK to initialize Wam Host.
          It initializes a unique ID for the current AudioContext. */
      //const {default: initializeWamHost} = await import("../lib/sdk/initializeWamHost.js");
      const [hostGroupId] = await initializeWamHost(store.audioCtx);
      // Import our custom WAM Processor and the plugins.
      const {default: WAM1} = await import(/* webpackIgnore: true */ plugin1Url);
      const {default: WAM2} = await import(/* webpackIgnore: true */ plugin2Url);


      //const {default: OperableAudioBuffer} = await import("../lib/utils/operable-audio-buffer.js");


//COL 0
      const response0_0 = await fetch(audioUrl0_0);
      const audioArrayBuffer0_0 = await response0_0.arrayBuffer();
      const audioBuffer0_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_0 = Object.setPrototypeOf(audioBuffer0_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_0 = await fetch(audioUrl1_0);
      const audioArrayBuffer1_0 = await response1_0.arrayBuffer();
      const audioBuffer1_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_0 = Object.setPrototypeOf(audioBuffer1_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_0 = await fetch(audioUrl2_0);
      const audioArrayBuffer2_0 = await response2_0.arrayBuffer();
      const audioBuffer2_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_0 = Object.setPrototypeOf(audioBuffer2_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_0 = await fetch(audioUrl3_0);
      const audioArrayBuffer3_0 = await response3_0.arrayBuffer();
      const audioBuffer3_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_0 = Object.setPrototypeOf(audioBuffer3_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_0 = await fetch(audioUrl4_0);
      const audioArrayBuffer4_0 = await response4_0.arrayBuffer();
      const audioBuffer4_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_0 = Object.setPrototypeOf(audioBuffer4_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_0 = await fetch(audioUrl5_0);
      const audioArrayBuffer5_0 = await response5_0.arrayBuffer();
      const audioBuffer5_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_0 = Object.setPrototypeOf(audioBuffer5_0, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
//COL 1
      const response0_1 = await fetch(audioUrl0_1);
      const audioArrayBuffer0_1 = await response0_1.arrayBuffer();
      const audioBuffer0_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_1 = Object.setPrototypeOf(audioBuffer0_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_1 = await fetch(audioUrl1_1);
      const audioArrayBuffer1_1 = await response1_1.arrayBuffer();
      const audioBuffer1_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_1 = Object.setPrototypeOf(audioBuffer1_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_1 = await fetch(audioUrl2_1);
      const audioArrayBuffer2_1 = await response2_1.arrayBuffer();
      const audioBuffer2_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_1 = Object.setPrototypeOf(audioBuffer2_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_1 = await fetch(audioUrl3_1);
      const audioArrayBuffer3_1 = await response3_1.arrayBuffer();
      const audioBuffer3_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_1 = Object.setPrototypeOf(audioBuffer3_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_1 = await fetch(audioUrl4_1);
      const audioArrayBuffer4_1 = await response4_1.arrayBuffer();
      const audioBuffer4_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_1 = Object.setPrototypeOf(audioBuffer4_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_1 = await fetch(audioUrl5_1);
      const audioArrayBuffer5_1 = await response5_1.arrayBuffer();
      const audioBuffer5_1 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_1);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_1 = Object.setPrototypeOf(audioBuffer5_1, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------


      //COL 2
      const response0_2 = await fetch(audioUrl0_2);
      const audioArrayBuffer0_2 = await response0_2.arrayBuffer();
      const audioBuffer0_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_2 = Object.setPrototypeOf(audioBuffer0_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_2 = await fetch(audioUrl1_2);
      const audioArrayBuffer1_2 = await response1_2.arrayBuffer();
      const audioBuffer1_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_2 = Object.setPrototypeOf(audioBuffer1_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_2 = await fetch(audioUrl2_2);
      const audioArrayBuffer2_2 = await response2_2.arrayBuffer();
      const audioBuffer2_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_2 = Object.setPrototypeOf(audioBuffer2_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_2 = await fetch(audioUrl3_2);
      const audioArrayBuffer3_2 = await response3_2.arrayBuffer();
      const audioBuffer3_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_2 = Object.setPrototypeOf(audioBuffer3_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_2 = await fetch(audioUrl4_2);
      const audioArrayBuffer4_2 = await response4_2.arrayBuffer();
      const audioBuffer4_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_2 = Object.setPrototypeOf(audioBuffer4_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_2 = await fetch(audioUrl5_2);
      const audioArrayBuffer5_2 = await response5_2.arrayBuffer();
      const audioBuffer5_2 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_2);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_2 = Object.setPrototypeOf(audioBuffer5_2, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------


      //COL 3
      const response0_3 = await fetch(audioUrl0_3);
      const audioArrayBuffer0_3 = await response0_3.arrayBuffer();
      const audioBuffer0_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_3 = Object.setPrototypeOf(audioBuffer0_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_3 = await fetch(audioUrl1_3);
      const audioArrayBuffer1_3 = await response1_3.arrayBuffer();
      const audioBuffer1_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_3 = Object.setPrototypeOf(audioBuffer1_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_3 = await fetch(audioUrl2_3);
      const audioArrayBuffer2_3 = await response2_3.arrayBuffer();
      const audioBuffer2_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_3 = Object.setPrototypeOf(audioBuffer2_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_3 = await fetch(audioUrl3_3);
      const audioArrayBuffer3_3 = await response3_3.arrayBuffer();
      const audioBuffer3_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_3 = Object.setPrototypeOf(audioBuffer3_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_3 = await fetch(audioUrl4_3);
      const audioArrayBuffer4_3 = await response4_3.arrayBuffer();
      const audioBuffer4_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_3 = Object.setPrototypeOf(audioBuffer4_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_3 = await fetch(audioUrl5_3);
      const audioArrayBuffer5_3 = await response5_3.arrayBuffer();
      const audioBuffer5_3 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_3);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_3 = Object.setPrototypeOf(audioBuffer5_3, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------


      //COL 4
      const response0_4 = await fetch(audioUrl0_4);
      const audioArrayBuffer0_4 = await response0_4.arrayBuffer();
      const audioBuffer0_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_4 = Object.setPrototypeOf(audioBuffer0_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_4 = await fetch(audioUrl1_4);
      const audioArrayBuffer1_4 = await response1_4.arrayBuffer();
      const audioBuffer1_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_4 = Object.setPrototypeOf(audioBuffer1_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_4 = await fetch(audioUrl2_4);
      const audioArrayBuffer2_4 = await response2_4.arrayBuffer();
      const audioBuffer2_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_4 = Object.setPrototypeOf(audioBuffer2_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_4 = await fetch(audioUrl3_4);
      const audioArrayBuffer3_4 = await response3_4.arrayBuffer();
      const audioBuffer3_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_4 = Object.setPrototypeOf(audioBuffer3_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_4 = await fetch(audioUrl4_4);
      const audioArrayBuffer4_4 = await response4_4.arrayBuffer();
      const audioBuffer4_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_4 = Object.setPrototypeOf(audioBuffer4_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_4 = await fetch(audioUrl5_4);
      const audioArrayBuffer5_4 = await response5_4.arrayBuffer();
      const audioBuffer5_4 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_4);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_4 = Object.setPrototypeOf(audioBuffer5_4, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------


      //COL 5
      const response0_5 = await fetch(audioUrl0_5);
      const audioArrayBuffer0_5 = await response0_5.arrayBuffer();
      const audioBuffer0_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer0_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer0_5 = Object.setPrototypeOf(audioBuffer0_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response1_5 = await fetch(audioUrl1_5);
      const audioArrayBuffer1_5 = await response1_5.arrayBuffer();
      const audioBuffer1_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer1_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer1_5 = Object.setPrototypeOf(audioBuffer1_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response2_5 = await fetch(audioUrl2_5);
      const audioArrayBuffer2_5 = await response2_5.arrayBuffer();
      const audioBuffer2_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer2_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer2_5 = Object.setPrototypeOf(audioBuffer2_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response3_5 = await fetch(audioUrl3_5);
      const audioArrayBuffer3_5 = await response3_5.arrayBuffer();
      const audioBuffer3_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_5 = Object.setPrototypeOf(audioBuffer3_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response4_5 = await fetch(audioUrl4_5);
      const audioArrayBuffer4_5 = await response4_5.arrayBuffer();
      const audioBuffer4_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer4_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer4_5 = Object.setPrototypeOf(audioBuffer4_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------
      const response5_5 = await fetch(audioUrl5_5);
      const audioArrayBuffer5_5 = await response5_5.arrayBuffer();
      const audioBuffer5_5 = await store.audioCtx.decodeAudioData(audioArrayBuffer5_5);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer5_5 = Object.setPrototypeOf(audioBuffer5_5, OperableAudioBuffer.prototype);
      // -------------------------------------------------------------------------------------------------------------------------------------


      // Creating the Instance of the WAM plugins.
      pluginInstance1 = await WAM1.createInstance(hostGroupId, store.audioCtx);
      pluginDomElement1 = await pluginInstance1.createGui();
      pluginInstance2 = await WAM2.createInstance(hostGroupId, store.audioCtx);
      pluginDomElement2 = await pluginInstance2.createGui();


//COL 0
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_0 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_0 = wamInstance0_0.audioNode;
      nodeLayer1_0 = wamInstance1_0.audioNode;
      nodeLayer2_0 = wamInstance2_0.audioNode;
      nodeLayer3_0 = wamInstance3_0.audioNode;
      nodeLayer4_0 = wamInstance4_0.audioNode;
      nodeLayer5_0 = wamInstance5_0.audioNode;


//COL 1
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_1 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_1 = wamInstance0_1.audioNode;
      nodeLayer1_1 = wamInstance1_1.audioNode;
      nodeLayer2_1 = wamInstance2_1.audioNode;
      nodeLayer3_1 = wamInstance3_1.audioNode;
      nodeLayer4_1 = wamInstance4_1.audioNode;
      nodeLayer5_1 = wamInstance5_1.audioNode;


      //COL 2
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_2 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_2 = wamInstance0_2.audioNode;
      nodeLayer1_2 = wamInstance1_2.audioNode;
      nodeLayer2_2 = wamInstance2_2.audioNode;
      nodeLayer3_2 = wamInstance3_2.audioNode;
      nodeLayer4_2 = wamInstance4_2.audioNode;
      nodeLayer5_2 = wamInstance5_2.audioNode;


      //COL 3
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_3 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_3 = wamInstance0_3.audioNode;
      nodeLayer1_3 = wamInstance1_3.audioNode;
      nodeLayer2_3 = wamInstance2_3.audioNode;
      nodeLayer3_3 = wamInstance3_3.audioNode;
      nodeLayer4_3 = wamInstance4_3.audioNode;
      nodeLayer5_3 = wamInstance5_3.audioNode;

      //COL 4
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_4 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_4 = wamInstance0_4.audioNode;
      nodeLayer1_4 = wamInstance1_4.audioNode;
      nodeLayer2_4 = wamInstance2_4.audioNode;
      nodeLayer3_4 = wamInstance3_4.audioNode;
      nodeLayer4_4 = wamInstance4_4.audioNode;
      nodeLayer5_4 = wamInstance5_4.audioNode;


      //COL 4
      // Create an instance of our Processor. We can get from the instance the audio node.
      let wamInstance0_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance1_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance2_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance3_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance4_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);
      let wamInstance5_5 = await MyWam.createInstance(hostGroupId, store.audioCtx);

      nodeLayer0_5 = wamInstance0_5.audioNode;
      nodeLayer1_5 = wamInstance1_5.audioNode;
      nodeLayer2_5 = wamInstance2_5.audioNode;
      nodeLayer3_5 = wamInstance3_5.audioNode;
      nodeLayer4_5 = wamInstance4_5.audioNode;
      nodeLayer5_5 = wamInstance5_5.audioNode;




// -------------------------------------------------------------------------------------------------------------------------------------
      // -------------------------------------------------------------------------------------------------------------------------------------

      // -------------------------------------------------------------------------------------------------------------------------------------
      // -------------------------------------------------------------------------------------------------------------------------------------

      //COL 0
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_0.setAudio(operableAudioBuffer0_0.toArray(false, 0,0, store.audioCtx));
      nodeLayer1_0.setAudio(operableAudioBuffer1_0.toArray(false, 1,0, store.audioCtx));
      nodeLayer2_0.setAudio(operableAudioBuffer2_0.toArray(false, 2,0, store.audioCtx));
      nodeLayer3_0.setAudio(operableAudioBuffer3_0.toArray(false, 3,0, store.audioCtx));
      nodeLayer4_0.setAudio(operableAudioBuffer4_0.toArray(false, 4,0, store.audioCtx));
      nodeLayer5_0.setAudio(operableAudioBuffer5_0.toArray(false, 5,0, store.audioCtx));

      nodeLayer0_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_0.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);


      //COL 1
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_1.setAudio(operableAudioBuffer0_1.toArray(false, 0,1, store.audioCtx));
      nodeLayer1_1.setAudio(operableAudioBuffer1_1.toArray(false, 1,1, store.audioCtx));
      nodeLayer2_1.setAudio(operableAudioBuffer2_1.toArray(false, 2,1, store.audioCtx));
      nodeLayer3_1.setAudio(operableAudioBuffer3_1.toArray(false, 3,1, store.audioCtx));
      nodeLayer4_1.setAudio(operableAudioBuffer4_1.toArray(false, 4,1, store.audioCtx));
      nodeLayer5_1.setAudio(operableAudioBuffer5_1.toArray(false, 5,1, store.audioCtx));

      nodeLayer0_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_1.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);

      //COL 2
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_2.setAudio(operableAudioBuffer0_2.toArray(false, 0,2, store.audioCtx));
      nodeLayer1_2.setAudio(operableAudioBuffer1_2.toArray(false, 1,2, store.audioCtx));
      nodeLayer2_2.setAudio(operableAudioBuffer2_2.toArray(false, 2,2, store.audioCtx));
      nodeLayer3_2.setAudio(operableAudioBuffer3_2.toArray(false, 3,2, store.audioCtx));
      nodeLayer4_2.setAudio(operableAudioBuffer4_2.toArray(false, 4,2, store.audioCtx));
      nodeLayer5_2.setAudio(operableAudioBuffer5_2.toArray(false, 5,2, store.audioCtx));

      nodeLayer0_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_2.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);

      //COL 3
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_3.setAudio(operableAudioBuffer0_3.toArray(false, 0,3, store.audioCtx));
      nodeLayer1_3.setAudio(operableAudioBuffer1_3.toArray(false, 1,3, store.audioCtx));
      nodeLayer2_3.setAudio(operableAudioBuffer2_3.toArray(false, 2,3, store.audioCtx));
      nodeLayer3_3.setAudio(operableAudioBuffer3_3.toArray(false, 3,3, store.audioCtx));
      nodeLayer4_3.setAudio(operableAudioBuffer4_3.toArray(false, 4,3, store.audioCtx));
      nodeLayer5_3.setAudio(operableAudioBuffer5_3.toArray(false, 5,3, store.audioCtx));

      nodeLayer0_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_3.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);


      //COL 4
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_4.setAudio(operableAudioBuffer0_4.toArray(false, 0,4, store.audioCtx));
      nodeLayer1_4.setAudio(operableAudioBuffer1_4.toArray(false, 1,4, store.audioCtx));
      nodeLayer2_4.setAudio(operableAudioBuffer2_4.toArray(false, 2,4, store.audioCtx));
      nodeLayer3_4.setAudio(operableAudioBuffer3_4.toArray(false, 3,4, store.audioCtx));
      nodeLayer4_4.setAudio(operableAudioBuffer4_4.toArray(false, 4,4, store.audioCtx));
      nodeLayer5_4.setAudio(operableAudioBuffer5_4.toArray(false, 5,4, store.audioCtx));

      nodeLayer0_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_4.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);


      //COL 5
      // Sending audio to the processor and connecting the node to the output destination.
      //node.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer0_5.setAudio(operableAudioBuffer0_5.toArray(false, 0,5, store.audioCtx));
      nodeLayer1_5.setAudio(operableAudioBuffer1_5.toArray(false, 1,5, store.audioCtx));
      nodeLayer2_5.setAudio(operableAudioBuffer2_5.toArray(false, 2,5, store.audioCtx));
      nodeLayer3_5.setAudio(operableAudioBuffer3_5.toArray(false, 3,5, store.audioCtx));
      nodeLayer4_5.setAudio(operableAudioBuffer4_5.toArray(false, 4,5, store.audioCtx));
      nodeLayer5_5.setAudio(operableAudioBuffer5_5.toArray(false, 5,5, store.audioCtx));

      nodeLayer0_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer1_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer2_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer3_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer4_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);
      nodeLayer5_5.connect(pluginInstance1._audioNode).connect(store.audioCtx.destination);


      // -------------------------------------------------------------------------------------------------------------------------------------

//COL 0-5
      //node.connect(store.audioCtx.destination);
      nodeLayer0_0.parameters.get("playing").value = 0;
      nodeLayer1_0.parameters.get("playing").value = 0;
      nodeLayer2_0.parameters.get("playing").value = 0;
      nodeLayer3_0.parameters.get("playing").value = 0;
      nodeLayer4_0.parameters.get("playing").value = 0;
      nodeLayer5_0.parameters.get("playing").value = 0;

      nodeLayer0_1.parameters.get("loop").value = 0;
      nodeLayer1_1.parameters.get("loop").value = 0;
      nodeLayer2_1.parameters.get("loop").value = 0;
      nodeLayer3_1.parameters.get("loop").value = 0;
      nodeLayer4_1.parameters.get("loop").value = 0;
      nodeLayer5_1.parameters.get("loop").value = 0;


      //PLAYHEAD SHIT

      nodeLayer0_0.port.onmessage = ev => {
        if (ev.data.playhead) {
          // console.log('playhead', ev.data.playhead)
          progress = ev.data.playhead
        }
      }




      // //NEW CODE
      // await audioCtx.audioWorklet.addModule("/static/worklets/audio-player-processor.js");
      // const response = await fetch(audioUrl);
      // console.log('response.status', response.status)
      // audioArrayBuffer = await response.arrayBuffer();
      // audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);
      // console.log('audioBuffer', audioBuffer.length)
      //
      // // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      // operableAudioBuffer = Object.setPrototypeOf(audioBuffer, OperableAudioBuffer.prototype);
      // node = new AudioPlayerNode(audioCtx, 2);
      //
      // //Sending audio to the processor and connecting the node to the output destination.
      // node.setAudio(operableAudioBuffer.toArray());
      // node.connect(audioCtx.destination);
      // node.parameters.get("playing").value = 0;
      // node.parameters.get("loop").value = 1;
      //
      // //Sending audio to the processor and connecting the node to the output destination.
      // node.port.postMessage(operableAudioBuffer.toArray());
      //
      // node.connect(audioCtx.destination);
      // node.parameters.get("playing").value = 0;
      // node.parameters.get("loop").value = 1;
    })

    // const getTrackListByRow = (row) => {
    //   const tracks = store.state.grid[row].value.map((t) => {
    //     if (t.stem && t.stem.source) {
    //       return t.stem.source
    //     }
    //   })
    //
    //   return tracks
    // }
    //
    // const getLoopLengthFromBarsAndBPM = (barCount, bpm) => {
    //   let msPerBeatAtBpm = 60000 / bpm;
    //   let totalBeats = 4 * barCount;
    //   return msPerBeatAtBpm * totalBeats / 1000
    // }
    //
    //
    // const getBufferInRow = async (actx, trackSourceUrls, emptyBuffer) => {
    //   let downloadTasks = []
    //   let buffer_list = new Array();
    //   for (let x = 0; x < trackSourceUrls.length; x++) {
    //     if (trackSourceUrls[x]) {
    //       downloadTasks.push(new Promise(function (resolve) {
    //         axios.get(trackSourceUrls[x] + "?x-request=js" /*s3 hack to prevent request from 2 origins */, {
    //           responseType: 'arraybuffer'
    //         }).then(function (response) {
    //           let audioData = response.data;
    //           if (audioData) {
    //             actx.decodeAudioData(audioData, function (buffer) {
    //                   buffer_list[x] = buffer;
    //                   resolve()
    //                 },
    //                 function (e) {
    //                   console.log(e.err);
    //                 });
    //           } else {
    //             console.error("problem!!");
    //           }
    //         })
    //             .catch(function (error) {
    //               console.error("problem!! downloading " + error);
    //             })
    //       }))
    //     } else {
    //       buffer_list[x] = emptyBuffer;
    //     }
    //   }
    //
    //   await Promise.all(downloadTasks)
    //   return buffer_list;
    // }
    //
    // const mixDown = (context, rowBufferList, totalLength) => {
    //   const numberOfChannels = 2
    //   //create a buffer using the totalLength and sampleRate of the first buffer node
    //   let finalMix = context.createBuffer(numberOfChannels, totalLength, rowBufferList[0].sampleRate);
    //   //first loop for row buffer list
    //   for (let i = 0; i < rowBufferList.length; i++) {
    //     // console.log('RENDERING ROW', i)
    //     // second loop for each channel ie left and right
    //     //here we get a reference to the final mix buffer data
    //     const leftChannel = 0
    //     const rightChannel = 1
    //
    //     let finalMixBufferLeft = finalMix.getChannelData(leftChannel);
    //     let finalMixBufferRight = finalMix.getChannelData(rightChannel);
    //
    //     let rowBufferChannelLeft = rowBufferList[i].getChannelData(leftChannel)
    //     let rowBufferChannelRight = rowBufferList[i].getChannelData(rightChannel)
    //     for (let j = 0; j < rowBufferList[i].length; j++) {
    //       finalMixBufferLeft[j] += rowBufferChannelLeft[j]
    //       finalMixBufferRight[j] += rowBufferChannelRight[j];
    //     }
    //   }
    //   return finalMix;
    // }
    //
    // const generateEmptyBuffer = (actx, frameCount, sampleRate) => {
    //   //THIS IS LIKELY SILENCE SO GENERATE AN EMPTY BUFFER
    //   let emptyBuffer = actx.createBuffer(2, frameCount, sampleRate);
    //   for (let channel = 0; channel < emptyBuffer.numberOfChannels; channel++) {
    //     let nowBuffering = emptyBuffer.getChannelData(channel);
    //     for (let i = 0; i < emptyBuffer.length; i++) {
    //       nowBuffering[i] = 0;
    //     }
    //   }
    //   return emptyBuffer;
    // }
    //
    // const unlockingAudioContext = (audioCtx) => {
    //   if (!window.AudioContext || !window.webkitAudioContext) {
    //     return false;
    //   }
    //
    //   if (audioCtx.state !== 'suspended') return false;
    //
    // isPlaying.value = false
    //   const b = document.body;
    //   const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    //   events.forEach(e => b.addEventListener(e, unlock, false));
    //
    //   function unlock() {
    //     audioCtx.resume().then(clean);
    //   }
    //
    //   function clean() {
    //     events.forEach(e => b.removeEventListener(e, unlock));
    //   }
    //
    //   toast.success('Audio enabled. Click play to start!')
    //
    //   return true;
    // }
    //
    // const trimBuffer = async (i, bufferSizePerLoop, buffer) => {
    //   const leftChannel = 0
    //   const rightChannel = 1
    //
    //   let newBuffer = store.context.createBuffer(2, bufferSizePerLoop, store.context.sampleRate);
    //
    //   // for (let channel = 0; channel < 2; channel++) {
    //   // This gives us the actual array that contains the data
    //   let oldBufferLeft = buffer.getChannelData(leftChannel)
    //   let oldBufferRight = buffer.getChannelData(rightChannel)
    //
    //   let newBufferingLeft = newBuffer.getChannelData(leftChannel);
    //   let newBufferingRight = newBuffer.getChannelData(rightChannel);
    //
    //
    //   const fullBufferLength = oldBufferLeft.length
    //
    //   // Calcuate the tail size
    //   let tailSize = fullBufferLength - bufferSizePerLoop
    //   if(tailSize <= 0 ){
    //     //SHOULD THE TAIL JUST BE UNDEFINED ????? IF EMPTY
    //     tailSize = 2
    //   }
    //
    //   // Create an empty buffer at the target length
    //
    //
    //   let newBufferTail = store.context.createBuffer(2, tailSize, store.context.sampleRate);
    //
    //   let newBufferingTailLeft = newBufferTail.getChannelData(leftChannel);
    //   let newBufferingTailRight = newBufferTail.getChannelData(rightChannel);
    //
    //
    //   // const tailSize = oldBufferLeft.length - bufferSizePerLoop
    //   //
    //   // console.log('oldBufferLeft.length', oldBufferLeft.length)
    //   // console.log('bufferSizePerLoop', bufferSizePerLoop)
    //   // console.log('tailSize', tailSize)
    //
    //   for (let j = 0; j < fullBufferLength; j++) {
    //     if(j < newBuffer.length) {
    //       newBufferingLeft[j] = oldBufferLeft[j];
    //       newBufferingRight[j] = oldBufferRight[j];
    //     }
    //
    //     if(j >= newBuffer.length && j < newBufferTail.length + newBuffer.length) {
    //       newBufferingTailLeft[j - newBuffer.length] = oldBufferLeft[j];
    //       newBufferingTailRight[j - newBuffer.length] = oldBufferRight[j];
    //
    //       //console.log('newBufferTail[j - newBuffer.length]', newBufferTail[j - newBuffer.length])
    //     }
    //   }
    //
    //   // console.log('-----------------------')
    //   // console.log('original length', fullBufferLength)
    //   // console.log('target length', bufferSizePerLoop)
    //   // console.log('newBuffer length', newBufferingLeft.length)
    //   // console.log('newBufferTail length', newBufferTail.length)
    //   // console.log('-----------------------')
    //
    //   return {
    //     'index': i,
    //     'buffer': newBuffer,
    //     'bufferTail': newBufferTail,
    //   }
    // }
    //
    // const trimBuffers = async (buffer_list_row, bufferSizePerLoop) => {
    //
    //   let trimBufferTasks = []
    //   for (let i = 0; i < buffer_list_row.length; i++) {
    //     trimBufferTasks.push(trimBuffer(i, bufferSizePerLoop, buffer_list_row[i]))
    //   }
    //
    //   let trimmedBufferListRow = new Array(buffer_list_row.length)
    //
    //   let taskResults = await Promise.all(trimBufferTasks)
    //   for (let i = 0; i < taskResults.length; i++) {
    //     trimmedBufferListRow[taskResults[i].index] = {'buffer': taskResults[i].buffer, 'bufferTail': taskResults[i].bufferTail}
    //   }
    //
    //   return trimmedBufferListRow
    // }
    //
    // const createRowBuffer = async (bufferSizePerLoop, trimmedBufferListRow) => {
    //   const leftChannel = 0
    //   const rightChannel = 1
    //
    //   let finalRowBuffer = store.context.createBuffer(2, bufferSizePerLoop * trimmedBufferListRow.length, store.context.sampleRate);
    //   let nowBufferingFinalRowLeft = finalRowBuffer.getChannelData(leftChannel);
    //   let nowBufferingFinalRowRight = finalRowBuffer.getChannelData(rightChannel);
    //   let finalRowBufferIdx = 0;
    //
    //   //console.log('bufferSizePerLoop', bufferSizePerLoop)
    //   // console.log('trimmedBufferListRow.length', trimmedBufferListRow.length)
    //   //
    //
    //   for (let i = 0; i < trimmedBufferListRow.length; i++) {
    //     let oldBufferLeft = trimmedBufferListRow[i].buffer.getChannelData(leftChannel)
    //     let oldBufferRight = trimmedBufferListRow[i].buffer.getChannelData(rightChannel)
    //
    //     let oldBufferLeftTail = undefined
    //     let oldBufferRightTail = undefined
    //
    //     if(i>0){
    //       oldBufferLeftTail = trimmedBufferListRow[i-1].bufferTail.getChannelData(leftChannel)
    //       oldBufferRightTail = trimmedBufferListRow[i-1].bufferTail.getChannelData(rightChannel)
    //     }
    //
    //     for (let j = 0; j < bufferSizePerLoop; j++) {
    //
    //       //APPEND TAILS
    //       if(oldBufferLeftTail && j<oldBufferLeftTail.length){
    //
    //         nowBufferingFinalRowLeft[finalRowBufferIdx] = oldBufferLeft[j] + oldBufferLeftTail[j];
    //         nowBufferingFinalRowRight[finalRowBufferIdx] = oldBufferRight[j] + oldBufferRightTail[j];
    //       }else{
    //         nowBufferingFinalRowLeft[finalRowBufferIdx] = oldBufferLeft[j];
    //         nowBufferingFinalRowRight[finalRowBufferIdx] = oldBufferRight[j];
    //       }
    //
    //       finalRowBufferIdx = finalRowBufferIdx + 1
    //     }
    //   }
    //
    //   return finalRowBuffer
    // }
    //
    // const renderMix = async () => {
    //   emit('showLoadingSpinner')
    //
    //   //await stop()
    //   await pause()
    //
    //   buffer = undefined
    //
    //   isRendering.value = true
    //   try {
    //     if (!store.context || !window.AudioContext || !window.webkitAudioContext) {
    //       let AudioContext = window.AudioContext || window.webkitAudioContext;
    //       store.context = new AudioContext();
    //     }
    //
    //     if (unlockingAudioContext(store.context)) {
    //       return false
    //     }
    //
    //     let secondsInLoop = getLoopLengthFromBarsAndBPM(4, store.state.getGlobalBpm());
    //     const bufferSizePerLoop = secondsInLoop * store.context.sampleRate;
    //
    //     const numOfRows = store.state.grid.length;
    //     let listOfTrimmedRowBuffers = new Array(numOfRows);
    //
    //     let emptyBuffer = generateEmptyBuffer(store.context, bufferSizePerLoop, store.context.sampleRate)
    //     //ALL THIS ROW STUFF COULD BE A FUNC
    //     for (let n = 0; n < numOfRows; n++) {
    //
    //       //CHECK IF THE ROW IS ALREADY CACHED
    //       if (!store.state.hasRowStateChanged(n) && BUFFER_ROW_CACHE[n]) {
    //         listOfTrimmedRowBuffers[n] = BUFFER_ROW_CACHE[n]
    //         continue
    //       }
    //
    //       //GET THE LOOP SOURCE FOR ONE ROW
    //       let tracksInRow = getTrackListByRow(n)
    //
    //       //DOWNLOAD AND GET BUFFER FOR EACH LOOP IN ROW
    //       let buffer_list_row = await getBufferInRow(store.context, tracksInRow, emptyBuffer);
    //
    //
    //
    //       // //APPLY FX TO EACH BUFFER
    //       // for(let c = 0; c < buffer_list_row.length; c++){
    //       //   const row = n
    //       //   const col = c
    //       //   const gridProcessor = new GridProcessor(store.state.grid)
    //       //
    //       //   const fxs = gridProcessor.getGridItemFX(row, col)
    //       //   if(!fxs || fxs.length < 1){
    //       //     continue
    //       //   }
    //       //
    //       //   for(let fx of fxs){
    //       //     let processedAudio = await applyFXToBuffer(bufferSizePerLoop, store.context.sampleRate, buffer_list_row[c]);
    //       //     buffer_list_row[c] = processedAudio
    //       //   }
    //       // }
    //
    //
    //       //TRIM LOOPS IN EACH ROW
    //       let trimmedBufferListRow = await trimBuffers(buffer_list_row, bufferSizePerLoop)
    //
    //       // MERGE ALL THE BUFFERS FOR A ROW
    //       const finalRowBuffer = await createRowBuffer(bufferSizePerLoop, trimmedBufferListRow)
    //       listOfTrimmedRowBuffers[n] = finalRowBuffer
    //
    //       //UPDATE THE ROW CACHE
    //       BUFFER_ROW_CACHE[n] = finalRowBuffer
    //       store.state.updateRowStateHash(n)
    //     }
    //
    //     buffer = mixDown(store.context, listOfTrimmedRowBuffers, listOfTrimmedRowBuffers[0].length);
    //   } catch (e) {
    //     emit('hideLoadingSpinner')
    //     // playBtnEnabled = true
    //     console.log('ERROR', e)
    //     return
    //   }
    //
    //   isRendering.value = false
    //
    //   store.state.updateClipStateHash()
    //   emit('hideLoadingSpinner')
    //   emit('displayRenderBtn', false)
    //   emit('saveProjectToLocalStorage')
    //
    //   return true
    // }
    //
    const initAudio = () => {
      emit('showLoadingSpinner')
      initAudioTag.value.load()
      initAudioTag.value.play()
      setTimeout(() => {
        initAudioTag.value.pause()
        showInitAudio.value = false
        emit('hideLoadingSpinner')
        // playBtnEnabled = true
      }, 2000);
    }


    const renderHTMLTest = ref('')
    const pedalBoard = ref(null)
    const play = async () => {


      // console.clear()
      //
      //  const childNodes = Array.from(pluginDomElement1.shadowRoot.childNodes);


      // console.log('childNodes[2].innerHTML', childNodes[2])
      // console.log('childNodes[2].innerHTML', childNodes[2].innerHTML)


      //renderHTMLTest.value = childNodes[2].innerHTML


      // console.log('pedalBoard', pedalBoard.value.innerHTML)
      // pedalBoard.value = pluginDomElement


      if (showInitAudio.value) {
        return
      }

      if (store.audioCtx.state === "suspended") {
        await store.audioCtx.resume();
      }

      isPlaying.value = nodeLayer0_0.parameters.get("playing").value;
      if (isPlaying.value === 1) {
        //COL 0
        nodeLayer0_0.parameters.get("playing").value = 0;
        nodeLayer1_0.parameters.get("playing").value = 0;
        nodeLayer2_0.parameters.get("playing").value = 0;
        nodeLayer3_0.parameters.get("playing").value = 0;
        nodeLayer4_0.parameters.get("playing").value = 0;
        nodeLayer5_0.parameters.get("playing").value = 0;
        //COL 1
        nodeLayer0_1.parameters.get("playing").value = 0;
        nodeLayer1_1.parameters.get("playing").value = 0;
        nodeLayer2_1.parameters.get("playing").value = 0;
        nodeLayer3_1.parameters.get("playing").value = 0;
        nodeLayer4_1.parameters.get("playing").value = 0;
        nodeLayer5_1.parameters.get("playing").value = 0;
        //COL 2
        nodeLayer0_2.parameters.get("playing").value = 0;
        nodeLayer1_2.parameters.get("playing").value = 0;
        nodeLayer2_2.parameters.get("playing").value = 0;
        nodeLayer3_2.parameters.get("playing").value = 0;
        nodeLayer4_2.parameters.get("playing").value = 0;
        nodeLayer5_2.parameters.get("playing").value = 0;
        //COL 3
        nodeLayer0_3.parameters.get("playing").value = 0;
        nodeLayer1_3.parameters.get("playing").value = 0;
        nodeLayer2_3.parameters.get("playing").value = 0;
        nodeLayer3_3.parameters.get("playing").value = 0;
        nodeLayer4_3.parameters.get("playing").value = 0;
        nodeLayer5_3.parameters.get("playing").value = 0;
        //COL 4
        nodeLayer0_4.parameters.get("playing").value = 0;
        nodeLayer1_4.parameters.get("playing").value = 0;
        nodeLayer2_4.parameters.get("playing").value = 0;
        nodeLayer3_4.parameters.get("playing").value = 0;
        nodeLayer4_4.parameters.get("playing").value = 0;
        nodeLayer5_4.parameters.get("playing").value = 0;
        //COL 5
        nodeLayer0_5.parameters.get("playing").value = 0;
        nodeLayer1_5.parameters.get("playing").value = 0;
        nodeLayer2_5.parameters.get("playing").value = 0;
        nodeLayer3_5.parameters.get("playing").value = 0;
        nodeLayer4_5.parameters.get("playing").value = 0;
        nodeLayer5_5.parameters.get("playing").value = 0;
      } else {
        //COL 0
        nodeLayer0_0.parameters.get("playing").value = 1;
        nodeLayer1_0.parameters.get("playing").value = 1;
        nodeLayer2_0.parameters.get("playing").value = 1;
        nodeLayer3_0.parameters.get("playing").value = 1;
        nodeLayer4_0.parameters.get("playing").value = 1;
        nodeLayer5_0.parameters.get("playing").value = 1;
        //COL 1
        nodeLayer0_1.parameters.get("playing").value = 1;
        nodeLayer1_1.parameters.get("playing").value = 1;
        nodeLayer2_1.parameters.get("playing").value = 1;
        nodeLayer3_1.parameters.get("playing").value = 1;
        nodeLayer4_1.parameters.get("playing").value = 1;
        nodeLayer5_1.parameters.get("playing").value = 1;
        //COL 2
        nodeLayer0_2.parameters.get("playing").value = 1;
        nodeLayer1_2.parameters.get("playing").value = 1;
        nodeLayer2_2.parameters.get("playing").value = 1;
        nodeLayer3_2.parameters.get("playing").value = 1;
        nodeLayer4_2.parameters.get("playing").value = 1;
        nodeLayer5_2.parameters.get("playing").value = 1;
        //COL 3
        nodeLayer0_3.parameters.get("playing").value = 1;
        nodeLayer1_3.parameters.get("playing").value = 1;
        nodeLayer2_3.parameters.get("playing").value = 1;
        nodeLayer3_3.parameters.get("playing").value = 1;
        nodeLayer4_3.parameters.get("playing").value = 1;
        nodeLayer5_3.parameters.get("playing").value = 1;
        //COL 4
        nodeLayer0_4.parameters.get("playing").value = 1;
        nodeLayer1_4.parameters.get("playing").value = 1;
        nodeLayer2_4.parameters.get("playing").value = 1;
        nodeLayer3_4.parameters.get("playing").value = 1;
        nodeLayer4_4.parameters.get("playing").value = 1;
        nodeLayer5_4.parameters.get("playing").value = 1;
        //COL 5
        nodeLayer0_5.parameters.get("playing").value = 1;
        nodeLayer1_5.parameters.get("playing").value = 1;
        nodeLayer2_5.parameters.get("playing").value = 1;
        nodeLayer3_5.parameters.get("playing").value = 1;
        nodeLayer4_5.parameters.get("playing").value = 1;
        nodeLayer5_5.parameters.get("playing").value = 1;
        //btnStart.textContent = "Stop";
      }

      // if (showInitAudio.value) {
      //   return
      // }
      //
      // if (store.state.clipCount() < 1) {
      //   toast.warning('Add clips to the arranger!');
      //   return
      // }
      //
      // emit('showLoadingSpinner')
      //
      // emit('stopAllAudio', 'composer-controls')
      //
      // if (buffer && store.context) {
      //   let offset = pausedAt;
      //
      //   const loopStart = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
      //   const loopEnd = buffer.duration * (store.state.playBack.loopEndPercent * 0.01)
      //
      //   if (offset < loopStart || offset > loopEnd) {
      //     offset = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
      //   }
      //
      //   if (offsetStartPercentage && offsetStartPercentage > 0 && offsetStartPercentage <= 100) {
      //     offset = buffer.duration * (offsetStartPercentage * 0.01)
      //
      //     if (offset < loopStart || offset > loopEnd) {
      //       offset = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
      //     }
      //   }
      //
      //   stop();
      //   sourceNode = store.context.createBufferSource();
      //   sourceNode.buffer = buffer
      //   sourceNode.connect(store.context.destination);
      //
      //   sourceNode.loopStart = loopStart
      //   sourceNode.loopEnd = loopEnd
      //   sourceNode.loop = true
      //   sourceNode.start(0, offset)
      //
      //   startedAt = store.context.currentTime - offset;
      //   //pausedAt = 0;
      //   isPlaying.value = true;
      // } else {
      //   if (await renderMix()) {
      //     await play()
      //   }
      // }
      //
      // emit('disableAnimateSelector')
      // emit('hideLoadingSpinner')
      // // playBtnEnabled = true
      //
      // new Analytics().trackPlay()
    }


    const stopButton = () => {
      if (showInitAudio.value) {
        return
      }


      //FORCE BAR TO 0
      // emit('updateProgressBar', 0)
      //
      emit('stopAllAudio')
      // emit('disableAnimateSelector')
    }

    const stop = async () => {
      if (isPlaying.value === 0) {
        //COL 0
        nodeLayer0_0.parameters.get("playing").value = 0;
        nodeLayer1_0.parameters.get("playing").value = 0;
        nodeLayer2_0.parameters.get("playing").value = 0;
        nodeLayer3_0.parameters.get("playing").value = 0;
        nodeLayer4_0.parameters.get("playing").value = 0;
        nodeLayer5_0.parameters.get("playing").value = 0;
        //COL 1
        nodeLayer0_1.parameters.get("playing").value = 0;
        nodeLayer1_1.parameters.get("playing").value = 0;
        nodeLayer2_1.parameters.get("playing").value = 0;
        nodeLayer3_1.parameters.get("playing").value = 0;
        nodeLayer4_1.parameters.get("playing").value = 0;
        nodeLayer5_1.parameters.get("playing").value = 0;
        //COL 2
        nodeLayer0_2.parameters.get("playing").value = 0;
        nodeLayer1_2.parameters.get("playing").value = 0;
        nodeLayer2_2.parameters.get("playing").value = 0;
        nodeLayer3_2.parameters.get("playing").value = 0;
        nodeLayer4_2.parameters.get("playing").value = 0;
        nodeLayer5_2.parameters.get("playing").value = 0;
        //COL 3
        nodeLayer0_3.parameters.get("playing").value = 0;
        nodeLayer1_3.parameters.get("playing").value = 0;
        nodeLayer2_3.parameters.get("playing").value = 0;
        nodeLayer3_3.parameters.get("playing").value = 0;
        nodeLayer4_3.parameters.get("playing").value = 0;
        nodeLayer5_3.parameters.get("playing").value = 0;
        //COL 4
        nodeLayer0_4.parameters.get("playing").value = 0;
        nodeLayer1_4.parameters.get("playing").value = 0;
        nodeLayer2_4.parameters.get("playing").value = 0;
        nodeLayer3_4.parameters.get("playing").value = 0;
        nodeLayer4_4.parameters.get("playing").value = 0;
        nodeLayer5_4.parameters.get("playing").value = 0;
        //COL 5
        nodeLayer0_5.parameters.get("playing").value = 0;
        nodeLayer1_5.parameters.get("playing").value = 0;
        nodeLayer2_5.parameters.get("playing").value = 0;
        nodeLayer3_5.parameters.get("playing").value = 0;
        nodeLayer4_5.parameters.get("playing").value = 0;
        nodeLayer5_5.parameters.get("playing").value = 0;
        //btnStart.textContent = "Stop";


        //btnStart.textContent = "Start";
      }

      // else {
      //   console.log('play !1')
      //   node.parameters.get("playing").value = 1;
      //   //btnStart.textContent = "Stop";
      // }


      // if (sourceNode) {
      //   sourceNode.disconnect();
      //   sourceNode.stop(0);
      //   sourceNode = null;
      // }
      //
      // pausedAt = 0;
      // startedAt = 0;
      // isPlaying.value = false;
    }

    const pause = async () => {
      if (showInitAudio.value) {
        return
      }

      if (nodeLayer0_0.parameters.get("playing").value === 0) {
        nodeLayer0_0.parameters.get("playing").value = 1
        nodeLayer1_0.parameters.get("playing").value = 1
      } else {
        nodeLayer0_0.parameters.get("playing").value = 0
        nodeLayer1_0.parameters.get("playing").value = 0
      }

      //
      // let currentTime = store.context ? store.context.currentTime : 0
      // let elapsed = currentTime - startedAt;
      // stop();
      // pausedAt = elapsed;
    }

    let getCurrentRelativeTime = () => {
      if (pausedAt) {
        return pausedAt;
      }
      if (startedAt) {
        return store.context.currentTime - startedAt;
      }

      return 0;
    };

    let getDuration = () => {
      if (buffer) {
        return buffer.duration;
      }
      return 0;
    };

    let downloadMix = async () => {
      if (!buffer || (store.state.clipCount() < 1)) {
        toast.error('Add clips to arrange before downloading');
        return
      }

      let crunker = new Crunker();
      let output = crunker.export(buffer, 'audio/mp3')
      await crunker.download(output.blob, 'signals_and_sorcery') //TODO: the name should be the project name

      new Analytics().trackExportMP3()
    }

    const randomizeNewProjectWarningDialogModalId = 'randomizeNewProjectWarningDialogModalId'
    const randomizeButton = async () => {
      if (showInitAudio.value) {
        return
      }

      emit('newProjectDialog')
    }

    const onSpaceBarDown = ({keyCode}) => {
      if (!isPlaying.value && !isRendering.value) {
        play()
      } else {
        pause()
      }
    }

    useKeypress({
      keyEvent: "keydown",
      keyBinds: [
        {
          keyCode: 'space', // or keyCode as integer, e.g. 40
          success: onSpaceBarDown,
        },
      ]
    })

    let swwwitttchh = true
    const onUndoClicked = () => {


      console.log('nodeLayer0_0', nodeLayer0_0)



      //FOR TOMMORROW
      //seconds in song * samplerate * newPosPercent

      const newPos = 10.0

      nodeLayer0_0.port.postMessage({'position': newPos});
      nodeLayer1_0.port.postMessage({'position': newPos});
      nodeLayer2_0.port.postMessage({'position': newPos});
      nodeLayer3_0.port.postMessage({'position': newPos});
      nodeLayer4_0.port.postMessage({'position': newPos});
      nodeLayer5_0.port.postMessage({'position': newPos});

      nodeLayer0_1.port.postMessage({'position': newPos});
      nodeLayer1_1.port.postMessage({'position': newPos});
      nodeLayer2_1.port.postMessage({'position': newPos});
      nodeLayer3_1.port.postMessage({'position': newPos});
      nodeLayer4_1.port.postMessage({'position': newPos});
      nodeLayer5_1.port.postMessage({'position': newPos});

      nodeLayer0_2.port.postMessage({'position': newPos});
      nodeLayer1_2.port.postMessage({'position': newPos});
      nodeLayer2_2.port.postMessage({'position': newPos});
      nodeLayer3_2.port.postMessage({'position': newPos});
      nodeLayer4_2.port.postMessage({'position': newPos});
      nodeLayer5_2.port.postMessage({'position': newPos});

      nodeLayer0_3.port.postMessage({'position': newPos});
      nodeLayer1_3.port.postMessage({'position': newPos});
      nodeLayer2_3.port.postMessage({'position': newPos});
      nodeLayer3_3.port.postMessage({'position': newPos});
      nodeLayer4_3.port.postMessage({'position': newPos});
      nodeLayer5_3.port.postMessage({'position': newPos});

      nodeLayer0_4.port.postMessage({'position': newPos});
      nodeLayer1_4.port.postMessage({'position': newPos});
      nodeLayer2_4.port.postMessage({'position': newPos});
      nodeLayer3_4.port.postMessage({'position': newPos});
      nodeLayer4_4.port.postMessage({'position': newPos});
      nodeLayer5_4.port.postMessage({'position': newPos});

      nodeLayer0_5.port.postMessage({'position': newPos});
      nodeLayer1_5.port.postMessage({'position': newPos});
      nodeLayer2_5.port.postMessage({'position': newPos});
      nodeLayer3_5.port.postMessage({'position': newPos});
      nodeLayer4_5.port.postMessage({'position': newPos});
      nodeLayer5_5.port.postMessage({'position': newPos});

      // console.clear()
      //
      // swwwitttchh = !swwwitttchh
      //
      // console.log('pluginInstance1', pluginInstance1)
      // console.log('pluginInstance2', pluginInstance2)
      //
      //
      // //pluginInstance2._audioNode._output.descriptor.forEach((d)=> {console.log('DESCRIPT', d)})
      //
      // pluginInstance1._audioNode._output.setStonePhaserStereoBypass(swwwitttchh)
      // pluginInstance1._audioNode._output.setStonePhaserStereoLFO(5)
      // pluginInstance1._audioNode._output.setStonePhaserStereoMix(100)
      //
      // pluginInstance2._audioNode._output.setBigMuffBypass(swwwitttchh)
      // pluginInstance2._audioNode._output.setBigMuffDrive(100)
      //
      //
      // console.log('MUFF DRIVE', pluginInstance2._audioNode._output.getBigMuffDrive())


      //pluginInstance2._audioNode._output.descriptor.forEach((d)=> {console.log('MUFF', d)})


      //emit('loadProjectBackupFromLocalStorage')
    }

    watch(() => bus.value.get('displayRenderBtn'), (payload) => {
      displayRenderBtn.value = payload[0]
    })

    watch(() => bus.value.get('downloadMix'), async () => {
      await downloadMix()
    })

    watch(() => bus.value.get('stopAllAudio'), async (callerId) => {
      if (callerId != 'composer-controls') {
        await stop()
      }
    })

    watch(() => bus.value.get('renderMix'), async () => {
      // if (!isRendering.value) {
      //   await renderMix()
      // }
    })

    watch(() => bus.value.get('renderMixIfNeeded'), async () => {

      // setTimeout(async function () {
      //   if (store.state.hasClipStateChanged()) {
      //     if (!isRendering.value) {
      //       await renderMix()
      //     }
      //   }
      // }, 1000);
    })

    watch(() => bus.value.get('scrubTo'), async (scrubToPercent) => {
      if (store.state.clipCount() < 1) {
        toast.warning('Add clips to the arranger!');
        return
      }

      if (isPlaying.value && buffer && scrubToPercent && scrubToPercent > 0 && scrubToPercent <= 100) {
        await pause()
        await play(scrubToPercent)
      } else {
        // it is currently not playing, so start now
        await play() //this allows the user to scrub to a position and then first play but is buggy causing multiple playbacks
        await pause()
        await play(scrubToPercent)
      }
    })

    // THIS IS THE MAIN APPLICATION TICK - START
    let progressUITick = async () => {
      // console.log('P TICK')
      // const displayDuration = getDuration()
      // const displayCurrentTime = getCurrentRelativeTime()
      // const startTime = getDuration() * (store.state.playBack.loopStartPercent * 0.01)
      // const endTime = getDuration() * (store.state.playBack.loopEndPercent * 0.01)
      //
      // const loopDuration = endTime - startTime
      //
      // let positionInLoopSection = 0
      // let markerPositionInLoop = 0
      //
      // let progress = 0
      // positionInLoopSection = (displayCurrentTime - startTime) % loopDuration
      //
      // markerPositionInLoop = startTime + positionInLoopSection
      //

      // console.log('tick', progress)

      if (Number.isInteger(progress) && progress > 0) {
        emit('updateProgressBar', progress)
      }
    }

    setInterval(progressUITick, 200)
    // THIS IS THE MAIN APPLICATION TICK - STOP

    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
      if (!isMobile.value) {
        return
      }

      progressBar.value = progressInt
    })

    return {
      pedalBoard,
      renderHTMLTest,


      initAudio,
      initAudioSrc,
      initAudioTag,
      showInitAudio,
      displayRenderBtn,
      downloadMix,
      imageAssets,
      isMobile,
      isPlaying,
      isRendering,
      onUndoClicked,
      play,
      pause,
      stopButton,
      randomizeButton,
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
}
</style>