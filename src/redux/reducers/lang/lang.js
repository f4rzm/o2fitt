import types from "../../../constants/actionTypes"
import {fa} from "../../../utils/langs/persian"
import {en} from "../../../utils/langs/english"
import {ar} from "../../../utils/langs/arabic"

const INITIAL_STATE = {}

export const lang = (state = INITIAL_STATE , action) =>{
    console.log("lang reducer =>action=>",action)
    switch(action.type){
        case types.SET_LANGUAGE :
            let lang = {}
            if(action.data === "en"){
                lang={...en}
            }
            else if(action.data === "ar"){
                lang={...ar}
            }
            else{
                lang={...fa}
            }
            return {...state , ...lang}
       
        default:
            return state
    }
}