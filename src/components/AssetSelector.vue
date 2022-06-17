<template>
  <div class="flex flex-col w-1/6 h-48 border-2 border-black rounded-lg justify-between font-bold p-2 m-2 nowrap overflow-hidden" style="background-color: rgba(255,255,255,0.9);">
    <div class="flex w-full h-8 justify-between my-1">
      <label for="bpm-filter" class="w-1/3 my-2 text-sm">BPM</label>
      <select v-if="filterBpm != undefined" v-model="filterBpm" id="bpm-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterBpmOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="type-filter" class="w-1/3 my-2 text-sm">TYPE</label>
      <select v-if="filterType != undefined" v-model="filterType" id="type-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterTypeOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="key-filter" class="w-1/3 my-2 text-sm">KEY</label>
      <select v-if="filterKey != undefined" v-model="filterKey" id="key-filter" class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterKeyOptions.arr">{{ item }}
        </option>
      </select>
    </div>

    <div class="flex w-full h-8 justify-between my-1">
      <label for="chord-filter" class="w-1/3 my-2 text-sm">CHORD</label>
      <select v-if="filterChord != undefined" v-model="filterChord" id="chord-filter"
              class="w-2/3 text-xs rounded-lg">
        <option :value="item" v-for="item in filterChordOptions.arr">{{ item }}
        </option>
      </select>
    </div>
  </div>

  <div class="flex w-4/6 h-48 justify-center border-2 border-black my-2 pt-4 rounded-lg" style="background-color: rgba(255,255,255,0.9);">
    <div
        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer text-4xl opacity-25 hover:opacity-75"
        @click="pagePrev">
      <img :src="staticImages.pageLeftImgSrc" class="w-8 h-8">
    </div>

    <ul class="grid grid-cols-8 gap-2">
      <asset v-for="stem in getFilteredStems" :stem=stem></asset>
    </ul>
    <div
        class="flex flex-col justify-center text-center w-10 m-2 hover:cursor-pointer text-4xl opacity-25 hover:opacity-75"
        @click="pageNext">
      <img :src="staticImages.pageRightImgSrc" class="w-8 h-8">
    </div>
  </div>
</template>
<script>

import {computed, inject, nextTick, onBeforeUpdate, onMounted, reactive, ref} from 'vue'
import {StemsAPI} from "../dal/StemsAPI";
import Asset from "./Asset.vue";
import {watch} from "vue";
import useEventsBus from "../events/eventBus";
import store from "../store/store";
import {ROW_TO_TYPE_MAP} from "../constants/constants";

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

    const staticImages = {
      pageLeftImgSrc: store.state.staticUrl + 'icons/shuffle-left.png',
      pageRightImgSrc: store.state.staticUrl + 'icons/shuffle-right.png',
    }

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

      let filteredByKey = filteredByType.filter(stem => {
        if (filterKey.value === 'all') {
          return true
        }

        return stem.key.toLowerCase() == filterKey.value.toLowerCase()
      })


      //TODO: FILTER BY CHORDS:
      let filteredByChords = filteredByKey.filter(stem => {
        if (filterChord.value === 'all') {
          return true
        }

        return stem.chords.toLowerCase() == filterChord.value.toLowerCase()
      })


      totalResults = filteredByChords.length

      const pagedResults = filteredByChords.slice(pageIndex.value, pageIndex.value + numOfResults)

      return pagedResults
    })

    watch(() => bus.value.get('updateAssetSelection'), (assetFilter) => {
      if (store.state.globalKey) {
        filterKey.value = store.state.globalKey.toLowerCase()
      } else {
        filterKey.value = 'all'
      }

      if (store.state.globalBpm) {
        filterBpm.value = store.state.globalBpm
      } else {
        filterBpm.value = 0
      }

      if (assetFilter[0].filterKey) {
        //IN THIS CASE WE EXPLICITLY OVERRIDE THE GLOBAL KEY
        filterKey.value = assetFilter[0].filterKey
      }

      if (!assetFilter[0]) {
        filterType.value = 'all'
        return
      }

      if (assetFilter[0].clipType) {
        filterType.value = assetFilter[0].clipType
      }

      if (assetFilter[0].chords) {
        filterChord.value = assetFilter[0].chords.toLowerCase()
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
      console.log('getStemsAndOptions', stems)
      stems.stems.forEach((stem) => {
        stem['waveform'] = stem['source'].replace('.wav', '.png')
        stem['showPreviewIcon'] = false
        stem['previewIconPath'] = store.state.staticUrl + 'icons/play-button.png'
        stem['previewPlayIconPath'] = store.state.staticUrl + 'icons/play-button.png'
        stem['previewStopIconPath'] = store.state.staticUrl + 'icons/stop-button.png'
        stemSelections.arr.push(stem)
      })

      stems.options.bpms.forEach(bpm => {
        filterBpmOptions.arr.push(Math.round(bpm))
      })
      filterBpm.value = 0

      stems.options.types.forEach(t => {
        if (ROW_TO_TYPE_MAP.includes(t)) {
          filterTypeOptions.arr.push(t)
        }
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
      staticImages,
      stemSelections,
      store,
    }
  },

}
</script>

<style scoped>
</style>