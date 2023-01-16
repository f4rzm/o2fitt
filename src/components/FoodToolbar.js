import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";

const FoodToolbar = props =>{
     
    return(
        <View style={styles.mainContainer}>
           <View style={styles.leftContainer}>
               <TouchableOpacity
                    hitSlop={{
                        top:15,
                        bottom : 15,
                        left : 15,
                        right : 15
                    }}
                    onPress={props.onBack}
                >
                    <Image
                        source={require("../../res/img/back.png")}
                        style={styles.back}
                        resizeMode="contain"
                    />
               </TouchableOpacity>
           </View>
           <View style={styles.centerContainer}>
               <Text style={[styles.title,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {props.title}
               </Text>
           </View>
           <View style={styles.rightContainer}>
                
                <TouchableOpacity
                        hitSlop={{
                            top:15,
                            bottom : 15,
                            left : 15,
                            right : 15
                        }}
                        onPress={props.onConfirm}
                        style={{alignItems :"center"}}
                    >
                        <Image
                            source={require("../../res/img/done.png")}
                            style={styles.done}
                            resizeMode="contain"
                        />
                        <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                            {
                                props.text
                            }
                        </Text>
                </TouchableOpacity>
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
       backgroundColor : defaultTheme.primaryColor,
       zIndex : 1
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
    text : {
        fontSize : moderateScale(14),
        color : defaultTheme.lightText
    },
    done : {
        width : moderateScale(16),
        height : moderateScale(14),
        tintColor : defaultTheme.lightBackground,
    },
    back : {
        width : moderateScale(25),
        height : moderateScale(18),
        transform : [{scaleX : I18nManager.isRTL?-1:1}]
    }

})

export default memo(FoodToolbar)