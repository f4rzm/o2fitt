import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    marketMessages: [],

}

export const profile = (state = INITIAL_STATE, action) => {
    console.log("profile reducer => action =>", action)
    switch (action.type) {
        case types.SET_MARKET_MESSAGE:
            return {
                ...state, ...action.data
            }
        
        default:
            return state

    }
}