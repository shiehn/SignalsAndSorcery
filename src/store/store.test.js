import {describe, it, expect} from "vitest"
import {ref} from "vue";
import state from './store'
import GridItemArpeggio from "../generators/grid-item-arpeggio";

function createGrid(rowOne, rowTwo) {
    let grid = [
        ref([{
            stem: {
                id: rowOne[0]
            }
        }, {
            stem: {
                id: rowOne[1]
            }
        }, {
            stem: {
                id: rowOne[2]
            }
        }, {
            stem: {
                id: rowOne[3]
            }
        }]),
        ref([{
            stem: {
                id: rowTwo[0]
            }
        }, {
            stem: {
                id: rowTwo[1]
            }
        }, {
            stem: {
                id: rowTwo[2]
            }
        }, {
            stem: {
                id: rowTwo[3]
            }
        }])
    ]

    return grid
}

function createArpeggioGrid() {

    const arpOne = new GridItemArpeggio()
    arpOne.id = 'aaaa'
    arpOne.chords = ['a', 'a', 'a', 'a']
    arpOne.bufferRendered = false
    arpOne.renderedInMix = true
    arpOne.on = true
    arpOne.pattern = 1
    arpOne.rate = 1
    arpOne.synth = 'synth_a'

    const arpTwo = new GridItemArpeggio()
    arpTwo.id = 'bbbb'
    arpTwo.chords = ['b', 'b', 'b', 'b']
    arpTwo.bufferRendered = false
    arpTwo.renderedInMix = true
    arpTwo.on = true
    arpTwo.pattern = 1
    arpTwo.rate = 1
    arpTwo.synth = 'synth_b'

    const arpThree = undefined

    const arpFour = new GridItemArpeggio()
    arpFour.id = 'dddd'
    arpFour.chords = ['d', 'd', 'd', 'd']
    arpFour.bufferRendered = false
    arpFour.renderedInMix = true
    arpFour.on = true
    arpFour.pattern = 1
    arpFour.rate = 1
    arpFour.synth = 'synth_d'

    let grid = [
        ref([{
            arpeggio: arpOne,
        }, {
            arpeggio: arpTwo,
        }, {
            arpeggio: arpThree,
        }, {
            arpeggio: arpFour,
        }]),
    ]

    return grid
}

describe('Store Tests', () => {
    /*APP HASH TESTS*/

    it('should calculateArpeggioStateHash', async () => {
        state.state.grid = createArpeggioGrid()

        const hash = state.state.calculateArpeggioStateHash()
        const expected = '0_aaaa_a,a,a,a_false_true_1_1_synth_a:1_bbbb_b,b,b,b_false_true_1_1_synth_b:2_null_null_null_null_null_null_null:3_dddd_d,d,d,d_false_true_1_1_synth_d'

        expect(hash).to.equals(expected)
    })

    it('should updateArpeggioStateHash', async () => {
        state.state.grid = createArpeggioGrid()

        const hash = state.state.calculateArpeggioStateHash()

        expect(state.state.currentArpeggioStateHash).not.to.equals(hash)

        state.state.updateArpeggioStateHash()

        expect(state.state.currentArpeggioStateHash).to.equals(hash)
    })

    it('should detect no arpeggio state changed', async () => {
        state.state.grid = createArpeggioGrid()

        state.state.updateArpeggioStateHash()

        expect(state.state.hasArpeggioStateChanged()).toBeFalsy()
    })

    it('should detect arpeggio state changed', async () => {
        state.state.grid = createArpeggioGrid()

        state.state.updateArpeggioStateHash()

        state.state.grid[0].value[1].arpeggio.rate = 3

        expect(state.state.hasArpeggioStateChanged()).toBeTruthy()
    })

    it('should return no diff if state has not changed', async () => {
        state.state.grid = createArpeggioGrid()

        state.state.updateArpeggioStateHash()

        //state.state.grid[0].value[1].arpeggio.rate = 3

        expect(state.state.getArpeggioStateDiff().length).to.equals(0)
    })

    it('should return index and id of any altered arpeggio state', async () => {
        state.state.grid = createArpeggioGrid()

        state.state.updateArpeggioStateHash()

        state.state.grid[0].value[1].arpeggio.rate = 3

        expect(state.state.getArpeggioStateDiff().length).to.equals(1)

        expect(state.state.getArpeggioStateDiff()[0].col).to.equals(1)
        expect(state.state.getArpeggioStateDiff()[0].id).to.equals('bbbb')
    })

    it('should handle the addition of a column', async () => {

    })

    it('should handle the removal of a column', async () => {

    })


    /*END APP HASH TESTS*/


    it('should calculateClipStateHash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateClipStateHash()
        expect(hash).to.equals('00a01b02c03d10a11b12c13d')
    })

    it('should updateStateHash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateClipStateHash()

        expect(state.state.currentStateHash).not.to.equals(hash)

        state.state.updateClipStateHash()

        expect(state.state.currentStateHash).to.equals(hash)
    })

    it('should detect no state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateClipStateHash()

        expect(state.state.hasClipStateChanged()).toBeFalsy()
    })

    it('should detect state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateClipStateHash()

        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'z', 'd'])

        expect(state.state.hasClipStateChanged()).toBeTruthy()
    })

    it('should calculate row state hash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateRowHash(0)
        expect(hash).to.equals('00a01b02c03d')
    })

    it('should have different row state hashes', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['d', 'b', 'c', 'd'])

        const hashOne = state.state.calculateRowHash(0)
        const hashTwo = state.state.calculateRowHash(1)
        expect(hashOne).not.to.equals(hashTwo)
    })

    it('should updateStateHash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateRowHash(0)

        expect(state.state.currentRowHash[0]).not.to.equals(hash)

        state.state.updateRowStateHash(0)

        expect(state.state.currentRowHash[0]).to.equals(hash)
    })

    it('should detect no state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateRowStateHash(0)

        expect(state.state.hasRowStateChanged(0)).toBeFalsy()
    })

    it('should detect state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateRowStateHash(0)

        state.state.grid = createGrid(['d', 'd', 'c', 'd'], ['a', 'b', 'z', 'd'])

        expect(state.state.hasRowStateChanged(0)).toBeTruthy()
    })

    it('should update global key', async () => {
        state.state.globalKey = 'a'

        let gridItemWithStem = {
            key: 'f',
            type: 'hi',
        }

        state.state.grid = createGrid(
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'])

        state.state.grid[1].value[3].stem = gridItemWithStem

        state.state.updateGlobalKey()

        expect(state.state.globalKey).to.equals('f')
    })

    it('should not update global key for fill or drum types', async () => {
        state.state.globalKey = 'a'

        let hiStem = {
            key: 'b',
            type: 'hi',
        }

        let fillStem = {
            key: 'g',
            type: 'fill',
        }

        let drumStem = {
            key: 'g',
            type: 'drum',
        }

        state.state.grid = createGrid(
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'])

        state.state.grid[0].value[1].stem = hiStem
        state.state.grid[1].value[0].stem = fillStem
        state.state.grid[1].value[3].stem = drumStem

        state.state.updateGlobalKey()

        expect(state.state.globalKey).to.equals('b')
    })

    it('should update global bpm', async () => {
        state.state.globalBpm = 90

        let gridItemWithStem = {
            bpm: 120,
            key: 'f',
            type: 'hi',
        }

        state.state.grid = createGrid(
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'])

        state.state.grid[1].value[3].stem = gridItemWithStem

        state.state.updateGlobalBpm()

        expect(state.state.globalBpm).to.equals(120)
    })
})