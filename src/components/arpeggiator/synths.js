

export default class Synths {
    constructor() {
        this.synthA = new Tone.PolySynth(Tone.SimpleAM).toDestination();
        this.synthB = new Tone.DuoSynth().toDestination();
        this.synthC = new Tone.PluckSynth().toDestination();
    }

    getSynth = (synthId) => {

        if(synthId === 'synth_a'){
            return this.synthA
        } else if (synthId === 'synth_b'){
            return this.synthB
        } else {
            return this.synthC
        }
    }
}