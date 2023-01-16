
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager
} from 'react-native';
import { ConfirmButton, PageIndicator, Information } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment"
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
// import Orientation from 'react-native-orientation-locker';

const ChooseTargetScreen = props => {
    // Orientation.lockToPortrait()
    const lang = useSelector(state => state.lang)
    const specification = useSelector(state => state.specification)
    const profile = useSelector(state => state.profile)
    const [activeIndex, setActive] = React.useState(null)
    const [targetCalorie, setTargetCalorie] = React.useState(2000)
    const [ideal, setIdeal] = React.useState(20)
    const [errorContext, setErrorContext] = React.useState("")
    const [errorVisible, setErrorVisible] = React.useState(false)

    React.useEffect(() => {
        const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
        const nowMoment = moment()
        const age = nowMoment.diff(birthdayMoment, "years")
        const height = profile.heightSize
        const weight = specification[0].weightSize
        const wrist = specification[0].wristSize
        let bmr = 1

        // console.log("height",height)
        // console.log("weight",weight)
        // console.log("age",age)

        if (profile.gender == 1) {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            if (height < 152) {
                setIdeal("56.2")
            }
            else {
                setIdeal((56.2 + (((height - 152) / 2.54) * 1.41)).toFixed(1))
            }
        }
        else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
            if (height < 152) {
                setIdeal("53.1")
            }
            else {
                setIdeal((53.1 + (((height - 152) / 2.54) * 1.36)))
            }
        }

        switch (profile.dailyActivityRate) {
            case 10:
                setTargetCalorie(bmr * 1)
                break
            case 20:
                setTargetCalorie(bmr * 1.2)
                break
            case 30:
                setTargetCalorie(bmr * 1.375)
                break
            case 40:
                setTargetCalorie(bmr * 1.465)
                break
            case 50:
                setTargetCalorie(bmr * 1.55)
                break
            case 60:
                setTargetCalorie(bmr * 1.725)
                break
            case 70:
                setTargetCalorie(bmr * 1.9)
                break
        }
    }, [specification])

    React.useEffect(() => {
        activeIndex != null && onNext()
    }, [activeIndex])

    const onNext = () => {
        if (activeIndex != null) {
            if (activeIndex == 1) {
                props.navigation.navigate("SetTargetScreen", { target: 1, text: lang.weightGainRate })
            }
            if (activeIndex == 2) {
                props.navigation.navigate("SetTargetScreen", { target: 2, text: lang.weightLossRate })
            }
            if (activeIndex == 0) {
                props.navigation.navigate("SetTargetScreen", { target: 0,text:"" })
            }

        }
        else {
            // setErrorContext(lang.selectOneOption)
            // setErrorVisible(true)
            Toast.show({
                type: 'error',
                props: { text2: lang.selectOneOption, style: { fontFamily: lang.font } },
                visibilityTime: 2000,
            });
        }
    }

    const onBack = () => {
        props.navigation.goBack()
    }

    const weightDiff = specification[0].weightSize - ideal

    return (
        <View
            style={styles.container}
        >
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {lang.setGol}
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.rowContainer}>
                    <Image
                        source={require("../../../res/img/done.png")}
                        style={[styles.icon2]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.text, { fontFamily: lang.font, marginVertical: 15, fontSize: moderateScale(17) }]} allowFontScaling={false}>
                        {
                            weightDiff > 0 ?
                                (lang.myOfferForYou_1 + " " + Math.abs(weightDiff).toFixed(1) + " " + lang.kgMeasureName + " " + lang.myOfferForYou_2_1) :
                                weightDiff < 0 ?
                                    (lang.myOfferForYou_1 + " " + Math.abs(weightDiff).toFixed(1) + " " + lang.kgMeasureName + " " + lang.myOfferForYou_2_2) :
                                    (lang.myOfferForYou_1 + " " + lang.myOfferForYou_2_3)
                        }

                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setActive(0)}
                    style={{
                        marginTop: moderateScale(40),
                    }}
                >
                    <LinearGradient
                        style={[styles.gradient, { borderColor: activeIndex === 0 ? defaultTheme.green : defaultTheme.lightGray }]}
                        colors={['#FFF', '#EBEBEB']}
                        locations={[0.2, 1]}
                    >
                        <Text
                            style={[styles.text, { fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont, color: lang.langName !== "english" ? defaultTheme.darkText : defaultTheme.darkText }]}
                            allowFontScaling={false}
                        >
                            {lang.weightStability}
                        </Text>
                        <Image
                            style={{
                                width: 20,
                                height: 25,
                                position: "absolute",
                                left: "8%",
                                top: 10,
                            }}
                            source={require("../../../res/img/steady.png")}
                            resizeMode="contain"
                        />
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActive(1)}
                    style={{
                        marginVertical: moderateScale(20)
                    }}
                >
                    <LinearGradient
                        style={[styles.gradient, { borderColor: activeIndex === 1 ? defaultTheme.green : defaultTheme.lightGray }]}
                        colors={['#FFF', '#EBEBEB']}
                        locations={[0.2, 1]}
                    >
                        <Text
                            style={[styles.text, { fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont, color: lang.langName !== "english" ? defaultTheme.darkText : defaultTheme.darkText }]}
                            allowFontScaling={false}
                        >
                            {lang.weightGain}
                        </Text>
                        <Image
                            style={{
                                width: 20,
                                height: 25,
                                position: "absolute",
                                left: "8%",
                                top: 10,
                            }}
                            source={require("../../../res/img/increase.png")}
                            resizeMode="contain"
                        />
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActive(2)}
                    style={{

                    }}
                >
                    <LinearGradient
                        style={[styles.gradient, { borderColor: activeIndex === 2 ? defaultTheme.green : defaultTheme.lightGray }]}
                        colors={['#FFF', '#EBEBEB']}
                        locations={[0.2, 1]}
                    >
                        <Text
                            style={[styles.text, { fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont, color: lang.langName !== "english" ? defaultTheme.darkText : defaultTheme.darkText }]}
                            allowFontScaling={false}
                        >
                            {lang.weightLoss}
                        </Text>
                        <Image
                            style={{
                                width: 20,
                                height: 25,
                                position: "absolute",
                                left: "8%",
                                top: 10,
                            }}
                            source={require("../../../res/img/reduce.png")}
                            resizeMode="contain"
                        />
                    </LinearGradient>
                </TouchableOpacity>

            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonContainer}>
                    <ConfirmButton
                        title={lang.perBtn}
                        style={styles.confirmButton}
                        lang={lang}
                        onPress={onBack}
                        leftImage={require("../../../res/img/back.png")}
                        rotate
                    />
                    <ConfirmButton
                        title={lang.continuation}
                        style={styles.confirmButton}
                        lang={lang}
                        onPress={onNext}
                        rightImage={require("../../../res/img/next.png")}
                        rotate
                    />
                </View>
                <PageIndicator
                    pages={new Array(6).fill(1)}
                    activeIndex={4}
                />
            </View>
            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleContainer: {
        width: dimensions.WINDOW_WIDTH,
        marginTop: moderateScale(40),
        marginBottom: moderateScale(30),
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent:"center"
    },
    bottomContainer: {
        width: dimensions.WINDOW_WIDTH,
        height: moderateScale(75),
        marginTop: moderateScale(30),
        marginBottom: moderateScale(10),
        alignItems: "center",
        justifyContent: "space-around"
    },
    buttonContainer: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    title: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(19)
    },
    icon: {
        width: moderateScale(30),
        height: moderateScale(30)
    },
    icon2: {
        width: moderateScale(25),
        height: moderateScale(25),
        tintColor: defaultTheme.green
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        marginHorizontal: 15,
        textAlign: "center",
        lineHeight: moderateScale(22)
    },
    calText: {
        fontSize: moderateScale(17),
        color: defaultTheme.primaryColor,
    },
    gradient: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH * 0.5,
        height: moderateScale(45),
        borderRadius: moderateScale(30),
        borderWidth: 2.5,
        borderColor: defaultTheme.lightGray,
        justifyContent: "center",
        alignItems: "center",
        margin: moderateScale(7)
    },
    confirmButton: {
        width: dimensions.WINDOW_WIDTH * 0.35,
        borderRadius: 20,
    },
    rowContainer: {
        width: dimensions.WINDOW_WIDTH * 0.85,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

});

export default ChooseTargetScreen;
