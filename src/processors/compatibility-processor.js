const RATING = {
    RED: 0,
    YELLOW: 1,
    GREEN: 2,
}

export default class CompatibilityProcessor {

    constructor(stem, gridState) {
        this.stem = stem;
        this.gridState = gridState;
    }

    eval() {
        return RATING.RED
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