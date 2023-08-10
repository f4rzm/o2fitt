import React, { useState, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { ConfirmButton, OFitToolBar } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { Modal } from 'react-native-paper'
import Info from '../../../res/img/info3.svg'
import { Picker } from 'react-native-wheel-pick'


function ChooseDietTargetScreen(props) {
    console.warn(props.route.params);
    const lang = useSelector(state => state.lang)

    const profile = useSelector(state => state.profile)
    const specification = useSelector((state) => state.specification);
    const [bodyTarget, setBodyTarget] = useState(0)
    const [autoFuces, setAutoFuces] = useState(false)
    const [autoFucesS, setAutoFucesS] = useState(false)
    const [selectedKG, setSelectedKG] = useState(`${specification[0].weightSize.toString().split(".")[0]}`)
    const [selectedGR, setSelectedGR] = useState(`${specification[0].weightSize.toString().split(".")[1] == undefined ? 0 : specification[0].weightSize.toString().split(".")[1]}`)
    const [selectedTergetKG, setSelectedTergetKG] = useState(`${profile.targetWeight.toString().split(".")[0]}`)
    const [selectedTergetGR, setSelectedTergetGR] = useState(`${profile.targetWeight.toString().split(".")[1] == undefined ? 0 : profile.targetWeight.toString().split(".")[1]}`)
    const translateYF = useRef(new Animated.Value(100)).current
    const translateYS = useRef(new Animated.Value(100)).current

    const bodyTargetData = [
        { id: 0, name: lang.weightLoss, title: "اگر میخواین لاغر بشین این گزینه رو انتخاب کنین" },
        { id: 1, name: lang.weightGain, title: "اگر میخوایین چاق بشین این گزینه رو انتخاب کنین" },
        { id: 2, name: lang.weightStability, title: "اگر میخواین وزن فعلی رو حفظ کنین این گزینه رو انتخاب کنین" },
    ]

    const openweightModal = () => {
        Animated.spring(translateYF, {
            toValue: -100,
            useNativeDriver: true
        }).start()
        setAutoFuces(true)
    }
    const openTargetWeightModal = () => {
        Animated.spring(translateYS, {
            toValue: -40,
            useNativeDriver: true
        }).start()
        setAutoFucesS(true)
    }

    const weightkg = Array.from({ length: 126 }, (x, i) => (i + 35).toString());
    const weightgr = Array.from({ length: 10 }, (x, i) => (i).toString());

    const showError = (err) => {
        console.error(err)
    }

    return (
        <SafeAreaView>
            <OFitToolBar
                BackPressed={() => props.navigation.goBack()}
            />
            <View style={styles.headerContainer}>
                <Text style={{ textAlign: "center", fontSize: moderateScale(20), fontFamily: lang.font, color: defaultTheme.darkText }}>هدف رو مشخص کنین</Text>
            </View>
            <ScrollView style={{ height: "87%" }}>
                <View style={styles.firstCard}>
                    <View style={{ flexDirection: "row", padding: moderateScale(10), alignItems: "center" }}>
                        <Image
                            source={require('../../../res/img/body_manage.png')}
                            style={{ width: moderateScale(27), height: moderateScale(27), tintColor: defaultTheme.primaryColor }}
                        />
                        <Text style={{ fontSize: moderateScale(16), fontFamily: lang.titleFont, marginHorizontal: moderateScale(10), color: defaultTheme.darkText }}>هدف تناسب اندام</Text>
                    </View>
                    <View>

                        {
                            bodyTargetData.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        setBodyTarget(item.id)
                                    }}
                                        style={[styles.subFirstComponent, { paddingBottom: moderateScale(10), borderBottomWidth: item.id !== 2 ? 1 : 0, paddingVertical: moderateScale(5) }]}>
                                        <View style={{ borderWidth: 1, padding: moderateScale(2.5), borderRadius: 50, borderColor: defaultTheme.lightGray }}>
                                            <View style={[styles.checkBox, { backgroundColor: bodyTarget == item.id ? defaultTheme.primaryColor : defaultTheme.white }]} />
                                        </View>
                                        <View>
                                            <Text style={[styles.checkBoxText, { fontFamily: lang.font, color: defaultTheme.darkText, textAlign: "left" }]}>{item.name}</Text>
                                            <Text style={[styles.checkBoxText, { fontFamily: lang.font, fontSize: moderateScale(14), textAlign: "left", lineHeight: moderateScale(23) }]}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }

                    </View>
                </View>

                <View style={[styles.firstCard, { marginBottom: moderateScale(70) }]}>

                    <View style={{ flexDirection: "row", padding: moderateScale(10), alignItems: "center" }}>
                        <Image
                            source={require('../../../res/img/scale.png')}
                            style={{ width: moderateScale(27), height: moderateScale(27), tintColor: defaultTheme.primaryColor }}
                        />
                        <Text style={[styles.secondComponentText, { fontFamily: lang.titleFont, }]}>{lang.targeDietWeight}</Text>
                    </View>

                    <TouchableOpacity onPress={openweightModal} style={styles.secontCardComp}>
                        <Text style={[styles.secondComponentsubText, { fontFamily: lang.font }]}>{lang.currentWeight}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <View style={{ borderWidth: 1, borderColor: defaultTheme.border, flexDirection: "row-reverse", padding: moderateScale(4), borderRadius: 10 }}>
                                <Text style={[styles.measureText, { fontFamily: lang.font }]}>{lang.kgMeasureName}</Text>
                                <Text style={[styles.measureText, { fontFamily: lang.font }]}>{selectedKG}.{selectedGR}</Text>
                            </View>

                            <TouchableOpacity onPress={openweightModal} style={{ width: moderateScale(30), height: moderateScale(30), alignItems: "center", justifyContent: "center", backgroundColor: defaultTheme.primaryColor, borderRadius: 20, margin: 10 }}>
                                <Image
                                    source={require("../../../res/img/add.png")}
                                    style={{ width: moderateScale(20), height: moderateScale(20), tintColor: "white", borderRadius: 10 }}
                                />
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openTargetWeightModal} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: moderateScale(15) }}>
                        <Text style={[styles.secondComponentsubText, { fontFamily: lang.font }]}>{lang.golWeight}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ borderWidth: 1, borderColor: defaultTheme.border, flexDirection: "row-reverse", padding: moderateScale(4), borderRadius: 10 }}>
                                <Text style={[styles.measureText, { fontFamily: lang.font }]}>{lang.kgMeasureName}</Text>
                                <Text style={[styles.measureText, { fontFamily: lang.font }]}>{selectedTergetKG}.{selectedTergetGR}</Text>
                            </View>
                            <TouchableOpacity onPress={openTargetWeightModal}
                                style={{ width: moderateScale(30), height: moderateScale(30), alignItems: "center", justifyContent: "center", backgroundColor: defaultTheme.primaryColor, borderRadius: 20, margin: 10 }}>
                                <Image
                                    source={require("../../../res/img/add.png")}
                                    style={{ width: moderateScale(20), height: moderateScale(20), tintColor: "white", borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", padding: moderateScale(5) }}>
                        <Info
                            width={moderateScale(20)}
                        />
                        <Text style={{ textAlign:"left",lineHeight: moderateScale(23), fontFamily: lang.font, width: dimensions.WINDOW_WIDTH * 0.77, marginHorizontal: moderateScale(5) }}>اگر میخواین وزن فعلی و وزن هدف رو تغییر بدین روی آیکون بعلاوه
                            کنار هر کدوم بزنین و وزن رو ثبت کنین در غیر اینصورت ادامه رو بزنین</Text>
                    </View>

                </View>
            </ScrollView>
            <View style={{ position: "absolute", bottom: moderateScale(20), alignSelf: "center" }}>

                <ConfirmButton
                    lang={lang}
                    style={styles.set}
                    title={lang.continuation}
                    leftImage={require('../../../res/img/done.png')}
                    onPress={() => props.navigation.navigate("chooseActivityDietScreen", { targetWeight: `${selectedTergetKG}.${selectedTergetGR}`, weight: `${selectedKG}.${selectedGR}`,dietId:props.route.params.dietId,  dietName:props.route.params.dietName })}
                />
            </View>
            <Modal
                visible={autoFuces}
                contentContainerStyle={{ position: 'absolute', bottom: 0, zIndex: 50 }}
                onDismiss={() => {
                    setAutoFuces(false)

                }}
            >
                <Animated.View style={[{ transform: [{ translateY: translateYF }], zIndex: 50 }, styles.AnimatedModal]}>
                    <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(17), color: defaultTheme.darkText, paddingBottom: moderateScale(15), paddingTop: moderateScale(15) }}>بروزرسانی وزن فعلی</Text>
                    <View style={{ flexDirection: "row-reverse", alignItems: "center", paddingBottom: moderateScale(40) }}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, top: -2, paddingHorizontal: moderateScale(5) }}>برای تنظیم وزن اعداد رو به پایین یا بالا بکشید</Text>

                        <Info
                            width={moderateScale(17)}
                        />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15) }}>{lang.gr}</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedGR}
                                pickerData={weightgr}
                                onValueChange={value => {
                                    setSelectedGR(value)
                                }}
                                itemSpace={30} // this only support in android
                                itemStyle={{}}

                            />
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), }}>{lang.kgMeasureName}</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedKG}
                                pickerData={weightkg}
                                onValueChange={value => { setSelectedKG(value) }}
                                itemSpace={30} // this only support in android

                            />
                        </View>
                    </View>
                    <ConfirmButton
                        lang={lang}
                        style={styles.set}
                        title={lang.set}
                        leftImage={require('../../../res/img/done.png')}
                        onPress={() => { setAutoFuces(false) }}
                    />
                    <View style={{ height: moderateScale(65) }} />

                </Animated.View>
            </Modal>
            <Modal
                visible={autoFucesS}
                contentContainerStyle={{ position: 'absolute', bottom: 0, zIndex: 50 }}
                onDismiss={() => {
                    setAutoFucesS(false)

                }}
            >
                <Animated.View style={[{ transform: [{ translateY: translateYS }], zIndex: 50 }, styles.AnimatedModal]}>
                    <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(17), color: defaultTheme.darkText, paddingBottom: moderateScale(15), paddingTop: moderateScale(15) }}>بروزرسانی وزن هدف</Text>
                    <View style={{ flexDirection: "row-reverse", alignItems: "center", paddingBottom: moderateScale(40) }}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, top: -2, paddingHorizontal: moderateScale(5) }}>برای تنظیم وزن اعداد رو به پایین یا بالا بکشید</Text>

                        <Info
                            width={moderateScale(17)}
                        />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15) }}>{lang.gr}</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedTergetGR}
                                pickerData={weightgr}
                                onValueChange={value => { setSelectedTergetGR(value) }}
                                itemSpace={30} // this only support in android

                            />
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), }}>{lang.kgMeasureName}</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedTergetKG}
                                pickerData={weightkg}
                                onValueChange={value => { setSelectedTergetKG(value) }}
                                itemSpace={30} // this only support in android

                            />
                        </View>
                    </View>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button4}
                        title={lang.set}
                        leftImage={require('../../../res/img/done.png')}
                        onPress={() => { setAutoFucesS(false) }}
                    />
                    <View style={{ height: moderateScale(65) }} />
                </Animated.View>
            </Modal>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
        marginTop: moderateScale(-20),
        paddingBottom: moderateScale(6)
    },
    firstCard: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        paddingBottom: moderateScale(15),
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 15,
        alignSelf: "center",
        marginVertical: moderateScale(15),
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 2.27,
    },
    subFirstComponent: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: moderateScale(10),
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,

    },
    checkBox: {
        width: moderateScale(15),
        height: moderateScale(15),
        borderRadius: 50,
        backgroundColor: defaultTheme.primaryColor
    },
    checkBoxText: {
        fontSize: moderateScale(16),
        marginHorizontal: moderateScale(10)
    },
    button2: {
        width: dimensions.WINDOW_WIDTH * 0.3,
    },
    button3: {
        width: dimensions.WINDOW_WIDTH * 0.3,
        backgroundColor: "white",
    },
    button4: {
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
    },
    AnimatedModal: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: "white",
        top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        paddingBottom: moderateScale(15)
    },
    set: {
        backgroundColor: defaultTheme.green,
        alignSelf: "center",
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45)
    },
    secontCardComp: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
        paddingBottom: moderateScale(15)
    },
    measureText: {
        padding: moderateScale(5),
        fontSize: moderateScale(16),
        color: defaultTheme.darkText
    },
    secondComponentText: {
        fontSize: moderateScale(16),

        marginHorizontal: moderateScale(10),
        color: "black"
    },
    secondComponentsubText: {
        fontSize: moderateScale(17),
        paddingHorizontal: moderateScale(15),
        color: defaultTheme.darkText
    },
    picker: {
        backgroundColor: 'white',
        width: moderateScale(100),
        height: moderateScale(200),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(20)
    }

})
export default ChooseDietTargetScreen