import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, ImageBackground} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import LottieView from 'lottie-react-native';

const WelcomeRow = props =>{
    return(
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <LottieView 
                    style={{width : props.item.width}}
                    source={props.item.logo} 
                    autoPlay 
                    loop={props.item.loop}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.title , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    {
                        props.item.title
                    }
                </Text>
                <Text style={[styles.content , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.item.context
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
   container :{
       flex : 1,
       width : dimensions.WINDOW_WIDTH,
       justifyContent : "center",
       alignItems : "center",
   },
   logoContainer : {
       width : dimensions.WINDOW_WIDTH ,
       height : dimensions.WINDOW_WIDTH * .61,
       justifyContent : "center",
       alignItems : "center",
       marginTop : moderateScale(8)
   },
   contentContainer : {
        flex : 1,
        width : dimensions.WINDOW_WIDTH,
        justifyContent : "flex-start",
        alignItems : "center",
        marginTop : moderateScale(50)
    },
    logo:{
        width : dimensions.WINDOW_WIDTH ,
        height : dimensions.WINDOW_WIDTH * .61
    },
    title:{
        fontSize : moderateScale(17),
        color : defaultTheme.darkText,
        marginBottom : moderateScale(20)
    },
    content : {
        fontSize : moderateScale(15),
        width : "90%",
        color:defaultTheme.lightGray2,
        lineHeight : moderateScale(26),
        textAlign : "center",
    }

})

export default memo(WelcomeRow)