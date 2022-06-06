<template>
  <div class="w-full border-2 mb-8">
    <h1>SELECT CLIPS</h1>

    <div class="my-4">
      <label for="bpm-filter">BPM:</label>
      <select v-model="filterBpm" id="bpm-filter">
        <option :value="item" v-for="item in filterBpmOptions">{{ item }}
        </option>
      </select>
      <label for="type-filter">TYPE:</label>
      <select v-model="filterType" id="type-filter">
        <option :value="item" v-for="item in filterTypeOptions">{{ item }}
        </option>
      </select>
      <label for="key-filter">KEY:</label>
      <select v-model="filterKey" id="key-filter">
        <option :value="item" v-for="item in filterKeyOptions">{{ item }}
        </option>
      </select>
      <label for="chord-filter">CHORD:</label>
      <select v-model="filterChord" id="chord-filter">
        <option :value="item" v-for="item in filterChordOptions">{{ item }}
        </option>
      </select>
    </div>

    <ul class="grid grid-cols-8 gap-2">
      <asset v-for="stem in getFilteredStems" :stem=stem></asset>
    </ul>

    <button @click="pagePrev">PREV</button>&nbsp;&nbsp;&nbsp;&nbsp;
    <button @click="pageNext">NEXT</button>
  </div>
</template>
<script>

import {computed, inject, onBeforeUpdate, reactive, ref} from 'vue'
import {StemsAPI} from "../dal/StemsAPI";
import Asset from "./Asset.vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";


export default {
  name: "AssetSelector",
  components: {Asset},
  setup() {
    const store = inject('store')
    const {bus} = useEventsBus()

    const filterBpm = ref(0)
    const filterBpmOptions = ref([])
    const filterType = ref('all')
    const filterTypeOptions = ref([])
    const filterKey = ref('all')
    const filterKeyOptions = ref([])
    const filterChord = ref('all')
    const filterChordOptions = ref([])
    const pageIndex = ref(0)
    const numOfResults = 16

    let totalResults = 0
    let prevFilterBpm = 0;
    let prevFilterType = 0;

    const pageNext = () => {
      if (pageIndex.value <= totalResults - numOfResults) {
        pageIndex.value = pageIndex.value + numOfResults
      }
    }

    const pagePrev = () => {
      if (pageIndex.value >= numOfResults) {
        pageIndex.value = pageIndex.value - numOfResults
      }
    }

    const stemSelections = reactive({
      arr: [],
    });



    const getFilteredStems = computed(() => {
      if (filterBpm.value != prevFilterBpm || filterType.value != prevFilterType) {
        prevFilterBpm = filterBpm.value;
        prevFilterType = filterType.value;
        pageIndex.value = 0
      }

      let filteredByBpm = stemSelections.arr.filter(stem => {
        if (filterBpm.value == 0) {
          return true
        }

        return Math.round(stem.bpm) == filterBpm.value
      })

      let filteredByType = filteredByBpm.filter(stem => {
        if (filterType.value === 'all') {
          return true
        }

        return stem.type == filterType.value
      })

      totalResults = filteredByType.length

      const pagedResults = filteredByType.slice(pageIndex.value, pageIndex.value + numOfResults)

      return pagedResults
    })

    watch(() => bus.value.get('updateAssetSelection'), (assetFilter) => {
      if (!assetFilter[0]) {
        return
      }

      if (assetFilter[0].clipType) {
        filterType.value = assetFilter[0].clipType
      }

      if (assetFilter[0].clipType) {
        filterType.value = assetFilter[0].clipType
      }


      /*
      filterBpm
filterType
filterKey
filterChord
       */
    })

    return {
      filterBpm,
      filterBpmOptions,
      filterType,
      filterTypeOptions,
      filterKey,
      filterKeyOptions,
      filterChord,
      filterChordOptions,
      getFilteredStems,
      pageNext,
      pagePrev,
      stemSelections,
      store,
    }
  },
  async mounted() {
    const stemsApi = new StemsAPI()
    let stems = await stemsApi.getStemsAndOptions()
    stems.stems.forEach((stem) => {
      stem['waveform'] = stem['source'].replace('.wav', '.png')
      stem['showPreviewIcon'] = false
      stem['previewIconPath'] = this.store.state.staticUrl + 'icons/play-button.png'
      stem['previewPlayIconPath'] = this.store.state.staticUrl + 'icons/play-button.png'
      stem['previewStopIconPath'] = this.store.state.staticUrl + 'icons/stop-button.png'
      this.stemSelections.arr.push(stem)
    })

    console.log(stems.options.bpms, stems.options.bpms)
    this.filterBpmOptions = stems.options.bpms
    this.filterBpmOptions.push(0)
    this.filterKeyOptions = stems.options.keys
    this.filterKeyOptions.push('all')
    this.filterTypeOptions = stems.options.types
    this.filterTypeOptions.push('all')
    this.filterChordOptions = stems.options.chords
    this.filterChordOptions.push('all')
  }
}
</script>

<style scoped>
</style>