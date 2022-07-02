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

    <button @click="playerToggle()" class="h-24"></button>
  </div>
</template>

<script>
import {inject, ref, watch} from "vue";
import MusicalScale from "./musical-scale";
import ArpeggioPatterns from "./arpeggio-patterns";
import useEventsBus from "../../events/eventBus";

export default {
  name: "ArpeggiatorWrapper",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
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


    //LOAD SYTHS START


    let channel = {}
    let fx = {}
    let synths = {}
    const loadSynths = () => {
      channel = {
        master: new Tone.Gain(0.7),
        treb: new Tone.Gain(0.7),
        bass: new Tone.Gain(0.8),
      };
      fx = {
        distortion: new Tone.Distortion(0.8),
        reverb: new Tone.Freeverb(0.1, 3000),
        delay: new Tone.PingPongDelay('16n', 0.1),
      };
      synths = {
        treb: new Tone.PolySynth(Tone.SimpleAM),
        bass: new Tone.DuoSynth()
      };

      synths.bass.vibratoAmount.value = 0.1;
      synths.bass.harmonicity.value = 1.5;
      synths.bass.voice0.oscillator.type = 'triangle';
      synths.bass.voice0.envelope.attack = 0.05;
      synths.bass.voice1.oscillator.type = 'triangle';
      synths.bass.voice1.envelope.attack = 0.05;

      // fx mixes
      fx.distortion.wet.value = 0.2;
      fx.reverb.wet.value = 0.2;
      fx.delay.wet.value = 0.3;
      // gain levels
      channel.master.toMaster();
      channel.treb.connect(channel.master);
      channel.bass.connect(channel.master);
      // fx chains
      synths.treb.chain(fx.delay, fx.reverb, channel.treb);
      synths.bass.chain(fx.distortion, channel.bass);
    };
    //LOAD SYTHS END

    // TRANSPORT START
    const playerUpdateBPM = (bpm) => {
      console.log('BPM', bpm)
      // let el = e.target;
      // let bpm = el.getAttribute('data-value');
      arpState.player.bpm = parseInt(bpm);
      Tone.Transport.bpm.value = arpState.player.bpm
      //this._utilClassToggle(e.target, 'bpm-current');
    };

    const startArp = () => {
      Tone.Transport.bpm.value = arpState.player.bpm;



      if(arpState.player.playing) {
        Tone.Transport.pause();
        channel.master.gain.value = 0;
        //this.play_toggle.classList.remove('active');
      }

      Tone.Transport.start();
      channel.master.gain.value = 1;
      //this.play_toggle.classList.add('active');

      arpState.player.playing = true
    }

    const stopArp = () => {
      if(arpState.player.playing) {
        Tone.Transport.pause();
        channel.master.gain.value = 0;
        //this.play_toggle.classList.remove('active');
      }

      arpState.player.playing = false
    }

    const playerToggle = () => {
      if(arpState.player.playing) {
        Tone.Transport.pause();
        channel.master.gain.value = 0;
        //this.play_toggle.classList.remove('active');
      } else {
        Tone.Transport.start();
        channel.master.gain.value = 1;
        //this.play_toggle.classList.add('active');
      }
      arpState.player.playing = !arpState.player.playing;
      console.log('arpState.player.playing', arpState.player.playing)
    };


    Tone.Transport.scheduleRepeat((time) => {
      let curr_chord = arpState.player.chord_step % arpState.chord_count();

      let prev = document.querySelector('.chord > div.active');
      if(prev) prev.classList.remove('active');
      let curr = document.querySelector(`.chord > div:nth-of-type(${curr_chord + 1})`);
      if(curr) curr.classList.add('active');

      let chord = arpState.MS.notes[arpState.chords[curr_chord]];

      // finding the current note
      let notes = chord.triad.notes;
      for(let i = 0; i < Math.ceil(arpState.ap_steps / 3); i++) {
        notes = notes.concat(notes.map((n) => { return { note: n.note, rel_octave: n.rel_octave + (i + 1)}}));
      }
      let note = notes[arpState.arpeggio[arpState.player.step % arpState.arpeggio.length]];

      // setting bass notes
      let bass_o = chord.rel_octave + 2;
      let bass_1 = chord.note + bass_o;

      // slappin da bass
      if(arpState.player.bass_on) {
        arpState.player.bass_on = true;
        synths.bass.triggerAttack(bass_1, time);
        //this._utilActiveNoteClassToggle([bass_1.replace('#', 'is')], 'active-b');
      }

      // bump the step
      arpState.player.step++;

      // changing chords
      if(arpState.player.step % (arpState.arpeggio.length * arpState.player.arp_repeat) === 0) {
        arpState.player.chord_step++;
        arpState.player.bass_on = false;
        synths.bass.triggerRelease(time);
        arpState.player.triad_step++;
      }
      // arpin'
      let note_ref = `${note.note}${note.rel_octave + arpState.player.octave_base}`;
      //this._utilActiveNoteClassToggle([note_ref.replace('#', 'is')], 'active-t');
      synths.treb.triggerAttackRelease(note_ref, '16n', time);
    }, '16n');
    // TRANSPORT END




    /*
    setup function order
     */
    setMusicalScale()
    setArpeggioPatterns()
    loadChordSelector()
    loadSynths()

    watch(() => bus.value.get('stopArpeggiator'), () => {
      stopArp()
    })

    watch(() => bus.value.get('startArpeggiator'), (startArpPayload) => {
      if(!startArpPayload[0]) {
        return
      }

      console.log('startArpPayload', startArpPayload[0].chord_step)

      store.state.arpeggiator.player.chord_step = startArpPayload[0].chordStep
      store.state.arpeggiator.player.step = startArpPayload[0].step
      store.state.arpeggiator.player.bpm = startArpPayload[0].bpm
      store.state.arpeggiator.player.key = startArpPayload[0].key

      startArp()
    })

    return {
      apUpdateSteps,
      apUpdatePatternType,
      apUpdatePatternId,
      msUpdateChords,
      msUpdateKey,
      msUpdateMode,
      playerToggle,
      playerUpdateBPM,
      store,
    }
  },
}
</script>

<style scoped>

</style>