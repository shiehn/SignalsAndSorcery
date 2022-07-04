import TimeUtils from "../../utils/time-utils";


export default class ArpeggioSequencer {
    constructor(arpTimeline, bpm) {
        this.arpTimeline = arpTimeline
        this.bpm = bpm
        this.timeUtils = new TimeUtils(bpm)
    }

    getSequence() {
        let sequence = []

        for (let i = 0; i < this.arpTimeline.length; i++) {
            let arpObj = this.arpTimeline[i]

            // infer the time until the colIndex
            let timeBeforeArpStart = (this.arpTimeline[i].colIndex) * this.timeUtils.getSecondsPerLoop()

            console.log('timeBeforeArpStart', timeBeforeArpStart)
            //check the speed of the arpeggio
            //hard code to quarters for now
            let noteDuration = this.timeUtils.getSecondsPerQuarter()
            let notesInLoop = this.timeUtils.numOfQuartersPerLoop()
            let notesPerChord = this.timeUtils.numOfQuartersPerBar()

            //SWITCH BASED ON SPEED
            let chordIndex = -1
            for (let noteIndex = 0; noteIndex < notesInLoop; noteIndex++) {
                if (noteIndex % notesPerChord === 0) {
                    chordIndex++
                }

                let chordRoot = arpObj.arpeggio.chords[chordIndex].charAt(0); //TODO THIS IS JUST THE ROOT .. WILL UPDATE TO BE PATTERN

                let sequenceItem = {
                    time: timeBeforeArpStart + (noteIndex * noteDuration),
                    note: chordRoot,
                }

                sequence.push(sequenceItem)
            }
        }

        return sequence
    }

    //generate the arpeggio sequence

    //apply the sequence to TONE
}