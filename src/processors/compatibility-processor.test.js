import {beforeEach, describe, it, expect} from "vitest"
import GridGenerator from "../generators/grid-generator";
import store from "../store/store";
import CompatibilityProcessor, {RATING} from "./compatibility-processor";

const gridGenerator = new GridGenerator()

describe('CompatibilityProcessor Tests', () => {
    let state = {}

    beforeEach(() => {
        state = store.state

        //RESET THE STATE
        state.globalBpm = undefined
        state.globalKey = undefined
        state.staticUrl = ''
        state.grid = []
        state.currentStateHash = ''
        state.currentRowHash = ['', '', '', '']
    })

    it('should handle filled grid items', async () => {
        //SETUP
        state.grid = gridGenerator.initGrid(4, 4)

        let stemToDrop = {}

        //ADD STEMS TO GRID
        for (let row = 0; row < state.grid.length; row++) {
            for (let col = 0; col < state.grid[row].value.length; col++) {
                state.grid[row].value[col].stem = {}
            }
        }

        //EXECUTE
        const processor = new CompatibilityProcessor(stemToDrop, state)

        processor.processFilledGridItems()

        //ASSET
        let actualNumOfGrayRatings = 0

        for (let row = 0; row < state.grid.length; row++) {
            for (let col = 0; col < state.grid[row].value.length; col++) {
                if (state.grid[row].value[col].stem) {
                    if (state.grid[row].value[col].compatibility === RATING.GRAY) {
                        actualNumOfGrayRatings++
                    }
                }
            }
        }

        const expectedNumOfGrayRatings = 16

        expect(actualNumOfGrayRatings).to.equals(expectedNumOfGrayRatings)
    })

    it('getChordsInCol should ignore drums', () => {
        //SETUP - one clip in column and is drums
        const colToTest = 2
        state.grid = gridGenerator.initGrid(4, 4)

        let drumStem = {
            "id": "b685705d-ebf5-4a88-a743-3f74c3787b2e",
            "bpm": "130.0",
            "chords": "f:c:g:f",
            "key": "c",
            "sectionId": "a",
            "type": "drum",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        //ADD STEMS TO GRID
        state.grid[0].value[colToTest].stem = undefined // HI
        state.grid[1].value[colToTest].stem = undefined // MI
        state.grid[2].value[colToTest].stem = undefined // LOW
        state.grid[3].value[colToTest].stem = drumStem // DRUM

        //EXECUTE
        let stemToDrop = {
            "id": "xxx",
            "bpm": "130.0",
            "chords": "dm:dm:em:f",
            "key": "c",
            "sectionId": "a",
            "type": "hi",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        const processor = new CompatibilityProcessor(stemToDrop, state)
        const rating = processor.getChordCompatibilityForColumn(colToTest)

        expect(rating).to.equal(RATING.GREEN)
    })

    it('getChordsInCol should detect incompatibility', () => {
        const colToTest = 2
        state.grid = gridGenerator.initGrid(4, 4)

        let hiStem = {
            "id": "b685705d-ebf5-4a88-a743-3f74c3787b2e",
            "bpm": "130.0",
            "chords": "f:c:g:f",
            "key": "c",
            "sectionId": "a",
            "type": "hi",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        //ADD STEMS TO GRID
        state.grid[0].value[colToTest].stem = hiStem // HI
        state.grid[1].value[colToTest].stem = undefined // MI
        state.grid[2].value[colToTest].stem = undefined // LOW
        state.grid[3].value[colToTest].stem = undefined // DRUM

        //EXECUTE
        let stemToDrop = {
            "id": "xxx",
            "bpm": "130.0",
            "chords": "dm:dm:em:f",
            "key": "c",
            "sectionId": "a",
            "type": "low",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }


        const processor = new CompatibilityProcessor(stemToDrop, state)
        const rating = processor.getChordCompatibilityForColumn(colToTest)

        expect(rating).to.equal(RATING.RED)
    })

    it('getChordsInCol should detect compatibility when col is undefined', () => {
        const colToTest = 2
        state.grid = gridGenerator.initGrid(4, 4)

        //ADD STEMS TO GRID
        state.grid[0].value[colToTest].stem = undefined // HI
        state.grid[1].value[colToTest].stem = undefined // MI
        state.grid[2].value[colToTest].stem = undefined // LOW
        state.grid[3].value[colToTest].stem = undefined // DRUM

        //EXECUTE
        let stemToDrop = {
            "id": "xxx",
            "bpm": "130.0",
            "chords": "dm:dm:em:f",
            "key": "c",
            "sectionId": "a",
            "type": "low",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }


        const processor = new CompatibilityProcessor(stemToDrop, state)
        const rating = processor.getChordCompatibilityForColumn(colToTest)

        expect(rating).to.equal(RATING.GREEN)
    })

    it('getChordsInCol should ignore drums and be incompatible with mid', () => {
        //SETUP - one clip in column and is drums
        const colToTest = 2
        state.grid = gridGenerator.initGrid(4, 4)

        let drumStem = {
            "id": "b685705d-ebf5-4a88-a743-3f74c3787b2e",
            "bpm": "130.0",
            "chords": "f:c:g:f",
            "key": "c",
            "sectionId": "a",
            "type": "drum",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        let midStem = {
            "id": "b685705d-ebf5-4a88-a743-3f74c3787b2e",
            "bpm": "130.0",
            "chords": "c:c:c:c",
            "key": "c",
            "sectionId": "a",
            "type": "mid",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        //ADD STEMS TO GRID
        state.grid[0].value[colToTest].stem = undefined // HI
        state.grid[1].value[colToTest].stem = midStem // MID
        state.grid[2].value[colToTest].stem = undefined // LOW
        state.grid[3].value[colToTest].stem = drumStem // DRUM

        //EXECUTE
        let stemToDrop = {
            "id": "xxx",
            "bpm": "130.0",
            "chords": "f:c:g:f",
            "key": "c",
            "sectionId": "a",
            "type": "hi",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }


        const processor = new CompatibilityProcessor(stemToDrop, state)
        const rating = processor.getChordCompatibilityForColumn(colToTest)

        expect(rating).to.equal(RATING.RED)
    })

    it('getChordsInCol should all ways be compatible if stem is drums', () => {
        //SETUP - one clip in column and is drums
        const colToTest = 2
        state.grid = gridGenerator.initGrid(4, 4)

        let midStem = {
            "id": "b685705d-ebf5-4a88-a743-3f74c3787b2e",
            "bpm": "130.0",
            "chords": "c:c:c:c",
            "key": "c",
            "sectionId": "a",
            "type": "mid",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }

        //ADD STEMS TO GRID
        state.grid[0].value[colToTest].stem = undefined // HI
        state.grid[1].value[colToTest].stem = midStem // MID
        state.grid[2].value[colToTest].stem = undefined // LOW
        state.grid[3].value[colToTest].stem = undefined // DRUM

        //EXECUTE
        let stemToDrop = {
            "id": "xxx",
            "bpm": "130.0",
            "chords": "f:c:g:f",
            "key": "c",
            "sectionId": "a",
            "type": "drum",
            "variationId": "two",
            "source": "",
            "waveform": "",
            "showPreviewIcon": true,
            "previewIconPath": "",
            "previewStopIconPath": ""
        }


        const processor = new CompatibilityProcessor(stemToDrop, state)
        const rating = processor.getChordCompatibilityForColumn(colToTest)

        expect(rating).to.equal(RATING.GREEN)
    })
})
