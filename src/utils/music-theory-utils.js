import {RETURN} from "yarn/lib/cli";
import {Chord} from "@tonaljs/tonal";

export default class MusicTheoryUtils {
    getChordNotes(chord) {
        return Chord.getChord(this.getChordType(chord), this.getChordRoot(chord)).notes
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