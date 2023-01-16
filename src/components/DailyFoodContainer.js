import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import RowSpaceBetween from "./layout/RowSpaceBetween";
import RowWrapper from "./layout/RowWrapper";
import RowStart from "./layout/RowStart";
import FoodRow from "./FoodRow";
import AnalyzSvg from '../../res/img/analyzSv.svg'

const DailyFoodContainer = props => {
    // console.warn(props.budget,props.title)
    let consumedCal = 0
    props.data.map(item => {
        const foodNutrientValue = typeof (item.foodNutrientValue) === "string" ? item.foodNutrientValue.split(",") : item.foodNutrientValue
        consumedCal += (parseInt(foodNutrientValue[23]))
    })

    return (
        <View style={styles.mainContainer}>
            <RowSpaceBetween style={styles.header}>
                <RowWrapper style={{ marginVertical: 0 }}>
                    <Image
                        source={props.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={[styles.title, { fontFamily: props.lang.titleFont }]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </RowWrapper>
                <RowWrapper style={{ flexDirection: props.lang.rtl ? "row-reverse" : "row-reverse" }}>

                    {!props.diet.isActive || !props.diet.isBuy ?
                        <>
                            <Text style={{ color: defaultTheme.gray, fontFamily: props.lang.font }}> {props.lang.recommended}</Text>
                            <Text style={[styles.title, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.hasCredit ?
                                        parseInt(consumedCal) + ` ${props.lang.from} ` + parseInt(props.budget) :
                                        (<>{parseInt(consumedCal) + ` ${props.lang.from} `} <Image
                                            source={require("../../res/img/lock.png")}
                                            style={{ width: moderateScale(18), height: moderateScale(18) }}
                                            resizeMode="contain"
                                        /> </>
                                        )
                                }
                            </Text>
                        </>
                        :
                        <>
                            <Text style={{ color: defaultTheme.darkText, fontFamily: props.lang.font }}> کالری پیشنهادی </Text>
                            <Text style={[styles.title, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {parseInt(consumedCal)} {props.lang.from} {(props.budget * 1.03).toFixed(0)}
                            </Text>
                        </>
                    }
                </RowWrapper>
            </RowSpaceBetween>
            <View style={styles.body}>
                {
                    props.data.map((item) => {
                        return (
                            <FoodRow
                                lang={props.lang}
                                item={item}
                                key={item._id}
                                edit={props.edit}
                                remove={props.remove}
                            />
                        )
                    })
                }

                <RowStart style={{ marginVertical: moderateScale(0), marginTop: moderateScale(10), justifyContent: "space-between", width: "100%" }}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={styles.addContainer} onPress={props.addPressed}>
                            <Image
                                source={require("../../res/img/add.png")}
                                style={styles.plus}
                                resizeMode="contain"
                            />
                            <Text style={[styles.add, { fontFamily: props.lang.titleFont, fontSize: props.lang.langName === "persian" ? moderateScale(15) : moderateScale(14) }]} allowFontScaling={false}>
                                {
                                    props.lang.add
                                }
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.seprator} />
                        <TouchableOpacity onPress={props.barcode}>
                            <Image
                                source={require("../../res/img/barcode.png")}
                                style={styles.barcode}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    {props.data.length <= 0 ? null
                        :
                        (<TouchableOpacity
                            style={{ flexDirection: "row" }}
                            onPress={props.analyzMealPress}
                        >
                            <View style={{ marginHorizontal: moderateScale(5) }}><AnalyzSvg width={moderateScale(20)} /></View>
                            <Text style={{ fontFamily: props.lang.font, color: defaultTheme.darkText, fontSize: moderateScale(14.5) }}>{props.lang.mealAnalyz}</Text>
                            {
                                !props.hasCredit &&
                                <Image
                                    source={require("../../res/img/lock.png")}
                                    style={{ width: moderateScale(18), height: moderateScale(18) }}
                                    resizeMode="contain"
                                />
                            }
                        </TouchableOpacity>

                        )}


                </RowStart>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "95%",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: moderateScale(12),
    },
    header: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        borderRadius: moderateScale(10),
        backgroundColor: defaultTheme.lightGrayBackground,
        marginVertical: 0,
        paddingEnd: moderateScale(12),
        borderWidth: 1.2,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: { width: 1, height: 1 }

    },
    image: {
        width: moderateScale(30),
        height: moderateScale(22),
    },
    title: {
        marginLeft: moderateScale(8),
        fontSize: moderateScale(16),
        color: defaultTheme.mainText
    },
    body: {
        width: (dimensions.WINDOW_WIDTH * 0.95) - moderateScale(4),
        borderColor: defaultTheme.lightGray,
        borderWidth: 0.8,
        borderTopWidth: 0,
        borderBottomRightRadius: moderateScale(10),
        borderBottomLeftRadius: moderateScale(10),
        padding: moderateScale(10),
        transform: [
            {
                translateY: -moderateScale(3.5)
            }
        ]
        ,

    },
    addContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    seprator: {
        width: 1.5,
        height: moderateScale(33),
        backgroundColor: defaultTheme.lightGray,
        marginHorizontal: moderateScale(16)
    },
    add: {
        fontSize: moderateScale(17),
        color: defaultTheme.mainText,
        marginStart: moderateScale(3),
    },
    plus: {
        width: moderateScale(22),
        height: moderateScale(22)
    },
    barcode: {
        width: moderateScale(35),
        height: moderateScale(30)
    }

})

export default memo(DailyFoodContainer)