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
})