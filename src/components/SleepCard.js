import React, { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import Sleep from "../../res/img/sleep.svg";
import { universalStyles } from "../constants/universalStyles";

const SleepCard = props => {
    console.log(props.duration)
    const h = parseInt(props.duration / (60))
    const m = parseInt((props.duration - (h * (60))))
    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onPress}>
            <View style={styles.leftContainer}>
                <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                    {props.lang.infoSleepTitle}
                </Text>
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <TouchableOpacity onPress={props.onAddPressed}>
                            <Image
                                source={require("../../res/img/plus.png")}
                                style={{ width: moderateScale(25), height: moderateScale(25), tintColor: defaultTheme.gray, marginHorizontal: moderateScale(20) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <View style={styles.container4}>
                            <Text style={[styles.text2, { fontFamily: props.lang.font, fontSize: props.lang.langName === "persian" ? moderateScale(19) : moderateScale(17) }]} allowFontScaling={false}>
                                {h}
                                <Text style={[styles.text1, { fontFamily: props.lang.font, fontSize: props.lang.langName === "persian" ? moderateScale(17) : moderateScale(14) }]} allowFontScaling={false}>
                                    {" "}{props.lang.hour}{" "}
                                </Text>
                                {m}
                                <Text style={[styles.text1, { fontFamily: props.lang.font, fontSize: props.lang.langName === "persian" ? moderateScale(17) : moderateScale(14) }]} allowFontScaling={false}>
                                    {" "}{props.lang.min}
                                </Text>
                            </Text>
                            <View style={styles.container3}>
                                <Image
                                    style={{
                                        width: moderateScale(21),
                                        height: moderateScale(21),
                                        marginHorizontal: moderateScale(10)
                                    }}
                                    source={require("../../res/img/burn.png")}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.text2, { fontFamily: props.lang.font,fontSize: props.lang.langName === "persian"?moderateScale(19):moderateScale(17) }]} allowFontScaling={false}>
                                    {props.calorie}
                                </Text>
                                <Text style={[styles.text1, { fontFamily: props.lang.font, fontSize: props.lang.langName === "persian" ? moderateScale(17) : moderateScale(17) }]} allowFontScaling={false}>
                                    {"  "}{props.lang.calories}
                                </Text>


                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Sleep
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    container2: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    container3: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: moderateScale(6),
    },
    container4: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(16),
        color: defaultTheme.darkText
    },
    text1: {
        color: defaultTheme.darkText

    },
    text2: {

        textAlign: "center",
        color: defaultTheme.darkText

    },
    text3: {
        fontSize: moderateScale(19),
        marginVertical: moderateScale(6),
        minWidth: moderateScale(60),
        borderWidth: 1.5,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        textAlign: "center",
        paddingVertical: 0,
        marginRight: moderateScale(5),
        color: defaultTheme.darkText


    }

})

export default memo(SleepCard)