
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
        return this.getSecondsPerQuarter() * 4
    }

    getSecondsPerLoop() {
        return this.getSecondsPerQuarter() * 16
    }

    numOfWholesPerLoop() {
        return 4
    }

    numOfHalvesPerLoop() {
        return 8
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

    numOfWholesPerBar() {
        return 1
    }

    numOfHalvesPerBar() {
        return 2
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