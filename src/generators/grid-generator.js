import {reactive, ref} from "vue";
import {v4} from "uuid";
import GridProcessor from "../processors/grid-processor";
import GridItem from "./grid-item";
import GridItemSection from "./grid-item-section";
import GridItemArpeggio from "./grid-item-arpeggio";

export const SectionPositions = {
    START: 'start',
    MID: 'mid',
    END: 'end'
}

export default class GridGenerator {

    initGrid(numRows, numCols) {
        const defaultSectionName = 'part_0'
        const defaultId = v4()

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

                let gridItem = this.createGridItemWithSection(i, j, new GridItemSection(defaultId, defaultSectionName, position))
                // if(i == 0) {
                //     gridItem.arpeggio = new GridItemArpeggio(v4(), [], 'pattern_1', 'quarter')
                // }

                row.value.push(gridItem)
            }
            rows.push(row)
        }

        return reactive(rows)
    }

    createGridItemEmpty(row, col) {
        return new GridItem(row, col)
    }

    createGridItemWithSection(row, col, section) {
        return new GridItem(row, col, section)
    }
}