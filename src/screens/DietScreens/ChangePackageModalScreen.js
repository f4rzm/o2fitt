import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import DietPackageDetailsRow from '../../components/dietComponents/DietPackageDetailsRow'
import { dimensions } from '../../constants/Dimensions'
import { useDispatch, useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { setDietMeal } from '../../redux/actions/dietNew'
import { Toolbar } from '../../components'
import AnimatedLottieView from 'lottie-react-native'
import FloatSearchWithImage from '../../components/FloatSearchWithImage'

const ChangePackageModalScreen = (props) => {
    const lang = useSelector(state => state.lang)
    const allPacks = props.route.params.selectedPackageForChange
    const meal = props.route.params.meal
    const mealName = props.route.params.selectedMealName
    const selectedDate = props.route.params.selectedDate
    let diet = props.route.params.diet
    const [text, setText] = useState('')
    const [filterFoods, setFilterFoods] = useState([])
    const dispatch = useDispatch()

    const onChangeText = (text) => {
        // console.warn(FilterFoods[0].tag.split(""))
        setText(text)
        let filteredData = allPacks.filter((item) => {
            var tags = item.name.search(text)
            if (tags !== -1) {
                return item
            }
        })
        setFilterFoods(filteredData)
    }
    const onPressChangePackage = (item) => {
        diet[selectedDate][meal] = item
        dispatch(setDietMeal({ diet }))
        props.navigation.goBack()
    }
    return (
        <>
            <Toolbar
                lang={lang}
                title={mealName}
                onBack={() => props.navigation.goBack()}
            />
            <FloatSearchWithImage
                lang={lang}
                image={require("../../../res/img/search.png")}
                onChangeText={onChangeText}
            />
            <ScrollView
                style={{ width: dimensions.WINDOW_WIDTH }}
                contentContainerStyle={styles.container}
            >

                {
                    filterFoods.length > 0 ?
                        filterFoods.map((item) => (
                            <DietPackageDetailsRow
                                pack={item}
                                onPressChange={onPressChangePackage}
                                lang={lang}
                            />
                        )) :
                        filterFoods.length == 0 && text.length > 0 ?
                            <View style={{ flex: 1 }}>
                                <AnimatedLottieView
                                    style={{
                                        width: dimensions.WINDOW_WIDTH * 0.4,
                                        marginVertical: moderateScale(25),
                                        alignSelf: "center",
                                    }}
                                    source={require('../../../res/animations/noresulat.json')}
                                    autoPlay
                                    loop={true}
                                />
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), lineHeight: moderateScale(23), textAlign: "center" }}>{lang.packageNoResult}</Text>
                            </View>
                            :
                            allPacks.map((item) => (
                                <DietPackageDetailsRow
                                    pack={item}
                                    onPressChange={onPressChangePackage}
                                    lang={lang}
                                />
                            ))
                }
            </ScrollView>
        </>
    )
}

export default ChangePackageModalScreen

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: moderateScale(70)
    },
    searchBarContainer: {
        borderRadius: 15,
        width: dimensions.WINDOW_WIDTH * 0.8,
        borderColor: defaultTheme.lightGray,
        borderWidth: 1, flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: moderateScale(10),
        backgroundColor: "white",
        marginBottom: moderateScale(15)
    },
})