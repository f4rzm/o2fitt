import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, Alert } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment, MainToolbar, OFitToolBar } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { useDispatch } from 'react-redux'
import { setIsActive, dietStartDate, addWeekBreakfast, addWeekSnack, addWeekLunch, addWeekDinner, addAllLunch, addAllSnack, addAllDinner, addAllBreakFasts, setDietMeal, shutDownDiet, setOldDietFalse } from '../../redux/actions/dietNew'
import moment from 'moment'
import { updateTarget, updateSpecification } from '../../redux/actions'
import SetTargetScreen from '../otherScreens/SetTargetScreen'
import { RestController } from '../../classess/RestController'
import { urls } from '../../utils/urls'
import { calculateCalorie, calculateCalorieForDietPackage } from '../../functions/CalculateDailyCalorie'
import analytics from '@react-native-firebase/analytics';
import { setActivaitonAndDeativation, setFastingMeal } from '../../redux/actions/fasting'
import InformationModal from '../../components/modals/InformationModal'
import { useNavigation } from '@react-navigation/native'


function DietConfirmation(props) {
    const navigation = useNavigation()
    const alergies = props.route.params.alergiesId
    const dispatch = useDispatch()
    const getDiet = async (calorie) => {
        // const data = require('../../utils/diet/dietPackage.json')
        const targetCaloriePerDay = calculateCalorieForDietPackage({
            diet: diet,
            profile: profile,
            specification: specification,
            user: user,
            weightChangeRate: props.route.params.weightChangeRate,
            weight: props.route.params.weight,
            activityRate: props.route.params.activityRate,
            targetWeight: props.route.params.targetWeight
        })

        const RC = new RestController()
        let url = urls.baseDiet + urls.DietPack + urls.GetUserPackage + `?DietCategoryId=${props.route.params.dietId}&DailyCalorie=${targetCaloriePerDay.targetCalorie}`
        // let url = urls.baseDiet + urls.DietPack + urls.GetUserPackage + `?DietCategoryId=${props.route.params.dietId}&DailyCalorie=1200`
        if (alergies.length > 0) {
            alergies.map((item, index) => {
                if (index == 0) {
                    url = url + `&allergyIds=${item}`
                } else {
                    url = url + `,${item}`
                }

            })
        }
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        }
        RC.get(url, header, onSuccess, onFailure)
    }

    const onFailure = (err) => {
        console.error(err);
        setLoading(false)
        setErrorVisible(true)
        setErrorContext(lang.serverError)
    }

    const randomGenerator = (data) => {
        return data[Math.floor(Math.random() * (data.length - 1))]
    }

    const onSuccess = (res) => {

        if (props.route.params.dietId == 66) {
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
            const data = res.data.data
            let sahars = [];
            let eftars = [];
            let dinners = [];
            let snack1 = []
            let snack2 = []

            data.map((item, index) => {
                if (item.foodMeal == 6) {
                    eftars = [...eftars, item]
                }
                else if (item.foodMeal == 9) {
                    sahars = [...sahars, item]
                }
                if (item.foodMeal == 3) {
                    dinners = [...dinners, item]
                }
                else if (item.foodMeal == 7) {
                    snack1 = [...snack1, item]
                }
                else if (item.foodMeal == 8) {
                    snack2 = [...snack2, item]
                }
            })


            const randomGenerators = {
                [moment().format("YYYY-MM-DD")]: {
                    '9': randomGenerator(sahars),
                    "6": randomGenerator(eftars),
                    "7": randomGenerator(snack1),
                    "3": randomGenerator(dinners),
                    "8": randomGenerator(snack2),
                }
            }
            dispatch(setFastingMeal(
                {
                    [moment().format("YYYY-MM-DD")]: randomGenerators[moment().format("YYYY-MM-DD")],
                    allDinner: dinners,
                    allSahar: sahars,
                    allSnack1: snack1,
                    allSnack2: snack2,
                    allEftar: eftars,
                    startDate:moment().format("YYYY-MM-DD")
                }
            ))
            console.warn({
                // [moment().format("YYYY-MM-DD")]: randomGenerators[moment().format("YYYY-MM-DD")],
                allDinner: dinners,
                allSahar: sahars,
                allSnack1: snack1,
                allSnack2: snack2,
                allEftar: eftars
            });
            dispatch(setOldDietFalse())
            dispatch(dietStartDate(moment().format("YYYY-MM-DD")))
            dispatch(setIsActive(true))
            dispatch(setActivaitonAndDeativation(true))
            setTimeout(() => {
                // navigation.popToTop()
                navigation.navigate("Drawer", { activationDiet: true })
            }, 300);
        } else {
            // Alert.alert('not fasting')
            const data = res.data.data
            let breakfast = [];
            let lunch = [];
            let dinners = [];
            let snack1 = []
            let snack2 = []
            let snack3 = []

            data.map((item, index) => {
                if (item.foodMeal == 3) {
                    dinners = [...dinners, item]
                }
                if (item.foodMeal == 0) {
                    breakfast = [...breakfast, item]
                }
                if (item.foodMeal == 1) {
                    lunch = [...lunch, item]
                }
                if (item.foodMeal == 2) {
                    snack1 = [...snack1, item]
                }
                if (item.foodMeal == 4) {
                    snack2 = [...snack2, item]
                }
                if (item.foodMeal == 5) {
                    snack3 = [...snack3, item]
                }
            })

            const randomGenerators = {
                [moment().format("YYYY-MM-DD")]: {
                    '0': { ...randomGenerator(breakfast), isAte: false },
                    "1": { ...randomGenerator(lunch), isAte: false },
                    "2": { ...randomGenerator(snack1), isAte: false },
                    "3": { ...randomGenerator(dinners), isAte: false },
                    "4": { ...randomGenerator(snack2), isAte: false },
                    "5": { ...randomGenerator(snack3), isAte: false },
                }
            }
            dispatch(setDietMeal(
                {
                    [moment().format("YYYY-MM-DD")]: randomGenerators[moment().format("YYYY-MM-DD")],
                    allDinner: dinners,
                    allBreakfast: breakfast,
                    allSnack1: snack1,
                    allSnack2: snack2,
                    allSnack3: snack3,
                    allLunch: lunch,
                    isActive: true,
                    endDate: moment().add(31, 'days').format("YYYY-MM-DD"),
                    startDate:moment().format("YYYY-MM-DD")
                }
            ))
            dispatch(setOldDietFalse())
            // dispatch(dietStartDate(moment().format("YYYY-MM-DD")))
            dispatch(setIsActive(true))
            setTimeout(() => {
                // navigation.popToTop()
                navigation.navigate("Drawer", { activationDiet: true })

            }, 300);
        }


    }

    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const diet = useSelector(state => state.diet)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const specification = useSelector((state) => state.specification);
    const [activityRate, setActivityRate] = useState(profile.dailyActivityRate)
    const [hardShip, setHardShip] = useState("")
    const [loading, setLoading] = useState(false)
    const [target, setTarget] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)
    const [errorContext, setErrorContext] = useState('')
    // console.warn(profile)

    const foodAlegies = [
        { id: 2403, name: "سویا" },
        { id: 975, name: "بادمجان" },
        { id: 122, name: "شیر" },
        { id: 2226, name: "مغز گردو" },
        { id: 1101, name: "کدو سبز" },
        { id: 983, name: "سیر" },
        { id: 752, name: "کیوی" },
    ]
    useEffect(() => {
        switch (props.route.params.activityRate) {
            case 10: {
                setActivityRate(lang.bedRest.split("*")[0])
                break
            }
            case 20: {
                setActivityRate(lang.veryLittleActivity.split("*")[0])
                break
            }
            case 30: {
                setActivityRate(lang.littleActivity.split("*")[0])
                break
            }
            case 40: {
                setActivityRate(lang.normalLife.split("*")[0])
                break
            }
            case 50: {
                setActivityRate(lang.relativelyActivity.split("*")[0])
                break
            }
            case 60: {
                setActivityRate(lang.veryActivity.split("*")[0])
                break
            }
            case 70: {
                setActivityRate(lang.moreActivity.split("*")[0])
                break
            }
            default: null
        }

        switch (props.route.params.weightChangeRate) {
            case 0: {
                setHardShip("خیلی آسان")
                break
            }
            case 100: {
                setHardShip("خیلی آسان")
                break
            }
            case 200: {
                setHardShip("خیلی آسان")
                break
            }
            case 300: {
                setHardShip("آسان")
                break
            }
            case 400: {
                setHardShip("آسان")
                break
            }
            case 500: {
                setHardShip("متوسط")
                break
            }
            case 600: {
                setHardShip("متوسط")
                break
            }
            case 800: {
                setHardShip("سخت")
                break
            }
            case 1000: {
                setHardShip("خیلی سخت")
                break
            }
            default: null
        }

    }, [])

    useEffect(() => {
        if (parseFloat(props.route.params.weight) < parseFloat(props.route.params.targetWeight)) {
            setTarget("افزایش وزن")
        } else if (parseFloat(props.route.params.weight) > parseFloat(props.route.params.targetWeight)) {
            setTarget("کاهش وزن")
        } else {
            setTarget("ثبات وزن")
        }
    }, [])

    const confirmationData = [
        { title: "نوع برنامه غذایی", describe: target },
        { title: "وزن فعلی", describe: `${props.route.params.weight} کیلوگرم` },
        { title: "وزن هدف", describe: `${props.route.params.targetWeight} کیلوگرم` },
        { title: "میزان فعالیت هفتگی", describe: activityRate },
        { title: "درجه سختی رژیم", describe: hardShip },
    ]

    const onConfirm = () => {
        if (fastingDiet.isActive) {
            setLoading(true)
           
            setTimeout(() => {
                dispatch(
                    updateTarget(
                        {
                            ...profile,
                            targetWeight: parseInt(props.route.params.targetWeight),
                            dailyActivityRate: parseInt(props.route.params.activityRate),
                            weightChangeRate: parseInt(props.route.params.weightChangeRate)
                        },
                        auth,
                        app,
                        user,
                        () => {
                            dispatch(updateSpecification({
                                ...specification[0],
                                _id: Date.now(),
                                insertDate: moment().format("YYYY-MM-DD"),
                                weightSize: parseFloat(props.route.params.weight).toFixed(1),
                            }, auth, app, user, () => {
                                getDiet().then(res => {
                                    // props.navigation.navigate("DietPlanScreen")
                                })
                            }, () => { }))
                            analytics().logEvent('set_fastingDiet')
                        },
                        (err) => {
                            setLoading(false)
                            console.error(err);
                        }
                    )
                )
            }, 800);
        }
        else {
            setLoading(true)
            setTimeout(() => {
                dispatch(
                    updateTarget(
                        {
                            ...profile,
                            targetWeight: parseInt(props.route.params.targetWeight),
                            dailyActivityRate: parseInt(props.route.params.activityRate),
                            weightChangeRate: parseInt(props.route.params.weightChangeRate)
                        },
                        auth,
                        app,
                        user,
                        () => {
                            dispatch(updateSpecification({
                                ...specification[0],
                                _id: Date.now(),
                                insertDate: moment().format("YYYY-MM-DD"),
                                weightSize: parseFloat(props.route.params.weight).toFixed(1),
                            }, auth, app, user, () => {
                                getDiet().then(res => {
                                    // props.navigation.navigate("DietPlanScreen")
                                })

                            }, () => { }))
                            analytics().logEvent('set_normalDiet')
                        },
                        (err) => {
                            setLoading(false)
                            console.error(err);
                        }
                    )
                )
            }, 800);
        }


    }

    return (
        <>
            <OFitToolBar
                BackPressed={() => props.navigation.goBack()}
            />
            <View style={styles.headerContainer}>
                <Text style={{ textAlign: "center", fontSize: moderateScale(20), fontFamily: lang.font, color: defaultTheme.darkText }}>اطلاعات زیر رو تایید میکنین؟</Text>
            </View>
            {
                confirmationData.map((item) => {
                    return (
                        <TouchableOpacity activeOpacity={0.8} style={{ width: dimensions.WINDOW_WIDTH, paddingVertical: moderateScale(20), backgroundColor: defaultTheme.lightBackground, alignSelf: "center", borderRadius: 10, borderBottomColor: defaultTheme.border, borderBottomWidth: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", padding: moderateScale(12), paddingBottom: moderateScale(2), justifyContent: "space-between" }}>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), marginHorizontal: moderateScale(5), color: defaultTheme.mainText }}>{item.title}</Text>
                                <Text style={{ fontFamily: lang.font, paddingHorizontal: moderateScale(13), fontSize: moderateScale(15), color: defaultTheme.darkText }}>{item.describe}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }

            <View style={{ alignSelf: "center", position: "absolute", bottom: moderateScale(20), justifyContent: "center" }}>
                <ConfirmButton
                    lang={lang}
                    title={"تایید و ادامه"}
                    style={{
                        backgroundColor: defaultTheme.green,
                        width: dimensions.WINDOW_WIDTH * 0.45,
                        height: moderateScale(45)
                    }}
                    onPress={onConfirm}
                    isLoading={loading}
                />
                {
                    loading &&
                    <Text style={{ textAlign: "center", fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>در حال دریافت برنامه غذایی</Text>
                }
            </View>

            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />

        </>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
        marginTop: moderateScale(-20),
        paddingBottom: moderateScale(6),
    },
    firstCard: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        paddingBottom: moderateScale(15),
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 15,
        alignSelf: "center",
        marginVertical: moderateScale(15),
        zIndex: 1
    },
    subFirstComponent: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: moderateScale(10),
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
    },
    checkBox: {
        width: moderateScale(25),
        height: moderateScale(25),
        borderWidth: 1,
        borderColor: defaultTheme.primaryColor,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: moderateScale(5)
    },
    checkBoxText: {
        fontSize: moderateScale(16),
        marginHorizontal: moderateScale(10)
    },
    button2: {
        width: dimensions.WINDOW_WIDTH * 0.3,
    },
    button3: {
        width: dimensions.WINDOW_WIDTH * 0.3,
        backgroundColor: "white",
    },
    button4: {

        backgroundColor: defaultTheme.green,
    },
    AnimatedModal: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: "white",
        top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        paddingBottom: moderateScale(15)
    },
    set: {
        backgroundColor: defaultTheme.green,
        alignSelf: "center",

    }

})
export default DietConfirmation