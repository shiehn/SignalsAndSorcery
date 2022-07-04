import ArpeggioSequencer from "./arpeggio-sequencer";
import {describe, it, expect} from "vitest"

describe('ArpeggioSequencer Tests', () => {
    it('should correctly sequence timeline starting from zero', async () => {
        const bpm = 60
        const arpTimeline = [{
            colIndex: 0,
            arpeggio: {
                chords: ['cm7', 'em', 'g', 'f'],
            }
        }]

        const arpSequencer = new ArpeggioSequencer(arpTimeline, bpm)

        let sequence = arpSequencer.getSequence()

        expect(sequence.length).to.equals(16)

        expect(sequence[0].time).to.equals(0)
        expect(sequence[0].note).to.equals('c')
        expect(sequence[1].time).to.equals(1)
        expect(sequence[1].note).to.equals('c')
        expect(sequence[2].time).to.equals(2)
        expect(sequence[2].note).to.equals('c')
        expect(sequence[3].time).to.equals(3)
        expect(sequence[3].note).to.equals('c')

        expect(sequence[4].time).to.equals(4)
        expect(sequence[4].note).to.equals('e')
        expect(sequence[5].time).to.equals(5)
        expect(sequence[5].note).to.equals('e')
        expect(sequence[6].time).to.equals(6)
        expect(sequence[6].note).to.equals('e')
        expect(sequence[7].time).to.equals(7)
        expect(sequence[7].note).to.equals('e')
    })

    it('should correctly sequence timeline start form second loop', async () => {
        const bpm = 60
        const arpTimeline = [{
            colIndex: 2,
            arpeggio: {
                chords: ['cm7', 'em', 'g', 'f'],
            }
        }]

        const arpSequencer = new ArpeggioSequencer(arpTimeline, bpm)

        let sequence = arpSequencer.getSequence()

        expect(sequence.length).to.equals(16)

        expect(sequence[0].time).to.equals(32)
        expect(sequence[0].note).to.equals('c')
        expect(sequence[1].time).to.equals(33)
        expect(sequence[1].note).to.equals('c')
        expect(sequence[2].time).to.equals(34)
        expect(sequence[2].note).to.equals('c')
        expect(sequence[3].time).to.equals(35)
        expect(sequence[3].note).to.equals('c')

        expect(sequence[12].time).to.equals(44)
        expect(sequence[12].note).to.equals('f')
        expect(sequence[13].time).to.equals(45)
        expect(sequence[13].note).to.equals('f')
        expect(sequence[14].time).to.equals(46)
        expect(sequence[14].note).to.equals('f')
        expect(sequence[15].time).to.equals(47)
        expect(sequence[15].note).to.equals('f')
    })
})