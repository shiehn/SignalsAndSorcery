import {beforeEach, describe, it, expect} from "vitest"
import GridGenerator from "../generators/grid-generator";
import store from "../store/store";

const gridGenerator = new GridGenerator()

describe('CompatibilityProcessor Tests', () => {
    let state = {}

    beforeEach(() => {
        state = store.state
    })

    it('should handle filled grid items', async () => {
        //SETUP
        state.grid = gridGenerator.initGrid(6, 4)

        //expect(actualNumOfGrayRatings).to.equals(expectedNumOfGrayRatings)
    })
})