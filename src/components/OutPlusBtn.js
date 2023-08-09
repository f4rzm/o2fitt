import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Pressable, Easing, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'
import { dimensions } from '../constants/Dimensions'
import { BlurView } from '@react-native-community/blur'
import Breakfast from "../../res/img/breakfast.svg"
import Lunch from "../../res/img/lunch.svg"
import Dinner from "../../res/img/dinner.svg"
import Snack from "../../res/img/snack.svg"
import Glass from "../../res/img/glass.svg"
import Activity from "../../res/img/workout.svg"
import Sleep from "../../res/img/sleep.svg"
import Invite from "../../res/img/invite.svg"
import Scale from "../../res/img/scale.svg"
import Body from "../../res/img/body_manage.svg"
import Note from "../../res/img/note.svg"
import Shoe from "../../res/img/shoe.svg"
import Foodmaker from "../../res/img/foodmaker.svg"
import Sahari from "../../res/img/sahari-icon.svg"
import Dinners from "../../res/img/dinner-icon.svg"
import Snacks from "../../res/img/snack-icon.svg"
import Eftar from "../../res/img/eftar-icon.svg"
import moment from "moment"
import { useSelector } from "react-redux"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';

const OutPlusBtn = ({ lang, navigation, profile, selectedDate }) => {
    const isFocused = useIsFocused();

    const [plusScaleNavigaiton, setPlusScaleNavigaiton] = useState(0)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const isFasting = parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(selectedDate).format("YYYYMMDD"))
        &&
        (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(selectedDate).format("YYYYMMDD")) : true)
    console.warn(isFasting);
    const plus = useRef(new Animated.Value(0))
    const activePlus = useRef(new Animated.Value(0))

    useEffect(() => {

        Animated.spring(activePlus.current, {
            toValue: plusScaleNavigaiton == 0 ? 2 : 0,
            useNativeDriver: true,
        }).start(event => {
            if (event.finished) {
                setPlusScaleNavigaiton(plusScaleNavigaiton == 0 ? 2 : 0)
            }
        })

    }, [isFocused])

    const plusScale = activePlus.current.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 1.5, 1]
    })
    const plusRotation = activePlus.current.interpolate({
        inputRange: [0, 1, 2],
        outputRange: ['45deg', '90deg', "0deg"]
    })
    const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
    const today = moment();
    const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;

    const [animatedValue, setAnimatedValue] = useState(0)
    const plusbtn = plus.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    })
    const opacityView = plus.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })
    const scaleItems = plus.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 1]
    })

    const onPressPlus = () => {
        if (animatedValue == 0) {
            setAnimatedValue(1)
        }

        Animated.timing(plus.current, {
            toValue: animatedValue == 0 ? 1 : 0,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
            duration: 500
        }).start((event) => {
            if (event.finished) {
                setAnimatedValue(animatedValue == 0 ? 1 : 0)
            }
        })

    }
    const goToBreakfast = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.breakfast, mealId: 0 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToSahari = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.sahari, mealId: 9 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToLunch = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.lunch, mealId: 1 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToDinnerRamadan = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.dinner, mealId: 3 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToDinner = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.dinner, mealId: 3 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToEftar = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.eftar, mealId: 6 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToSnack = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.snack, mealId: 2 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToSnackRamadan = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("FoodFindScreen", { type: "", name: lang.snack, mealId: 7 })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToActivity = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("ActivityScreen")
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToWatert = async () => {
        const date = await AsyncStorage.getItem("homeDate")
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("AddWaterScreen", { date: date })
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToWeight = () => {
        onPressPlus()

        setTimeout(() => {
            navigation.navigate("RegisterWeightScreen")
        }, Platform.OS === "ios" ? 50 : 50)

    }
    const goToInvite = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("InviteScreen")
        }, Platform.OS === "ios" ? 50 : 50)
    }
    const goToFoodMaker = () => {
        onPressPlus()
        if (hasCredit) {

            setTimeout(() => {
                navigation.navigate("CreateFoodScreen")
            }, Platform.OS === "ios" ? 50 : 50)
        }
        else {
            goToPackages()
        }
    }
    const goToSleep = () => {
        onPressPlus()
        if (hasCredit) {

            setTimeout(() => {
                navigation.navigate("AddSleepScreen")
            }, Platform.OS === "ios" ? 50 : 50)
        }
        else {
            goToPackages()
        }

    }
    const goToBody = () => {
        onPressPlus()
        if (hasCredit) {

            setTimeout(() => {
                navigation.navigate("EditBodyScreen")
            }, Platform.OS === "ios" ? 50 : 50)
        }
        else {
            goToPackages()
        }
    }
    const goToNote = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("NotesScreen")
        }, Platform.OS === "ios" ? 50 : 50)
    }

    const goToStep = async () => {
        onPressPlus()
        const date = await AsyncStorage.getItem("homeDate")

        setTimeout(() => {
            navigation.navigate("PedometerTabScreen", { date: date })
        }, Platform.OS === "ios" ? 50 : 50)
    }

    const goToPackages = () => {
        onPressPlus()
        setTimeout(() => {
            navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 50 : 50)
    }

    const firstRowY = dimensions.WINDOW_HEIGTH * 0.72
    const secondRowY = dimensions.WINDOW_HEIGTH * 0.57
    const thirdRowY = dimensions.WINDOW_HEIGTH * 0.42
    const FourthRowY = dimensions.WINDOW_HEIGTH * 0.27
    const plusItems = [
        { id: 1, name: lang.dinner, translateX: -dimensions.WINDOW_WIDTH * 0.7, translateY: firstRowY, icon: isFasting ? <Dinners width={40} height={30} /> : <Dinner width={30} height={30} />, onPressCard: isFasting ? goToDinnerRamadan : goToDinner },
        { id: 2, name: isFasting ? lang.sahari : lang.breakfast, translateX: -dimensions.WINDOW_WIDTH * 0.1, translateY: firstRowY, icon: isFasting ? <Sahari width={40} height={30} /> : <Breakfast width={40} height={30} />, onPressCard: isFasting ? goToSahari : goToBreakfast },
        { id: 3, name: isFasting ? lang.eftar : lang.lunch, translateX: -dimensions.WINDOW_WIDTH * 0.4, translateY: firstRowY, icon: isFasting ? <Eftar width={40} height={30} /> : <Lunch width={40} height={30} />, onPressCard: isFasting ? goToEftar : goToLunch },
        { id: 4, name: lang.snack, translateX: -dimensions.WINDOW_WIDTH * 0.7, translateY: secondRowY, icon: isFasting ? <Snacks width={40} height={30} /> : <Snack width={40} height={30} />, onPressCard: isFasting ? goToSnackRamadan : goToSnack },
        { id: 5, name: lang.step, translateX: -dimensions.WINDOW_WIDTH * 0.4, translateY: secondRowY, icon: <Shoe width={50} height={30} />, onPressCard: goToStep },
        { id: 6, name: lang.coockingPersonalTitle, translateX: -dimensions.WINDOW_WIDTH * 0.1, translateY: secondRowY, icon: <Foodmaker width={30} height={30} />, onPressCard: goToFoodMaker },
        { id: 7, name: lang.weight, translateX: -dimensions.WINDOW_WIDTH * 0.7, translateY: thirdRowY, icon: <Scale width={30} height={30} />, onPressCard: goToWeight },
        { id: 8, name: lang.water, translateX: -dimensions.WINDOW_WIDTH * 0.4, translateY: thirdRowY, icon: <Glass width={30} height={30} />, onPressCard: goToWatert },
        { id: 9, name: lang.timeOfSleep, translateX: -dimensions.WINDOW_WIDTH * 0.1, translateY: thirdRowY, icon: <Sleep width={40} height={30} />, onPressCard: goToSleep },
        { id: 9, name: lang.notesTitle, translateX: -dimensions.WINDOW_WIDTH * 0.7, translateY: FourthRowY, icon: <Note width={30} height={30} />, onPressCard: goToNote },
        { id: 9, name: lang.plusExercise, translateX: -dimensions.WINDOW_WIDTH * 0.4, translateY: FourthRowY, icon: <Activity width={30} height={30} />, onPressCard: goToActivity },
        { id: 9, name: lang.EditLimbBody, translateX: -dimensions.WINDOW_WIDTH * 0.1, translateY: FourthRowY, icon: <Body width={40} height={30} />, onPressCard: goToBody },
    ]

    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={onPressPlus} style={[styles.container, { transform: [{ scale: plusScale }] }]}>
                <Animated.View style={[{ transform: [{ rotate: plusbtn }, { scale: plusScale }] }]}>
                    <Image
                        source={require("../../res/img/plus.png")}
                        style={styles.img}
                    />
                </Animated.View>
            </TouchableOpacity>
            {
                animatedValue == 1 &&
                <Animated.View style={{ position: "absolute", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, position: "absolute", opacity: opacityView }}>
                    <BlurView
                        style={styles.absolute}
                        blurRadius={10}
                        blurAmount={4}
                    />
                </Animated.View>
            }
            <View style={{ position: "absolute", zIndex: 0, bottom: moderateScale(110), marginRight: moderateScale(0) }}>
                {
                    plusItems.map((item, index) => {
                        const iconsTranslationX = plus.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, item.translateX],
                            extrapolate: "clamp"
                        })
                        const iconsTranslationY = plus.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -item.translateY],
                            extrapolate: "clamp"
                        })
                        const opacity = plus.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        })
                        return (
                            <Animated.View style={[
                                // styles.animateditems,
                                {
                                    opacity,
                                    transform:
                                        [
                                            { translateX: iconsTranslationX },
                                            { translateY: iconsTranslationY },
                                            { scale: scaleItems }
                                        ],
                                }]}>
                                <Pressable onPress={item.onPressCard}
                                    style={styles.animateditems}
                                >
                                    <>
                                        {item.icon}
                                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15) }} key={index.toString()}>{item.name}</Text>
                                    </>
                                </Pressable>
                            </Animated.View>

                        )
                    })
                }
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: defaultTheme.primaryColor,
        bottom: moderateScale(60),
        marginHorizontal: moderateScale(30),
        borderRadius: moderateScale(30),
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        elevation: 10,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5
    },
    img: {
        tintColor: defaultTheme.white,
        width: moderateScale(23),
        height: moderateScale(23),
        resizeMode: "contain"
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
    animateditems: {
        width: moderateScale(90),
        height: moderateScale(90),
        backgroundColor: defaultTheme.white,
        borderRadius: moderateScale(45),
        alignItems: 'center',
        justifyContent: "space-evenly",
        position: "absolute",
    }
})
export default OutPlusBtn