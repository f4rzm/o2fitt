import React, { memo } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native"
import { moderateScale, scale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Svg from 'react-native-svg'



const ConfirmButton = props => {

    if (props.isLoading) {
        return (
            <View style={[styles.activityIndicaotrContainer, props.style, { backgroundColor: defaultTheme.transparent }]}>
                <ActivityIndicator size="large" color={defaultTheme.primaryColor} />
            </View>
        )
    }

    return (
        <TouchableOpacity activeOpacity={props.deActive ? 1 : 0.7} onPress={() => props.deActive ? false : props.onPress()}>
            <View style={props.deActive ? { ...styles.deActiveContainer } : { ...styles.container, ...props.style }}>
                {
                    props.leftSvg

                }
                {
                    props.leftImage &&
                    <Image
                        source={props.leftImage}
                        style={[styles.imageStyle, props.imageStyle, { transform: [{ scaleX: (props.lang.rtl && props.rotate) ? -1 : 1 }] }]}
                        resizeMode="contain"
                    />
                }
                <Text style={[styles.textStyle, { fontFamily: props.lang.font }, props.textStyle]} allowFontScaling={false}>
                    {props.title}
                </Text>
                {
                    props.rightImage &&
                    <Image
                        source={props.rightImage}
                        style={[styles.imageStyle, props.imageStyle, { transform: [{ scaleX: (props.lang.rtl && props.rotate) ? -1 : 1 }] }]}
                        resizeMode="contain"
                    />
                }
                {
                    props.rightSvg
                }

            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: moderateScale(180),
        height: moderateScale(40),
        backgroundColor: defaultTheme.primaryColor,
        borderRadius: moderateScale(8),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: moderateScale(4),
    },
    activityIndicaotrContainer: {
        width: moderateScale(180),
        height: moderateScale(40),
        backgroundColor: defaultTheme.transparent,
        borderRadius: moderateScale(15),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: moderateScale(4),
    },
    deActiveContainer: {
        width: moderateScale(180),
        height: moderateScale(40),
        backgroundColor: defaultTheme.grayBackground,
        borderRadius: moderateScale(15),
        justifyContent: "center",
        alignItems: "center",
    },
    touchableStyle: {
        width: moderateScale(180),
        height: moderateScale(40),
        borderRadius: moderateScale(15),
        justifyContent: "center",
        alignItems: "center",
    },
    textStyle: {
        fontSize: moderateScale(18),
        color: defaultTheme.lightText,
        alignSelf: "center",
        marginHorizontal: moderateScale(5)
    },
    imageStyle: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginRight: moderateScale(5),
        tintColor: "white"
    }
})

export default memo(ConfirmButton)