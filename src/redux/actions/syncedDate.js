import types from "../../constants/actionTypes"

export const addDate = (date) => {
    return {
        type: types.ADD_DATE,
        date: date
    }
}