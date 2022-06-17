import GridGenerator from "../generators/grid-generator";

export default class SaveAndLoadAdapter {

    createSaveFormat(state) {

        let saveFormat = {
            'projectName': state.projectName,
            'authorName': state.authorName,
            'globalBpm': state.globalBpm,
            'globalKey': state.globalKey,
            'grid': [],
        }

        for (let row = 0; row < state.grid.length; row++) {
            let newRow = []
            for (let col = 0; col < state.grid[row].value.length; col++) {
                newRow[col] = state.grid[row].value[col]
            }

            saveFormat.grid[row] = newRow
        }

        return saveFormat
    }

    loadFromSaveFormat(saveFormat) {

        let rows = 0
        let cols = 0

        if (saveFormat.grid) {
            rows = saveFormat.grid.length
        }

        if (saveFormat.grid && saveFormat.grid.length > 0) {
            cols = saveFormat.grid[0].length
        }

        let newGrid = new GridGenerator().initGrid(rows, cols)


        for (let row = 0; row < saveFormat.grid.length; row++) {
            for (let col = 0; col < newGrid[row].value.length; col++) {
                newGrid[row].value[col] = saveFormat.grid[row][col]
            }
        }

        const retrievedData = {
            'projectName': saveFormat.projectName,
            'authorName': saveFormat.authorName,
            'globalBpm': saveFormat.globalBpm,
            'globalKey': saveFormat.globalKey,
            'grid': newGrid,
        }

        return retrievedData
    }
}