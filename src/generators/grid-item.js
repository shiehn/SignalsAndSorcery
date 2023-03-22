export default class GridItem
{
    constructor(row, col, section)
    {
        this.row = row
        this.col = col
        this.section = section ? section : {
            id: undefined,
            name: undefined,
            position: undefined,
        }
        this.compatibility = undefined
        this.stem = undefined
        this.showDeleteIcon = false
        this.arpeggio = undefined
        this.fxnodes = []
        this.acceptMobileTransfer = false //this is a flag to indicate the next asset selection will be transferred to this grid item
    }

    clearStemAndArpeggio() {
        this.compatibility = undefined
        this.stem = undefined
        this.showDeleteIcon = false
        this.arpeggio = undefined
    }
}