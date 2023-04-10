import actions from "../../constants/actionTypes"

export const setFastingActivation = (isActive) =>{
    return {
        type : actions.SET_FASTING_ACTIVATION,
        isActive : isActive
    }
}

export const setActivaitonAndDeativation=(data)=>{
    return {
        type : actions.SET_FASTING_SWITCH_CHANGES,
        data : data
    }
}

export const setFastingMeal =(data)=>{
    return {
        type : actions.SET_DAILY_FASTING_DAILY_DIET,
        data : data
    }
}
export const clearFastingDiet=()=>{
    return{
        type:actions.CLEAR_FASTING_DIET,
        
    }
}
export const shutDownFastingDiet=()=>{
    return{
        type:actions.SHUTDOWN_FASTING_DIET
    }
}