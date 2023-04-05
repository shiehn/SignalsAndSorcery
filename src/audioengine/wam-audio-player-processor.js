/**
 * Function to get the processor. We need it as it is for later when we will add the processor to the AudioWorklet.
 * We will take the function, stringify it and inject into the AudioWorklet with parameters.
 *
 * @param moduleId
 * @return {MyWamProcessor}
 */

const getProcessor = (moduleId) => {
    /** @type {AudioWorkletGlobalScope} */
    const audioWorkletGlobalScope = globalThis;
    const {registerProcessor} = audioWorkletGlobalScope;
    const PLAYHEAD_COUNT_MAX = 8;
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);

    /**
     * @class
     *
     * Class of our custom processor implementing WAM standard. In this example, the processor doesn't provide any new features
     * and doesn't take advantage of the Web Audio Module SDK. It will be in a later example with plugins and the plugin's parameters.
     */
    class MyWamProcessor extends ModuleScope.WamProcessor {
        static get parameterDescriptors() {
            return [{
                name: "playing",
                minValue: 0,
                maxValue: 1,
                defaultValue: 0
            }, {
                name: "loop",
                minValue: 0,
                maxValue: 1,
                defaultValue: 0
            }];
        }

        /**
         * @param {AudioWorkletNodeOptions} options
         */
        constructor(options) {
            super(options);
            /** @type {Float32Array[]} */
            this.audio = null;
            /** @type {number} */
            this.playhead = 0;
            this.playheadCount = 0;
            /** @param {MessageEvent<{ audio?: Float32Array[]; position?: number }>} e */
            this.port.onmessage = (e) => {
                if (e.data.audio) {
                    this.audio = e.data.audio;
                } else if (typeof e.data.position === "number") {
                    // this.playhead = e.data.position * sampleRate;

                    //console.log('e.data.position', e.data.position)

                    this.playhead = e.data.position
                }
            };
        }

        /**
         * @property {Function} process Renderer of the audio buffer. It consumes the quantum block.
         *
         * @param {Float32Array[][]} inputs
         * @param {Float32Array[][]} outputs
         * @param {Record<string, Float32Array>} parameters
         *
         * @description Default value of the quantum frame is 128.
         */
        process(inputs, outputs, parameters) {
            if (!this.audio) return true;
            const bufferSize = outputs[0][0].length;
            const audioLength = this.audio[0].length;

            // Only one output is used.
            const output = outputs[0];
            for (let i = 0; i < bufferSize; i++) {
                const playing = !!(i < parameters.playing.length ? parameters.playing[i] : parameters.playing[0]);
                const loop = !!(i < parameters.loop.length ? parameters.loop[i] : parameters.loop[0]);
                if (!playing) continue; // Not playing
                if (this.playhead >= audioLength) { // Play was finished
                    if (loop) this.playhead = 0; // Loop just enabled, reset playhead
                    else continue; // EOF without loop
                }
                const channelCount = Math.min(this.audio.length, output.length);
                for (let channel = 0; channel < channelCount; channel++) {
                    output[channel][i] = this.audio[channel][this.playhead];
                }
                this.playhead++;
            }

            this.playheadCount++;
            if (this.playheadCount >= PLAYHEAD_COUNT_MAX) {

                const playHeadPercent =  Math.round(this.playhead / audioLength * 100);
                this.port.postMessage({playhead: playHeadPercent});
                this.playheadCount = 0;
            }

            return true;
        }
    }

    try {
        registerProcessor(moduleId, MyWamProcessor);
    } catch (error) {
        console.warn(error);
    }
    return MyWamProcessor
}
export default getProcessor;