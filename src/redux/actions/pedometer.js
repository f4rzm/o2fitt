import actions from "../../constants/actionTypes"

export const increase = () =>{
    return {
        type : actions.INCREMENT_COUNTER
    }
}
export const setAutoCounterZero=()=>{
    return{
        type:actions.SET_COUNTER_ZERO
    }
}
export const setPedometerDate=(date)=>{
    return{
        type:actions.SET_COUNTER_DATE,
        payload:date
    }
}
export const setActiveCounter=(isActive)=>{
    return{
        type:actions.SET_ACTIVATE_COUNTER,
        payload:isActive
    }
}
export const isEdit=(edit)=>{
    return{
        type:actions.SET_IS_EDIT,
        pyload:edit
    }
}
export const setId=(id)=>{
    return{
        type:actions.SET_ID,
        payload:id
    }
}
export const setPedometerCounter=(counter)=>{
    return{
        type:actions.SET_STEP_COUNTER,
        payload:counter
    }
}