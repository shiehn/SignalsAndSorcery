export default class OperableAudioBuffer extends AudioBuffer {
    toArray(shared = false) {
        const supportSAB = typeof SharedArrayBuffer !== "undefined";
        const channelData = [];
        const {numberOfChannels, length} = this;
        for (let i = 0; i < numberOfChannels; i++) {
            if (shared && supportSAB) {
                console.log('supportSAB 1', supportSAB)
                channelData[i] = new Float32Array(new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
                channelData[i].set(this.getChannelData(i));
            } else {
                console.log('supportSAB 2', supportSAB)
                channelData[i] = this.getChannelData(i);
            }
        }
        return channelData;
    }
}