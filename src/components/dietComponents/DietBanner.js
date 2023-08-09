import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'

const DietBanner = ({ lang, item }) => {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate("MyDietTab")
            navigation.navigate("DietStartScreen", item)
        }} style={styles.container}>
            <Image
                source={{ uri: item.bannerImage }}
                style={styles.bannerImage}
                onLoadEnd={() => {
                    setLoading(false)
                }}
            />
            {
                loading &&
                <View style={[styles.bannerImage, { position: "absolute" }]}>
                    <ActivityIndicator size={'large'} color={defaultTheme.primaryColor}/>
                </View>

            }

            <View style={styles.footerContainer}>
                <Text style={[styles.text, { fontFamily: lang.font, }]}>{item.name[lang.langName]}</Text>
                <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.description, { fontFamily: lang.font, }]}>
                    {item.description[lang.langName]}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default DietBanner

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderColor: defaultTheme.border,
        padding: moderateScale(10),
        borderWidth: 1,
        borderRadius: moderateScale(10),
        alignItems: "center"
    },
    bannerImage: {
        width: "90%",
        height: moderateScale(100),
        borderRadius: moderateScale(10),
        alignItems: "center",
        justifyContent: "center"
    },
    footerContainer: {
        width: "96%",
        alignItems: "baseline"
    },
    text: {
        fontSize: moderateScale(16),
        textAlign: "left",
        marginVertical: moderateScale(10),
        color:defaultTheme.darkText
    },
    description: {
        fontSize: moderateScale(15),
        textAlign: "left",
        lineHeight: moderateScale(23),
        color:defaultTheme.gray

    }

})