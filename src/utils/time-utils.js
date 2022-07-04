
export default class TimeUtils {
    constructor(bpm) {
        this.bpm = bpm
    }

    getSecondsPerSixteenth(beat) {
        return getSecondsPerBeat()/4
    }

    getSecondsPerEighth() {
        return getSecondsPerBeat()/2
    }

    getSecondsPerQuarter() {
        return 60 / this.bpm
    }

    getSecondsPerBar() {
        return this.getSecondsPerBeat() * 4
    }

    getSecondsPerLoop() {
        return this.getSecondsPerBeat() * 16
    }

    numOfQuartersPerLoop() {
        return 16
    }

    numOfEighthsPerLoop() {
        return 32
    }

    numOfSixteenthsPerLoop() {
        return 64
    }

    numOfQuartersPerBar() {
        return 4
    }

    numOfEighthsPerBar() {
        return 8
    }

    numOfSixteenthsPerBar() {
        return 16
    }
}