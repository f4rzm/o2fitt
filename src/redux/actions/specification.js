import types from "../../constants/actionTypes"
import {RestController} from "../../classess/RestController"
import { urls } from "../../utils/urls"
import AsyncStorage from '@react-native-async-storage/async-storage'
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import moment from "moment"

PouchDB.plugin(pouchdbSearch)
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' })

export const updateSpecificationLocaly = (data)=>{
    console.log("updateSpecificationLocaly" ,data)
    return {
       type : types.UPDATE_SPECIFICATION,
       data : data
    }
}

export const updateSpecification = (data , auth , app , user , callback=()=>true , callbackFailure=()=>false) =>{
    return (dispatch)=>{

        console.log("updateSpecification",data)
        AsyncStorage.setItem("specification",JSON.stringify(data))

        const url = urls.userBaseUrl + urls.userProfiles + urls.updateUserTrackSpecification + "?userId="+user.id
        const header = {headers : {Authorization : "Bearer " + auth.access_token}}
        let params = {...data,_id : Date.now().toString(),id:0}

        if(!params.insertDate || params.insertDate === ""){
            params = {...params,insertDate : moment().format('YYYY-MM-DDTHH:mm:ss')}
        }
      
        if(app.networkConnectivity){
            const RC = new RestController()
            RC.checkPrerequisites("put" , url , params , header , (res)=>onUpdateSpecificationSuccess(res,dispatch,callback) , callbackFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
        }
        else {
        offlineDB.post({
            method : "put",
            type : "specification",
            url : url,
            header : {headers : {Authorization : "Bearer " + auth.access_token}},
            params : params
          }).then(res=>{
            console.log(res)
            saveDB(params,dispatch,callback)
          })
        }
    }
}

const onUpdateSpecificationSuccess = async(response , dispatch,callback=()=>false)=>{
    saveDB(response.data.data , dispatch,callback)
}

export const updateBodyShape = (data , auth , app , user , callback=()=>false)=>{

    return (dispatch)=>{

        console.log("updateSpecification",data)
        AsyncStorage.setItem("specification",JSON.stringify(data))

        const url = urls.userBaseUrl + urls.userProfiles + urls.updateBodyShapes
        const header = {headers : {Authorization : "Bearer " + auth.access_token}}
        const params = {...data,userId : user.id , _id : Date.now().toString(),id:0,insertDate : moment().format('YYYY-MM-DDTHH:mm:ss')}

      
        if(app.networkConnectivity){
            const RC = new RestController()
            RC.checkPrerequisites("put" , url , params , header , (res)=>onupdateBodyShapeSuccess(res,dispatch,callback) , onupdateBodyShapeFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
        }
        else {
          offlineDB.post({
            method : "put",
            type : "specification",
            url : url,
            params : params
          }).then(res=>{
            console.log(res)
            saveDB(params,dispatch)
          })
        }
    }
}

const onupdateBodyShapeSuccess = async(response , dispatch,callback=()=>false)=>{
    saveDB(response.data.data , dispatch,callback)
}

const onupdateBodyShapeFailure = ()=>{

}

const onRefreshTokenSuccess = () =>{

}

const onRefreshTokenFailure = () =>{

}

const saveDB= async (data , dispatch,callback=()=>false)=>{
    const SCDB = new SpecificationDBController()
    console.log(data)
    await SCDB.put([data] , ()=>updateState(dispatch , callback))
}

const updateState = async(dispatch,callback=()=>false)=>{
    const SCDB = new SpecificationDBController()
    const spec= await SCDB.getLastTwo()
    console.log("updateSpecification spec",spec)
    dispatch({
        type : types.UPDATE_SPECIFICATION,
        data : spec
    })

    callback()
}