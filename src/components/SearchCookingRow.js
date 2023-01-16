import React, { memo, useRef, useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import RowStart from "./layout/RowStart";
import Reciepe from "../../res/img/reciepe.svg"
import { nutritions } from '../utils/nutritions'
import CommonText from './CommonText'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/EvilIcons'
const { width } = Dimensions.get("screen")

const bigNutrient = [
    { id: 31, color: defaultTheme.green },
    { id: 9, color: defaultTheme.error },
    { id: 0, color: defaultTheme.blue },
];
const nutrientIds = nutritions.map(item => {
    if (item.id == 2) {
        return item
    }
})
console.log(nutrientIds);

const SearchCookingRow = (props) => {

    const translateXDelete = useRef(new Animated.Value(70)).current;
    const [activeDelete, setActiveDelete] = useState(false);

    const transform = { transform: [{ translateX: translateXDelete }] };

    const lang = useSelector(state => state.lang)

    const nutrientValue = typeof props.item.nutrientValue === 'string' ? props.item.nutrientValue.split(',') : props.item.nutrientValue;

    const pressDelete = () => {
        // console.log(props.items);
        props.askForDelete(props.item)
    };
    const onPress = () => {
        props.onPress(props.item);
    };


    const renderbigNutrient = () => {
        return bigNutrient.map((item, index) => {
            return (
                <View key={index} style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={[styles.chart, { backgroundColor: item.color }]}>
                        {index === 0 && <CommonText styleText={{ color: '#fff' }} text={lang.langName == "persian" ? "ک" : lang.langName == "english" ? "C" : "ک"} />}
                        {index === 1 && <CommonText styleText={{ color: '#fff' }} text={lang.langName == "persian" ? "پ" : lang.langName == "english" ? "P" : "ب"} />}
                        {index === 2 && <CommonText styleText={{ color: '#fff' }} text={lang.langName == "persian" ? "چ" : lang.langName == "english" ? "F" : "د"} />}
                    </View>
                    <CommonText text={parseInt(nutrientValue[item.id])} styleText={styles.valueBigNutrient} />
                </View>
            )
        })
    }


    return (

        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
        >
            <View style={styles.container}>


                <View style={{ paddingStart: 10, flexDirection: "row", alignItems: "center", width: width + 70, borderBottomWidth: 0.4, borderBottomColor: defaultTheme.gray }}>
                    {props.deleteBtn ? nutrientValue && <View style={styles.row}>
                        <TouchableOpacity activeOpacity={.6} style={styles.buttonRemove} onPress={pressDelete}>
                            <Image
                                style={styles.image}
                                resizeMode="contain"
                                source={require("../../res/img/remove.png")}
                            />
                        </TouchableOpacity>
                    </View> : null}

                    {
                        props.item.personalFoodId &&
                        <Reciepe
                            width={moderateScale(33)}
                            height={moderateScale(33)}
                            preserveAspectRatio="none"
                            style={{ marginRight: moderateScale(8) }}
                        />
                    }
                    <Text style={[styles.title, { fontFamily: props.lang.font }]}>
                        {
                            props.item.name
                        }
                        {
                            (props.item.foodType === 3 && props.item.brandName && props.item.brandName[props.lang.langName]) ? " - " : ""

                        }
                        {
                            (props.item.foodType === 3 && props.item.brandName) &&
                            <Text style={[styles.title, { fontFamily: props.lang.font, color: defaultTheme.error }]}>
                                {props.item.brandName[props.lang.langName]}
                            </Text>

                        }
                    </Text>
                    {props.isShowingN ? nutrientValue && <View style={styles.row}>{renderbigNutrient()}</View> : null}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width + 70,
        flexDirection: 'row',
        paddingStart: moderateScale(30)
    },
    mainContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 1.3,
        padding: moderateScale(6),
        paddingHorizontal: moderateScale(16),
        marginVertical: 0,
    },
    buttonRemove: {
        justifyContent: 'center',
        alignItems: 'center',
        width: moderateScale(35),
        height: moderateScale(50),
        // paddingVertical: 10
    },
    logo: {
        width: moderateScale(33),
        height: moderateScale(33),
        marginHorizontal: moderateScale(8)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        width: moderateScale(200),
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "left",
        marginVertical: moderateScale(3)
    },
    chart: {
        width: moderateScale(35),

        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 5,
    },
    valueBigNutrient: {
        fontSize: moderateScale(14),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    image: {
        width: moderateScale(19),
        height: moderateScale(19),
    },

})

export default memo(SearchCookingRow)