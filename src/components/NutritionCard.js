import React, { memo, useState } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, I18nManager, Easing } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from "moment"
import AsyncStorage from '@react-native-async-storage/async-storage';
import stepBurnedCalorie from "../utils/stepBurnedCalorie";
import { dimensions } from "../constants/Dimensions";
import Fire from '../../res/img/fire.svg'
import Rice from '../../res/img/rice.svg'
import { Bar } from 'react-native-progress'
import DowArrow from '../../res/img/downArrow.svg'

const NutritionCard = props => {
    console.log("NutritionCard activities", props.activities)
    console.log("NutritionCard userSleepCalories", props.userSleepCalories)
    const [barWidth, setBarWidth] = React.useState(0)
    const [targetCalorie, setTargetCalorie] = React.useState(2000)
    const [targetCarbo, setTargetCarbo] = React.useState(2000)
    const [targetPro, setTargetPro] = React.useState(2000)
    const [targetFat, setTargetFat] = React.useState(2000)
    let fat = 0
    let carbo = 0
    let prot = 0
    let cal = 0
    let burnedCalories = 0
    // let autoBurnedCalorie = props.selectedDate == moment().format("YYYY-MM-DD") ? stepBurnedCalorie(parseFloat(props.autoSteps), parseFloat(props.specification.weightSize)) : 0
    let stepBurnedCalories = 0
    // autoBurnedCalorie = stepBurnedCalorie(parseFloat(props.autoSteps), parseFloat(props.specification.weightSize))


    const getData = async () => {
        const birthdayMoment = moment((props.profile.birthDate.split("/")).join("-"))
        const nowMoment = moment()
        const age = nowMoment.diff(birthdayMoment, "years")
        const height = props.profile.heightSize
        let targetWeight;
        const weight = props.specification.weightSize
        const wrist = props.specification.wristSize
        let activityRate;
        let bmr = 1
        let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
        let bodyType = null
        let targetCalorie = 0
        let carbo = 0
        let pro = 0
        let fat = 0
        let oldData;
        let weightChangeRate;
        await AsyncStorage.getItem('oldChanges').then((res => {
            oldData = JSON.parse(res)
            if (oldData.oldDateChange > props.selectedDate) {
                targetWeight = oldData.oldTargetWeight
                activityRate = oldData.oldDailyActivityRate
                weightChangeRate = oldData.oldWeightChangeRate
            } else {
                targetWeight = props.profile.targetWeight
                activityRate = props.profile.dailyActivityRate
                weightChangeRate = props.profile.weightChangeRate
            }
        })).catch(() => {
            targetWeight = props.profile.targetWeight
            activityRate = props.profile.dailyActivityRate
            weightChangeRate = props.profile.weightChangeRate
        })
        // console.log("NutritionCard profile",props.profile)
        console.log('target weight', targetWeight);
        console.log('target weight old', weightChangeRate);


        if (props.profile.gender == 1) {
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

        console.log("targetCalorie", targetCalorie)
        const targetCaloriPerDay = (7700 * weightChangeRate * 0.001) / 7
        // checkForZigZagi
        if (weight > targetWeight) {
            if (!props.diet.isActive || props.diet.isBuy == false) {
                if (props.user.countryId === 128) {
                    if (moment(props.selectedDate).day() == 4) {
                        targetCalorie *= 1.117
                    } else if (moment(props.selectedDate).day() == 5) {
                        targetCalorie *= 1.116
                    } else {
                        targetCalorie *= 0.97
                    }
                }
                else {
                    if (moment(props.selectedDate).day() == 6) {
                        targetCalorie *= 1.117
                    } else if (moment(props.selectedDate).day() == 0) {
                        targetCalorie *= 1.116
                    } else {
                        targetCalorie *= 0.97
                    }
                }
            }
            targetCalorie -= targetCaloriPerDay
        }
        else if (weight < targetWeight) {
            targetCalorie += targetCaloriPerDay
        }

        targetCalorie = parseInt(targetCalorie)

        if (factor) {
            switch (bodyType) {
                case 1:
                    fat = targetCalorie * 0.32
                    carbo = targetCalorie * 0.33
                    pro = targetCalorie * 0.35
                    break
                case 2:
                    fat = targetCalorie * 0.3
                    carbo = targetCalorie * 0.49
                    pro = targetCalorie * 0.21
                    break
                case 3:
                    fat = targetCalorie * 0.4
                    carbo = targetCalorie * 0.35
                    pro = targetCalorie * 0.25
                    break
            }
        }
        else {
            fat = targetCalorie * 0.33
            carbo = targetCalorie * 0.33
            pro = targetCalorie * 0.34
        }

        // console.log("targetCalorie",)
        // console.log("carbo", carbo)
        // console.log("fat", fat)
        // console.log("pro", pro)

        setTargetCalorie(parseInt(!props.diet.isActive || props.diet.isBuy == false ? targetCalorie : targetCalorie * 1.03))
        setTargetCarbo(parseInt(carbo / 4))
        setTargetFat(parseInt(fat / 9))
        setTargetPro(parseInt(pro / 4))
    }

    React.useEffect(() => {
        getData()
    }, [props.specification, props.selectedDate, props.profile])

    props.activities.map((item) => {
        if (!isNaN(parseFloat(item.burnedCalories))) {
            burnedCalories += parseFloat(item.burnedCalories)
        }
    })

    props.userStep && props.userStep.map((item) => {
        if (!isNaN(parseFloat(item.burnedCalories))) {
            burnedCalories += parseFloat(item.burnedCalories)
        }
    })


    let targetNutritions = props.profile.targetNutrient
    if (targetNutritions && typeof (targetNutritions) === "string") {
        targetNutritions = targetNutritions.split(",")
    }

    props.meals.map(item => {
        const foodNutrientValue = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
        fat += (parseFloat(foodNutrientValue[0]))
        carbo += (parseFloat(foodNutrientValue[31]))
        prot += (parseFloat(foodNutrientValue[9]))
        cal += (parseInt(foodNutrientValue[23]))
    })

    const inputCalorie = cal
    const extraCalorie = (inputCalorie - burnedCalories) - targetCalorie
    let inputCalorieWidth = 0
    let burnedCalorieWidth = 0
    let extraCalorieWidth = 0

    if (extraCalorie > 0) {
        inputCalorieWidth = ((barWidth * .75))
        burnedCalorieWidth = 0
        extraCalorieWidth = extraCalorie / ((inputCalorie - burnedCalories) / ((barWidth * .75)))
    }
    else {
        if ((inputCalorie - burnedCalories) <= targetCalorie) {
            if (inputCalorie > burnedCalories) {
                inputCalorieWidth = ((inputCalorie - burnedCalories) / targetCalorie) * (barWidth * .75)
                burnedCalorieWidth = 0
            }
            else {
                inputCalorieWidth = 0
                burnedCalorieWidth = 0
            }
        }
        else {
            if (inputCalorie > burnedCalories) {
                inputCalorieWidth = ((barWidth * .75))
                burnedCalorieWidth = 0
            }
            else {
                inputCalorieWidth = 0
                burnedCalorieWidth = 0
            }
        }
    }

    console.log("NutritionCard fat", fat)
    console.log("NutritionCard target", targetFat)
    console.log("NutritionCard targetNutritions", targetNutritions)
    return (

        <TouchableOpacity style={styles.mainContainer} activeOpacity={0.9} onPress={props.onPress}>
            {/* <Icon
                name="more-horizontal"
                style={styles.more}
            /> */}
            <View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center", flexDirection: I18nManager ? "row-reverse" : "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginHorizontal: moderateScale(15), alignItems: "center" }}>
                    <View style={styles.burnedANDget}>
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}> {parseInt(burnedCalories) + parseInt(stepBurnedCalories)} </Text>
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}>{props.lang.calories}</Text>
                    </View>
                    <View style={styles.burnedANDget}>
                        <Fire
                            width={moderateScale(20)}
                        />
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}>{props.lang.burnedCalorie}</Text>
                    </View>

                </View>
                <View style={{ flex: 1, alignItems: "center", marginHorizontal: moderateScale(20) }}>
                    <AnimatedCircularProgress
                        size={moderateScale(160)}
                        width={moderateScale(11)}
                        fill={(((inputCalorie - burnedCalories) / targetCalorie) * 100)}
                        rotation={0}
                        padding={2}
                        tintColor={(targetCalorie + (parseInt(burnedCalories) + parseInt(stepBurnedCalories))) - inputCalorie < 0 ? defaultTheme.error : defaultTheme.primaryColor}
                        backgroundColor={defaultTheme.lightGray}
                        dashedBackground={{ width: 1.5, gap: 2 }}
                        lineCap={"butt"}
                        dashedTint={{ width: 0, gap: 0 }}
                        easing={Easing.out(Easing.exp)}
                        duration={2000}

                    >
                        {
                            () => (
                                <AnimatedCircularProgress
                                    size={moderateScale(130)}
                                    width={moderateScale(4)}
                                    fill={0}
                                    rotation={0}
                                    padding={2}
                                    tintColor={defaultTheme.primaryColor}
                                    backgroundColor={defaultTheme.primaryColor}
                                    dashedBackground={{ width: 2, gap: moderateScale(64) }}
                                    dashedTint={{ width: 0, gap: 0 }}

                                >
                                    {
                                        () => (
                                            <View style={{ alignItems: "center" }}>
                                                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(23), color: defaultTheme.darkText }}>{
                                                    (parseInt((targetCalorie + burnedCalories) - inputCalorie)) < 0 ? (parseInt((targetCalorie + burnedCalories) - inputCalorie)) * -1 : (parseInt((targetCalorie + burnedCalories) - inputCalorie))
                                                }</Text>
                                                <Text style={[styles.progressCircular, { fontFamily: props.lang.titleFont, color: defaultTheme.darkText }]}>{((targetCalorie + burnedCalories) - inputCalorie) < 0 ? props.lang.overFlow : props.lang.calorieRemain}</Text>
                                            </View>
                                        )
                                    }
                                </AnimatedCircularProgress>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={{ flex: 1, marginHorizontal: moderateScale(15), alignItems: "center" }}>
                    <View style={styles.burnedANDget}>
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}> {inputCalorie} </Text>
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}>{props.lang.calories}</Text>
                    </View>
                    <View style={styles.burnedANDget}>
                        <Rice
                            width={moderateScale(25)}
                        />
                        <Text style={[styles.burnedAgetText, { fontFamily: props.lang.titleFont }]}>{props.lang.caloriecardfood}</Text>
                    </View>
                </View>
            </View>



            <View style={styles.bottomContainer}>
                <View style={styles.container1}>
                    <Text style={[styles.text3, { fontFamily: props.lang.titleFont }]}>
                        {props.lang.carbohydrate}
                    </Text>
                    <Bar
                        progress={(carbo / targetCarbo)}
                        width={moderateScale(75)}
                        color={defaultTheme.error}
                        unfilledColor={defaultTheme.border}
                        borderColor={"rgba(0,0,0,0)"}
                        height={moderateScale(10)}
                        borderRadius={50}
                        style={{ transform: [{ rotate: "180deg" }] }}

                    />
                    <View style={styles.row}>
                        {props.hasCredit ?
                            <Text style={[styles.text4, { fontFamily: props.lang.font }]}>
                                {parseInt(carbo)}
                                {!props.diet.isActive || props.diet.isBuy == false ?
                                    targetNutritions ? (` ${props.lang.from} ` + parseInt(targetCarbo.toFixed()) + ` ${props.lang.gr}`) : " gr / " : props.lang.gr
                                }
                            </Text>

                            : <Image
                                source={require("../../res/img/lock.png")}
                                style={styles.lock}
                                resizeMode="contain"
                            />}
                    </View>
                </View>
                <View style={styles.container1}>
                    <Text style={[styles.text3, { fontFamily: props.lang.titleFont }]}>
                        {props.lang.protein}
                    </Text>

                    <Bar
                        progress={(parseInt(prot) / parseInt(targetPro) * 1)}
                        width={moderateScale(75)}
                        color={defaultTheme.green}
                        unfilledColor={defaultTheme.border}
                        borderColor={"rgba(0,0,0,0)"}
                        height={moderateScale(10)}
                        borderRadius={50}
                        style={{ transform: [{ rotate: "180deg" }] }}
                    />
                    <View style={styles.row}>
                        {props.hasCredit ?
                            <Text style={[styles.text4, { fontFamily: props.lang.font }]}>
                                {parseInt(prot)}
                                {!props.diet.isActive || props.diet.isBuy == false ?
                                    targetNutritions ? (` ${props.lang.from} ` + parseInt(targetPro.toFixed()) + ` ${props.lang.gr}`) : " gr / " : props.lang.gr
                                }

                            </Text>
                            : <Image
                                source={require("../../res/img/lock.png")}
                                style={styles.lock}
                                resizeMode="contain"
                            />}


                    </View>
                </View>
                <View style={styles.container1}>
                    <Text style={[styles.text3, { fontFamily: props.lang.titleFont }]}>
                        {props.lang.fat}
                    </Text>

                    <Bar
                        progress={(parseInt(fat) / parseInt(targetFat))}
                        width={moderateScale(75)}
                        color={defaultTheme.blue}
                        unfilledColor={defaultTheme.border}
                        borderColor={"rgba(0,0,0,0)"}
                        height={moderateScale(10)}
                        borderRadius={50}
                        style={{ transform: [{ rotate: "180deg" }] }}

                    />
                    <View style={styles.row}>
                        <Text style={[styles.text4, { fontFamily: props.lang.font }]}>
                            {parseInt(fat)}
                            {!props.diet.isActive || props.diet.isBuy == false ?
                                targetNutritions ? (` ${props.lang.from} ` + parseInt(targetFat.toFixed()) + ` ${props.lang.gr}`) : " gr / " : props.lang.gr
                            }
                        </Text>

                    </View>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <DowArrow
                    width={moderateScale(20)}
                />
                <Text style={{ fontFamily: props.lang.titleFont, fontSize: moderateScale(16), marginHorizontal: moderateScale(5), color: defaultTheme.darkText }}>{props.lang.nutritionalValue}</Text>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "95%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: defaultTheme.lightBackground,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },

        marginHorizontal: moderateScale(16),
        marginBottom: moderateScale(20),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        borderWidth: 0,
        marginBottom: moderateScale(20),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        margin: moderateScale(16),
        paddingHorizontal: moderateScale(16),
        paddingBottom: moderateScale(8)
    },
    more: {
        position: "absolute",
        right: I18nManager.isRTL ? "97%" : "3%",
        left: I18nManager.isRTL ? "3%" : "97%",
        top: moderateScale(5),
        fontSize: moderateScale(25)
    },
    barIndicatorMainContainer: {
        width: "100%",
        justifyContent: "center",
        marginTop: moderateScale(35),
        marginBottom: moderateScale(16),
    },
    barContainer: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        width: "100%",
        height: moderateScale(12),
        overflow: "hidden",
        borderRadius: moderateScale(10),
        backgroundColor: defaultTheme.grayBackground,
        justifyContent: "flex-start",

    },
    indicator: {
        position: "absolute",
        width: 1.5,
        height: moderateScale(25),
        backgroundColor: defaultTheme.gray,
    },
    normalBar: {
        height: "100%",
        backgroundColor: "#4CD964"
    },
    burnedBar: {
        height: "100%",
        backgroundColor: "#FF0000"
    },
    extraBar: {
        height: "100%",
        backgroundColor: "#D10000"
    },
    centerContainer: {
        flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
        width: "100%",
        margin: moderateScale(16),
        justifyContent: "space-between",
        alignItems: "center"
    },
    bottomContainer: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        width: "100%",
        margin: moderateScale(16),
        marginVertical: moderateScale(29),
        justifyContent: "space-around",
        alignItems: "center"
    },
    container1: {
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: moderateScale(2)
    },
    text1: {
        fontSize: moderateScale(18),
        color: defaultTheme.mainText
    },
    text2: {
        fontSize: moderateScale(14),
        color: defaultTheme.darkText
    },
    text3: {
        fontSize: moderateScale(14),
        marginBottom: moderateScale(5),
        color: defaultTheme.darkText
    },
    text4: {
        fontSize: moderateScale(15),
        marginTop: moderateScale(5),
        color: defaultTheme.darkText
    },
    row: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        alignItems: "flex-end"
    },
    lock: {
        width: moderateScale(16),
        height: moderateScale(16),
        marginBottom: moderateScale(4),
        marginTop: moderateScale(5)
    },
    progressCircular: {
        fontSize: moderateScale(14)
    },
    burnedANDget: {
        flexDirection: "row",
        alignItems: "center"
    },
    burnedAgetText: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(14)
    }
})

export default memo(NutritionCard)