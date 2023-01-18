import GridGenerator, {SectionPositions} from "../generators/grid-generator";
import {beforeEach, describe, expect, it} from "vitest";
import store from "../store/store";
import GridItemArpeggio from "../generators/grid-item-arpeggio";
import GridProcessor from "./grid-processor";
import LockProcessor from "./lock-processor";


const gridGenerator = new GridGenerator()

describe('Grid Processor Tests', () => {
    let state = {}

    const defaultRows = 6
    const defaultCols = 6

    beforeEach(() => {
        state = store.state
        state.globalBpm = 120

        //RESET THE STATE
        state.grid = gridGenerator.initGrid(defaultRows, defaultCols)

        /* TEMP FORCE SECTIONS TO TEST */
        for (let row = 0; row < store.state.grid.length; row++) {
            for (let col = 0; col < store.state.grid[row].value.length; col++) {
                if (col > 0 && col < 3) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                }

                if (col == 0) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                }

                if (col == 3) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = {
                        id: 'stem_id_a'
                    }
                }

                if (col > 4) {
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                }

                if (col == 4) {
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                }

                if (col == 5) {
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                    store.state.grid[row].value[col].stem = {
                        id: 'stem_id_b'
                    }
                }

                if (row == 0 && col == 1) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = undefined
                }

                if (row == 0 && col == 3) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = undefined
                }
            }
        }
    })

    it('should lock row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.lockRow(0)

        let row = 0
        for (let col = 0; col < state.grid[row].value.length; col++) {
            expect(state.grid[row].value[col].locked).to.equals(true)
        }

        row = 1
        for (let col = 0; col < state.grid[row].value.length; col++) {
            console.log('row1', state.grid[row].value[col])
            expect(state.grid[row].value[col].locked).to.equals(undefined)
        }
    })

    it('should unlock row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.lockRow(2)

        let row = 2
        for (let col = 0; col < state.grid[row].value.length; col++) {
            expect(state.grid[row].value[col].locked).to.equals(true)
        }

        lockProcessor.unlockRow(2)

        for (let col = 0; col < state.grid[row].value.length; col++) {
            expect(state.grid[row].value[col].locked).to.equals(false)
        }
    })

    it('should find locked items in row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        state.grid[2].value[3].locked = true

        const hasLockedItems = lockProcessor.rowHasLockedItems(2)

        expect(hasLockedItems).to.equals(true)
    })

    it('should find no locked items in row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        const hasLockedItems = lockProcessor.rowHasLockedItems(2)

        expect(hasLockedItems).to.equals(false)
    })

    it('should lock rows', () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.lockAll()

        for (let row = 0; row < state.grid.length; row++) {
            for (let col = 0; col < state.grid[row].value.length; col++) {
                expect(state.grid[row].value[col].locked).to.equals(true)
            }
        }
    })

    it('should unlock all rows', () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.unlockAll()

        for (let row = 0; row < state.grid[row].length; row++) {
            for (let col = 0; col < state.grid[row].value.length; col++) {
                expect(state.grid[row].value[col].locked).to.equals(false)
            }
        }
    })
})