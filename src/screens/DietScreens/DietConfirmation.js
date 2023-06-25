import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, Alert } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment, MainToolbar, OFitToolBar } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { useDispatch } from 'react-redux'
import { setIsActive, dietStartDate, addWeekBreakfast, addWeekSnack, addWeekLunch, addWeekDinner, addAllLunch, addAllSnack, addAllDinner, addAllBreakFasts } from '../../redux/actions/diet'
import moment from 'moment'
import { updateTarget, updateSpecification } from '../../redux/actions'
import SetTargetScreen from '../otherScreens/SetTargetScreen'
import { RestController } from '../../classess/RestController'
import { urls } from '../../utils/urls'
import { calculateCalorie } from '../../functions/CalculateDailyCalorie'


function DietConfirmation(props) {

    const alergies = props.route.params.alergiesId
    const dispatch = useDispatch()
    const getDiet = async (calorie) => {
        // const data = require('../../utils/diet/dietPackage.json')
        const targetCaloriePerDay = calculateCalorie({ diet: diet, profile: profile, specification: specification, user: user })
        const RC = new RestController()
        let url = urls.foodBaseUrl + urls.DietPack + urls.GetUserPackage + `?DietCategoryId=${props.route.params.dietId}&DailyCalorie=${targetCaloriePerDay.targetCalorie}`
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
    }
    const onSuccess = async (res) => {
        console.error('ok');
        const data = res.data.data
        console.warn(data);
        let breakfasts = [];
        let lunches = [];
        let dinners = [];
        let snack = []
        data.filter((item, index) => {
            if (item.foodMeal == 3) {
                dinners = [...dinners, item]
            }
            if (index == data.length - 1) {
                if (diet.dinner.length <= 0) {
                    dispatch(addAllDinner(dinners))

                }
                if (diet.weekDinner.length <= 0) {
                    chooseRandomDinners(dinners)
                }
            }
        })

        data.filter((item, index) => {
            if (item.foodMeal == 1) {
                lunches = [...lunches, item]
            }
            if (index == data.length - 1) {
                if (diet.lunch.length <= 0) {
                    dispatch(addAllLunch(lunches))
                }
                if (diet.weekLunch.length == 0) {
                    chooseRandomlunches(lunches)
                }
            }
        })
        data.filter((item, index) => {
            if (item.foodMeal == 5 || item.foodMeal == 2 || item.foodMeal == 4) {
                snack = [...snack, item]

            }
            if (index == data.length - 1) {
                if (diet.snack.length <= 0) {
                    dispatch(addAllSnack(snack))
                }
                if (diet.weekSnack.length <= 0) {
                    //console.warn("this is snack", snack)
                    chooseRandomSnack(snack).then(() => {
                        chooseRandomSnack(snack).then(() => {
                            chooseRandomSnack(snack).then(() => {
                                // setIsChange(!isChange)
                            })
                        })
                    })
                }
            }
        })

        data.filter((item, index) => {
            if (item.foodMeal == 0) {
                breakfasts = [...breakfasts, item]
            }
            if (index == data.length - 1) {
                if (diet.breakfasts.length <= 0) {
                    dispatch(addAllBreakFasts(breakfasts))
                    // //console.warn(breakfasts);
                }
                if (diet.weekBreafkast.length <= 0) {
                    chooseRandomBreakFast(breakfasts)
                    // load(false)
                }

            }
        })
        setTimeout(() => {
            props.navigation.navigate("DietPlanScreen")
        }, 1000);
    }
    const chooseRandomBreakFast = (data) => {
        dispatch(addWeekBreakfast(data[Math.floor(Math.random() * data.length - 1)], moment().format("YYYY-MM-DD")))
        // setIsChange(!isChange)
        return true

    }
    const chooseRandomSnack = async (data) => {
        dispatch(addWeekSnack({ ...data[Math.floor(Math.random() * data.length - 1)], date: moment().format("YYYY-MM-DD"), isAte: false, generatedId: Math.floor(Math.random() * 900000000000) }))
        return true
    }


    const chooseRandomlunches = async (data) => {
        dispatch(addWeekLunch(data[Math.floor(Math.random() * data.length - 1)], moment().format("YYYY-MM-DD")))

        return true
    }
    const chooseRandomDinners = (data) => {
        dispatch(addWeekDinner(data[Math.floor(Math.random() * data.length - 1)], moment().format("YYYY-MM-DD")))

        return true
    }
    console.warn(props.route.params.weightChangeRate);

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

    // console.warn(profile)
    // let activityRate=profile.dailyActivityRate==20?
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
    console.warn(parseInt(props.route.params.targetWeight), parseInt(props.route.params.activityRate), parseInt(props.route.params.weightChangeRate), parseFloat(props.route.params.weight).toFixed(1),);
    const onConfirm = () => {
        if (fastingDiet.isActive) {
            setLoading(true)
            dispatch(dietStartDate(moment().format("YYYY-MM-DD")))
            dispatch(setIsActive(true))
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

                                props.navigation.navigate("FastingDietplan")
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
            dispatch(dietStartDate(moment().format("YYYY-MM-DD")))
            dispatch(setIsActive(true))
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
                                    props.navigation.navigate("DietPlanScreen")
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