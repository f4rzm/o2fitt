import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../constants/Dimensions'
import { useNavigation } from '@react-navigation/native'

const RecipeCatRender = (props) => {
    const navigation=useNavigation()
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("RecipeDetailsScreen", { items: props.item })}
            style={{ width: dimensions.WINDOW_WIDTH * 0.33, padding: moderateScale(15), height: moderateScale(150) }}>
            <FastImage
                style={{ width: moderateScale(90), height: moderateScale(90), backgroundColor: !props.index == 0 && !props.hasCredit ? "black" : "lightgray", borderRadius: 15, opacity: !props.index == 0 && !props.hasCredit ? 0.3 : 1 }}
                source={{ uri: `https://food.o2fitt.com/Foodthumb/${props.item.imageThumb}` }}
            />
            {
                !props.index == 0 && !props.hasCredit ? (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("PackagesScreen")}
                        activeOpacity={0.7}
                        style={{ position: "absolute", width: dimensions.WINDOW_WIDTH * 0.33, height: moderateScale(150), alignItems: "center", justifyContent: "center", padding: moderateScale(15) }}
                    >
                        <Image
                            source={require('../../res/img/lock.png')}
                            style={{ width: moderateScale(30), height: moderateScale(30), tintColor: defaultTheme.primaryColor, resizeMode: "contain", top: moderateScale(-15) }}
                        />
                    </TouchableOpacity>
                ) : null

            }
            <Text style={{ fontFamily: props.lang.font, color: defaultTheme.mainText, fontSize: moderateScale(14), textAlign: 'left', marginTop: Platform.OS == "ios" ? moderateScale(7) : 0 }}>{props.item.name}</Text>
        </TouchableOpacity>
    )
}

export default RecipeCatRender

const styles = StyleSheet.create({})