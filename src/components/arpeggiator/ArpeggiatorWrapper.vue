<template>
  <div class="border-2 border-black">
    <h1>ARP</h1>
    <p>Arp body text .. junk</p>
  </div>
</template>

<script>
import {inject} from "vue";
import MusicalScale from "./musical-scale";
import ArpeggioPatterns from "./arpeggio-patterns";

export default {
  name: "ArpeggiatorWrapper",
  setup() {
    const store = inject('store')

    let arpState = store.state.arpeggiator

    // SCALE STUFF START
    const msUpdateKey = (e) => {
      this._utilClassToggle(e.target, 'key-current');
      arpState.ms_key = e.target.getAttribute('data-value');
      msUpdateScale();
    }

    const msUpdateMode = (e) => {
      this._utilClassToggle(e.target, 'mode-current');
      arpState.ms_mode = e.target.getAttribute('data-value');
      msUpdateScale();
      _updateChords();
    };

    const msUpdateScale = () => {
      arpState.MS.updateScale({key: arpState.ms_key, mode: arpState.ms_mode});
      _updateOutput();
    }

    const setMusicalScale = () => {
      store.state.arpeggiator.MS = new MusicalScale({key: arpState.ms_key, mode: arpState.ms_mode});
    }
    // SCALE STUFF END

    // ARP PATTERNS START
    const apUpdateSteps = (e) => {
      this._utilClassToggle(e.target, 'step-current');
      let steps = e.target.getAttribute('data-value');
      arpState.ap_steps = parseInt(steps);
      arpState.AP.updatePatterns({ steps: steps });
      this.apUpdate();
      this._updatePatternSelector();
    }

    const apUpdatePatternType = (e) => {
      this._utilClassToggle(e.target, 'type-current');
      this.ap_pattern_type = e.target.getAttribute('data-value');
      this.apUpdate();
      this._updatePatternSelector();
    }

    const apUpdatePatternId = (e) => {
      this._utilClassToggle(e.target, 'id-current');
      this.ap_pattern_id = parseInt(e.target.getAttribute('data-value'));
      this.apUpdate();
    }

    const apUpdate = () => {
      arpState.arpeggio = arpState.AP.patterns[arpState.ap_pattern_type][arpState.ap_pattern_id];
    }

    const setArpeggioPatterns = () => {
      arpState.AP = new ArpeggioPatterns({ steps: arpState.ap_steps });
      apUpdate();
    };
    //ARP PATTERNS END

    /*
    setup function order
     */
    setMusicalScale()
    setArpeggioPatterns()

    return {}
  },
}
</script>

<style scoped>

</style>