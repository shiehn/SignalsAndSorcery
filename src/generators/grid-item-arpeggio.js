export default class GridItemArpeggio {
    constructor(id, chords, pattern, speed) {

        this.chords = ['c', 'c', 'c', 'c']
        if (chords && chords.length > 0) {
            this.chords = chords.split(':')
        }

        this.id = id
        this.pattern = pattern
        this.speed = speed
        this.type = 'arpeggio'
    }
}