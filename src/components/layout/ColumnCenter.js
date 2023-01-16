import React from "react"
import {View , StyleSheet } from "react-native"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"

const ColumnCenter = props =>{
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
        minHeight : 10,
        paddingHorizontal : moderateScale(8),
        marginVertical : moderateScale(8),
        justifyContent : "center",
        alignItems : "center",
    }
})

export default ColumnCenter