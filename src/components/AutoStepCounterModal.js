import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../constants/Dimensions'
import { BlurView } from '@react-native-community/blur'
import HealthKit from '../../res/img/healthKit.svg'
import ConfirmButton from './ConfirmButton'

function AutoStepCounterModal(props) {
    const lang = props.lang
    return (
        <TouchableOpacity activeOpacity={1} style={styles.mainContainer}>
            <BlurView blurAmount={0} style={styles.absolute} />

            <View style={styles.subContainer}>
                <HealthKit width={moderateScale(150)} height={moderateScale(60)} />
                <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(18), marginVertical: moderateScale(20) }}>{lang.pedometerAutoCounter}</Text>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), marginVertical: moderateScale(20),textAlign:"left",lineHeight:moderateScale(25) }}>{lang.pedometerPermissionDes}</Text>
                <View style={styles.footerContainer}>
                    <ConfirmButton
                        lang={lang}
                        onPress={() => {
                            props.onAccept()
                        }}
                        title={lang.agree}
                        style={{ backgroundColor: defaultTheme.green, width: dimensions.WINDOW_WIDTH * 0.35 }}
                    />
                    <ConfirmButton
                        lang={lang}
                        onPress={() => {
                            props.onDismiss()
                        }}
                        title={lang.notNow}
                        style={{ backgroundColor: defaultTheme.white, width: dimensions.WINDOW_WIDTH * 0.35, borderWidth: 1, borderColor: defaultTheme.error }}
                        textStyle={{ color: defaultTheme.error }}
                    />
                </View>
            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: "absolute",
        width: dimensions.WINDOW_WIDTH,
        height: dimensions.WINDOW_HEIGTH,
        alignItems: "center",
    },
    subContainer: {
        width: dimensions.WINDOW_WIDTH * 0.85,
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: moderateScale(13),
        paddingVertical: moderateScale(40),
        marginTop: dimensions.WINDOW_HEIGTH / 15,
        alignItems: "center",

    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    }
})
export default AutoStepCounterModal;