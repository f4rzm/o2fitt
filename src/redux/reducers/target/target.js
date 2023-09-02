import { createSlice } from '@reduxjs/toolkit'
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

export const profileSlice = createSlice({
    name: 'profile',
    initialState: INITIAL_STATE,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
    },
})

export const { increment, decrement, incrementByAmount } = profileSlice.actions
export default profileSlice.reducer





