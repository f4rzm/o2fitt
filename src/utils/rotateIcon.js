import { I18nManager } from "react-native"

export const RotateIcon = () => {
    if(I18nManager.isRTL){
        return {transform: [{rotate: '180deg'}]}
    }else{
        return {transform: [{rotate: '0deg'}]}
    }
}