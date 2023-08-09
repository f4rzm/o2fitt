import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConfirmButton, Information, RowCenter, RowWrapper, Toolbar } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import AnimatedLottieView from 'lottie-react-native'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { dimensions } from '../../constants/Dimensions'
import RefSvg from '../../../res/img/ref-svg.svg'
import { RestController } from '../../classess/RestController'
import { urls } from '../../utils/urls'
import { BlurView } from '@react-native-community/blur'
import { updateUserData } from '../../redux/actions'
import Toast from "react-native-toast-message"

const SetRefferalCode = (props) => {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const [refferal, setRefferal] = useState(user.referreralInviter)
    const [errorVisible, setErrorVisible] = useState(false)
    const [errorContext, setErrorContext] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const saveRefferalToServer = () => {
        setIsLoading(true)
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };
        const url = urls.identityBaseUrl2 + urls.user + urls.AssignReferralCode
        const RC = new RestController()
        const params = {
            userId: user.id,
            code: refferal
        }
        RC.checkPrerequisites(
            'post',
            url,
            params,
            header,
            onSuccess,
            onFailure,
            auth,
            onRefreshTokenSuccess,
            onRefreshTokenFailure,
        );
    }

    const onSuccess = (res) => {
        setIsLoading(false)
        // console.warn(res.data);
        dispatch(updateUserData({ ...user, referreralInviter: refferal }))
        Toast.show({
            type: 'success',
            // text2: response.data.message,
            props: { text2: lang.successful, style: { fontFamily: lang.font } },
            visibilityTime: 1000,
            onShow: props.navigation.goBack()
        });
    }

    const onFailure = (err) => {
        setIsLoading(false)
        console.error(err.response.data.StatusCode);
        if (err.response.data.Message) {
            setErrorContext(lang.invalidReferreral)
            setErrorVisible(true)
        } else {
            setErrorContext(lang.serverError)
            setErrorVisible(true)
        }
    }
    const onRefreshTokenSuccess = () => {
    }
    const onRefreshTokenFailure = () => {

    }
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60}
        style={{flex:1}} behavior='height'>
            <Toolbar
                lang={lang}
                title={lang.setShareFriend}
                onBack={() => props.navigation.goBack()}
            />
            <ScrollView contentContainerStyle={{ alignItems: "center", paddingTop: moderateScale(100) }}>
                {/* <AnimatedLottieView
                    style={{ width: "50%" }}
                    source={require('../../../res/animations/invite.json')}
                    autoPlay
                    loop={false}
                /> */}
                <RefSvg
                    width={"50%"}
                    height={dimensions.WINDOW_HEIGTH * 0.25}
                />
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {
                        lang.setShareFriend
                    }
                </Text>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                    {
                        lang.setShareFriendDes
                    }
                </Text>

                <TextInput
                    style={{ width: dimensions.WINDOW_WIDTH * 0.6, borderRadius: moderateScale(10), fontFamily: lang.font, fontSize: moderateScale(15), textAlign: "center", borderWidth: 1, borderColor: defaultTheme.border,height:moderateScale(40) }}
                    placeholder={user.referreralInviter ? user.referreralInviter : lang.enterReferalHere}
                    maxLength={6}
                    value={refferal}
                    onChangeText={(text) => setRefferal(text)}
                    editable={user.referreralInviter ? false : true}
                />
                {
                    !user.referreralInviter &&
                    <ConfirmButton
                        lang={lang}
                        title={lang.setShareBtn}
                        style={{ backgroundColor: defaultTheme.green, marginTop: moderateScale(20) }}
                        onPress={saveRefferalToServer}
                        isLoading={isLoading}
                    />
                }
            </ScrollView>
            {errorVisible ? (
                <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView style={styles.absolute} blurType="dark" blurAmount={1} blurRadius={1} />
                        <Information
                            visible={errorVisible}
                            context={errorContext}
                            onRequestClose={() => setErrorVisible(false)}
                            lang={lang}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : null}
        </KeyboardAvoidingView>
    )
}

export default SetRefferalCode

const styles = StyleSheet.create({

    img: {
        width: dimensions.WINDOW_WIDTH * 0.5,
        height: dimensions.WINDOW_WIDTH * 0.5,
    },
    title: {
        width: dimensions.WINDOW_WIDTH * 0.8,
        margin: moderateScale(20),
        marginTop: moderateScale(35),
        fontSize: moderateScale(16),
        color: defaultTheme.darkText,
        lineHeight: moderateScale(24),
        textAlign: "center"
    },
    text: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        margin: moderateScale(20),
        marginTop: moderateScale(10),
        fontSize: moderateScale(15),
        color: defaultTheme.lightGray2,
        lineHeight: moderateScale(24),
        textAlign: "center"
    },
    text2: {
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
        marginHorizontal: moderateScale(16)
    },
    text3: {
        fontSize: moderateScale(20),
        color: defaultTheme.darkText,
        marginHorizontal: moderateScale(16)
    },
    imgContainer: {
        width: moderateScale(50),
        height: moderateScale(40),
        backgroundColor: defaultTheme.primaryColor,
        borderRadius: moderateScale(6),
        justifyContent: "center",
        alignItems: "center"
    },
    share: {
        width: moderateScale(25),
        height: moderateScale(25)
    },
    container: {
        width: moderateScale(250),
        height: moderateScale(40),
        marginHorizontal: moderateScale(3),
        // backgroundColor: defaultTheme.grayBackground,
        borderRadius: moderateScale(6),

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
        backgroundColor: "rgba(0,0,0,0.5)"
    },
})