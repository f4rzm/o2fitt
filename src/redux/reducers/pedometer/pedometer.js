import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    id: 0,
    AutoStepsCounter: 0,
    counterDate: "",
    isCounterActive: false,
    isEdit: false
}

export const pedometer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case types.INCREMENT_COUNTER:
            return {
                ...state, AutoStepsCounter: state.AutoStepsCounter + 1
            }
        case types.SET_COUNTER_ZERO:
            return {
                ...state, AutoStepsCounter: 0
            }
        case types.SET_COUNTER_DATE:
            return {
                ...state, counterDate: action.payload
            }
        case types.SET_ACTIVATE_COUNTER:
            return {
                ...state, isCounterActive: action.payload
            }
        case types.SET_IS_EDIT:
            return {
                ...state, isEdit: action.payload
            }
        case types.SET_ID:
            return {
                ...state, id: action.payload
            }
            case types.SET_STEP_COUNTER:{
                return{
                    ...state,AutoStepsCounter:action.payload
                }
            }
        default:
            return state

    }
}