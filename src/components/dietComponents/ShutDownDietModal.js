import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ConfirmButton from '../ConfirmButton'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'
import Power from '../../../res/img/power.svg'

const ShutDownDietModal = ({shutownLoading,lang,shutDownWholeDiet,reject}) => {
    return (
        <View style={styles.shutDownContainer}>
            <View style={{ paddingTop: moderateScale(20) }}>
                <Power
                    width={moderateScale(30)}
                    height={moderateScale(30)}
                />
            </View>
            <Text style={[styles.shutDownText, { fontFamily: lang.font, marginTop: moderateScale(20) }]}>{lang.shutDownDietTitle}</Text>
            <Text style={[styles.shutDownText, { fontFamily: lang.font, marginVertical: moderateScale(20) }]}>{lang.shutDownDietText}</Text>
            <Text style={[styles.shutDownText, { fontFamily: lang.font, fontSize: moderateScale(14), marginBottom: moderateScale(30) }]}>{lang.shutDownConfirm}</Text>
            <View style={{ width: "100%", justifyContent: "space-around", flexDirection: "row", marginBottom: moderateScale(25) }}>
                {
                    shutownLoading ? <ActivityIndicator size={"large"} color={defaultTheme.primaryColor} /> :
                        <>
                            <ConfirmButton
                                lang={lang}
                                title={lang.yes}
                                style={{ width: moderateScale(150), borderWidth: 1, borderColor: defaultTheme.error, backgroundColor: defaultTheme.lightBackground, elevation: 2 }}
                                onPress={shutDownWholeDiet}
                                textStyle={{ color: defaultTheme.error, elevation: 2 }}
                            />
                            <ConfirmButton
                                lang={lang}
                                title={lang.no}
                                style={{ backgroundColor: defaultTheme.green, width: moderateScale(150), elevation: 2 }}
                                onPress={reject}
                            />
                        </>
                }
            </View>
        </View>
    )
}

export default ShutDownDietModal

const styles = StyleSheet.create({
    shutDownText: {
        fontSize: moderateScale(18),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    shutDownContainer: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: 15,
        backgroundColor: defaultTheme.lightBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: defaultTheme.primaryColor
    },
})