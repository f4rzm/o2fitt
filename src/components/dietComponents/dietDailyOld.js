import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { urls } from '../../utils/urls';
import axios from 'axios';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
import { allMeasureUnits } from '../../utils/measureUnits';


function DietDailyOld(props) {
    const foodValue = parseFloat(props.item.item.value)
    const [food, setFood] = useState({
        nutrientValue: [10],
    })
    const [measureunit, setMeasureunit] = useState([0])

    useEffect(() => {
        setMeasureunit(allMeasureUnits.filter((measure) => measure.id == props.item.item.measureUnitId))

        let DB = props.foodDB;
        DB.get(`${props.item.item.foodName}_${props.item.item.foodId}`)
        .then((records) => {
        //   console.warn('getFromDB records', records);
          setFood(records)
        })

        // let url = urls.foodBaseUrl + urls.food + `?foodId=${props.item.item.foodId}`
        // const header = {
        //     headers: {
        //         Authorization: 'Bearer ' + props.auth.access_token,
        //         Language: props.lang.capitalName,
        //     },
        // };
        // axios.get(url, header).then((res) => {
        //     // console.error(res.data.data.nutrientValue[23])
        //     setFood(res.data.data)
        //     // console.warn(res.data.data)
        // })

    }, [])


    return (
        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, justifyContent: 'center', borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(5) }}>
            <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15), alignItems: "center" }}>
                <View style={{}}>
                    <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.5, textAlign: "left" }}>{props.item.item.foodName}</Text>
                    <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(12), color: defaultTheme.mainText, textAlign: "left", paddingTop: Platform.OS == "ios" ? moderateScale(10) : 0 }}>{foodValue == 0.25 ? "یک چهارم" : foodValue == 0.5 ? "نصف" : foodValue == 0.75 ? "سه چهارم" : foodValue} {props.item.item.measureUnitName}</Text>
                </View>
                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{food.nutrientValue.length>10?((food.nutrientValue[23] * props.value * measureunit[0].value) / 100).toFixed(0):"درحال دریافت"}</Text>
            </View>
        </View>
    )
}
export default DietDailyOld