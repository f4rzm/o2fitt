import { ActivityIndicator, Animated, BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { setFastingMeal, shutDownFastingDiet } from '../../redux/actions/fasting'
import DietCalendar from '../../components/dietComponents/dietCalendar'
import { defaultTheme } from '../../constants/theme'
import FastingPlanFoodRow from '../../components/FastingPlanFoodRow'
import pouchdbSearch from 'pouchdb-find';
import PouchDB from '../../../pouchdb';
import { Modal } from 'react-native-paper'
import FastingCalendar from '../../components/FastingCalendar'
import FastingDietChangeModal from '../../components/FastingDietChangeModal'
import { ConfirmButton, Toolbar } from '../../components'
import { BlurView } from '@react-native-community/blur'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import Power from '../../../res/img/power.svg'
import { clearDiet, setDietMeal, shutDownDiet } from '../../redux/actions/dietNew'
import { advices } from '../../utils/Advice'
import AnimatedLottieView from 'lottie-react-native'
import analytics from '@react-native-firebase/analytics';
import Info from '../../../res/img/info4.svg'
import DietPlanRow from '../../components/DietPlanRow'
import CheetDay from '../../components/dietComponents/CheetDay'
PouchDB.plugin(pouchdbSearch);
const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const DietPlan = (props) => {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const diet = useSelector(state => state.dietNew)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const [fastingPlan, setDietPlan] = useState()
    const [selectedpackageForChange, setSelectedpackageForChange] = useState()
    const [selectedMealForChange, setSelectedMealForChange] = useState()
    const [showShutDownModal, setShowShutDownModal] = useState(false)
    const [shutownLoading, setShutownLoading] = useState(false)
    const [advice, setAdvice] = useState()
    const [isCheetDay, setIsCheetDay] = useState(false)
    const translateY = useRef(new Animated.Value(100)).current
    const [selectedMEalName, setSelectedMEalName] = useState()

    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            props.navigation.popToTop()
            return true
        });

        return () => BackHandler.removeEventListener("hardwareBackPress", () => {
            props.navigation.popToTop()
            return true
        });
    }, [])

    const dispatch = useDispatch()

    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))

    useEffect(() => {
        setAdvice(advices[Math.floor(Math.random() * 46)].description[lang.langName])
    }, [selectedDate])

    const getData = () => {
        const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
        const nowMoment = moment()
        const age = nowMoment.diff(birthdayMoment, "years")
        const height = profile.heightSize
        let targetWeight = profile.targetWeight;
        const weight = specification[0].weightSize
        const wrist = specification[0].wristSize
        let activityRate = profile.dailyActivityRate;
        let bmr = 1
        let targetCalorie = 0
        let weightChangeRate = profile.weightChangeRate;
        // console.error(height, weight, targetWeight, activityRate, weightChangeRate)

        if (profile.gender == 1) {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5

        }
        else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

        }

        switch (activityRate) {
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

        //console.log("targetCalorie", targetCalorie)
        const targetCaloriPerDay = (7700 * weightChangeRate * 0.001) / 7

        if (weight > targetWeight) {
            targetCalorie -= targetCaloriPerDay
        }
        else if (weight < targetWeight) {
            targetCalorie += targetCaloriPerDay
        }
        targetCalorie = parseInt(targetCalorie)
        return targetCalorie
    }



    const randomGenerator = (data) => {
        return data[Math.floor(Math.random() * (data.length - 1))]
    }

    useEffect(() => {

        if (diet[selectedDate]) {
            setDietPlan(diet[selectedDate])
        } else {
            const randomPack = {
                [moment(selectedDate).format("YYYY-MM-DD")]: {
                    '0': { ...randomGenerator(diet.allBreakfast), isAte: false },
                    "1": { ...randomGenerator(diet.allLunch), isAte: false },
                    "2": { ...randomGenerator(diet.allSnack1), isAte: false },
                    "3": { ...randomGenerator(diet.allDinner), isAte: false },
                    "4": { ...randomGenerator(diet.allSnack2), isAte: false },
                    "5": { ...randomGenerator(diet.allSnack3), isAte: false },
                }
            }

            dispatch(setDietMeal(
                {
                    ...randomPack
                }
            ))
            setDietPlan(randomPack[selectedDate])
        }
    }, [selectedDate])

    const nextDayPressed = () => {

        let nDay = moment(selectedDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
        // await AsyncStorage.setItem("dietDate", nDay)
        setSelectedDate(nDay)
    }
    const prevDayPressed = () => {

        let PDay = moment(selectedDate, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
        // await AsyncStorage.setItem("dietDate", PDay)
        setSelectedDate(PDay)
    }
    const onPressShutDown = () => {
        setShowShutDownModal(true)
    }
    const shutDownWholeDiet = () => {
        analytics().logEvent('shutdown_diet')
        setShutownLoading(true)
        dispatch(shutDownDiet())
        setShutownLoading(false)
        // props.navigation.popToTop()
    }

    const onCheetDayPressed = () => {
        // load(true)
        let index = diet.cheetDays.indexOf(selectedDate)
        if (diet.cheetDays.length <= 1) {
            if (index == -1) {
                dispatch(setDietMeal({ ...diet, cheetDays: [...diet.cheetDays, selectedDate] }))
                setIsCheetDay(true)
                // load(false)
            }
            if (index >= 0) {
                let cheetDay = diet.cheetDays.filter(item => item != selectedDate)
                dispatch(setDietMeal({ ...diet, cheetDays: cheetDay }))
                setIsCheetDay(false)
                // load(false)
            }

        } else {
            if (index != -1) {
                let cheetDay = diet.cheetDays.filter(item => item != selectedDate)
                dispatch(setDietMeal({ ...diet, cheetDays: cheetDay }))
                setIsCheetDay(false)
                // setIsChange(!isChange)
                // setTimeout(() => {
                //     load(false)
                // }, 500)
            } else {
                // setCheetDayModal(true)
                // load(false)
            }
        }

    }

    return (
        <SafeAreaView>
            {/* <Toolbar
                lang={lang}
                title={"برنامه غذایی"}
                onBack={() => props.navigation.popToTop()}
            /> */}
            <DietCalendar
                lang={lang}
                profile={profile}
                user={user}
                selectedDate={selectedDate}
                onNext={nextDayPressed}
                onBack={prevDayPressed}
                fastingDiet={fastingDiet}
                diet={diet}
                onPressShutDown={onPressShutDown}

            />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', flexGrow: 1, paddingTop: moderateScale(10), paddingBottom: moderateScale(100) }}
                showsVerticalScrollIndicator={false}
            >
                <CheetDay
                    isCheetDay={diet.cheetDays.indexOf(selectedDate)!==-1?true:false}
                    lang={lang}
                    onCheetDayPressed={onCheetDayPressed}
                    diet={diet}
                />
                {
                    advice ?
                        <View style={styles.adviceContaienr}>
                            <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: moderateScale(8) }}>
                                <AnimatedLottieView
                                    source={require('../../../res/animations/idea.json')}
                                    style={{ width: moderateScale(30), height: moderateScale(30), }}
                                    autoPlay={true}
                                    loop={true}
                                />
                                <Text style={{ paddingHorizontal: moderateScale(5), fontSize: moderateScale(15), fontFamily: lang.titleFont, color: defaultTheme.darkText, textAlign: "left" }}>توصیه</Text>
                            </View>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(14), lineHeight: moderateScale(21), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.85, textAlign: "left" }}>{advice}</Text>
                        </View> : null
                }
                {
                    diet[selectedDate] &&
                    <>
                        {
                            diet.cheetDays.indexOf(selectedDate)!==-1 ? <></> :
                                <>
                                    <DietPlanRow
                                        title={lang.breakfast}
                                        pack={diet[selectedDate]["0"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"0"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allBreakfast)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.breakfast)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/breakfast.png")}
                                    />
                                    <DietPlanRow
                                        title={lang.snack1}
                                        pack={diet[selectedDate]["2"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"2"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allSnack1)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.snack1)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/snack.png")}

                                    />
                                    <DietPlanRow
                                        title={lang.lunch}
                                        pack={diet[selectedDate]["1"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"1"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allLunch)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.lunch)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/lunch.png")}

                                    />
                                    <DietPlanRow
                                        title={lang.snack2}
                                        pack={diet[selectedDate]["4"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"4"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allSnack2)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.snack2)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/snack.png")}

                                    />
                                    <DietPlanRow
                                        title={lang.dinner}
                                        pack={diet[selectedDate]["3"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"3"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allDinner)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.dinner)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/dinner.png")}

                                    />
                                    <DietPlanRow
                                        title={lang.snack3}
                                        pack={diet[selectedDate]["5"]}
                                        foodDB={foodDB}
                                        lang={lang}
                                        meal={"5"}
                                        offlineDB={offlineDB}
                                        user={user}
                                        auth={auth}
                                        selectedDate={selectedDate}
                                        mealDB={mealDB}
                                        onChangepackage={(e) => {
                                            setSelectedpackageForChange(diet.allSnack3)
                                            setSelectedMealForChange(e)
                                            setSelectedMEalName(lang.snack2)
                                            Animated.spring(translateY, {
                                                toValue: 0,
                                                useNativeDriver: true
                                            }).start()
                                        }}
                                        fastingDiet={diet}
                                        diet={diet}
                                        icon={require("../../../res/img/snack-icon.png")}
                                    />
                                </>
                        }
                    </>
                }
                {
                    moment(diet.dietStartDate).add(30, 'days').format("YYYYMMDD") > moment(selectedDate).format("YYYYMMDD") &&
                    <View style={styles.tipsContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Info
                                width={moderateScale(25)}
                            />
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.green2, }}>نکته</Text>
                        </View>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(14), lineHeight: 25, color: defaultTheme.mainText, textAlign: "left" }}>
                            برای تغییر رژیم غذایی ابتدا برنامه غذایی فعلی رو از طریق آیکون قرمز رنگ بالا لغو کنین و دوباره برنامه غذایی دریافت کنین.
                        </Text>
                    </View>
                }
            </ScrollView>
            <Modal
                visible={selectedpackageForChange}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setSelectedpackageForChange()
                }}
            // style={{ alignItems: 'center', justifyContent: "center" }}

            >
                <>

                    <FastingDietChangeModal
                        selectedPackageForChange={selectedpackageForChange}
                        item={selectedpackageForChange}
                        lang={lang}
                        dismissModal={() => setSelectedpackageForChange()}
                        selectedDate={selectedDate}
                        fastingDiet={diet}
                        meal={selectedMealForChange}
                        translateY={translateY}
                        selectedMealName={selectedMEalName}
                    />
                </>
            </Modal>
            <Modal
                visible={showShutDownModal}
                onDismiss={() => {
                    setShowShutDownModal(false)
                }}
                style={{ alignItems: 'center', justifyContent: "center" }}
            >
                <View style={styles.shutDownContainer}>
                    <View style={{ paddingTop: moderateScale(20) }}>
                        <Power
                            width={moderateScale(30)}
                            height={moderateScale(30)}
                        />
                    </View>
                    <Text style={[styles.shutDownText, { fontFamily: lang.font, marginTop: moderateScale(20) }]}>{lang.shutDownDietTitle}</Text>
                    <Text style={[styles.shutDownText, { fontFamily: lang.font, marginVertical: moderateScale(20) }]}>{lang.shutDownDietText}</Text>
                    <Text style={[styles.shutDownText, { fontFamily: lang.font, fontSize: moderateScale(14), marginBottom: moderateScale(30) }]}>{lang.shutDownConfirm}</Text>
                    <View style={{ width: "100%", justifyContent: "space-around", flexDirection: "row", marginBottom: moderateScale(25) }}>
                        {
                            shutownLoading ? <ActivityIndicator size={"large"} color={defaultTheme.primaryColor} /> :
                                <>
                                    <ConfirmButton
                                        lang={lang}
                                        title={lang.yes}
                                        style={{ width: moderateScale(150), borderWidth: 1, borderColor: defaultTheme.error, backgroundColor: defaultTheme.lightBackground, elevation: 2 }}
                                        onPress={shutDownWholeDiet}
                                        textStyle={{ color: defaultTheme.error, elevation: 2 }}
                                    />
                                    <ConfirmButton
                                        lang={lang}
                                        title={lang.no}
                                        style={{ backgroundColor: defaultTheme.green, width: moderateScale(150), elevation: 2 }}
                                        onPress={() => setShowShutDownModal(false)}


                                    />
                                </>
                        }
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default DietPlan

const styles = StyleSheet.create({


    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: dimensions.WINDOW_HEIGTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutDownText: {
        fontSize: moderateScale(18),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    shutDownContainer: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: 15,
        backgroundColor: defaultTheme.lightBackground,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: defaultTheme.primaryColor
    },
    tipsContainer: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: defaultTheme.border,
        borderRadius: 10,
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        marginTop: moderateScale(15)
    },
    adviceContaienr: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        padding: moderateScale(20),
        alignSelf: "center",
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: 10,
        elevation: 4,
        marginBottom: moderateScale(15),
        paddingVertical: moderateScale(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 2.27,
    }
})