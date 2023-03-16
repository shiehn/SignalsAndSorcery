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

        if (this.stem.type == 'drum' || this.stem.type == 'fill') {
            return RATING.GREEN
        }

        let chords = undefined

        for (let row = 0; row < this.state.grid.length; row++) {
            if (this.state.grid[row].value[col].stem) {
                if (this.state.grid[row].value[col].stem.type != 'drum'
                    && this.state.grid[row].value[col].stem.type != 'fill'
                    && this.state.grid[row].value[col].stem.type != 'hit'
                    && this.state.grid[row].value[col].stem.type != 'riser') {
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
        // IF HIT MATCH ON FIRST CHORD
        if(this.stem.type == 'hit') {
            let colChord = chords.split(':')[0]
            let stemChord = this.stem.chords.split(':')[0]

            if(colChord == stemChord) {
                return RATING.GREEN
            }
        }

        // IF RISER MATCH ON LAST CHORD
        if(this.stem.type == 'riser') {
            let colChord = chords.split(':')[3]
            let stemChord = this.stem.chords.split(':')[3]

            if(colChord == stemChord) {
                return RATING.GREEN
            }
        }


        // OTHERWISE MATCH ON ALL CHORDS
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

                    //TODO: if stem is a hit, match on first chord
                    //TODO: if stem is a riser, match on last chord


                    //CHECK CHORD COMPATIBILITY
                    const chordCompatibility = this.getChordCompatibilityForColumn(col)
                    if (chordCompatibility === RATING.RED) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }


                    //TODO: if stem is a hit, match on first chord

                    // wrong type is red
                    let stemType = this.stem.type
                    if (stemType == 'hit' || stemType == 'riser') {
                        stemType = 'fill'
                    }

                    //IF NOT SET THEN MAKE IT GREEN
                    if (ROW_TO_TYPE_MAP[row] !== stemType) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }

                    // wrong BPM is red
                    if (this.state.globalBpm && this.state.globalBpm != this.stem.bpm) {
                        this.state.grid[row].value[col].compatibility = RATING.RED
                        continue
                    }



                    if (this.state.grid[row].value[col].compatibility === undefined || this.state.grid[row].value[col].compatibility === RATING.GRAY) {
                        this.state.grid[row].value[col].compatibility = RATING.GREEN
                    }
                }
            }
        }
    }
}