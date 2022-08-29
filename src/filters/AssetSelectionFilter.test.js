import {describe, it, expect} from "vitest"
import AssetSelectionFilter from "./AssetSelectionFilter"
import {stems} from "./AssetSelectionTestData";


describe('AssetSelectionFilter Tests', () => {

    it('should filter drum', async () => {

        const selectionFilter = new AssetSelectionFilter(stems, 90, 'drum', 'c', 'c:c:c:c')

        const filteredStems = selectionFilter.filter()

        expect(filteredStems.length).to.equals(1)
    })

    it('should filter hi', async () => {

        const selectionFilter = new AssetSelectionFilter(stems, 120, 'hi', 'f', 'FM7:FM7:Am7:Dm7')

        const filteredStems = selectionFilter.filter()

        expect(filteredStems.length).to.equals(1)
    })

    it('should filter by key', async () => {

        const selectionFilter = new AssetSelectionFilter(stems, 0, 'all', 'f', 'all')

        const filteredStems = selectionFilter.filter()

        expect(filteredStems.length).to.equals(3)
    })

    it('should filter mid and ignore key', async () => {

        const selectionFilter = new AssetSelectionFilter(stems, 90, 'mid', 'all', "Dm7:Dm7:Dm7:Dm7")

        const filteredStems = selectionFilter.filter()

        expect(filteredStems.length).to.equals(2)
    })
})