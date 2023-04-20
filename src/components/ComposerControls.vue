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


//PROGRESS BARgetL
    let progress = 0

// Initialize the Audio Context
    store.audioCtx = new AudioContext();

    let audioGraph = new AudioGraph(store)


    onMounted(async () => {
      isMobile.value = store.isMobile ? true : false
      showInitAudio.value = isMobile.value
    })

    const initAudio = () => {
      emit('showLoadingSpinner')
      initAudioTag.value.load()
      initAudioTag.value.play()
      setTimeout(async () => {
        initAudioTag.value.pause()
        showInitAudio.value = false
        emit('hideLoadingSpinner')
        await audioGraph.init()
        // playBtnEnabled = true
      }, 2000);
    }

    const renderHTMLTest = ref('')
    const pedalBoard = ref(null)
    const play = async () => {
      if (showInitAudio.value) {
        return
      }

      emit('stopAllAudio', 'composer-controls')

      if (store.audioCtx.state === "suspended") {
        await store.audioCtx.resume();
      }

      if (audioGraph.getNodes()[0][0].getBaseNode().parameters.get("playing").value === 1) {
        //ITS ALREADY PLAYING
        return
      }

      for (let row = 0; row < audioGraph.getNodes().length; row++) {
        for (let col = 0; col < audioGraph.getNodes()[row].length; col++) {
          //SET THE PROCESS TO STOP by default
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("playing").value = 1;
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("loop").value = 0;
        }
      }

      isPlaying.value = 1

      //btnStart.textContent = "Stop";


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
      if (audioGraph.getNodes()[0][0].getBaseNode().parameters.get("playing").value === 0) {
        //ITS ALREADY STOPPED
        return
      }

      for (let row = 0; row < audioGraph.getNodes().length; row++) {
        for (let col = 0; col < audioGraph.getNodes()[row].length; col++) {
          //SET THE PROCESS TO STOP by default
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("playing").value = 0;
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("loop").value = 0;
        }
      }

      isPlaying.value = 0
      //btnStart.textContent = "Start";


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

      if (audioGraph.getNodes()[0][0].getBaseNode().parameters.get("playing").value === 0) {
        //ITS ALREADY STOPPED
        return
      }

      for (let row = 0; row < audioGraph.getNodes().length; row++) {
        for (let col = 0; col < audioGraph.getNodes()[row].length; col++) {
          //SET THE PROCESS TO STOP by default
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("playing").value = 0;
          audioGraph.getNodes()[row][col].getBaseNode().parameters.get("loop").value = 0;
        }
      }

      isPlaying.value = 0
      //btnStart.textContent = "Start";

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


      const newPos = samplesInFourBars * (percentOfScrubBar * .01)

      for (let row = 0; row < audioGraph.getNodes()[0].length; row++) {
        for (let col = 0; col < audioGraph.getNodes()[row].length; col++) {
          audioGraph.getNodes()[row][col].getBaseNode().port.postMessage({'position': newPos});
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
      nodeLayer0_0.setAudio(operableAudioBuffer3_0.toArray(false, 0, 0, store.audioCtx, store.state.getGlobalBpm()));
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
      // pluginInstance2._audioNode._output.setBigMuff
      // Bypass(swwwitttchh)
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

    watch(() => bus.value.get('setupAudioGraphListeners'), async () => {

      audioGraph = new AudioGraph(store)

      if (audioGraph.getNodes() && audioGraph.getNodes()[0] && audioGraph.getNodes()[0][0] && audioGraph.getNodes()[0][0].getBaseNode().port) {
        audioGraph.getNodes()[0][0].getBaseNode().port.onmessage = ev => {
          if (ev.data.playhead) {
            // console.log('playhead', ev.data.playhead)
            progress = ev.data.playhead
          }
        }
      }
    })


    // watch(() => bus.value.get('populateTheAudioGraph'), async () => {
    //
    // })

//     watch(() => bus.value.get('renderMix'), async () => {
// //RENDER MIX IS CALLED WHEN A RANDOM PROJECT IS CREATED
//       setTimeout(async function () {
//         console.log('POPULATE GRAPH')
//         await audioGraph.populateNodesWithBuffers()
//       }, 1000);
//       // if (!isRendering.value) {
//       //   await renderMix()
//       // }
//     })

    watch(() => bus.value.get('renderMixIfNeeded'), async () => {
      //console.log('renderMixIfNeeded')
      const audioGraph = new AudioGraph(store)
      await audioGraph.populateNodesWithBuffers()
      emit('updateLoopPositions')
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

      //KEEP PLAY/STOP/PAUSE IN SYNC
      if (audioGraph.getNodes() && audioGraph.getNodes()[0]
          && audioGraph.getNodes()[0][0]
      && audioGraph.getNodes()[0][0].getBaseNode()) {
        isPlaying.value = audioGraph.getNodes()[0][0].getBaseNode().parameters.get("playing").value
      }


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

      for (let row = 0; row < audioGraph.getNodes().length; row++) {
        for (let col = 0; col < audioGraph.getNodes()[row].length; col++) {
          if(audioGraph.getNodes()[row][col]){
            audioGraph.getNodes()[row][col].getBaseNode().port.postMessage({'loopStart': loopStartPercent, 'loopEnd': loopEndPercent});
          }
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
      progressBar,
      progressBarStart,
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