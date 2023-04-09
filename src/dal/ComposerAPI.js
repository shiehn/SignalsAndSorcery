import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class ComposerAPI {

    async generateComposition(bpm, key) {
        try {
            let url = BASE_API_URL + `create/composition/`

            if (bpm && key) {
                url += `?bpm=${bpm}&key=${encodeURIComponent(key)}`
            } else if (bpm) {
                url += `?bpm=${bpm}`
            } else if (key) {
                url += `?key=${encodeURIComponent(key)}`
            }

            let axiosConfig = {
                timeout: 60000,
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
                timeout: 30000,
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

    async getAssetRowAlternative(token, bpm, key, chords, role) {
        try {
            const url = `${BASE_API_URL}compositions/asset/row/alternative/?chords=${encodeURIComponent(chords)}&bpm=${encodeURIComponent(bpm)}&key=${encodeURIComponent(key)}&role=${encodeURIComponent(role)}`

            let axiosConfig = {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data'] && res['data']['stems'] && res['data']['stems'].length == 4) {
                return res['data']
            } else {
                console.log('Error', "Unable get an alternative asset : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable get an alternative asset : " + e)
        }

        return undefined
    }

    async getAssetAlternative(token, bpm, key, chords, role, prevStemId) {

        try {
            const url = `${BASE_API_URL}compositions/asset/alternative/?chords=${encodeURIComponent(chords)}&bpm=${encodeURIComponent(bpm)}&key=${encodeURIComponent(key)}&role=${encodeURIComponent(role)}&prev=${encodeURIComponent(prevStemId)}`

            let axiosConfig = {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data'] && res['data']['stems'] && res['data']['stems'].length > 0) {
                return res['data']['stems'][0]
            } else {
                console.log('Error', "Unable get an alternative asset : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable get an alternative asset : " + e)
        }

        return undefined
    }

    async excludeAsset(token, assetId, assetName) {

        try {
            const url = `${BASE_API_URL}assets/exclude?id=${encodeURIComponent(assetId)}&name=${encodeURIComponent(assetName)}`

            let axiosConfig = {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return 'EXCLUDED: ' + res['data']['excluded_assets']
            } else {
                console.log('Error', "Unable get an alternative asset : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable get an alternative asset : " + e)
        }

        return false
    }

    async evaluateGeneratedAsset(token, assetId, evaluation) {

        const binaryBool = (evaluation === true) ? 1 : 0

        try {
            //api/assets/evaluate/<int:id>/<int:approve>/
            const url = `${BASE_API_URL}assets/evaluate/${encodeURIComponent(assetId)}/${encodeURIComponent(binaryBool)}/`

            let axiosConfig = {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return 'Successfully Evaluated AssetId: ' + assetId
            } else {
                console.log('Error', "Unable evaluate asset : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable evaluate asset : " + e)
        }

        return false
    }

    async getSavedComposition(token, id) {

        try {
            const url = BASE_API_URL + 'composition/' + id + '/'

            let axiosConfig = {
                timeout: 30000,
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
                timeout: 30000,
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
                timeout: 60000,
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
                timeout: 60000,
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