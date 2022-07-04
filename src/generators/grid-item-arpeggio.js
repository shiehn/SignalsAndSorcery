export default class GridItemArpeggio {
    constructor(id, chords, pattern, speed) {
        this.id = id
        this.chords = chords.split(':')
        this.pattern = pattern
        this.speed = speed
        this.type = 'arpeggio'
    }
}