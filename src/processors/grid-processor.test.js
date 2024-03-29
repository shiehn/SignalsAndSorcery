/**
 * @vitest-environment happy-dom
 */

import {beforeEach, describe, it, expect} from "vitest"
import GridProcessor from "./grid-processor";
import store from "../store/store";
import GridGenerator, {SectionPositions} from "../generators/grid-generator";
import GridItemArpeggio from "../generators/grid-item-arpeggio";

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

                if (row == 0 && col == 1) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = undefined
                    store.state.grid[row].value[col].arpeggio = new GridItemArpeggio('arp_a', 'Am7:Am7:FM7:Am7', 'pattern_1')
                    store.state.grid[row].value[col].arpeggio.on = true
                }

                if (row == 0 && col == 3) {
                    store.state.grid[row].value[col].section.id = 'id_a'
                    store.state.grid[row].value[col].section.name = 'part_a'
                    store.state.grid[row].value[col].stem = undefined
                    store.state.grid[row].value[col].arpeggio = new GridItemArpeggio('arp_b', 'Em7:Em7:CM7:CM7', 8)
                    store.state.grid[row].value[col].arpeggio.on = true
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

        for (let row = 0; row < store.state.grid.length; row++) {
            for (let col = 0; col < store.state.grid[row].value.length; col++) {
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

        for (let row = 0; row < store.state.grid.length; row++) {
            for (let col = 0; col < store.state.grid[row].value.length; col++) {
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

        for (let row = 0; row < store.state.grid.length; row++) {
            for (let col = 0; col < store.state.grid[row].value.length; col++) {
                expect(store.state.grid[row].value[col].row).to.equals(row)
                expect(store.state.grid[row].value[col].col).to.equals(col)
            }
        }
    })

    it('should rename section name', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        const newName = 'new_test_name'

        expect(store.state.grid[0].value[0].section.name).not.to.equals(newName)
        expect(store.state.grid[1].value[4].section.name).not.to.equals(newName)

        let sectionId = store.state.grid[0].value[0].section.id
        gridProcessor.renameSection(sectionId, newName)

        expect(store.state.grid[0].value[0].section.name).to.equals(newName)
        expect(store.state.grid[0].value[2].section.name).to.equals(newName)
        expect(store.state.grid[2].value[1].section.name).to.equals(newName)
        expect(store.state.grid[2].value[2].section.name).to.equals(newName)
        expect(store.state.grid[3].value[0].section.name).to.equals(newName)
        expect(store.state.grid[3].value[2].section.name).to.equals(newName)

        //CHECK THAT THE OTHER SECTIONS HAVE NOT CHANGED
        expect(store.state.grid[2].value[4].section.name).not.to.equals(newName)
    })

    it('should clear row', () => {
        store.state.grid[1].value[1].stem = {
            id: 'row_1_1'
        }
        store.state.grid[1].value[2].stem = {
            id: 'row_1_2'
        }
        store.state.grid[2].value[1].stem = {
            id: 'stem_2_1'
        }

        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[1].value[1].stem).to.not.equals(undefined)

        gridProcessor.clearRow(1)

        expect(store.state.grid[1].value[1].stem).to.equals(undefined)
        expect(store.state.grid[1].value[1].stem).to.equals(undefined)
        expect(store.state.grid[2].value[1].stem.id).to.equals('stem_2_1')
    })

    it('should clear all mobileTransfers and set a new one', () => {
        store.state.grid[0].value[0].acceptMobileTransfer = true

        new GridProcessor(store.state.grid).setAcceptMobileTransfer(1, 1)

        expect(store.state.grid[0].value[0].acceptMobileTransfer).to.equals(false)
        expect(store.state.grid[1].value[1].acceptMobileTransfer).to.equals(true)
    })

    it('should find no mobile transfer enabled grid items', () => {
        const result = new GridProcessor(store.state.grid).getMobileTransferEnabledGridItem()
        expect(result).to.equals(undefined)
    })

    it('should find ONE mobile transfer enabled grid item', () => {
        new GridProcessor(store.state.grid).setAcceptMobileTransfer(2, 2)

        const result = new GridProcessor(store.state.grid).getMobileTransferEnabledGridItem()

        expect(result[0]).to.equals(2)
        expect(result[1]).to.equals(2)
    })
})