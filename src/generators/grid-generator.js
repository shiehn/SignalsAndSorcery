import {reactive, ref} from "vue";

export const SectionPositions = {
    START: 'start',
    MID: 'mid',
    END: 'end'
}

export default class GridGenerator {

    initGrid(numRows, numCols) {

        const defaultSectionName = 'section_a'
        const defaultId = 'xyz123'

        let rows = []
        for (let i = 0; i < numRows; i++) {


            let row = ref([])
            for (let j = 0; j < numCols; j++) {

                let position = ''
                if (j == 0) {
                    position = SectionPositions.START
                } else if (j == numCols - 1) {
                    position = SectionPositions.END
                } else {
                    position = SectionPositions.MID
                }

                row.value.push(this.createGridItemWithSection(i, j, {
                    id: defaultId,
                    name: defaultSectionName,
                    position: position,
                }))
            }
            rows.push(row)
        }

        return reactive(rows)
    }

    createGridItemEmpty(row, col) {
        let gridItem = {
            row: row,
            col: col,
            section: {
                id: undefined,
                name: undefined,
                position: undefined,
            },
            compatibility: undefined,
            stem: undefined,
            showDeleteIcon: false,
        }

        return gridItem
    }

    createGridItemWithSection(row, col, section) {
        let gridItem = {
            row: row,
            col: col,
            section: section,
            compatibility: undefined,
            stem: undefined,
            showDeleteIcon: false,
        }

        return gridItem
    }
}