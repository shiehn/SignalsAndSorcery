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
import Asset from "./Asset";

export default {
  name: "AssetSelector",
  components: {Asset},
  async setup() {
    const store = inject('store')

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

    const stemsApi = new StemsAPI()
    let stems = await stemsApi.getStemsAndOptions()
    stems.stems.forEach((stem) => {
      stem['waveform'] = stem['source'].replace('.wav', '.png')
      stem['showPreviewIcon'] = false
      stem['previewIconPath'] = store.state.staticUrl + 'icons/play-button.png'
      stem['previewPlayIconPath'] = store.state.staticUrl + 'icons/play-button.png'
      stem['previewStopIconPath'] = store.state.staticUrl + 'icons/stop-button.png'
      stemSelections.arr.push(stem)
    })

    filterBpmOptions.value = stems.options.bpms
    filterBpmOptions.value.push(0)
    filterKeyOptions.value = stems.options.keys
    filterKeyOptions.value.push('all')
    filterTypeOptions.value = stems.options.types
    filterTypeOptions.value.push('all')
    filterChordOptions.value = stems.options.chords
    filterChordOptions.value.push('all')

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
    }
  },
}
</script>

<style scoped>
</style>