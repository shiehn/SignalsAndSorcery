import GridProcessor from "../../processors/grid-processor";
import ArpeggioSequencer from "./arpeggio-sequencer";


export default class ArpeggioRenderer {
    constructor(store) {
        this.store = store
    }

    renderBuffer(renderCompleteCallback, id) {
        const gridProcessor = new GridProcessor(this.store.state.grid)
        const arpData = gridProcessor.extractArpeggioData()
        const sequencer = new ArpeggioSequencer(arpData, this.store.state.getGlobalBpm())
        const sequence = sequencer.getSequence()

        if(!this.store.state.globalBpm){
            // if arpeggio is added to the grid before a clip a bpm must be set
            // defaulting to 120 for now
            this.store.state.globalBpm = 120
        }

        const bpm = this.store.state.globalBpm
        const secondsToRecord = (bpm / 60) * 4 * 4 * 12
        const channels = 2
        const sampleRate = 44100

        const localCtx = this
        Tone.getContext().isOffline = true
        Tone.Offline(function ({transport}) {
            transport.clear()
            //const osc = new Tone.Oscillator().toDestination();
            const bogus = new Tone.PolySynth(Tone.SimpleAM).toDestination();

            for (let i = 0; i < sequence.length; i++) {
                console.log('ADDING NOTE')
                let sequenceItem = sequence[i]
                transport.schedule((time) => {
                    bogus.triggerAttackRelease(sequenceItem.note, sequenceItem.duration, time);
                }, sequenceItem.time);
            }
            transport.start()
        }, secondsToRecord, channels, sampleRate).then(function (buffer) {
            localCtx.store.arpeggioBuffer = buffer
            console.log('ARP BUFFER CREATED', buffer)

            renderCompleteCallback(id)
        })
    }
}