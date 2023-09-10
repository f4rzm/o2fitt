import axios, { AxiosHeaders } from "axios"
import { TokenController } from "./TokenController"
import AsyncStorage from "@react-native-async-storage/async-storage"
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
            case "postWithAbort":
                this.postWithAbort(url, params, header, onSuccess, onFailure)
        }
    }

    get(url, header, onSuccess, onFailure) {

        // const id = setTimeout(
        //   () => abort.cancel('time out 5000'),
        //   5000
        // )  
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const timeout = setTimeout(() => {
            console.warn('cancel');
            source.cancel();
        }, 2000)
        axios.defaults.timeout = 8000
        axios.get(url, header).then(async (response) => {
            console.log("get => response => ", response)
            await onSuccess(response)
            // clearTimeout(timeout)
        }).catch(error => {
            // clearTimeout(timeout)
            console.warn("get => error => ", error.message, url)
            onFailure(error)
            // if(error.response.status === 401){
            //     AsyncStorage.clear()
            // }
            // if (axios.isCancel(error)) {
            //     console.warn('Request canceled', error.message);
            //   } else {
            //     // handle error
            //   }
        })

        // axios({
        //     method: "GET",
        //     baseURL: url,
        //     headers:header,

        //     // timeout: 5000,
        //     // timeoutErrorMessage:"error time out",
        //     // xsrfHeaderName:""
        // }).then(async (response) => {
        //     console.log("get => response => ", response)
        //     await onSuccess(response)
        //     // clearTimeout(timeout)
        // }).catch(error => {
        //     // clearTimeout(timeout)
        //     console.error("get => error => ", error, url)
        //     onFailure(error)
        //     // if(error.response.status === 401){
        //     //     AsyncStorage.clear()
        //     // }
        //     // if (axios.isCancel(error)) {
        //     //     console.warn('Request canceled', error.message);
        //     //   } else {
        //     //     // handle error
        //     //   }
        // })

    }

    post(url, params, header, onSuccess, onFailure) {
        // const abort = axios.CancelToken.source()
        // const id = setTimeout(
        //     () => abort.cancel(`Timeout of 5000 ms.`),
        //     2000
        // )
        axios.defaults.timeout = 8000
        axios.post(url, params, header).then(response => {
            console.log("post => response -> ", response)
            // clearTimeout(id)
            onSuccess(response)
        }).catch(error => {
            onFailure(error)
            // clearTimeout(id)
            console.log("post => error code => ", error.response)
            console.log("post => error => ", error)
            // if(error.response && error.response.status === 401){
            //     AsyncStorage.clear()
            // }
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
            onFailure(error)
        })
    }

    refreshToken(auth, setNewToken, method, url, params, header, onSuccess, onFailure, onRefreshSuccess, onRefreshFailure) {
        console.log("in refreshToken")

        const TC = new TokenController()

        TC.refreshToken(auth, setNewToken, method, url, params, header, onSuccess, onFailure, onRefreshSuccess, onRefreshFailure)
    }
}