import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'

const DietCategoryItems = ({ lang, item }) => {
    const navigation = useNavigation()
    console.warn(item);

    const onPressCategory = () => {
        navigation.navigate("DietStartScreen", item)
    }

    return (
        <TouchableOpacity onPress={onPressCategory} style={[styles.container]}>
            <Image
                source={{ uri: item.image }}
                style={{ width: moderateScale(100), height: moderateScale(100), resizeMode: "center" }}

            />
            <Text style={[styles.text, { fontFamily: lang.font }]}>{item.name[lang.langName]}</Text>
        </TouchableOpacity>
    )
}

export default DietCategoryItems

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        shadowColor: "black",
        padding: moderateScale(10),
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: { height: 3, width: 0 },
        backgroundColor: defaultTheme.white,
        marginVertical: moderateScale(10),
        borderRadius: moderateScale(10),
        justifyContent: "space-around"
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    }
})