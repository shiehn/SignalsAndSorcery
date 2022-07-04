import TimeUtils from "../../utils/time-utils";


export default class ArpeggioSequencer {
    constructor(arpTimeline, bpm) {
        this.arpTimeline = arpTimeline.getTimeline()
        this.bpm = bpm
        this.timeUtils = new TimeUtils(bpm)
    }

    getSequence() {
        let sequence = []

        for (let i = 0; i < this.arpTimeline.length; i++) {
            let arpObj = this.arpTimeline[i].arpeggio

            // infer the time until the colIndex
            let timeBeforeArpStart = (this.arpTimeline[i].colIndex) * this.timeUtils.getSecondsPerLoop()

            //check the speed of the arpeggio
            //hard code to quarters for now
            let noteDuration = this.timeUtils.getSecondsPerQuarter()
            let notesInLoop = this.timeUtils.numOfQuartersPerLoop()
            let notesPerChord = this.timeUtils.numOfQuartersPerBar()

            console.log('timeBeforeArpStart', timeBeforeArpStart)

            //SWITCH BASED ON SPEED
            let chordIndex = -1
            for (let noteIndex = 0; noteIndex < notesInLoop; noteIndex++) {
                if (noteIndex % notesPerChord === 0) {
                    chordIndex++
                }

                let chordRoot = arpObj.chords[chordIndex].charAt(0); //TODO THIS IS JUST THE ROOT .. WILL UPDATE TO BE PATTERN

                let sequenceItem = {
                    time: timeBeforeArpStart + (noteIndex * noteDuration),
                    note: chordRoot + '4',  //TODO: THIS IS A PROBLEM PLEASE FIX
                    duration: noteDuration,
                }

                sequence.push(sequenceItem)
            }
        }

        console.log('SEQUENCE', sequence)
        return sequence
    }

    //generate the arpeggio sequence

    //apply the sequence to TONE
}