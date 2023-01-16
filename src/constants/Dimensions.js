import {Dimensions} from "react-native"
import { moderateScale } from "react-native-size-matters"

const {width , height} = Dimensions.get("window")

export const dimensions = {
    WINDOW_WIDTH : width,
    WINDOW_HEIGTH : height,
    
}