import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, Platform } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment, MainToolbar, OFitToolBar } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import LinearGradient from 'react-native-linear-gradient'
import BreakFast from '../../../res/img/breakfast.svg'
import ChangePackage from '../../../res/img/changePackage.svg'
import { Modal } from 'react-native-paper'
import Info from '../../../res/img/info3.svg'
import Analyz from '../../../res/img/analyzSv.svg'
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController'
import { Picker } from 'react-native-wheel-pick'
import { updateTarget } from '../../redux/actions'


function ChooseDietActivityScreen(props) {
    const lastPageData = props.route.params
    const dispatch = useDispatch()

    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const [goal, setGoal] = useState(profile)

    const specification = useSelector((state) => state.specification);
    const [TargetActivityARaet, setTargetActivityARaet] = useState(profile.dailyActivityRate)

    const activityData = [
        { id: 10, title: lang.bedRest },
        { id: 20, title: lang.veryLittleActivity },
        { id: 30, title: lang.littleActivity },
        { id: 40, title: lang.normalLife },
        { id: 50, title: lang.relativelyActivity },
        { id: 60, title: lang.veryActivity },
    ]

    const renderItem = (item) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => setTargetActivityARaet(item.item.id)} style={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: "white", elevation: 5, margin: moderateScale(10), alignSelf: "center", borderRadius: 10, }}>
                <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }}>
                    <View style={{ borderWidth: 1, padding: moderateScale(4), borderRadius: 50, borderColor: defaultTheme.lightGray }}>
                        <View style={[styles.checkBox, { backgroundColor: TargetActivityARaet == item.item.id ? defaultTheme.primaryColor : defaultTheme.white }]} />
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), paddingHorizontal: moderateScale(5), paddingVertical: Platform.OS == "ios" ? moderateScale(10) : moderateScale(5), color: defaultTheme.darkText, textAlign: "left" }}>{item.item.title.split("*")[0]}</Text>
                </View>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(14), paddingHorizontal: moderateScale(5), paddingBottom: moderateScale(6), color: defaultTheme.mainText, textAlign: "left" }}>{item.item.title.split("*")[1]}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <OFitToolBar
                BackPressed={() => props.navigation.goBack()}
            />
            <View style={styles.headerContainer}>
                <Text style={{ textAlign: "center", fontSize: moderateScale(20), fontFamily: lang.font, color: defaultTheme.darkText }}>میزان فعالیت هفتگی رو مشخص کنین</Text>
            </View>
            <ScrollView>
                <FlatList
                    scrollEnabled={false}
                    data={activityData}
                    contentContainerStyle={{
                        flex: 1, marginTop: moderateScale(13), shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.30,
                        shadowRadius: 2.27,
                        paddingBottom: moderateScale(60)
                    }}
                    renderItem={renderItem}
                />
            </ScrollView>
            <View style={{ alignSelf: "center", position: "absolute", bottom: moderateScale(20) }}>
                <ConfirmButton
                    lang={lang}
                    title={lang.continuation}
                    style={{ backgroundColor: defaultTheme.green, width: dimensions.WINDOW_WIDTH * 0.45, height: moderateScale(45) }}
                    onPress={() => {
                        props.navigation.navigate("DietAlergies", {
                            targetWeight: props.route.params.targetWeight,
                            weight: props.route.params.weight,
                            activityRate: TargetActivityARaet,
                            dietId: props.route.params.dietId,
                            dietName:props.route.params.dietName
                        })
                    }
                    }

                />
            </View>


        </>
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

    }

})
export default ChooseDietActivityScreen