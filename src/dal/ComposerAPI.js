import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class ComposerAPI {

    async getSavedCompositions(token) {

        try {
            const url = BASE_API_URL + 'compositions/user'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            this.isLoading = true
            let res = await axios.get(url, axiosConfig)

            if (res['data']) {
                return res['data']
                //NOT EVEN SURE
            } else {
                console.log('Error', "Unable to read USERS COMPOSITIONS : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to get USERS COMPOSITIONS : " + e)
        }

        return
    }

    async save(token, saveData) {

        try {
            const url = BASE_API_URL + 'composition'

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Token ' + token,
                }
            };

            this.isLoading = true
            let res = await axios.post('/api/composition', saveData, axiosConfig)

            if (res['data']) {
                console.log('SAVE RESPONSE: ', res['data'])
                //NOT EVEN SURE
            } else {
                console.log('Error', "Unable to read save response: " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to SAVE: " + e)
        }
    }
}