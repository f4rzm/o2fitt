import { View, Text, Image, ImageBackground, ActivityIndicator, Platform, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { urls } from '../../utils/urls';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { allMeasureUnits } from '../../utils/measureUnits';
import { nutritions } from '../../utils/nutritions'
import FastImage from 'react-native-fast-image';
import { StyleSheet } from 'react-native';

function RecipeDetails(props) {
    const cookType = [
        {
            bakingType: 0,
            persian: "انتخاب کنید",
            english: "Choose",
            arabic: "انتخب"
        },
        {
            bakingType: 9,
            persian: "بدون نوع پخت",
            english: "No type of cooking",
            arabic: "لا يوجد نوع من الطبخ"
        },
        {
            bakingType: 1,
            persian: "شعله خیلی کم",
            english: "Very low flame",
            arabic: "لهب منخفض جدا"
        },
        {
            bakingType: 2,
            persian: "شعله کم",
            english: "Low flame",
            arabic: "لهب منخفض"
        },
        {
            bakingType: 3,
            persian: "شعله متوسط",
            english: "Medium flame",
            arabic: "لهب متوسط"
        },
        {
            bakingType: 4,
            persian: "شعله زیاد",
            english: "High flame",
            arabic: "لهب عالي"
        },
        {
            bakingType: 5,
            persian: "سرخ کردنی",
            english: "Pan frying",
            arabic: "تحمير طاسة"
        },
        {
            bakingType: 6,
            persian: "آتشی یا کبابی",
            english: "Grill",
            arabic: "شواية"
        },
        {
            bakingType: 7,
            persian: "تنوری - فر",
            english: "Electric oven",
            arabic: "فرن كهربائي"
        },
        {
            bakingType: 8,
            persian: "بخارپز",
            english: "Steamer model",
            arabic: "باخرة"
        },
    ]
    const scrollX = useRef(new Animated.Value(0)).current
    useEffect(() => {
        setTimeout(() => {
            onPressActivate(1)

        }, 100);
    }, [])


    const onPressActivate = (inx) => {
        Animated.spring(scrollX, {
            toValue: -dimensions.WINDOW_WIDTH * 0.316 * inx - moderateScale(3),
            useNativeDriver: true
        }).start()
    }



    const lang = useSelector((state) => state.lang);
    const auth = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user);
    const app = useSelector((state) => state.app);
    const profile = useSelector((state) => state.profile);
    const [serverData, setServerData] = useState([])
    const [selectedTab, setSelectedTab] = useState(2)
    const [measureunit, setMeasureunit] = useState(allMeasureUnits.find((measure) => measure.id == 36))
    const [ingredient, setIngredient] = useState(props.route.params.items.nutrientValue)
    const BType = cookType.find((item) => item.bakingType == props.route.params.items.bakingType)
    const [headerRow, setHeaderRow] = useState([
        { id: 3, source: require('../../../res/animations/calorieRecipe.json'), text: props.route.params.items.nutrientValue[23].toFixed(1) },
        { id: 0, source: require('../../../res/animations/Person.json'), text: props.route.params.items.personCount },
        { id: 1, source: require('../../../res/animations/cooking.json'), text: BType.persian },
        { id: 2, source: require('../../../res/animations/time.json'), text: props.route.params.items.bakingTime },
    ])


    let recipe = props.route.params.items

    const getServer = () => {
        const url = urls.foodBaseUrl + `Food?foodId=${recipe.id}`
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };
        axios.get(url, header).then((response) => {
            const res = response.data.data
            console.warn(res);
            setServerData(res)

            console.error(response.data.data.ingredients);
            setIngredient(response.data.data.nutrientValue)
            setHeaderRow()
        }).catch((err) => {
            console.error(err);
        })


    }
    useEffect(() => {
        // getServer()
    }, [])

    const tabs = [
        { id: 1, neme: "مواد لازم" },
        { id: 2, neme: "دستور پخت" },
        { id: 3, neme: "ارزش غذایی" },
    ]
    return (
        <>
            {
                headerRow.length == 0 ? (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"large"} color={defaultTheme.primaryColor} />
                    </View>
                ) :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                            <FastImage
                                source={props.route.params.items.imageThumb
                                    ? {
                                        uri: 'https://food.o2fitt.com/Foodthumb/' + props.route.params.items.imageThumb,
                                    }
                                    : require('../../../res/img/food.jpg')}
                                style={{ width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH * 0.30 }}
                                resizeMode={"cover"}
                            >
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    activeOpacity={0.9}
                                    onPress={() => props.navigation.goBack()}>
                                    <Image
                                        source={require("../../../res/img/back.png")}
                                        style={{ tintColor: defaultTheme.mainText, transform: [{ rotate: "180deg" }], margin: moderateScale(10), width: moderateScale(20), height: moderateScale(20) }}
                                        resizeMode="contain"

                                    />
                                </TouchableOpacity>
                            </FastImage>
                        </View>

                        <View style={styles.foodName} >
                            <Text style={[styles.foodNameText, { fontFamily: lang.font, }]}>{props.route.params.items.name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: moderateScale(20) }}>

                            {
                                headerRow.map((item) => (
                                    <View style={{ alignItems: "center" }}>
                                        <LottieView
                                            source={item.source}
                                            style={{ width: moderateScale(25), height: moderateScale(25) }}
                                            autoPlay={true}
                                            loop={false}
                                        />
                                        <Text style={{ marginTop: moderateScale(10), fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}>{item.text}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        <View
                            style={{}}
                        >
                            <View style={styles.pagerContainer}>
                                {
                                    tabs.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedTab(item.id)
                                                    onPressActivate(index)
                                                }}
                                                style={{ zIndex: 10, borderRadius: moderateScale(10), padding: moderateScale(10), paddingVertical: Platform.OS == "ios" ? moderateScale(10) : moderateScale(5), width: dimensions.WINDOW_WIDTH * 0.3 }}
                                            >
                                                <Text style={{ fontSize: moderateScale(17), color: item.id === selectedTab ? defaultTheme.white : defaultTheme.mainText, fontFamily: lang.font, alignSelf: "center" }}>{item.neme}</Text>
                                            </TouchableOpacity>
                                        )
                                    })

                                }
                                <Animated.View style={{ position: "absolute", width: dimensions.WINDOW_WIDTH * 0.3, height: "100%", backgroundColor: defaultTheme.primaryColor, transform: [{ translateX: scrollX }], borderRadius: moderateScale(10) }} />
                            </View>
                        </View>
                        {
                            selectedTab == 2 ?
                                <>
                                    <View style={{}}>
                                        {
                                            props.route.params.items.recipe[lang.langName] == null ? null :
                                                props.route.params.items.recipe[lang.langName].split("$").map((item, index) => {
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
                                    </View>
                                </> : selectedTab == 1 ?
                                    <View style={{ top: moderateScale(20), marginBottom: moderateScale(30), }}>
                                        {
                                            props.route.params.items.ingredients == undefined ? null :
                                                props.route.params.items.ingredients.map((item) => {
                                                    let measure = allMeasureUnits.find((measure) => measure.id == item.measureUnitId)
                                                    return (
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: moderateScale(20), width: dimensions.WINDOW_WIDTH * 0.87, alignSelf: "center", borderBottomWidth: 1, borderColor: defaultTheme.border, }}>
                                                            <Text style={{ fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(15), }}>{item.name.persian}</Text>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(15) }}>  {item.value}  </Text>
                                                                <Text style={{ fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(15) }}>{measure ? measure[lang.langName] : null}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                        }
                                    </View>
                                    :
                                    <View style={{ width: dimensions.WINDOW_WIDTH, alignSelf: "center" }}>
                                        <Text style={{ width: dimensions.WINDOW_WIDTH, backgroundColor: defaultTheme.grayBackground, fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(15), padding: moderateScale(5), paddingHorizontal: moderateScale(10), marginVertical: moderateScale(20), borderTopWidth: 1, borderBottomWidth: 1, borderColor: defaultTheme.border, textAlign: "left" }}>{lang.nutritionalValue100}</Text>
                                        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center" }}>

                                            {
                                                nutritions.map((item, index) => {
                                                    const Unit = ((parseFloat(ingredient[parseInt(item.id) - 1]) * parseFloat(measureunit.value) * 100) / 100)

                                                    return (
                                                        <View style={{ borderBottomWidth: 1, borderColor: defaultTheme.border, flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 }}>
                                                            <Text
                                                                style={{ paddingHorizontal: moderateScale(15), fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}
                                                            >
                                                                {item[lang.langName]}
                                                            </Text>
                                                            <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(15) }}>{Unit.toFixed(2)}  {item.unit}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                        }




                    </ScrollView>
            }
        </>
    )
}
const styles = StyleSheet.create({
    pagerContainer: {

        width: dimensions.WINDOW_WIDTH * 0.95,
        borderRadius: 13,
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        elevation: 5,
        backgroundColor: defaultTheme.grayBackground,
        paddingVertical: moderateScale(3),
        paddingHorizontal: moderateScale(3)

    },
    foodName: {
        width: dimensions.WINDOW_WIDTH,
        backgroundColor: defaultTheme.lightBackground,
        marginTop: moderateScale(-30),
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 1,
        borderColor: defaultTheme.border,

    },
    backBtn: {
        backgroundColor: "white",
        position: "absolute",
        elevation: 10,
        margin: moderateScale(20),
        borderRadius: moderateScale(10),
        opacity: 0.8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.27,

    },
    foodNameText: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        color: defaultTheme.darkText,
        marginHorizontal: moderateScale(15),
        textAlign: "left"
    }
})
export default RecipeDetails;