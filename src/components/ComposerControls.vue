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
import AudioGraph from "../audioengine/audio-graph";

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





    // //COL 0
    const audioUrl0_0 = "http://localhost:8000/static/deleteme/00.wav";
    // const audioUrl1_0 = "http://localhost:8000/static/deleteme/10.wav";
    // const audioUrl2_0 = "http://localhost:8000/static/deleteme/20.wav";
    // const audioUrl3_0 = "http://localhost:8000/static/deleteme/30.wav";
    // const audioUrl4_0 = "http://localhost:8000/static/deleteme/40.wav";
    // const audioUrl5_0 = "http://localhost:8000/static/deleteme/40.wav";
    //
    // //COL 1
    // const audioUrl0_1 = "http://localhost:8000/static/deleteme/01.wav";
    // const audioUrl1_1 = "http://localhost:8000/static/deleteme/11.wav";
    // const audioUrl2_1 = "http://localhost:8000/static/deleteme/21.wav";
    // const audioUrl3_1 = "http://localhost:8000/static/deleteme/31.wav";
    // const audioUrl4_1 = "http://localhost:8000/static/deleteme/41.wav";
    // const audioUrl5_1 = "http://localhost:8000/static/deleteme/41.wav";
    //
    // //COL 2
    // const audioUrl0_2 = "http://localhost:8000/static/deleteme/00.wav";
    // const audioUrl1_2 = "http://localhost:8000/static/deleteme/10.wav";
    // const audioUrl2_2 = "http://localhost:8000/static/deleteme/20.wav";
    // const audioUrl3_2 = "http://localhost:8000/static/deleteme/30.wav";
    // const audioUrl4_2 = "http://localhost:8000/static/deleteme/40.wav";
    // const audioUrl5_2 = "http://localhost:8000/static/deleteme/50.wav";
    //
    // //COL 3
    // const audioUrl0_3 = "http://localhost:8000/static/deleteme/01.wav";
    // const audioUrl1_3 = "http://localhost:8000/static/deleteme/11.wav";
    // const audioUrl2_3 = "http://localhost:8000/static/deleteme/21.wav";
    // const audioUrl3_3 = "http://localhost:8000/static/deleteme/31.wav";
    // const audioUrl4_3 = "http://localhost:8000/static/deleteme/41.wav";
    // const audioUrl5_3 = "http://localhost:8000/static/deleteme/51.wav";
    //
    // //COL 4
    // const audioUrl0_4 = "http://localhost:8000/static/deleteme/00.wav";
    // const audioUrl1_4 = "http://localhost:8000/static/deleteme/10.wav";
    // const audioUrl2_4 = "http://localhost:8000/static/deleteme/20.wav";
    // const audioUrl3_4 = "http://localhost:8000/static/deleteme/30.wav";
    // const audioUrl4_4 = "http://localhost:8000/static/deleteme/40.wav";
    // const audioUrl5_4 = "http://localhost:8000/static/deleteme/50.wav";
    //
    // //COL 5
    // const audioUrl0_5 = "http://localhost:8000/static/deleteme/01.wav";
    // const audioUrl1_5 = "http://localhost:8000/static/deleteme/11.wav";
    // const audioUrl2_5 = "http://localhost:8000/static/deleteme/21.wav";
    // const audioUrl3_5 = "http://localhost:8000/static/deleteme/31.wav";
    // const audioUrl4_5 = "http://localhost:8000/static/deleteme/41.wav";
    // const audioUrl5_5 = "http://localhost:8000/static/deleteme/51.wav";

//PROGRESS BARgetL
    let progress = 0

// Initialize the Audio Context
    store.audioCtx = new AudioContext();
    //const btnStart = document.getElementById("btn-start");


    let audioArrayBuffer = undefined
    let audioBuffer = undefined
    let operableAudioBuffer = undefined










    // const numOfRows = store.state.grid.length;
    // let listOfTrimmedRowBuffers = new Array(numOfRows);





    const audioGraph = new AudioGraph(store)


    onMounted(async () => {
      isMobile.value = store.isMobile ? true : false
      showInitAudio.value = isMobile.value






      emit('showLoadingSpinner')
      await audioGraph.init()

      //PLAYHEAD SHIT
      audioGraph.getNodes()[0][0].port.onmessage = ev => {
        if (ev.data.playhead) {
          // console.log('playhead', ev.data.playhead)
          progress = ev.data.playhead
        }
      }

      emit('hideLoadingSpinner')
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

      isPlaying.value = audioGraph.getNodes()[0][0].parameters.get("playing").value;
      if (isPlaying.value === 0) {

        for(let row = 0; row< audioGraph.getNodes()[0].length; row++){
          for(let col = 0; col < audioGraph.getNodes()[row].length; col++){
            //SET THE PROCESS TO STOP by default
            audioGraph.getNodes()[row][col].parameters.get("playing").value = 1;
            audioGraph.getNodes()[row][col].parameters.get("loop").value = 0;
          }
        }

        isPlaying.value = 1

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
      if (isPlaying.value === 1) {
        for(let row = 0; row< audioGraph.getNodes()[0].length; row++){
          for(let col = 0; col < audioGraph.getNodes()[row].length; col++){
            //SET THE PROCESS TO STOP by default
            audioGraph.getNodes()[row][col].parameters.get("playing").value = 0;
            audioGraph.getNodes()[row][col].parameters.get("loop").value = 0;
          }
        }

        isPlaying.value = 0
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




    const setPlaybackPosition = async (percentOfScrubBar) => {

      const numOfBars = 4
      const secInLoop = audioGraph.getLoopLengthFromBarsAndBPM(numOfBars, store.state.getGlobalBpm())
      const samplesInFourBars = secInLoop * store.audioCtx.sampleRate * numOfBars


      const newPos = samplesInFourBars * (percentOfScrubBar*.01)

      for(let row = 0; row< audioGraph.getNodes()[0].length; row++){
        for(let col = 0; col < audioGraph.getNodes()[row].length; col++){
          audioGraph.getNodes()[row][col].port.postMessage({'position': newPos});
        }
      }

    }

    let swwwitttchh = true
    const onUndoClicked = async () => {

      const response3_0 = await fetch(audioUrl0_1);
      const audioArrayBuffer3_0 = await response3_0.arrayBuffer();
      const audioBuffer3_0 = await store.audioCtx.decodeAudioData(audioArrayBuffer3_0);
      // Transforming the audio buffer into a custom audio buffer to add logic inside. (Needed to manipulate the audio, for example, editing...)
      const operableAudioBuffer3_0 = Object.setPrototypeOf(audioBuffer3_0, OperableAudioBuffer.prototype);
      nodeLayer0_0.setAudio(operableAudioBuffer3_0.toArray(false, 0,0, store.audioCtx, store.state.getGlobalBpm()));
      // console.log('nodeLayer0_0', nodeLayer0_0)



      // setPlaybackPosition()

      //FOR TOMMORROW
      //seconds in song * samplerate * newPosPercent



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



      setPlaybackPosition(scrubToPercent)

      // if (isPlaying.value && buffer && scrubToPercent && scrubToPercent > 0 && scrubToPercent <= 100) {
      //   await pause()
      //   await play(scrubToPercent)
      // } else {
      //   // it is currently not playing, so start now
      //   await play() //this allows the user to scrub to a position and then first play but is buggy causing multiple playbacks
      //   await pause()
      //   await play(scrubToPercent)
      // }
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

    setInterval(progressUITick, 50)
    // THIS IS THE MAIN APPLICATION TICK - STOP


    const updateLoopPositions = () => {
      const loopStartPercent = store.state.playBack.loopStartPercent
      const loopEndPercent = store.state.playBack.loopEndPercent

      for(let row = 0; row< audioGraph.getNodes()[0].length; row++){
        for(let col = 0; col < audioGraph.getNodes()[row].length; col++){
          audioGraph.getNodes()[row][col].port.postMessage({'loopStart': loopStartPercent, 'loopEnd': loopEndPercent});
        }
      }

    }

    watch(() => bus.value.get('updateLoopPositions'), () => {
      updateLoopPositions()
    })

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