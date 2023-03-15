import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    BackHandler,
    I18nManager
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import momentJ from 'moment-jalaali';
import { LineChart } from "react-native-chart-kit";
import { ConfirmButton, RowSpaceBetween, RowWrapper, TwoOptionModal, DietCard } from '../../components';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SpecificationDBController } from "../../classess/SpecificationDBController"
import LottieView from 'lottie-react-native';
import SoundPlayer from 'react-native-sound-player'
import UpArrow from '../../../res/img/greenArrow.svg'
import DownArrow from '../../../res/img/redArrow.svg'
import axios from 'axios';

const model = {
    "weightSize": 0,
    "bustSize": null,
    "armSize": null,
    "waistSize": 0,
    "highHipSize": null,
    "hipSize": null,
    "thighSize": null,
    "neckSize": null,
    "shoulderSize": null,
    "wristSize": null,
    "insertDate": moment().format("YYYY-MM-DDTHH:mm:ss"),
    "userProfileId": 0,
    "userProfiles": null,
    "_id": null,
    "id": 0
}
let checkFireWork = false
const GoalWeightScreen = props => {

    const lang = useSelector(state => state.lang)
    const profile = useSelector(state => state.profile)
    const user = useSelector(state => state.user)
    const specification = useSelector(state => state.specification)
    const diet = useSelector(state => state.diet)
    const auth = useSelector(state => state.auth)
    const fastingDiet = useSelector(state => state.fastingDiet)

    const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
    const [showCaution, setCautionVisible] = React.useState(false)

    const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

    const days = React.useRef([
        lang["1shanbe"],
        lang["2shanbe"],
        lang["3shanbe"],
        lang["4shanbe"],
        lang["5shanbe"],
        lang["jome"],
        lang["shanbe"]
    ]).current

    const [fireWorkVisible, setFireWorkVisible] = React.useState(false)
    const [chartDays, setChartDays] = React.useState(days)
    const [chartData, setChartData] = React.useState(new Array(7).fill(1).map((item, index) => ({ ...model, insertDate: moment().subtract(7 - index).format("YYYY-MM-DDTHH:mm:ss") })))

    React.useEffect(() => {
        const d = []
        new Array(7).fill(1).map((item, index) => {
            d.push(days[moment().subtract(6 - index, "days").day()])
        })

        setChartDays(d)
    }, [])

    React.useEffect(() => {
        getSevenDaysData()
    }, [specification])

    React.useEffect(() => {
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus', () => {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.navigate("HomeScreen"); return true })
        })

        const blurUnsubscribe = props.navigation.addListener('blur', () => {
            backHandler && backHandler.remove()
        })

        const onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            setTimeout(() => {
                setFireWorkVisible(false)
            }, 200)
        })

        return () => {
            backHandler && backHandler.remove()
            focusUnsubscribe()
            blurUnsubscribe()
            onFinishedPlayingSubscription.remove()
        }
    }, [])

    React.useEffect(() => {
        // console.warn(props.route.params?.from);
        // console.log("props.route",props.route)
        // console.log("specification",specification)
        // console.log("checkFireWork",checkFireWork)
        if (props.route.params?.from || checkFireWork) {
            checkFireWork = false
            if ((specification[1].weightSize > profile.targetWeight && specification[0].weightSize <= profile.targetWeight) ||
                (specification[1].weightSize < profile.targetWeight && specification[0].weightSize >= profile.targetWeight)) {
                setFireWorkVisible(true)
                setTimeout(() => {
                    setFireWorkVisible(false)
                }, 5000);
                try {
                    // play the file tone.mp3
                    SoundPlayer.playSoundFile('remind', 'mp3')
                } catch (e) {
                    console.log(`cannot play the sound file`, e)
                }
            }

        }
    }, [specification[0].weightSize]);

    React.useEffect(() => {
        calCalorie(specification, profile)
    }, [specification, profile])

    const setCheckFireWork = () => {
        checkFireWork = true
    }

    const getSevenDaysData = async () => {
        const SDBC = new SpecificationDBController()
        await SDBC.getLastSeven(setData)
    }

    const setData = (data) => {
        console.log("week", data)
        console.log("specification", specification)
        console.log("props.route", props.route)
        setChartData(data)
    }

    const onEditGoal = () => {
        if (hasCredit) {
            props.navigation.navigate("EditGoalScreen")
        }
        else {
            goToPackages()
        }
    }

    const goToPackages = () => {
        setTimeout(() => {
            props.navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }

    

    const calCalorie = (specification, profile) => {
        const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
        const nowMoment = moment()
        const age = nowMoment.diff(birthdayMoment, "years")
        const height = profile.heightSize
        const weight = specification[0].weightSize
        const wrist = specification[0].wristSize
        const targetWeight = profile.targetWeight
        let bmr = 1
        let factor = height / wrist;
        let bodyType = 1
        let targetCalorie = 0
        let carbo = 0
        let pro = 0
        let fat = 0

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
        switch (profile.dailyActivityRate) {
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
        const targetCaloriPerDay = (7700 * profile.weightChangeRate * 0.001) / 7
        // checkForZigZagi
        if (weight > targetWeight) {

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
        }
        else if (weight < targetWeight) {
            targetCalorie += targetCaloriPerDay
        }

        targetCalorie < 1200 ?
            setCautionVisible(true) :
            setCautionVisible(false)
    }

    const diff = parseFloat(specification[0].weightSize) - parseFloat(specification[1].weightSize)
    const onDietPressed = () => {

        if (diet.isActive == true && diet.isBuy == true) {
            if (parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment().format("YYYYMMDD"))
              &&
              (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment().format("YYYYMMDD")) : true)) {
      
                props.navigation.navigate("FastingDietplan")
            }else{
              props.navigation.navigate("DietPlanScreen")
            }
          } else if (diet.isActive == false && diet.isBuy == true) {
            props.navigation.navigate("DietStartScreen")
        } else if (diet.isActive == true && diet.isBuy == false) {
            props.navigation.navigate("PackagesScreen")
        } else {
            props.navigation.navigate("DietStartScreen")
        }

    }

    return (
        <View style={styles.mainContainer}>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>
                <View style={{ width: dimensions.WINDOW_WIDTH, marginVertical: moderateScale(15), overflow: "hidden", alignItems: "center" }}>
                    <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(15), alignSelf: "baseline", paddingHorizontal: moderateScale(20), color: defaultTheme.darkText, }}>{lang.weightchangechart}</Text>
                    <LineChart
                        data={{
                            labels: chartData.map(item => user.countryId === 128 ? momentJ(item.insertDate).format("jYYYY/jMM/jDD") : item.insertDate.split("T")[0]),
                            datasets: [{
                                data: new Array(7).fill(profile.targetWeight),
                                color: (opacity = 1) => chartData[chartData.length - 1].weightSize == profile.targetWeight ? defaultTheme.green : defaultTheme.lightGray,
                                strokeWidth: "3",
                                withDots: true, 
                                colors: (value, index) => console.error(value, index),



                            },
                            {
                                data: chartData.map(item => item.weightSize)
                            }
                            ]
                        }}
                        bezier
                        verticalLabelRotation={-45}
                        xLabelsOffset={moderateScale(25)}
                        width={dimensions.WINDOW_WIDTH}
                        height={moderateScale(250)}
                        withHorizontalLabels={true}
                        withVerticalLabels={true}
                        // withShadow={false}
                        chartConfig={{
                            width: dimensions.WINDOW_WIDTH,
                            // backgroundColor: defaultTheme.lightBackground,
                            backgroundGradientFrom: defaultTheme.lightBackground,
                            backgroundGradientTo: defaultTheme.lightBackground,

                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(249, 139, 6, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(110, 110, 110, 1)`,

                            propsForDots: {
                                r: "3",
                                strokeWidth: "2",
                                stroke: defaultTheme.primaryColor
                            },
                            propsForLabels: {
                                fontFamily: lang.font,
                                fontSize: moderateScale(12),

                            },
                            style: { margin: 0, padding: 0 },
                            propsForVerticalLabels: { fontSize: moderateScale(11) },
                            propsForDots:{
                                r:"5"
                            }
                        }}

                        onDataPointClick={(e) => console.log(e)}
                        renderDotContent={(r) => {
                            if (r.index == 6 && r.indexData == profile.targetWeight) {
                                return (
                                    <Text style={{ color: defaultTheme.darkText, position: 'absolute', width: dimensions.WINDOW_WIDTH, paddingTop: r.y - 20, paddingRight: Platform.OS == "ios" ? r.x - 5 : 0, paddingLeft: Platform.OS == "android" || lang.langName == "english" ? r.x - 5 : 0 }}>{r.indexData}</Text>
                                )
                            }

                        }}

                        style={{
                            width: dimensions.WINDOW_WIDTH,
                            margin: 0,
                            marginVertical: 8,
                        }}
                        segments={7}
                        withShadow={true}
                        getDotProps={(value, index, item) => {
                            if(value==profile.targetWeight){
                                return({
                                    r:"0"
                                })
                            }else{
                                return({
                                    r:"4",
                                })
                            }
                        }}
                    />

                </View>

                {/* <RowSpaceBetween style={styles.row}>
                    <ConfirmButton
                        style={styles.button}
                        lang={lang}
                        title={lang.changeGol}
                        leftImage={require("../../../res/img/edit.png")}
                        imageStyle={{tintColor : defaultTheme.lightText}}
                        onPress={onEditGoal}
                        textStyle={{fontSize:moderateScale(16)}}
                    />
                    <ConfirmButton
                        style={styles.button}
                        lang={lang}
                        title={lang.setWeightTitle}
                        leftImage={require("../../../res/img/scale.png")}
                        imageStyle={{tintColor : defaultTheme.lightText}}
                        onPress={()=>props.navigation.navigate("RegisterWeightScreen" ,{setCheckFireWork:setCheckFireWork})}
                        textStyle={{fontSize:moderateScale(16)}}

                    />
                </RowSpaceBetween> */}
                <View style={{ alignItems: "center", width: dimensions.WINDOW_WIDTH }}>
                    {
                        user.countryId !== 128 ? null :
                            <DietCard
                                lang={lang}
                                profile={profile}
                                specification={specification}
                                diet={diet}
                                onCardPressed={onDietPressed}
                            />
                    }
                </View>



                <View style={[styles.headerContainer, { flexDirection: "column" }]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: moderateScale(8) }}>
                        <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText }}>{lang.calorieCountingGoal}</Text>
                        <TouchableOpacity
                            onPress={onEditGoal}
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(17), color: defaultTheme.green, paddingHorizontal: moderateScale(10) }}>{lang.changeGol}</Text>
                            <Image
                                source={require("../../../res/img/back.png")}
                                style={{ tintColor: defaultTheme.green, width: moderateScale(13), height: moderateScale(25), resizeMode: "contain", transform: [{ rotate: I18nManager ? "0deg" : "180deg" }] }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.mainGoal}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>   {parseFloat(profile.targetWeight) > parseFloat(specification[0].weightSize) ? lang.weightGain :
                            parseFloat(profile.targetWeight) < parseFloat(specification[0].weightSize) ? lang.weightLoss : lang.weightStability}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.goalarivetime}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>   {
                            Math.round(Math.abs(parseFloat(specification[0].weightSize) - parseFloat(profile.targetWeight)) * 1000 / profile.weightChangeRate)
                        }
                            <Text style={[styles.text1, { fontFamily: lang.titleFont, fontSize: moderateScale(15) }]} allowFontScaling={false}>
                                {"  " + lang.week}
                            </Text></Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.countChange}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>   {parseFloat(profile.targetWeight) === parseFloat(specification[0].weightSize) ? "0" : profile.weightChangeRate}
                            <Text style={[styles.text1, { fontFamily: lang.titleFont, fontSize: moderateScale(15) }]} allowFontScaling={false}>
                                {"  " + lang.gr}
                            </Text></Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.golWeight}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>{profile.targetWeight}<Text style={{ color: defaultTheme.darkText }}> {lang.kgMeasureName}</Text></Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.currentWeight}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>{specification[0].weightSize}<Text style={{ color: defaultTheme.darkText }}> {lang.kgMeasureName}</Text></Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.lastWeight}</Text>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}>{specification[1].weightSize}<Text style={{ color: defaultTheme.darkText }}> {lang.kgMeasureName}</Text></Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                        <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.changeWeight}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {
                                diff > 0 ?
                                    <DownArrow />
                                    :
                                    diff < 0 ?
                                        <UpArrow />
                                        :
                                        null
                            }
                            <Text style={[styles.containerTexts, { fontFamily: lang.font, fontSize: moderateScale(15) }]}> {Math.abs(diff).toFixed(1)}<Text style={{ color: defaultTheme.darkText }}> {lang.kgMeasureName}</Text></Text>
                        </View>
                    </View>

                </View>

                {
                    showCaution &&
                    <View
                        style={styles.cautionContainer}
                    >
                        <RowWrapper>
                            <LottieView
                                style={{ width: moderateScale(35), height: moderateScale(35), padding: 0 }}
                                source={require('../../../res/animations/attention.json')}
                                autoPlay
                                loop={true}
                            />
                            <Text style={[styles.text1, { fontFamily: lang.font, marginHorizontal: 0 }]} allowFontScaling={false}>
                                {lang.tavajoh}
                            </Text>
                        </RowWrapper>
                        <Text style={[styles.text1, { fontFamily: lang.font, fontSize: moderateScale(14) }]} allowFontScaling={false}>
                            {lang.lowCalerieDanger3}
                        </Text>
                    </View>
                }
                <View
                    style={[styles.cautionContainer, { marginBottom: moderateScale(20) }]}
                >
                    <RowWrapper>
                        <Image
                            style={styles.cautImage}
                            source={require("../../../res/img/caution.png")}
                            resizeMode="contain"
                        />
                        <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {lang.tavajoh}
                        </Text>
                    </RowWrapper>
                    <Text style={[styles.text1, { fontFamily: lang.font, fontSize: moderateScale(14), textAlign: "left" }]} allowFontScaling={false}>
                        {lang.beforeChangPatternFoodVisitByDoctor}
                    </Text>
                </View>
            </ScrollView>
            <TwoOptionModal
                lang={lang}
                visible={optionalDialogVisible}
                onRequestClose={() => setOptionalDialogVisible(false)}
                context={lang.subscribe1}
                button1={lang.iBuy}
                button2={lang.motevajeShodam}
                button1Pressed={goToPackages}
                button2Pressed={() => setOptionalDialogVisible(false)}
            />
            {
                fireWorkVisible &&
                <LottieView
                    style={{
                        width: dimensions.WINDOW_WIDTH * 0.9,
                        position: "absolute",
                        zIndex: 1,

                    }}
                    source={require('../../../res/animations/firework.json')}
                    autoPlay
                    loop={true}
                />
            }
        <View style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(50) }} />

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        width: "100%",
        height: moderateScale(80),
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: defaultTheme.border
    },
    headerTab: {
        width: dimensions.WINDOW_WIDTH * 0.25,
        height: moderateScale(65),
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: defaultTheme.border,
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    headerText: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        textAlign: "center"
    },
    row: {
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
        paddingVertical: moderateScale(10),
        marginTop: 0,
        marginBottom: 0
    },
    button: {
        width: moderateScale(150),
        height: moderateScale(35),
        backgroundColor: defaultTheme.green,
        marginHorizontal: 0
    },
    text1: {
        color: defaultTheme.lightGray2,
        fontSize: moderateScale(15),
        marginHorizontal: moderateScale(8),
        lineHeight: moderateScale(20),
        textAlign: "left"
    },
    text2: {
        fontSize: moderateScale(19),
        color: defaultTheme.green,
        marginHorizontal: moderateScale(8)
    },
    cautionContainer: {
        width: dimensions.WINDOW_WIDTH - moderateScale(32),
        borderWidth: 1,
        borderColor: defaultTheme.error,
        borderRadius: moderateScale(15),
        marginTop: moderateScale(16),
        paddingBottom: moderateScale(10),
        elevation: 3,
        backgroundColor: defaultTheme.white
    },
    cautImage: {
        width: moderateScale(18),
        height: moderateScale(18)
    },
    headerContainer: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH * .9,
        backgroundColor: defaultTheme.white,
        elevation: 4,
        justifyContent: "space-between",
        borderRadius: 15,
        alignSelf: 'center',
        padding: moderateScale(10),
        marginVertical: moderateScale(15),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 2.27,
    },
    containerTexts: {
        paddingVertical: Platform.OS ? moderateScale(8) : 0,
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    }
});

export default GoalWeightScreen;
