import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    isActive: false,
    startDate: "",
    allBreakfast: [],
    allLunch: [],
    allSnack: [],
    allDinner: [],
    isOld:true
}

export const dietNew = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case types.SET_DIETE_ACTIVATION:
            return { ...state, isActive: action.isActive }
        case types.SET_DIET_MEAL:
            return { ...state, ...action.data }
        case types.SET_IS_OLD_DIET:
            return { ...state, isOld:false }
        case types.SET_IS_ACTIVE:
            return { ...state, isActive:true }
        case types.CLEAR_DIET:
            return {
                isActive: false,
                startDate: "",
                allBreakfast: [],
                allLunch: [],
                allSnack: [],
                allDinner: [],
                isOld:false
            }
        case types.SHUTDOWN_DIET_PLAN: {
            return {
                isActive: false,
                startDate: "",
                allBreakfast: [],
                allLunch: [],
                allSnack: [],
                allDinner: [],
                isOld:false
            }
        }
        default:
            return state

    }
}