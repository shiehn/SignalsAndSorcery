<template>
  <div class="flex mt-4 justify-center">
    <button v-if="isPlaying === false" @click="play()"><img :src="imageAssets.playBtn" class="h-10 w-10 mr-1"/>
    </button>
    <button v-if="isPlaying === true" @click="pause()"><img :src="imageAssets.pauseBtn" class="h-10 w-10 mr-1"/>
    </button>
    <button @click="stop()"><img :src="imageAssets.stopBtn" class="h-6 w-6 ml-1"/></button>
  </div>
</template>

<script>
import {inject, ref} from "vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import ComposerControlsScrollBar from "./ComposerControlsScrollBar.vue";
import GlobalTrackValues from "./GlobalTrackValues";
import axios from "axios";
import Crunker from "crunker";
import StartArpPayload from "./arpeggiator/start-arp-payload";

export default {
  name: "ComposerControls",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const requiresRender = ref(false)
    const toast = inject('toast');

    let BUFFER_CACHE = {}
    let BUFFER_ROW_CACHE = []

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

      console.log("A")

      if (store.state.clipCount() < 1) {
        return
      }

      isRendering.value = true
      try {
        /* load audio buffers - start */
        try {
          if (store.context) {
            try {
              if (store.context.state !== 'closed') {
                await store.context.close();
              }
            } catch (e) {
              console.log('Unable to close WebAudio Context');
            }
          }
          let AudioContext = window.AudioContext || window.webkitAudioContext;
          store.context = new AudioContext();

          Tone.setContext(store.context)
          Tone.getContext().lookAhead = 10;
          Tone.getContext().updateInterval = 0.3;

          try {
            await store.context.resume()
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
        const numOfRows = store.state.grid.length;
        let listOfTrimmedRowBuffers = new Array(numOfRows);

        let emptyBuffer = generateEmptyBuffer(store.context, bufferSizePerLoop, 44100)

        //ALL THIS ROW STUFF COULD BE A FUNC
        for (let n = 0; n < numOfRows; n++) {
          //CHECK IF THE ROW IS ALREADY CACHED
          if (!store.state.hasRowStateChanged(n) && BUFFER_ROW_CACHE[n]) {
            listOfTrimmedRowBuffers[n] = BUFFER_ROW_CACHE[n]
            continue
          }

          //GET THE TRACKS IN ONE ROW
          let tracksInRow = getTrackListByRow(n)
          // console.log('tracksInRow_' + n, tracksInRow)

          if (n == 4) {
            console.log('TRACKS IN ROW 5', tracksInRow)
          }

          //GET THE BUFFERS FOR ONE ROW
          let buffer_list_row = await getBufferInRow(store.context, tracksInRow, emptyBuffer);

          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TRIM THE BUFFERS IN EACH ROW
          //TODO IF YOU PRE-TRIM THESE YOU CAN SAVE RENDER TIME
          let trimmedBufferListRow = new Array(buffer_list_row.length)
          for (let i = 0; i < buffer_list_row.length; i++) {
            // Create an empty buffer at the target length
            let newBuffer = store.context.createBuffer(2, bufferSizePerLoop, 44100);

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
          let finalRowBuffer = store.context.createBuffer(2, bufferSizePerLoop * trimmedBufferListRow.length, 44100);

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
      }

      isRendering.value = false

      store.state.updateStateHash()
    }


    let scheduler = undefined


    const playMix = async (offsetStartPercentage) => {

      //emit('startArpeggiator')

      console.log('TONE STARTED FROM PLAY MIX')

      if (store.state.clipCount() < 1) {
        toast.warning('Add clips to the arranger!');
        return
      }

      // emit('stopAllAudio', 'composer-controls')
      //emit('startArpeggiator', new StartArpPayload(0, 0, store.state.globalKey, store.state.globalBpm))

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

        console.log('B')

        // sourceNode = store.context.createBufferSource();
        // sourceNode.buffer = buffer
        // sourceNode.connect(store.context.destination);


        console.log('C')

        sourceNode = new Tone.BufferSource(buffer, () => {
          console.log('CALLBACK')
        })

        const player = new Tone.Player(sourceNode).toDestination();
        player.sync()

        console.log('OFFSET', offset)
        Tone.Transport.seconds = offset;
        Tone.Transport.start();
        //sourceNode.start(0, offset).toDestination();

        startedAt = store.context.currentTime - offset;
        pausedAt = 0;
        isPlaying.value = true;

      } else {
        await renderMix()
        await playMix()
      }
    }

    const stop = async () => {
      Tone.Transport.pause();

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

    let convertToAbsoluteTime = (relativeTime) => {
      return relativeTime + startedAt;
    }

    let getDuration = () => {
      if (buffer) {
        return buffer.duration;
      }
      return 0;
    };

    const printPlayState = async () => {
      console.log('STATE: actx:', store.context)

      if (store.context) {
        console.log('STATE: actx.currentTime', store.context.currentTime)
        console.log('STATE: actx.state', store.context.state)
      }

      if (sourceNode) {
        console.log('STATE: mix', sourceNode)
      } else {
        console.log('STATE: mix is undefined')
      }
    }

    let downloadMix = async () => {
      if (!buffer || (store.state.clipCount() < 1)) {
        toast.error('Add clips to arrange before downloading');
        return
      }

      let crunker = new Crunker();
      let output = crunker.export(buffer, 'audio/mp3')
      await crunker.download(output.blob, 'signals_and_sorcery') //TODO: the name should be the project name
    }

    watch(() => bus.value.get('downloadMix'), async () => {
      await downloadMix()
    })

    watch(() => bus.value.get('stopAllAudio'), async (callerId) => {
      if (callerId != 'composer-controls') {
        await stop()
      }
    })

    watch(() => bus.value.get('renderMixIfNeeded'), async (callerId) => {
      console.log('renderMixIfNeeded')
      if (store.state.hasStateChanged()) {
        requiresRender.value = true

        if (!isRendering.value) {
          await renderMix()
          //after a mix is rendered sequence arp notes
          console.log('scheduleArpeggioNotesEMITTING', performance.now())
          emit('scheduleArpeggioNotes')
        }
      } else {
        requiresRender.value = false
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

    watch(() => bus.value.get('tick-test'), async () => {
      console.log('TICK-TEST')
    })

    //JUNK END

    let notFired = true

    // THIS IS THE MAIN APPLICATION TICK - START
    let progressUITick = async () => {

      /* calculate the time of each downbeat */
      // getDuration()

      // console.log('getDuration', getDuration()) //buffer length in sec
      // console.log('getCurrentRelativeTime', getCurrentRelativeTime()) //currenttime - start
      // console.log('Tone.TransportTime', Tone.Transport.seconds) //currenttime - start
      // console.log('convertToAbsoluteTime', convertToAbsoluteTime(getCurrentRelativeTime()))

      //console.log('Tone.context', Tone.getContext().currentTime)


      // if (notFired && getDuration() > 0) {
      //   const downbeatInterval = getDuration() / 12
      //   let downbeatAbTimes = []
      //   for (let i = 0; i < 12; i++) {
      //     downbeatAbTimes.push(convertToAbsoluteTime(downbeatInterval * i))
      //   }
      //
      //   emit('scheduleNotesTest', downbeatAbTimes)
      //   notFired = false
      // }

      // if (store.context) {
      //   console.log('store.context', store.context)
      //   console.log('audioContext', store.context.currentTime)
      //   console.log('Tone.context', Tone.getContext().currentTime)
      // }

      let displayDuration = getDuration()
      let displayCurrentTime = getCurrentRelativeTime()


      // if(scheduler) {
      //   scheduler.dispatchEvents(displayCurrentTime)
      // }

      let endTime = getDuration() * (store.state.playBack.loopEndPercent * 0.01)

      // console.log('displayCurrentTime', displayCurrentTime)
      // console.log('endTime', endTime)
      if (displayCurrentTime > endTime) {
        await stop()
        await playMix()
      }

      let progress = Math.round(displayCurrentTime / displayDuration * 100)
      if (Number.isInteger(progress)) {
        emit('updateProgressBar', progress)
      }

      if (displayCurrentTime > displayDuration) {
        await stop()
      }
    }

    setInterval(progressUITick, 25)
    // THIS IS THE MAIN APPLICATION TICK - STOP

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