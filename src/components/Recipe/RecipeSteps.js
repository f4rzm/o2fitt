import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'
import { ScrollView } from 'react-native-gesture-handler'

const RecipeSteps = ({ route }) => {
    const lang = route.params.lang

    return (

        <ScrollView style={{flex:1}}>
            {
                route.params.item.recipe[lang.langName] == null ? null :
                    route.params.item.recipe[lang.langName].split("$").map((item, index) => {
                        if (index == 2 || index == 3) {
                            return item.split("*").map((des, i) => {
                                if (index !== 0 && index !== 1) {
                                    return (
                                        <View style={{ flexDirection: "row", borderBottomWidth: i == 0 ? null : 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(5), marginHorizontal: moderateScale(20), alignItems: "center", width: dimensions.WINDOW_WIDTH * .85 }}>
                                            {i == 0 ? null : <Text style={{ fontSize: moderateScale(25), fontFamily: lang.font, marginRight: moderateScale(10) }}> {i}</Text>}
                                            <Text style={{ fontSize: index == 3 && i == 0 ? moderateScale(18) : moderateScale(15), fontFamily: lang.font, lineHeight: moderateScale(25), color: index == 3 && i == 0 ? defaultTheme.darkText : defaultTheme.darkText, textAlign: "left" }}>{des}</Text>
                                        </View>
                                    )
                                }
                            })
                        }

                    })

            }
        </ScrollView>

    )
}

export default RecipeSteps

const styles = StyleSheet.create({})