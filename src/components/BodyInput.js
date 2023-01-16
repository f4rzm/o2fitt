
import React, { memo, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';

const BodyInput = props => {
    const textInput = useRef(null)
    return (
        <TouchableOpacity onPress={() => textInput.current.focus()} style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.circle}>
                        <Text style={[styles.text2, { fontFamily: props.lang.font, color: defaultTheme.lightBackground }]} allowFontScaling={false}>
                            {
                                props.number
                            }
                        </Text>
                    </View>

                    <Text style={[styles.text2, { fontFamily: props.lang.font, margin: moderateScale(3) }]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </View>
                <View style={[styles.inputContainer]}>
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
                    <Text style={{ fontSize: moderateScale(16) }}>
                        cm
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={[styles.text2, { fontFamily: props.lang.font, paddingHorizontal: moderateScale(10) }]} allowFontScaling={false}>
                    {
                        props.desc
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: dimensions.WINDOW_WIDTH * 0.90,
        margin: moderateScale(6),
        paddingBottom: moderateScale(5),
        borderWidth: 1.3,
        borderRadius: moderateScale(12),
        borderColor: defaultTheme.border,
    },
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: moderateScale(2)
    },
    text1: {
        fontSize: moderateScale(15),
        color: defaultTheme.gray
    },
    text2: {
        fontSize: moderateScale(14),
        color: defaultTheme.darkText,

    },
    circle: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        backgroundColor: defaultTheme.primaryColor,
        alignItems: "center",
        justifyContent: "center",
        margin: moderateScale(3)
    },
    inputContainer: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        width: moderateScale(80),
        height: moderateScale(40),
        top: moderateScale(10),
        right: moderateScale(10),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.3,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(8)
    },
    input: {
        minWidth: moderateScale(50),
        height: moderateScale(50),
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
        textAlign: "center",
        borderBottomColor: 'transparent',
    }

})

export default memo(BodyInput)