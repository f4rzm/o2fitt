import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { Bar } from 'react-native-progress'

const DietProgresstion = ({ diet, lang, containerStyle, textStyle }) => {
    return (
        <View style={{
            width: dimensions.WINDOW_WIDTH * 0.9, padding: moderateScale(5), alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: 10, elevation: 4, paddingBottom: moderateScale(35), marginTop: moderateScale(20), shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.34,
            shadowRadius: 2.27,
            ...containerStyle
        }}>
            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(15), padding: moderateScale(5), color: defaultTheme.darkText, textAlign: "left", ...textStyle }}> نمودار پیشرفت</Text>
            <Bar
                progress={diet.percent.toFixed(0) * 0.01}
                width={dimensions.WINDOW_WIDTH * 0.85}
                color={defaultTheme.green}
                unfilledColor={defaultTheme.border}
                borderColor={"rgba(0,0,0,0)"}

                height={moderateScale(10)}
                borderRadius={50}
                style={{ transform: [{ rotate: "180deg" }], alignSelf: "center", marginTop: moderateScale(15) }}
                useNativeDriver={true}
            />
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.85, backgroundColor: "red", alignSelf: "center" }}>
                <View style={{ right: `${diet.percent.toFixed(0)}%`, backgroundColor: defaultTheme.green, position: 'absolute', borderRadius: 10, borderTopRightRadius: 0 }}>
                    <Text style={{ color: "white", padding: moderateScale(2) }}>{diet.percent.toFixed(0)}%</Text>
                </View>
            </View>
            {/* <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), padding: moderateScale(5), marginTop: moderateScale(15), color: defaultTheme.darkText }}>28 روز مانده به پایان برنامه غذایی</Text> */}
        </View>
    )
}

export default DietProgresstion

const styles = StyleSheet.create({})