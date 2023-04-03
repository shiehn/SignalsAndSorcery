export default class AudioPlayerNode extends AudioWorkletNode {

    constructor(context, channelCount, moduleWasm) {
        super(context, "audio-player-processor", {
            numberOfInputs: 0,
            numberOfOutputs: 2,
            channelCount,
            processorOptions: {
                moduleWasm
            }
        });
    }

    setAudio(audio) {
        this.port.postMessage({audio});
    }
}