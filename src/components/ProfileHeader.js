
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';
import allCountries from "../utils/countries"

const ProfileHeader = props => {
    return(
        <View style={styles.conntainer}>
            <View style={styles.imgcontainer}>
                <Image
                    source={props.profile.imageUri?{uri : props.profile.imageUri}:require("../../res/img/logo2.png")}
                    style={styles.img}
                    resizeMode="contain"
                />
            </View>
            <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                {props.profile.fullName}
            </Text>

            <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                {props.user.username}
            </Text>
            {
                props.getImage != null && 
                <TouchableOpacity style={styles.cameraContainer} onPress={props.getImage}>
                    <Image
                        style={styles.cameraImg}
                        source={require("../../res/img/camera.png")}
                        resizeMode="contain"
                    />
                    <Text style={[styles.cameraText,{fontFamily:props.lang.font}]}>
                        {
                            props.lang.addPhoto
                        }
                    </Text>
                </TouchableOpacity>
            }
            {
                props.showBack != null && 
                <TouchableOpacity style={styles.backContainer} onPress={props.onBackPressed}>
                    <Image
                        style={styles.cameraImg}
                        source={require("../../res/img/back.png")}
                        resizeMode="contain"
                        
                    />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    conntainer : {
        backgroundColor : defaultTheme.primaryColor,
        alignItems : "center",
        paddingBottom : moderateScale(20)
    },
    img : {
        width : dimensions.WINDOW_WIDTH * .32,
        height : dimensions.WINDOW_WIDTH * 0.32,
    },
    imgcontainer : {
        width : dimensions.WINDOW_WIDTH * .32,
        height : dimensions.WINDOW_WIDTH * 0.32,
        borderRadius : dimensions.WINDOW_WIDTH * 0.18,
        justifyContent : "center",
        alignItems : "center",
        marginTop:moderateScale(20),
        backgroundColor : "white",
        overflow : "hidden"
    },
    text : {
        fontSize : moderateScale(18),
        color : defaultTheme.lightText,
        marginTop : moderateScale(10)
    },
    cameraContainer :{
      flexDirection : "row",
      position : "absolute",
      left : "2%",
      top : "30%",
      alignItems : "center"
    },
    cameraImg : {
      width : moderateScale(20),
      height  : moderateScale(20),
      marginHorizontal : moderateScale(2),
      transform : [{scaleX : I18nManager.isRTL?-1:1}]
    },
    cameraText : {
      fontSize : moderateScale(14),
      color : defaultTheme.lightBackground
    },
    backContainer : {
        position : "absolute",
        left : "5%",
        top : moderateScale(15),
        alignItems : "center"
    }
})

export default memo(ProfileHeader)