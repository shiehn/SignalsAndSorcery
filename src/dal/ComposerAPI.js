import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class ComposerAPI {

    async generateComposition() {
        try {
            const url = BASE_API_URL + `create/composition/`

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    // 'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.post(url, {}, axiosConfig)

            if (res['data']) {
                return res['data']
            } else {
                console.log('Error', "Unable to generate composition : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to generate composition : " + e)
        }

        return undefined
    }

    async rateComposition(token, compositionId, rating) {

        try {
            const url = BASE_API_URL + `composition/${compositionId}/rating/${rating}/`

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.post(url, {}, axiosConfig)

            return res['status'] === 200
        } catch (e) {
            console.log('Error', "Unable to SAVE: " + e)
        }

        return false
    }

    async getSavedCompositions(token, page) {

        try {
            const url = BASE_API_URL + 'compositions/user' + '?page=' + page

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return res['data']
            } else {
                console.log('Error', "Unable to read USERS COMPOSITIONS : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to get USERS COMPOSITIONS : " + e)
        }

        return undefined
    }

    async getAssetRowAlternative(token, bpm, key, chords, type) {
        try {
            const url = BASE_API_URL + 'stats'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            // if (res['data']) {
            return {
                "type": type,
                stems: [
                    {
                        "id": "empty",
                        "bpm": 164,
                        "chords": "F#M7:F#M7:BM7:BM7",
                        "key": "F#",
                        "type": "mid",
                        "variationId": null,
                        "source": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.wav",
                        "waveform": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.png"
                    }, {
                        "id": "empty",
                        "bpm": 164,
                        "chords": "F#M7:F#M7:BM7:BM7",
                        "key": "F#",
                        "type": "mid",
                        "variationId": null,
                        "source": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.wav",
                        "waveform": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.png"
                    }, {},
                    {
                        "id": "empty",
                        "bpm": 164,
                        "chords": "F#M7:F#M7:BM7:BM7",
                        "key": "F#",
                        "type": "mid",
                        "variationId": null,
                        "source": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.wav",
                        "waveform": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-0-c3f979db-3168-4f4b-b9f7-44b9ee80b2aa.png"
                    }
                ],
            }

            // } else {
            //     console.log('Error', "Unable get an alternative asset : " + res['error'])
            // }
        } catch (e) {
            console.log('Error', "Unable get an alternative asset : " + e)
        }

        return undefined
    }

    async getAssetAlternative(token, bpm, key, chords, type) {

        try {
            const url = BASE_API_URL + 'stats'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            // if (res['data']) {
            return {
                "id": "empty",
                "bpm": 164,
                "chords": "F#M7:F#M7:BM7:BM7",
                "key": "F#",
                "type": "mid",
                "variationId": null,
                "source": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-1-e746d8ce-f36f-492b-b967-46e8436236ce.wav",
                "waveform": "https://sas-user-data.s3.us-west-2.amazonaws.com/sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131/section_one-mid-1-e746d8ce-f36f-492b-b967-46e8436236ce.png"
            }
            // } else {
            //     console.log('Error', "Unable get an alternative asset : " + res['error'])
            // }
        } catch (e) {
            console.log('Error', "Unable get an alternative asset : " + e)
        }

        return undefined
    }

    async getSavedComposition(token, id) {

        try {
            const url = BASE_API_URL + 'composition/' + id + '/'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return res['data']
            } else {
                console.log('Error', "Unable to read USERS COMPOSITIONS : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to get USERS COMPOSITIONS : " + e)
        }

        return undefined
    }


    async deleteComposition(token, id) {

        try {
            const url = BASE_API_URL + `composition/delete/${id}/`

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.delete(url, axiosConfig)

            if (res['data']) {
                return res['data']
            } else {
                console.log('Error', "Unable to delete COMPOSITION: " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to delete COMPOSITION : " + e)
        }

        return undefined
    }

    async exportComposition(token, id) {

        try {
            const url = BASE_API_URL + 'export/composition/' + id

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return res['data']['file']
            } else {
                console.log('Error', "Unable to read USERS COMPOSITIONS : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to get USERS COMPOSITIONS : " + e)
        }

        return false
    }

    async save(token, saveData) {

        try {
            const url = BASE_API_URL + 'composition/'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.post(url, saveData, axiosConfig)

            if (res['data']) {
                console.log('SAVE RESPONSE: ', res['status'])
                console.log('SAVE RES DATA: ', res['data'])
                return res['data']
            } else {
                console.log('Error', "Unable to read save response: " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to SAVE: " + e)
        }

        return false
    }
}