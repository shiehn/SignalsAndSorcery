<template>
  <div v-if="isMobile" class="flex justify-center"
       v-bind:style="{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9) ' + progressBarStart + '%, rgba(200, 247, 197,0.9) ' + progressBar + '%,  rgba(255,255,255,0.9) ' + progressBar + '%' }">
    <div class="flex w-full justify-center my-2">
      <button v-if="isPlaying === false" @click="play()"><img
          :src="imageAssets.playBtn"
          class="h-16 w-16 rounded-full hover:ring-4 hover:ring-green-500"/>
      </button>
      <button v-if="isPlaying === true" @click="pause()" class=""><img
          :src="imageAssets.pauseBtn"
          class="h-16 w-16 mr-1 rounded-full hover:ring-4 hover:ring-orange-500"/>
      </button>
      <button @click="stopButton()"><img :src="imageAssets.stopBtn"
                                         class="h-10 w-10 ml-4 rounded-full hover:ring-4 hover:ring-red-500"/></button>
    </div>
  </div>

  <div v-if="!isMobile" class="flex my-2 justify-center">
    <button v-if="isPlaying === false" @click="play()"><img :src="imageAssets.playBtn"
                                                            class="h-10 w-10 mr-1 rounded-full hover:ring-4 hover:ring-green-500"/>
    </button>
    <button v-if="isPlaying === true" @click="pause()"><img :src="imageAssets.pauseBtn"
                                                            class="h-10 w-10 mr-1 rounded-full hover:ring-4 hover:ring-orange-500"/>
    </button>
    <button @click="stopButton()"><img :src="imageAssets.stopBtn"
                                       class="h-6 w-6 ml-1 rounded-full hover:ring-4 hover:ring-red-500"/></button>
  </div>
  <div class="text-gray-300 text-xs text-center bg-white">build {{ buildNumber }}</div>


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
import GridProcessor from "../processors/grid-processor";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar";
import {BUILD_NUMBER} from "../constants/constants";

export default {
  name: "ComposerControls",
  components: {ComposerControlsScrollBar},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)

    const initAudioTag = ref({})
    const showInitAudio = ref(true)
    const initAudioSrc = ref('https://sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131.s3.us-west-2.amazonaws.com/init-audio-sample.mp3')

    let BUFFER_CACHE = {}
    let BUFFER_ROW_CACHE = []
    const displayRenderBtn = ref(false)

    let sourceNode = undefined;
    let buffer = undefined;
    let startedAt = 0
    let pausedAt = 0
    const isPlaying = ref(false)
    const isRendering = ref(false)

    const progressBarStart = ref(0)
    const progressBar = ref(0)

    const imageAssets = {
      playBtn: store.state.staticUrl + 'icons/play-button.png',
      pauseBtn: store.state.staticUrl + 'icons/pause-button.png',
      stopBtn: store.state.staticUrl + 'icons/stop-button.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    const buildNumber = ref(BUILD_NUMBER)

    onMounted(() => {
      store.state.updateArpeggioStateHash()
      isMobile.value = store.isMobile ? true : false
      showInitAudio.value = isMobile.value
    })

    const getTrackListByRow = (row) => {
      const tracks = store.state.grid[row].value.map((t) => {
        if (t.stem && t.stem.source) {
          return t.stem.source
        }
      })

      return tracks
    }

    const getLoopLengthFromBarsAndBPM = (barCount, bpm) => {
      let msPerBeatAtBpm = 60000 / bpm;
      let totalBeats = 4 * barCount;
      return msPerBeatAtBpm * totalBeats / 1000
    }


    const getBufferInRow = async (actx, trackSourceUrls, emptyBuffer) => {
      let buffer_list = new Array();
      for (let x = 0; x < trackSourceUrls.length; x++) {
        if (trackSourceUrls[x]) {
          // if (BUFFER_CACHE[trackSourceUrls[x]]) {
          //   buffer_list[x] = BUFFER_CACHE[trackSourceUrls[x]]
          // } else {
          await new Promise(function (resolve) {
            axios.get(trackSourceUrls[x] + "?x-request=js" /*s3 hack to prevent request from 2 origins */, {
              responseType: 'arraybuffer'
            }).then(function (response) {
              let audioData = response.data;
              if (audioData) {
                actx.decodeAudioData(audioData, function (buffer) {
                      buffer_list[x] = buffer;
                      resolve()
                    },
                    function (e) {
                      console.log(e.err);
                    });
              } else {
                console.error("problem!!");
              }
            })
                .catch(function (error) {
                  console.error("problem!! downloading " + error);
                })
          })

          // BUFFER_CACHE[trackSourceUrls[x]] = buffer
          // }
        } else {
          buffer_list[x] = emptyBuffer;
        }
      }

      return buffer_list;
    }

    const mixDown = (context, rowBufferList, totalLength) => {
      const numberOfChannels = 2
      //create a buffer using the totalLength and sampleRate of the first buffer node
      let finalMix = context.createBuffer(numberOfChannels, totalLength, rowBufferList[0].sampleRate);
      //first loop for row buffer list
      for (let i = 0; i < rowBufferList.length; i++) {
        // console.log('RENDERING ROW', i)
        // second loop for each channel ie left and right
        //here we get a reference to the final mix buffer data
        const leftChannel = 0
        const rightChannel = 1

        let finalMixBufferLeft = finalMix.getChannelData(leftChannel);
        let finalMixBufferRight = finalMix.getChannelData(rightChannel);

        let rowBufferChannelLeft = rowBufferList[i].getChannelData(leftChannel)
        let rowBufferChannelRight = rowBufferList[i].getChannelData(rightChannel)
        for (let j = 0; j < rowBufferList[i].length; j++) {
          finalMixBufferLeft[j] += rowBufferChannelLeft[j]
          finalMixBufferRight[j] += rowBufferChannelRight[j];
        }
      }
      return finalMix;
    }

    const generateEmptyBuffer = (actx, frameCount, sampleRate) => {
      //THIS IS LIKELY SILENCE SO GENERATE AN EMPTY BUFFER
      let emptyBuffer = actx.createBuffer(2, frameCount, sampleRate);
      for (let channel = 0; channel < emptyBuffer.numberOfChannels; channel++) {
        let nowBuffering = emptyBuffer.getChannelData(channel);
        for (let i = 0; i < emptyBuffer.length; i++) {
          nowBuffering[i] = 0;
        }
      }
      return emptyBuffer;
    }

    const unlockingAudioContext = (audioCtx) => {
      if (audioCtx.state !== 'suspended') return false;

      isPlaying.value = false
      const b = document.body;
      const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
      events.forEach(e => b.addEventListener(e, unlock, false));

      function unlock() {
        audioCtx.resume().then(clean);
      }

      function clean() {
        events.forEach(e => b.removeEventListener(e, unlock));
      }

      toast.success('Audio enabled. Click play to start!')

      return true;
    }

    const renderMix = async () => {
      await stop()

      buffer = undefined

      isRendering.value = true
      try {
        if (!store.context || store.context.state === 'closed') {
          let AudioContext = window.AudioContext || window.webkitAudioContext;
          store.context = new AudioContext();

          // initAudio()
        }

        if (unlockingAudioContext(store.context)) {
          return false
        }

        // try {
        //   await store.context.resume()
        // } catch (e) {
        //   alert('RESUME: ' + e)
        //   console.log('Error resuming WebAudio Context');
        // }
        // } catch (e) {
        //   alert('WebAudio api is not supported: ' + e)
        //   console.log('WebAudio api is not supported!!');
        // }
        let secondsInLoop = getLoopLengthFromBarsAndBPM(4, store.state.getGlobalBpm());
        const bufferSizePerLoop = secondsInLoop * store.context.sampleRate;
        const leftChannel = 0
        const rightChannel = 1
        const numOfRows = store.state.grid.length;
        let listOfTrimmedRowBuffers = new Array(numOfRows);

        let emptyBuffer = generateEmptyBuffer(store.context, bufferSizePerLoop, store.context.sampleRate)
        //ALL THIS ROW STUFF COULD BE A FUNC
        for (let n = 0; n < numOfRows; n++) {
          //CHECK IF THE ROW IS ALREADY CACHED
          if (!store.state.hasRowStateChanged(n) && BUFFER_ROW_CACHE[n]) {
            listOfTrimmedRowBuffers[n] = BUFFER_ROW_CACHE[n]
            continue
          }

          //GET THE TRACKS IN ONE ROW
          let tracksInRow = getTrackListByRow(n)

          //GET THE BUFFERS FOR ONE ROW
          let buffer_list_row = await getBufferInRow(store.context, tracksInRow, emptyBuffer);

          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TODO IF YOU PRE-TRIM THESE YOU CAN SAVE RENDER TIME
          let trimmedBufferListRow = new Array(buffer_list_row.length)
          for (let i = 0; i < buffer_list_row.length; i++) {
            // Create an empty buffer at the target length
            let newBuffer = store.context.createBuffer(2, bufferSizePerLoop, store.context.sampleRate);

            // for (let channel = 0; channel < 2; channel++) {
            // This gives us the actual array that contains the data
            let oldBufferLeft = buffer_list_row[i].getChannelData(leftChannel)
            let oldBufferRight = buffer_list_row[i].getChannelData(rightChannel)

            let nowBufferingLeft = newBuffer.getChannelData(leftChannel);
            let nowBufferingRight = newBuffer.getChannelData(rightChannel);

            for (let j = 0; j < newBuffer.length; j++) {
              nowBufferingLeft[j] = oldBufferLeft[j];
              nowBufferingRight[j] = oldBufferRight[j];
            }
            // }

            trimmedBufferListRow[i] = newBuffer
          }
          //MERGE ALL THE BUFFERS FOR A ROW
          //MERGE ALL THE BUFFERS FOR A ROW
          // MERGE ALL THE BUFFERS FOR A ROW
          let finalRowBuffer = store.context.createBuffer(2, bufferSizePerLoop * trimmedBufferListRow.length, store.context.sampleRate);

          let nowBufferingFinalRowLeft = finalRowBuffer.getChannelData(leftChannel);
          let nowBufferingFinalRowRight = finalRowBuffer.getChannelData(rightChannel);
          let finalRowBufferIdx = 0;
          for (let i = 0; i < trimmedBufferListRow.length; i++) {
            let oldBufferLeft = trimmedBufferListRow[i].getChannelData(leftChannel)
            let oldBufferRight = trimmedBufferListRow[i].getChannelData(rightChannel)
            for (let j = 0; j < oldBufferLeft.length; j++) {
              nowBufferingFinalRowLeft[finalRowBufferIdx] = oldBufferLeft[j];
              nowBufferingFinalRowRight[finalRowBufferIdx] = oldBufferRight[j];
              finalRowBufferIdx = finalRowBufferIdx + 1
            }
          }

          listOfTrimmedRowBuffers[n] = finalRowBuffer
          //UPDATE THE ROW CACHE
          BUFFER_ROW_CACHE[n] = finalRowBuffer
          store.state.updateRowStateHash(n)
        }

        buffer = mixDown(store.context, listOfTrimmedRowBuffers, listOfTrimmedRowBuffers[0].length);
      } catch (e) {
        console.log('ERROR', e)
        return
      }

      isRendering.value = false

      store.state.updateClipStateHash()
      updateRenderedArpeggios()
      store.state.updateArpeggioStateHash()
      emit('displayRenderBtn', false)

      return true
    }

    const updateRenderedArpeggios = () => {
      new GridProcessor(store.state.grid).updateArpeggioRenderedInMix()
    }

    const initAudio = () => {
      initAudioTag.value.load()
      initAudioTag.value.play()
      setTimeout(() => {
        initAudioTag.value.pause()
        showInitAudio.value = false
      }, 2000);
    }

    const play = async (offsetStartPercentage) => {

      // initAudio()

      if (store.state.clipCount() < 1) {
        toast.warning('Add clips to the arranger!');
      }

      emit('stopAllAudio', 'composer-controls')

      if (buffer) {
        let offset = pausedAt;

        const loopStart = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
        const loopEnd = buffer.duration * (store.state.playBack.loopEndPercent * 0.01)

        if (offset < loopStart || offset > loopEnd) {
          offset = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
        }

        if (offsetStartPercentage && offsetStartPercentage > 0 && offsetStartPercentage <= 100) {
          offset = buffer.duration * (offsetStartPercentage * 0.01)

          if (offset < loopStart || offset > loopEnd) {
            offset = buffer.duration * (store.state.playBack.loopStartPercent * 0.01)
          }
        }

        sourceNode = store.context.createBufferSource();
        sourceNode.buffer = buffer
        sourceNode.connect(store.context.destination);

        sourceNode.loopStart = loopStart
        sourceNode.loopEnd = loopEnd
        sourceNode.loop = true
        sourceNode.start(0, offset)

        startedAt = store.context.currentTime - offset;
        pausedAt = 0;
        console.log('isPlaying', 'play()')
        isPlaying.value = true;
      } else {
        if (await renderMix()) {
          await play()
        }
      }

      emit('disableAnimateSelector')
    }

    const stopButton = () => {
      emit('stopAllAudio')
      emit('disableAnimateSelector')
    }

    const stop = async () => {
      if (sourceNode) {
        sourceNode.disconnect();
        sourceNode.stop(0);
        sourceNode = null;
      }
      pausedAt = 0;
      startedAt = 0;
      console.log('isPlaying', 'stop()')
      isPlaying.value = false;
    }

    const pause = async () => {
      let elapsed = store.context.currentTime - startedAt;
      stop();
      pausedAt = elapsed;
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
      if (!isRendering.value) {
        await renderMix()
      }
    })

    watch(() => bus.value.get('renderMixIfNeeded'), async () => {
      if (store.state.hasClipStateChanged()) {
        if (!isRendering.value) {
          await renderMix()
        }
      }
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
        await play()
        await pause()
        await play(scrubToPercent)
      }
    })

    // THIS IS THE MAIN APPLICATION TICK - START
    let progressUITick = async () => {
      const displayDuration = getDuration()
      const displayCurrentTime = getCurrentRelativeTime()
      const startTime = getDuration() * (store.state.playBack.loopStartPercent * 0.01)
      const endTime = getDuration() * (store.state.playBack.loopEndPercent * 0.01)

      const loopDuration = endTime - startTime

      let positionInLoopSection = 0
      let markerPositionInLoop = 0

      let progress = 0

      positionInLoopSection = (displayCurrentTime - startTime) % loopDuration

      markerPositionInLoop = startTime + positionInLoopSection
      progress = Math.round(markerPositionInLoop / displayDuration * 100)

      if (Number.isInteger(progress)) {
        emit('updateProgressBar', progress)
      }

      if (displayCurrentTime > displayDuration) {
        await stop()
      }
    }

    setInterval(progressUITick, 50)
    // THIS IS THE MAIN APPLICATION TICK - STOP

    watch(() => bus.value.get('updateProgressBar'), (progressInt) => {
      if (!isMobile.value) {
        return
      }

      progressBar.value = progressInt
    })

    return {
      buildNumber,
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
      play,
      pause,
      progressBarStart,
      progressBar,
      stopButton,
      // renderArpeggios,
      renderMix,
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