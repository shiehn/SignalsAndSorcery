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

    it('should add fxnodes to grid item', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        expect(store.state.grid[1].value[1].fxnodes.length).to.equals(0)

        gridProcessor.addGridItemFX(1,1,'mock_fxnode_id')

        expect(store.state.grid[1].value[1].fxnodes).to.contain('mock_fxnode_id')
        expect(store.state.grid[1].value[1].fxnodes).to.not.contain('bs_mock_fxnode_id')

    })

    it('should remove fxnodes by fxId', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        //SETUP THE TEST
        expect(store.state.grid[1].value[1].fxnodes.length).to.equals(0)
        gridProcessor.addGridItemFX(1,1,'mock_fxnode_id')
        expect(store.state.grid[1].value[1].fxnodes).to.contain('mock_fxnode_id')

        //REMOVE THE FXNODE
        gridProcessor.removeGridItemFxById(1,1,'mock_fxnode_id')
        expect(store.state.grid[1].value[1].fxnodes).to.not.contain('mock_fxnode_id')
    })

    it('should remove fxnodes by FX Index', async () => {
        const gridProcessor = new GridProcessor(store.state.grid)

        //SETUP THE TEST
        expect(store.state.grid[1].value[1].fxnodes.length).to.equals(0)
        gridProcessor.addGridItemFX(1,1,'mock_fxnode_id')
        expect(store.state.grid[1].value[1].fxnodes).to.contain('mock_fxnode_id')

        //REMOVE THE FXNODE
        gridProcessor.removeGridItemFxByIndex(1,1,0)
        expect(store.state.grid[1].value[1].fxnodes).to.not.contain('mock_fxnode_id')
    })
})