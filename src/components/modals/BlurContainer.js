import React, { useRef, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Animated } from "react-native"
import { withModal } from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { BlurView } from "@react-native-community/blur";
import TabPlusButton from "../TabPlusButton"
import Breakfast from "../../../res/img/breakfast.svg"
import Lunch from "../../../res/img/lunch.svg"
import Dinner from "../../../res/img/dinner.svg"
import Snack from "../../../res/img/snack.svg"
import Glass from "../../../res/img/glass.svg"
import Activity from "../../../res/img/workout.svg"
import Sleep from "../../../res/img/sleep.svg"
import Invite from "../../../res/img/invite.svg"
import Scale from "../../../res/img/scale.svg"
import Body from "../../../res/img/body_manage.svg"
import Note from "../../../res/img/note.svg"
import Shoe from "../../../res/img/shoe.svg"
import Foodmaker from "../../../res/img/foodmaker.svg"
import Sahari from "../../../res/img/sahari-icon.svg"
import Dinners from "../../../res/img/dinner-icon.svg"
import Snacks from "../../../res/img/snack-icon.svg"
import Eftar from "../../../res/img/eftar-icon.svg"
import moment from "moment"
import { TwoOptionModal } from "../../components"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux"

const BlurContainer = props => {
    const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
    const [hasCredit, setHasCredit] = React.useState(false)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const [date, setDate] = useState()

    const setDate1 = async () => {
        const selectedDate = await AsyncStorage.getItem("homeDate")
        setDate(selectedDate)
        console.warn(date, 's', fastingDiet.startDate);
    }

    React.useEffect(() => {
        setDate1()
        checkCredit()
    })

    const checkCredit = async () => {
        let profile = await AsyncStorage.getItem("profile")
        profile = JSON.parse(profile)
        const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
        const today = moment()
        const hs = pkExpireDate.diff(today, "seconds") > 0 ? true : false
        hs != hasCredit && setHasCredit(hs)
    }

    const goToBreakfast = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.breakfast, mealId: 0 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToSahari = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.sahari, mealId: 9 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToLunch = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.lunch, mealId: 1 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToDinnerRamadan = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.dinner, mealId: 3 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToDinner = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.dinner, mealId: 3 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToEftar = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.eftar, mealId: 6 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToSnack = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.snack, mealId: 2 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToSnackRamadan = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("FoodFindScreen", { type: "", name: props.lang.snack, mealId: 7 })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToActivity = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("ActivityScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToWatert = async () => {
        const date = await AsyncStorage.getItem("homeDate")
        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("AddWaterScreen", { date: date })
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToWeight = () => {
        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("RegisterWeightScreen")
        }, Platform.OS === "ios" ? 500 : 50)

    }
    const goToInvite = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("InviteScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const goToFoodMaker = () => {
        if (hasCredit) {
            props.onRequestClose()
            setTimeout(() => {
                props.navigation.navigate("CreateFoodScreen")
            }, Platform.OS === "ios" ? 500 : 50)
        }
        else {
            setOptionalDialogVisible(true)
        }
    }
    const goToSleep = () => {

        if (hasCredit) {
            props.onRequestClose()
            setTimeout(() => {
                props.navigation.navigate("AddSleepScreen")
            }, Platform.OS === "ios" ? 500 : 50)
        }
        else {
            setOptionalDialogVisible(true)
        }

    }
    const goToBody = () => {
        if (hasCredit) {
            props.onRequestClose()
            setTimeout(() => {
                props.navigation.navigate("EditBodyScreen")
            }, Platform.OS === "ios" ? 500 : 50)
        }
        else {
            setOptionalDialogVisible(true)
        }
    }
    const goToNote = () => {

        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("NotesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }

    const goToStep = async () => {
        const date = await AsyncStorage.getItem("homeDate")
        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("PedometerTabScreen", { date: date })
        }, Platform.OS === "ios" ? 500 : 50)
    }

    const goToPackages = () => {
        props.onRequestClose()
        setTimeout(() => {
            props.navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }
    const plusRotation = useRef(new Animated.Value(0)).current
    const spin = plusRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"]
    })

    return (
        <View
            style={styles.mainContainer}
        >
            <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={4}
                reducedTransparencyFallbackColor="white"
            />
            <ScrollView>
                <View style={styles.container}>
                    {
                        parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(date).format("YYYYMMDD"))
                            &&
                            (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(date).format("YYYYMMDD")) : true)
                            ?
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToSahari}>
                                    <Sahari
                                        width={moderateScale(37)}
                                        height={moderateScale(37)}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.sahari
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToEftar}>
                                    <Eftar
                                        width={moderateScale(37)}
                                        height={moderateScale(37) * 0.86}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.eftar
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToDinnerRamadan}>
                                    <Dinners
                                        width={moderateScale(34)}
                                        height={moderateScale(34)}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.dinner
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View> : <View style={styles.row}>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToBreakfast}>
                                    <Breakfast
                                        width={moderateScale(37)}
                                        height={moderateScale(37) * 0.65}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.breakfast
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToLunch}>
                                    <Lunch
                                        width={moderateScale(37)}
                                        height={moderateScale(37) * 0.86}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.lunch
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToDinner}>
                                    <Dinner
                                        width={moderateScale(34)}
                                        height={moderateScale(34)}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.dinner
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                    }

                    <View style={styles.row}>
                        {
                            parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(date).format("YYYYMMDD"))
                                &&
                                (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(date).format("YYYYMMDD")) : true)
                                ?
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToSnackRamadan}>
                                    <Snacks
                                        width={moderateScale(42)}
                                        height={moderateScale(42)}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.snack
                                        }
                                    </Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToSnack}>
                                    <Snack
                                        width={moderateScale(42)}
                                        height={moderateScale(42) * 0.67}
                                        preserveAspectRatio="none"
                                    />

                                    <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.snack
                                        }
                                    </Text>
                                </TouchableOpacity>
                        }
                        <TouchableOpacity style={[styles.button, { paddingBottom: 0 }]} activeOpacity={1} onPress={goToActivity}>
                            <Activity
                                width={moderateScale(32)}
                                height={moderateScale(32) * 1.3}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font, marginTop: 0 }]} allowFontScaling={false}>
                                {
                                    props.lang.plusExercise
                                }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]} activeOpacity={1} onPress={goToFoodMaker}>
                            <Foodmaker
                                width={moderateScale(37)}
                                height={moderateScale(30)}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.coockingPersonalTitle
                                }
                            </Text>
                            {
                                !hasCredit &&
                                <Image
                                    source={require("../../../res/img/lock.png")}
                                    style={styles.lock}
                                    resizeMode="contain"
                                />
                            }
                        </TouchableOpacity>

                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToWeight}>
                            <Scale
                                width={moderateScale(32)}
                                height={moderateScale(32)}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.weight
                                }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToStep}>
                            <Shoe
                                width={moderateScale(45)}
                                height={moderateScale(40) * 0.68}
                                preserveAspectRatio="none"
                            />
                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.step
                                }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToBody}>
                            <Body
                                width={moderateScale(32)}
                                height={moderateScale(32) * 0.83}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.EditLimbBody
                                }
                            </Text>
                            {
                                !hasCredit &&
                                <Image
                                    source={require("../../../res/img/lock.png")}
                                    style={styles.lock}
                                    resizeMode="contain"
                                />
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>

                        <TouchableOpacity style={[styles.button]} activeOpacity={1} onPress={goToNote}>
                            <Note
                                width={moderateScale(27)}
                                height={moderateScale(27) * 1.11}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.notesTitle
                                }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToWatert}>
                            <Glass
                                width={moderateScale(28)}
                                height={moderateScale(28) * 1.3}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.water
                                }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={goToSleep}>
                            <Sleep
                                width={moderateScale(35)}
                                height={moderateScale(35) * 0.68}
                                preserveAspectRatio="none"
                            />

                            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                {
                                    props.lang.timeOfSleep
                                }
                            </Text>
                            {
                                !hasCredit &&
                                <Image
                                    source={require("../../../res/img/lock.png")}
                                    style={styles.lock}
                                    resizeMode="contain"
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.button, { backgroundColor: defaultTheme.primaryColor }]} activeOpacity={1} onPress={goToInvite}>
                        <Invite
                            width={moderateScale(37)}
                            height={moderateScale(37) * 0.54}
                            preserveAspectRatio="none"
                        />

                        <Text style={[styles.text, { fontFamily: props.lang.font, color: defaultTheme.lightText }]} allowFontScaling={false}>
                            {
                                props.lang.invite
                            }
                        </Text>
                    </TouchableOpacity>


                </View>

            </ScrollView>
            <View>
                <TabPlusButton
                    style={{
                        marginBottom: moderateScale(5),
                        marginRight: 0,
                        transform: [{ rotate: "45deg" }]
                    }}
                    imageStyle={{ transform: [{ rotate: spin }] }}
                    onPress={() => {
                        Animated.spring(plusRotation, {
                            toValue: 1,
                            useNativeDriver: true,
                        }).start()

                        setTimeout(() => {
                            props.onRequestClose()
                        }, 200);
                    }}
                    lang={props.lang}

                />
            </View>

            <TwoOptionModal
                lang={props.lang}
                visible={optionalDialogVisible}
                onRequestClose={() => setOptionalDialogVisible(false)}
                context={props.lang.subscribe1}
                button1={props.lang.iBuy}
                button2={props.lang.motevajeShodam}
                button1Pressed={goToPackages}
                button2Pressed={() => setOptionalDialogVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: "column",
        width: dimensions.WINDOW_WIDTH,
        minHeight: dimensions.WINDOW_HEIGTH,
        alignItems: "center",
    },
    container: {
        flex: 1,
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        marginTop: moderateScale(20)

    },
    row: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH,
        justifyContent: "space-evenly",
        paddingVertical: moderateScale(16)
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.23,
        height: dimensions.WINDOW_WIDTH * 0.23,
        borderRadius: dimensions.WINDOW_WIDTH * 0.13,
        backgroundColor: defaultTheme.lightBackground,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: defaultTheme.gray,
        fontSize: moderateScale(14),
        textAlign: "center",
        // marginTop:moderateScale(10)
    },
    plus: {
        marginBottom: 0
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    lock: {
        position: "absolute",
        bottom: "5%",
        width: moderateScale(15),
        height: moderateScale(15),
        backgroundColor: defaultTheme.lightBackground
    }
})

export default withModal(BlurContainer)