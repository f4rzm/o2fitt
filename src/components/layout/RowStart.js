import React from "react"
import {View , StyleSheet } from "react-native"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"

const RowStart = props =>{
    return(
        <View 
            style={[styles.mainContainer,  props.style]}
        >
           {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH ,
        minHeight : 10,
        paddingHorizontal : moderateScale(8),
        marginVertical : moderateScale(8),
        flexDirection : "row",
        justifyContent : "flex-start",
        alignItems : "center",
        borderColor : defaultTheme.border
    }
})

export default RowStart