import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, BackHandler, TouchableWithoutFeedback, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { defaultTheme } from '../../constants/theme'
import { useSelector, useDispatch } from 'react-redux'
import BreakFast from '../../../res/img/breakfast.svg'
import ChangePackage from '../../../res/img/changePackage.svg'
import { Switch } from 'react-native-paper'
import { Calendar, MainToolbar, DietDaily, ConfirmButton, ChangePackageModal, DietCalendar, Information, Toolbar } from '../../components'
import moment from 'moment'
import { addAllBreakFasts, addAllDinner, addAllLunch, addWeekBreakfast, addWeekDinner, addWeekLunch, changeData, updateTarget } from '../../redux/actions/index'
import { Bar } from 'react-native-progress'
import { Modal } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RestController } from '../../classess/RestController'
import { urls } from '../../utils/urls'
import { allMeasureUnits } from '../../utils/measureUnits'
import axios from 'axios'
import { addAllSnack, addCheeteDay, addWeekSnack, calculatePercent, changeBreakfastAte, changeDinnerAte, changeDinnerData, changeLunchAte, changeLunchData, changeSnackAte, changeSnackData, clearDiet } from '../../redux/actions/diet'
import CheatDay from '../../../res/img/cheetDay.svg'
import InformationModal from '../../components/modals/InformationModal'
import { BlurView } from '@react-native-community/blur'
import Power from '../../../res/img/power.svg'
import LottieView from 'lottie-react-native'
import { advices } from '../../utils/Advice'
import analytics from '@react-native-firebase/analytics';
import Info from '../../../res/img/info4.svg'
import FullEatenModal from '../../components/FullEatenModal'
import EndingPlan from '../../components/EndingPlan'

import pouchdbSearch from 'pouchdb-find';
import PouchDB from '../../../pouchdb';
PouchDB.plugin(pouchdbSearch);

const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

function DietPlan(props) {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const diet = useSelector(state => state.diet)
    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)

    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))
    const [selectedDateLunch, setSelectedDateLunch] = useState()
    const [selectedDateDinner, setselectedDateDinner] = useState()
    const [selectedDateBreakFast, setSelectedDateBreakFast] = useState()
    const [selectedDateSnack, setSelectedDateSnack] = useState()
    const [lunchFocuse, setLunchFocuse] = useState(false)
    const [dinnerFocus, setDinnerFocus] = useState(false)
    const [loading, setLoading] = useState(true)
    const [snackFocuse10, setSnackFocuse10] = useState(false)
    const [snackFocuse11, setSnackFocuse11] = useState(false)
    const [snackFocuse12, setSnackFocuse12] = useState(false)
    const [showShutDownModal, setShowShutDownModal] = useState(false)
    const [isCheetDay, setIsCheetDay] = useState(false)
    const [cheetDayModal, setCheetDayModal] = useState(false)
    const [breakfastFocus, setBreakfastFocus] = useState(false)
    const [isChange, setIsChange] = useState(false)
    const [footerLoading, setFooterLoading] = useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [errorContext, setErrorContext] = useState("")
    const [hasNetwork, setHasNetwork] = useState(true)
    const [noInternetLoad, setnoInternetLoad] = useState(false)
    const translateY = useRef(new Animated.Value(100)).current
    const [shutownLoading, setShutownLoading] = useState(false)
    const [advice, setAdvice] = useState()
    const [fullDayAteModal, setFullDayAteModal] = useState(false)
    const [planingDone, setPlaningDone] = useState(false)
    console.warn(diet.dietStartDate);

    const dispatch = useDispatch()

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


    const goBack = () => {
        props.navigation.popToTop()
        return true
    }
    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", goBack);

        return () => BackHandler.removeEventListener("hardwareBackPress", goBack);
    }, [isChange])

    const getDiet = () => {
        const data = require('../../utils/diet/dietPackage.json')
        const targetCaloriePerDay = getData()
        const lowRange = targetCaloriePerDay * 0.97
        const hightRange = targetCaloriePerDay * 1.03
        let breakfasts = [];
        let lunches = [];
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
                if (diet.dinner.length <= 0) {
                    dispatch(addAllDinner(dinners))

                }
                if (diet.weekDinner.length <= 0) {
                    chooseRandomDinners(dinners)
                }
            }
        })

        data.filter((item, index) => {
            if (item.foodMeal == 2) {
                if (item.caloriValue < (hightRange * 0.35) && item.caloriValue > (lowRange * 0.35)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        lunches = [...lunches, item]
                    }
                }
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
            if (item.foodMeal == 5) {
                if (item.caloriValue < (hightRange * 0.05) && item.caloriValue > (lowRange * 0.05)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        snack = [...snack, item]
                    }

                }
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
                                setIsChange(!isChange)
                            })
                        })
                    })
                }
            }
        })

        const filterdietBreakFast = data.filter((item, index) => {
            if (item.foodMeal == 1) {
                if (item.caloriValue < (hightRange * 0.25) && item.caloriValue > (lowRange * 0.25)) {
                    let ar = item.dietPackAlerges.filter(item => diet.foodAlergies.includes(item))
                    if (ar.length <= 0) {
                        breakfasts = [...breakfasts, item]
                    }
                }
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
    }

    useEffect(() => {
        if (diet.dinner.length <= 0 || diet.lunch.length <= 0 || diet.breakfasts.length <= 0 || diet.snack.length <= 0) {
            getDiet()
            analytics().logEvent('userGetDiet')
        }
    }, [])


    const chooseRandomBreakFast = (data) => {
        dispatch(addWeekBreakfast(data[Math.floor(Math.random() * data.length - 1)], moment(selectedDate, 'YYYY-MM-DD').format("YYYY-MM-DD")))
        // setIsChange(!isChange)
        return true

    }
    const chooseRandomSnack = async (data) => {
        dispatch(addWeekSnack({ ...data[Math.floor(Math.random() * data.length - 1)], date: moment(selectedDate, 'YYYY-MM-DD').format("YYYY-MM-DD"), isAte: false, generatedId: Math.floor(Math.random() * 900000000000) }))
        return true
    }


    const chooseRandomlunches = async (data) => {
        dispatch(addWeekLunch(data[Math.floor(Math.random() * data.length - 1)], moment(selectedDate, 'YYYY-MM-DD').format("YYYY-MM-DD")))

        return true
    }
    const chooseRandomDinners = (data) => {
        dispatch(addWeekDinner(data[Math.floor(Math.random() * data.length - 1)], moment(selectedDate, 'YYYY-MM-DD').format("YYYY-MM-DD")))

        return true
    }

    const renderItem = (item) => {
        return <DietDaily foodDB={foodDB} auth={auth} item={item} lang={lang} value={item.item.value} />
    }

    const renderHeader = (headerText, nutrientValue) => {
        return (
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, height: moderateScale(50), backgroundColor: defaultTheme.grayBackground, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: defaultTheme.border, justifyContent: 'center' }}>
                <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <BreakFast
                            width={moderateScale(30)}
                        />
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{headerText}</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{parseInt(nutrientValue)} کالری </Text>
                </View>
            </View>
        )
    }


    const renderFooter = (id, modalId) => {
        let data = modalId == 0 ? selectedDateBreakFast[0] : modalId == 1 ? selectedDateLunch[0] : modalId == 3 ? selectedDateDinner[0] : modalId == 10 ? selectedDateSnack[0] : modalId == 11 ? selectedDateSnack[1] : modalId == 12 ? selectedDateSnack[2] : []
        if (footerLoading) {
            return (
                <View style={{ height: moderateScale(45), width: "70%", alignSelf: "center", borderRadius: 13, borderColor: defaultTheme.primaryColor, backgroundColor: defaultTheme.lightBackground, marginVertical: moderateScale(10), alignItems: "center", justifyContent: 'center' }}>
                    <LottieView
                        source={require('../../../res/animations/loading.json')}
                        autoPlay={true}
                        loop={true}
                        style={{ width: moderateScale(30), height: moderateScale(30) }}
                    />
                </View>
            )
        } else {
            if (data.isAte == false) {
                return (
                    <View style={{ justifyContent: "space-around", flexDirection: "row", padding: 15 }}>
                        <TouchableOpacity onPress={() => getFromDb(id, modalId)} activeOpacity={0.8} style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, backgroundColor: defaultTheme.primaryColor, alignItems: "center", padding: moderateScale(10) }}>
                            <Image
                                source={require('../../../res/img/done.png')}
                                style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain" }}
                            />
                            <Text style={{ color: "white", fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>ثبت در روزانه</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showModal(modalId)} activeOpacity={0.8} style={{ height: moderateScale(42), justifyContent: "center", flexDirection: "row", borderRadius: 10, alignItems: "center", borderColor: defaultTheme.border, borderWidth: 1, paddingHorizontal: moderateScale(15) }}>
                            <ChangePackage />
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5), color: defaultTheme.darkText }}>تعویض برنامه</Text>
                        </TouchableOpacity>

                    </View>
                )


            } else {
                return (
                    <>
                        <TouchableOpacity onPress={() => removeFromServer(id, modalId)} activeOpacity={0.8}
                            style={{ width: "70%", height: moderateScale(45), justifyContent: "center", flexDirection: "row", borderRadius: 10, alignItems: "center", padding: moderateScale(10), borderColor: defaultTheme.error, borderWidth: 0.7, alignSelf: "center", marginVertical: moderateScale(10), elevation: 5, backgroundColor: defaultTheme.lightBackground }}
                        >
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.error }}>لغو</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        }

    }

    const nextDayPressed = async () => {
        load(true)
        let nDay = moment(selectedDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
        await AsyncStorage.setItem("dietDate", nDay)
        setSelectedDate(nDay)
    }
    const prevDayPressed = async () => {
        load(true)
        let PDay = moment(selectedDate, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
        await AsyncStorage.setItem("dietDate", PDay)
        setSelectedDate(PDay)
    }
    const showCalendar = () => {

    }

    const removeFromServer = (id, modalId) => {

        setFooterLoading(true)
        let selectedpackage = modalId == 0 ? selectedDateBreakFast[0] : modalId == 1 ? selectedDateLunch[0] : modalId == 3 ? selectedDateDinner[0] : modalId == 10 ? selectedDateSnack[0] : modalId == 11 ? selectedDateSnack[1] : modalId == 12 ? selectedDateSnack[2] : []

        selectedpackage.dietPackFoods.forEach((element, index) => {

            offlineDB.allDocs({ include_docs: false }).then((records) => {

                offlineDB.post({
                    method: "delete",
                    type: "meal",
                    url: urls.foodBaseUrl2 + urls.userTrackFood + `?_id=${element.serverId}`,
                    header: { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } },
                    params: { ...element },
                    index: records.total_rows
                }).then(res => {
                    //console.log(res)
                    removeMealDB(res, element, id, selectedpackage.dietPackFoods, index, selectedpackage)

                })
            })
            // const url = urls.foodBaseUrl + urls.userTrackFood + `?_id=${element.serverId}`
            // const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
            // const params = {}

            // const RC = new RestController()
            // RC.checkPrerequisites("delete", url, params, header, (res) => removeMealSuccess(res, element, id, selectedpackage.dietPackFoods, index, selectedpackage), (err) => removeMealFailure(err, element, id, selectedpackage.dietPackFoods, index, selectedpackage), auth, onRefreshTokenSuccess, onRefreshTokenFailure)
            // if ((selectedpackage.dietPackFoods.length - 1) == index) {

            // }

        });

    }
    
    const removeMealDB = (res, element, id, selectedpackage, index, wholePackage) => {
        console.warn('element', element);
        if (selectedpackage.length - 1 == index) {
            let percent = diet.percent - 0.55
            dispatch(calculatePercent(percent))


            if (id == 0) {
                dispatch(changeBreakfastAte(selectedDate, false))
            } else if (id == 1) {
                dispatch(changeLunchAte(selectedDate, false))
            } else if (id == 3) {
                dispatch(changeDinnerAte(selectedDate, false))
            } else if (id == 2) {
                dispatch(changeSnackAte(selectedDate, false, wholePackage.generatedId))
            }
            setTimeout(() => {
                setIsChange(!isChange)
                setFooterLoading(false)
            }, 1500);
        }

        mealDB.find({
            selector: { _id: element.serverId }
        }).then(rec => {
            if (rec.docs.length > 0) {
                mealDB.put({ ...rec.docs[0], _deleted: true }).then(() => {
                    // setErrorContext(lang.successful)
                    // setErrorVisible(true)
                    //   Toast.show({
                    //     type: "success",
                    //     props: { text2: lang.successful, style: { fontFamily: lang.font } },
                    //     visibilityTime: 800,

                    //   })
                })
                // getMealFromDB(selectedDate)
            }
        })
    }

    const removeMealSuccess = (res, element, id, selectedpackage, index, wholePackage) => {

        if (selectedpackage.length - 1 == index) {
            let percent = diet.percent - 0.55
            dispatch(calculatePercent(percent))


            if (id == 0) {
                dispatch(changeBreakfastAte(selectedDate, false))
            } else if (id == 1) {
                dispatch(changeLunchAte(selectedDate, false))
            } else if (id == 3) {
                dispatch(changeDinnerAte(selectedDate, false))
            } else if (id == 2) {
                dispatch(changeSnackAte(selectedDate, false, wholePackage.generatedId))
            }
            setTimeout(() => {
                setIsChange(!isChange)
                setFooterLoading(false)
            }, 1500);
        }
        // let data = id == 0 ? selectedDateBreakFast[0] : id == 1 ? selectedDateLunch[0] : id == 3 ? selectedDateDinner[0] : null



    }
    const removeMealFailure = (err, element, id, selectedpackage, index, wholePackage) => {
        // alert(err.message)
        // console.error("faild to remove", element)
        if (`${err.message}` == "Network Error") {
            if (selectedpackage.length - 1 == index) {

                setErrorVisible(true)
                setErrorContext(lang.noInternet)
            }
        } else {
            if (selectedpackage.length - 1 == index) {
                let percent = diet.percent - 0.55
                dispatch(calculatePercent(percent))
                setTimeout(() => {
                    setIsChange(!isChange)
                    setFooterLoading(false)
                }, 1500);

            }
            // let data = id == 0 ? selectedDateBreakFast[0] : id == 1 ? selectedDateLunch[0] : id == 3 ? selectedDateDinner[0] : null

            if (id == 0) {
                dispatch(changeBreakfastAte(selectedDate, false))
            } else if (id == 1) {
                dispatch(changeLunchAte(selectedDate, false))
            } else if (id == 3) {
                dispatch(changeDinnerAte(selectedDate, false))
            } else if (id == 2) {
                dispatch(changeSnackAte(selectedDate, false, wholePackage.generatedId))
            }
        }
        //console.error(err);
    }


    const getFromDb = async (id, mealId) => {
        
        setFooterLoading(true)

        let data = mealId == 0 ? selectedDateBreakFast[0] : mealId == 1 ? selectedDateLunch[0] : mealId == 3 ? selectedDateDinner[0] : mealId == 10 ? selectedDateSnack[0] : mealId == 11 ? selectedDateSnack[1] : mealId == 12 ? selectedDateSnack[2] : null

        await data.dietPackFoods.forEach(async (item, index) => {

            // let url = urls.foodBaseUrl + urls.food + `?foodId=${item.foodId}`
            // const header = {
            //     headers: {
            //         Authorization: 'Bearer ' + auth.access_token,
            //         Language: lang.capitalName,
            //     },
            // };

            await foodDB.get(`${item.foodName}_${item.foodId}`)
                .then(async (records) => {
                    console.warn('getFromDB records', records);
                    sendFoodsToServer(records, item, id, data, index)
                }).catch((err) => {
                    console.error(err);
                })

            // await axios.get(url, header).then(async (response) => {
            //     sendFoodsToServer(response.data.data, item, id, data, index)
            // }).catch((err) => {
            //     if (index === data.dietPackFoods.length - 1) {
            //         setErrorVisible(true)
            //         setErrorContext(lang.noInternet)
            //         setFooterLoading(false)
            //     }
            // })
        })
        analytics().logEvent('set_diet_meal');
    }

    const sendFoodsToServer = async (data, packages, id, packageData, indexing) => {

        // alert(packageData.dietPackFoods.length)

        const filteredNutrie = allMeasureUnits.filter((item) => item.id == packages.measureUnitId)
        const nutrientValue = data.nutrientValue.map((item) => (item * packages.value * filteredNutrie[0].value) / 100)
        // //console.error(packages.foodName, nutrientValue);
        const params = {
            id: 0,
            foodId: packages.foodId,
            value: packages.value,
            foodName: packages.foodName,
            userId: user.id,
            foodMeal: id,
            insertDate: selectedDate,
            foodNutrientValue: nutrientValue,
            measureUnitId: packages.measureUnitId,
            measureUnitName: packages.measureUnitName,
            personalFoodId: '',
            _id: `${user.id}${Date.now().toString()}`
        }
        console.warn(params);

        offlineDB.allDocs({ include_docs: false }).then((records) => {
            // console.log('records', records.total_rows);
            offlineDB.post({
                method: 'post',
                type: 'meal',
                url: urls.foodBaseUrl + urls.userTrackFood,
                header: {
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token,
                        Language: lang.capitalName,
                    },
                },
                params: params,
                index: records.total_rows
            })
                .then((res) => {
                    // console.log(res);
                    // saveToDB({
                    //     ...params,
                    //     foodId: packages.foodId,
                    // });
                    onSuccess(params, id, packages, packageData, indexing)
                });
        })
        const url = urls.foodBaseUrl + urls.userTrackFood;
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };

        // const CancelToken = axios.CancelToken;
        // const source = CancelToken.source();
        // const timeout = setTimeout(() => {
        //     source.cancel();
        // }, 2000)

        // axios.post(url, params, header)
        //     .then((response) => {
        //         // clearTimeout(timeout)
        //         onSuccess(response, id, packages, packageData, indexing)
        //     })
        //     .catch((err) => {
        //         // clearTimeout(timeout)
        //         onFailure(err, id, packages, packageData, indexing, params)
        //     })


        // console.error("e");
    }

    const onSuccess = (params, id, packages, packageData, indexing) => {

        saveToDB({
            ...params
        });

        if (id == 0) {
            dispatch(changeData(id, params, packages, selectedDate))
        } else if (id == 1) {
            dispatch(changeLunchData(id, params, packages, selectedDate))
        } else if (id == 3) {
            dispatch(changeDinnerData(id, params, packages, selectedDate))
        } else if (id == 2) {
            dispatch(changeSnackData(id, params, packages, selectedDate, packageData.generatedId))
        }
        if (indexing == packageData.dietPackFoods.length - 1) {

            let percent = diet.percent + 0.55
            setTimeout(() => {
                dispatch(calculatePercent(percent))
                setFooterLoading(false)
                setIsChange(!isChange)
            }, 1000);

        }
    }

    const saveToDB = (meal) => {
        console.log('saved meal', meal);
        mealDB
            .find({
                selector: { _id: meal._id },
            })
            .then((records) => {
                console.log('rec =>', records);
                if (records.docs.length === 0) {
                    mealDB.put(meal, () => {
                        // setSaving(false);
                    });
                } else {
                    mealDB.put(
                        { ...meal, _id: records.docs[0]._id, _rev: records.docs[0]._rev },
                        () => {
                            // setSaving(false);
                        },
                    );
                }
            });
        analytics().logEvent('setMeal', {
            id: meal.foodMeal,
        });
    };


    const onFailure = (err, id, packages, packageData, indexing, params) => {

        offlineDB
            .post({
                method: 'post',
                type: 'meal',
                url: urls.foodBaseUrl + urls.userTrackFood,
                header: {
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token,
                        Language: lang.capitalName,
                    },
                },
                params: params,
            })
            .then((res) => {
                console.log(res);
                saveToDB({
                    ...params,
                    foodId: params.foodId,
                });
            });
        console.error(err);

        if (indexing == packageData.dietPackFoods.length - 1) {

            let percent = diet.percent + 0.55
            setTimeout(() => {
                dispatch(calculatePercent(percent))
                setFooterLoading(false)
                setIsChange(!isChange)
            }, 1500);

        }
        if (id == 0) {
            dispatch(changeData(id, response.data.data, packages, selectedDate))
        } else if (id == 1) {
            dispatch(changeLunchData(id, response.data.data, packages, selectedDate))
        } else if (id == 3) {
            dispatch(changeDinnerData(id, response.data.data, packages, selectedDate))
        } else if (id == 2) {
            dispatch(changeSnackData(id, response.data.data, packages, selectedDate, packageData.generatedId))
        }

        // if (indexing === packageData.dietPackFoods.length - 1) {
        //     setErrorVisible(true)
        //     setErrorContext(lang.noInternet)
        // }
        // setFooterLoading(false)
        //console.error(err)

    }

    const onRefreshTokenSuccess = () => { };

    const onRefreshTokenFailure = () => { };

    const setAllData = async () => {
        setselectedDateDinner()
        setSelectedDateBreakFast()
        setSelectedDateLunch()
        setSelectedDateSnack()
        setnoInternetLoad(true)

        let selectedBreakFast = diet.weekBreafkast.filter((item) => item.date == selectedDate)
        let selectedlunch = diet.weekLunch.filter((item) => item.date == selectedDate)
        let selectedDinner = diet.weekDinner.filter((item) => item.date == selectedDate)
        let selectedSnack = diet.weekSnack.filter((item) => item.date == selectedDate)

        if (diet.lunch.length > 0 || diet.dinner.length > 0 || diet.breakfasts.length > 0 || diet.snack.length > 0) {
            if (selectedDinner.length <= 0 || selectedlunch.length <= 0 || selectedBreakFast.length <= 0 || selectedSnack.length <= 2) {
                //console.error("generate");
                chooseRandomBreakFast(diet.breakfasts)
                chooseRandomDinners(diet.dinner)
                chooseRandomlunches(diet.lunch)
                chooseRandomSnack(diet.snack).then(() => {
                    chooseRandomSnack(diet.snack).then(() => {
                        chooseRandomSnack(diet.snack).then(() => {
                            setIsChange(!isChange)
                        })
                    })
                })
            } else {
                if (selectedBreakFast[0].isAte == true && selectedlunch[0].isAte == true && selectedSnack[0].isAte == true && selectedDinner[0].isAte == true && selectedSnack[1].isAte == true && selectedSnack[2].isAte == true) {
                    setFullDayAteModal(true)

                    setTimeout(() => {
                        setFullDayAteModal(false)
                    }, 4000);

                }
                setSelectedDateBreakFast(selectedBreakFast)
                setSelectedDateLunch(selectedlunch)
                setSelectedDateSnack(selectedSnack)
                setselectedDateDinner(selectedDinner)
                load(false)
            }

        }
        let ischeet = diet.cheetDays.indexOf(selectedDate)
        setIsCheetDay(ischeet == -1 ? false : true)
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };
        axios.get("https://identity.o2fitt.com/api/v1/Users/DayOfWeeks", header).then(() => {
            setHasNetwork(true)
            setnoInternetLoad(false)
        }).catch(() => {
            setHasNetwork(false)
            setnoInternetLoad(false)
        })
    }

    useEffect(() => {
        setAllData()

    }, [selectedDate, isChange, app.networkConnectivity])


    const showModal = (id) => {
        if (id == 0) {
            setBreakfastFocus(true)
        } else if (id == 3) {
            setDinnerFocus(true)
        } else if (id == 1) {
            setLunchFocuse(true)
        }
        else if (id == 10) {
            setSnackFocuse10(true)
        }
        else if (id == 11) {
            setSnackFocuse11(true)
        }
        else if (id == 12) {
            setSnackFocuse12(true)
        }
        Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true
        }).start()

    }
    const onCheetDayPressed = () => {
        load(true)
        let index = diet.cheetDays.indexOf(selectedDate)
        if (diet.cheetDays.length <= 1) {
            if (index == -1) {
                dispatch(addCheeteDay([...diet.cheetDays, selectedDate]))
                setIsCheetDay(true)
                load(false)
            }
            if (index >= 0) {
                let cheetDay = diet.cheetDays.filter(item => item != selectedDate)
                dispatch(addCheeteDay(cheetDay))
                setIsCheetDay(false)
                load(false)
            }

        } else {
            if (index != -1) {
                let cheetDay = diet.cheetDays.filter(item => item != selectedDate)
                dispatch(addCheeteDay(cheetDay))
                setIsCheetDay(false)
                setIsChange(!isChange)
                setTimeout(() => {
                    load(false)
                }, 500)
            } else {
                setCheetDayModal(true)
                load(false)
            }
        }

    }

    const load = (load) => {
        setLoading(load)
    }
    const dietShutDown = () => {

        // dispatch(clearDiet())
        setShowShutDownModal(true)
        // props.navigation.replace("Tabs")
    }
    const shutDownWholeDiet = () => {
        setShutownLoading(true)
        setTimeout(() => {
            dispatch(
                updateTarget(
                    diet.oldData,
                    auth,
                    app,
                    user,
                    () => {
                        dispatch(clearDiet())
                        analytics().logEvent('cancel_Diet')
                        props.navigation.popToTop()
                        setShutownLoading(false)
                    },
                    (err) => {
                        // alert(err.message)
                        setShutownLoading(false)
                    }

                )
            )
        }, 700);

    }
    // useEffect(() => {
    //     console.error(diet.oldData);
    // }, [])
    const closeModal = (selectedMeal) => {
        if (selectedMeal == 1) {
            setBreakfastFocus(false)
        }
        if (selectedMeal == 2) {
            setLunchFocuse(false)
        }
        if (selectedMeal == 3) {
            setDinnerFocus(false)
        }
        if (selectedMeal == 4) {
            setSnackFocuse10(false)
            setSnackFocuse11(false)
            setSnackFocuse12(false)
        }
    }
    const renderFoods = () => {
        if (selectedDateSnack && selectedDateDinner && selectedDateLunch && selectedDateBreakFast) {
            return <View style={{ alignItems: "center" }}>
                <FlatList
                    data={selectedDateBreakFast[0].dietPackFoods}
                    ListFooterComponent={() => renderFooter(0, 0)}
                    contentContainerStyle={styles.flatList}
                    ListHeaderComponent={() => renderHeader(lang.breakfast, selectedDateBreakFast[0].nutrientValue.split(",")[23])}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />

                <FlatList
                    data={selectedDateSnack[0].dietPackFoods}
                    contentContainerStyle={styles.flatList}
                    ListFooterComponent={() => renderFooter(2, 10)}
                    renderItem={renderItem}
                    ListHeaderComponent={() => renderHeader(lang.snack1, selectedDateSnack[0].nutrientValue == undefined ? "0" : selectedDateSnack[0].nutrientValue.split(",")[23])}
                    scrollEnabled={false}

                />

                <FlatList
                    data={selectedDateLunch[0].dietPackFoods == undefined ? null : selectedDateLunch[0].dietPackFoods}
                    contentContainerStyle={styles.flatList}
                    ListFooterComponent={() => renderFooter(1, 1)}
                    renderItem={renderItem}
                    ListHeaderComponent={() => renderHeader(lang.lunch, selectedDateLunch[0].nutrientValue.split(",")[23])}
                    scrollEnabled={false}

                />
                <FlatList
                    data={selectedDateSnack[1].dietPackFoods == undefined ? null : selectedDateSnack[1].dietPackFoods}
                    contentContainerStyle={styles.flatList}
                    ListFooterComponent={() => renderFooter(2, 11)}
                    renderItem={renderItem}
                    ListHeaderComponent={() => renderHeader(lang.snack2, selectedDateSnack[1].nutrientValue == undefined ? "0" : selectedDateSnack[1].nutrientValue.split(",")[23])}
                    scrollEnabled={false}

                />

                <FlatList
                    data={selectedDateDinner[0].dietPackFoods == undefined ? null : selectedDateDinner[0].dietPackFoods}
                    contentContainerStyle={styles.flatList}
                    ListFooterComponent={() => renderFooter(3, 3)}

                    renderItem={renderItem}
                    ListHeaderComponent={() => renderHeader(lang.dinner, selectedDateDinner[0].nutrientValue.split(",")[23])}
                    scrollEnabled={false}

                />

                <FlatList
                    data={selectedDateSnack[2].dietPackFoods == undefined ? null : selectedDateSnack[2].dietPackFoods}
                    contentContainerStyle={styles.flatList}
                    ListFooterComponent={() => renderFooter(2, 12)}
                    renderItem={renderItem}
                    ListHeaderComponent={() => renderHeader(lang.snack3, selectedDateSnack[2].nutrientValue == undefined ? "0" : selectedDateSnack[2].nutrientValue.split(",")[23])}
                    scrollEnabled={false}

                />
            </View>
        }
    }

    const renderingItems = () => {

        // if (hasNetwork) {
            if (moment(diet.dietStartDate).add(30, 'days').format("YYYYMMDD") > moment(selectedDate).format("YYYYMMDD")) {

                if (loading) {
                    return <View style={{ justifyContent: "center", alignItems: "center", padding: moderateScale(50) }}>
                        <ActivityIndicator color={defaultTheme.primaryColor} size={"large"} />
                    </View>
                } else {
                    if (isCheetDay) {
                        return (
                            <View style={{ flexDirection: "row", height: moderateScale(225), alignItems: "center", justifyContent: "space-around", width: dimensions.WINDOW_WIDTH * 0.90, top: moderateScale(-25) }}>
                                <LottieView
                                    source={require('../../../res/animations/cheet.json')}
                                    style={{ width: moderateScale(180), height: moderateScale(180), alignSelf: "center" }}
                                    autoPlay={true}
                                    loop={false}
                                />
                                <View>
                                    <Text style={{ alignSelf: "center", fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(16), }}>امروز روز آزاد شماست</Text>
                                    <Text style={{ alignSelf: "center", fontFamily: lang.font, color: defaultTheme.mainText, fontSize: moderateScale(12), textAlign: "center", lineHeight: moderateScale(23), width: dimensions.WINDOW_WIDTH * 0.60 }}>{lang.cheetDayTitle}</Text>
                                </View>
                            </View>
                        )
                    }
                    else {
                        return renderFoods()
                    }
                }
            } else {
                return <EndingPlan
                    lang={lang}
                    onReject={() => {
                        dispatch(clearDiet())
                        analytics().logEvent('reject_getting_diet')
                        props.navigation.popToTop()

                    }}
                    onAccept={() => {
                        dispatch(clearDiet())
                        analytics().logEvent('get_new_diet')
                        props.navigation.navigate("DietStartScreen")

                    }}
                    diet={diet}
                />
            }


        // } else {
        //     return (
        //         <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: moderateScale(30) }}>
        //             <View style={{ flexDirection: "row", alignItems: "center" }}>
        //                 <Image
        //                     source={require("../../../res/img/cross.png")}
        //                     style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain", tintColor: defaultTheme.error }}
        //                 />
        //                 <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), textAlign: "left" }}>{lang.noInternet}</Text>
        //             </View>
        //             <ConfirmButton
        //                 lang={lang}
        //                 title={lang.tryAgin}
        //                 style={{ alignSelf: 'center', marginVertical: moderateScale(20), width: moderateScale(150), backgroundColor: defaultTheme.green }}
        //                 onPress={() => {
        //                     setnoInternetLoad(true)
        //                     setTimeout(() => {
        //                         setIsChange(!isChange)
        //                     }, 100);
        //                 }}
        //                 isLoading={noInternetLoad}
        //             />
        //         </View>
        //     )
        // }
    }

    return (
        <SafeAreaView style={{}}>
            <View>
                <Toolbar
                    lang={lang}
                    title={"برنامه غذایی"}
                    onBack={() => props.navigation.popToTop()}
                />

                <View style={{}}>
                    <DietCalendar
                        lang={lang}
                        onNext={nextDayPressed}
                        onBack={prevDayPressed}
                        calendarPressed={showCalendar}
                        selectedDate={selectedDate}
                        user={user}
                        diet={diet}
                        onPressShutDown={dietShutDown}
                        profile={profile}
                    />
                </View>
                <ScrollView style={{ flexGrow: 1, height: dimensions.WINDOW_HEIGTH }} showsVerticalScrollIndicator={false}>
                    <>
                        <View style={{
                            width: dimensions.WINDOW_WIDTH * 0.9, padding: moderateScale(5), alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: 10, elevation: 4, paddingBottom: moderateScale(35), marginTop: moderateScale(20), shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.34,
                            shadowRadius: 2.27,
                        }}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(15), padding: moderateScale(5), color: defaultTheme.darkText, textAlign: "left" }}> نمودار پیشرفت</Text>
                            <Bar
                                progress={diet.percent.toFixed(0) * 0.01}
                                width={dimensions.WINDOW_WIDTH * 0.85}
                                color={defaultTheme.green}
                                unfilledColor={defaultTheme.border}
                                borderColor={"rgba(0,0,0,0)"}

                                height={moderateScale(10)}
                                borderRadius={50}
                                style={{ transform: [{ rotate: "180deg" }], alignSelf: "center", marginTop: moderateScale(15) }}
                                useNativeDriver={true}
                            />
                            <View style={{ width: dimensions.WINDOW_WIDTH * 0.85, backgroundColor: "red", alignSelf: "center" }}>
                                <View style={{ right: `${diet.percent.toFixed(0)}%`, backgroundColor: defaultTheme.green, position: 'absolute', borderRadius: 10, borderTopRightRadius: 0 }}>
                                    <Text style={{ color: "white", padding: moderateScale(2) }}>{diet.percent.toFixed(0)}%</Text>
                                </View>
                            </View>
                            {/* <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), padding: moderateScale(5), marginTop: moderateScale(15), color: defaultTheme.darkText }}>28 روز مانده به پایان برنامه غذایی</Text> */}
                        </View>
                        <View style={{
                            width: dimensions.WINDOW_WIDTH * 0.9, padding: moderateScale(5), alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: 10, elevation: 4, marginVertical: moderateScale(20), shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.34,
                            shadowRadius: 2.27,
                        }}>
                            <View>
                                <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(15), padding: moderateScale(5), color: defaultTheme.darkText, paddingHorizontal: moderateScale(10), textAlign: "left" }}>روز آزاد</Text>
                            </View>
                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
                                <CheatDay
                                    width={moderateScale(50)}
                                    height={moderateScale(50)}
                                />
                                <View style={{ marginHorizontal: moderateScale(40) }}>
                                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>روز آزاد : {isCheetDay == true ? "فعال" : "غیر فعال"}</Text>
                                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>تعداد روز آزاد : {2 - diet.cheetDays.length} روز</Text>
                                </View>
                                <View style={{}}>
                                    <Switch
                                        value={isCheetDay}
                                        onValueChange={onCheetDayPressed}
                                        color={defaultTheme.primaryColor}
                                    />
                                </View>
                            </View>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(13), padding: moderateScale(10), lineHeight: moderateScale(18), color: defaultTheme.mainText, textAlign: "left" }}>
                                شما در طول برنامه غذایی 2 روز آزاد دارین و در این 2 روز میتونین به برنامه غذایی عمل نکنین، اگر میخواین امروز روز آزاد باشه دکمه رو فعال کنین
                            </Text>
                        </View>
                        {
                            advice ?
                                <View style={{
                                    width: dimensions.WINDOW_WIDTH * 0.9, padding: moderateScale(20), alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: 10, elevation: 4, marginBottom: moderateScale(15), paddingVertical: moderateScale(10), shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.34,
                                    shadowRadius: 2.27,
                                }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: moderateScale(8) }}>
                                        <LottieView
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
                            renderingItems()
                        }
                        {
                            moment(diet.dietStartDate).add(30, 'days').format("YYYYMMDD") > moment(selectedDate).format("YYYYMMDD") &&
                            <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: moderateScale(15) }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Info
                                        width={moderateScale(25)}
                                    />
                                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.green2, }}>نکته</Text>
                                </View>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(14), lineHeight: 25, color: defaultTheme.mainText, textAlign: "left" }}>برای تغییر رژیم غذایی ابتدا برنامه غذایی فعلی رو از طریق آیکون قرمز رنگ بالا لغو کنین و دوباره برنامه غذایی دریافت کنین.</Text>
                            </View>
                        }
                        <View style={{ height: moderateScale(200) }} />
                    </>
                </ScrollView>
            </View>
            {
                selectedDateSnack && selectedDateDinner && selectedDateLunch && selectedDateBreakFast ?
                    <>
                        <Modal
                            visible={lunchFocuse}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setLunchFocuse(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.lunch}
                                package={selectedDateLunch[0]}
                                headerText={"تعویض برنامه نهار"}
                                selectedMeal={2}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}
                            />
                        </Modal>
                        <Modal
                            visible={dinnerFocus}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setDinnerFocus(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.dinner}
                                selectedMeal={3}
                                package={selectedDateDinner[0]}

                                headerText={"تعویض برنامه شام"}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}

                            />
                        </Modal>
                        <Modal
                            visible={breakfastFocus}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setBreakfastFocus(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.breakfasts}
                                package={selectedDateBreakFast[0]}
                                headerText={"تعویض برنامه صبحانه"}
                                selectedMeal={1}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}

                            />
                        </Modal>
                        <Modal
                            visible={snackFocuse10}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setSnackFocuse10(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.snack}
                                package={selectedDateSnack[0]}
                                headerText={"تعویض برنامه میان وعده اول"}
                                selectedMeal={4}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}

                            />
                        </Modal>
                        <Modal
                            visible={snackFocuse11}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setSnackFocuse11(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.snack}
                                package={selectedDateSnack[1]}
                                headerText={"تعویض برنامه میان وعده دوم"}
                                selectedMeal={4}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}

                            />
                        </Modal>
                        <Modal
                            visible={snackFocuse12}
                            contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                            onDismiss={() => {
                                setSnackFocuse12(false)

                            }}
                        >
                            <ChangePackageModal
                                selectedDate={selectedDate}
                                lang={lang}
                                translateY={translateY}
                                data={diet.snack}
                                package={selectedDateSnack[2]}
                                headerText={"تعویض برنامه میان وعده سوم"}
                                selectedMeal={4}
                                isChange={() => {
                                    setIsChange(!isChange)
                                }}
                                closeModal={closeModal}

                            />
                        </Modal>
                    </>
                    :
                    null
            }

            {cheetDayModal &&
                <InformationModal
                    lang={lang}
                    showMainButton={true}
                    onRequestClose={() => setCheetDayModal(false)}
                    context={"از همه ی روز های ازاد استفاده کردی"}
                />
            }
            {
                cheetDayModal ?
                    <TouchableWithoutFeedback onPress={() => setCheetDayModal(false)}>
                        <View style={styles.wrapper}>
                            <BlurView
                                style={styles.absolute}
                                blurType="light"
                                blurAmount={6}
                                reducedTransparencyFallbackColor="white"
                            />
                        </View>
                    </TouchableWithoutFeedback> : null
            }

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
            {errorVisible ? (
                <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView style={styles.absolute} blurType="dark" blurAmount={2} />
                        <Information
                            visible={errorVisible}
                            context={errorContext}
                            onRequestClose={() => setErrorVisible(false)}
                            lang={lang}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null}
            {
                fullDayAteModal &&
                <FullEatenModal
                    lang={lang}
                    onRequestClose={() => {
                        setFullDayAteModal(false)

                    }}
                />
            }
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    flatList: {
        alignSelf: "center",
        borderWidth: 1,
        borderColor: defaultTheme.border, borderRadius: 10,
        marginVertical: moderateScale(10)
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
    shutDownBtn: {

    }
});
export default DietPlan