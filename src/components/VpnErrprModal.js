import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { universalStyles } from '../constants/universalStyles'
import { BlurView } from '@react-native-community/blur'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import VPN from '../../res/img/VPN.svg'
import ConfirmButton from './ConfirmButton'
import CheckBox from './CheckBox'

const VpnErrprModal = (props) => {
    const [doNotShow, setDoNotShow] = useState(false)
    return (
        // <TouchableOpacity
        //     activeOpacity={1}
        //     onPress={() => props.onDismiss()}
        //     style={{ position: "absolute", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, alignItems: "center", justifyContent: "center" }}>
        //     <BlurView
        //         style={{
        //             position: 'absolute',
        //             top: 0,
        //             left: 0,
        //             right: 0,
        //             bottom: 0,
        //         }} blurType="dark" blurAmount={1}
        //     />
        <View>
            <TouchableOpacity activeOpacity={1} style={styles.subContainer}>
                <VPN
                    width={moderateScale(100)}
                    height={moderateScale(100)}
                />
                <Text style={[styles.textHeader, { fontFamily: props.lang.font }]}>{props.lang.vpnHeader}</Text>
                <Text style={[styles.textDes, { fontFamily: props.lang.font }]}>{props.lang.vpnDes}</Text>
                <CheckBox
                    lang={props.lang}
                    title={props.lang.doNotShowAgain}
                    onPress={() => { setDoNotShow(!doNotShow) }}
                    isSelected={doNotShow}
                    tickStyle={{ tintColor: defaultTheme.primaryColor }}
                    tickContainer={{ borderRadius: moderateScale(5) }}
                />
                <ConfirmButton
                    lang={props.lang}
                    title={props.lang.ok}
                    onPress={() => props.onDismiss(doNotShow)}
                    style={{ marginTop: moderateScale(30) }}
                />

            </TouchableOpacity>
        </View>
        // </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    textDes: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        textAlign: "center",
        marginVertical: moderateScale(30),
        lineHeight: moderateScale(24),

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
        paddingHorizontal: moderateScale(30),
        borderWidth: 1,
        borderColor: defaultTheme.green,
        paddingVertical: moderateScale(40)

    }
})
export default VpnErrprModal
