import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import ConfirmButton from '../ConfirmButton'
import AnimatedLottieView from 'lottie-react-native'

const UpdateModal = ({ item, lang, crossPressed }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => item.isForced == false ? crossPressed() : null}
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
            <View style={{ backgroundColor: defaultTheme.white, width: dimensions.WINDOW_WIDTH * 0.9, borderRadius: moderateScale(10), alignItems: "center", justifyContent: "center", padding: moderateScale(5), borderWidth: 1, borderColor: defaultTheme.green, top: moderateScale(-40) }}>
                <Text style={styles.headerText}>
                    header
                </Text>
                <AnimatedLottieView
                    source={require('../../../res/animations/forceU.json')}
                    style={{ width: moderateScale(300), height: moderateScale(300) }}
                    autoPlay={true}
                    loop={true}
                />

                <Text style={styles.descriptionText}>
                    {item.description[lang.langName]}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    {
                        item.isForced == false ?
                            <ConfirmButton
                                lang={lang}
                                onPress={() => crossPressed()}
                                style={{ marginVertical: moderateScale(20), width: dimensions.WINDOW_WIDTH * 0.3 }}
                                title={lang.close}
                            /> : null
                    }
                    <ConfirmButton
                        lang={lang}
                        onPress={() => {
                            Linking.openURL(item.link)
                        }}
                        style={{ marginVertical: moderateScale(20), width: dimensions.WINDOW_WIDTH * 0.45, backgroundColor: defaultTheme.green }}
                        title={lang.forceUpdateBtn}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default UpdateModal

const styles = StyleSheet.create({
    headerText: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(17),
        marginVertical: moderateScale(20)
    },
    descriptionText: {
        fontSize: moderateScale(15)
    }
})