import {urls} from "../utils/urls"
// import qs from "qs"
import {RestController} from "../classess/RestController"

export class Login {
    static sendMobileNumber(mobile , deviceId , discountCode , onSuccess, onFailure){

        const url = urls.apiUrl + urls.user + urls.getRegisterCode +`?mobileNumber=${mobile}&deviceId=${deviceId}&discountCode=${discountCode}`

        const params = {
            "mobileNumber": mobile,
            "deviceCode": DeviceInfo.getUniqueID().toString()
        }
        
        console.log("url => " , url)

        const RC = new RestController()
        RC.get(url , {} , onSuccess , onFailure)
    }

    static sendCodeNumber(mobile , code , deviceId , onSuccess , onFailure){
        const url = urls.tokenUrl 

        const params = {
            username : mobile,
            password : code,
            grant_type : "password"
        }

        const header = { headers: { "Content-Type": "application/x-www-form-urlendcoded" , "deviceId" : deviceId}}

        const RC = new RestController()
        RC.post(url , qs.stringify(params) , header , onSuccess , onFailure)
    } 
}