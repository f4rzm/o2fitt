import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { dimensions } from '../constants/Dimensions'
import { BlurView } from '@react-native-community/blur'
import LottieView from 'lottie-react-native'
import { ConfirmButton } from '.'
import { defaultTheme } from '../constants/theme'
import { moderateScale, scale } from 'react-native-size-matters'
import { urls } from '../utils/urls'
import { RestController } from '../classess/RestController'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { user } from '../redux/reducers/user/user'

export default function VIP(props) {
    const navigation = useNavigation()
    const data = [
        { id: 1, des: props.lang.vipdes1 },
        { id: 1, des: props.lang.vipdes2 },
        { id: 1, des: props.lang.vipdes3 },
        { id: 1, des: props.lang.vipdes4 },
        { id: 1, des: props.lang.vipdes5 },
    ]
    const [severData, setSeverData] = useState([])
    useEffect(() => {
        getPackages()
    }, [])
    const getPackages = () => {
        const url = urls.orderBaseUrl2 + urls.package
        const header = { headers: { Authorization: "Bearer " + props.auth.access_token, Language: props.lang.capitalName, "Content-Type": "multipart/form-data" } }
        var params = {}

        const RC = new RestController()
        RC.checkPrerequisites("get", url, params, header, getSuccess, getFailure, props.auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }
    const getSuccess = (res) => {

        if (props.user.countryId == 128) {
            setSeverData(res.data.data.find((item) => {
                if (item.currency == 1 && item.isPromote == true && item.packageType == 1) {
                    return item
                }
            }))
        } else {
            setSeverData(res.data.data.find((item) => item.id == 32))

        }
    }
    const getFailure = (err) => {
    }
    const onRefreshTokenSuccess = () => {

    }
    const onRefreshTokenFailure = () => {

    }
    return (
        <View style={{position:"absolute",alignItems:"center",justifyContent:"center",width:dimensions.WINDOW_WIDTH,height:dimensions.WINDOW_HEIGTH}}>
         <BlurView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }} blurType="dark" blurAmount={1}
            />
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => props.crossPressed()}
                    style={styles.imageContainer}>
                    <Image
                        source={require('../../res/img/cross.png')}
                        style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain", tintColor: defaultTheme.mainText }}
                    />
                </TouchableOpacity>

                <LottieView
                    source={require('../../res/animations/vip.json')}
                    style={{ width: moderateScale(150), height: moderateScale(150) }}
                    autoPlay={true}
                    loop={false}
                />
                <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(14), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.80, alignItems: 'center', lineHeight: moderateScale(23), textAlign: "left" }}>{props.lang.vipTitle}</Text>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.85, alignItems: "baseline", paddingVertical: moderateScale(5) }}>
                    {
                        data.map((item) => {
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: moderateScale(5) }}>
                                    <Image
                                        source={require('../../res/img/done.png')}
                                        style={{ resizeMode: "contain", tintColor: defaultTheme.primaryColor, width: moderateScale(15), height: moderateScale(15), marginHorizontal: moderateScale(5) }}
                                    />
                                    <Text style={{ color: defaultTheme.darkText, fontFamily: props.lang.font, fontSize: moderateScale(13), width: dimensions.WINDOW_WIDTH * 0.8, textAlign: "left" }}>{item.des}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                <Text style={{ fontFamily: props.lang.font, color: defaultTheme.darkText, fontSize: moderateScale(14), width: dimensions.WINDOW_WIDTH * 0.80, lineHeight: moderateScale(23), textAlign: "left" }}>{props.lang.vipfooter.split("مخصوص")[0]}{severData.name}{props.lang.vipfooter.split("مخصوص")[1]}</Text>
                {
                    severData.length <= 0 ?
                        <ActivityIndicator color={defaultTheme.primaryColor} style={{ marginVertical: moderateScale(15) }} /> :
                        <>
                            <ConfirmButton
                                lang={props.lang}
                                title={props.lang.iBuy}
                                style={{ backgroundColor: defaultTheme.green, marginVertical: moderateScale(5), width: moderateScale(130), height: moderateScale(35) }}
                                textStyle={{ fontSize: moderateScale(17) }}
                                onPress={() => {
                                    props.crossPressed()
                                    navigation.navigate("PaymentScreen", { package: severData })
                                }}
                            />


                            <Text style={{ textDecorationLine: "none", color: defaultTheme.darkText, fontFamily: props.lang.font, fontSize: moderateScale(15), textAlign: "left", marginVertical: Platform.OS == "ios" ? moderateScale(10) : 0 }}>
                                <Text style={{ textDecorationLine: "line-through", color: defaultTheme.mainText }}>{severData.price} {severData.currency == 1 ? "تومان" : " € "}</Text> - {severData.price - (severData.price * severData.discountPercent / 100)} {severData.currency == 1 ? "تومان" : " € "}
                            </Text>
                            <Text style={{ color: defaultTheme.green, fontSize: scale(17), fontFamily: props.lang.font }}>{severData.description}</Text>
                        </>
                }
                <View style={{ height: moderateScale(15) }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultTheme.white,
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: moderateScale(10),
        alignItems: "center",
        justifyContent: "center",
        padding: moderateScale(5),
        borderWidth: 1,
        borderColor: defaultTheme.green
    },
    imageContainer: {
        alignSelf: "baseline",
        top: moderateScale(15),
        left: moderateScale(20),
        borderWidth: 1,
        padding: moderateScale(7),
        borderRadius: moderateScale(20),
        borderColor: defaultTheme.mainText
    }
})
