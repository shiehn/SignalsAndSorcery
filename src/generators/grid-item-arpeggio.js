export default class GridItemArpeggio {
    constructor(id, chords, pattern, rate) {

        this.chords = ['c', 'c', 'c', 'c']
        if (chords && chords.length > 0) {
            this.chords = chords.split(':')
        }

        this.id = id
        this.pattern = pattern
        this.rate = rate
        this.type = 'arpeggio'
    }
}