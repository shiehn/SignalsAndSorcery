import {ROW_TO_TYPE_MAP} from "../constants/constants";

export const RATING = {
    GRAY: -1,
    RED: 0,
    YELLOW: 1,
    GREEN: 2,
}

export default class CompatibilityProcessor {

    constructor(stem, state) {
        this.stem = stem;
        this.state = state;
    }

    processFilledGridItems() {
        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[row].value.length; col++) {
                if (this.state.grid[row].value[col].stem) {
                    this.state.grid[row].value[col].compatibility = RATING.GRAY
                }
            }
        }
    }

    getChordCompatibilityForColumn(col) {

        if(this.stem.type == 'drum' || this.stem.type == 'fill'){
            return RATING.GREEN
        }

        let chords = undefined

        for (let row = 0; row < this.state.grid.length; row++) {
            if (this.state.grid[row].value[col].stem) {
                if (this.state.grid[row].value[col].stem.type != 'drum' && this.state.grid[row].value[col].stem.type != 'fill') {
                    if (!chords) {
                        chords = this.state.grid[row].value[col].stem.chords
                    }
                }
            }
        }

        if (chords === undefined) {
            return RATING.GREEN
        }

        //CHORDS DO EXIST IN ROW
        if (chords === this.stem.chords) {
            return RATING.GREEN
        }

        //TODO: THERE WILL EVENTUALLY BE A YELLOW CASE WHERE CHORDS PARTIALLY MATCH

        return RATING.RED
    }

    eval() {
        this.processFilledGridItems()

        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[row].value.length; col++) {
                if (!this.state.grid[row].value[col].stem) {

                    //CHECK CHORD COMPATIBILITY
                    const chordCompatibility = this.getChordCompatibilityForColumn(col)
                    if(chordCompatibility === RATING.RED) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }

                    // wrong type is red
                    if (ROW_TO_TYPE_MAP[row] !== this.stem.type) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }

                    // wrong BPM is red
                    if (this.state.globalBpm && this.state.globalBpm != this.stem.bpm) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }


                    //IF NOT SET THEN MAKE IT GREEN
                    if (this.state.grid[row].value[col].compatibility === undefined) {
                        this.state.grid[row].value[col].compatibility = RATING.GREEN
                    }
                }
            }
        }
    }
}