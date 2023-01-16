import {urls} from "../utils/urls"
import Axios from "axios"
// import qs from "qs"
import actions from "../constants/actionTypes"

const TIME_OUT = 10000

export class TokenController {

    isTokenValidate(token){
        console.log("TokenController -> isTokenValidate")
        let currentTime = new Date()

        console.log("token -> " , token)

        if(token && currentTime < new Date(token.expireTime)){
            return true
        }

        return false
    }

    refreshToken(auth , setNewToken , method , url , params , header , onSuccess , onFailure , onRefreshSuccess , onRefreshFailure , navigation){
        const refreshTokenUrl = urls.tokenUrl
        const refreshTokenHeader = { headers: { "Content-Type": "application/x-www-form-urlendcoded"}}
        const refreshTokenParams = {
            refresh_token : auth.refresh_token ,
            grant_type : "refresh_token"
        }

        const axios = Axios.create()

        axios.defaults.timeout = TIME_OUT

        axios.post(refreshTokenUrl , qs.stringify(refreshTokenParams)  , refreshTokenHeader).then(response => {
            console.log("refreshToken => response -> " , response)

            setNewToken({
                ...response.data ,
                type:actions.SET_TOKEN
            })
            if(method === "post"){
                onRefreshSuccess(url , params , header , onSuccess , onFailure , onRefreshSuccess , onRefreshFailure)
            }
            else{
                onRefreshSuccess(url , header , onSuccess , onFailure , onRefreshSuccess , onRefreshFailure)
            }
            
             
        }).catch(error => {
            console.log("refreshToken => error => " , error.response.status)
            if(error.response.status === 401){
                onRefreshFailure(error ,  navigation)
            }
            else{
                onFailure(error)
            }
        })
        
    }

}