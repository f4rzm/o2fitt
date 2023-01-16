import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView, I18nManager, SafeAreaView} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { BlurView } from "@react-native-community/blur";
import Icon from "react-native-vector-icons/Ionicons"

const Helper = props =>{
    const data = [
        {
            title : props.lang.bedRest.split("*")[0],
            context : props.lang.bedRest_description
        },
        {
            title : props.lang.veryLittleActivity.split("*")[0],
            context : props.lang.veryLittleActivity_description
        },
        {
            title : props.lang.littleActivity.split("*")[0],
            context : props.lang.littleActivity_description
        },
        {
            title : props.lang.normalLife.split("*")[0],
            context : props.lang.normalLife_description
        },
        {
            title : props.lang.relativelyActivity.split("*")[0],
            context : props.lang.relativelyActivity_description
        },
        {
            title : props.lang.veryActivity.split("*")[0],
            context : props.lang.veryActivity_description
        },
        {
            title : props.lang.moreActivity.split("*")[0],
            context : props.lang.moreActivity_description
        }
    ]
    return(
        <SafeAreaView
            style={styles.mainContainer}
        >
            <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
            />
            <ScrollView style={{flex : 1}}>
                <View style={styles.header}>
                    <Icon
                        name="information-circle-outline"
                        style={{
                            fontSize : moderateScale(22),
                            color : defaultTheme.lightText
                        }}
                    />
                    <Text style={[styles.headerTitle,{fontFamily : props.lang.font,textAlign:"left"}]} allowFontScaling={false}>
                       {props.lang.moreInfoActivity}
                    </Text>
                    <TouchableOpacity
                        hitSlop={{
                            right : 15,
                            left : 15,
                            bottom : 20,
                            top : 10
                        }}
                        onPress={props.onRequestClose}
                    >
                        <Icon
                            name="chevron-back"
                            style={{
                                fontSize : 25,
                                color : defaultTheme.lightText,
                                transform : [
                                    {
                                        scaleX : I18nManager.isRTL?1:-1
                                    }
                                ]
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.helperContainer} onPress={()=>false} activeOpacity={1}>
                    {
                        data.map((item,index)=>(
                            <>
                                <Text style={[styles.helperTitle , {fontFamily : props.lang.font,textAlign:"left"}]} allowFontScaling={false}>
                                    {item.title}
                                </Text> 
                                <Text style={[styles.helperContext , {fontFamily : props.lang.font,textAlign:"left"}]} allowFontScaling={false}>
                                    {item.context}
                                </Text>
                            </>
                        ))
                    }
                </TouchableOpacity>
            </ScrollView>            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        minHeight : dimensions.WINDOW_HEIGTH ,
        alignItems : "center"
    },
    container : {
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        minHeight : dimensions.WINDOW_HEIGTH ,
        alignItems : "center"
    },
    header : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        margin : 16,
        marginBottom : 25
    },
    headerTitle : {
        fontSize : moderateScale(16) ,
        marginHorizontal : 8,
        color : defaultTheme.lightText
    },
    plus : {
        marginBottom : 0
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    helperContainer : {
      flex : 1,
      width : dimensions.WINDOW_WIDTH,
    },
    helperTitle : {
      fontSize : moderateScale(18) ,
      width : "100%",
      textAlign : "auto",
      color : defaultTheme.lightText,
      marginHorizontal : 16
    },
    helperContext : {
      fontSize : moderateScale(16) ,
      color : defaultTheme.lightText,
      marginHorizontal : moderateScale(16),
      marginBottom : moderateScale(20),
      lineHeight : moderateScale(25)
    },
})

export default withModal(Helper)