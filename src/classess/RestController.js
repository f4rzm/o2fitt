import axios from "axios"
import { TokenController } from "./TokenController"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from "react-native"


export class RestController {

    checkPrerequisites(method, url, params, header, onSuccess, onFailure, auth, onRefreshSuccess, onRefreshFailure) {

        console.log("RestController -> method => ", method)
        console.log("RestController -> url => ", url)
        console.log("RestController -> params => ", params)
        console.log("RestController -> header => ", header)

        // const TC = new TokenController()
        // if(TC.isTokenValidate(auth)){
        //    switch(method){
        //         case "get":
        //                 this.get(url , header , onSuccess , onFailure)
        //             break

        //         case "post":
        //                 this.post(url , params , header , onSuccess , onFailure)
        //             break              
        //     } 
        // }
        // else{
        //     switch(method){
        //         case "get":
        //                 this.refreshToken(auth , setNewToken , method , url , params , header , onSuccess , onFailure , this.get, onRefreshFailure)
        //             break

        //         case "post": 
        //                this.refreshToken(auth , setNewToken , method , url , params , header , onSuccess , onFailure ,this.post , onRefreshFailure)
        //             break              
        //     } 

        // }

        switch (method) {
            case "get":
                this.get(url, header, onSuccess, onFailure)
                break

            case "post":
                this.post(url, params, header, onSuccess, onFailure)
                break

            case "put":
                this.put(url, params, header, onSuccess, onFailure)
                break

            case "delete":
                this.delete(url, params, header, onSuccess, onFailure)
                break
        }
    }

    get(url, header, onSuccess, onFailure) {
        axios.defaults.timeout = 8000
        axios.get(url, header).then(async (response) => {
            console.log("get => response => ", response)
            await onSuccess(response)
        }).catch(error => {
            console.log("get => error => ", error)
            // if(error.response.status === 401){
            //     AsyncStorage.clear()
            // }
            // Alert.alert(url)
            console.log('request error with params',url)
            onFailure(error)
        })
    }

    post(url, params, header, onSuccess, onFailure) {
        const abort = axios.CancelToken.source()
        const id = setTimeout(
            () => abort.cancel(`Timeout of 5000 ms.`),
            3000
        )

        axios.post(url, params, header).then(response => {
            console.log("post => response -> ", response)
            clearTimeout(id)
            onSuccess(response)
        }).catch(error => {
            clearTimeout(id)
            console.log("post => error code => ", error.response)
            console.log("post => error => ", error)
            // if(error.response && error.response.status === 401){
            //     AsyncStorage.clear()
            // }
            console.log('request error with params post',url,params)
            onFailure(error)
        })
    }

    put(url, params, header, onSuccess, onFailure) {
        const abort = axios.CancelToken.source()
        const id = setTimeout(
            () => abort.cancel(`Timeout of 5000 ms.`),
            5000
        )

        axios.put(url, params, header).then(response => {
            console.log("put => response -> ", response)
            clearTimeout(id)
            onSuccess(response)
        }).catch(error => {
            clearTimeout(id)
            console.log("put => error code => ", error.response)
            console.log("put => error => ", error)
            // if(error.response && error.response.status === 401){
            //     AsyncStorage.clear()
            // }
            // Alert.alert(url)
            console.log('request error with params put',url,params)
            onFailure(error)
        })

    }


    delete(url, params, header, onSuccess, onFailure) {
        axios.delete(url, { data: params, ...header }).then(response => {
            console.log("delete => response -> ", response)
            onSuccess(response)
        }).catch(error => {
            console.log("delete => error code => ", error.response)
            console.log("delete => error => ", error)
            // if(error.response && error.response.status === 401){
            //     AsyncStorage.clear()
            // }
            console.log('request error with params delete',url,params)
            onFailure(error)
        })
    }

    refreshToken(auth, setNewToken, method, url, params, header, onSuccess, onFailure, onRefreshSuccess, onRefreshFailure) {
        console.log("in refreshToken")

        const TC = new TokenController()

        TC.refreshToken(auth, setNewToken, method, url, params, header, onSuccess, onFailure, onRefreshSuccess, onRefreshFailure)
    }
}