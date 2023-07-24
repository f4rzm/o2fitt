import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'
import moment from 'moment'

const ActiveDietRow = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40) }]}>اطلاعات رژیم</Text>
                <TouchableOpacity
                    onPress={() => {
                        props.onPress()
                    }}
                >
                    <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40), color: defaultTheme.primaryColor }]}>جزییات</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemContainer}>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40) }]}>پیشرفت برنامه </Text>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40) }]}>{props.diet.percent.toFixed(0)}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25), color: defaultTheme.mainText }]}>تعداد روز آزاد</Text>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40) }]}>{2 - props.diet.cheetDays.length} روز</Text>
            </View>
            <View style={[styles.itemContainer, { borderBottomWidth: 0 }]}>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25), color: defaultTheme.mainText }]}>تعداد روز باقی مانده</Text>
                <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40) }]}>{Math.abs(moment().diff(moment(props.diet.endDate), "d"))}</Text>
            </View>
        </View>
    )
}

export default ActiveDietRow

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: moderateScale(15),
        borderColor: defaultTheme.border,

        borderWidth: 1
    },
    itemContainer: {
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: moderateScale(10),
        borderColor: defaultTheme.border,
        paddingVertical: moderateScale(10)
    },
    text2: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        textAlign: "left"
    },
})