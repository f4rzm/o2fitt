import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import { dimensions } from "../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import PWorkout from "../../res/img/pworkout.svg"

const PersonalWorkoutRow = props =>{
    return(
        <TouchableOpacity 
            style={styles.mainContainer}
            onPress={()=>props.onPress(props.item)}
        >
            <PWorkout
                width={moderateScale(40)}
                height={moderateScale(33) }
                preserveAspectRatio="none"
            />
           <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                {
                    props.item.name
                }
           </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH,
        flexDirection : "row",
        minHeight : 20 ,
        alignItems : "center",
        borderBottomColor : defaultTheme.border,
        borderBottomWidth : 1.2,
        padding : moderateScale(7),
    },
    text : {
        fontSize : moderateScale(15),
        color : defaultTheme.mainText,
        marginStart : moderateScale(18),
        marginVertical : moderateScale(5)
    }
})

export default PersonalWorkoutRow