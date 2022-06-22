import axios from 'axios'
import MrTapObjWrapper from './mrTapAPI'
import {v4} from "uuid"

export class StemsAPI {

    randomizeArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array
    }

    async getStemsAndOptions() {

        let stemsAndOptions = {
            'stems': [],
            'options': {
                'bpms': [],
                'keys': [],
                'chords': [],
                'types': [],
            }
        }

        try {
            //const url = 'http://localhost:8000/api/mrtaps'
            const url = 'https://signalsandsorcery.org/api/mrtaps'

            let res = await axios.get(url);

            if (res['data']) {
                let mrtapWrappers = res['data']['mrtaps'].map((d) => {
                    return new MrTapObjWrapper(d)
                })

                //RANDOMIZE RESULTS TO PREVENT THE SAME CLIPS DISPLAYED FIRST
                mrtapWrappers = this.randomizeArray(mrtapWrappers)

                for (let i = 0; i < mrtapWrappers.length; i++) {
                    let stems = mrtapWrappers[i].flattenStems(v4)
                    stemsAndOptions.stems = [].concat(stemsAndOptions.stems, stems)

                    let options = mrtapWrappers[i].getOptions()

                    options.bpms.forEach((bpm) => {
                        if (!stemsAndOptions.options.bpms.includes(bpm)) {
                            stemsAndOptions.options.bpms.push(bpm);
                        }
                    })

                    options.keys.forEach((key) => {
                        if (!stemsAndOptions.options.keys.includes(key.toLowerCase())) {
                            stemsAndOptions.options.keys.push(key.toLowerCase());
                        }
                    })

                    options.chords.forEach((chord) => {
                        if (!stemsAndOptions.options.chords.includes(chord.toLowerCase())) {
                            stemsAndOptions.options.chords.push(chord.toLowerCase());
                        }
                    })

                    options.types.forEach((type) => {
                        if (!stemsAndOptions.options.types.includes(type.toLowerCase())) {
                            stemsAndOptions.options.types.push(type.toLowerCase());
                        }
                    })
                }


                //CREATE STEMS FROM FILLS
                //CREATE STEMS FROM FILLS
                //CREATE STEMS FROM FILLS
                let fills = []
                for (let stemIndex = 0; stemIndex < res['data']['fills'].length; stemIndex++) {
                    let fill = res['data']['fills'][stemIndex]
                    const bpm = fill['bpm']
                    for (let i = 0; i < fill['sources'].length; i++) {
                        let fillStem = {
                            id: v4(),
                            bpm: bpm,
                            chords: "fill",
                            key: "all",
                            source: fill['sources'][i]['mp3'],
                            type: "fill",
                            waveform: "https://sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131.s3.us-west-2.amazonaws.com/section_three-mid-1-880d70fe-2714-4fcf-b284-aa4410916454.png"
                        }

                        fills.push(fillStem)
                    }
                }

                const randFills = this.randomizeArray(fills)
                randFills.forEach((fill) => {
                    stemsAndOptions['stems'].push(fill)
                })



                //CREATE STEMS FROM FILLS
                //CREATE STEMS FROM FILLS

                return stemsAndOptions
            } else {
                console.log('Error', "Unable to load mrtap src from /api/mrtaps: " + res['error'])
                return [undefined, undefined]
            }
        } catch (e) {
            console.log('Error', "Unable to load mrtap src from /api/mrtaps: " + e)
            return [undefined, undefined]
        }


    }
}