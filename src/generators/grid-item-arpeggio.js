import {v4} from "uuid";

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
        this.pattern = '1315'
        this.rate = rate
        this.synth = 'synth_a'
    }
}