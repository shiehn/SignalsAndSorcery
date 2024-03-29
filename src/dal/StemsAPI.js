import axios from 'axios'
import MrTapObjWrapper from './mrTapAPI'
import {v4} from "uuid"
import {BASE_API_URL} from "../constants/constants";

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
            const url = BASE_API_URL + 'mrtaps'

            let res = await axios.get(url);

            if (res['data']) {
                let mrtapWrappers = res['data']['mrtaps'].map((d) => {
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
                        if (!stemsAndOptions.options.keys.includes(key.toUpperCase())) {
                            stemsAndOptions.options.keys.push(key.toUpperCase());
                        }
                    })

                    options.chords.forEach((chord) => {
                        if (!stemsAndOptions.options.chords.includes(chord)) {
                            stemsAndOptions.options.chords.push(chord);
                        }
                    })

                    options.types.forEach((type) => {
                        if (!stemsAndOptions.options.types.includes(type.toLowerCase())) {
                            stemsAndOptions.options.types.push(type.toLowerCase());
                        }
                    })
                }

                //GET PERMUTATION STEMS
                let permutationStems = res['data']['permutations']
                stemsAndOptions.stems = [].concat(stemsAndOptions.stems, permutationStems)

                //GET AI GENERATED CONTENT STEMS
                let generatedContentStems = res['data']['generated_content']
                stemsAndOptions.stems = [].concat(stemsAndOptions.stems, generatedContentStems)

                //RANDOMIZE RESULTS TO PREVENT THE SAME CLIPS DISPLAYED FIRST
                stemsAndOptions.stems = this.randomizeArray(stemsAndOptions.stems)

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