import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, I18nManager } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from "moment-jalaali"
import { dimensions } from "../constants/Dimensions";
import Power from '../../res/img/power.svg'

const FastingCalendar = props => {
    const dietExpiredDate = moment().diff(moment(props.profile.pkExpireDate), "d")

    // console.error(Math.abs(parseInt(dietExpiredDate)))
    const fastingDiet = props.fastingDiet

    let nextIsEnabled = false
    let prevIsEnabled = true
    if (moment(props.selectedDate, "YYYY-MM-DD").diff(moment(), "days") < 10) {
        if (moment(props.selectedDate, "YYYY-MM-DD").diff(moment(), "days") <= Math.abs(parseInt(dietExpiredDate))) {
            nextIsEnabled = true
        }
    }
    if (moment(props.selectedDate).isBefore(fastingDiet.dietStartDate)) {
        prevIsEnabled = false
    }

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                style={{ marginHorizontal: moderateScale(15) }}
                hitSlop={{
                    top: moderateScale(10),
                    bottom: moderateScale(10),
                    left: moderateScale(10),
                    right: moderateScale(10)
                }}
                onPress={props.onBack}
            // disabled={props.disabled}
            >
                <Image
                    source={require("../../res/img/back.png")}
                    style={[
                        styles.back,
                        {
                            tintColor: prevIsEnabled ? defaultTheme.gray : defaultTheme.grayBackground
                        }
                    ]}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity
                hitSlop={{
                    top: moderateScale(10),
                    bottom: moderateScale(10),
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={props.calendarPressed}
            >
                <Image
                    source={require("../../res/img/calendar2.png")}
                    style={styles.calendar}
                    resizeMode="contain"
                />
                <Text
                    style={[styles.title, { fontFamily: props.lang.font }]}
                    allowFontScaling={false}
                >
                    {props.user.countryId == 128 ? props.selectedDate === "2022-03-22" ? "1401/01/02" : moment(props.selectedDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : props.selectedDate}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ marginHorizontal: moderateScale(15) }}
                hitSlop={{
                    top: moderateScale(10),
                    bottom: moderateScale(10),
                    left: moderateScale(10),
                    right: moderateScale(10)
                }}
                onPress={props.onNext}
            // disabled={props.disabled}

            >
                <Image
                    source={require("../../res/img/next.png")}
                    style={[
                        styles.back,
                        {
                            tintColor: nextIsEnabled ? defaultTheme.gray : defaultTheme.grayBackground
                        }
                    ]}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={props.onPressShutDown}
                style={{ left: moderateScale(20), padding: 2 }}>
                <Power
                    width={moderateScale(20)}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        height: moderateScale(40),
        width: dimensions.WINDOW_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 0,
        borderBottomColor: defaultTheme.border,
        backgroundColor: defaultTheme.white
    },
    back: {
        width: moderateScale(18),
        height: moderateScale(18),
        tintColor: defaultTheme.gray,
        marginHorizontal: moderateScale(6)
    },
    calendar: {
        width: moderateScale(26),
        height: moderateScale(26),
        tintColor: defaultTheme.gray,
        marginHorizontal: moderateScale(6)
    },
    title: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(16),
        marginHorizontal: moderateScale(6)
    }

})

export default memo(FastingCalendar)