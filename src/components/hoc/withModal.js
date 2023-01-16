import React from "react"
import {Modal , View , TouchableWithoutFeedback , StyleSheet} from "react-native"
import {dimensions} from "../../constants/Dimensions"
import {defaultTheme} from "../../constants/theme"
import { moderateScale } from "react-native-size-matters"

export const withModal = WrappedComponent =>{
    return props =>{
        return(
            <Modal
                visible={props.visible}
                onRequestClose={props.onRequestClose}
                animationType="fade"
                transparent
            >
                <TouchableWithoutFeedback onPress={props.outBoardPressed ? props.outBoardPressed : props.onRequestClose}>
                    <View style={[styles.mainContainer]} >
                        <TouchableWithoutFeedback onPress={() => false}>
                            <View style={[styles.container]}>
                                <WrappedComponent
                                    {...props}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }    
}

const styles = StyleSheet.create({
    mainContainer  :{
        width : dimensions.WINDOW_WIDTH,
        height : dimensions.WINDOW_HEIGTH,
        justifyContent : "center",
        alignItems : "center",
  
    },
    container :{
        minWidth : dimensions.WINDOW_WIDTH * 0.7,
        justifyContent : "space-around",
        alignItems : "center",
    }
})