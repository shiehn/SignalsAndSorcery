

export default class Synths {
    constructor() {
        this.synthA = new Tone.PolySynth(Tone.SimpleAM).toDestination();
        this.synthB = new Tone.DuoSynth().toDestination();
        this.synthC = new Tone.PluckSynth().toDestination();
    }

    getSynth = (synthId) => {

        if(synthId === 'synth_a'){
            console.log('SYNTH A')
            return this.synthA
        } else if (synthId === 'synth_b'){
            console.log('SYNTH B')
            return this.synthB
        } else {
            console.log('SYNTH C')
            return this.synthC
        }
    }
}