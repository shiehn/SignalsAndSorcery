export default class ArpeggioGridData {

    #timeline = []

    addTimelineItem(colIndex, gridItemArpeggio) {
        const timeLineItem = {
            colIndex: colIndex,
            arpeggio: gridItemArpeggio,
        }
        this.#timeline.push(timeLineItem)
    }

    getTimeline() {
        return this.#timeline
    }
}