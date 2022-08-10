import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class LeaderBoardAAPI {

    async getLeaderBoard(token, page) {
        try {
            const url = BASE_API_URL + 'leaderboard' + '?page=' + String(page ? page : 0);

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
            } else {
                console.log('Error', "Unable to read USERS COMPOSITIONS : " + res['error'])
            }
        } catch (e) {
            console.log('Error', "Unable to get USERS COMPOSITIONS : " + e)
        }

        return
    }
}