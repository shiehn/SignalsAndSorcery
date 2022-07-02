import {beforeEach, describe, it, expect} from "vitest"
import Scheduler from "./scheduler";

describe('Scheduler Tests', () => {
    const bpm = 60 //one beat per minute
    const secPerBar = 4
    const secPerLoop = 4 * 4
    const totalTrackDuration = secPerLoop * 8 //8 loop track
    let scheduler = undefined

    beforeEach(() => {
        scheduler = new Scheduler(totalTrackDuration, bpm)
    })

    it('should return correct num of seconds in bar', () => {
        expect(scheduler.getLoopLengthFromBarsAndBPM(1)).to.equals(4)
    })

    it('should return correct event times', async () => {
        const barStartTimes = scheduler.getBarStartTimes(4)

        expect(barStartTimes.length).to.equals(8)
        const expected = [0, 16, 32, 48, 64, 80, 96, 112]
        expected.forEach((item) => {
            expect(barStartTimes.includes(item)).to.equals(true)
        })
    })

    it('should dispatch one correct event',  () => {
        let eventA = {
            id: 'a'
        }

        let eventB = {
            id: 'b'
        }

        let eventC = {
            id: 'c'
        }

        let eventD = {
            id: 'd'
        }

        scheduler.addEvent(eventA, {}, 16)
        scheduler.addEvent(eventB, {}, 65)
        scheduler.addEvent(eventC, {}, 96)
        scheduler.addEvent(eventD, {}, 110)

        scheduler.dispatchEvents(96)

        expect(scheduler.scheduledEvents.length).to.equals(1)
    })
})