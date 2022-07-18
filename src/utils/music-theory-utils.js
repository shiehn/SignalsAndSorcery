import {Chord} from "@tonaljs/tonal";

export default class MusicTheoryUtils {
    getChordNotes(chord) {
        return Chord.getChord(this.getChordType(chord), this.getChordRoot(chord)).notes
    }

    isSeventhChord(chord) {
        return chord.toLowerCase().includes('7'.toLowerCase())
    }

    getArpDegreeToChordNoteMap(chord) {
        const notes = this.getChordNotes(chord)

        let chordMap = {}
        if (this.isSeventhChord(chord)) {
            chordMap = {
                1: notes[0] + '4',
                3: notes[1] + '4',
                5: notes[2] + '4',
                7: notes[3] + '4',
                8: notes[0] + '5',
            }
        } else {
            chordMap = {
                1: notes[0] + '4',
                3: notes[1] + '4',
                5: notes[2] + '4',
                7: notes[0] + '5',
                8: notes[0] + '5',
            }
        }

        return chordMap
    }

    getChordTypeAndRoot(chord) {
        return {
            root: this.getChordRoot(chord),
            type: this.getChordType(chord),
        }
    }

    getChordType(chord) {
        if (Chord.tokenize(chord)[1] === '') {
            return 'M'
        } else {
            return Chord.tokenize(chord)[1]
        }
    }

    getChordRoot(chord) {
        return Chord.tokenize(chord)[0]
    }
}