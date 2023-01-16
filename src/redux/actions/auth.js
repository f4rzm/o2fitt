import actions from "../../constants/actionTypes"

export const setAuthData = (data) =>{
    return {
        type : actions.SET_AUTH_DATA,
        data : data
    }
}
