import React , {memo} from "react"
import {View , Text , Image , StyleSheet, I18nManager , ScrollView, TouchableOpacity, Platform} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import moment from "moment"
import Glass from "../../res/img/glass.svg";
import { universalStyles } from "../constants/universalStyles"

const WaterCard = props =>{
    // console.log("pppppppppp",props)
    const pkExpireDate=moment(props.profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
    const today=moment()
    const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
    let ow = 0
    hasCredit && props.meals.map(item=>{
        const foodNutrition = typeof(item.foodNutrientValue)==="string"?item.foodNutrientValue.split(","):[...item.foodNutrientValue]
        if(!isNaN(parseFloat(foodNutrition[1]))){
          ow += parseFloat(foodNutrition[1])
        }
    })

    ow/=240

    return(
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onCardPressed}>
           <View style={styles.leftContainer}>
           <Text style={[styles.text , {fontFamily : props.lang.titleFont , marginHorizontal : 16, fontSize : moderateScale(16),}]} allowFontScaling={false}>
            {props.lang.wateCounter}
            </Text>
            <View style={styles.container}>
                <View style={styles.container2}>
                    <TouchableOpacity onPress={props.onPress}>
                        <Image
                            source={require("../../res/img/plus.png")}
                            style={{width : moderateScale(25) , height : moderateScale(25) , tintColor : defaultTheme.gray , marginHorizontal : moderateScale(20)}}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={styles.container3}>
                        <View style={[styles.container4]}>
                            <Text style={[styles.text3 , {fontFamily : props.lang.font ,color : defaultTheme.green}]} allowFontScaling={false}>
                            {(props.water + ow).toFixed(1)}
                            </Text>
                            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                            {props.lang.drinkingWater}
                            </Text>
                        </View>
                        <Text style={[{fontSize : moderateScale(19) , margin : moderateScale(5) ,marginBottom : "15%"}]} allowFontScaling={false}>
                            /
                        </Text>
                        <View style={[styles.container4]}>
                            <Text style={[styles.text3 , {fontFamily : props.lang.font , borderWidth : 0}]} allowFontScaling={false}>
                            {props.hasCredit?Math.min(15.5 , parseFloat((Math.round((parseFloat(props.weightSize) * 41.6150228) * 2 /240)/2).toFixed(1))):8}
                            </Text>
                            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                            {props.lang.dailyTarget}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
           </View>
           <View style={styles.rightContainer}>
            <Glass
                width={moderateScale(55)}
            />
           </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: universalStyles.homeScreenCards,
    rightContainer : {
        flex : 1,
        height : "100%",
        alignItems : "center",
        justifyContent : "center",
    },
    leftContainer : {
        flex : 2.5,
        justifyContent : "space-between",
        alignItems : "flex-start",
    },
    container : {
        flex : 1,
        width : "100%",
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
    },
    container2 : {
        flexDirection : "row",
        width : "100%",
        justifyContent : "space-between",
        alignItems : "center",
    },
    container3 : {
        flex : 1,
        flexDirection : I18nManager.isRTL? "row-reverse" : "row",
        justifyContent : "space-evenly",
        alignItems : "center",
        padding : moderateScale(6),
    },
    container4 : {
        justifyContent : "space-around",
        alignItems : "center",
    },
    text : {
        fontSize : moderateScale(14),
        textAlign : "center",
        color:defaultTheme.darkText
    },
    text2: {
        fontSize : moderateScale(19),
        marginVertical : moderateScale(10),
        textAlign : "center",
        color:defaultTheme.darkText

    },
    text3: {
        fontSize : moderateScale(19),
        marginVertical : 6,
        minWidth : moderateScale(60),
        borderWidth : 1.5,
        borderColor : defaultTheme.border,
        borderRadius : moderateScale(10),
        textAlign : "center",
        paddingVertical : Platform.OS=="ios"?moderateScale(4):0,
        marginRight : moderateScale(5)

    }

})

export default memo(WaterCard)