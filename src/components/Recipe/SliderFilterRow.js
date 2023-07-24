import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { moderateScale } from 'react-native-size-matters'
import Thumb from '../../../res/img/Menu.svg'
import { Slider } from '@miblanchard/react-native-slider'
import { dimensions } from '../../constants/Dimensions'
import { defaultTheme } from '../../constants/theme'


const SliderFilterRow = ({ header, lang, items, minVal, maxVal, selectedValue, valueType, onValueChange }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontFamily: lang.font }]}>{header}</Text>
            <Text style={[styles.subTitle, { fontFamily: lang.font }]}>از {selectedValue[0]} تا {selectedValue[1]} {valueType}</Text>
            <Slider
                value={selectedValue}
                onValueChange={(value) => {
                    onValueChange(value)
                }}

                maximumValue={maxVal}
                minimumValue={minVal}
                step={1}
                trackStyle={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: defaultTheme.primaryColor}}
                thumbTintColor={defaultTheme.primaryColor}
                thumbStyle={{ shadowColor: "black", shadowOffset: { width: 1, height: 2 }, shadowRadius: 2, shadowOpacity: 0.4, width: moderateScale(23), height: moderateScale(23), borderRadius: moderateScale(12) }}
            />
        </View>
    )
}

export default SliderFilterRow

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: moderateScale(20)
    },
    title: {
        fontSize: moderateScale(18),
        marginVertical: moderateScale(10),
        textAlign: "left",
        width: dimensions.WINDOW_WIDTH * 0.93
    },
    subTitle: {
        fontSize: moderateScale(17),
    }
})