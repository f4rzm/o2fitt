import types from "../../../constants/actionTypes"

const INITIAL_STATE = {
    "userId": null,
    "cityId": 0,
    "weightChangeRate": 0,
    "foodHabit": 0,
    "gender": 0,
    "birthDate": "",
    "weightTimeRange": "",
    "targetStep": 0,
    "targetWeight": 0,
    "targetChest": 0,
    "targetArm": 0,
    "targetWaist": 0,
    "targetAbdominal": 0,
    "targetHip": 0,
    "targetShoulder": 0,
    "targetWrist": 0,
    "targetWater": 0,
    "dailyActivityRate": 0,
    "heightSize": "",
    "referreralCount": "",
    "bounsCount": "",
    "firstPay": "",
    "wallet": 0,
    "targetNutrient": "",

}

export const profile = (state = INITIAL_STATE, action) => {
    console.log("profile reducer => action =>", action)
    switch (action.type) {
        case types.UPDATE_PROFILE:
            return {
                ...state, ...action.data
            }
        case types.UPDATE_DATE:
            return {
                ...state,
                pDay:action.data,
            };

        default:
            return state

    }
}