export default class GridItemArpeggio {
    constructor(id, chords, pattern, rate) {

        this.chords = ['c', 'c', 'c', 'c']
        if (chords && chords.length > 0) {
            this.chords = chords.split(':')
        }

        this.id = id
        this.bufferRendered = false
        this.renderedInMix = true
        this.on = false
        this.pattern = pattern
        this.rate = rate
        this.synth = 'synth_a'
    }
}