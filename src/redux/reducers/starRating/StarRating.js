import moment from "moment"
import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    starRatingTimer: moment().add(7, "days").format("YYYY-MM-DDTHH:mm:ss"),
    isRating: false,
    vipTimer: moment().add(3, "days").format("YYYY-MM-DDTHH:mm:ss"),
    vipShown: false

}

export const starRating = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SET_STAR_RATING_TIMER:
            return {
                ...state, starRatingTimer: action.payload
            }
        case types.SET_IS_SEND_RATING:
            return {
                ...state, isRating: action.payload
            }
        case types.SET_VIP_TIMER:
            return {
                ...state, vipTimer: action.payload
            }
        case types.SET_VIP_SHOWN:
            return {
                ...state, vipShown: action.payload
            }

        default:
            return state

    }
}