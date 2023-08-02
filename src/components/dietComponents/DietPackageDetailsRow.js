import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'

const DietPackageDetailsRow = ({ lang, pack, onPressChange }) => {
    return (
        <Pressable
            onPress={() => {
                onPressChange(pack)
            }}
            style={styles.containerItem}>
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={require("../../../res/img/done.png")}
                        style={styles.imageDone}
                    />
                    <Text style={[{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.primaryColor, marginHorizontal: moderateScale(5) }]}>انتخاب</Text>
                </View>
                <Text style={[styles.calorieValueText, { fontFamily: lang.font }]}>{pack.caloriValue} کالری</Text>
            </View>
            {
                pack.dietPackFoods.map((item, index) => (
                    <View style={[styles.headerContainer, { paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(10), alignItems: "center", backgroundColor: defaultTheme.white, borderBottomWidth: index == (pack.dietPackFoods.length - 1) ? 0 : 1, borderColor: defaultTheme.border }]}>
                        <View style={{ alignItems: 'baseline' }}>
                            <Text style={[styles.calorieValueText, { fontFamily: lang.font }]}>{item.foodName}</Text>
                            <Text style={[styles.calorieValueText, { fontFamily: lang.font, fontSize: moderateScale(13) }]}>{item.value} {item.measureUnitName}</Text>
                        </View>
                        <Text style={[styles.calorieValueText, { fontFamily: lang.font }]}>{item.calorie} کالری</Text>
                    </View>
                ))
            }
        </Pressable>
    )
}

export default DietPackageDetailsRow

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    containerItem: {
        borderWidth: 1,
        // padding:moderateScale(10),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        width: dimensions.WINDOW_WIDTH * 0.8,
        marginVertical: moderateScale(10),
        overflow: "hidden"
    },
    headerContainer: {
        backgroundColor: defaultTheme.lightGrayBackground,
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: moderateScale(10),
        alignItems: 'center'
    },
    calorieValueText: {
        fontSize: moderateScale(15)
    },
    imageDone: {
        width: moderateScale(20),
        height: moderateScale(20),
        tintColor: defaultTheme.primaryColor,
        resizeMode: "contain"
    }
})