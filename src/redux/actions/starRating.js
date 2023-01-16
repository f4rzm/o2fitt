import types from "../../constants/actionTypes"

export const setStarRatingTimer = (time) => {
    return {
        type: types.SET_STAR_RATING_TIMER,
        payload: time
    }
}
export const isSetRating = (bool) => {
    return {
        type: types.SET_IS_SEND_RATING,
        payload: bool
    }
}
export const setVipTimer = (time) => {
    return {
        type: types.SET_VIP_TIMER,
        payload: time
    }
}
export const vipShown = (bool) => {
    return {
        type: types.SET_VIP_SHOWN,
        payload: bool
    }
}