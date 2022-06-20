/**
 * @vitest-environment happy-dom
 */

import {beforeEach, describe, it, expect} from "vitest"
import GridProcessor from "./grid-processor";
import store from "../store/store";
import GridGenerator, {SectionPositions} from "../generators/grid-generator";

const gridGenerator = new GridGenerator()

describe('Grid Processor Tests', () => {
    let state = {}

    const defaultRows = 4
    const defaultCols = 6

    beforeEach(() => {
        state = store.state

        //RESET THE STATE
        state.grid = gridGenerator.initGrid(defaultRows, defaultCols)

        /* TEMP FORCE SECTIONS TO TEST */
        for (let row = 0; row < store.state.grid.length; row++) {
            for (let col = 0; col < store.state.grid[row].value.length; col++) {
                if (col > 0 && col < 3) {
                    store.state.grid[row].value[col].section.position = 'mid'
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                }

                if (col == 0) {
                    store.state.grid[row].value[col].section.position = 'start'
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                }

                if (col == 3) {
                    store.state.grid[row].value[col].section.position = 'end'
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = {
                        id: 'stem_id_a'
                    }
                }

                if (col > 4) {
                    store.state.grid[row].value[col].section.position = 'mid'
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                }

                if (col == 4) {
                    store.state.grid[row].value[col].section.position = 'start'
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                }

                if (col == 5) {
                    store.state.grid[row].value[col].section.position = 'end'
                    store.state.grid[row].value[col].section.id = 'id_b'
                    store.state.grid[row].value[col].section.name = 'part_b'
                    store.state.grid[row].value[col].stem = {
                        id: 'stem_id_b'
                    }
                }
            }
        }
    })

    it('should remove one column from section', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[0].value.length).to.equals(defaultCols)
        gridProcessor.removeColumn('id_a')
        expect(store.state.grid[0].value.length).to.equals(defaultCols - 1)

        expect(store.state.grid[0].value[0].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[0].section.position).to.equals(SectionPositions.START)

        expect(store.state.grid[0].value[1].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[1].section.position).to.equals(SectionPositions.MID)

        expect(store.state.grid[0].value[2].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[2].section.position).to.equals(SectionPositions.END)

        expect(store.state.grid[0].value[2].stem).to.equals(undefined)
    })

    it('should update row,col values when removing an item', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        gridProcessor.removeColumn('id_a')

        for(let row = 0; row < store.state.grid.length; row++){
            for(let col = 0; col < store.state.grid[row].value.length; col++){
                expect(store.state.grid[row].value[col].row).to.equals(row)
                expect(store.state.grid[row].value[col].col).to.equals(col)
            }
        }
    })


    it('should remove entire section id_a if only 2 cols remain', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[0].value.length).to.equals(defaultCols)

        gridProcessor.removeColumn('id_a')
        gridProcessor.removeColumn('id_a')
        gridProcessor.removeColumn('id_a')

        expect(store.state.grid[0].value.length).to.equals(defaultCols - 4)

        expect(store.state.grid[0].value[0].section.name).to.equals('part_b')
        expect(store.state.grid[0].value[0].section.position).to.equals(SectionPositions.START)

        expect(store.state.grid[0].value[1].section.name).to.equals('part_b')
        expect(store.state.grid[0].value[1].section.position).to.equals(SectionPositions.END)
    })

    it('should remove entire section id_b if only 2 cols remain', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[0].value.length).to.equals(defaultCols)

        gridProcessor.removeColumn('id_b')

        expect(store.state.grid[0].value.length).to.equals(defaultCols - 2)

        expect(store.state.grid[0].value[0].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[0].section.position).to.equals(SectionPositions.START)

        expect(store.state.grid[0].value[1].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[1].section.position).to.equals(SectionPositions.MID)

        expect(store.state.grid[0].value[2].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[2].section.position).to.equals(SectionPositions.MID)

        expect(store.state.grid[0].value[3].section.name).to.equals('part_a')
        expect(store.state.grid[0].value[3].section.position).to.equals(SectionPositions.END)
    })

    it('should add one column to a section', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[0].value.length).to.equals(defaultCols)
        gridProcessor.addColumn('id_b')
        expect(store.state.grid[0].value.length).to.equals(defaultCols + 1)

        expect(store.state.grid[0].value[4].section.name).to.equals('part_b')
        expect(store.state.grid[0].value[4].section.position).to.equals(SectionPositions.START)

        expect(store.state.grid[0].value[5].section.name).to.equals('part_b')
        expect(store.state.grid[0].value[5].section.position).to.equals(SectionPositions.MID)

        expect(store.state.grid[0].value[6].section.name).to.equals('part_b')
        expect(store.state.grid[0].value[6].section.position).to.equals(SectionPositions.END)

        expect(store.state.grid[0].value[5].stem.id).to.equals('stem_id_b')
        expect(store.state.grid[0].value[6].stem).to.equals(undefined)
    })

    it('should reindex rows/cols when adding a column', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        gridProcessor.addColumn('id_b')

        for(let row = 0; row < store.state.grid.length; row++){
            for(let col = 0; col < store.state.grid[row].value.length; col++){
                expect(store.state.grid[row].value[col].row).to.equals(row)
                expect(store.state.grid[row].value[col].col).to.equals(col)
            }
        }
    })

    it('should add new section', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[0].value.length).to.equals(defaultCols)
        gridProcessor.addSection('part_c')
        expect(store.state.grid[0].value.length).to.equals(defaultCols + 2)

        expect(store.state.grid[0].value[6].section.name).to.equals('part_c')
        expect(store.state.grid[0].value[6].section.position).to.equals(SectionPositions.START)

        expect(store.state.grid[0].value[7].section.name).to.equals('part_c')
        expect(store.state.grid[0].value[7].section.position).to.equals(SectionPositions.END)
    })

    it('should reindex rows,cols after adding new section', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        gridProcessor.addSection('new_section_id')

        for(let row = 0; row < store.state.grid.length; row++){
            for(let col = 0; col < store.state.grid[row].value.length; col++){
                expect(store.state.grid[row].value[col].row).to.equals(row)
                expect(store.state.grid[row].value[col].col).to.equals(col)
            }
        }
    })
})