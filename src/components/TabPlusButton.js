import React, { memo, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from "react-native"
import { BlurContainer } from ".";
import { defaultTheme } from "../constants/theme";
import { moderateScale } from "react-native-size-matters";
import LottieView from 'lottie-react-native';

const TabPlusButton = props => {
    const [showModal, setShowModal] = React.useState(false)
    const plusRotation = useRef(new Animated.Value(0)).current
    const spin = plusRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"]
    })
    const plusAnimated = () => {
        // setTimeout(() => {
        // }, 1);
        Animated.spring(plusRotation, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
        setShowModal(true)
    }
    return (
        <TouchableOpacity
            style={[styles.mainContainer, props.style]}
            onPress={props.onPress ? props.onPress : plusAnimated}
            activeOpacity={0.8}

        >
            <Animated.View
                style={[styles.buttonContainer]}
            >
                <View>
                    <Animated.Image
                        source={require('../../res/img/plus.png')}
                        style={[{ width: moderateScale(21), height: moderateScale(21), resizeMode: "contain", tintColor: defaultTheme.white, transform: [{ rotate: spin }] }, props.imageStyle]} />
                </View>
            </Animated.View>
            <BlurContainer
                visible={showModal}
                onRequestClose={() => {
                    Animated.timing(plusRotation, {
                        toValue: 0,
                        useNativeDriver: true,
                        duration: 1
                    }).start(() => setShowModal(false))
                }}

                lang={props.lang}
                profile={props.profile}
                navigation={props.navigation}
                fastingDiet={props.fastingDiet}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: moderateScale(53),
        height: moderateScale(53),
        borderRadius: moderateScale(27),
        paddingBottom: moderateScale(25),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,

        
    },
    buttonContainer: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(27),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: defaultTheme.primaryColor,
    },
    button: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(23),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: defaultTheme.green2,
    }
})
export default memo(TabPlusButton)