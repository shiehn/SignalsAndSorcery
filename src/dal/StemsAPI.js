import axios from 'axios'
import MrTapObjWrapper from './mrTapAPI'
import {v4} from "uuid"

export class StemsAPI {

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
            const url = 'http://localhost:8000/api/mrtaps'
            // const url = 'https://signalsandsorcery.org/api/mrtaps'

            let res = await axios.get(url);

            console.log('what the fuck')

            if (res['data']) {
                console.log('here')

                const mrtapWrappers = res['data']['mrtaps'].map((d) => {
                    return new MrTapObjWrapper(d)
                })

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