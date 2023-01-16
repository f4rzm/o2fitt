import React from "react"
import {View , StyleSheet } from "react-native"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"

const ColumnStart = props =>{
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
        width : dimensions.WINDOW_WIDTH,
        minHeight : 10,
        paddingVertical : moderateScale(8),
        marginHorizontal : moderateScale(8),
        alignItems : "flex-start",
    }
})

export default ColumnStart