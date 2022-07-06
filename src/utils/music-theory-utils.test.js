import {beforeEach, describe, it, expect} from "vitest"
import {Chord} from "@tonaljs/tonal";
import MusicTheoryUtils from "./music-theory-utils";

describe('Music Theory Utils Tests', () => {

    let musicUtils = undefined

    beforeEach(() => {
        musicUtils = new MusicTheoryUtils()
    })

    //MAJOR CHORDS
    it('should return the correct type & root from natural major', () => {
        expect(musicUtils.getChordTypeAndRoot('C').type).to.equals('M')
        expect(musicUtils.getChordTypeAndRoot('C').root).to.equals('C')

        for(let i = 0; i < musicUtils.getChordNotes('C').length; i++) {
            expect(musicUtils.getChordNotes('C')[i]).to.equals(['C', 'E', 'G'][i])
        }

        expect(musicUtils.getChordTypeAndRoot('CM').type).to.equals('M')
        expect(musicUtils.getChordTypeAndRoot('CM').root).to.equals('C')
    })

    it('should return the correct type & root from sharp major', () => {
        expect(musicUtils.getChordTypeAndRoot('F#').type).to.equals('M')
        expect(musicUtils.getChordTypeAndRoot('F#').root).to.equals('F#')

        for(let i = 0; i < musicUtils.getChordNotes('C').length; i++) {
            expect(musicUtils.getChordNotes('F#')[i]).to.equals(['F#', 'A#', 'C#'][i])
        }
    })

    it('should return the correct type & root from flat major', () => {
        expect(musicUtils.getChordTypeAndRoot('Bb').type).to.equals('M')
        expect(musicUtils.getChordTypeAndRoot('Bb').root).to.equals('Bb')

        for(let i = 0; i < musicUtils.getChordNotes('Bb').length; i++) {
            expect(musicUtils.getChordNotes('Bb')[i]).to.equals(['Bb', 'D', 'F'][i])
        }
    })

    // //MINOR CHORDS
    it('should return the correct type & root from natural minor', () => {
        expect(musicUtils.getChordTypeAndRoot('Gm').type).to.equals('m')
        expect(musicUtils.getChordTypeAndRoot('Gm').root).to.equals('G')
    })

    it('should return the correct type & root from sharp minor', () => {
        expect(musicUtils.getChordTypeAndRoot('G#m').type).to.equals('m')
        expect(musicUtils.getChordTypeAndRoot('G#m').root).to.equals('G#')
    })

    it('should return the correct type & root from flat minor', () => {
        expect(musicUtils.getChordTypeAndRoot('Bbm').type).to.equals('m')
        expect(musicUtils.getChordTypeAndRoot('Bbm').root).to.equals('Bb')
    })

    //MAJOR 7 CHORDS
    it('should return the correct type & root from natural major 7', () => {
        expect(musicUtils.getChordTypeAndRoot('CM7').type).to.equals('M7')
        expect(musicUtils.getChordTypeAndRoot('CM7').root).to.equals('C')

        expect(musicUtils.getChordTypeAndRoot('CM7').type).to.equals('M7')
        expect(musicUtils.getChordTypeAndRoot('CM7').root).to.equals('C')
    })

    it('should return the correct type & root from sharp major 7', () => {
        expect(musicUtils.getChordTypeAndRoot('F#M7').type).to.equals('M7')
        expect(musicUtils.getChordTypeAndRoot('F#M7').root).to.equals('F#')
    })

    it('should return the correct type & root from flat major 7', () => {
        expect(musicUtils.getChordTypeAndRoot('BbM7').type).to.equals('M7')
        expect(musicUtils.getChordTypeAndRoot('BbM7').root).to.equals('Bb')
    })

    // //MINOR CHORDS
    it('should return the correct type & root from natural minor', () => {
        expect(musicUtils.getChordTypeAndRoot('Gm7').type).to.equals('m7')
        expect(musicUtils.getChordTypeAndRoot('Gm7').root).to.equals('G')

        for(let i = 0; i < musicUtils.getChordNotes('Gm7').length; i++) {
            expect(musicUtils.getChordNotes('Gm7')[i]).to.equals(['G', 'Bb', 'D', 'F'][i])
        }
    })

    it('should return the correct type & root from sharp minor 7', () => {
        expect(musicUtils.getChordTypeAndRoot('G#m7').type).to.equals('m7')
        expect(musicUtils.getChordTypeAndRoot('G#m7').root).to.equals('G#')
    })

    it('should return the correct type & root from flat minor 7', () => {
        expect(musicUtils.getChordTypeAndRoot('Bbm7').type).to.equals('m7')
        expect(musicUtils.getChordTypeAndRoot('Bbm7').root).to.equals('Bb')
    })

    // //DOMINANT CHORDS
    it('should return the correct type & root from natural dominant7', () => {
        expect(musicUtils.getChordTypeAndRoot('D7').type).to.equals('7')
        expect(musicUtils.getChordTypeAndRoot('D7').root).to.equals('D')

        for(let i = 0; i < musicUtils.getChordNotes('D7').length; i++) {
            expect(musicUtils.getChordNotes('D7')[i]).to.equals(['D', 'F#', 'A', 'C'][i])
        }
    })

    it('should return the correct type & root from sharp dominant 7', () => {
        expect(musicUtils.getChordTypeAndRoot('G#7').type).to.equals('7')
        expect(musicUtils.getChordTypeAndRoot('G#7').root).to.equals('G#')
    })

    it('should return the correct type & root from flat dominant 7', () => {
        expect(musicUtils.getChordTypeAndRoot('Bb7').type).to.equals('7')
        expect(musicUtils.getChordTypeAndRoot('Bb7').root).to.equals('Bb')
    })

    //M7b5 CHORDS
    it('should return the correct type & root from natural m7b5', () => {
        expect(musicUtils.getChordTypeAndRoot('Cm7b5').type).to.equals('m7b5')
        expect(musicUtils.getChordTypeAndRoot('Cm7b5').root).to.equals('C')
    })

    it('should return the correct type & root from sharp m7b5', () => {
        expect(musicUtils.getChordTypeAndRoot('F#m7b5').type).to.equals('m7b5')
        expect(musicUtils.getChordTypeAndRoot('F#m7b5').root).to.equals('F#')
    })

    it('should return the correct type & root from flat m7b5', () => {
        expect(musicUtils.getChordTypeAndRoot('Bbm7b5').type).to.equals('m7b5')
        expect(musicUtils.getChordTypeAndRoot('Bbm7b5').root).to.equals('Bb')

        for(let i = 0; i < musicUtils.getChordNotes('Bbm7b5').length; i++) {
            expect(musicUtils.getChordNotes('Bbm7b5')[i]).to.equals(['Bb', 'Db', 'Fb', 'Ab'][i])
        }
    })

})