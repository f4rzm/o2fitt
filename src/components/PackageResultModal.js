import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { defaultTheme } from '../constants/theme'
import { dimensions } from '../constants/Dimensions'
import { BlurView } from '@react-native-community/blur'
import AnimatedLottieView from 'lottie-react-native'
import { moderateScale } from 'react-native-size-matters'
import PayCheck from '../../res/img/paycheck.svg'
import PayCross from '../../res/img/payCross.svg'
import ConfirmButton from './ConfirmButton'

export default function PackageResultModal(props) {
    const lang = props.lang
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => props.closePressed()}
            style={{ position: "absolute", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, alignItems: "center", justifyContent: "center" }}>
            <BlurView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }} blurType="dark" blurAmount={1}
            />
            <View style={{ backgroundColor: defaultTheme.white, width: dimensions.WINDOW_WIDTH * 0.8, alignItems: "center", borderRadius: moderateScale(10), paddingVertical: moderateScale(40) }}>
                {/* <AnimatedLottieView
                source={props.trackingCode ? require('../../res/animations/payment_success.json') : require('../../res/animations/payment_faild.json')}
                style={{ width: dimensions.WINDOW_WIDTH * 0.3, height: dimensions.WINDOW_HEIGTH * 0.3 }}
                    autoPlay={true}
                    loop={true}
                /> */}
                {
                    props.trackingCode ?
                        <PayCheck width={dimensions.WINDOW_WIDTH * 0.25} height={dimensions.WINDOW_HEIGTH * 0.15} />
                        :
                        <PayCross fill={defaultTheme.error} width={dimensions.WINDOW_WIDTH * 0.3} height={dimensions.WINDOW_HEIGTH * 0.15} />
                }
                <Text
                    style={[
                        styles.text,
                        { fontFamily: lang.titleFont }
                    ]}
                    allowFontScaling={false}
                >
                    {
                        props.trackingCode ? lang.tanksToBuy : lang.ohhhh
                    }
                </Text>
                <Text style={[styles.text, { fontFamily: lang.font, color: props.trackingCode ? defaultTheme.green : defaultTheme.error }]} allowFontScaling={false}>
                    {
                        props.trackingCode ? lang.isSuccessFullBuyPakage : lang.unSuccessPaymentBanck
                    }
                </Text>
                {props.trackingCode &&
                    <Text
                        style={[
                            styles.text2,
                            { fontFamily: lang.titleFont }
                        ]}
                        allowFontScaling={false}
                    >
                        {
                            lang.traceCode + " : " + props.trackingCode
                        }
                    </Text>
                }
                <View style={{marginTop:moderateScale(20)}}>
                    {
                        props.trackingCode ?
                            <ConfirmButton
                                lang={lang}
                                title={lang.letsGo}
                                style={{ backgroundColor: defaultTheme.green }}
                                onPress={() => {
                                    props.closePressed()
                                }}
                            /> :
                            <ConfirmButton
                                lang={lang}
                                title={lang.ok}
                                style={{ backgroundColor: defaultTheme.white, borderColor: defaultTheme.error, borderWidth: 1 }}
                                onPress={() => {
                                    props.closePressed()
                                }}
                                textStyle={{ color: defaultTheme.error }}
                            />
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        color: defaultTheme.darkGray,
        fontSize: moderateScale(17),
        marginHorizontal: "3%",
        textAlign: "center",
        marginBottom: moderateScale(16)
    },
    text2: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(18),
        marginHorizontal: "3%",
        textAlign: "center",
        marginTop: moderateScale(5)
    }
});