<template>
  <div>
    <h1>ARPEGGIATOR</h1>
    <div>ARP ID: {{ arpId }}</div>
    <div>{{ arpCtrlChords }}</div>
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
      <label for="arpCtrlSpeed" class="w-1/3 my-2 text-sm">RATE</label>
      <select v-if="arpCtrlSpeed != undefined" v-model="arpCtrlSpeed" @change="saveArpSettings($event)"
              id="arpCtrlSpeed"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlSpeedOptions">{{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import store from "../../store/store";
import {inject, nextTick, ref, watch} from "vue";
import useEventsBus from "../../events/eventBus";

export default {
  name: "ArpeggiatorControls",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()

    const arpId = ref('arp_id')

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
        console.log('save dat shit')
        const arpeggio = store.state.grid[currentRow].value[currentCol].arpeggio
        if (!arpeggio) {
          console.log('error: arpeggio not found at row:' + currentRow + ' col:' + currentCol)
          return
        }

        console.log('save rate', arpCtrlRate.value)
        arpeggio.pattern = arpCtrlPattern.value
        arpeggio.rate = arpCtrlRate.value
        arpeggio.chords = arpCtrlChords.value
        arpeggio.synth = arpCtrlSynth.value

        emit('scheduleArpeggioNotes')
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
        console.log('error: arpeggio not found at row:' + assetFilter[0].row + ' col:' + assetFilter[0].col)
        return
      }

      //get the chords from the column
      let chords = []
      for (let row = 0; row < store.state.grid.length; row++) {
        let stem = store.state.grid[row].value[assetFilter[0].col].stem
        if (stem) {
          chords = stem.chords.split(':')
        }
      }

      arpId.value = arpeggio.id
      arpCtrlChords.value = chords.length > 0 ? chords : arpeggio.chords
      arpCtrlPattern.value = arpeggio.pattern
      arpCtrlRate.value = arpeggio.rate
    })

    return {
      arpCtrlChords,
      arpId,
      arpCtrlPattern,
      arpCtrlPatternOptions,
      arpCtrlSpeed: arpCtrlRate,
      arpCtrlSpeedOptions: arpCtrlRateOptions,
      arpCtrlSynth,
      arpCtrlSynthOptions,
      saveArpSettings
    }
  }
  ,
}
</script>

<style scoped>

</style>