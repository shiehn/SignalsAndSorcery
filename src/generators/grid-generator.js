import {reactive, ref} from "vue";

export default class GridGenerator {

    initGrid(numRows, numCols) {
        let rows = []
        for (let i = 0; i < numRows; i++) {
            let row = ref([])
            for (let j = 0; j < numCols; j++) {
                row.value.push({
                    row: i,
                    col: j,
                    compatibility: undefined,
                    stem: undefined,
                    showDeleteIcon: false,
                })
            }
            rows.push(row)
        }

        return reactive(rows)
    }
}