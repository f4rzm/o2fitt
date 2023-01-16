import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import RowStart from "./layout/RowStart";

const SportRowHeader = props =>{
     
    return(
        <RowStart style={[styles.mainContainer , props.style]}>
            <Text style={[styles.title , {fontFamily : props.lang.font}]}>
                {
                    props.title
                }
            </Text>
        </RowStart>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       flexDirection:"row",
       padding : moderateScale(8),
       paddingHorizontal : moderateScale(16),
       marginTop : moderateScale(0),
       borderTopWidth : 1.2,
       backgroundColor:defaultTheme.white
   },
   title:{
       fontSize : moderateScale(16),
       color:defaultTheme.darkText,
       textAlign : "center"
   }

})

export default memo(SportRowHeader)