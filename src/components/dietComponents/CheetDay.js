import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import CheatDay from '../../../res/img/cheetDay.svg'
import { Switch } from 'react-native-paper'

const CheetDay = ({ isCheetDay, onCheetDayPressed, lang, diet }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(15), padding: moderateScale(5), color: defaultTheme.darkText, paddingHorizontal: moderateScale(10), textAlign: "left" }}>روز آزاد</Text>
            </View>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
                <CheatDay
                    width={moderateScale(50)}
                    height={moderateScale(50)}
                />
                <View style={{ marginHorizontal: moderateScale(40) }}>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>روز آزاد : {isCheetDay == true ? "فعال" : "غیر فعال"}</Text>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>تعداد روز آزاد : {2 - diet.cheetDays.length} روز</Text>
                </View>
                <View style={{}}>
                    <Switch
                        value={isCheetDay}
                        onValueChange={onCheetDayPressed}
                        color={defaultTheme.primaryColor}
                    />
                </View>
            </View>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(13), padding: moderateScale(10), lineHeight: moderateScale(18), color: defaultTheme.mainText, textAlign: "left" }}>
                شما در طول برنامه غذایی 2 روز آزاد دارین و در این 2 روز میتونین به برنامه غذایی عمل نکنین، اگر میخواین امروز روز آزاد باشه دکمه رو فعال کنین
            </Text>
        </View>
    )
}

export default CheetDay

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        padding: moderateScale(5),
        alignSelf: "center",
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: 10,
        elevation: 4,
        marginVertical: moderateScale(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 2.27,
    }
})