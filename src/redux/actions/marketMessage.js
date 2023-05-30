import types from "../../constants/actionTypes"

export const setMarketMessage = (data) => {
    return {
        type: types.SET_MARKET_MESSAGE,
        payload: data
    }
}