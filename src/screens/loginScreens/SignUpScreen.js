
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  TouchableWithoutFeedback,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';
import { ConfirmButton, CustomInput, CheckBox, Information, Toolbar } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
import { ScrollView } from 'react-native-gesture-handler';
import { latinNumbers } from "../../utils/latinNumbers"
import { firebase } from '@react-native-firebase/analytics';
import { TextInput } from 'react-native-paper'
import { BlurView } from '@react-native-community/blur';
import ReferralcodeModal from '../../components/ReferralcodeModal';
import AnimatedLottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message'


const SignUpScreen = props => {
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack
    );
    return () => backHandler.remove();
  }, [])

  const goBack = () => {
    props.navigation.navigate("ChooseCountryScreen")
    return true
  }

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const [mobile, setMobile] = React.useState(user.phoneNumber)
  const [email, setEmail] = React.useState(user.email)
  const [pass, setPass] = React.useState("")
  const [rulesConfirmed, setRulesConfirmed] = React.useState(true)
  const [secureTextEntry, setSecureTextEntry] = React.useState(true)
  const [referreralInviter, setReferreralInviter] = React.useState("")
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [ruleVisible, setRuleVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [haveInvitationCode, setHaveInvitationCode] = useState(false);
  const [doubledUser, setDoubledUser] = useState(false);
  const [DoubledUserText, setDoubledUserText] = useState("");
  const [showBlur, setShowBlur] = useState(false);
  const [referralcodeCheck, setReferralcodeCheck] = useState(false)

  const mobileChanged = text => {
    if (text != "" && /^[0-9]+$/i.test(text)) {
      setMobile(text)
    }
    else if (text === "") {
      setMobile("")
    } else {
      setMobile("")
      setErrorContext(lang.typeEN)
      setErrorVisible(true)
    }
  }
  const emailChanged = text => {
    if (text != "" && /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(text)) {
      setEmail(text)
    }
    else if (text === "") {
      setEmail("")
    } else {
      setErrorContext(lang.dataEntryEN)
      setErrorVisible(true)
      setEmail("")

    }
  }

  const referreralChanged = text => {
    // console.error(text);
    if (text != "" && /^[a-z0-9]+$/i.test(text)) {
      setReferreralInviter(text)
    } else if (text === "") {
      setReferreralInviter('')
    } else {
      setReferreralInviter('')
      // setErrorContext(lang.typeEN)
      // setErrorVisible(true)
      Toast.show({
        type: "error",
        props: { text2: lang.typeEN },
        visibilityTime: 1800
      })

    }

  }

  const passChanged = text => {
    if (text != "" && /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(text)) {
      setPass(text)
    }
    else if (text === "") {
      setPass("")
    } else {
      setErrorContext(lang.dataEntryEN)
      setErrorVisible(true)
    }
  }

  const showPass = () => {
    setSecureTextEntry(true)
  }

  const hidePass = () => {
    setSecureTextEntry(false)
  }

  const validateEmail = () => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      return true
    }
    return false
  }

  const validateMobile = () => {
    if (/^09\d{9}$/.test(mobile)) {
      return true
    }
    return false
  }

  const signupPressed = () => {
    Keyboard.dismiss()
    if ((email != "" || mobile != "")) {
      if (user.countryId != 128) {
        if (validateEmail()) {
          if (rulesConfirmed) {
            // if (pass.trim().length >= 4) {
            signup()
            // } else {
            //   setErrorContext(lang.passwordalert)
            //   setErrorVisible(true)
            // }
          }
          else {
            setErrorContext(lang.confirmRules)
            setErrorVisible(true)
            
          }
        }
        else {
          setErrorContext(lang.invalidMail)
          setErrorVisible(true)
        }
      }
      else {
        if (validateMobile()) {
          if (rulesConfirmed) {
            // if (pass.trim().length >= 4) {
            signup()
            // } else {
            //   setErrorContext(lang.passwordalert)
            //   setErrorVisible(true)
            // }
          }
          else {
            setErrorContext(lang.confirmRules)
            setErrorVisible(true)
          }
        }
        else {
          setErrorContext(lang.phonealert)
          setErrorVisible(true)
        }
      }
    }
    // else {
    //   user.countryId != 128 ?
    //     setErrorContext(lang.signupfillalert2) :
    //     setErrorContext(lang.signupfillalert1)
    //   setErrorVisible(true)
    // }
  }

  const signup = () => {
    setIsLoading(true)
    const url = urls.identityBaseUrl2 + urls.user + urls.isExist
    const params = {
      "userName": mobile ? latinNumbers(mobile) : latinNumbers(email).toLowerCase(),
    }
    const header = {}
    const RC = new RestController()
    RC.post(
      url,
      params,
      header,
      (res) => {
        console.error(res.data.data);
        if (res.data.data.isNew == true) {
          setReferralcodeCheck(true)
        } else {
          referralSignUp()
        }    
      },
      (err) => { console.error(err) },
    )
  }

  const onSignUpSuccess = response => {
    console.warn(response);
    setReferralcodeCheck(false)
    // console.warn(response.data.statusCode);
    if (response.data.statusCode !== 0) {
      if (response.data.statusCode === 1) {
        setIsLoading(false)
        setErrorContext(lang.serverError)
        setErrorVisible(true)
      }
      else if (response.data.statusCode === 3) {
        setIsLoading(false)
        // setErrorContext(lang.invalidReferreral)
        // setErrorVisible(true)
        Toast.show({
          type: "error",
          props: { text2: lang.invalidReferreral },
          visibilityTime: 1800
        })
      }
    }
    else {
      firebase.analytics().logSignUp({ method: email !== "" ? "email" : "mobile" })
      setIsLoading(false)
      props.navigation.navigate("AuthCodeScreen", { userName: email !== "" ? email : mobile, pass: pass })
    }
  }

  const onSignUpFailure = error => {
    console.error(error);
    setIsLoading(false)
    if (error.data && error.data.Message && error.data.Message != "") {
      setErrorContext(error.data.Message)
    }
    else {
      setErrorContext(lang.serverError)
    }
    setErrorVisible(true)
  }

  const onRulesConfirmed = error => {

    setRulesConfirmed(!rulesConfirmed)
  }

  const rulesPressed = () => {
    setRuleVisible(true)
  }
  const crossPressed = () => {
    setHaveInvitationCode(false)
  }
  const openloginScreen = () => {
    props.navigation.navigate("LoginScreen")
    setShowBlur(false)

  }
  const referralSignUp = () => {

    if (mobile.length > 10 || email.length > 10) {
      setIsLoading(true)
      const url = urls.identityBaseUrl2 + urls.user
      const params = {
        // "email": latinNumbers(email),
        "userName": mobile ? latinNumbers(mobile) : latinNumbers(email),
        // "password": latinNumbers(pass),
        "countryId": parseInt(user.countryId),
        "languageId": parseInt(lang.langId),
        "referreralInviter": referreralInviter ? latinNumbers(referreralInviter) : null,
        "startOfWeek": parseInt(user.startOfWeek),

      }
      console.warn(params);
      const header = {}
      const RC = new RestController()
      RC.post(
        url,
        params,
        header,
        onSignUpSuccess,
        onSignUpFailure,
      )

    } else {
      if(user.countryId==128){

        Toast.show({
          type: "error",
          props: { text2: lang.typePhoneNumber },
          visibilityTime: 1800
        })
      }else{
        Toast.show({
          type: "error",
          props: { text2: lang.typeEmail },
          visibilityTime: 1800
        })
      }
    }
  }
  return (
    <>
      <Toolbar
        lang={lang}
        style={{ backgroundColor: defaultTheme.lightBackground }}
        iconStyle={{ tintColor: defaultTheme.primaryColor }}
        onBack={() => props.navigation.goBack()}
      />
      <TouchableOpacity
        activeOpacity={1}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.logoContainer}>
          <AnimatedLottieView
            style={{ width: "75%", marginBottom: moderateScale(35) }}
            source={require('../../../res/animations/loginorsignup.json')}
            autoPlay
            loop={true}
          />
        </View>
        <View style={[styles.content, { justifyContent: "space-around" }]}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(18), marginBottom: 12 }}>{user.countryId !== 128 ? lang.enterEmail : lang.enterPhone}</Text>
            {
              user.countryId == 128 ?
                // <CustomInput
                //   placeholder={lang.mobile}
                //   value={mobile}
                //   onChangeText={mobileChanged}
                //   lang={lang}
                //   keyboardType="decimal-pad"
                //   icon="user-alt"
                //   maxLength={11}
                // /> 
                <TextInput
                  mode="outlined"
                  label={lang.phone}
                  placeholder={lang.phoneExample}
                  style={{ width: moderateScale(290), fontSize: moderateScale(18), backgroundColor: defaultTheme.lightBackground, fontFamily: lang.font }}
                  activeOutlineColor={defaultTheme.gold}
                  theme={{ roundness: moderateScale(30), fonts: { regular: lang.font } }}
                  placeholderTextColor={defaultTheme.lightGray}
                  outlineColor={defaultTheme.lightGray}
                  keyboardType="number-pad"
                  fontFamily={lang.font}
                  onChangeText={mobileChanged}
                  maxLength={11}
                  selectTextOnFocus={true}
                  autoCorrect={false}
                  selectionColor={"#dbdbdb"}
                  value={mobile}

                />
                :
                // <CustomInput
                //   placeholder={lang.email}
                //   value={email}
                //   onChangeText={emailChanged}
                //   keyboardType="email-address"
                //   lang={lang}
                //   icon="user-alt"
                // />
                <TextInput
                  mode="outlined"
                  label={lang.email}
                  placeholder={lang.emailExample}
                  style={{
                    lineHeight: moderateScale(25)
                    , width: moderateScale(290), fontSize: moderateScale(18), backgroundColor: defaultTheme.lightBackground, fontFamily: lang.font
                  }}
                  activeOutlineColor={defaultTheme.gold}
                  theme={{ roundness: moderateScale(30), fonts: { regular: lang.font } }}
                  placeholderTextColor={defaultTheme.lightGray}
                  outlineColor={defaultTheme.lightGray}
                  keyboardType='email-address'
                  fontFamily={lang.font}
                  onChangeText={emailChanged}
                  selectTextOnFocus={true}
                  autoCorrect={false}
                  selectionColor={"#dbdbdb"}
                  value={email}
                />
            }
          </View>


          <View style={{ alignItems: "center" }}>
            <View style={[styles.seprator]}>
              {
                lang.langName === "english" ?
                  <Text style={{ fontFamily: lang.font, color: defaultTheme.gray, maxWidth: "88%", lineHeight: 20, fontSize: moderateScale(14) }} numberOfLines={3} allowFontScaling={false}>
                    {
                      lang.confirmRules_2.split(lang.confirmRules_1)[0]
                    }
                    <Text style={{ fontFamily: lang.font, color: defaultTheme.gray, fontSize: moderateScale(14) }} numberOfLines={3} allowFontScaling={false}>
                      {lang.confirmRules_1 + " "}
                    </Text>
                    {lang.confirmRules_2.split(lang.confirmRules_1)[1]}
                  </Text> :
                  <Text onPress={rulesPressed} style={{ fontFamily: lang.font, color: defaultTheme.blue, maxWidth: "88%", lineHeight: 20, fontSize: moderateScale(14) }} numberOfLines={3} allowFontScaling={false}>
                    <Text style={{ fontFamily: lang.font, color: defaultTheme.gray, fontSize: moderateScale(14) }} numberOfLines={3} onPress={rulesPressed} allowFontScaling={false}>
                      {lang.confirmRules_1 + " "}
                    </Text>
                    {lang.confirmRules_2 + " "}
                    <Text style={{ color: defaultTheme.gray }}>
                      {lang.confirmRules_3}
                    </Text>
                  </Text>
              }
            </View>
            <ConfirmButton
              title={user.countryId == 128 ?lang.setPhoneNumber:lang.continuation}
              lang={lang}
              style={{
                backgroundColor: defaultTheme.primaryColor,
                width: dimensions.WINDOW_WIDTH * 0.7,
                height: moderateScale(48),
                borderRadius: moderateScale(25),
                margin: moderateScale(20),
                marginBottom: moderateScale(10),
                elevation: isLoading ? 0 : 4

              }}
              textStyle={{ color: defaultTheme.lightText }}
              onPress={referralSignUp}
              leftImage={require('../../../res/img/enter.png')}
              isLoading={isLoading}
            />
          </View>

          <Information
            visible={doubledUser}
            context={DoubledUserText}
            button2={lang.ok}
            button1={lang.GoToLogin}
            button1Pressed={openloginScreen}
            button2Pressed={() => {
              setDoubledUser(false)
              setShowBlur(false)
            }}
            lang={lang}
            showMainButton={false}
            button1Style={{ backgroundColor: defaultTheme.green, width: moderateScale(100) }}
            button2Style={{ backgroundColor: defaultTheme.gold, width: moderateScale(100) }}
          />
          <Information
            visible={ruleVisible}
            context={lang.terms}
            onRequestClose={() => setRuleVisible(false)}

            lang={lang}
            textStyle={{ textAlign: "left", lineHeight: moderateScale(30) }}
          />
        </View>
        {
          showBlur &&
          <View style={styles.wrapper}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={6}
              reducedTransparencyFallbackColor="white"
            />
          </View>
        }
        {/* {errorVisible &&
          <BlurView style={{ position: "absolute",  right: 0, left: 0, top: 0, bottom: 0 }} />
        } */}
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
        />


      </TouchableOpacity>

      {/* {
        referralcodeCheck &&
        <ReferralcodeModal
          lang={lang}
          onChangeText={(text) => {
            referreralChanged(text)
          }}
          onPressYes={() => referralSignUp()}
          dontHaveCodePressed={() => {
            referreralChanged(null)
            referralSignUp()
            setReferralcodeCheck(false)
          }}
          referralInviter={referreralInviter}
        />
      } */}


    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: dimensions.WINDOW_HEIGTH * 0.035
  },
  content: {
    flex: 2.2,
    alignItems: "center",
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: dimensions.WINDOW_WIDTH * 0.5
  },
  loginButton: {
    backgroundColor: defaultTheme.primaryColor,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginBottom: moderateScale(10),
    elevation: 4
  },
  signupButton: {
    backgroundColor: defaultTheme.primaryColor,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginTop: moderateScale(10)
  },
  seprator: {
    flexDirection: "row",
    width: dimensions.WINDOW_WIDTH * 0.9,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  line: {
    width: dimensions.WINDOW_WIDTH * 0.15,
    height: 1,
    backgroundColor: defaultTheme.gray
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

export default SignUpScreen;
