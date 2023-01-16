import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import RowStart from "./layout/RowStart";

const SearchFoodHeader = props =>{
     
    return(
        <TouchableOpacity
            onPress={props.onPress}
            activeOpacity={1}
        >
            <RowStart style={styles.mainContainer}>
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
       backgroundColor : defaultTheme.grayBackground,
       borderTopWidth : 1.2,
       borderBottomWidth : 1.2,
       padding : moderateScale(4),
       paddingHorizontal : moderateScale(16),
       marginVertical : 0
   },
   title:{
       fontSize : moderateScale(15),
       color:defaultTheme.mainText,
       textAlign : "center"
   }

})

export default memo(SearchFoodHeader)