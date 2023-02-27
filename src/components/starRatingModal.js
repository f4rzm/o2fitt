import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native'
import React, { useState } from 'react'
import { dimensions } from '../constants/Dimensions';
import { BlurView } from '@react-native-community/blur';
import StarRating from 'react-native-star-rating';
import { defaultTheme } from '../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import ConfirmButton from './ConfirmButton';
import LottieView from 'lottie-react-native'
import { useDispatch } from 'react-redux'
import { setStarRatingTimer } from '../redux/actions';
import { useNavigation } from '@react-navigation/native'
import moment from 'moment';
import { isSetRating } from '../redux/actions/starRating';
import analytics from '@react-native-firebase/analytics';


function StarRatingModal(props) {
    const navigate = useNavigation()
    const lang = props.lang
    const dispatch = useDispatch()
    const [stars, setStars] = useState(0)
    const number = [1, 2, 3, 4, 5]
    const [isEmpty, setIsEmpty] = useState(false)

    return (
        <TouchableOpacity onPress={() => {
            dispatch(setStarRatingTimer(moment().add(7, "days").format("YYYY-MM-DDTHH:mm:ss")))
            props.setShowStarModal()
        }}
            style={styles.mainContainer}>
            <BlurView style={styles.absolute} />
            <TouchableOpacity activeOpacity={1} style={styles.subContainer}>

                <TouchableOpacity
                    onPress={() => {
                        dispatch(setStarRatingTimer(moment().add(10, "days").format("YYYY-MM-DDTHH:mm:ss")))
                        props.setShowStarModal()

                    }}
                    style={{ padding: moderateScale(5), marginBottom: moderateScale(20) }}>
                    <Image
                        source={require('../../res/img/cross.png')}
                        style={{ width: moderateScale(18), height: moderateScale(20), resizeMode: "contain", tintColor: defaultTheme.mainText }}

                    />
                </TouchableOpacity>

                <View style={{ alignItems: "center" }}>
                    <LottieView
                        source={Platform.OS == "ios" ? require('../../res/animations/rate4.json') : require('../../res/animations/rate3.json')}
                        autoPlay={true}
                        style={{ width: dimensions.WINDOW_WIDTH * 0.4, height: moderateScale(200), marginTop: moderateScale(-10) }}
                        loop={false}
                    />
                </View>
                <Text style={{ alignSelf: "center", color: defaultTheme.darkText, fontFamily: lang.titleFont, fontSize: moderateScale(17), marginTop: moderateScale(-30) }}>{lang.starRatingHeader}</Text>
                <Text style={{ alignSelf: "center", color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(15), textAlign: "center", paddingVertical: moderateScale(15) }}>{lang.starRatingShortDes}</Text>

                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={stars}
                    selectedStar={(rating) => {
                        setStars(rating)
                        setIsEmpty(false)
                    }}
                    containerStyle={{ flexDirection: "row-reverse" }}
                    fullStarColor={defaultTheme.primaryColor}
                    emptyStarColor={defaultTheme.primaryColor}
                />

                <View style={styles.numberContainer}>
                    {
                        number.map((item) => {
                            return (
                                <View>
                                    <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(17) }}>{item}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    isEmpty &&
                    <Text style={{ alignSelf: "center", color: defaultTheme.error, fontSize: moderateScale(14), fontFamily: lang.font }}>{lang.emptyStars}</Text>
                }
                <Text
                    style={{
                        alignSelf: "center", color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(14), textAlign: "center", paddingVertical: moderateScale(20), lineHeight: moderateScale(23)
                    }}
                >
                    {lang.starRatingLongDes}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: moderateScale(20) }}>
                    <ConfirmButton
                        lang={lang}
                        title={lang.sendFeedBack}
                        style={styles.btn}
                        leftImage={require("../../res/img/done.png")}
                        imageStyle={{ tintColor: defaultTheme.white }}
                        onPress={() => {
                            if (stars >= 4) {
                                Linking.openURL(Platform.OS == "ios" ? "https://apps.apple.com/us/app/o2fit-diet-calorie-counter/id1556681170" : "https://cafebazaar.ir/app/com.o2fitt").then(() => {
                                    analytics().logEvent("Star_Rating_Set", { userId: props.user.id, star: stars })
                                    dispatch(isSetRating(true))
                                }).catch(() => {
                                    props.setShowStarModal()
                                })
                            } else if (stars < 4 && stars > 0) {
                                navigate.navigate("SupportScreen", { title: lang.sendFeedBack })
                                dispatch(setStarRatingTimer(moment().add(1, "months").format("YYYY-MM-DDTHH:mm:ss")))
                                analytics().logEvent("Star_Rating_Set", { userId: props.user.id, star: stars })
                                dispatch(isSetRating(true))
                            } else if (stars == 0) {
                                setIsEmpty(true)
                                analytics().logEvent("Star_Later", { userId: props.user.id })
                            }
                        }}
                    />
                    <ConfirmButton
                        lang={lang}
                        title={lang.notNow}
                        style={styles.btn2}
                        textStyle={{ color: defaultTheme.darkText }}
                        leftImage={require("../../res/img/cross.png")}
                        imageStyle={{ tintColor: defaultTheme.darkGray, width: moderateScale(15) }}
                        onPress={() => {
                            dispatch(setStarRatingTimer(moment().add(10, "days").format("YYYY-MM-DDTHH:mm:ss")))
                            props.setShowStarModal()

                        }}
                    />
                </View>
            </TouchableOpacity>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: "absolute",
        width: dimensions.WINDOW_WIDTH,
        height: dimensions.WINDOW_HEIGTH,
        alignItems: "center",
    },
    subContainer: {
        width: dimensions.WINDOW_WIDTH * 0.85,
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: moderateScale(13),
        padding: moderateScale(10),
        marginTop: dimensions.WINDOW_HEIGTH / 20
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    btn: {
        alignSelf: "center",
        backgroundColor: defaultTheme.green,
        width: dimensions.WINDOW_WIDTH * 0.35
    },
    btn2: {
        alignSelf: "center",
        borderWidth: 1,
        width: dimensions.WINDOW_WIDTH * 0.35,
        borderColor: defaultTheme.primaryColor,
        backgroundColor: defaultTheme.transparent
    },
    numberContainer: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        paddingHorizontal: dimensions.WINDOW_WIDTH * 0.035
    }
})

export default StarRatingModal;