import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    "access_token" : null,
    "refresh_token": null,
    "token_type": "Bearer",
    "expires_in": 299
}

export const auth = (state = INITIAL_STATE , action) => {
    console.log("auth reducer => action =>" , action)
    switch(action.type){
        case types.SET_AUTH_DATA:
            return{
                ...state , ...action.data
            } 
        
        default : 
            return state
        
    }
}