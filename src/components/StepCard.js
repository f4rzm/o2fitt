import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, I18nManager, Platform } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import stepBurnedCalorie from "../utils/stepBurnedCalorie"
import Shoe from "../../res/img/shoe.svg";
import { color } from "react-native-reanimated";
import moment from "moment";
import { universalStyles } from "../constants/universalStyles";

const StepCard = props => {
    let step = 0
    let calories = 0
    let autoburnedCalorie = 0
    props.steps.map(item => {
        step += parseInt(item.stepsCount);
        calories += parseFloat(item.burnedCalories)
    })
    // autoburnedCalorie = props.selectedDate == moment().format("YYYY-MM-DD") ? stepBurnedCalorie(parseFloat(props.autoSteps), parseFloat(props.specification.weightSize)) : 0


    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onCardPressed}>
            <View style={styles.leftContainer}>
                <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                    {props.lang.stepCounter}
                </Text>
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <View style={styles.container3}>
                            {/* <Text style={[styles.text1, { fontFamily: props.lang.font, alignSelf: "flex-end", }]} allowFontScaling={false}>
                                {(parseInt(calories) + parseInt(autoburnedCalorie)) + " cal"}
                            </Text> */}
                            <View style={styles.container4}>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ color: defaultTheme.mainText, marginRight: moderateScale(10), fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{(parseInt(calories))} {props.lang.calories}</Text>
                                    <Text style={[styles.text3, { color: defaultTheme.green, fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {parseInt(step)}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <Text style={[styles.text2, { fontFamily: props.lang.font, fontSize: moderateScale(17) }]}>
                                        <Text style={[styles.text2, { fontFamily: props.lang.font, fontSize: moderateScale(17) }]}>
                                            {props.lang.gol} :
                                        </Text>
                                        {" " + props.profile.targetStep + " " + props.lang.step}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Shoe
                    width={80}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: universalStyles.homeScreenCards,
    rightContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    leftContainer: {
        flex: 2.5,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
    },
    container2: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        alignItems: "center",

    },
    container3: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    container4: {
        width: "90%",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: moderateScale(6),
        alignSelf: "flex-end",
        marginBottom: moderateScale(30)
    },
    text: {
        fontSize: moderateScale(16),
        textAlign: "center",
        color: defaultTheme.darkText
    },
    text1: {
        fontSize: moderateScale(17),
        textAlign: "center",
        color: defaultTheme.darkText,
        paddingHorizontal: moderateScale(0)
    },
    text2: {
        fontSize: moderateScale(19),
        marginVertical: moderateScale(10),
        color: defaultTheme.mainText

    },
    text3: {
        fontSize: moderateScale(18),
        marginVertical: 6,
        minWidth: moderateScale(60),
        borderWidth: 1.5,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        textAlign: "center",
        paddingVertical: Platform.OS == "ios" ? moderateScale(4) : 0,
        marginRight: moderateScale(5),
        color: defaultTheme.darkText
    }

})

export default memo(StepCard)