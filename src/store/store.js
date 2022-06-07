import {reactive} from "vue";

const state = reactive({
    globalBpm: undefined,
    globalKey: undefined,
    fileCount: 0,
    staticUrl: '',
    grid: [],
    currentStateHash: '',
    currentRowHash: ['', '', '', ''],
    hasRowStateChanged: function (rowIndex) {
        return this.currentRowHash[rowIndex] !== this.calculateRowHash(rowIndex)
    },
    updateRowStateHash: function (rowIndex) {
        this.currentRowHash[rowIndex] = this.calculateRowHash(rowIndex)
    },
    calculateRowHash: function (rowIndex) {
        let newHash = ''
        for (let col = 0; col < this.grid[rowIndex].value.length; col++) {
            if (this.grid[rowIndex].value[col].stem) {
                newHash = newHash + rowIndex + col + this.grid[rowIndex].value[col].stem.id.substring(0, 4)
            } else {
                newHash = newHash + rowIndex + col + 'undef'
            }
        }
        return newHash
    },
    getChordsForCol(col) {
        let chords = undefined

        if (!this.grid || this.grid.length < 1) {
            return chords
        }

        for (let row = 0; row < this.grid.length; row++) {
            if(!this.grid[row].value[col]){
                continue
            }

            if (this.grid[row].value[col].stem) {
                if (this.grid[row].value[col].stem.type != 'drum') {
                    if (this.grid[row].value[col].stem.chords) {
                        chords = this.grid[row].value[col].stem.chords
                    }
                }
            }
        }

        return chords
    },
    hasStateChanged: function () {
        return this.currentStateHash !== this.calculateStateHash()
    },
    updateStateHash: function () {
        this.currentStateHash = this.calculateStateHash()
    },
    calculateStateHash: function () {
        let newHash = ''
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].stem) {
                    newHash = newHash + row + col + this.grid[row].value[col].stem.id.substring(0, 4)
                } else {
                    newHash = newHash + row + col + 'undef'
                }
            }
        }
        return newHash
    }
})

export default {
    state,
}