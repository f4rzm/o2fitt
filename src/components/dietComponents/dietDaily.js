import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { urls } from '../../utils/urls';
import axios from 'axios';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
import { allMeasureUnits } from '../../utils/measureUnits';

function dietDaily(props) {


    return (
        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, justifyContent: 'center', borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(5) }}>
            <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15), alignItems: "center" }}>
                <View style={{}}>
                    <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.5, textAlign: "left" }}>{props.item.item.foodName}</Text>
                    <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(12), color: defaultTheme.mainText, textAlign: "left", paddingTop: Platform.OS == "ios" ? moderateScale(10) : 0 }}>{props.item.item.value} {props.item.item.measureUnitName}</Text>
                </View>
                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{props.item.item.calorie}</Text>
            </View>
        </View>
    )
}
export default dietDaily