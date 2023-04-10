import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'
import ConfirmButton from './ConfirmButton'
import {openSettings} from 'react-native-send-intent'
import ClockError from '../../res/img/clock_error.svg'
import LottieView from 'lottie-react-native'

export default function TimeZoneError(props) {
    const lang = props.lang
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.crossPressed()}
            style={{ position: "absolute", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, alignItems: "center", justifyContent: "center" }}>
            {/* <BlurView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }} blurType="dark" blurAmount={1}
            /> */}
            <View style={styles.subContainer}>
               
                <ClockError/>
                <Text style={[styles.textHeader, { fontFamily: lang.font }]}>{lang.timeZoneHeader}</Text>
                <Text style={[styles.textDes, { fontFamily: lang.font }]}>{lang.timeZoneDes}</Text>
                <ConfirmButton
                    lang={lang}
                    title={lang.changeTimeSetting}
                    style={{backgroundColor:defaultTheme.green2}}
                    onPress={()=>{
                        openSettings("android.settings.DATE_SETTINGS")
                    }}
                />

            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    textDes: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        textAlign: "center",
        marginVertical: moderateScale(30),
        lineHeight:moderateScale(23),
        
    },
    textHeader: {
        fontSize: moderateScale(20),
        color: defaultTheme.darkText,
        // marginBottom:moderateScale(30)
    },
    subContainer: {
        backgroundColor: defaultTheme.white,
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: moderateScale(10),
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: moderateScale(5),
        borderWidth: 1,
        borderColor: defaultTheme.green,
        height:dimensions.WINDOW_HEIGTH/1.6
    }
})