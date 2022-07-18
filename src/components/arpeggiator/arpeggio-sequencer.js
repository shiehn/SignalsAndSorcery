import TimeUtils from "../../utils/time-utils";
import MusicTheoryUtils from "../../utils/music-theory-utils";

export default class ArpeggioSequencer {
    constructor(arpTimeline, bpm) {
        if (arpTimeline) {
            this.arpTimeline = arpTimeline.getTimeline()
        }
        this.bpm = bpm
        this.timeUtils = new TimeUtils(bpm)
    }

    getDuration(rate) {
        switch (rate) {
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
        switch (rate) {
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
        switch (rate) {
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

    getPreviewSequence(arp) {
        let sequence = []
        const musicTheoryUtils = new MusicTheoryUtils()

        //check the Rate of the arpeggio
        let noteDuration = this.getDuration(arp.rate)
        let notesInLoop = this.getNumOfNotesInLoop(arp.rate)
        let notesPerChord = this.getNumOfNotesInBar(arp.rate)

        let chordIndex = -1
        let arpPatternToNoteMap = undefined
        let patternIndex = -1
        const arpPatternDegrees = arp.pattern.split('');
        for (let noteIndex = 0; noteIndex < notesInLoop; noteIndex++) {
            if (noteIndex % notesPerChord === 0) {
                chordIndex++
                patternIndex = -1
                arpPatternToNoteMap = musicTheoryUtils.getArpDegreeToChordNoteMap(arp.chords[chordIndex])
            }

            if (patternIndex > arpPatternDegrees.length - 2) {
                patternIndex = 0
            } else {
                patternIndex++
            }

            let sequenceItem = {
                time: (noteIndex * noteDuration),
                note: arpPatternToNoteMap[arpPatternDegrees[patternIndex]],
                synth: arp.synth,
                duration: noteDuration,
            }

            sequence.push(sequenceItem)
        }

        return sequence
    }

    getSequence() {
        let sequence = []
        const musicTheoryUtils = new MusicTheoryUtils()
        for (let i = 0; i < this.arpTimeline.length; i++) {
            let arp = this.arpTimeline[i].arpeggio

            // infer the time until the colIndex
            let timeBeforeArpStart = (this.arpTimeline[i].colIndex) * this.timeUtils.getSecondsPerLoop()

            //check the Rate of the arpeggio
            let noteDuration = this.getDuration(arp.rate)
            let notesInLoop = this.getNumOfNotesInLoop(arp.rate)
            let notesPerChord = this.getNumOfNotesInBar(arp.rate)

            let chordIndex = -1
            let arpPatternToNoteMap = undefined
            let patternIndex = -1
            const arpPatternDegrees = arp.pattern.split('');
            for (let noteIndex = 0; noteIndex < notesInLoop; noteIndex++) {
                if (noteIndex % notesPerChord === 0) {
                    chordIndex++
                    patternIndex = -1
                    arpPatternToNoteMap = musicTheoryUtils.getArpDegreeToChordNoteMap(arp.chords[chordIndex])
                }

                if (patternIndex > arpPatternDegrees.length - 2) {
                    patternIndex = 0
                } else {
                    patternIndex++
                }

                let sequenceItem = {
                    time: timeBeforeArpStart + (noteIndex * noteDuration),
                    note: arpPatternToNoteMap[arpPatternDegrees[patternIndex]],
                    synth: arp.synth,
                    duration: noteDuration,
                }

                sequence.push(sequenceItem)
            }
        }

        return sequence
    }
}