import {reactive} from "vue";

let debugMode = true
let context = undefined
let isMobile = false
let token = undefined

const state = reactive({
    projectId: undefined,
    projectVersionId: undefined,
    projectName: 'Untitled Project',
    authorName: '',
    globalBpm: undefined,
    getGlobalBpm: function () {
        if (this.globalBpm) {
            return this.globalBpm
        }

        return 120
    },
    globalKey: undefined,
    getGlobalKey: function () {
        if (this.globalKey) {
            return this.globalKey
        }

        return 'C'
    },
    playBack: {
        loopStartPercent: 0,
        loopEndPercent: 100,
    },
    clipCount: function () {
        let clipCount = 0

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].stem) {
                    clipCount++
                }

                if (this.grid[row].value[col].arpeggio && this.grid[row].value[col].arpeggio.on) {
                    clipCount++
                }
            }
        }

        return clipCount
    },
    staticUrl: '',
    grid: [],
    currentStateHash: '',
    hasRowStateChanged: function (rowIndex) {
        return this.currentRowHash[rowIndex] !== this.calculateRowHash(rowIndex)
    },
    updateRowStateHash: function (rowIndex) {
        this.currentRowHash[rowIndex] = this.calculateRowHash(rowIndex)
    },


    currentArpeggioStateHash: '',
    hasArpeggioStateChanged: function () {
        return this.currentArpeggioStateHash !== this.calculateArpeggioStateHash()
    },
    getArpeggioStateDiff: function () {
        const arpeggioChanged = []
        if (!this.hasArpeggioStateChanged()) {
            return arpeggioChanged
        } else {
            const originalState = this.currentArpeggioStateHash.split(':')
            const newState = this.calculateArpeggioStateHash().split(':')

            //ARPEGGIO HAS CHANGED, DETERMINE WHAT HAS CHANGED
            for(let i=0; i<newState.length; i++){
                if(!originalState[i]){
                    arpeggioChanged.push({
                        col: i,
                        id: undefined,
                    })

                    continue
                }

                if(originalState[i] !== newState[i]){
                    arpeggioChanged.push({
                        col: i,
                        id: newState[i].split('_')[1],
                    })
                }

                //IF WE NEED TO KNOW EXACTLY WHAT HAS CHANGED, WE HAVE TO SPLIT THE STRING INTO AN ARRAY
                // const originalStateItems = originalState[i].split(',')
                // const newStateItems = newState[i].split(',')
            }
        }

        return arpeggioChanged
    },
    updateArpeggioStateHash: function () {
        this.currentArpeggioStateHash = this.calculateArpeggioStateHash()
    },
    calculateArpeggioStateHash: function () {

        /*
        id: 'aaaa',
                chords: ['a', 'a', 'a', 'a'],
                bufferRendered: false,
                renderedInMix: true,
                on: true,
                pattern: 1,
                rate: 1,
                synth: 'synth_a',
         */

        let newHash = ''
        let rowIndex = 0
        for (let col = 0; col < this.grid[rowIndex].value.length; col++) {
            const arp = this.grid[rowIndex].value[col].arpeggio
            if (arp) {
                newHash += col + '_'
                    + arp.id + '_'
                    + arp.chords + '_'
                    + arp.bufferRendered + '_'
                    + arp.on + '_'
                    + arp.pattern + '_'
                    + arp.rate + '_'
                    + arp.synth
            } else {
                newHash += col + '_'
                    + 'null' + '_'
                    + 'null' + '_'
                    + 'null' + '_'
                    + 'null' + '_'
                    + 'null' + '_'
                    + 'null' + '_'
                    + 'null'
            }

            if(col < this.grid[rowIndex].value.length - 1){
                newHash += ':'
            }
        }

        return newHash
    },


    currentRowHash: ['', '', '', ''],
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
            if (!this.grid[row].value[col]) {
                continue
            }

            if (this.grid[row].value[col].stem) {
                if (this.grid[row].value[col].stem.type != 'drum'
                    && this.grid[row].value[col].stem.type != 'fill'
                    && this.grid[row].value[col].stem.type != 'hit'
                    && this.grid[row].value[col].stem.type != 'riser'
                ) {
                    if (this.grid[row].value[col].stem.chords) {
                        chords = this.grid[row].value[col].stem.chords
                    }
                }
            }
        }

        return chords
    },
    hasClipStateChanged: function () {
        return this.currentStateHash !== this.calculateClipStateHash()
    },

    updateClipStateHash: function () {
        this.currentStateHash = this.calculateClipStateHash()
    },

    calculateClipStateHash: function () {
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
    },

    updateGlobalBpm: function () {
        let bpm = undefined
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].stem && this.grid[row].value[col].stem.bpm) {
                    bpm = this.grid[row].value[col].stem.bpm
                }
            }
        }

        this.globalBpm = bpm
    },
    updateGlobalKey: function () {
        let key = undefined
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].stem && this.grid[row].value[col].stem.key) {
                    if (this.grid[row].value[col].stem.type != 'fill' && this.grid[row].value[col].stem.type != 'drum') {
                        key = this.grid[row].value[col].stem.key
                    }
                }
            }
        }

        this.globalKey = key
    },
})

export default {
    isMobile, state, token
}