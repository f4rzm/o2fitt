import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'

const DietCategoryItems = ({ lang, item }) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    const onPressCategory = () => {
        navigation.navigate("MyDietTab")
        navigation.navigate("DietStartScreen", item)
        // setTimeout(() => {
        // }, 1);
    }

    return (
        <TouchableOpacity onPress={onPressCategory} style={[styles.container]}>
            <View style={{ height: moderateScale(100) }}>
                <FastImage
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: moderateScale(100), resizeMode: "center", borderRadius: moderateScale(8) }}
                    onLoadEnd={() => {
                        setLoading(false)
                    }}
                />
                {
                    loading &&
                    <View style={{ width: '100%', height: moderateScale(100), resizeMode: "center", borderRadius: moderateScale(8), position: "absolute", alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={'large'} color={defaultTheme.primaryColor} />
                    </View>
                }


            </View>
            <Text style={[styles.text, { fontFamily: lang.font }]}>{item.name[lang.langName]}</Text>
        </TouchableOpacity>
    )
}

export default DietCategoryItems

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        shadowColor: "black",
        // padding: moderateScale(10),
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: { height: 3, width: 0 },
        backgroundColor: defaultTheme.white,
        margin: moderateScale(10),
        borderRadius: moderateScale(10),
        justifyContent: "space-around",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: defaultTheme.border,
        padding: moderateScale(10)
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "left",
        paddingTop: moderateScale(10)
    }
})