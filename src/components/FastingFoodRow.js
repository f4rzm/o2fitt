import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { allMeasureUnits } from '../utils/measureUnits'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'

const FastingFoodRow = ({ foodDB, item, lang, selectedDate }) => {
    const value = parseFloat(item.value)
    // const [measureunit, setMeasureunit] = useState(allMeasureUnits.filter((measure) => measure.id == item.measureUnitId))
    const [food, setFood] = useState({
        nutrientValue: [10],
    })
    
    const measureunit = allMeasureUnits.filter((measure) => measure.id == item.measureUnitId)
    const foodValue = parseFloat(item.value)

    useEffect(() => {
        let DB = foodDB;
        DB.get(`${item.foodName}_${item.foodId}`)
            .then((records) => {
                setFood(records)
            })

    }, [item])

    return (
        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, justifyContent: 'center', borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(5) }}>
            <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15), alignItems: "center" }}>
                <View style={{}}>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.5, textAlign: "left" }}>{item.foodName}</Text>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(12), color: defaultTheme.mainText, textAlign: "left", paddingTop: Platform.OS == "ios" ? moderateScale(10) : 0 }}>{foodValue == 0.25 ? "یک چهارم" : foodValue == 0.5 ? "نصف" : foodValue == 0.75 ? "سه چهارم" : foodValue} {item.measureUnitName}</Text>
                </View>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{food.nutrientValue.length > 10 ? ((food.nutrientValue[23] * value * measureunit[0].value) / 100).toFixed(0) : "درحال دریافت"}</Text>
            </View>
        </View>
    )
}

export default FastingFoodRow

const styles = StyleSheet.create({

    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {

    }
})