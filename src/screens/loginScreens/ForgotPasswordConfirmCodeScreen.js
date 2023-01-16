import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  I18nManager
} from 'react-native';
import { ConfirmButton, VerificationInput, Information, Toolbar } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import LottieView from 'lottie-react-native';
import { latinNumbers } from "../../utils/latinNumbers"
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'

const CODE_LENGTH = 5

const ForgotPasswordConfirmCodeScreen = props => {
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const [userName] = React.useState(props.route.params.userName)
  const [pass] = React.useState("")
  const [code, setCode] = React.useState()
  const [auth, setAuth] = React.useState("")
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [resendTime, setResendTime] = React.useState(59)
  const [showResend, setShowResend] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const _verificationInput = React.createRef()
  let interval = React.useRef(null);

  
  const ref = useBlurOnFulfill({code:code, cellCount: CODE_LENGTH});

  const [noneentery, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });

  // React.useEffect(() => {
  //   if (auth.length >= CODE_LENGTH) {
  //     _verificationInput.current.blur()
  //   }
  // }, [auth])

  React.useEffect(() => {

    interval = setInterval(() => {
      if (resendTime > 0) {
        setResendTime(resendTime - 1)
      }
      else if (!showResend) {
        setShowResend(true)
      }

    }, 1000)

    return () => {
      interval && clearInterval(interval)
    }

  }, [resendTime])

  const sendAuthCode = () => {
    if(code==undefined){
      setErrorContext(lang.confirmcodealert)
      setErrorVisible(true)
    }
    else{
      
      setIsLoading(true)
      const url = urls.identityBaseUrl + urls.user + urls.forgotPasswordConfirmCode
      const params = {
        "userName": latinNumbers(userName),
        "code": latinNumbers(code)
      }
      const header = {}
      console.log("url => ", url)
      const RC = new RestController()
      RC.post(
        url,
        params,
        header,
        onSendAuthSuccess,
        onSendAuthFailure
      )
    }
  }

  const onSendAuthSuccess = async (response) => {
    setIsLoading(false)
    if (response.data.data.code) {
      props.navigation.navigate(
        "NewPasswordScreen",
        {
          userName: userName,
          token: response.data.data.code,
        }
      )
    }
    else {
      setErrorContext(lang.confirmcodealert)
      setErrorVisible(true)
    }
  }

  const onSendAuthFailure = error => {
    setIsLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const goBack = () => {
    props.navigation.goBack()
  }

  const handleKeyPress = e => {
    if (e.nativeEvent.key === "Backspace") {
      setAuth(auth.slice(0, auth.length - 1));
    }
  };

  const onChangeVerificationCode = (text) => {
    if (auth.length > CODE_LENGTH) return null;
    setAuth(
      (auth + text).slice(0, CODE_LENGTH)
    );
  }

  const sendAgain = () => {
    setResendTime(59)
    setShowResend(false)
    requestAuthCode()
  }

  const requestAuthCode = () => {
    const userName = props.route.params.userName
    const url = urls.identityBaseUrl + urls.user + urls.reSendCode + "?userName=" + userName
    const params = {}
    const header = {}
    const RC = new RestController()
    RC.post(
      url,
      params,
      header,
      res => true,
      () => false
    )
  }

  const onConfirm = () => {
    sendAuthCode()
  }

  return (

    <>
      <Toolbar
        lang={lang}
        style={{ backgroundColor: defaultTheme.lightBackground }}
        iconStyle={{ tintColor: defaultTheme.primaryColor }}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{
          flex: 1
        }}
      >
        <View style={styles.logoContainer}>
          <LottieView
            style={{ width: "70%" }}
            source={require('../../../res/animations/forgot_code.json')}
            autoPlay
            loop={true}
          />
        </View>
        <View style={styles.content}>

          <Text style={[styles.topText, { fontFamily: lang.font, marginBottom: moderateScale(5) }]} allowFontScaling={false}>
            {lang.enterConfirmCode}
          </Text>
          {/* <VerificationInput
                  ref={_verificationInput}
                  value={auth}
                  onChangeText={onChangeVerificationCode}
                  verificationCodeError={null}
                  handleKeyPress={handleKeyPress}
                  lang={lang}
              /> */}
          <CodeField
            ref={ref}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={code}
            
            onChangeText={setCode}
            cellCount={CODE_LENGTH}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text style={[styles.topText, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.oxigenSendConfirmCodeTo.replace("[]", userName) + "  " + (resendTime < 10 ? "00:0" + resendTime : "00:" + resendTime)}
          </Text>
          <ConfirmButton
            title={lang.confirmCode}
            lang={lang}
            style={styles.loginButton}
            textStyle={{ color: defaultTheme.lightText }}
            onPress={onConfirm}
            isLoading={isLoading}
            leftImage={require("../../../res/img/done.png")}
          />
          {
            showResend &&
            <View style={styles.centerWrapper}>
              <Text style={[styles.topText, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.dontGetConfirmCode}
                <Text style={[styles.topText, { fontFamily: lang.font, color: defaultTheme.primaryColor }]} onPress={sendAgain} allowFontScaling={false}>
                  {" " + lang.sendAgan}
                </Text>
              </Text>
            </View>
          }

          <TouchableOpacity style={styles.centerWrapper} activeOpacity={8} onPress={goBack}>
            <Image
              style={{ width: 15, height: 20 }}
              source={require("../../../res/img/mobile.png")}
              resizeMode="contain"
            />

            <Text style={[styles.editNimber, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.editInfo}
            </Text>
          </TouchableOpacity>
        </View>
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: moderateScale(40)
  },
  content: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: dimensions.WINDOW_WIDTH * 0.55,
    marginTop: dimensions.WINDOW_WIDTH * 0.2
  },
  topText: {
    fontSize: moderateScale(15),
    width: dimensions.WINDOW_WIDTH * 0.9,
    margin: moderateScale(15),
    marginTop: 0,
    color: defaultTheme.darkText,
    textAlign: "center",
    lineHeight: moderateScale(26)
  },
  loginButton: {
    backgroundColor: defaultTheme.green2,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(12),
    marginBottom: moderateScale(10)

  },
  centerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical:10
  },
  editNimber: {
    color: defaultTheme.darkText,
    marginHorizontal: 8,
    fontSize: moderateScale(15),
  },
  root: {flex: 1, padding: 20},

  title: {textAlign: 'center', fontSize: moderateScale(20)},

  codeFieldRoot: {
    marginVertical: moderateScale(20),
    flexDirection:I18nManager.isRTL?"row-reverse":"row"
},

  cell: {
    width:moderateScale(55),
    height:moderateScale(55),
    fontSize: moderateScale(26),
    borderWidth: 1,
    borderColor: defaultTheme.primaryColor,
    textAlign: 'center',
    borderRadius:moderateScale(13),
    marginHorizontal:moderateScale(6),
    lineHeight:moderateScale(55)
  },
  focusCell: {
    borderColor: defaultTheme.green2,
  },
});

export default ForgotPasswordConfirmCodeScreen;
