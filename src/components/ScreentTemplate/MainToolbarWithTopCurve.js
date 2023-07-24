import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MainToolbar } from '../../components'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'

const MainToolbarWithTopCurve = ({ lang, children, scrollViewStyle, contentScrollViewStyle }) => {

    return (
        <>
            <MainToolbar
                lang={lang}
                disableCurve={true}
            />
            <View style={{ flex: 1, backgroundColor: defaultTheme.primaryColor, }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[styles.scrolContainer, { ...scrollViewStyle }]}
                    contentContainerStyle={[contentScrollViewStyle]}
                >
                    {children}
                    <View style={{ height: moderateScale(100) }} />
                </ScrollView>
            </View>
        </>
    )
}

export default MainToolbarWithTopCurve

const styles = StyleSheet.create({
    scrolContainer: {
        backgroundColor: defaultTheme.white,
        overflow: "hidden",
        flexGrow: 1,
        paddingVertical: moderateScale(15),
        borderTopRightRadius: moderateScale(20),
        borderTopLeftRadius: moderateScale(20)
    }
})