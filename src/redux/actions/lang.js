import types from "../../constants/actionTypes"
export const setLang = (lang) =>{
    return {
        type : types.SET_LANGUAGE,
        data : lang
    }
}