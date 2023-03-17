import GridGenerator, {SectionPositions} from "../generators/grid-generator";
import {beforeEach, describe, expect, it} from "vitest";
import LockProcessor from "./lock-processor";


const gridGenerator = new GridGenerator()

describe('Grid Processor Tests', () => {
    let state = {}

    const defaultRows = 6
    const defaultCols = 6

    beforeEach(() => {
        state.globalBpm = 120

        //RESET THE STATE
        state.grid = gridGenerator.initGrid(defaultRows, defaultCols)

        /* TEMP FORCE SECTIONS TO TEST */
        for (let row = 0; row < state.grid.length; row++) {
            for (let col = 0; col < state.grid[row].value.length; col++) {
                if (col > 0 && col < 3) {
                    state.grid[row].value[col].section.id = 'id_a'
                    state.grid[row].value[col].section.name = 'part_a'
                }

                if (col === 0) {
                    state.grid[row].value[col].section.id = 'id_a'
                    state.grid[row].value[col].section.name = 'part_a'
                }

                if (col === 3) {
                    state.grid[row].value[col].section.id = 'id_a'
                    state.grid[row].value[col].section.name = 'part_a'
                    state.grid[row].value[col]['stem'] = {
                        id: 'stem_id_a'
                    }
                }

                if (col > 4) {
                    state.grid[row].value[col].section.id = 'id_b'
                    state.grid[row].value[col].section.name = 'part_b'
                }

                if (col === 4) {
                    state.grid[row].value[col].section.id = 'id_b'
                    state.grid[row].value[col].section.name = 'part_b'
                }

                if (col === 5) {
                    state.grid[row].value[col].section.id = 'id_b'
                    state.grid[row].value[col].section.name = 'part_b'
                    state.grid[row].value[col].stem = {
                        id: 'stem_id_b'
                    }
                }
            }
        }
    })

    it('should not lock empty stems in row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.lockRow(0)

        let row = 0
        expect(state.grid[row].value[0].locked).to.equals(undefined)
        expect(state.grid[row].value[1].locked).to.equals(undefined)
        expect(state.grid[row].value[2].locked).to.equals(undefined)
        expect(state.grid[row].value[3].locked).to.equals(true)
        expect(state.grid[row].value[4].locked).to.equals(undefined)
        expect(state.grid[row].value[5].locked).to.equals(true)

        row = 1
        expect(state.grid[row].value[0].locked).to.equals(undefined)
        expect(state.grid[row].value[1].locked).to.equals(undefined)
        expect(state.grid[row].value[2].locked).to.equals(undefined)
        expect(state.grid[row].value[3].locked).to.equals(undefined)
        expect(state.grid[row].value[4].locked).to.equals(undefined)
        expect(state.grid[row].value[5].locked).to.equals(undefined)
    })

    it('should unlock row', async () => {
        const lockProcessor = new LockProcessor(state.grid)

        lockProcessor.lockRow(2)

        let row = 2
        expect(state.grid[row].value[0].locked).to.equals(undefined)
        expect(state.grid[row].value[1].locked).to.equals(undefined)
        expect(state.grid[row].value[2].locked).to.equals(undefined)
        expect(state.grid[row].value[3].locked).to.equals(true)
        expect(state.grid[row].value[4].locked).to.equals(undefined)
        expect(state.grid[row].value[5].locked).to.equals(true)

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
                if(state.grid[row].value[col].stem) {
                    expect(state.grid[row].value[col].locked).to.equals(true)
                }
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

    it('should lock grid item', () => {
        const lockProcessor = new LockProcessor(state.grid)

        const row = 2
        const col = 3

        lockProcessor.setLock(row, col, true)

        expect(state.grid[row].value[col].locked).to.equals(true)
    })

    it('should unlock grid item', () => {
        const lockProcessor = new LockProcessor(state.grid)

        const row = 2
        const col = 3

        lockProcessor.setLock(row, col, false)

        expect(state.grid[row].value[col].locked).to.equals(false)
    })
})