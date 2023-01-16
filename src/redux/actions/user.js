import types from "../../constants/actionTypes"
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
export const updateUserData = (data) => {
  return {
    type: types.UPDATE_USER_DATA,
    data: data
  }
}

export const setPersonalFood = (data) => {
  return {
    type: types.SET_PERSONAL_FOOD,
    data
  }
}
export const setPackageSale = (data) => {
  return {
    type: types.SET_PACKAGE_SALE,
    data
  }
}
export const updateMessage = (data) => {
  return {
    type: types.UPDATE_MESSAGES,
    data
  }
}
