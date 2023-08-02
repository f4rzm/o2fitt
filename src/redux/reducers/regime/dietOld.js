import moment from "moment"
import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    isBuy: false,
    isActive: false,
    foodAlergies: [],
    allFoods: [],
    breakfasts: [],
    dinner: [],
    lunch: [],
    snack: [],
    weekBreafkast: [],
    weekLunch: [],
    weekDinner: [],
    weekSnack: [],
    percent: 0,
    cheetDays: [],
    dietStartDate: "",
    oldData: null,
    isForceUpdate: false
}

export const diet = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case types.SET_ISBUY: {
            return { ...state, isBuy: action.payload }
        }
        case types.SET_IS_ACTIVE: {
            return { ...state, isActive: action.payload }
        }
        case types.SET_ALERGIES: {
            return { ...state, foodAlergies: action.payload }
        }

        case types.ADD_WEEK_BREAKFAST: {
            let tempFood = Object.assign(action.payload.food, { date: action.payload.date, isAte: false })

            return {
                ...state,
                weekBreafkast: [...state.weekBreafkast, tempFood]
            }
        }


        case types.ADD_WEEK_DINNER: {
            let tempFood = Object.assign(action.payload.food, { date: action.payload.date, isAte: false })

            return {
                ...state,
                weekDinner: [...state.weekDinner, tempFood]
            }
        }


        case types.ADD_WEEK_LUNCH: {
            let tempFood = Object.assign(action.payload.food, { date: action.payload.date, isAte: false })

            return {
                ...state,
                weekLunch: [...state.weekLunch, tempFood]
            }
        }
        case types.ADD_WEEK_SNACK: {
            // let tempFood = Object.assign(action.payload.food, { date: action.payload.date, isAte: false, generatedId: Math.floor(Math.random() * 900000000000) })
          
            return {
                ...state,
                weekSnack: [...state.weekSnack, action.payload.food]
            }
        }

        case types.ADD_ALL_BREAKFASTS: {

            return {
                ...state,
                breakfasts: action.payload
            }
        }
        case types.ADD_ALL_DINNER: {

            return {
                ...state,
                dinner: action.payload
            }
        }
        case types.ADD_ALL_LUNCH: {

            return {
                ...state,
                lunch: action.payload
            }
        }
        case types.ADD_ALL_SNACK: {

            return {
                ...state,
                snack: action.payload
            }
        }


        case types.CHANGE_BREAKFAST: {
            let temp = state.weekBreafkast.map(wf => {
                if (wf.date == action.payload.date) {
                    // console.warn("this work 1")
                    return action.payload.data
                } else {
                    // console.warn("this work 2", wf.date, action.payload.date)
                    return wf
                }

            })

            return {
                ...state,
                weekBreafkast: temp
            }
        }

        case types.CHANGE_LUNCH: {
            let temp = state.weekLunch.map(wf => {
                if (wf.date == action.payload.date) {
                    // console.warn("this work 1")
                    return action.payload.data
                } else {
                    // console.warn("this work 2", wf.date, action.payload.date)
                    return wf
                }

            })

            return {
                ...state,
                weekLunch: temp
            }
        }

        case types.CHANGE_DINNER: {
            let temp = state.weekDinner.map(wf => {
                if (wf.date == action.payload.date) {
                    // console.error("this work 1")
                    return action.payload.data
                } else {
                    // console.warn("this work 2", wf.date, action.payload.date)
                    return wf
                }

            })

            return {
                ...state,
                weekDinner: temp
            }
        }
        case types.CHANGE_SNACK: {

            let temp = state.weekSnack.map(snack => {
                console.error("snacks id", snack.generatedId)
                if (snack.generatedId == action.payload.data.generatedId) {
                    console.error("edited");
                    return action.payload.data
                } else {
                    console.error("notEdited");
                    return snack
                }

            })

            return {
                ...state,
                weekSnack: temp
            }
        }

        case types.CHANGE_DINNER_DATA: {
            let tempCard = state.weekDinner.map((item) => {
                if (item.date == action.payload.selectedDate) {
                    return {
                        ...item, isAte: true, dietPackFoods: item.dietPackFoods.map((food) => {
                            if (action.payload.food.foodId == food.foodId) {
                                console.warn("found");
                                return { ...food, serverId: action.payload.response._id }
                            }
                            return food
                        })
                    }
                }
                return item
            })
            // console.warn(state.weekBreafkast);
            // console.warn("this is tempCard", tempCard);
            return {
                ...state,
                weekDinner: tempCard
            }
        }

        case types.CHANGE_LUNCH_DATA: {
            let tempCard = state.weekLunch.map((item) => {
                if (item.date == action.payload.selectedDate) {
                    return {
                        ...item, isAte: true, dietPackFoods: item.dietPackFoods.map((food) => {
                            if (action.payload.food.foodId == food.foodId) {
                                console.warn("found");
                                return { ...food, serverId: action.payload.response._id }
                            }
                            return food
                        })
                    }
                }
                return item
            })
            // console.warn(state.weekBreafkast);
            // console.warn("this is tempCard", tempCard);
            return {
                ...state,
                weekLunch: tempCard
            }
        }
        case types.CHANGE_BREAKFAST_DATA: {

            console.warn(action.payload.selectedDate)
            let tempCard = state.weekBreafkast.map((item) => {
                if (item.date == action.payload.selectedDate) {
                    return {
                        ...item, isAte: true, dietPackFoods: item.dietPackFoods.map((food) => {
                            console.error("serverid", action.payload.response.id, "food", food)
                            if (action.payload.food.foodId == food.foodId) {
                                console.warn("found");
                                return { ...food, serverId: action.payload.response._id }
                            }
                            return food
                        })
                    }
                }
                return item
            })
            return {
                ...state,
                weekBreafkast: tempCard
            }
        }
        case types.CHANGE_SNACK_DATA: {
            console.error();
            let tempCard = state.weekSnack.map((item) => {

                if (item.generatedId == action.payload.generatedId) {
                    // console.error("edited", item.generatedId,action.payload.packageData.generatedId);
                    return {
                        ...item, isAte: true, dietPackFoods: item.dietPackFoods.map((food) => {
                            // console.error("food  ",food,"serverId",action.payload.response.id);
                            if (action.payload.food.foodId == food.foodId) {
                                // console.warn("found");
                                return { ...food, serverId: action.payload.response._id }
                            }
                            return food
                        })
                    }
                }
                return item
            })
            return {
                ...state,
                weekSnack: tempCard
            }
        }


        case types.CHANGE_BREAKFAST_ATE: {
            let tempFood = state.weekBreafkast.map((food) => {
                if (food.date == action.payload.selectedDate) {
                    return { ...food, isAte: action.payload.isAte }
                }
                return food
            })
            return {
                ...state,
                weekBreafkast: tempFood
            }
        }
        case types.CHANGE_LUNCH_ATE: {
            let tempFood = state.weekLunch.map((food) => {
                if (food.date == action.payload.selectedDate) {
                    return { ...food, isAte: action.payload.isAte }
                }
                return food
            })
            return {
                ...state,
                weekLunch: tempFood
            }
        }
        case types.CHANGE_DINNER_ATE: {
            let tempFood = state.weekDinner.map((food) => {
                if (food.date == action.payload.selectedDate) {
                    return { ...food, isAte: action.payload.isAte }
                }
                return food
            })
            return {
                ...state,
                weekDinner: tempFood
            }
        }
        case types.CHANGE_SNACK_ATE: {
            let tempFood = state.weekSnack.map((food) => {
                if (food.generatedId == action.payload.id) {
                    return { ...food, isAte: action.payload.isAte }
                }
                return food
            })
            return {
                ...state,
                weekSnack: tempFood
            }
        }

        case types.CALCULATE_PERCENT: {
            return {
                ...state,
                percent: action.payload
            }
        }
        case types.CHEET_DAY: {
            return {
                ...state,
                cheetDays: action.payload
            }
        }
        case types.DIET_START_DATE: {
            return {
                ...state,
                dietStartDate: action.payload
            }
        }
        case types.CLEAR_DIET: {
            return {
                ...state,
                isActive: false,
                foodAlergies: [],
                allFoods: [],
                breakfasts: [],
                dinner: [],
                lunch: [],
                snack: [],
                weekBreafkast: [],
                weekLunch: [],
                weekDinner: [],
                weekSnack: [],
                percent: 0,
                cheetDays: [],
                dietStartDate: ""
            }
        }

        case types.SAVE_OLD_DATA: {
            return {
                ...state,
                oldData: action.payload
            }
        }
        case types.IS_FORCE_UPDATE: {
            return {
                ...state,
                isForceUpdate: action.isForce
            }
        }

        default:
            return state

    }
}