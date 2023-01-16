import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import ConfirmButton from './ConfirmButton'
import { dimensions } from '../constants/Dimensions'
import { universalStyles } from '../constants/universalStyles'
import { } from 'jalali-moment'
import moment from 'moment-jalaali'
import { defaultTheme } from '../constants/theme'

const EndingPlan = (props) => {
    const lang = props.lang
    const diet = props.diet
    return (
        <View style={styles.container}>
            <Text style={[universalStyles.subHeaderTextPersian, { fontFamily: lang.font, marginTop: moderateScale(20), lineHeight: moderateScale(24) }]}>
                {lang.DietEnding.split("*")[0] + moment(diet.dietStartDate, 'YYYY-MM-DD').add(30, 'days').format("jYYYY/jMM/jDD") + lang.DietEnding.split("*")[1]}
            </Text>
            <Text style={{ fontFamily: lang.font, textAlign: "center", marginTop: moderateScale(5), color: defaultTheme.gray }}>
                {lang.DietEndingdes}

            </Text>
            <View style={styles.subContainer}>
                <ConfirmButton
                    lang={lang}
                    onPress={props.onAccept}
                    style={{ ...styles.btn,backgroundColor:defaultTheme.green }}
                    title={lang.GetDietBtn}
                />
                <ConfirmButton
                    lang={lang}
                    onPress={props.onReject}
                    style={{ ...styles.btn,borderColor:defaultTheme.error,borderWidth:0.5,backgroundColor:defaultTheme.white }}
                    title={lang.rejectDietBtn}
                    textStyle={{color:defaultTheme.darkText}}
                />

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(30),
        height: "auto"
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: moderateScale(30)

    },
    btn: {
        width: dimensions.WINDOW_WIDTH * 0.35
    }
})

export default EndingPlan