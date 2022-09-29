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

            if (this.type === 'fill') {
                return stem.type == 'hit' || stem.type == 'riser'
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