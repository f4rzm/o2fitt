import {PermissionsAndroid} from "react-native"

export class StoragePermissions {
    static request(onSuccess , onFailure){
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(result => {
            if(result === PermissionsAndroid.RESULTS.GRANTED){
                onSuccess()
            }
            else{
                onFailure()
            }
        })
    }
}