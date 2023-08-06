import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, SafeAreaView, ActivityIndicator, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { setFastingMeal } from '../redux/actions/fasting';
import { Modal } from 'react-native-paper';
import ConfirmButton from './ConfirmButton';
import AnimatedLottieView from 'lottie-react-native';
import RowSpaceBetween from './layout/RowSpaceBetween';

const FastingDietChangeModal = ({ item, lang, selectedPackageForChange, dismissModal, selectedDate, fastingDiet, meal, translateY, selectedMealName }) => {

    const [FilterFoods, setFilterFoods] = useState(selectedPackageForChange)
    const [selectedPackageData, setSelectedPackageData] = useState([])
    const [focused, setFocused] = useState(false)
    const [text, setText] = useState('')

    let currentFastingDiet = fastingDiet

    const dispatch = useDispatch()
    const onChangeText = (text) => {
        // console.warn(FilterFoods[0].tag.split(""))
        setText(text)
        let filteredData = item.filter((item) => {
            var tags = item.name.search(text)
            if (tags !== -1) {
                return item
            }
        })
        setFilterFoods(filteredData)
    }
    const dietPackPressed = (item) => {
        setSelectedPackageData(item)
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
        }).start()
        setFocused(true)
    }
    const renderItem = (item, index) => {

        if (FilterFoods.length <= 0) {
            return <ActivityIndicator />
        }
        else {
            return (
                <TouchableOpacity onPress={() => dietPackPressed(item.item)} style={{ width: dimensions.WINDOW_WIDTH * .8, borderColor: defaultTheme.border, borderWidth: 1, borderRadius: 10, marginVertical: moderateScale(5), padding: moderateScale(10), flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: moderateScale(15), fontFamily: lang.font, lineHeight: moderateScale(23), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.55, textAlign: "left" }}>{item.item.name}</Text>
                    <Text style={{ fontSize: moderateScale(15), fontFamily: lang.font, lineHeight: moderateScale(23), color: defaultTheme.mainText, textAlign: "right", marginHorizontal: moderateScale(10) }}>{item.item.caloriValue} کالری </Text>
                </TouchableOpacity>
            )
        }


    }

    return (
        <KeyboardAvoidingView behavior='height'>
            <Animated.View style={[{ transform: [{ translateY: translateY }] }, styles.AnimatedModal]}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: dimensions.WINDOW_WIDTH * 0.9 }}>
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                        onPress={dismissModal}
                    >
                        <Image
                            source={require("../../res/img/cross.png")}
                            style={{ width: moderateScale(20), tintColor: defaultTheme.gray, height: moderateScale(20) }}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 4 }} >
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText, textAlign: "center", marginVertical: moderateScale(5), paddingVertical: moderateScale(3) }}>{selectedMealName}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    {/* <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText, textAlign: "center", marginVertical: moderateScale(5), paddingVertical: moderateScale(3) }}>{selectedMealName}</Text>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText, textAlign: "center", marginVertical: moderateScale(5), paddingVertical: moderateScale(3) }}>{selectedMealName}</Text> */}

                </View>
                <View style={styles.searchBarContainer}>
                    <Image
                        source={require("../../res/img/search.png")}
                        style={{ width: moderateScale(17), tintColor: defaultTheme.gray, height: moderateScale(17) }}
                    />
                    <TextInput
                        onChangeText={(text) => onChangeText(text)}
                        style={{ borderRadius: 15, width: dimensions.WINDOW_WIDTH * 0.8, borderColor: defaultTheme.border, fontFamily: lang.font, fontSize: moderateScale(14), paddingHorizontal: 15, height: moderateScale(40), textAlign: "right" }}
                        placeholder={lang.searchItemFoodTitle1}

                    />
                </View>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, borderBottomColor: defaultTheme.border, borderBottomWidth: 1, marginBottom: moderateScale(11) }} />
                {
                    text.length > 0 && FilterFoods.length <= 0 ?
                        <View style={{ flex: 1 }}>
                            <AnimatedLottieView
                                style={{
                                    width: dimensions.WINDOW_WIDTH * 0.4,
                                    marginVertical: moderateScale(25),
                                    alignSelf: "center",
                                }}
                                source={require('../../res/animations/noresulat.json')}
                                autoPlay
                                loop={true}
                            />
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), lineHeight: moderateScale(23), textAlign: "center" }}>{lang.packageNoResult}</Text>
                        </View>
                        :
                        <FlatList
                            data={FilterFoods.length <= 0 ? item : FilterFoods}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: moderateScale(100) }}
                        />
                }
                {/* <View style={{ height: moderateScale(110) }} /> */}

            </Animated.View>
            <Modal
                visible={focused}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setFocused(false)
                }}
            >
                <Animated.View style={{ transform: [{ translateY: translateY }], width: dimensions.WINDOW_WIDTH}}>
                    <View style={styles.packDetailsContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: moderateScale(10) }}>
                            <TouchableOpacity style={{ paddingHorizontal: moderateScale(20), paddingTop: moderateScale(20) }} onPress={() => {
                                currentFastingDiet[selectedDate][meal] = selectedPackageData
                                dispatch(setFastingMeal({ currentFastingDiet }))
                                dismissModal()
                            }}>
                                <Image
                                    style={styles.crossImage}
                                    source={require("../../res/img/done.png")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingHorizontal: moderateScale(20), paddingTop: moderateScale(20) }} onPress={() => {
                                setFocused(false)
                            }}>
                                <Image
                                    style={styles.doneImage}
                                    source={require("../../res/img/cross.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            selectedPackageData.length <= 0 ?
                                null :
                                <View style={{ alignSelf: "center", borderColor: defaultTheme.border, borderWidth: 1, borderRadius: 10, marginVertical: moderateScale(20) }}>
                                    <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), backgroundColor: defaultTheme.grayBackground, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderColor: defaultTheme.border, justifyContent: 'center' }}>
                                        <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", }}>
                                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{selectedMealName}</Text>
                                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{parseInt(selectedPackageData.nutrientValue.split(",")[23])} کالری</Text>
                                        </View>
                                    </View>
                                    {
                                        selectedPackageData.dietPackFoods.map((e, index) => {
                                            return (
                                                <View style={{ padding: moderateScale(5), alignItems: "center", borderBottomWidth: selectedPackageData.dietPackFoods.length - 1 !== index ? 1 : 0, borderBottomColor: defaultTheme.border, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, width: dimensions.WINDOW_WIDTH * 0.8, paddingVertical: moderateScale(8) }}>
                                                    <Text style={[styles.foodName, { fontFamily: lang.font, }]}>{e.foodName}</Text>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.3, textAlign: "right" }}>{e.value} {e.measureUnitName}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                        }
                        <View style={{height:dimensions.WINDOW_HEIGTH*0.17}}/>

                        {/* <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, backgroundColor: defaultTheme.lightBackground, borderRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0,alignItems:"center",paddingBottom:moderateScale(20) }}>
                        <ConfirmButton
                            lang={lang}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.45, backgroundColor: defaultTheme.green }}
                            title={"انتخاب"}
                            onPress={() => {
                                currentFastingDiet[selectedDate][meal] = selectedPackageData
                                dispatch(setFastingMeal({ currentFastingDiet }))
                                dismissModal()
                            }}
                        />
                        </View> */}
                    </View>
                </Animated.View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

export default FastingDietChangeModal

const styles = StyleSheet.create({
    secondModalContainer: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        padding: moderateScale(10),
        backgroundColor: "white",
        borderRadius: moderateScale(10)
    },
    flatList: {
        alignSelf: "center",
        borderWidth: 1,
        borderColor: defaultTheme.border,
        borderRadius: 10,
        marginVertical: moderateScale(10)
    },
    AnimatedModal: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: "white",
        // top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        // paddingBottom: dimensions.WINDOW_HEIGTH == 932 || dimensions.WINDOW_HEIGTH == 852 ? moderateScale(70) : 0,
        height: dimensions.WINDOW_HEIGTH * 0.8,
        paddingBottom: moderateScale(60)
    },
    confirmButton: {
        backgroundColor: defaultTheme.green,
        alignSelf: "center",
        marginBottom: moderateScale(25),
        zIndex: 15
    },
    doneImage: {
        width: moderateScale(20),
        height: moderateScale(25),
        tintColor: defaultTheme.darkGray,
        resizeMode: "contain"
    },
    crossImage: {
        width: moderateScale(25),
        height: moderateScale(25),
        tintColor: defaultTheme.primaryColor,
        resizeMode: "contain"
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
    packDetailsContainer: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: defaultTheme.lightBackground,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        // paddingBottom: moderateScale(130)
    },
    foodName: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        width: dimensions.WINDOW_WIDTH * 0.35,
        textAlign: "left"
    }
})