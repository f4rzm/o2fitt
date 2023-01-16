import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import Goal from "../../res/img/goal.svg"

const GoalCard = props => {

    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onCardPressed}>
            <View style={styles.leftContainer}>
                <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                    {props.lang.calorieCountingGoal}
                </Text>
                <View style={styles.container}>
                    <ConfirmButton
                        title={props.lang.shapeBodybot}
                        lang={props.lang}
                        style={styles.button}
                        textStyle={[styles.textStyle, { fontFamily: props.lang.font }]}
                        onPress={props.onPress}
                    />
                    <View style={{ margin: moderateScale(10), height: "100%", justifyContent: "space-evenly" }}>
                        <Text style={[styles.text2, { fontFamily: props.lang.font,color:props.lang.langName=="persian"?defaultTheme.mainText:defaultTheme.darkText }]} allowFontScaling={false}>
                            {props.lang.currentWeight}
                        </Text>
                        <Text style={[styles.text3, { fontFamily: props.lang.font,color:props.lang.langName=="persian"?defaultTheme.mainText:defaultTheme.darkText,fontSize:moderateScale(18) }]} allowFontScaling={false}>
                            {props.specification[0].weightSize + " kg"}
                        </Text>
                    </View>
                    <View style={{ margin: moderateScale(10), height: "100%", justifyContent: "space-evenly" }}>
                        <Text style={[styles.text2, { fontFamily: props.lang.font,color:props.lang.langName=="persian"?defaultTheme.mainText:defaultTheme.darkText }]} allowFontScaling={false}>
                            {props.lang.golWeight}
                        </Text>
                        <Text style={[styles.text3, { fontFamily: props.lang.font, color: defaultTheme.green,fontSize:moderateScale(18) }]}>
                            {props.profile.targetWeight + " kg"}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Goal
                    width={37}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        height: moderateScale(110),
        width: "92%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderWidth: 0,
        backgroundColor: defaultTheme.lightBackground,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.27,

        elevation: 5,
        marginHorizontal: moderateScale(16),
        marginBottom: moderateScale(20),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        paddingVertical: moderateScale(5)
    },
    rightContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    leftContainer: {
        flex: 4.5,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(16),
        textAlign: "center",
        color: defaultTheme.darkText,
    },
    text2: {
        fontSize: moderateScale(14),
        maxWidth: moderateScale(75),
        textAlign: "center",
        color: defaultTheme.darkText

    },
    text3: {
        fontSize: moderateScale(18),
        maxWidth: moderateScale(75),
        textAlign: "center",
        color: defaultTheme.darkText
    },
    button: {
        width: moderateScale(110),
        height: moderateScale(35),
        backgroundColor: defaultTheme.lightBackground,
        borderWidth: 1.5,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(8),
        margin: 0,
    },
    textStyle: {
        color: defaultTheme.mainText,
        fontSize: moderateScale(15)
    }

})

export default memo(GoalCard)