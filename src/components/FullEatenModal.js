import { View, Text, TouchableWithoutFeedback, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { dimensions } from '../constants/Dimensions'
import { BlurView } from '@react-native-community/blur'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import AnimatedLottieView from 'lottie-react-native'

function FullEatenModal(props) {
    return (

        <View style={styles.containter}>
            <AnimatedLottieView
                source={require('../../res/animations/success1.json')}
                autoPlay={true}
                style={{ width: dimensions.WINDOW_WIDTH * 0.85, height: moderateScale(300) }}
                loop={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        width: dimensions.WINDOW_WIDTH,
        height: dimensions.WINDOW_HEIGTH,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center"
    },
    viewContaitner: {
        backgroundColor: defaultTheme.white,
        width: dimensions.WINDOW_WIDTH * 0.85,
        height: dimensions.WINDOW_HEIGTH * 0.5,
        alignItems: "center",
        borderRadius: moderateScale(13),
        elevation: 30
    }

})

export default FullEatenModal