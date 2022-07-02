import useEventsBus from "../events/eventBus";

export default class Scheduler {

    constructor(totalDuration, bpm) {
        const {emit} = useEventsBus()
        this.emit = emit;
        this.bpm = bpm;
        this.totalDuration = totalDuration;
        this.scheduledEvents = [];
    }

    removePreviousEvents = () => {
    }

    dispatchEvents = (currentTime) => {
        //TODO optimize by keeping events in order of time
        let dropIndex = -1;
        for (let i = 0; i < this.scheduledEvents.length; i++) {
            let event = this.scheduledEvents[i];
            if (event.time <= currentTime) {
                dropIndex = i
            }
        }

        //remove events before the one just fired
        if (dropIndex == -1) {
            return
        }

        this.emit(this.scheduledEvents[dropIndex].eventName, this.scheduledEvents[dropIndex].eventPayload)

        let trimmedEvents = []
        for (let i = 0; i < this.scheduledEvents.length; i++) {
            if (i > dropIndex) {
                trimmedEvents.push(this.scheduledEvents[i])
            }
        }

        this.scheduledEvents = trimmedEvents
    }

    getLoopLengthFromBarsAndBPM = (barCount) => {
        let msPerBeatAtBpm = 60000 / this.bpm;
        let totalBeats = 4 * barCount;
        return msPerBeatAtBpm * totalBeats / 1000
    }

    // if numberOfBars = 4, this function will return an array of all the times 4 bars start over
    getBarStartTimes = (numberOfBars) => {
        let barStartTimes = [];
        let currentTime = 0;
        let breakLoop = false
        while (!breakLoop) {
            if (currentTime < this.totalDuration) {
                barStartTimes.push(currentTime);
                currentTime = currentTime + this.getLoopLengthFromBarsAndBPM(4);
            } else {
                breakLoop = true
            }
        }

        return barStartTimes;
    }

    addEvent = (eventName, eventPayload, time) => {
        this.scheduledEvents.push({
            eventName: eventName,
            eventPayload: eventPayload,
            time: time
        });
    }
}