import { Platform , PermissionsAndroid} from "react-native"
import Geolocation from 'react-native-geolocation-service';

export class LocationController {
    static async checkPermission(){
        return  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }

    static async requestPermission(){
        return  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }

    static getLocation(onGeoSuccess , onGeoFailure , enableHighAccuracy , showLocationDialog , timeout = 30000){
        console.log("getLocation -> enableHighAccuracy => " , enableHighAccuracy)
        Geolocation.getCurrentPosition(
            onGeoSuccess , 
            onGeoFailure , 
            {
                timeout : timeout , 
                enableHighAccuracy : enableHighAccuracy , 
                showLocationDialog : showLocationDialog , 
                maximumAge : 10000
            }
        )
    }

    static async getCoordinates(isPermissionAsked , onGeoSuccess , onGeoFailure , enableHighAccuracy = false , showLocationDialog = false){
        
        if(Platform.OS === "android"){

            let granted = await LocationController.checkPermission()
            
            console.log("granted => " , granted)
            
            if(!granted && !isPermissionAsked){
                isPermissionAsked = true
                
                granted = await LocationController.requestPermission()

                if(granted === "granted"){
                    LocationController.getLocation(onGeoSuccess , onGeoFailure , enableHighAccuracy , showLocationDialog)
                }
                else{
                    onGeoFailure()
                }
            }
            else if(granted){
               
                LocationController.getLocation(onGeoSuccess , onGeoFailure , enableHighAccuracy , showLocationDialog)
            }
            else{
                onGeoFailure()
            }
        }
        else{
            LocationController.getLocation(onGeoSuccess , onGeoFailure , enableHighAccuracy , showLocationDialog)
        }
    }
}