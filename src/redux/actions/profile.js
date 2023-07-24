import types from "../../constants/actionTypes"
import {RestController} from "../../classess/RestController"
import { urls } from "../../utils/urls"
import AsyncStorage from '@react-native-async-storage/async-storage';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'


PouchDB.plugin(pouchdbSearch)
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' })

export const updateProfileLocaly = (profileData) =>{
  
  AsyncStorage.setItem("profile" , JSON.stringify({...profileData})).catch(()=>alert())

  return {
      type : types.UPDATE_PROFILE,
      data : {
          ...profileData
      }
  }
}

export const updateTarget = (data , auth , app , user , onSuccess , onFailure) =>{
  return dispatch =>{
    const url = urls.userBaseUrl + urls.userProfiles + urls.updateTarget
    const params = {
      ...data,
      _id:Date.now().toString()
    }
    const header = {}
    // console.log("params => " , params)
    if(app.networkConnectivity){
      const RC = new RestController()
      RC.checkPrerequisites(
        "put",
        url,
        params,
        header,
        res => onUpdateTargetSuccess(res , dispatch , onSuccess),
        error => onUpdateTargetFailure(error , onFailure),
        onRefreshTokenSuccess , 
        onRefreshTokenFailure
      )
    }
    else{
      offlineDB.post({
        method : "put",
        type : "profile",
        url : url,
        header : {headers : {Authorization : "Bearer " + auth.access_token}},
        params : params
      }).then(res=>{
        console.log(res)
        dispatch({
          type : types.UPDATE_PROFILE,
          data : data
        })
        AsyncStorage.setItem("profile" , JSON.stringify(params))
        onSuccess()
      })
    }
  }
}


const onUpdateTargetSuccess = (response , dispatch , callback)=>{
  AsyncStorage.setItem("profile" , JSON.stringify(response.data.data))
  dispatch({
    type : types.UPDATE_PROFILE,
    data : response.data.data
  })
  callback()
}

const onUpdateTargetFailure = ()=>{

}

export const updateTargetNutrient = (data , auth , app , user , onSuccess , onFailure) =>{
  return (dispatch)=>{
    const url = urls.userBaseUrl + urls.userProfiles + urls.updateTargetNutrient
    const params = {
      ...data,
      userId : user.id , 
      _id : Date.now().toString(),
    }

    const header = {}
    console.log("params => " , params)
    if(app.networkConnectivity){
      const RC = new RestController()
      RC.checkPrerequisites(
        "put",
        url,
        params,
        header,
        ()=>onUpdateTargetNutrientSuccess(data , onSuccess),
        onUpdateTargetNutrientFailure,
        onRefreshTokenSuccess , 
        onRefreshTokenFailure
      )
    }
    else{
      
      dispatch({
        type : types.UPDATE_PROFILE,
        data : {...params}
      })
      offlineDB.post({
        method : "put",
        type : "profile",
        url : url,
        header : {headers : {Authorization : "Bearer " + auth.access_token}},
        params : params
      }).then(res=>{
        console.log(res)
        dispatch({
          type : types.UPDATE_PROFILE,
          data : data
        })
        AsyncStorage.setItem("profile" , JSON.stringify(data))
        onSuccess()
      })
    }
  }
}

const onUpdateTargetNutrientSuccess = async(data , onSuccess)=>{
   AsyncStorage.setItem("profile" , JSON.stringify({...data}))
   onSuccess(data)
}
  
const onUpdateTargetNutrientFailure = ()=>{

}

export const updateTargetStep =  (data , auth , app , user , onSuccess , onFailure) =>{
  const url = urls.userBaseUrl + urls.userProfiles + urls.register
  const params = {
    ...profile,
    userId : user.id,
    targetStep : targetStep,
    targetWeight : targetWeight,
    weightChangeRate : weightChangeRate.id,
    _id:Date.now().toString()
  }
  const header = {}
  console.log("params => " , params)
  if(app.networkConnectivity){
    const RC = new RestController()
    RC.checkPrerequisites(
      url,
      params,
      header,
      onUpdateTargetStepSuccess,
      onUpdateTargetStepFailure,
      onRefreshTokenSuccess , 
      onRefreshTokenFailure
    )
  }
  else{

  }
}

const onUpdateTargetStepSuccess = async(response)=>{
AsyncStorage.setItem("profile" , JSON.stringify({...response.data.data}))
}

const onUpdateTargetStepFailure = ()=>{

}

export const updateTargetBody = (data , auth , app , user , onSuccess , onFailure) =>{
  return dispatch =>{
    console.log("data",data)
    const url = urls.userBaseUrl + urls.userProfiles + urls.updateBodyShapes
    const params = {
      ...data,
      _id:Date.now().toString()
    }
    const header = {}
    console.log("params => " , params)
    if(app.networkConnectivity){
      const RC = new RestController()
      RC.checkPrerequisites(
        "put",
        url,
        params,
        header,
        res => onUpdateTargetBodySuccess(res , dispatch , onSuccess),
        error => onUpdateTargetBodyFailure(error , onFailure),
        onRefreshTokenSuccess , 
        onRefreshTokenFailure
      )
    }
    else{
      dispatch({
        type : types.UPDATE_PROFILE,
        data : {...params}
      })
      offlineDB.post({
        method : "put",
        type : "profile",
        url : url,
        header : {headers : {Authorization : "Bearer " + auth.access_token}},
        params : params
      }).then(res=>{
        onSuccess()
      })
    }
  }
}

const onUpdateTargetBodySuccess = (response , dispatch , callback)=>{
  AsyncStorage.setItem("profile" , JSON.stringify(response.data.data))
  dispatch({
    type : types.UPDATE_PROFILE,
    data : response.data.data
  })
  callback()
}

const onUpdateTargetBodyFailure = ()=>{

}

const onRefreshTokenSuccess = () =>{

}

const onRefreshTokenFailure = () =>{

}

