import React, { memo } from "react"
import { View, Text, Image, StyleSheet,  TouchableOpacity } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import AnimatedLottieView from "lottie-react-native";

const DietCard = props => {

    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onCardPressed}>
            {
                props.diet.isActive == true ?
                    <View style={styles.leftContainer}>
                        <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                            هدف برنامه غذایی
                        </Text>
                        <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(40), color: defaultTheme.green }]}>پیشرفت برنامه : {props.diet.percent.toFixed(0)<0?0:props.diet.percent.toFixed(0)} % </Text>
                        <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25), color: defaultTheme.mainText }]}>تعداد روز آزاد : {2 - props.diet.cheetDays.length} روز</Text>
                        {/* <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25), color: defaultTheme.mainText }]}><Text style={{fontSize:moderateScale(17),color:defaultTheme.darkText}}>{Math.abs(parseInt(DietPackageEndDate)) + 1}</Text> روز مانده به اتمام برنامه </Text> */}
                    </View>
                    : props.diet.isBuy == false ?
                        <View style={styles.leftContainer}>
                            <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                                هدف برنامه غذایی
                        </Text>
                            <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25) }]}>
                                برنامه غذایی فعالی ندارین!
                            </Text>
                            {
                                props.diet.isBuy == false ? <Text style={{ fontSize: moderateScale(14), color: "gray", fontFamily: props.lang.font, marginHorizontal: moderateScale(20), lineHeight: moderateScale(18), paddingTop: moderateScale(14) }}>اگر میخواین با برنامه غذایی به وزن دلخواه برسین <Text style={{ color: defaultTheme.green }}>اینجا کلیک</Text> کنین</Text> : null

                            }

                        </View>
                        : <View style={styles.leftContainer}>
                            <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                                هدف برنامه غذایی
                            </Text>
                            <Text style={[styles.text2, { fontFamily: props.lang.font, lineHeight: moderateScale(25) }]}>
                                {
                                    props.diet.isActive == false &&
                                    `هنوز برنامه غذایی ندارین ! \nبرای دریافت برنامه غذایی`
                                }
                                <Text style={{ color: defaultTheme.green }}> کلیک کنین </Text>
                            </Text>
                            {
                                props.diet.isBuy == false ? <Text style={{ fontSize: moderateScale(14), color: "gray", fontFamily: props.lang.font, marginHorizontal: moderateScale(20), lineHeight: moderateScale(18), paddingTop: moderateScale(14) }}>اگر میخواین با برنامه غذایی به وزن دلخواه برسین <Text style={{ color: defaultTheme.green }}>اینجا کلیک</Text> کنین</Text> : null

                            }

                        </View>}


            <View style={styles.rightContainer}>
                <AnimatedLottieView
                    source={require("../../res/animations/mealplan.json")}
                    autoPlay={true}
                    width={moderateScale(90)}
                    loop={true}
                />
            </View>
            <Image
                source={require("../../res/img/back.png")}
                style={{ tintColor: defaultTheme.gray, alignSelf: "center", width: moderateScale(20), height: moderateScale(20), paddingHorizontal: moderateScale(20) }}
                resizeMode={"contain"}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        // height: moderateScale(130),
        width: "92%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderWidth: 0,
        backgroundColor: defaultTheme.white,
       
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
        paddingVertical: moderateScale(5),
    },
    rightContainer: {
        flex: 2,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
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
        marginHorizontal: moderateScale(18),
        textAlign:"left",
        marginBottom:moderateScale(6)
        
    },
    text2: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        marginHorizontal: moderateScale(20),
        textAlign:"left"
    },
    text3: {
        fontSize: moderateScale(18),
        maxWidth: moderateScale(75),
        textAlign: "center",
        color: defaultTheme.darkText
    },
    button: {
        width: moderateScale(95),
        height: moderateScale(35),
        backgroundColor: defaultTheme.lightBackground,
        borderWidth: 1.5,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        margin: 0,

    },
    textStyle: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(16)
    },
    btnContainer: {
        backgroundColor: defaultTheme.green,
        borderRadius: 13,
        width: moderateScale(190),
        height: moderateScale(35),
        marginHorizontal: moderateScale(30),
    }

})

export default memo(DietCard)