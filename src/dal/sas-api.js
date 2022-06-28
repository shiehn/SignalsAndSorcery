import axios from "axios";

export default class SASApi {

    getLoggedInUser = async (token) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Token ' + token,
            }
        };

        let userName = undefined
        await axios.get('/me', axiosConfig)
            .then((res) => {
                if(res['data'] && res['data']['authenticated']) {
                    userName = res['data']['name']
                }
            })
            .catch((err) => {
               console.log('unable to retrieve user data.', err)
            })

        return userName
    }
}