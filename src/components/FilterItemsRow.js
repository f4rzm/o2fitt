import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'

const FilterItemsRow = ({ isSelected, lang, item,onPressItem }) => {
    return (
        <TouchableOpacity
            style={[styles.touchableStyle, { backgroundColor: isSelected ? defaultTheme.primaryColor : defaultTheme.transparent, borderColor: isSelected ? defaultTheme.primaryColor : defaultTheme.lightGray, }]}
            onPress={() => {
                onPressItem(item)
            }}
        >
            <Text style={[
                styles.text,
                {
                    fontFamily: lang.font,
                    color: isSelected ? defaultTheme.white : defaultTheme.darkText
                }
            ]}>{item.persian}</Text>
        </TouchableOpacity>
    )
}

export default FilterItemsRow

const styles = StyleSheet.create({
    text: {
        fontSize: moderateScale(16),
    },
    touchableStyle: {
        width: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: moderateScale(8),
        margin: moderateScale(5),
        borderRadius: moderateScale(10),
        borderWidth: 1
    }
})