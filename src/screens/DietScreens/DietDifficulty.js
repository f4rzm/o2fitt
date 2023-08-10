import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment, MainToolbar, OFitToolBar } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import Info from '../../../res/img/info4.svg'
import { useDispatch } from 'react-redux'
import { updateTarget } from '../../redux/actions'
import moment from 'moment'
import { BlurView } from '@react-native-community/blur'

function DietDifficulty(props) {
    const dispatch = useDispatch()
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const specification = useSelector((state) => state.specification);
    const fastingDiet = useSelector((state) => state.fastingDiet);

    const [goal, setGoal] = useState(profile)
    const [weightChangeRateId, setWeightChangeRateId] = useState()
    const [hardshipdata, setHardshipdata] = useState([])
    const [noResult, setNoResult] = useState(false)

    const [loading, setLoading] = useState(false)

    const calCalorie = (WCR) => {
        const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
        const nowMoment = moment();
        const age = nowMoment.diff(birthdayMoment, 'years');
        const height = profile.heightSize;
        const weight = parseFloat(props.route.params.weight).toFixed(1);
        const wrist = specification[0].wristSize;
        const targetWeight = parseFloat(props.route.params.targetWeight).toFixed(1)
        let bmr = 1;
        let factor = height / wrist;
        let bodyType = 1;
        let targetCalorie = 0;

        // console.log(age);
        // console.log(height);
        // console.log(weight);
        // console.log(wrist);
        if (profile.gender == 1) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            if (factor > 10.4) bodyType = 1;
            else if (factor < 9.6) bodyType = 3;
            else bodyType = 2;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            if (factor > 11) bodyType = 1;
            else if (factor < 10.1) bodyType = 3;
            else bodyType = 2;
        }

        // console.log('profile.dailyActivityRate', profile.dailyActivityRate);
        switch (parseInt(props.route.params.activityRate)) {
            case 10:
                targetCalorie = bmr * 1;
                break;
            case 20:
                targetCalorie = bmr * 1.2;
                break;
            case 30:
                targetCalorie = bmr * 1.375;
                break;
            case 40:
                targetCalorie = bmr * 1.465;
                break;
            case 50:
                targetCalorie = bmr * 1.55;
                break;
            case 60:
                targetCalorie = bmr * 1.725;
                break;
            case 70:
                targetCalorie = bmr * 1.9;
                break;
        }
        const targetCaloriPerDay = (7700 * WCR * 0.001) / 7;
        // checkForZigZagi
        if (parseFloat(weight) > parseFloat(targetWeight)) {
            console.error("this lost");
            targetCalorie -= targetCaloriPerDay;
        }
        if (parseFloat(weight) < parseFloat(targetWeight)) {
            console.error("this gain");

            targetCalorie += targetCaloriPerDay;
        }

        return targetCalorie.toFixed(0);
    };
    const weightLostData = [
        { id: 200, calCalrie: calCalorie(200), name: "خیلی آسان", title: "کاهش 0.8 کیلوگرم در ماه" },
        { id: 400, calCalrie: calCalorie(400), name: "آسان", title: "کاهش 1.5 کیلوگرم در ماه" },
        { id: 600, calCalrie: calCalorie(600), name: "متوسط", title: "کاهش 2.5 کیلوگرم در ماه" },
        { id: 800, calCalrie: calCalorie(800), name: "سخت", title: "کاهش 3.2 کیلوگرم در ماه" },
        { id: 1000, calCalrie: calCalorie(1000), name: "خیلی سخت", title: "کاهش 4 کیلوگرم در ماه" },
    ]
    const weigthGainData = [
        { id: 100, calCalrie: calCalorie(100), name: "خیلی آسان", title: "افزایش 500 گرم در ماه" },
        { id: 300, calCalrie: calCalorie(300), name: "آسان", title: "افزایش 1 کیلوگرم در ماه" },
        { id: 500, calCalrie: calCalorie(500), name: "متوسط", title: "افزایش 2 کیلوگرم در ماه" },
        { id: 800, calCalrie: calCalorie(800), name: "سخت ", title: "افزایش 3.2 کیلوگرم در ماه" },
    ]

    const filteredCalCalorie = weightLostData.filter((item) => (item.calCalrie > 1200 && item.calCalrie < 3000))
    const filteretWeightGain = weigthGainData.filter((item) => (item.calCalrie < 3000 && item.calCalrie > 1200))

    useEffect(() => {
        if (parseFloat(props.route.params.weight) < parseFloat(props.route.params.targetWeight)) {
            // console.error(weigthGainData);
            setHardshipdata(weigthGainData)
            if (filteretWeightGain.length > 0) {

                setWeightChangeRateId(filteretWeightGain[0].id)
            } else {
                setNoResult(true)
            }
        } else if (parseFloat(props.route.params.weight) > parseFloat(props.route.params.targetWeight)) {
            setHardshipdata(weightLostData)
            if (filteredCalCalorie.length > 0) {
                setWeightChangeRateId(filteredCalCalorie[0].id)
            } else {
                setNoResult(true)
            }
        } else {
            setHardshipdata([{ id: 0, calCalrie: calCalorie(0), name: "خیلی آسان", title: "ثبات وزن" }])
            setWeightChangeRateId(0)
        }
    }, [])
    const onConfirmHarfShip = () => {
        props.navigation.navigate("DietConfirmation", {
            activityRate: props.route.params.activityRate,
            weight: props.route.params.weight,
            targetWeight: props.route.params.targetWeight,
            weightChangeRate: weightChangeRateId,
            dietId: props.route.params.dietId,
            alergiesId: props.route.params.alergiesId,
            dietName:props.route.params.dietName
        })

    }
    const showError = (err) => {
        setLoading(false
        )

        console.error(err)
    }
    const success = () => {
        setLoading(false)
        props.navigation.navigate("DietConfirmation")
    }
    // console.warn(hardshipdata);

    return (
        <>
            <OFitToolBar
                BackPressed={() => props.navigation.goBack()}
            />
            <View style={styles.headerContainer}>
                <Text style={{ textAlign: "center", fontSize: moderateScale(20), fontFamily: lang.font, color: defaultTheme.darkText }}>نوع سختی رژیم رو انتخاب کنین</Text>
            </View>
            <ScrollView>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: moderateScale(15) }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Info
                            width={moderateScale(25)}
                        />
                        <Text style={{ textAlign: "left", fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.green2 }}>راهنمایی</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), lineHeight: 25, textAlign: "left", color: defaultTheme.lightGray2 }}>طبق فیزیک بدنتون برنامه غذایی اصولی با درجه سختی زیر رو میتونین انتخاب کنین</Text>
                </View>

                <View style={{ paddingBottom: moderateScale(60) }}>
                    {/* {
                        parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment().format("YYYYMMDD"))
                            &&
                            (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment().format("YYYYMMDD")) : true)
                            ? <>
                                {
                                    hardshipdata.length <= 0 ? null :
                                        hardshipdata.map((item) => {
                                            return (
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                                    console.warn(item.calCalrie)
                                                    if (item.calCalrie >= 1200 && item.calCalrie <= 2500) {
                                                        setWeightChangeRateId(item.id)
                                                    } else {
                                                        null
                                                    }

                                                }} style={[styles.difficultyCards, { backgroundColor: item.calCalrie >= 1200 && item.calCalrie <= 2500 ? defaultTheme.lightBackground : defaultTheme.grayBackground, }]}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", padding: moderateScale(12), paddingBottom: moderateScale(2) }}>
                                                        <View style={{ borderWidth: 1, padding: moderateScale(2.5), borderRadius: 50, borderColor: defaultTheme.lightGray }}>
                                                            <View style={[styles.checkBox, { backgroundColor: weightChangeRateId == item.id ? defaultTheme.primaryColor : defaultTheme.white }]} />
                                                        </View>
                                                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), marginHorizontal: moderateScale(5), color: item.calCalrie >= 1200 && item.calCalrie <= 2500 ? defaultTheme.darkText : defaultTheme.lightGray }}>{item.name}</Text>
                                                    </View>
                                                    <Text style={{ fontFamily: lang.font, paddingHorizontal: moderateScale(13), paddingBottom: moderateScale(15), color: item.calCalrie >= 1200 && item.calCalrie <= 2500 ? defaultTheme.mainText : defaultTheme.lightGray, textAlign: "left", marginTop: moderateScale(5) }}>{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                }
                            </> :
                            <>*/}
                    {
                        hardshipdata.length <= 0 ? null :
                            hardshipdata.map((item) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                        if (item.calCalrie >= 1200 && item.calCalrie <= 3045) {
                                            console.warn(item.calCalrie)
                                            setWeightChangeRateId(item.id)
                                        } else {
                                            null
                                        }

                                    }} style={[styles.difficultyCards, { backgroundColor: item.calCalrie >= 1200 && item.calCalrie <= 3000 ? defaultTheme.lightBackground : defaultTheme.grayBackground, }]}>
                                        <View style={{ flexDirection: "row", alignItems: "center", padding: moderateScale(12), paddingBottom: moderateScale(2) }}>
                                            <View style={{ borderWidth: 1, padding: moderateScale(2.5), borderRadius: 50, borderColor: defaultTheme.lightGray }}>
                                                <View style={[styles.checkBox, { backgroundColor: weightChangeRateId == item.id ? defaultTheme.primaryColor : defaultTheme.white }]} />
                                            </View>
                                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), marginHorizontal: moderateScale(5), color: item.calCalrie >= 1200 && item.calCalrie <= 3000 ? defaultTheme.darkText : defaultTheme.lightGray }}>{item.name}</Text>
                                        </View>
                                        <Text style={{ fontFamily: lang.font, paddingHorizontal: moderateScale(13), paddingBottom: moderateScale(15), color: item.calCalrie >= 1200 && item.calCalrie <= 3000 ? defaultTheme.mainText : defaultTheme.lightGray, textAlign: "left", marginTop: moderateScale(5) }}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            })
                    }
                    {/* </>
                    } */}
                </View>
            </ScrollView>

            <View style={{ alignSelf: "center", position: "absolute", bottom: moderateScale(20) }}>
                <ConfirmButton
                    lang={lang}
                    title={lang.continuation}
                    style={{
                        backgroundColor: defaultTheme.green,
                        width: dimensions.WINDOW_WIDTH * 0.45,
                        height: moderateScale(45)
                    }}
                    onPress={onConfirmHarfShip}
                    isLoading={loading}
                />
            </View>
            {noResult ?
                <BlurView style={{ width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, position: "absolute" }} blurAmount={1} blurRadius={1} blurType="dark">
                    <Information
                        lang={lang}
                        context={"برای هدف انتخابی شما برنامه غذایی اصولی وجود ندارد\nلطفا در مراحل قبل نوع فعالیت روزانه رو تغییر بدین"}
                        button1Pressed={() => props.navigation.pop(3)}
                        showMainButton={false}
                        button1={"تنظیم مجدد هدف"}
                        button1Style={{ width: moderateScale(150), backgroundColor: defaultTheme.green2, height: moderateScale(50) }}
                        button1TextStyle={{ fontSize: moderateScale(16) }}
                    />
                </BlurView>
                : null
            }
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
        width: moderateScale(13),
        height: moderateScale(13),
        borderRadius: 50,
        backgroundColor: defaultTheme.primaryColor
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

    },
    difficultyCards: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        marginVertical: moderateScale(10),
        elevation: 3,
        alignSelf: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.33,
        shadowRadius: 2.27,
    }
})
export default DietDifficulty