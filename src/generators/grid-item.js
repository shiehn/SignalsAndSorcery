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
    }

    clearStemAndArpeggio() {
        this.compatibility = undefined
        this.stem = undefined
        this.showDeleteIcon = false
        this.arpeggio = undefined
    }
}