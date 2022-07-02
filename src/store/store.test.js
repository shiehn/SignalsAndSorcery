import {describe, it, expect} from "vitest"
import {ref} from "vue";
import state from './store'

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

describe('Store Tests', () => {
    it('should calculateStateHash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateStateHash()
        expect(hash).to.equals('00a01b02c03d10a11b12c13d')
    })

    it('should updateStateHash', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        const hash = state.state.calculateStateHash()

        expect(state.state.currentStateHash).not.to.equals(hash)

        state.state.updateStateHash()

        expect(state.state.currentStateHash).to.equals(hash)
    })

    it('should detect no state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateStateHash()

        expect(state.state.hasStateChanged()).toBeFalsy()
    })

    it('should detect state changed', async () => {
        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])

        state.state.updateStateHash()

        state.state.grid = createGrid(['a', 'b', 'c', 'd'], ['a', 'b', 'z', 'd'])

        expect(state.state.hasStateChanged()).toBeTruthy()
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