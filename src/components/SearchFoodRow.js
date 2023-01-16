import React, { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import RowStart from "./layout/RowStart";
import Reciepe from "../../res/img/reciepe.svg"
import { nutritions } from '../utils/nutritions'
import CommonText from './CommonText'
import { useSelector } from 'react-redux'

const bigNutrient = [
    { id: 31, color: defaultTheme.error },
    { id: 9, color: defaultTheme.green },
    { id: 0, color: defaultTheme.blue },
];
const nutrientIds = nutritions.map(item => {
    if (item.id == 2) {
        return item
    }
})
console.log(nutrientIds);

const SearchFoodRow = props => {
    const lang = useSelector(state => state.lang)

    const nutrientValue = typeof props.item.nutrientValue === 'string' ? props.item.nutrientValue.split(',') : props.item.nutrientValue;


    const renderbigNutrient = () => {
        return bigNutrient.map((item, index) => {
            return (
                <View key={index} style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={[styles.chart, { backgroundColor: item.color,marginHorizontal:index==1?moderateScale(5):0,marginVertical:Platform.OS=="ios"?moderateScale(4):0 }]}>
                        {index === 0 && <CommonText styleText={{ color: '#fff',paddingVertical:Platform.OS=="ios"?moderateScale(4):0 }} text={lang.langName == "persian" ? "ک" : lang.langName == "english" ? "C" : "ک"} />}
                        {index === 1 && <CommonText styleText={{ color: '#fff',paddingVertical:Platform.OS=="ios"?moderateScale(4):0 }} text={lang.langName == "persian" ? "پ" : lang.langName == "english" ? "P" : "ب"} />}
                        {index === 2 && <CommonText styleText={{ color: '#fff',paddingVertical:Platform.OS=="ios"?moderateScale(4):0 }} text={lang.langName == "persian" ? "چ" : lang.langName == "english" ? "F" : "د"} />}
                    </View>
                    <CommonText text={parseInt(nutrientValue[item.id])} styleText={styles.valueBigNutrient} />
                </View>
            )
        })
    }


    return (

        <TouchableOpacity
            onPress={() => props.onPress(props.item)}
            activeOpacity={0.6}
        >
            <RowStart style={styles.mainContainer}>
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
                {props.isShowingNutirent ? nutrientValue && <View style={styles.row}>{renderbigNutrient()}</View> : null}
                

            </RowStart>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 1.3,
        padding: moderateScale(6),
        paddingHorizontal: moderateScale(16),
        marginVertical: 0,

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
        width: moderateScale(230),
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
    },
    valueBigNutrient: {
        fontSize: moderateScale(14),
        color: defaultTheme.darkText,
        textAlign: "center",
    },

})

export default memo(SearchFoodRow)