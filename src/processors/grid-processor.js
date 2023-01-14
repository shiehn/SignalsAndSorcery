import GridGenerator, {SectionPositions} from "../generators/grid-generator";
import {v4} from "uuid";
import GridItemSection from "../generators/grid-item-section";
import GridItemArpeggio from "../generators/grid-item-arpeggio";

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

        this.reIndexRowsAndCols()
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

        this.reIndexRowsAndCols()
    }

    addSection = (sectionName, numOfCols) => {
        const newItemIndex = this.grid[0].value.length;

        if (!numOfCols || numOfCols < 2) {
            numOfCols = 2
        }

        const newId = v4()
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < numOfCols; col++) {
                //insert new item
                this.grid[row].value.splice(newItemIndex + col, 0, new GridGenerator().createGridItemEmpty(row, newItemIndex))

                //update new Item
                this.grid[row].value[newItemIndex + col].section.id = newId
                this.grid[row].value[newItemIndex + col].section.name = sectionName

                if (col == 0) {
                    this.grid[row].value[newItemIndex + col].section.position = SectionPositions.START
                } else if (col == numOfCols - 1) {
                    this.grid[row].value[newItemIndex + col].section.position = SectionPositions.END
                } else {
                    this.grid[row].value[newItemIndex + col].section.position = SectionPositions.MID
                }

                //add arpeggios to row 0
                if (row == 0) {
                    this.grid[row].value[newItemIndex + col].arpeggio = new GridItemArpeggio(v4(), [], 'pattern_1', 'quarter')
                }
            }
        }

        this.reIndexRowsAndCols()
    }

    reIndexRowsAndCols = () => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                this.grid[row].value[col].row = row
                this.grid[row].value[col].col = col
            }
        }
    }

    renameSection = (sectionId, newName) => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].section.id == sectionId) {
                    this.grid[row].value[col].section.name = newName
                }
            }
        }
    }

    clearRow = (rowIndex) => {
        for (let col = 0; col < this.grid[rowIndex].value.length; col++) {
            if (this.grid[rowIndex].value[col]) {
                console.log('ROW:' + rowIndex, this.grid[rowIndex].value[col]);
                this.grid[rowIndex].value[col].stem = undefined;
            }
        }
    }

    extractArpeggioData = () => {
        let arpeggioData = new ArpeggioGridData()

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].arpeggio && this.grid[row].value[col].arpeggio.on) {
                    arpeggioData.addTimelineItem(col, this.grid[row].value[col].arpeggio)
                }
            }
        }

        return arpeggioData
    }

    getArpeggioById = (id) => {
        let arpeggio = undefined

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                let arp = this.grid[row].value[col].arpeggio
                if (arp && arp.id === id) {
                    return arp
                }
            }
        }

        return arpeggio
    }

    updateArpeggioBuffersRendered = (id) => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                let arp = this.grid[row].value[col].arpeggio
                if (arp && arp.on) {
                    arp.bufferRendered = true

                    if (id && id === arp.id) {
                        arp.renderedInMix = false
                    }
                }
            }
        }
    }

    updateArpeggioRenderedInMix = () => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                let arp = this.grid[row].value[col].arpeggio
                if (arp) {
                    arp.renderedInMix = true
                }
            }
        }
    }

    updateArpeggioToUnRendered = (id) => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                let arp = this.grid[row].value[col].arpeggio
                if (arp && arp.on && arp.id === id) {
                    arp.renderedInMix = false
                    arp.bufferRendered = true
                }
            }
        }
    }

    clearAcceptMobileTransfer = () => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                this.grid[row].value[col].acceptMobileTransfer = false
            }
        }
    }

    setAcceptMobileTransfer = (row, col) => {
        this.clearAcceptMobileTransfer()

        if (this.grid[row].value[col]) {
            this.grid[row].value[col].acceptMobileTransfer = true
        }
    }

    getMobileTransferEnabledGridItem = () => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].acceptMobileTransfer) {
                    return [row, col]
                }
            }
        }

        return undefined
    }

    isAcceptingMobileTransfers = () => {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].value.length; col++) {
                if (this.grid[row].value[col].acceptMobileTransfer) {
                    return true
                }
            }
        }
    }
}