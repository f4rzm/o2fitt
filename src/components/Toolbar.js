import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";

const Toolbar = props =>{
     
    return(
        <View style={[styles.mainContainer , props.style]}>
           <View style={styles.leftContainer}>
               <TouchableOpacity
                    hitSlop={{
                        top:moderateScale(15),
                        bottom : moderateScale(15),
                        left : moderateScale(15),
                        right : moderateScale(15)
                    }}
                    onPress={props.onBack}
                >
                    <Image
                        source={require("../../res/img/back.png")}
                        style={[styles.back,props.iconStyle]}
                        resizeMode="contain"
                    />
               </TouchableOpacity>
           </View>
           <View style={styles.centerContainer}>
               <Text style={[styles.title,{fontFamily : props.lang.font}]}>
                    {props.title}
               </Text>
           </View>
           <View style={styles.rightContainer}>
                {
                    props.rightIcon &&
                        <TouchableOpacity
                                hitSlop={{
                                    top:moderateScale(15),
                                    bottom : moderateScale(15),
                                    left : moderateScale(15),
                                    right : moderateScale(15)
                                }}
                                onPress={props.onRightIconPressed}
                            >
                                <Image
                                    source={props.rightIcon}
                                    style={[styles.back,props.rightIconStyle]}
                                    resizeMode="contain"
                                />
                        </TouchableOpacity>
                    
                }
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       flexDirection : "row",
       height : moderateScale(50),
       width : dimensions.WINDOW_WIDTH,
       justifyContent : "space-between",
       alignItems : "center",
       backgroundColor : defaultTheme.primaryColor
    },
    leftContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
    },
    centerContainer : {
        flex : 3,
        justifyContent : "center",
        alignItems : "center",
        
    },
    rightContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",

    },
    title : {
        fontSize : moderateScale(17),
        color : defaultTheme.lightText
    },
    back : {
        width : moderateScale(25),
        height : moderateScale(18),
        transform : [{scaleX : I18nManager.isRTL?-1:1}]
    }

})

export default memo(Toolbar)