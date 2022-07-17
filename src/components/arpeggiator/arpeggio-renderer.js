import GridProcessor from "../../processors/grid-processor";
import ArpeggioSequencer from "./arpeggio-sequencer";
import Synths from "./synths";


export default class ArpeggioRenderer {
    constructor(store) {
        this.store = store
    }

    stopPreview(){
        Tone.Transport.stop()
    }

    preview(chords, rate, synth) {
        if (!chords || !rate || !synth) {
            return
        }

        const sequencer = new ArpeggioSequencer(undefined, this.store.state.getGlobalBpm())
        const sequence = sequencer.getPreviewSequence(chords, rate, synth)

        if (!this.store.state.globalBpm) {
            // if arpeggio is added to the grid before a clip a bpm must be set
            // defaulting to 120 for now
            this.store.state.globalBpm = 120
        }
        
        Tone.Transport.stop()
        Tone.Transport.seconds = 0
        Tone.Transport.cancel(0)
        console.log('PREVIEW', Tone.Transport.seconds)

        const synths = new Synths()

        for (let i = 0; i < sequence.length; i++) {
            let sequenceItem = sequence[i]
            Tone.Transport.schedule((time) => {
                synths.getSynth(sequenceItem.synth).triggerAttackRelease(sequenceItem.note, sequenceItem.duration, time);
            }, sequenceItem.time - Tone.Transport.seconds);
        }
        Tone.Transport.start()
    }

    renderBuffer(renderCompleteCallback, id) {
        const gridProcessor = new GridProcessor(this.store.state.grid)
        const arpData = gridProcessor.extractArpeggioData()
        const sequencer = new ArpeggioSequencer(arpData, this.store.state.getGlobalBpm())
        const sequence = sequencer.getSequence()

        if (!this.store.state.globalBpm) {
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
            transport.cancel(0)

            const synths = new Synths()

            console.log('ADDING NOTES TO SEQUENCE')
            for (let i = 0; i < sequence.length; i++) {
                let sequenceItem = sequence[i]
                transport.schedule((time) => {
                    synths.getSynth(sequenceItem.synth).triggerAttackRelease(sequenceItem.note, sequenceItem.duration, time);
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