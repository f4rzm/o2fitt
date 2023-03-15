import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, I18nManager } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { dimensions } from "../constants/Dimensions";
import { ColumnCenter, RowStart, RowWrapper, ConfirmButton } from "../components";
import { PieChart } from 'react-native-chart-kit'
import { VictoryPie, VictoryLabel } from 'victory-native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import moment from "moment-jalaali";
import { useSelector } from "react-redux";

const MealDetailsCard = props => {
    const fastingDiet = useSelector(state => state.fastingDiet)
    const [breakFast, setBreakFast] = useState(0);
    const [lunch, setLunch] = useState(0);
    const [dinner, setDinner] = useState(0)
    const [snack, setSnack] = useState(0);
    let consumedBreakfast = 0
    let consumedLunch = 0
    let consumedDinner = 0
    let consumedSnack = 0

    const convertedDate = props.user.countryId === 128 ? moment(props.date, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : props.date
    console.warn(moment(props.date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD'))
    useEffect(() => {

        if (parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(props.date).format("YYYYMMDD"))
            &&
            (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(props.date).format("YYYYMMDD")) : true)) {
            if (props.data) {
                if (props.data) {
                    const filteredSahari = props.data.filter((item) => item.foodMeal == 9)
                    const filteredEftar = props.data.filter((item) => item.foodMeal == 6)
                    const filtereddinner = props.data.filter((item) => item.foodMeal == 3)
                    const filteredsnack = props.data.filter((item) => item.foodMeal == 7)
                    filteredSahari.map(item => {
                        const breakfast = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                        consumedBreakfast += (parseInt(breakfast[23]))
                    })
                    filteredEftar.map(item => {
                        const lunch = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                        consumedLunch += (parseInt(lunch[23]))

                    })
                    filtereddinner.map(item => {
                        const dinner = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                        consumedDinner += (parseInt(dinner[23]))
                    })
                    filteredsnack.map(item => {
                        const snack = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                        consumedSnack += (parseInt(snack[23]))
                    })
                }
                setBreakFast(consumedBreakfast)
                setLunch(consumedLunch)
                setDinner(consumedDinner)
                setSnack(consumedSnack)
            }
        }
        else {

            if (props.data) {
                const filteredBreakfast = props.data.filter((item) => item.foodMeal == 0)
                const filteredlunch = props.data.filter((item) => item.foodMeal == 1)
                const filtereddinner = props.data.filter((item) => item.foodMeal == 3)
                const filteredsnack = props.data.filter((item) => item.foodMeal == 2)
                filteredBreakfast.map(item => {
                    const breakfast = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                    consumedBreakfast += (parseInt(breakfast[23]))
                })
                filteredlunch.map(item => {
                    const lunch = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                    consumedLunch += (parseInt(lunch[23]))

                })
                filtereddinner.map(item => {
                    const dinner = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                    consumedDinner += (parseInt(dinner[23]))
                })
                filteredsnack.map(item => {
                    const snack = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
                    consumedSnack += (parseInt(snack[23]))
                })
            }
            setBreakFast(consumedBreakfast)
            setLunch(consumedLunch)
            setDinner(consumedDinner)
            setSnack(consumedSnack)
        }
    }, []);

    const foodsGraphicColor = ["#e63946", "#52489c", defaultTheme.green2, "#3376bd"]
    const foodsGraphicData = [
        { y: breakFast, label: breakFast == 0 ? " " : `${breakFast}` },
        { y: lunch, label: lunch == 0 ? " " : `${lunch}` },
        { y: dinner, label: dinner == 0 ? " " : `${dinner}` },
        { y: snack, label: snack == 0 ? " " : `${snack}` }
    ]

    const graphicColor = [defaultTheme.blue, defaultTheme.error, defaultTheme.green, defaultTheme.green2];
    const wantedGraphicData = [
        { y: (props.fat * 9 / props.calorie * 100), label: `${(props.fat * 9 / props.calorie * 100).toFixed(0)}%` },
        { y: (props.carbo * 4 / props.calorie * 100), label: `${(props.carbo * 4 / props.calorie * 100).toFixed(0)}%` },
        { y: (props.protein * 4 / props.calorie * 100), label: `${(props.protein * 4 / props.calorie * 100).toFixed(0)}%` },

    ];
    const defaultGraphicData = [{ y: 0 }, { y: 0 }, { y: 0 }];
    const [graphicData, setGraphicData] = useState(defaultGraphicData);
    const [startangel, setStartangel] = useState(350)
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            setGraphicData(wantedGraphicData)
            setStartangel(0)
        } else {
            setGraphicData(defaultGraphicData)
            setStartangel(350)

        }
    }, [isFocused])

    return (

        <ColumnCenter style={[styles.columContainer, props.style]}>
            {props.showMealDetails && props.data ?

                <View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center" }}>
                    <View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "flex-start", backgroundColor: defaultTheme.grayBackground, marginBottom: moderateScale(8) }}>
                        <Text style={[styles.headerText, { fontFamily: props.lang.titleFont }]}>{props.lang.dailyFoodMealAnalyz}  {convertedDate}</Text>
                    </View>
                    <View>
                        <VictoryPie
                            animate={{ easing: "circle" }}
                            data={foodsGraphicData}
                            width={moderateScale(130)}
                            height={moderateScale(130)}
                            colorScale={foodsGraphicColor}
                            style={{ labels: { fill: "white", fontSize: moderateScale(14), fontFamily: props.lang.font } }}
                            // innerRadius={moderateScale(33)}
                            radius={moderateScale(65)}
                            startAngle={startangel}
                            labelRadius={({ innerRadius }) => innerRadius + moderateScale(20)}
                            labelPlacement={"parallel"}
                        />
                    </View>
                    {
                        parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(props.date).format("YYYYMMDD"))
                            &&
                            (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(props.date).format("YYYYMMDD")) : true) ?
                            <View style={styles.foodMealContainer}>
                                <View style={{ justifyContent: "space-around", alignItems: "flex-start" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#e63946" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.sahari}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#52489c" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.eftar}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: "space-around", alignItems: "flex-start" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: defaultTheme.green2 }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.dinner}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#3376bd" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.snack}</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={styles.foodMealContainer}>
                                <View style={{ justifyContent: "space-around", alignItems: "flex-start" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#e63946" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.breakfast}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#52489c" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.lunch}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: "space-around", alignItems: "flex-start" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: defaultTheme.green2 }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.dinner}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <View style={[styles.foodMealView, { backgroundColor: "#3376bd" }]} /><Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16) }}>{props.lang.snack}</Text>
                                    </View>
                                </View>
                            </View>
                    }
                </View>
                :
                null}
            <RowStart>
                <View style={styles.caloryContainer}>
                    <View style={styles.caloryWrapper}>
                        <Text style={[styles.caloryText, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                            {
                                (props.calorie)
                            }
                        </Text>
                    </View>
                    <Text style={[styles.text, { fontFamily: props.lang.font, fontSize: moderateScale(16) }]} allowFontScaling={false}>
                        {props.giveCalorie ? props.lang.calorieGive : props.lang.calories}
                    </Text>
                </View>
                {props.fat && props.carbo && props.protein && props.pieShown
                    ?
                    <VictoryPie
                        animate={{ easing: "circle" }}
                        data={graphicData}
                        width={moderateScale(130)}
                        height={moderateScale(130)}
                        colorScale={graphicColor}
                        style={{ labels: { fill: "white", fontSize: moderateScale(14), fontFamily: props.lang.font } }}
                        innerRadius={moderateScale(33)}
                        radius={moderateScale(65)}
                        padAngle={4}
                        startAngle={startangel}
                        labelRadius={({ innerRadius }) => innerRadius + moderateScale(3)}
                        labelPlacement={"parallel"}
                    />
                    :
                    null
                }

                <View>
                    <RowWrapper style={{ marginVertical: moderateScale(0) }}>
                        <View style={[styles.circle, { backgroundColor: defaultTheme.blue }]} />
                        <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                            {props.lang.fat + "  "}
                        </Text>
                        <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                            {props.fat + " " + props.lang.gr}
                        </Text>
                    </RowWrapper>
                    <RowWrapper style={{ marginVertical: moderateScale(0) }}>
                        <View style={[styles.circle, { backgroundColor: defaultTheme.error }]} />

                        <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                            {props.lang.carbohydrate + "  "}
                        </Text>
                        {
                            props.showLock ?
                                <Image
                                    source={require("../../res/img/lock.png")}
                                    style={styles.lock}
                                    resizeMode="contain"
                                /> :
                                <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                                    {props.carbo + " " + props.lang.gr}
                                </Text>
                        }
                    </RowWrapper>
                    <RowWrapper style={{ marginVertical: moderateScale(0) }}>
                        <View style={[styles.circle, { backgroundColor: defaultTheme.green }]} />

                        <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                            {props.lang.protein + "  "}
                        </Text>
                        {
                            props.showLock ?
                                <Image
                                    source={require("../../res/img/lock.png")}
                                    style={styles.lock}
                                    resizeMode="contain"
                                /> :
                                <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                                    {props.protein + " " + props.lang.gr}
                                </Text>
                        }

                    </RowWrapper>
                </View>

            </RowStart>
            {
                props.renderButton &&
                <ConfirmButton
                    style={{ ...styles.editButton, ...props.buttonStyle }}
                    lang={props.lang}
                    title={props.buttonTitle ? props.buttonTitle : props.lang.caloriesCalculat}
                    onPress={props.calNutrition}
                    isLoading={props.isLoading}
                />
            }
        </ColumnCenter>

    )
}

const styles = StyleSheet.create({

    columContainer: {
        maxWidth: dimensions.WINDOW_WIDTH,
        borderTopWidth: 1.2,
        borderBottomWidth: 1.2,
        borderColor: defaultTheme.border,
        marginVertical: 0
    },
    caloryContainer: {
        margin: moderateScale(0),
        alignItems: "center"
    },
    caloryWrapper: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(32),
        backgroundColor: defaultTheme.primaryColor,
        margin: moderateScale(15),
        marginVertical: moderateScale(8),
        justifyContent: "center",
        alignItems: "center"
    },
    caloryText: {
        fontSize: moderateScale(18),
        color: defaultTheme.lightText
    },
    circle: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(9),
        margin: moderateScale(5),
        marginVertical: moderateScale(8)
    },
    text: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(14),
        marginHorizontal: moderateScale(0)
    },
    editButton: {
        width: dimensions.WINDOW_WIDTH * 0.55,
        height: moderateScale(37),
        backgroundColor: defaultTheme.primaryColor,
        marginTop: moderateScale(10),
        marginBottom: moderateScale(16)
    },
    lockContainer: {
        width: "30%",
        alignItems: "center"
    },
    lock: {
        width: moderateScale(20),
        height: moderateScale(20),
    },
    foodMealContainer: {
        width: dimensions.WINDOW_WIDTH,
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: defaultTheme.darkGray,
        paddingVertical: 15
    },
    foodMealView: {
        width: moderateScale(15),
        height: moderateScale(15),
        borderRadius: 5,
        marginHorizontal: 4
    },
    headerText: {
        fontSize: moderateScale(16),
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        color: defaultTheme.lightGray2
    }
})

export default memo(MealDetailsCard)