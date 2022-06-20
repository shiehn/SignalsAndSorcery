import GridGenerator, {SectionPositions} from "../generators/grid-generator";

export default class GridProcessor {

    constructor(grid) {
        this.grid = grid
    }

    getSectionData = (sectionId) => {
        const row = 0
        let sectionData = {
            name: undefined,
            id: sectionId,
            size: 0,
            startIndex: 0,
            endIndex: 0,
        }

        for (let col = 0; col < this.grid[row].value.length; col++) {
            if (this.grid[row].value[col].section.id == sectionId) {
                sectionData.name = this.grid[row].value[col].section.name
                if (this.grid[row].value[col].section.position === SectionPositions.START) {
                    sectionData.startIndex = col
                }

                if (this.grid[row].value[col].section.position === SectionPositions.END) {
                    sectionData.endIndex = col
                }

                sectionData.size++
            }
        }

        return sectionData
    }

    addColumn = (sectionId) => {
        const sectionData = this.getSectionData(sectionId)

        if (!sectionData) {
            return
        }

        let originalIndex = sectionData.endIndex
        let newItemIndex = sectionData.endIndex + 1

        for (let row = 0; row < this.grid.length; row++) {

            //insert new item
            this.grid[row].value.splice(newItemIndex, 0, new GridGenerator().createGridItemEmpty(row, newItemIndex))

            //update new Item
            this.grid[row].value[newItemIndex].section.id = this.grid[row].value[originalIndex].section.id
            this.grid[row].value[newItemIndex].section.name = this.grid[row].value[originalIndex].section.name
            this.grid[row].value[newItemIndex].section.position = SectionPositions.END

            //update the original item
            this.grid[row].value[originalIndex].section.position = SectionPositions.MID
        }
    }

    removeColumn = (sectionId) => {
        // SECTION MUST CONTAIN A MIN OF 2 COLS
        const sectionData = this.getSectionData(sectionId)

        // 1 - check if col length is greater than 2 - if not delete section
        if (sectionData.size <= 2) {
            // for (let row = 0; row < state.grid.length; row++) {
            for (let row = 0; row < this.grid.length; row++) {
                //iterate backwards to remove
                for (let col = this.grid[row].value.length - 1; col >= 0; col--) {
                    if (this.grid[row].value[col].section.id == sectionId) {
                        this.grid[row].value.splice(col, 1) //REMOVE THE COLUMN
                    }
                }
            }

            return
        }

        let origEndIndex = sectionData.endIndex
        let newEndIndex = sectionData.endIndex - 1
        for (let row = 0; row < this.grid.length; row++) {
            this.grid[row].value[newEndIndex].section.position = SectionPositions.END
            this.grid[row].value.splice(origEndIndex, 1) //REMOVE THE COLUMN

        }

        // 2 - shift the position end back one

        // 3 - delete the last col

        // for (let row = 0; row < state.grid.length; row++) {
        // for (let col = 0; col < state.grid[row].value.length; col++) {
        //     if (state.grid[row].value[col].stem) {
        //         if (state.grid[row].value[col].compatibility === RATING.GRAY) {
        //             actualNumOfGrayRatings++
        //         }
        //     }
        // }
    }
}