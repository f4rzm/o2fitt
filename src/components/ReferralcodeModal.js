import { View, Text, StyleSheet, Animated, KeyboardAvoidingView } from 'react-native'
import React, { useRef } from 'react'
import { BlurView } from '@react-native-community/blur'
import ConfirmButton from './ConfirmButton'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'
import ReferralCodeSVG from '../../res/img/refferalicon.svg'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'


function ReferralcodeModal(props) {
    const lang = props.lang
    const translateY = useRef(new Animated.Value(0)).current

    const onPressYes = () => {
        Animated.spring(translateY, {
            toValue: -dimensions.WINDOW_HEIGTH * 0.3,
            // toValue: 0,
            duration: 700,
            useNativeDriver: true
        }).start()
    }
    const txtInput = useRef()
    return (
        <KeyboardAvoidingView behavior='height'
            style={{ position: "absolute", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, alignItems: "center", justifyContent: "center" }}>
            <View
                activeOpacity={0.9}
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

                <View style={styles.subContainer}>
                    <View style={{ zIndex: 10, backgroundColor: defaultTheme.white, width: "100%", alignItems: "center", height: "50%", justifyContent: "center" }}>
                        <ReferralCodeSVG />
                    </View>
                    <View style={{ height: dimensions.WINDOW_HEIGTH * 0.3, alignItems: "center", backgroundColor: defaultTheme.white, overflow: "hidden" }}>
                        <Animated.View style={{ height: dimensions.WINDOW_HEIGTH * 0.3, alignItems: "center", transform: [{ translateY: translateY }] }}>
                            <Text style={[styles.textHeader, { fontFamily: lang.font }]}>{lang.referalCodeHeader}</Text>
                            <Text style={[styles.textDes, { fontFamily: lang.font }]}>{lang.referralCodeDes}</Text>
                            <View style={styles.btnContainer}>
                                <ConfirmButton
                                    lang={lang}
                                    title={lang.have}
                                    style={{ backgroundColor: defaultTheme.green, width: dimensions.WINDOW_WIDTH * 0.35 }}
                                    onPress={onPressYes}
                                />
                                <ConfirmButton
                                    lang={lang}
                                    title={lang.dontHave}
                                    style={{ backgroundColor: defaultTheme.white, width: dimensions.WINDOW_WIDTH * 0.35, borderColor: defaultTheme.error, borderWidth: 1 }}
                                    onPress={props.dontHaveCodePressed}
                                    textStyle={{ color: defaultTheme.error }}
                                    
                                />
                            </View>
                            <View style={{ height: dimensions.WINDOW_HEIGTH * 0.31, alignItems: "center", justifyContent: "flex-end" }}>
                                <TouchableOpacity onPress={() => txtInput.current.focus()}>
                                    <TextInput
                                        ref={txtInput}
                                        style={{ width: dimensions.WINDOW_WIDTH * 0.7, borderColor: defaultTheme.border, borderWidth: 1, borderRadius: moderateScale(30), fontFamily: lang.font, fontSize: moderateScale(18), textAlign: "center" }}
                                        placeholder={lang.riferCode}
                                        onChangeText={(text)=>props.onChangeText(text)}
                                        value={props.referralInviter}
                                    />
                                </TouchableOpacity>

                                <View style={{ flexDirection: "row", marginVertical: moderateScale(30) }}>
                                    <TouchableOpacity onPress={() => props.onPressYes()}>
                                        <ConfirmButton
                                            lang={lang}
                                            title={lang.send}
                                            style={{ borderRadius: moderateScale(20), width: dimensions.WINDOW_WIDTH * 0.3 }}

                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => props.dontHaveCodePressed()}>
                                        <ConfirmButton
                                            lang={lang}
                                            title={lang.dontHave}
                                            style={{ borderRadius: moderateScale(20), backgroundColor: defaultTheme.white, borderColor: defaultTheme.error, borderWidth: 1, width: dimensions.WINDOW_WIDTH * 0.3 }}
                                            textStyle={{ color: defaultTheme.error }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </View>




                </View>
            </View >
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    textDes: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        textAlign: "center",
        marginVertical: moderateScale(30),
        lineHeight: moderateScale(23),

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
        height: dimensions.WINDOW_HEIGTH / 1.6,
        overflow: "hidden"
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
})
export default ReferralcodeModal;