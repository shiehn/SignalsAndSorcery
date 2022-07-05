<template>

  <div>
    <h1>ARPEGGIATOR</h1>
    <div>ARP ID: {{arpId}}</div>
    <div>{{arpCtrlChords}}</div>
  </div>
<div>
    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlPattern" class="w-1/3 my-2 text-sm">PATTERN</label>
      <select v-if="arpCtrlPattern != undefined" v-model="arpCtrlPattern" id="arpCtrlPattern"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlPatternOptions">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlSynth" class="w-1/3 my-2 text-sm">SYNTH</label>
      <select v-if="arpCtrlSynth != undefined" v-model="arpCtrlSynth" id="arpCtrlSynth"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlSynthOptions">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex h-8 justify-between my-1">
      <label for="arpCtrlSpeed" class="w-1/3 my-2 text-sm">RATE</label>
      <select v-if="arpCtrlSpeed != undefined" v-model="arpCtrlSpeed" id="arpCtrlSpeed"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in arpCtrlSpeedOptions">{{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import store from "../../store/store";
import {inject, ref, watch} from "vue";
import useEventsBus from "../../events/eventBus";

export default {
  name: "ArpeggiatorControls",
  setup() {
    const store = inject('store')
    const {bus} = useEventsBus()

    const arpId = ref('arp_id')

    const arpCtrlChords = ref('chords')

    const arpCtrlPattern = ref('pattern_1')
    const arpCtrlPatternOptions = ['pattern_1']

    const arpCtrlSpeed = ref('quarter')
    const arpCtrlSpeedOptions = ['whole', 'half', 'quarter', 'eighth', 'sixteenth']

    const arpCtrlSynth = ref('synth_1')
    const arpCtrlSynthOptions = ['synth_1']

    watch(() => bus.value.get('updateAssetSelection'), (assetFilter) => {
      console.log('IN THE updateAssetSelection')
      //assetFilter[0].clipType
      //alert('ROW:'+ assetFilter[0].row + ' COL:' + assetFilter[0].col)
      console.log('assetFilter', assetFilter)
      if(assetFilter[0].row == undefined || assetFilter[0].col == undefined) {
        console.log('error: updateAssetSelection requires a ro w and col')
        return
      }

      const arpeggio = store.state.grid[assetFilter[0].row].value[assetFilter[0].col].arpeggio
      if(!arpeggio){
        console.log('error: arpeggio not found at row:' + assetFilter[0].row + ' col:' + assetFilter[0].col)
        return
      }

      //get the chords from the column
      let chords = []
      for(let row= 0; row < store.state.grid.length; row++) {
        if(store.state.grid[row].value[assetFilter[0].col].chords) {
          chords = store.state.grid[row].value[assetFilter[0].col].chords
        }
      }

      arpId.value = arpeggio.id
      arpCtrlChords.value = arpeggio.chords
      arpCtrlPattern.value = arpeggio.pattern
      arpCtrlSpeed.value = arpeggio.speed
    })

    return {
      arpCtrlChords,
      arpId,
      arpCtrlPattern,
      arpCtrlPatternOptions,
      arpCtrlSpeed,
      arpCtrlSpeedOptions,
      arpCtrlSynth,
      arpCtrlSynthOptions
    }
  }
  ,
}
</script>

<style scoped>

</style>