import TimeUtils from "../../utils/time-utils";
import MusicTheoryUtils from "../../utils/music-theory-utils";

export default class ArpeggioSequencer {
    constructor(arpTimeline, bpm) {
        this.arpTimeline = arpTimeline.getTimeline()
        this.bpm = bpm
        this.timeUtils = new TimeUtils(bpm)
    }

    getDuration(rate) {
        switch(rate) {
            case 'whole':
                return this.timeUtils.getSecondsPerBar()
            case'half':
                return this.timeUtils.getSecondsPerQuarter() * 2
            case 'quarter':
                return this.timeUtils.getSecondsPerQuarter()
            case 'eighth':
                return this.timeUtils.getSecondsPerEighth()
            case 'sixteenth':
                return this.timeUtils.getSecondsPerSixteenth()
            default:
                console.log('ERROR: RATE NOT FOUND: ', rate)
        }
    }

    getNumOfNotesInLoop(rate) {
        switch(rate) {
            case 'whole':
                return this.timeUtils.numOfWholesPerLoop()
            case'half':
                return this.timeUtils.numOfHalvesPerLoop()
            case 'quarter':
                return this.timeUtils.numOfQuartersPerLoop()
            case 'eighth':
                return this.timeUtils.numOfEighthsPerLoop()
            case 'sixteenth':
                return this.timeUtils.numOfSixteenthsPerLoop()
            default:
                console.log('ERROR: RATE NOT FOUND: ', rate)
        }
    }

    getNumOfNotesInBar(rate) {
        switch(rate) {
            case 'whole':
                return this.timeUtils.numOfWholesPerBar()
            case'half':
                return this.timeUtils.numOfHalvesPerBar()
            case 'quarter':
                return this.timeUtils.numOfQuartersPerBar()
            case 'eighth':
                return this.timeUtils.numOfEighthsPerBar()
            case 'sixteenth':
                return this.timeUtils.numOfSixteenthsPerBar()
            default:
                console.log('ERROR: RATE NOT FOUND: ', rate)
        }
    }

    getSequence() {
        let sequence = []
        const musicTheoryUtils = new MusicTheoryUtils()
        for (let i = 0; i < this.arpTimeline.length; i++) {
            let arpObj = this.arpTimeline[i].arpeggio

            // infer the time until the colIndex
            let timeBeforeArpStart = (this.arpTimeline[i].colIndex) * this.timeUtils.getSecondsPerLoop()

            //check the Rate of the arpeggio
            //hard code to quarters for now
            let noteDuration = this.getDuration(arpObj.rate)
            let notesInLoop = this.getNumOfNotesInLoop(arpObj.rate)
            let notesPerChord = this.getNumOfNotesInBar(arpObj.rate)

            //SWITCH BASED ON Rate
            let chordNoteIndex = -1
            let chordIndex = -1
            let chordNotes = []
            for (let noteIndex = 0; noteIndex < notesInLoop; noteIndex++) {
                if (noteIndex % notesPerChord === 0) {
                    chordIndex++
                    chordNoteIndex = 0
                    chordNotes = musicTheoryUtils.getChordNotes(arpObj.chords[chordIndex])
                }

                //TODO MAKE A FUNC OR SOMETHING
                if(chordIndex > chordNotes.length - 2) {
                    chordIndex = 0
                } else {
                    chordIndex++
                }

                console.log('arpObj.synth', arpObj.synth)

                let sequenceItem = {
                    time: timeBeforeArpStart + (noteIndex * noteDuration),
                    note: chordNotes[chordIndex] + '4',  //TODO: THIS IS A PROBLEM PLEASE FIX
                    synth: arpObj.synth,
                    duration: noteDuration,
                }

                sequence.push(sequenceItem)
            }
        }

        console.log('SEQUENCE', sequence)
        return sequence
    }
}