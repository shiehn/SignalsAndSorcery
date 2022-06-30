<template>
  <div class="border-2 border-black">
    <h1>ARP</h1>
    <p>Arp body text .. junk</p>

    <section ref="chordContainer" class="chord">
      <h1>Chord Progression</h1>
      <div v-for="c in store.state.arpeggiator.chord_count()">
        <div v-for="(note, i) in store.state.arpeggiator.MS.notes">
          <div @click="msUpdateChords(c, i, $event)">
            {{ store.state.arpeggiator.chord_deg[i] }}
          </div>
        </div>
      </div>
    </section>

    <section class="bpm">
      <h1>Beats Per Minute</h1>
      <div v-for="bpm in store.state.arpeggiator.bpms" @click="playerUpdateBPM(bpm)">
        {{ bpm }}
      </div>
    </section>

    <section class="keys">
      <h1>Tonic / Root</h1>
      <div v-for="key in store.state.arpeggiator.MS.dict.keys" @click="msUpdateKey(key)">
        {{ key }}
      </div>
    </section>

    <section class="modes">
      <div v-for="mode in store.state.arpeggiator.MS.dict.modes" @click="msUpdateMode(mode)">
        {{ mode }}
      </div>
    </section>

    <section class="steps">
      <h1>Steps</h1>
      <div v-for="step in store.state.arpeggiator.steps" @click="apUpdateSteps(step)">
        {{ step }}
      </div>
    </section>

    <section class="type">
      <h1>Arpeggio Type</h1>
      <div v-for="type in store.state.arpeggiator.types" @click="apUpdatePatternType(type)">
        {{ type }}
      </div>
    </section>

    <section class="patterns">
      <h1>Arpeggio Style</h1>
      <div v-for="pattern in store.state.arpeggiator.AP.patterns[store.state.arpeggiator.ap_pattern_type]" @click="apUpdatePatternId(pattern)">
        {{ pattern }}
      </div>
    </section>
  </div>
</template>

<script>
import {inject, onBeforeUpdate, ref} from "vue";
import MusicalScale from "./musical-scale";
import ArpeggioPatterns from "./arpeggio-patterns";

export default {
  name: "ArpeggiatorWrapper",
  setup() {
    const store = inject('store')
    const chordContainer = ref(null)
    let arpState = store.state.arpeggiator

    // SCALE STUFF START
    const msUpdateKey = (key) => {
      console.log('key', key)
      //this._utilClassToggle(e.target, 'key-current');
      arpState.ms_key = key
      msUpdateScale();
    }

    const msUpdateMode = (mode) => {
      //this._utilClassToggle(e.target, 'mode-current');
      arpState.ms_mode = mode
      msUpdateScale();
      console.log('MODE', mode)
      //_updateChords();
    };

    const msUpdateScale = () => {
      arpState.MS.updateScale({key: arpState.ms_key, mode: arpState.ms_mode});
      //_updateOutput();
    }

    const setMusicalScale = () => {
      store.state.arpeggiator.MS = new MusicalScale({key: arpState.ms_key, mode: arpState.ms_mode});
    }
    // SCALE STUFF END

    // ARP PATTERNS START
    const apUpdateSteps = (step) => {
      // this._utilClassToggle(e.target, 'step-current');
      // let steps = e.target.getAttribute('data-value');
      arpState.ap_steps = parseInt(step);
      arpState.AP.updatePatterns({steps: step});
      apUpdate();
      console.log('step', step)
      //this._updatePatternSelector();
    }

    const apUpdatePatternType = (type) => {
      // this._utilClassToggle(e.target, 'type-current');
      arpState.ap_pattern_type = type
      apUpdate();
      console.log('type', type)
      //this._updatePatternSelector();
    }

    const apUpdatePatternId = (pattern) => {
      // this._utilClassToggle(e.target, 'id-current');
      arpState.ap_pattern_id = parseInt(pattern);
      console.log('pattern', pattern)
      //this.apUpdate();
    }

    const apUpdate = () => {
      arpState.arpeggio = arpState.AP.patterns[arpState.ap_pattern_type][arpState.ap_pattern_id];
    }

    const setArpeggioPatterns = () => {
      arpState.AP = new ArpeggioPatterns({steps: arpState.ap_steps});
      apUpdate();
    };
    //ARP PATTERNS END

    //CHORD SELECTOR START
    const msUpdateChords = (chord, value, e) => {
      console.log('CHORD', chord)
      console.log('VALUE', value)
      // let el = e.target;
      // let chord = el.getAttribute('data-chord');
      // let value = el.getAttribute('data-value');
      arpState.chords[parseInt(chord)] = value;
      console.log('arpState.chords', arpState.chords)
      //this._utilClassToggle(e.target, `chord-${chord}-current`);
      //this._updateOutput();
    }

    const loadChordSelector = () => {
      // this.chord_container = document.createElement('section');
      // this.chord_container.classList.add('chord');
      // this.container.appendChild(this.chord_container);
      // let title = document.createElement('h1');
      // title.innerHTML = 'Chord Progression';
      // this.chord_container.appendChild(title);

      // for(let c = 0; c < this.chord_count; c++) {
      //   let chord_el = document.createElement('div');
      //   this.MS.notes.forEach((note, i) => {
      //     let el = document.createElement('div');
      //     el.setAttribute('data-value', i);
      //     el.setAttribute('data-chord', c);
      //     if(i === this.chords[c]) el.classList.add(`chord-${c}-current`);
      //     el.innerHTML = 'i ii iii iv v vi vii'.split(' ')[i];
      //     el.addEventListener('click', (e) => { this.msUpdateChords(e); });
      //     chord_el.appendChild(el);
      //   });
      //   this.chord_container.appendChild(chord_el);
      // }
      //
      // this._updateChords();
    };
    //CHORD SELECTOR END


    //BPM START
    //const loadBPMSelector = () => {
    // [45,60,75,90,105,120,135,150].forEach((bpm) => {
    //   let el = document.createElement('div');
    //   el.setAttribute('data-value', bpm);
    //   if(bpm === this.player.bpm) el.classList.add('bpm-current');
    //   el.innerHTML = bpm;
    //   el.addEventListener('click', (e) => { this.playerUpdateBPM(e); });
    //   bpm_container.appendChild(el);
    // });
    //};
    //BPM END


    //KEY START

    //KEY END


    // TRANSPORT START
    const playerUpdateBPM = (bpm) => {
      console.log('BPM', bpm)
      // let el = e.target;
      // let bpm = el.getAttribute('data-value');
      arpState.player.bpm = parseInt(bpm);
      Tone.Transport.bpm.value = arpState.player.bpm
      //this._utilClassToggle(e.target, 'bpm-current');
    };
    // TRANSPORT END

    /*
    setup function order
     */
    setMusicalScale()
    setArpeggioPatterns()
    loadChordSelector()

    return {
      apUpdateSteps,
      apUpdatePatternType,
      apUpdatePatternId,
      chordContainer,
      msUpdateChords,
      msUpdateKey,
      msUpdateMode,
      playerUpdateBPM,
      store,
    }
  },
}
</script>

<style scoped>

</style>