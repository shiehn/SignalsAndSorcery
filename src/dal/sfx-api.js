import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class SFXApi {

    getSFX = async (token) => {
        const url = BASE_API_URL + 'sfx'

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Token ' + token,
            }
        };

        const response = await axios.get(url, axiosConfig);
        return response.data
    }

    getSFXById = async (token, id) => {
        const url = BASE_API_URL + 'sfx?id=' + id

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Token ' + token,
            }
        };

        const response = await axios.get(url, axiosConfig);
        return response.data
    }

    saveSFX = async (token, saveData) => {

        try {
            const url = BASE_API_URL + 'sfx'

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
            console.log('Error', "Unable to SAVE SFX: " + e)
        }

        return false
    }
}