

export default class LockProcessor {
    constructor(grid) {
        this.grid = grid
    }

    getLockState(row, col) {
        return this.grid[row].value[col]['locked'] ? true : false
    }

    setLock = (row, col, state) => {
        this.grid[row].value[col]['locked'] = state
    }

    lockRow = (targetRow) =>{
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if(row == targetRow){
                    if(this.grid[row].value[col].stem){
                        console.log('col', col)
                        this.grid[row].value[col]['locked'] = true
                    }
                }
            }
        }
    }
    unlockRow = (targetRow) =>{
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if(row == targetRow){
                    this.grid[row].value[col]['locked'] = false
                }
            }
        }
    }
    unlockAll = () =>{
        for (let row = 0; row < this.grid.length; row++) {
            this.unlockRow(row)
        }
    }
    lockAll = () =>{
        for (let row = 0; row < this.grid.length; row++) {
            this.lockRow(row)
        }
    }
    rowHasLockedItems = (targetRow) =>{
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if(row == targetRow){
                    if(this.grid[row].value[col]['stem']) {
                        if (this.grid[row].value[col]['locked']) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }
}


