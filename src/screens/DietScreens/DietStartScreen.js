import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Alert } from 'react-native'
import { ConfirmButton, Toolbar, DietCaloriePayment, Information } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import LinearGradient from 'react-native-linear-gradient'
import BreakFast from '../../../res/img/breakfast.svg'
import ChangePackage from '../../../res/img/changePackage.svg'
import { Modal } from 'react-native-paper'
import Info from '../../../res/img/info5.svg'
import {  saveOldData, shutDownDiet } from '../../redux/actions/dietNew'
import { clearDiet } from '../../redux/actions/dietOld'

import analytics from '@react-native-firebase/analytics';
import axios from 'axios'
import { BlurView } from '@react-native-community/blur'
import { updateTarget } from '../../redux/actions'
import { setFastingActivation, shutDownFastingDiet, setActivaitonAndDeativation } from '../../redux/actions/fasting'
import moment from 'moment'

function DietStartScreen(props) {

    const dietCategory = props.route.params
    console.warn(dietCategory);
    const dispatch = useDispatch()
    const [showNoInternetModal, setShowNoInternetModal] = React.useState(false)
    const [errorVisible, setErrorVisible] = useState(false)
    const [errorContext, setErrorContext] = useState('')
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const diet = useSelector(state => state.diet)
    const profile = useSelector(state => state.profile)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const [autoFuces, setAutoFuces] = useState(false)
    const translateY = useRef(new Animated.Value(100)).current

    const data = [
        { id: 0, name: lang.walnut, measure: lang.twoMedium, caloire: 65 },
        { id: 1, name: lang.tea, measure: lang.oneCup, caloire: 0 },
        { id: 2, name: lang.risinBread, measure: lang.twoAndHalf, caloire: 197 },
        { id: 3, name: lang.cheese, measure: lang.twoBox, caloire: 122 },
    ]


    const RenderItem = (item) => {
        return (
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), justifyContent: 'center', borderBottomWidth: item.index == 3 ? 0 : 1, borderColor: defaultTheme.border }}>
                <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                    <View style={{}}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>{item.item.name}</Text>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(12), textAlign: "left" }}>{item.item.measure}</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(18), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{item.item.caloire}</Text>
                </View>
            </View>
        )
    }
    const renderHeader = () => {
        return (
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), backgroundColor: defaultTheme.grayBackground, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: defaultTheme.border, justifyContent: 'center' }}>
                <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <BreakFast
                            width={moderateScale(30)}
                        />
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{lang.breakfast}</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>384 کالری</Text>
                </View>
            </View>
        )
    }
    const renderFooter = () => {
        return (
            <View style={{ justifyContent: "space-around", flexDirection: "row", padding: 15 }}>
                <View style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, backgroundColor: defaultTheme.primaryColor, alignItems: "center", padding: moderateScale(10) }}>
                    <Image
                        source={require('../../../res/img/done.png')}
                        style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "center" }}
                    />
                    <Text style={{ color: "white", fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>ثبت در روزانه</Text>
                </View>
                <View style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, alignItems: "center", padding: moderateScale(10), borderColor: defaultTheme.border, borderWidth: 1 }}>
                    <ChangePackage />
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>تعویض برنامه</Text>
                </View>

            </View>
        )
    }
    const showModal = () => {
        if (diet.isBuy == false) {
            props.navigation.navigate("PackagesScreen")
            analytics().logEvent('dietStartPay')
        } else {
            dispatch(saveOldData(profile))
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true
            }).start()
            setAutoFuces(true)
            analytics().logEvent('startDiet')
        }
    }
    const closeInternetModal = () => {
        setShowNoInternetModal(false)
    }
    const NoInternetCallback = () => {
        setShowNoInternetModal(false)
    }
    const shutDownWholeDiet = async () => {
        dispatch(shutDownDiet())
        dispatch(clearDiet())
        if (dietCategory.id!==66) {
            dispatch(shutDownFastingDiet(false))
            dispatch(setActivaitonAndDeativation({ endDate: moment().subtract(1, 'day').format("YYYY-MM-DD"), isActive: false }))

            props.navigation.navigate("ChooseDietTargetScreen", { dietId: dietCategory.id })
        }
        else {
            dispatch(setActivaitonAndDeativation({ startDate: moment().format("YYYY-MM-DD"), isActive: true, endDate: null }))
            props.navigation.navigate("ChooseDietTargetScreen", { dietId: 66 })
        }
        // dispatch(shutDownFastingDiet())
        analytics().logEvent('get_new_diet')

        setAutoFuces(false)
    }

    return (
        <SafeAreaView>
            {errorVisible ? (
                <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView style={styles.absolute} blurType="dark" blurAmount={2} />
                        <Information
                            visible={errorVisible}
                            context={errorContext}
                            onRequestClose={() => setErrorVisible(false)}
                            lang={lang}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null}
            <Toolbar
                title={lang.PayDietTitle}
                lang={lang}
                onBack={() => props.navigation.popToTop()}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, height: dimensions.WINDOW_HEIGTH }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: defaultTheme.primaryColor }}>
                    <Image
                        source={dietCategory ? { uri: dietCategory.image } : require("../../../res/img/foods.jpg")}
                        style={{ borderTopRightRadius: 30, borderTopLeftRadius: 30, width: "100%", height: moderateScale(150) }}
                    />
                </View>

                <Text style={[styles.text, { fontFamily: lang.titleFont, }]}>{dietCategory ? dietCategory.name[lang.langName] : lang.whatIsDiet}</Text>
                <Text style={[styles.text2, { fontFamily: lang.font, }]}>{dietCategory ? dietCategory.description[lang.langName] : lang.whatIsDietDescribe}</Text>
                {dietCategory == null && <>
                    <Text style={[styles.text, { fontFamily: lang.titleFont, }]}>{lang.dietAdvantages}</Text>
                    <Text style={[styles.text2, { fontFamily: lang.font, }]}>{lang.dietAdvantageDescribe}</Text>
                    {/* <Text style={[styles.text, { fontFamily: lang.titleFont, }]}>{lang.exampleOfDiet}</Text> */}
                </>
                }
                {/* <View style={{ alignItems: "center" }}>
                    <FlatList
                        data={data}
                        // ListFooterComponent={renderFooter}
                        contentContainerStyle={styles.flatList}
                        ListHeaderComponent={renderHeader}
                        renderItem={RenderItem}
                    />
                </View> */}
                <View style={{ height: moderateScale(45) }} />
            </ScrollView>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.buttonGradient}>
                <View style={{ height: moderateScale(60) }}>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button}
                        title={lang.startIt}
                        leftImage={require('../../../res/img/done.png')}
                        onPress={showModal}
                    />
                </View>
            </LinearGradient>
            <Modal
                visible={autoFuces}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setAutoFuces(false)
                }}
            >
                <Animated.View style={[{ transform: [{ translateY: translateY }] }, styles.AnimatedModal]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: moderateScale(15), paddingBottom: moderateScale(5) }}>
                        <Info
                            fill={"#000"}
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                        />
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(20), color: defaultTheme.darkText }}> قبلش یادتون باشه </Text>
                    </View>
                    <Text style={{ width: dimensions.WINDOW_WIDTH * 0.7, fontSize: moderateScale(17), marginVertical: moderateScale(16), fontFamily: lang.font, lineHeight: moderateScale(22), paddingBottom: moderateScale(18), color: defaultTheme.mainText, textAlign: "left" }}>با دریافت برنامه غذایی کالری هدف روزانه شما تغییر میکنه و از این به بعد با برنامه غذایی به پیشرفت ادامه میدین</Text>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button4}
                        title={lang.okLetsGo}
                        leftImage={require('../../../res/img/done.png')}
                        onPress={() => {
                            shutDownWholeDiet()
                        }}
                    />
                </Animated.View>
            </Modal>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(18),
        marginHorizontal: moderateScale(20),
        marginVertical: moderateScale(14),
        color: defaultTheme.darkText,
        textAlign: "left"
    },
    text2: {
        width: dimensions.WINDOW_WIDTH * 0.90,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.07,
        fontSize: moderateScale(15),
        lineHeight: moderateScale(25),
        color: defaultTheme.lightGray2,
        textAlign: "left"

    },
    packages: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        alignSelf: "center",
        height: moderateScale(150),

    },
    buttonGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: moderateScale(50),
        paddingBottom: moderateScale(100),
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green2
    },
    navigationText: {
        fontSize: moderateScale(15),
        padding: moderateScale(6)
    },
    flatList: {
        alignSelf: "center",
        borderWidth: 1,
        borderColor: defaultTheme.border, borderRadius: 10,
        marginBottom: moderateScale(70),
    },
    button2: {
        width: dimensions.WINDOW_WIDTH * 0.3,
    },
    button3: {
        width: dimensions.WINDOW_WIDTH * 0.3,
        backgroundColor: "white",
    },
    button4: {
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
    },
    AnimatedModal: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: "white",
        // top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        paddingBottom: moderateScale(60)
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default DietStartScreen;