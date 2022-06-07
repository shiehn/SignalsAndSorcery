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

        if(this.stem.type == 'drum'){
            console.log('ITS GREEN')
            return RATING.GREEN
        }

        let chords = undefined

        for (let row = 0; row < this.state.grid.length; row++) {
            if (this.state.grid[row].value[col].stem) {
                if (this.state.grid[row].value[col].stem.type != 'drum') {
                    if (!chords) {
                        chords = this.state.grid[row].value[col].stem.chords
                    }
                }
            }
        }

        if (!chords) {
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

                    //GET CHORD COLUMN COMPATIBILITY


                    //IF NOT SET THEN MAKE IT GREEN
                    if (this.state.grid[row].value[col].compatibility === undefined) {
                        this.state.grid[row].value[col].compatibility = RATING.GREEN
                    }
                }
            }
        }
    }
}


/*
//GO THROUGH EVERY GRID ITEM
      for (let row = 0; row < store.state.grid.length; row++) {
        for (let col = 0; col < store.state.grid[row].value.length; col++) {
          //SET EMPTY ROWS TO -1
          if (store.state.grid[row].value[col].stem) {
            store.state.grid[row].value[col].compatibility = -1
          } else {
            //get type for row
            if (rowToTypeMap[row] != stem.type) {
              store.state.grid[row].value[col].compatibility = 0
            }

            if (store.state.globalBpm && store.state.globalBpm != stem.bpm) {
              store.state.grid[row].value[col].compatibility = 0
            }

            //IF NOT SET THEN MAKE IT GREEN
            if (store.state.grid[row].value[col].compatibility === undefined) {
              store.state.grid[row].value[col].compatibility = 2
            }
          }
        }
      }
 */