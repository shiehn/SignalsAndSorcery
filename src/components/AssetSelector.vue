<template>
  <div class="w-full border-2 mb-8">
    <h1>SELECT CLIPS</h1>

    <div class="my-4">
      <label for="bpm-filter">BPM:</label>
      <select v-if="filterBpm != undefined" v-model="filterBpm" id="bpm-filter">
        <option :value="item" v-for="item in filterBpmOptions.arr">{{ item }}
        </option>
      </select>
      <label for="type-filter">TYPE:</label>
      <select v-if="filterType != undefined" v-model="filterType" id="type-filter">
        <option :value="item" v-for="item in filterTypeOptions.arr">{{ item }}
        </option>
      </select>
      <label for="key-filter">KEY:</label>
      <select v-if="filterKey != undefined" v-model="filterKey" id="key-filter">
        <option :value="item" v-for="item in filterKeyOptions.arr">{{ item }}
        </option>
      </select>
      <label for="chord-filter">CHORD:</label>
      <select v-if="filterChord != undefined" v-model="filterChord" id="chord-filter">
        <option :value="item" v-for="item in filterChordOptions.arr">{{ item }}
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

import {computed, inject, nextTick, onBeforeUpdate, onMounted, reactive, ref} from 'vue'
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

    const filterBpm = ref()
    const filterBpmOptions = reactive({arr: [0]})
    const filterType = ref()
    const filterTypeOptions = reactive({arr: ['all']})
    const filterKey = ref()
    const filterKeyOptions = reactive({arr: ['all']})
    const filterChord = ref()
    const filterChordOptions = reactive({arr: ['all']})
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
      if (store.state.globalKey) {
        filterKey.value = store.state.globalKey
      } else {
        filterKey.value = 'all'
      }

      if (store.state.globalBpm) {
        filterBpm.value = store.state.globalBpm
      } else {
        filterBpm.value = 0
      }

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


    onMounted(async () => {
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

      stems.options.bpms.forEach(bpm => {
        filterBpmOptions.arr.push(bpm)
      })
      filterBpm.value = 0

      stems.options.types.forEach(t => {
        filterTypeOptions.arr.push(t)
      })
      filterType.value = 'all'

      stems.options.keys.forEach(t => {
        filterKeyOptions.arr.push(t)
      })
      filterKey.value = 'all'

      stems.options.chords.forEach(t => {
        filterChordOptions.arr.push(t)
      })
      filterChord.value = 'all'
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

}
</script>

<style scoped>
</style>