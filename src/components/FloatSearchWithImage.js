import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'

const FloatSearchWithImage = ({ lang, onChangeText, image }) => {
    return (
        <View style={{ zIndex: 10 }}>
            <View style={styles.container}>
                <View style={styles.searchBarContainer}>
                    <Image
                        source={image ? image : require("../../res/img/search.png")}
                        style={{ width: moderateScale(17), tintColor: defaultTheme.gray, height: moderateScale(17) }}
                    />
                    <TextInput
                        onChangeText={(text) => onChangeText(text)}
                        style={[styles.textInput, { fontFamily: lang.font, }]}
                        placeholder={lang.searchItemFoodTitle1}
                        placeholderTextColor={defaultTheme.gray}
                    />
                </View>
            </View>
        </View>
    )
}

export default FloatSearchWithImage

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: 'center',
        paddingTop: moderateScale(10),
        top: 0,
        position: "absolute"
    },
    searchBarContainer: {
        borderRadius: 15,
        width: dimensions.WINDOW_WIDTH * 0.8,
        borderColor: defaultTheme.lightGray,
        borderWidth: 1, flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: moderateScale(10),
        backgroundColor: "white",
        marginBottom: moderateScale(15)
    },
    textInput: {
        borderRadius: 15,
        width: dimensions.WINDOW_WIDTH * 0.8,
        borderColor: defaultTheme.border,

        fontSize: moderateScale(14),
        paddingHorizontal: 15,
        height: moderateScale(40),
        textAlign: "right"
    }
})