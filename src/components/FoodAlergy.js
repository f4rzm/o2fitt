import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ScrollView, TouchableOpacity, TextInput, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";

const FoodAlergy = props =>{

    return(
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TextInput
                    style={[styles.textStyle , {fontFamily : props.lang.font}]}
                    placeholder={props.lang.wrightYourFood}
                    value={props.name}
                    onChangeText={props.search}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                />
                
              
            </View>
            <View style={styles.bodyContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        props.ingredients.length > 0 &&
                        <View style={styles.subContainer}>
                            {
                                props.ingredients.map(item=>(
                                    <TouchableOpacity style={styles.item} key={item.id.toString()} onPress={()=>props.onIngredientPress(item)}>
                                        <Text style={[styles.text , {fontFamily:props.lang.font}]} allowFontScaling={false}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    }
                    {
                        ((props.newAlergyFood.length>0 || props.oldAlergyFood.length>0) && props.name === "") && 
                        <View style={styles.subContainer}>
                            {
                                props.newAlergyFood.map(item=>(
                                    <View style={styles.item} key={item.id.toString()}>
                                        <Text style={[styles.text , {fontFamily:props.lang.font}]} allowFontScaling={false}>
                                            {item.name}
                                        </Text>
                                    </View>
                                ))
                            }
                            {
                                props.oldAlergyFood.map(item=>(
                                    <View style={styles.item} key={item.id.toString()}>
                                        <TouchableOpacity onPress={()=>props.remove(item)}>
                                            <Image
                                                style={styles.remove}
                                                resizeMode="contain"
                                                source={require("../../res/img/remove.png")}
                                            />
                                        </TouchableOpacity>
                                        <Text style={[styles.text , {fontFamily:props.lang.font}]} allowFontScaling={false}>
                                            {item.name}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                    }
                </ScrollView>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       width : dimensions.WINDOW_WIDTH,
       justifyContent : "center",
       alignItems : "center",
    },
    headerContainer : {
        flexDirection : "row",
        width : dimensions.WINDOW_WIDTH * 0.8,
        height : moderateScale(35),
        borderWidth : 1.2,
        borderColor : defaultTheme.border,
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.lightGrayBackground,
        alignItems : "center",
        justifyContent : "center",
        marginTop : moderateScale(10)
    },
    add : {
        position : "absolute",
        left : I18nManager.isRTL?"5%":"95%",
        width : moderateScale(40),
        height : moderateScale(40),
        borderRadius : moderateScale(20),
        backgroundColor : defaultTheme.green,
        justifyContent : "center",
        alignItems : "center"
    },
    remove : {
        width : moderateScale(18),
        height : moderateScale(18),
        marginHorizontal : moderateScale(8)
    },
    img:{
        width : moderateScale(18),
        height : moderateScale(18),
        tintColor : defaultTheme.lightText
    },
    textStyle : {
        padding : 0,
        width : "70%",
        borderBottomColor: 'transparent',
        textAlign : "center"
    },
    bodyContainer : {
        flexWrap : "wrap",
        paddingTop : moderateScale(18),
        width : dimensions.WINDOW_WIDTH * 0.84,
        minHeight : moderateScale(120),
        maxHeight : dimensions.WINDOW_HEIGTH * 0.5,
        borderWidth : 1.2,
        borderTopWidth : 0,
        borderColor : defaultTheme.border,
        borderRadius : moderateScale(8),
        transform:[
            {
                translateY : -moderateScale(10)
            }
        ]
    },
    subContainer : {
        flexDirection : "row",
        flexWrap : "wrap",
        paddingTop : moderateScale(18),
        width : dimensions.WINDOW_WIDTH * 0.84,
    },
    item : {
        flexDirection : "row",
        height : moderateScale(35),
        padding : moderateScale(6),
        margin : moderateScale(6),
        borderRadius : moderateScale(6),
        justifyContent : "center",
        alignItems : "center",
        backgroundColor : defaultTheme.grayBackground
    },
    text : {
        fontSize : moderateScale(12)
    }

})

export default memo(FoodAlergy)