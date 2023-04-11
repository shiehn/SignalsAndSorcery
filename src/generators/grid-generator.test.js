import {beforeEach, describe, it, expect} from "vitest"
import GridGenerator from "./grid-generator";

describe('GridGenerator Tests', () => {
    let gridGenerator = new GridGenerator()

    it('should return grid with correct row/col length', async () => {
        const rows = 6
        const cols = 4

        const grid = gridGenerator.initGrid(rows, cols)

        expect(grid.length).to.equals(rows)
        expect(grid[0].value.length).to.equals(cols)
    })

    it('should return empty sfxNodes for each row/col', async () => {
        const rows = 6
        const cols = 4

        const grid = gridGenerator.initGrid(rows, cols)

        for(let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                expect(grid[i].value[j].fxs.length).to.equals(0)
            }
        }
    })
})