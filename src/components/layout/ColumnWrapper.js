import React from "react"
import {View , StyleSheet } from "react-native"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"

const ColumnWrapper = props =>{
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
        paddingVertical : moderateScale(8),
        marginHorizontal : moderateScale(8),
        justifyContent : "flex-start",
        alignItems : "center",
    }
})

export default ColumnWrapper