import React, { useRef, useState } from 'react'
import { View, Text, Animated, FlatList, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image, SafeAreaView } from 'react-native'
import ConfirmButton from '../ConfirmButton'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { ActivityIndicator, Modal } from 'react-native-paper'
import BreakFast from '../../../res/img/breakfast.svg'
import { useDispatch } from 'react-redux'
import { exchangeBreakFast, exchangeDinner, exchangeLunch } from '../../redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { exchangeSnack } from '../../redux/actions/dietNew'
import LottieView from 'lottie-react-native'
import analytics from '@react-native-firebase/analytics';


function ChangePackageModal(props) {

    const [FilterFoods, setFilterFoods] = useState(props.data)
    const [selectedPackageData, setSelectedPackageData] = useState([])
    const [focused, setFocused] = useState(false)
    const [text, setText] = useState('')

    const translateY = useRef(new Animated.Value(100)).current

    const dispatch = useDispatch()
    const onChangeText = (text) => {
        // console.warn(FilterFoods[0].tag.split(""))
        setText(text)

        let filteredData = props.data.filter((item) => {
            var tags = item.tag.search(text)

            if (tags !== -1) {
                return item

            }
        })
        setFilterFoods(filteredData)
    }
    const dietPackPressed = (item) => {
        console.error(item.id)
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
                    <Text style={{ fontSize: moderateScale(15), fontFamily: props.lang.font, lineHeight: moderateScale(23), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.55, textAlign: "left" }}>{item.item.name}</Text>
                    <Text style={{ fontSize: moderateScale(15), fontFamily: props.lang.font, lineHeight: moderateScale(23), color: defaultTheme.mainText, textAlign: "right", marginHorizontal: moderateScale(10) }}>{item.item.caloriValue} کالری </Text>
                </TouchableOpacity>
            )
        }


    }
    // console.warn(props.package)
    const foodPressed = () => {
        // const assignedData = Object.assign(selectedPackageData, { date: props.selectedDate, isAte: false, })
        const assignedData = {
            ...selectedPackageData,
            date: props.selectedDate,
            isAte: false,
            generatedId: props.package.generatedId == undefined ? 0 : props.package.generatedId
        }
        console.warn(assignedData);
        if (props.selectedMeal == 1) {
            dispatch(exchangeBreakFast(assignedData, props.selectedDate))
            setFocused(false)
            props.isChange()
            props.closeModal(props.selectedMeal)
        }
        else if (props.selectedMeal == 2) {
            dispatch(exchangeLunch(assignedData, props.selectedDate))
            setFocused(false)
            props.isChange()
            props.closeModal(props.selectedMeal)

        }
        else if (props.selectedMeal == 3) {

            dispatch(exchangeDinner(assignedData, props.selectedDate))
            setFocused(false)
            props.isChange()
            props.closeModal(props.selectedMeal)

        }
        else if (props.selectedMeal == 4) {
            dispatch(exchangeSnack(assignedData, props.data.generatedId))
            setFocused(false)
            props.isChange()
            props.closeModal(props.selectedMeal)
        }
        analytics().logEvent('dietPack_Changed')
    }
    console.warn(dimensions.WINDOW_HEIGTH);
    return (
        <SafeAreaView>
            <Animated.View style={[{ transform: [{ translateY: props.translateY }] }, styles.AnimatedModal]}>
                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.95, textAlign: "center", marginVertical: moderateScale(5) }}>{props.headerText}</Text>
                <View style={{ borderRadius: 15, width: dimensions.WINDOW_WIDTH * 0.8, borderColor: defaultTheme.lightGray, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: moderateScale(10), backgroundColor: "white", marginBottom: moderateScale(15) }}>
                    <Image
                        source={require("../../../res/img/search.png")}
                        style={{ width: moderateScale(17), tintColor: defaultTheme.gray, height: moderateScale(17) }}
                    />
                    <TextInput
                        onChangeText={(text) => onChangeText(text)}
                        style={{ borderRadius: 15, width: dimensions.WINDOW_WIDTH * 0.8, borderColor: defaultTheme.border, fontFamily: props.lang.font, fontSize: moderateScale(14), paddingHorizontal: 15, height: moderateScale(40), textAlign: "right" }}
                        placeholder={props.lang.searchItemFoodTitle1}
                        placeholderTextColor={defaultTheme.gray}

                    />
                </View>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, borderBottomColor: defaultTheme.border, borderBottomWidth: 1, marginBottom: moderateScale(11) }} />
                {
                    text.length > 0 && FilterFoods.length <= 0 ?
                        <View style={{ flex: 1 }}>
                            <LottieView
                                style={{
                                    width: dimensions.WINDOW_WIDTH * 0.4,
                                    marginVertical: moderateScale(25),
                                    alignSelf: "center",
                                }}
                                source={require('../../../res/animations/noresulat.json')}
                                autoPlay
                                loop={true}
                            />
                            <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), lineHeight: moderateScale(23), textAlign: "center" }}>{props.lang.packageNoResult}</Text>
                        </View>
                        :
                        <FlatList
                            data={FilterFoods.length <= 0 ? props.data : FilterFoods}
                            renderItem={renderItem}
                        />
                }
                <View style={{ height: moderateScale(110) }} />

            </Animated.View>
            <Modal
                visible={focused}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setFocused(false)

                }}
            >
                <Animated.View style={{ transform: [{ translateY: translateY }], width: dimensions.WINDOW_WIDTH, marginBottom: 0 }}>

                    <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, backgroundColor: defaultTheme.lightBackground, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderRadius: 15, marginHorizontal: dimensions.WINDOW_WIDTH * 0.025, paddingBottom: moderateScale(70) }}>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: moderateScale(10) }}>
                            <TouchableOpacity style={{ paddingHorizontal: moderateScale(20), paddingTop: moderateScale(20) }}
                                onPress={foodPressed}>
                                <Image
                                    style={styles.crossImage}
                                    source={require("../../../res/img/done.png")}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingHorizontal: moderateScale(20), paddingTop: moderateScale(20) }} onPress={() => {
                                setFocused(false)
                            }}>
                                <Image
                                    style={styles.doneImage}
                                    source={require("../../../res/img/cross.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            selectedPackageData.length <= 0 ?
                                null :
                                <View style={{ alignSelf: "center", borderColor: defaultTheme.border, borderWidth: 1, borderRadius: 10, marginVertical: moderateScale(20) }}>
                                    <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), backgroundColor: defaultTheme.grayBackground, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderColor: defaultTheme.border, justifyContent: 'center' }}>
                                        <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <BreakFast
                                                    width={moderateScale(30)}
                                                />
                                                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{props.headerText}</Text>
                                            </View>
                                            <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{parseInt(selectedPackageData.nutrientValue.split(",")[23])} کالری</Text>
                                        </View>
                                    </View>
                                    {
                                        selectedPackageData.dietPackFoods.map((item, index) => {
                                            return (
                                                <View style={{ padding: moderateScale(5), alignItems: "center", borderBottomWidth: selectedPackageData.dietPackFoods.length - 1 !== index ? 1 : 0, borderBottomColor: defaultTheme.border, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, width: dimensions.WINDOW_WIDTH * 0.8, paddingVertical: moderateScale(8) }}>
                                                    <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.35, textAlign: "left" }}>{item.foodName}</Text>
                                                    <View style={{ flexDirection: "row" }}>
                                                        {/* <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5), color: defaultTheme.mainText }}></Text> */}
                                                        <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.3, textAlign: "right" }}>{item.value} {item.measureUnitName}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                        }

                        {/* <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, backgroundColor: defaultTheme.lightBackground, borderRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingBottom: dimensions.WINDOW_HEIGTH == 932 || dimensions.WINDOW_HEIGTH == 852 ? moderateScale(70) : 0 }}>
                            <ConfirmButton
                                lang={props.lang}
                                title={"انتخاب"}
                                style={styles.confirmButton}
                                onPress={foodPressed}
                            />
                        </View> */}
                    </View>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
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
        top: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        // paddingBottom: dimensions.WINDOW_HEIGTH == 932 || dimensions.WINDOW_HEIGTH == 852 ? moderateScale(70) : moderateScale(40),
        height: dimensions.WINDOW_HEIGTH * 0.7
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
    }

});
export default ChangePackageModal