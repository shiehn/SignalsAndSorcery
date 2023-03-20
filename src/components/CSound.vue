<template>
  <div class="w-full h-18 bg-blue-200">
    <button @click="startCsound">HELLO CSOUND</button>
  </div>
</template>

<script>
import {Csound} from "@csound/browser";
import {inject, ref} from "vue";

export default {
  name: "CSound",
  setup() {
    const bufferToWave = (abuffer, len) => {
      var numOfChan = abuffer.numberOfChannels,
          length = len * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [], i, sample,
          offset = 0,
          pos = 0;

      // write WAVE header
      setUint32(0x46464952);                         // "RIFF"
      setUint32(length - 8);                         // file length - 8
      setUint32(0x45564157);                         // "WAVE"

      setUint32(0x20746d66);                         // "fmt " chunk
      setUint32(16);                                 // length = 16
      setUint16(1);                                  // PCM (uncompressed)
      setUint16(numOfChan);
      setUint32(abuffer.sampleRate);
      setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
      setUint16(numOfChan * 2);                      // block-align
      setUint16(16);                                 // 16-bit (hardcoded in this demo)

      setUint32(0x61746164);                         // "data" - chunk
      setUint32(length - pos - 4);                   // chunk length

      // write interleaved data
      for(i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

      while(pos < length) {
        for(i = 0; i < numOfChan; i++) {             // interleave channels
          sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
          view.setInt16(pos, sample, true);          // write 16-bit sample
          pos += 2;
        }
        offset++                                     // next source sample
      }

      // create Blob
      return [buffer]
      //return new Blob([buffer], {type: "audio/wav"});

      function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
      }

      function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
      }
    }







    const store = inject('store')
    const drum = store.state.staticUrl + "drum.wav"
    ////////////////////////////////////////////////////


    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let source;
    let drumBuffer = null;
    source = audioCtx.createBufferSource();
    const request = new XMLHttpRequest();

    request.open("GET", "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/part_two-drum-1-5dcb1a12-0d02-40ce-a3b1-21f785f9c3b1.wav", true);

    request.responseType = "arraybuffer";

    request.onload = () => {
      const audioData = request.response;

      audioCtx.decodeAudioData(
          audioData,
          (buffer) => {
            source.buffer = buffer;
            drumBuffer = buffer;

            //source.connect(audioCtx.destination);
            //source.loop = true;

          },

          (err) => console.error(`Error with decoding audio data: ${err.err}`)
      );
    };

    request.send();
    //source.start()

  console.log('SOURCE', source.buffer)





    const cSoundScript = `
    <CsoundSynthesizer>
    <CsOptions>
    ; Select audio/midi flags here according to platform
    -odac     ;;;RT audio out
    ;-iadc    ;;;uncomment -iadc if RT audio input is needed too
    ; For Non-realtime ouput leave only the line below:
    ;-o drum-out.wav -W ;;; for file output any platform
    </CsOptions>
    <CsInstruments>

    sr     = 44100
    ksmps  = 32
    nchnls = 2
    0dbfs  = 1

    instr Mixer

      ktrans linseg 1, 5, 2, 10, -2
      a1     diskin "drum.wav", ktrans, 0, 1, 0, 32
             outs a1, a1

    endin

    schedule("Mixer", 0, 6)
    </CsInstruments>
    <CsScore>
    </CsScore>
    </CsoundSynthesizer>
`

  const tutorialScript = `
  <CsoundSynthesizer>
<CsOptions>
-Wo output.wav --port=10000
</CsOptions>
<CsInstruments>
sr=48000
ksmps=64
nchnls=2
0dbfs=1

instr 1
    ioct = octcps(p4)
    kpwm = oscili(.1, 5)
    asig = vco2(p5, p4, 4, .5 + kpwm)
    asig += vco2(p5, p4 * 2)

    idepth = 3
    acut = transegr:a(0, .002, 0, idepth, .5, -4.2, 0.001, .5, -4.2, 0)
    asig = zdf_2pole(asig, cpsoct(ioct + acut), 0.5)

    asig *= linsegr:a(1, p3, 1, .5, 0)

    out(asig, asig)

endin

instr Main
    inotes[] fillarray 60, 67, 63, 65, 62
    ioct[] fillarray 0,1,0,0,1
    inote = inotes[p4 % 37 % 11 % 5] + 12 * ioct[p4 % 41 % 17 % 5]
    schedule(1, 0, .25, cpsmidinn(inote), 0.25)

    ;if(p4 % 64 % 37 % 17 % 11 == 0 && inote != 74 && inote != 62) then
    ;    schedule(1, 0, .5, cpsmidinn(inote + 7), 0.125)
    ;endif

    ;schedule(p1, .25, .25, p4 + 1)
endin

schedule("Main", 0, 0, 0)

</CsInstruments>
</CsoundSynthesizer>
  `






    let csound = null;
    const startCsound = async () => {
      console.log('startCsound CLICKED')
      // if(csound) {
      //   return;
      // }

      console.log("Starting Csound...");

      csound = await Csound();
      console.log('cs inited')

      //await csound.fs.writeFile('drum.wav', bufferToWave(drumBuffer, 12.0 * 44100));

      //console.log('wrote file')

      await csound.compileCsdText(tutorialScript);


      const filePaths = await csound.fs.readFile('./output.wav');
      await csound.start();

      console.log("ran csound script xw");

      //let data = await csound.fs.readFile('drum-out.wav');


      //const output = await csound.fs.readFile('output.wav');




      console.log('read file', filePaths)

      //await csound.destroy();



      console.log('destroyed')


    }

    return {
      startCsound
    }
  }
}
</script>

<style scoped>

</style>