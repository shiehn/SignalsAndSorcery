export default class AssetSelectionFilter {
    constructor(stemSelections, bpm, type, key, chords) {
        this.stemSelections = stemSelections
        this.bpm = bpm
        this.type = type
        this.key = key
        this.chords = chords
    }

    filter() {

        let filteredByBpm = this.stemSelections.filter(stem => {
            if (this.bpm == 0 || this.bpm == undefined) {
                return true
            }

            return Math.round(stem.bpm) == this.bpm
        })

        let filteredByType = filteredByBpm.filter(stem => {
            if (this.type === 'all') {
                return true
            }

            return stem.type == this.type
        })

        let filteredByKey = filteredByType.filter(stem => {
            if (this.key === 'all'|| this.type === 'drum') {
                return true
            }

            return stem.key.toLowerCase() == this.key.toLowerCase()
        })

        let filteredByChords = filteredByKey.filter(stem => {
            if (this.chords === 'all' || this.type === 'drum') {
                return true
            }

            return stem.chords == this.chords
        })


        return filteredByChords
    }
}


/*
const getFilteredStems = computed(() => {

      if (filterBpm.value != prevFilterBpm || filterType.value != prevFilterType) {
        prevFilterBpm = filterBpm.value;
        prevFilterType = filterType.value;
        pageIndex.value = 0
      }

      console.log('stemSelections.arr', stemSelections.arr)

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

        return stem.chords.toLowerCase() == filterChord.value
      })

      totalResults = filteredByChords.length

      const pagedResults = filteredByChords.slice(pageIndex.value, pageIndex.value + numOfResults)

      return pagedResults
    })
 */