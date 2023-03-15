import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { setFastingMeal } from '../../redux/actions/fasting'
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
import Power from '../../../res/img/power.svg'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'

PouchDB.plugin(pouchdbSearch);

const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const FastingDietplan = (props) => {

    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const diet = useSelector(state => state.diet)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const [fastingPlan, setFastingPlan] = useState()
    const [selectedpackageForChange, setSelectedpackageForChange] = useState()
    const [selectedMealForChange, setSelectedMealForChange] = useState()
    const [showShutDownModal, setShowShutDownModal] = useState(false)
    const [shutownLoading, setShutownLoading] = useState(false)
    const dispatch = useDispatch()

    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))

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

    const setDiet = () => {
        const data = require('../../utils/diet/dietPackage.json')
        const targetCaloriePerDay = getData()
        const lowRange = targetCaloriePerDay * 0.97
        const hightRange = targetCaloriePerDay * 1.03
        let sahar = [];
        let eftar = [];
        let dinners = [];
        let snack = []

        data.filter((item, index) => {
            if (item.foodMeal == 2) {

                if (item.caloriValue < (hightRange * 0.25) && item.caloriValue > (lowRange * 0.25)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        // console.error(item.caloriValue);
                        dinners = [...dinners, item]
                    }
                }
            }
            if (index == data.length - 1) {

            }
        })

        data.filter((item, index) => {
            if (item.foodMeal == 2) {
                if (item.caloriValue < (hightRange * 0.35) && item.caloriValue > (lowRange * 0.35)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        eftar = [...eftar, item]
                    }
                }
            }
            if (index == data.length - 1) {

            }
        })
        data.filter((item, index) => {
            if (item.foodMeal == 5) {
                if (item.caloriValue < (hightRange * 0.05) && item.caloriValue > (lowRange * 0.05)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        snack = [...snack, item]
                    }

                }
            }
            if (index == data.length - 1) {

            }
        })

        data.filter((item, index) => {
            if (item.foodMeal == 1) {
                if (item.caloriValue < (hightRange * 0.25) && item.caloriValue > (lowRange * 0.25)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        sahar = [...sahar, item]
                    }
                }
            }
            if (index == data.length - 1) {


            }
        })

        const randomGenerators = {
            [moment(selectedDate).format("YYYY-MM-DD")]: {
                '9': randomGenerator(sahar),
                "6": randomGenerator(eftar),
                "7": randomGenerator(snack),
                "3": randomGenerator(dinners),
                "8": randomGenerator(snack),
            }
        }
        dispatch(setFastingMeal(
            {
                [moment(selectedDate).format("YYYY-MM-DD")]: randomGenerators[moment(selectedDate).format("YYYY-MM-DD")],
                allDinner: dinners,
                allSahar: sahar,
                allSnack: snack,
                allEftar: eftar
            }
        ))
        setFastingPlan(randomGenerators[selectedDate])


        const foodMeals = [
            { id: 0, name: "صبحانه" },
            { id: 1, name: "نهار" },
            { id: 2, name: "میان وعده صبح" },
            { id: 3, name: "شام" },
            { id: 4, name: "میان وعده ظهر" },
            { id: 5, name: "میان وعده شب" },
            { id: 6, name: "افطار" },
            { id: 7, name: "میان وعده اول" },
            { id: 8, name: "میان وعده دوم" },
            { id: 9, name: "سحری" },
        ]


    }

    const randomGenerator = (data) => {
        return data[Math.floor(Math.random() * data.length - 1)]
    }

    useEffect(() => {

        // console.warn(randomGenerators.selectedDate);
        if (fastingDiet[selectedDate]) {
            setFastingPlan(fastingDiet[selectedDate])
        } else {
            if (fastingDiet.allDinner.length > 1 &&
                fastingDiet.allSahar.length > 1 &&
                fastingDiet.allSnack.length > 1 &&
                fastingDiet.allEftar.length > 1
            ) {
                const randomPack = {
                    [moment(selectedDate).format("YYYY-MM-DD")]: {
                        '9': { ...randomGenerator(fastingDiet.allSahar), isAte: false },
                        "6": { ...randomGenerator(fastingDiet.allEftar), isAte: false },
                        "7": { ...randomGenerator(fastingDiet.allSnack), isAte: false },
                        "3": { ...randomGenerator(fastingDiet.allDinner), isAte: false },
                        "8": { ...randomGenerator(fastingDiet.allSnack), isAte: false },
                    }
                }
                dispatch(setFastingMeal(
                    {
                        ...randomPack
                    }
                ))
                setFastingPlan(randomPack[selectedDate])
            } else {
                setDiet()

            }
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
        setShutownLoading(true)

    }
    return (
        <>
            <Toolbar
                lang={lang}
                title={"برنامه غذایی"}
                onBack={() => props.navigation.popToTop()}
            />
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
            <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }} stickyHeaderIndices={[1]}>
                {
                    fastingDiet[selectedDate] &&
                    <>
                        < FastingPlanFoodRow
                            title={lang.sahar}
                            pack={fastingDiet[selectedDate]["9"]}
                            foodDB={foodDB}
                            lang={lang}
                            meal={"9"}
                            offlineDB={offlineDB}
                            user={user}
                            auth={auth}
                            selectedDate={selectedDate}
                            mealDB={mealDB}
                            onChangepackage={(e) => {
                                setSelectedpackageForChange(fastingDiet.allBreakFast)
                                setSelectedMealForChange(e)
                            }}
                            fastingDiet={fastingDiet}
                            diet={diet}
                        />
                        <FastingPlanFoodRow
                            title={lang.eftar}
                            pack={fastingDiet[selectedDate]["6"]}
                            foodDB={foodDB}
                            lang={lang}
                            meal={"6"}
                            offlineDB={offlineDB}
                            user={user}
                            auth={auth}
                            selectedDate={selectedDate}
                            mealDB={mealDB}
                            onChangepackage={(e) => {
                                setSelectedpackageForChange(fastingDiet.allLunch)
                                setSelectedMealForChange(e)
                            }}
                            fastingDiet={fastingDiet}
                            diet={diet}

                        />
                        <FastingPlanFoodRow
                            title={lang.snack}
                            pack={fastingDiet[selectedDate]["7"]}
                            foodDB={foodDB}
                            lang={lang}
                            meal={"7"}
                            offlineDB={offlineDB}
                            user={user}
                            auth={auth}
                            selectedDate={selectedDate}
                            mealDB={mealDB}
                            onChangepackage={(e) => {
                                setSelectedpackageForChange(fastingDiet.allDinner)
                                setSelectedMealForChange(e)
                            }}
                            fastingDiet={fastingDiet}
                            diet={diet}
                        />
                        <FastingPlanFoodRow
                            title={lang.dinner}
                            pack={fastingDiet[selectedDate]["3"]}
                            foodDB={foodDB}
                            lang={lang}
                            meal={"3"}
                            offlineDB={offlineDB}
                            user={user}
                            auth={auth}
                            selectedDate={selectedDate}
                            mealDB={mealDB}
                            onChangepackage={(e) => {
                                setSelectedpackageForChange(fastingDiet.allSnack)
                                setSelectedMealForChange(e)
                            }}
                            fastingDiet={fastingDiet}
                            diet={diet}
                        />
                        <FastingPlanFoodRow
                            title={lang.snack}
                            pack={fastingDiet[selectedDate]["8"]}
                            foodDB={foodDB}
                            lang={lang}
                            meal={"8"}
                            offlineDB={offlineDB}
                            user={user}
                            auth={auth}
                            selectedDate={selectedDate}
                            mealDB={mealDB}
                            onChangepackage={(e) => {
                                setSelectedpackageForChange(fastingDiet.allSnack)
                                setSelectedMealForChange(e)
                            }}
                            fastingDiet={fastingDiet}
                            diet={diet}
                        />
                    </>
                }


            </ScrollView>
            <Modal
                visible={selectedpackageForChange}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setSelectedpackageForChange()
                }}
                style={{ alignItems: 'center', justifyContent: "center" }}

            >
                <FastingDietChangeModal
                    selectedPackageForChange={selectedpackageForChange}
                    item={selectedpackageForChange}
                    lang={lang}
                    dismissModal={() => setSelectedpackageForChange()}
                    selectedDate={selectedDate}
                    fastingDiet={fastingDiet}
                    meal={selectedMealForChange}
                />
            </Modal>
            {showShutDownModal ? (
                <TouchableWithoutFeedback onPress={() => setShowShutDownModal(false)}>
                    <View style={styles.wrapper}>
                        <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
                        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, borderRadius: 15, backgroundColor: defaultTheme.lightBackground, alignItems: 'center', borderWidth: 1, borderColor: defaultTheme.primaryColor }}>
                            <View style={{ paddingTop: moderateScale(50) }}>
                                <Power
                                    width={moderateScale(80)}
                                    height={moderateScale(80)}
                                />

                            </View>
                            <Text style={[styles.shutDownText, { fontFamily: lang.font, marginTop: moderateScale(20) }]}>{lang.shutDownDietTitle}</Text>
                            <Text style={[styles.shutDownText, { fontFamily: lang.font, marginVertical: moderateScale(50) }]}>{lang.shutDownDietText}</Text>
                            <Text style={[styles.shutDownText, { fontFamily: lang.font, fontSize: moderateScale(14), marginBottom: moderateScale(40) }]}>{lang.shutDownConfirm}</Text>
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
                    </View>
                </TouchableWithoutFeedback>
            ) : null}
        </>
    )
}

export default FastingDietplan

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
})