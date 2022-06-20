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
    })


})




// const expectedNumOfGrayRatings = 16
//
// expect(actualNumOfGrayRatings).to.equals(expectedNumOfGrayRatings)