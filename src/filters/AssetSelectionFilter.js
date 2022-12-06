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

            if(stem.type === 'hit') {
                //HITS NEED TO MATCH ONLY FIRST CHORD
                const chord_a = this.chords.split(':')[0]
                const chord_b = stem.chords.split(':')[0]

                return chord_a == chord_b
            }

            if(stem.type === 'riser') {
                //HITS NEED TO MATCH ONLY LAST CHORD
                const chord_a = this.chords.split(':')[3]
                const chord_b = stem.chords.split(':')[3]

                return chord_a == chord_b
            }

            return stem.chords == this.chords
        })

        return filteredByChords
    }
}