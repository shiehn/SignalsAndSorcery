import {beforeEach, describe, it, expect} from "vitest"
import GridGenerator from "../generators/grid-generator";
import SaveAndLoadAdapter from "./save-load-adapter";

const gridGenerator = new GridGenerator()

describe('create and load format', () => {
    it('creates save format', () => {

        const originalGrid = gridGenerator.initGrid(4, 4)
        originalGrid[0].value[0].stem = {
            'bpm': 120,
            'type': 'drum',
            'source': 'https://a-url.com',
        }
        originalGrid[3].value[3].stem = {
            'bpm': 90,
            'type': 'drum',
            'source': 'https://b-url.com',
        }

        const state = {
            'projectName': 'mock-project-name',
            'authorName': 'mock-author-name',
            'globalBpm': 177,
            'globalKey': 'f',
            'grid': originalGrid,
        }

        let saveFormat = new SaveAndLoadAdapter().createSaveFormat(state)

        expect(saveFormat.projectName).to.equal('mock-project-name')
        expect(saveFormat.authorName).to.equal('mock-author-name')
        expect(saveFormat.globalBpm).to.equal(177)
        expect(saveFormat.globalKey).to.equal('f')

        expect(saveFormat.grid[0][0].stem.bpm).to.equal(120)
        expect(saveFormat.grid[0][0].stem.type).to.equal('drum')
        expect(saveFormat.grid[0][0].stem.source).to.equal('https://a-url.com')

        expect(saveFormat.grid[3][3].stem.bpm).to.equal(90)
        expect(saveFormat.grid[3][3].stem.type).to.equal('drum')
        expect(saveFormat.grid[3][3].stem.source).to.equal('https://b-url.com')
    })

    it('create save format and unpack it', () => {

        const originalGrid = gridGenerator.initGrid(4, 4)
        originalGrid[0].value[0].fx = ['a', 'b', 'c']
        originalGrid[0].value[0].stem = {
            'bpm': 120,
            'type': 'drum',
            'source': 'https://a-url.com',
        }
        originalGrid[3].value[3].fx = []
        originalGrid[3].value[3].stem = {
            'bpm': 90,
            'type': 'drum',
            'source': 'https://b-url.com',
        }

        const state = {
            'projectName': 'mock-project-name',
            'authorName': 'mock-author-name',
            'globalBpm': 177,
            'globalKey': 'f',
            'grid': originalGrid,
        }

        const saveLoadAdapter = new SaveAndLoadAdapter()

        let saveFormat = saveLoadAdapter.createSaveFormat(state)

        expect(saveFormat.grid[0][0].stem.bpm).to.equal(120)
        expect(saveFormat.grid[0][0].fx).to.contain('a')
        expect(saveFormat.grid[0][0].stem.type).to.equal('drum')
        expect(saveFormat.grid[0][0].stem.source).to.equal('https://a-url.com')

        expect(saveFormat.grid[3][3].fx.length).to.equal(0)
        expect(saveFormat.grid[3][3].stem.bpm).to.equal(90)
        expect(saveFormat.grid[3][3].stem.type).to.equal('drum')
        expect(saveFormat.grid[3][3].stem.source).to.equal('https://b-url.com')


        let loadedData = saveLoadAdapter.loadFromSaveFormat(saveFormat)

        expect(loadedData.projectName).to.equal('mock-project-name')
        expect(loadedData.authorName).to.equal('mock-author-name')
        expect(loadedData.globalBpm).to.equal(177)
        expect(loadedData.globalKey).to.equal('f')

        expect(loadedData.grid[0].value[0].fx).to.contain('a')
        expect(loadedData.grid[0].value[0].stem.bpm).to.equal(120)
        expect(loadedData.grid[0].value[0].stem.type).to.equal('drum')
        expect(loadedData.grid[0].value[0].stem.source).to.equal('https://a-url.com')

        expect(loadedData.grid[3].value[3].fx.length).to.equal(0)
        expect(loadedData.grid[3].value[3].stem.bpm).to.equal(90)
        expect(loadedData.grid[3].value[3].stem.type).to.equal('drum')
        expect(loadedData.grid[3].value[3].stem.source).to.equal('https://b-url.com')
    })
})
