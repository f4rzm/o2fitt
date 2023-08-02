import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity } from 'react-native'
import { ConfirmButton, OFitToolBar } from '../../components'
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import Info from '../../../res/img/info4.svg'
import EggPlant from '../../../res/img/eggplant.svg'
import Milk from '../../../res/img/milk.svg'
import Courgette from '../../../res/img/courgette.svg'
import Walnut from '../../../res/img/walnut.svg'
import Soy from '../../../res/img/soy.svg'
import Kiwi from '../../../res/img/kiwi.svg'
import Garlic from '../../../res/img/garlic.svg'
import { setAlergy } from '../../redux/actions/index'


function DietAlergies(props) {
    // console.warn(props.route.params);
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const profile = useSelector(state => state.profile)
    const specification = useSelector((state) => state.specification);
    const diet = useSelector((state) => state.diet);
    const [alergiesId, setAlergiesId] = useState([])
    const dispatch = useDispatch()

    const foodAlegies = [
        { id: 1, name: "سویا", icon: <Soy /> },
        { id: 2, name: "بادمجان", icon: <EggPlant /> },
        { id: 3, name: "شیر", icon: <Milk /> },
        { id: 4, name: "مغز گردو", icon: <Walnut /> },
        { id: 5, name: "کدو سبز", icon: <Courgette /> },
        { id: 6, name: "سیر", icon: <Garlic /> },
        { id: 7, name: "کیوی", icon: <Kiwi /> },
        { id: 8, name: "شیر سویا", icon: <Kiwi /> }
    ]
    const foodAlergiesPressesd = (id, name, icon) => {
        var index = alergiesId.findIndex(item => item == id)
        // console.warn(alergiesId)
        if (index == -1) {
            setAlergiesId([...alergiesId, id])
        } else {
            setAlergiesId(alergiesId.filter(item => item !== id))
        }
    }
    const onConfirm = () => {
        dispatch(setAlergy(alergiesId))
        props.navigation.navigate("DietDifficulty", {
            targetWeight: props.route.params.targetWeight,
            weight: props.route.params.weight,
            activityRate: props.route.params.activityRate,
            dietId: props.route.params.dietId,
            alergiesId: alergiesId
        })
    }

    return (
        <>
            <OFitToolBar
                BackPressed={() => props.navigation.goBack()}
            />
            <View style={styles.headerContainer}>
                <Text style={{ textAlign: "center", fontSize: moderateScale(20), fontFamily: lang.font, color: defaultTheme.darkText }}>به کدومش حساسیت دارین؟</Text>
            </View>
            <View style={{ flexWrap: 'wrap', width: dimensions.WINDOW_WIDTH, flexDirection: "row", marginTop: moderateScale(15) }}>
                {
                    foodAlegies.map((item) => (
                        <TouchableOpacity activeOpacity={1} onPress={() => foodAlergiesPressesd(item.id, item.name, item.icon)} style={{ width: dimensions.WINDOW_WIDTH * 0.5, alignItems: "center", paddingVertical: moderateScale(10) }}>
                            <View style={styles.alergiesCard}>
                                <View style={styles.checkBox}>
                                    {
                                        alergiesId.map((id) => {
                                            if (id == item.id) {
                                                return (
                                                    <Image
                                                        source={require('../../../res/img/done.png')}
                                                        style={{ width: moderateScale(17), height: moderateScale(17), tintColor: defaultTheme.primaryColor }}

                                                    />
                                                )
                                            }
                                        })
                                    }
                                </View>
                                {item.icon}
                                <Text style={{ fontFamily: lang.font, marginHorizontal: moderateScale(5), color: defaultTheme.darkText, fontSize: moderateScale(14) }}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: moderateScale(15) }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Info
                        width={moderateScale(25)}
                    />
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.green2 }}>نکته مهم</Text>
                </View>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), lineHeight: 25, textAlign: "left", color: defaultTheme.lightGray2 }}>انتخاب هر گزینه باعث محدودیت های بیشتری در برنامه غذایی میشه </Text>
            </View>
            <View style={{ alignSelf: "center", position: "absolute", bottom: moderateScale(20) }}>
                <ConfirmButton
                    lang={lang}
                    title={lang.continuation}
                    style={{
                        backgroundColor: defaultTheme.green,
                        width: dimensions.WINDOW_WIDTH * 0.45,
                        height: moderateScale(45)
                    }}
                    onPress={onConfirm}
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
        paddingBottom: moderateScale(6),
    },
    firstCard: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        paddingBottom: moderateScale(15),
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 15,
        alignSelf: "center",
        marginVertical: moderateScale(15),
        zIndex: 1
    },
    subFirstComponent: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: moderateScale(10),
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,
    },
    checkBox: {
        width: moderateScale(25),
        height: moderateScale(25),
        borderWidth: 1,
        borderColor: defaultTheme.primaryColor,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: moderateScale(5)
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

    },
    alergiesCard: {
        width: "80%",
        backgroundColor: "white",
        elevation: 3,
        borderRadius: 13,
        alignItems: "center",
        flexDirection: "row",
        padding: moderateScale(10),
        height: moderateScale(50),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.30,
        shadowRadius: 2.27,
    }

})
export default DietAlergies