
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager,
    ScrollView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { updateTarget } from '../../redux/actions';
import { Toolbar, CustomInput, RowSpaceBetween, RowWrapper, DropDown, ConfirmButton, Information } from '../../components';
import moment from "moment"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native'
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'


const EditGoalScreen = props => {

    const nowTime = moment().format('YYYY-MM-DD')
    const lang = useSelector(state => state.lang)
    const profile = useSelector(state => state.profile)
    console.log("profile=>", profile)
    const specification = useSelector(state => state.specification)
    const auth = useSelector(state => state.auth)
    const app = useSelector(state => state.app)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [goal, setGoal] = React.useState(profile)
    const weightRateData = React.useRef([
        { id: 100, name: " 100 " + lang.perweek },
        { id: 200, name: " 200 " + lang.perweek },
        { id: 300, name: " 300 " + lang.perweek },
        { id: 400, name: " 400 " + lang.perweek },
        { id: 500, name: " 500 " + lang.perweek },
        { id: 600, name: " 600 " + lang.perweek },
        { id: 700, name: " 700 " + lang.perweek },
        { id: 800, name: " 800 " + lang.perweek },
        { id: 900, name: " 900 " + lang.perweek },
        { id: 1000, name: " 1000 " + lang.perweek },
    ]).current
    const activityData = React.useRef([
        { id: 10, name: lang.bedRest },
        { id: 20, name: lang.veryLittleActivity },
        { id: 30, name: lang.littleActivity },
        { id: 40, name: lang.normalLife },
        { id: 50, name: lang.relativelyActivity },
        { id: 60, name: lang.veryActivity },
        { id: 70, name: lang.moreActivity }
    ]).current
    const wc = weightRateData.find(item => item.id == profile.weightChangeRate)
    const [weightChangeRate, setWeightChangeRate] = React.useState(wc ? wc : weightRateData[0])
    const [activityRate, setActivityRate] = React.useState(activityData.find(item => item.id == profile.dailyActivityRate))
    const [errorContext, setErrorContext] = React.useState("")
    const [errorVisible, setErrorVisible] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState();
    const [targetBody, setTargetBody] = useState({ name: lang.weightLoss });
    useEffect(() => {
        // console.warn(goal.targetWeight)

        if (specification[0].weightSize > goal.targetWeight) {
            setSelectedItem(0)
        } if (specification[0].weightSize == goal.targetWeight) {
            setSelectedItem(1)
        } if (specification[0].weightSize < goal.targetWeight) {
            setSelectedItem(2)
        }
    }, [goal]);
    useEffect(() => {
        if (selectedItem == 1) {
            setGoal({ ...goal, targetWeight: specification[0].weightSize })
        }
        if (goal.targetStep == null) {
            dispatch(
                updateTarget(
                    {
                        ...goal,
                        targetStep: 5000

                    },
                    auth,
                    app,
                    user,
                    () => { },
                    showError
                )
            )
        }
    }, [selectedItem])

    const targetBodyy = [{ name: lang.weightLoss }, { name: lang.weightStability }, { name: lang.weightGain }]

    const calCalorie = (tw, WCR, DAR) => {
        const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
        const nowMoment = moment()
        const age = nowMoment.diff(birthdayMoment, "years")
        const height = profile.heightSize
        const weight = specification[0].weightSize
        const wrist = specification[0].wristSize
        const targetWeight = parseFloat(tw)
        let bmr = 1
        let factor = height / wrist;
        let bodyType = 1
        let targetCalorie = 0

        console.log(age)
        console.log(height)
        console.log(weight)
        console.log(wrist)
        if (profile.gender == 1) {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            if (factor > 10.4) bodyType = 1;
            else if (factor < 9.6) bodyType = 3
            else bodyType = 2
        }
        else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
            if (factor > 11) bodyType = 1;
            else if (factor < 10.1) bodyType = 3
            else bodyType = 2
        }

        console.log("profile.dailyActivityRate", profile.dailyActivityRate)
        switch (DAR) {
            case 10:
                targetCalorie = (bmr * 1)
                break
            case 20:
                targetCalorie = (bmr * 1.2)
                break
            case 30:
                targetCalorie = (bmr * 1.375)
                break
            case 40:
                targetCalorie = (bmr * 1.465)
                break
            case 50:
                targetCalorie = (bmr * 1.55)
                break
            case 60:
                targetCalorie = (bmr * 1.725)
                break
            case 70:
                targetCalorie = (bmr * 1.9)
                break
        }
        const targetCaloriPerDay = (7700 * WCR * 0.001) / 7
        // checkForZigZagi
        if (weight > targetWeight) {
            if ((targetCalorie - targetCaloriPerDay) >= 1050) {
                if (user.countryId === 128) {
                    if (moment().day() == 4) {
                        targetCalorie *= 1.117
                    } else if (moment().day() == 5) {
                        targetCalorie *= 1.116
                    } else {
                        targetCalorie *= 0.97
                    }
                }
                else {
                    if (moment().day() == 6) {
                        targetCalorie *= 1.117
                    } else if (moment().day() == 0) {
                        targetCalorie *= 1.116
                    } else {
                        targetCalorie *= 0.97
                    }
                }
                targetCalorie -= targetCaloriPerDay
            } else {
                // console.warn("not working")
                targetCalorie = 0
            }

        } if (weight < targetWeight) {
            targetCalorie += targetCaloriPerDay
        }

        return targetCalorie

    }
    const onItemSelected = selectedItem => {
        setSelectedItem(selectedItem);
    };

    const onConfirm = () => {
        if (!isNaN(parseFloat(goal.targetWeight))) {
            if (goal.targetWeight > 35 && goal.targetWeight < 160) {


                if (!isNaN(parseFloat(goal.targetStep))) {
                    console.log(goal)
                    if (calCalorie(parseFloat(goal.targetWeight), weightChangeRate.id, activityRate.id) >= 1000) {
                        setLoading(true)
                        let oldValues = {
                            oldWeightChangeRate: profile.weightChangeRate,
                            oldDailyActivityRate: profile.dailyActivityRate,
                            oldDateChange: nowTime,
                            oldTargetWeight: profile.targetWeight
                        }
                        AsyncStorage.setItem('oldChanges', JSON.stringify(oldValues))
                        dispatch(
                            updateTarget(
                                {
                                    ...goal,
                                    weightChangeRate: weightChangeRate.id,
                                    dailyActivityRate: activityRate.id,

                                },
                                auth,
                                app,
                                user,
                                () => {
                                    analytics().logEvent('editGoal')
                                    props.navigation.goBack()
                                },
                                showError
                            )
                        )

                    } else {
                        setErrorContext(lang.lowCalerieDanger2)
                        setErrorVisible(true)
                    }
                }
                else {
                    setErrorContext(lang.fillAllFild)
                    setErrorVisible(true)
                }
            } else {
                setErrorContext(lang.wrongTargetWeightError)
                setErrorVisible(true)
            }
        }
        else {
            setErrorContext(lang.fillAllFild)
            setErrorVisible(true)
        }
    }

    const showError = () => {
        setErrorContext(lang.serverError)
        setErrorVisible(true)
        setLoading(false)
    }

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 10 : 35} style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "none"}>
            <View style={styles.mainContainer}>
                <Toolbar
                    lang={lang}
                    title={lang.editGolTitle}
                    onBack={() => props.navigation.goBack()}
                />
                <ScrollView
                    contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
                >
                    <RowSpaceBetween
                        style={[styles.rowContainer]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.mainGoal}
                        </Text>
                        <RowWrapper
                            style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row", marginVertical: 0 }}
                        >
                            {/* <WheelPicker
                            selectedItem={selectedItem}
                            data={targetBody}
                            style={{ fontFamily: lang.font, width: moderateScale(70), height: moderateScale(80), bottom: moderateScale(10), marginHorizontal: moderateScale(15) }}
                            itemTextFontFamily={lang.font}
                            selectedItemTextFontFamily={lang.font}
                            itemTextSize={moderateScale(18)}
                            selectedItemTextSize={moderateScale(18)}
                            onItemSelected={onItemSelected}
                        /> */}
                            <DropDown
                                style={{ width: moderateScale(150) }}
                                data={targetBodyy}
                                lang={lang}
                                onItemPressed={(item) => setTargetBody(item)}
                                selectedItem={targetBody.name.toString()}
                            />
                        </RowWrapper>
                    </RowSpaceBetween>
                    <RowSpaceBetween
                        style={[styles.rowContainer]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.golWeight}
                        </Text>
                        <RowWrapper
                            style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row", marginVertical: 0 }}
                        >
                            <CustomInput
                                style={styles.customInput}
                                textStyle={styles.textInput}
                                lang={lang}
                                value={goal.targetWeight.toString()}
                                onChangeText={text => {
                                    (/^[0-9\.]+$/i.test(text) || text == '') ?
                                        setGoal({ ...goal, targetWeight: text })

                                        : Toast.show({
                                            type: "error",
                                            props: { text2: lang.typeEN },
                                            visibilityTime: 1800
                                        })

                                }}
                                keyboardType="decimal-pad"
                                autoFocus={true}
                                maxLength={3}
                            />
                            <Text style={[styles.text]} allowFontScaling={false} >
                                kg
                            </Text>

                        </RowWrapper>
                    </RowSpaceBetween>
                    <RowSpaceBetween
                        style={[styles.rowContainer]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.golInperWeek}
                        </Text>
                        <DropDown
                            style={{ width: moderateScale(150) }}
                            data={weightRateData}
                            lang={lang}
                            onItemPressed={(item) => setWeightChangeRate(item)}
                            selectedItem={weightChangeRate.name.toString()}
                        />
                    </RowSpaceBetween>
                    <RowSpaceBetween
                        style={[styles.rowContainer]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.rateActivity2}
                        </Text>
                        <DropDown
                            data={activityData}
                            style={{ width: moderateScale(170), maxWidth: moderateScale(170) }}
                            selectedTextStyle={{ maxWidth: moderateScale(180) }}
                            lang={lang}
                            onItemPressed={(item) => setActivityRate(item)}
                            selectedItem={activityRate.name}
                        />
                    </RowSpaceBetween>


                    <RowSpaceBetween
                        style={[styles.rowContainer]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.targetStep}
                        </Text>

                        <RowWrapper
                            style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row", marginVertical: 0 }}
                        >


                            <CustomInput
                                style={styles.customInput}
                                textStyle={styles.textInput}
                                lang={lang}
                                value={goal.targetStep.toString()}
                                onChangeText={text => {
                                    (/^[0-9]+$/i.test(text) || text == '') ?
                                        setGoal({ ...goal, targetStep: text })
                                        : Toast.show({
                                            type: "error",
                                            props: { text2: lang.typeEN },
                                            visibilityTime: 1800
                                        })
                                }}
                                keyboardType="numeric"
                            />
                        </RowWrapper>
                    </RowSpaceBetween>


                    {/* <TouchableOpacity onPress={() => props.navigation.navigate("EditGoalNutritionScreen")}>
                    <RowSpaceBetween
                        style={[styles.rowContainer, { borderBottomWidth: 0 }]}
                    >
                        <Text style={[styles.text, { fontFamily: lang.font, marginTop: moderateScale(16) }]} allowFontScaling={false}>
                            {lang.golCostFood}
                        </Text>
                        <RowWrapper
                            style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row", marginVertical: 0 }}
                        >
                            <Image
                                style={styles.back}
                                source={require("../../../res/img/back_arrow.png")}
                                resizeMode="contain"
                            />
                        </RowWrapper>
                    </RowSpaceBetween>
                </TouchableOpacity> */}
                    <View style={styles.cautionContainer}>
                        <RowWrapper>
                            <LottieView
                                style={{
                                    width: moderateScale(50),
                                    height: moderateScale(50),
                                }}
                                source={require('../../../res/animations/dartTarget.json')}
                                autoPlay
                                loop={true}
                            />
                            <Text
                                style={[styles.text1, { fontFamily: lang.font, textAlign: "left" }]}
                                allowFontScaling={false}>
                                {lang.calorieGoal}
                            </Text>
                        </RowWrapper>
                        <Text
                            style={[styles.textInfo, { fontFamily: lang.font, textAlign: "left" }]}
                            allowFontScaling={false}>
                            {lang.zigzag}
                        </Text>

                    </View>



                </ScrollView>
                <Information
                    visible={errorVisible}
                    context={errorContext}
                    onRequestClose={() => setErrorVisible(false)}
                    lang={lang}
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center", position: "absolute", bottom: moderateScale(0), paddingBottom: moderateScale(20) }}>
                    <ConfirmButton
                        lang={lang}
                        title={lang.saved}
                        style={styles.savedButton}
                        onPress={onConfirm}
                        isLoading={loading}
                    />
                </LinearGradient>
                {/* {
                errorVisible &&
                < TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView
                            style={styles.absolute}
                            blurType="light"
                            blurAmount={6}
                        />
                    </View>
                </TouchableWithoutFeedback>
            } */}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
    },
    row: {
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
        paddingVertical: moderateScale(10),
        marginTop: 0,
        marginBottom: 0
    },
    text: {
        color: defaultTheme.lightGray2,
        fontSize: moderateScale(15),
        marginHorizontal: moderateScale(8),
    },
    rowContainer: {
        paddingHorizontal: moderateScale(16),
        borderBottomWidth: 1,
        paddingBottom: moderateScale(17)
    },
    customInput: {
        maxWidth: moderateScale(90),
        height: moderateScale(40),
        minHeight: moderateScale(30),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        borderWidth: 1,
    },
    textInput: {
        fontSize: moderateScale(18),
        textAlign: "center"
    },
    dropDownText: {
        color: defaultTheme.gray,
        fontSize: moderateScale(13),
        marginVertical: moderateScale(8)
    },
    savedButton: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
        marginTop: moderateScale(50),

    },
    back: {
        width: moderateScale(20),
        height: moderateScale(16),
        marginTop: moderateScale(16),
        transform: [
            { scaleX: I18nManager.isRTL ? 1 : -1 }
        ]
    }, cautionContainer: {
        width: dimensions.WINDOW_WIDTH - moderateScale(32),
        borderWidth: 1,
        borderColor: defaultTheme.blue,
        borderRadius: moderateScale(15),
        marginVertical: moderateScale(0),
        paddingBottom: moderateScale(10),
        alignSelf: 'center',
        marginBottom: moderateScale(50)
    }, textInfo: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(14),
        marginHorizontal: moderateScale(8),
        lineHeight: moderateScale(24),
        top: -10
    }, text1: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
    },

});

export default EditGoalScreen;
