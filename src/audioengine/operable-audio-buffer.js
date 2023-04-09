export default class OperableAudioBuffer extends AudioBuffer {

    getLoopLengthFromBarsAndBPM(barCount, bpm){
      let msPerBeatAtBpm = 60000 / bpm;
      let totalBeats = 4 * barCount;
      return msPerBeatAtBpm * totalBeats / 1000
    }

    generateEmptyBuffer = (audioCtx, frameCount, sampleRate) => {
      //THIS IS LIKELY SILENCE SO GENERATE AN EMPTY BUFFER
      let emptyBuffer = actx.createBuffer(2, frameCount, sampleRate);
      for (let channel = 0; channel < emptyBuffer.numberOfChannels; channel++) {
        let nowBuffering = emptyBuffer.getChannelData(channel);
        for (let i = 0; i < emptyBuffer.length; i++) {
          nowBuffering[i] = 0;
        }
      }
      return emptyBuffer;
    }

    toArray(shared = false) {
        const supportSAB = typeof SharedArrayBuffer !== "undefined";
        /** @type {Float32Array[]} */
        const channelData = [];
        const {numberOfChannels, length} = this;
        for (let i = 0; i < numberOfChannels; i++) {
            if (shared && supportSAB) {
                channelData[i] = new Float32Array(new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
                channelData[i].set(this.getChannelData(i));
            } else {
                channelData[i] = this.getChannelData(i);
            }
        }
        return channelData;
    }

    toArrayExtended(shared = false, row=0, col=0, audioCtx = undefined, loopBuffer = undefined, bpm = undefined) {

        //const secondsInLoop = getLoopLengthFromBarsAndBPM(4, store.state.getGlobalBpm());
        const secondsInLoop = this.getLoopLengthFromBarsAndBPM(4, bpm);
        const bufferSizePerLoop = Math.round(secondsInLoop * audioCtx.sampleRate);

        //const emptyBuffer = audioCtx.createBuffer(2, bufferSizePerLoop*4, audioCtx.sampleRate);

        const supportSAB = typeof SharedArrayBuffer !== "undefined";
        const channelData = [];
        const {numberOfChannels, length} = this;

        for (let i = 0; i < numberOfChannels; i++) {
            if (shared && supportSAB) {
                channelData[i] = new Float32Array(new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
                channelData[i].set(this.getChannelData(i));
            } else {

                channelData[i] = this.getChannelData(i);

                // if(col === 0) {
                //     for(let j = 0; j < channelData[i].length; j++) {
                //         if(j< bufferSizePerLoop) {
                //             channelData[i][j] = this.getChannelData(i)[j]
                //         }
                //     }
                // } else if(col === 1) {
                    for(let j = 0; j < channelData[i].length; j++) {
                        if(j >= Math.round(bufferSizePerLoop*col) && j < Math.round(bufferSizePerLoop*(col+1))) {
                            const sampleIdx = Math.abs(Math.round(j - (bufferSizePerLoop*col)))
                            if(loopBuffer.getChannelData(i)[sampleIdx]){
                                channelData[i][j] = loopBuffer.getChannelData(i)[sampleIdx]
                            }
                        }
                    }
                // }
            }
        }
        return channelData;
    }
}