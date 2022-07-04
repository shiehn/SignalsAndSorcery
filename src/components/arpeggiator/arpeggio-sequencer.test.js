import ArpeggioSequencer from "./arpeggio-sequencer";
import {describe, it, expect} from "vitest"

describe('ArpeggioSequencer Tests', () => {
    it('should correctly sequence timeline', async () => {
        const bpm = 60
        const arpTimeline = [{
            colIndex: 1,
            arpeggio: {
                chords: ['cm7', 'em', 'g', 'f'],
            }
        }]

        const arpSequencer = new ArpeggioSequencer(arpTimeline, bpm)

        let sequence = arpSequencer.getSequence()
        
        expect(sequence).to.equals('XXX')
    })
})