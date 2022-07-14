<template>
  <div>
    <h1>ARPEGGIATOR</h1>
    <div>ARP ID: {{ arpId }}</div>
    <div>{{ arpCtrlChords }}</div>
    <button v-if="!arpIsRendered" class="bg-red-600" @click="renderArpeggios()">Render Changes</button>
  </div>
  <div>
    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlPattern" class="w-1/3 my-2 text-sm">PATTERN</label>
      <select v-if="arpCtrlPattern != undefined" v-model="arpCtrlPattern" @change="saveArpSettings($event)"
              id="arpCtrlPattern"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlPatternOptions">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlSynth" class="w-1/3 my-2 text-sm">SYNTH</label>
      <select v-if="arpCtrlSynth != undefined" v-model="arpCtrlSynth" @change="saveArpSettings($event)"
              id="arpCtrlSynth"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlSynthOptions">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlRate" class="w-1/3 my-2 text-sm">RATE</label>
      <select v-if="arpCtrlRate != undefined" v-model="arpCtrlRate" @change="saveArpSettings($event)"
              id="arpCtrlRate"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlRateOptions">{{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import store from "../../store/store";
import {inject, nextTick, ref, watch} from "vue";
import useEventsBus from "../../events/eventBus";
import GridProcessor from "../../processors/grid-processor";

export default {
  name: "ArpeggiatorControls",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()

    const arpId = ref('arp_id')

    const arpIsRendered = ref(false)

    const arpCtrlChords = ref('chords')

    const arpCtrlPattern = ref('pattern_1')
    const arpCtrlPatternOptions = ['pattern_1']

    const arpCtrlRate = ref('quarter')
    const arpCtrlRateOptions = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']

    const arpCtrlSynth = ref('synth_1')
    const arpCtrlSynthOptions = ['synth_1']

    let currentRow = undefined
    let currentCol = undefined

    const saveArpSettings = () => {
      if (currentRow != undefined && currentCol != undefined) {
        const arpeggio = store.state.grid[currentRow].value[currentCol].arpeggio
        if (!arpeggio) {
          console.log('error: arpeggio not found at row:' + currentRow + ' col:' + currentCol)
          return
        }

        arpeggio.pattern = arpCtrlPattern.value
        arpeggio.rate = arpCtrlRate.value
        arpeggio.chords = arpCtrlChords.value
        arpeggio.synth = arpCtrlSynth.value
      }
    }

    watch(() => bus.value.get('updateAssetSelection'), (assetFilter) => {
      if (assetFilter[0].row == undefined || assetFilter[0].col == undefined) {
        console.log('error: updateAssetSelection requires a ro w and col')
        return
      }

      currentRow = assetFilter[0].row
      currentCol = assetFilter[0].col

      const arpeggio = store.state.grid[assetFilter[0].row].value[assetFilter[0].col].arpeggio
      if (!arpeggio) {
        return
      }

      //get the chords from the column
      let chords = []
      let chordsStr = store.state.getChordsForCol(assetFilter[0].col)
      if (chordsStr) {
        chords = chordsStr.split(':')
      }

      const globalKey = store.state.globalKey
      if (chords.length < 1 && globalKey) {
        chords = [globalKey, globalKey, globalKey, globalKey]
      }

      arpId.value = arpeggio.id
      arpIsRendered.value = arpeggio.rendered
      arpCtrlChords.value = chords.length > 0 ? chords : arpeggio.chords
      arpCtrlPattern.value = arpeggio.pattern
      arpCtrlRate.value = arpeggio.rate
    })

    const renderArpeggios = () => {
      //alert('ARP_ID = ' + arpId.value)
    }

    watch([arpId, arpCtrlChords, arpCtrlPattern, arpCtrlRate, arpCtrlSynth,], () => {
      alert('change detected: ' + arpId.value)
      let arpeggio = new GridProcessor(store.state.grid).getArpeggioById(arpId.value)
      if (!arpeggio) {
        return
      }

      arpeggio.rendered = false //FLAG THE ARPEGGIO AS UN-RENDERED
      alert('UPDATED ARPEGGIO RENDER')

      if (arpeggio.on) {
        emit('renderMixIfNeeded')
      }
    })

    return {
      arpCtrlChords,
      arpId,
      arpCtrlPattern,
      arpCtrlPatternOptions,
      arpCtrlRate,
      arpCtrlRateOptions,
      arpCtrlSynth,
      arpCtrlSynthOptions,
      arpIsRendered,
      renderArpeggios,
      saveArpSettings
    }
  }
}
</script>

<style scoped>

</style>