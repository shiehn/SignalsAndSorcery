<template>
  <div class="flex flex-col mt-4">
    <composer-controls-scroll-bar></composer-controls-scroll-bar>

    <div class="flex w-full justify-center">
      <div class="w-1/3 flex items-center">
        <global-track-values></global-track-values>
      </div>
      <div class="flex w-full justify-center w-1/3">
        <button v-if="isPlaying === false" class="m-4" @click="play()"><img :src="imageAssets.playBtn" class="h-24"/>
        </button>
        <button v-if="isPlaying === true" class="m-4" @click="pause()"><img :src="imageAssets.pauseBtn" class="h-24"/>
        </button>
        <button class="m-4" @click="stop()"><img :src="imageAssets.stopBtn" class="h-16"/></button>
      </div>
      <div class="flex w-full justify-center w-1/3">
        <button v-if="isPlaying === false" class="h-10 w-10 m-4" @click="downloadMix()"><img
            :src="imageAssets.downloadBtn" class="h-24"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {inject, ref} from "vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar.vue";
import GlobalTrackValues from "./GlobalTrackValues";
import axios from "axios";

export default {
  name: "ComposerControls",
  components: {ComposerControlsScrollBar, GlobalTrackValues},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const requiresRender = ref(false)
    const toast = inject('toast');

    let BUFFER_CACHE = {}
    let BUFFER_ROW_CACHE = []

    let context = undefined
    let sourceNode = undefined;
    let buffer = undefined;
    let startedAt = 0
    let pausedAt = 0
    const isPlaying = ref(false)
    const isRendering = ref(false)

    const imageAssets = {
      playBtn: store.state.staticUrl + 'icons/play-button.png',
      pauseBtn: store.state.staticUrl + 'icons/pause-button.png',
      stopBtn: store.state.staticUrl + 'icons/stop-button.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    const getTrackListByRow = (row) => {
      const tracks = store.state.grid[row].value.map((t) => {
        if (t.source) {
          return t.source.replace('.wav', '.mp3')
        }
        return t.source
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
            axios.get(trackSourceUrls[x], {
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
        // second loop for each channel ie left and right
        //here we get a reference to the final mix buffer data
        const leftChannel = 0
        const rightChannel = 1

        let finalMixBufferLeft = finalMix.getChannelData(leftChannel);
        let finalMixBufferRight = finalMix.getChannelData(rightChannel);

        //last is loop for updating/summing the track buffer with the final mix buffer

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


    const renderMix = async () => {
      await stop()

      if (store.state.clipCount() < 1) {
        return
      }

      isRendering.value = true
      try {
        /* load audio buffers - start */
        try {
          if (context) {
            try {
              if (context.state !== 'closed') {
                await context.close();
              }
            } catch (e) {
              console.log('Unable to close WebAudio Context');
            }
          }
          let AudioContext = window.AudioContext || window.webkitAudioContext;
          context = new AudioContext();
          try {
            await context.resume()
          } catch (e) {
            console.log('Error resuming WebAudio Context');
          }
        } catch (e) {
          console.log('WebAudio api is not supported!!');
        }

        let secondsInLoop = getLoopLengthFromBarsAndBPM(4, store.state.globalBpm);
        const bufferSizePerLoop = secondsInLoop * 44100;

        const leftChannel = 0
        const rightChannel = 1
        const numOfRows = 4;
        let listOfTrimmedRowBuffers = new Array(numOfRows);

        let emptyBuffer = generateEmptyBuffer(context, bufferSizePerLoop, 44100)

        //ALL THIS ROW STUFF COULD BE A FUNC
        for (let n = 0; n < numOfRows; n++) {
          //CHECK IF THE ROW IS ALREADY CACHED
          if (!store.state.hasRowStateChanged(n) && BUFFER_ROW_CACHE[n]) {
            console.log("ROW IS IN CACHED!!")
            listOfTrimmedRowBuffers[n] = BUFFER_ROW_CACHE[n]
            continue
          }

          //GET THE TRACKS IN ONE ROW
          let tracksInRow = getTrackListByRow(n)
          // console.log('tracksInRow_' + n, tracksInRow)

          //GET THE BUFFERS FOR ONE ROW
          let buffer_list_row = await getBufferInRow(context, tracksInRow, emptyBuffer);

          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TODO IF YOU PRE-TRIM THESE YOU CAN SAVE RENDER TIME
          let trimmedBufferListRow = new Array(buffer_list_row.length)
          for (let i = 0; i < buffer_list_row.length; i++) {
            // Create an empty buffer at the target length
            let newBuffer = context.createBuffer(2, bufferSizePerLoop, 44100);

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
          let finalRowBuffer = context.createBuffer(2, bufferSizePerLoop * trimmedBufferListRow.length, 44100);

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

        buffer = mixDown(context, listOfTrimmedRowBuffers, listOfTrimmedRowBuffers[0].length);
      } catch (e) {
        console.log('ERROR', e)
      }

      isRendering.value = false


      store.state.updateStateHash()

      //emit('renderMixIfNeeded')


      console.timeEnd('FULL_RENDER')
    }

    const playClip = async () => {
      await stop()
    }

    const playMix = async (offsetStartPercentage) => {
      if (store.state.clipCount() < 1) {
        toast.warning('Add clips to the arranger!');
        return
      }

      emit('stopAllAudio', 'composer-controls')

      if (buffer) {
        let offset = pausedAt;

        if (offsetStartPercentage && offsetStartPercentage > 0 && offsetStartPercentage <= 100) {
          offset = buffer.duration * (offsetStartPercentage * 0.01)
        }

        sourceNode = context.createBufferSource();
        sourceNode.buffer = buffer
        sourceNode.connect(context.destination);
        sourceNode.start(0, offset);
        startedAt = context.currentTime - offset;
        pausedAt = 0;
        isPlaying.value = true;
      } else {
        await renderMix()
        await playMix()
      }
    }

    const stop = async () => {
      if (sourceNode) {
        sourceNode.disconnect();
        sourceNode.stop(0);
        sourceNode = null;
      }
      pausedAt = 0;
      startedAt = 0;
      isPlaying.value = false;
    }

    const pause = async () => {
      let elapsed = context.currentTime - startedAt;
      stop();
      pausedAt = elapsed;
    }

    let getCurrentTime = () => {
      if (pausedAt) {
        return pausedAt;
      }
      if (startedAt) {
        return context.currentTime - startedAt;
      }
      return 0;
    };

    let getDuration = () => {
      if (buffer) {
        return buffer.duration;
      }
      return 0;
    };

    const printPlayState = async () => {
      console.log('STATE: actx:', context)

      if (context) {
        console.log('STATE: actx.currentTime', context.currentTime)
        console.log('STATE: actx.state', context.state)
      }

      if (sourceNode) {
        console.log('STATE: mix', sourceNode)
      } else {
        console.log('STATE: mix is undefined')
      }
    }

    let updateDurations = async () => {
      let displayDuration = getDuration()
      let displayCurrentTime = getCurrentTime()

      let progress = Math.round(displayCurrentTime / displayDuration * 100)
      if (Number.isInteger(progress)) {
        emit('updateProgressBar', progress)
      }

      if (displayCurrentTime > displayDuration) {
        await stop()
      }
    }

    setInterval(updateDurations, 100)

    let downloadMix = () => {
      toast.error('Not yet implemented :(');
      return
    }

    watch(() => bus.value.get('stopAllAudio'), async (callerId) => {
      if (callerId != 'composer-controls') {
        await stop()
      }
    })

    watch(() => bus.value.get('renderMixIfNeeded'), async (callerId) => {
      if (store.state.hasStateChanged()) {
        requiresRender.value = true

        if (!isRendering.value) {
          await renderMix()
        }
      } else {
        requiresRender.value = false
        // console.log('RENDER NOT NEEDED')
      }
    })

    watch(() => bus.value.get('scrubTo'), async (scrubToPercent) => {
      if (store.state.clipCount() < 1) {
        toast.warning('Add clips to the arranger!');
        return
      }

      if (isPlaying.value && buffer && scrubToPercent && scrubToPercent > 0 && scrubToPercent <= 100) {
        await pause()
        await playMix(scrubToPercent)
      } else {
        // it is currently not playing, so start now
        await playMix()
        await pause()
        await playMix(scrubToPercent)
      }
    })

    return {
      downloadMix,
      imageAssets,
      isPlaying,
      isRendering,
      play: playMix,
      pause,
      stop,
      printPlayState,
      renderMix,
      requiresRender
    }
  }
}
</script>

<style scoped>

</style>