import { View, Text, TouchableOpacity, StyleSheet, TextInput, I18nManager } from 'react-native'
import React, { useRef } from 'react'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'

export default function targetNutrition(props) {
    const textInput = useRef(null)
    return (
        <TouchableOpacity onPress={() => textInput.current.focus()} style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={{ flexDirection: "row",alignItems:"center",height:"100%",justifyContent:"center" ,marginHorizontal:moderateScale(10)}}>
                    <Text style={[styles.text2, { fontFamily: props.lang.font, margin: moderateScale(3) }]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={textInput}
                        style={[styles.input, { fontFamily: props.lang.font }]}
                        maxLength={3}
                        keyboardType="number-pad"
                        placeholder="0"
                        numberOfLines={1}
                        value={props.value}
                        onChangeText={props.onChangeText}
                        underlineColorAndroid={'transparent'}
                        selectTextOnFocus={true}

                    />
                <Text style={{ fontSize: moderateScale(13) }}>
                    {props.symbol}
                </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        margin: moderateScale(6),
        borderWidth: 1.3,
        borderRadius: moderateScale(12),
        borderColor: defaultTheme.border,
        paddingVertical:moderateScale(7)
    },
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text1: {
        fontSize: moderateScale(15),
        color: defaultTheme.gray
    },
    text2: {
        fontSize: moderateScale(14),
        color: defaultTheme.darkText,
    },

    inputContainer: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        width: moderateScale(80),
        height: moderateScale(35),
        right: moderateScale(10),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.3,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(8)
    },
    input: {
        width: moderateScale(50),
        height: moderateScale(40),
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "center",
        borderBottomColor: 'transparent',
    }

})