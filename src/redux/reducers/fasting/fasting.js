import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    isActive: false,
    startDate: "",
    endDate: "",
    fastingDates: [],
    allSnack:[],
    allDinner:[],
    allEftar:[],
    allSahar:[]

}

export const fastingDiet = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case types.SET_FASTING_ACTIVATION:
            return { ...state, isActiveFasting: action.isActive }
        case types.SET_FASTING_SWITCH_CHANGES:
            return { ...state, ...action.data }
        case types.SET_DAILY_FASTING_DAILY_DIET:
            return { ...state, ...action.data }
        case types.CLEAR_FASTING_DIET:
            return { 
                startDate: state.startDate, 
                endDate: state.endDate,
                allDinner:[],
                allEftar:[],
                allSahar:[],
                allSnack:[]
             }
            case types.SHUTDOWN_FASTING_DIET:{
                return{
                    allDinner:[],
                    allSnack:[],
                    allSahar:[],
                    allEftar:[]
                }
            }
        default:
            return state

    }
}