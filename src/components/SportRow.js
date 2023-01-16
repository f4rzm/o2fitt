import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import RowStart from "./layout/RowStart";

const SportRow = props =>{
    return(
        <TouchableOpacity
            onPress={()=>props.onPress()}
            activeOpacity={0.6}
        >
            <RowStart style={styles.mainContainer}>
                
               {props.logo({
                   width:dimensions.WINDOW_WIDTH * 0.13,
                   height:dimensions.WINDOW_WIDTH * 0.13 ,
                   preserveAspectRatio:"none"
               })}
                <Text style={[styles.title , {fontFamily : props.lang.font}]}>
                    {
                        props.title
                    }
                </Text>
            </RowStart>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       padding : moderateScale(6),
       paddingHorizontal : moderateScale(16),
       marginVertical : moderateScale(8)
   },
   logo:{
        width : moderateScale(37),
        height : moderateScale(37),
        marginHorizontal : moderateScale(16)
   },   
   title:{
       fontSize : moderateScale(15),
       color:defaultTheme.darkText,
       textAlign : "center",
       marginStart : moderateScale(20),
       marginVertical : moderateScale(6)
   }

})

export default memo(SportRow)