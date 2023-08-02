import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainToolbar } from '..'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'

const MainToolbarWithTopCurveView = ({ lang, children, scrollViewStyle, contentScrollViewStyle, unreadNum, onMessagePressed }) => {

    return (
        <>
            <MainToolbar
                onMessagePressed={onMessagePressed}
                unreadNum={unreadNum}
                lang={lang}
                disableCurve={true}
            />
            <View style={{ height: dimensions.WINDOW_HEIGTH, backgroundColor: defaultTheme.primaryColor, }}>
                <View
                    showsVerticalScrollIndicator={false}
                    style={[styles.scrolContainer, { ...scrollViewStyle }]}
                    contentContainerStyle={[contentScrollViewStyle]}
                >
                    {children}
                    {/* <View style={{ height: moderateScale(100) }} /> */}
                </View>
            </View>
        </>
    )
}

export default MainToolbarWithTopCurveView

const styles = StyleSheet.create({
    scrolContainer: {
        backgroundColor: defaultTheme.white,
        overflow: "hidden",
        flexGrow: 1,
        paddingBottom: moderateScale(60),
        borderTopRightRadius: moderateScale(20),
        borderTopLeftRadius: moderateScale(20)
    }
})