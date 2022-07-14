import ArpeggioSequencer from "./arpeggio-sequencer";
import {describe, it, expect} from "vitest"
import ArpeggioGridData from "./arpeggio-grid-data";
import GridItemArpeggio from "../../generators/grid-item-arpeggio";

describe('ArpeggioSequencer Tests', () => {
    it('should correctly sequence timeline starting from zero', async () => {
        const bpm = 60
        const colIndex = 0
        const gridItemArpeggio = new GridItemArpeggio('arp_id', 'CM7:Em:G:F', 'pattern_id', 'quarter')
        const arpTimeline = new ArpeggioGridData()
        arpTimeline.addTimelineItem(colIndex, gridItemArpeggio)

        const arpSequencer = new ArpeggioSequencer(arpTimeline, bpm)

        let sequence = arpSequencer.getSequence()

        expect(sequence.length).to.equals(16)

        expect(sequence[0].time).to.equals(0)
        expect(sequence[0].note).to.equals('E4')
        expect(sequence[1].time).to.equals(1)
        expect(sequence[1].note).to.equals('G4')
        expect(sequence[2].time).to.equals(2)
        expect(sequence[2].note).to.equals('B4')
        expect(sequence[3].time).to.equals(3)
        expect(sequence[3].note).to.equals('C4')

        expect(sequence[4].time).to.equals(4)
        expect(sequence[4].note).to.equals('B4')
        expect(sequence[5].time).to.equals(5)
        expect(sequence[5].note).to.equals('E4')
        expect(sequence[6].time).to.equals(6)
        expect(sequence[6].note).to.equals('G4')
        expect(sequence[7].time).to.equals(7)
        expect(sequence[7].note).to.equals('B4')
    })

    // it('should correctly sequence timeline start form second loop', async () => {
    //     const bpm = 60
    //     const colIndex = 2
    //
    //     const gridItemArpeggio = new GridItemArpeggio('arp_id', 'CM7:Em:G:F', 'pattern_id', 'quarter')
    //     const arpTimeline = new ArpeggioGridData()
    //     arpTimeline.addTimelineItem(colIndex, gridItemArpeggio)
    //
    //     const arpSequencer = new ArpeggioSequencer(arpTimeline, bpm)
    //
    //     let sequence = arpSequencer.getSequence()
    //
    //     expect(sequence.length).to.equals(16)
    //
    //     expect(sequence[0].time).to.equals(32)
    //     expect(sequence[0].note).to.equals('c4')
    //     expect(sequence[1].time).to.equals(33)
    //     expect(sequence[1].note).to.equals('c4')
    //     expect(sequence[2].time).to.equals(34)
    //     expect(sequence[2].note).to.equals('c4')
    //     expect(sequence[3].time).to.equals(35)
    //     expect(sequence[3].note).to.equals('c4')
    //
    //     expect(sequence[12].time).to.equals(44)
    //     expect(sequence[12].note).to.equals('f4')
    //     expect(sequence[13].time).to.equals(45)
    //     expect(sequence[13].note).to.equals('f4')
    //     expect(sequence[14].time).to.equals(46)
    //     expect(sequence[14].note).to.equals('f4')
    //     expect(sequence[15].time).to.equals(47)
    //     expect(sequence[15].note).to.equals('f4')
    // })
})