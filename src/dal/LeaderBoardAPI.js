import axios from "axios";
import {BASE_API_URL} from "../constants/constants";

export default class LeaderBoardAAPI {

    async getLeaderBoard(token) {
        try {
            const url = BASE_API_URL + 'leaderboard'

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
}

// {
//     "composition_id": 2,
//     "avg_rating": 3,
//     "num_ratings": 6,
//     "author_id": 1,
//     "author_name": "John Doe",
//     "preview_audio_url": "https://sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131.s3.us-west-2.amazonaws.com/00f725fd-c2ac-4a46-8781-fb04ddac9f95.mp3"
// },