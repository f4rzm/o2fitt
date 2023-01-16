import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { BlurView } from "@react-native-community/blur";
import TabPlusButton from "../TabPlusButton"
import { ConfirmButton } from ".."

const Helper2 = props =>{
    return(
        <View 
            style={styles.mainContainer}
        >
            <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            />
            <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                {props.lang.doNotWorryForEditInfo_1}
            </Text>
            {/* <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                {parseFloat(props.targetWeight) < parseFloat(props.specification[0].weightSize)? props.lang.doNotWorryForEditInfo_2 : props.lang.doNotWorryForEditInfo_3}
            </Text> */}
            <ConfirmButton
                style={styles.buttonStyle}
                lang={props.lang}
                title={props.lang.ignorAndContinuation}
                rightImage={require("../../../res/img/next.png")}
                onPress={props.onNext}
                isLoading={props.isLoading}
                rotate
            />
            <ConfirmButton
                style={styles.buttonStyle}
                lang={props.lang}
                title={props.lang.back}
                leftImage={require("../../../res/img/back.png")}
                onPress={props.onRequestClose}
                rotate
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        minHeight : dimensions.WINDOW_HEIGTH ,
        alignItems : "center",
        justifyContent : "center"
    },
    text : {
        fontSize : moderateScale(13),
        width : dimensions.WINDOW_WIDTH * 0.85,
        backgroundColor : defaultTheme.lightBackground,
        padding : moderateScale(8),
        paddingVertical : moderateScale(16),
        borderRadius : moderateScale(10),
        marginVertical : moderateScale(10),
        lineHeight : moderateScale(22)
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    buttonStyle : {
        width : dimensions.WINDOW_WIDTH * 0.85,
        borderRadius : 20,
        marginTop : 20
    }
})

export default withModal(Helper2)