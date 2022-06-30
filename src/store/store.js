import {reactive, ref} from "vue";

const debugMode = true

const state = reactive({
    arpeggiator: {
        AP: undefined,
        arpeggio: undefined,
        bpms: [45,60,75,90,105,120,135,150],
        chords: [0, 2, 6, 3, 4, 2, 5, 1],
        chord_deg: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'],
        steps: [3,4,5,6],
        types: ['straight', 'looped'],
        MS: undefined,
        ms_key: 'G',
        ms_mode: 'locrian',
        ap_steps: 6,
        ap_pattern_type: 'straight', // || 'looped'
        ap_pattern_id: 0,
        player: {
            chord_step: 0,
            octave_base: 4,
            arp_repeat: 2,
            bass_on: false,
            triad_step: 0,
            step: 0,
            playing: false,
            bpm: 135
        },
        chord_count: function () {
            return this.chords.length
        },
    },
    projectName: 'Untitled Project',
    authorName: '',
    globalBpm: undefined,
    globalKey: undefined,
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
            }
        }

        return clipCount
    },
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
            if (!this.grid[row].value[col]) {
                continue
            }

            if (this.grid[row].value[col].stem) {
                if (this.grid[row].value[col].stem.type != 'drum' && this.grid[row].value[col].stem.type != 'fill') {
                    if (this.grid[row].value[col].stem.chords) {
                        chords = this.grid[row].value[col].stem.chords
                    }
                }
            }
        }

        return chords
    },
    hasStateChanged: function () {
        console.log('STATE CHANGE!')
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