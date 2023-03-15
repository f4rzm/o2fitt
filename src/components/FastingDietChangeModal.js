import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { setFastingMeal } from '../redux/actions/fasting';
import { Modal } from 'react-native-paper';
import ConfirmButton from './ConfirmButton';

const FastingDietChangeModal = ({ item, lang, selectedPackageForChange, dismissModal, selectedDate, fastingDiet, meal }) => {
    const dispatch = useDispatch();
    let currentFastingDiet = fastingDiet
    const [selectedPackage, setSelectedPackage] = useState()

    return (
        <View style={{}}>
            <KeyboardAvoidingView style={{}} behavior={"height"}>
                {/* <View style={{ width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, alignItems: "center", justifyContent: "center" }}> */}
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, height: dimensions.WINDOW_HEIGTH * 0.8, backgroundColor: defaultTheme.white, borderRadius: moderateScale(10), paddingHorizontal: moderateScale(20) }}>
                    <FlatList
                        data={item}
                        renderItem={(item) => (
                            <TouchableOpacity onPress={() => {
                                setSelectedPackage(item.item)
                                // console.warn(selectedPackageForChange);
                                // currentFastingDiet[selectedDate][meal] = item.item
                                // dispatch(setFastingMeal({ currentFastingDiet }))
                                // dismissModal()
                            }}
                                style={{ paddingVertical: moderateScale(10), borderBottomWidth: 1, borderColor: defaultTheme.border }}>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15) }}>{item.item.name}</Text>
                            </TouchableOpacity>
                        )}
                        style={{ padding: moderateScale(10), backgroundColor: defaultTheme.white }}
                        ListHeaderComponent={() => (
                            <View style={{ backgroundColor: defaultTheme.grayBackground, borderRadius: moderateScale(10) }}>
                                <TextInput
                                    style={{ borderRadius: moderateScale(10), fontFamily: lang.font }}
                                    placeholder={lang.searchItemFoodTitle}
                                />
                            </View>
                        )}
                        stickyHeaderIndices={[0]}
                    />
                </View>
                {/* </View> */}
            </KeyboardAvoidingView>
            <Modal
                visible={selectedPackage}
                onDismiss={() => {
                    setSelectedPackage()
                }}
            >
                <View style={styles.secondModalContainer}>
                    {
                        selectedPackage &&
                        selectedPackage.dietPackFoods.map((item, index) => {
                            return (
                                <>
                                    <View style={{ alignItems: "center", borderBottomWidth: selectedPackage.dietPackFoods.length - 1 !== index ? 1 : 0, borderBottomColor: defaultTheme.border, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, width: dimensions.WINDOW_WIDTH * 0.8, paddingVertical: moderateScale(8) }}>
                                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.35, textAlign: "left" }}>{item.foodName}</Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, width: dimensions.WINDOW_WIDTH * 0.3, textAlign: "right" }}>{item.value} {item.measureUnitName}</Text>
                                        </View>
                                    </View>

                                </>
                            )
                        })
                    }
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ConfirmButton
                            lang={lang}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.45, backgroundColor: defaultTheme.green }}
                            title={"انتخاب"}
                            onPress={() => {
                                currentFastingDiet[selectedDate][meal] = selectedPackage
                                dispatch(setFastingMeal({ currentFastingDiet }))
                                dismissModal()
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default FastingDietChangeModal

const styles = StyleSheet.create({
    secondModalContainer: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        padding: moderateScale(10),
        backgroundColor: "white",
        borderRadius: moderateScale(10)
    }
})