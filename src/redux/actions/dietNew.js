import actions from "../../constants/actionTypes"

export const setIsBuy = (data) => {
    return {
        type: actions.SET_ISBUY,
        payload: data
    }
}
export const setIsActive = (isActive) => {
    return {
        type: actions.SET_IS_ACTIVE,
        payload: isActive
    }
}
export const setAlergy = (data) => {
    return {
        type: actions.SET_ALERGIES,
        payload: data
    }
}
export const addWeekBreakfast = (food, date) => {
    return {
        type: actions.ADD_WEEK_BREAKFAST,
        payload: {
            food: food,
            date: date
        }
    }
}
export const addWeekDinner = (food, date) => {
    return {
        type: actions.ADD_WEEK_DINNER,
        payload: {
            food: food,
            date: date
        }
    }
}
export const addWeekLunch = (food, date) => {
    return {
        type: actions.ADD_WEEK_LUNCH,
        payload: {
            food: food,
            date: date
        }
    }
}
export const addWeekSnack = (food, date) => {
    return {
        type: actions.ADD_WEEK_SNACK,
        payload: {
            food: food,
            date: date
        }
    }
}
export const addAllBreakFasts = (data) => {
    return {
        type: actions.ADD_ALL_BREAKFASTS,
        payload: data
    }
}
export const addAllDinner = (data) => {
    return {
        type: actions.ADD_ALL_DINNER,
        payload: data
    }
}
export const addAllSnack = (data) => {
    return {
        type: actions.ADD_ALL_SNACK,
        payload: data
    }
}
export const addAllLunch = (data) => {
    return {
        type: actions.ADD_ALL_LUNCH,
        payload: data
    }
}
export const clearWeekFoods = () => {
    return {
        type: actions.CLEAR_WEEKFOODS
    }
}
export const exchangeBreakFast = (data, date) => {
    return {
        type: actions.CHANGE_BREAKFAST,
        payload: {
            data: data,
            date: date
        }
    }
}
export const exchangeSnack = (data, generatedId) => {
    console.error("action generted id", generatedId)
    return {
        type: actions.CHANGE_SNACK,
        payload: {
            data: data,
            generatedId: generatedId
        }
    }
}
export const exchangeDinner = (data, date) => {

    return {
        type: actions.CHANGE_DINNER,
        payload: {
            data: data,
            date: date
        }
    }
}
export const exchangeLunch = (data, date) => {
    return {
        type: actions.CHANGE_LUNCH,
        payload: {
            data: data,
            date: date
        }
    }
}
export const changeData = (id, response, data, selectedDate) => {
    return {
        type: actions.CHANGE_BREAKFAST_DATA,
        payload: {
            id: id,
            response: response,
            food: data,
            selectedDate: selectedDate
        }
    }
}
export const changeDinnerData = (id, response, data, selectedDate) => {
    return {
        type: actions.CHANGE_DINNER_DATA,
        payload: {
            id: id,
            response: response,
            food: data,
            selectedDate: selectedDate
        }
    }
}
export const changeLunchData = (id, response, data, selectedDate) => {
    return {
        type: actions.CHANGE_LUNCH_DATA,
        payload: {
            id: id,
            response: response,
            food: data,
            selectedDate: selectedDate
        }
    }
}
export const changeSnackData = (id, response, data, selectedDate, generatedId) => {
    return {
        type: actions.CHANGE_SNACK_DATA,
        payload: {
            id: id,
            response: response,
            food: data,
            selectedDate: selectedDate,
            generatedId: generatedId
        }
    }
}
export const changeBreakfastAte = (selectedDate, isAte) => {
    return {
        type: actions.CHANGE_BREAKFAST_ATE,
        payload: {
            selectedDate: selectedDate,
            isAte: isAte
        }
    }
}
export const changeLunchAte = (selectedDate, isAte) => {
    return {
        type: actions.CHANGE_LUNCH_ATE,
        payload: {
            selectedDate: selectedDate,
            isAte: isAte
        }
    }
}
export const changeDinnerAte = (selectedDate, isAte) => {
    return {
        type: actions.CHANGE_DINNER_ATE,
        payload: {
            selectedDate: selectedDate,
            isAte: isAte
        }
    }
}
export const changeSnackAte = (selectedDate, isAte, id) => {
    return {
        type: actions.CHANGE_SNACK_ATE,
        payload: {
            selectedDate: selectedDate,
            isAte: isAte,
            id: id
        }
    }
}
export const calculatePercent = (percent) => {
    return {
        type: actions.CALCULATE_PERCENT,
        payload: percent
    }
}
export const addCheeteDay = (days) => {
    return {
        type: actions.CHEET_DAY,
        payload: days
    }

}
export const dietStartDate = (date) => {
    return {
        type: actions.DIET_START_DATE,
        payload: date
    }
}
export const saveOldData = (data) => {
    return {
        type: actions.SAVE_OLD_DATA,
        payload: data
    }
}
export const isForceUpdate = isForce => {
    return {
        type: actions.IS_FORCE_UPDATE,
        isForce,
    };
};

export const setDietActivation = (isActive) => {
    return {
        type: actions.SET_DIET_PLAN,
        isActive: isActive
    }
}

export const setActivaitonAndDeativation = (isActive) => {
    return {
        type: actions.SET_DIETE_ACTIVATION,
        isActive: isActive
    }
}

export const setDietMeal = (data) => {
    return {
        type: actions.SET_DIET_MEAL,
        data: data
    }
}
export const clearDiet = () => {
    return {
        type: actions.CLEAR_DIET,

    }
}
export const shutDownDiet = () => {
    return {
        type: actions.SHUTDOWN_DIET_PLAN
    }
}
export const setOldDietFalse = () => {
    return {
        type: actions.SET_IS_OLD_DIET
    }
}