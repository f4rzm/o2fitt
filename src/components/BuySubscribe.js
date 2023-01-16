import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";

const BuySubscribe = props =>{
     
    return(
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                    مشترک اکسیژن شو
                    </Text>
                    <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                    راحـت تــر فیـت شــو
                    </Text>
                </View>
                <Image
                    source={require("../../res/img/lock.png")}
                    style={styles.star}
                    resizeMode="contain"
                />

                <ConfirmButton
                    lang={props.lang}
                    title="خرید اشتراک"
                    style={styles.button}
                    textStyle={styles.buttonText}
                    rightImage={require("../../res/img/next.png")}
                    imageStyle={styles.imageStyle}
                    onPress={props.onPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       height : 90,
       width : "95%",
       justifyContent : "flex-end",
       alignItems : "center",
    },
    container : {
        height : 70,
        flexDirection : "row",
        width : "100%",
        justifyContent : "space-between",
        alignItems : "center",
        backgroundColor : defaultTheme.primaryColor,
        borderWidth : 1.5,
        borderColor : defaultTheme.border,
        borderRadius : 10,
        overflow : "visible"
    },
    container2 : {
        height : "100%",
        justifyContent : "space-evenly",
        alignItems : "center",
        margin : 15
    },
    star : {
        width : 90  ,
        height : 90,
        alignSelf : "flex-end"
    },
    text : {
        color : defaultTheme.lightText,
        fontSize : 13
    },
    button  :{
       width : 100,
       height : 30,
       backgroundColor : defaultTheme.lightBackground,
       marginRight : 10
    },
    buttonText : {
        color : defaultTheme.gray,
        fontSize : 12
    },
    imageStyle : {
        tintColor : defaultTheme.gray,
        width : 15,
        height : 15
    }

})

export default memo(BuySubscribe)