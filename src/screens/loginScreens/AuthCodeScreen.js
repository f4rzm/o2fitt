
import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  I18nManager,
  ScrollView
} from 'react-native';
import { ConfirmButton, VerificationInput, Information } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import { updateUserData, setAuthData, updateProfileLocaly, updateSpecificationLocaly } from "../../redux/actions"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { latinNumbers } from "../../utils/latinNumbers"
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { setIsBuy } from '../../redux/actions/diet';
import moment from 'moment';
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import { getAndroidId, getApiLevel, getBrand, getFontScale, getIpAddress, getModel, getVersion, isEmulator, isTablet } from 'react-native-device-info';


const CODE_LENGTH = 5

const AuthCodeScreen = props => {
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const [userName] = React.useState(props.route.params.userName)
  const [pass] = React.useState(props.route.params.pass)
  const [auth, setAuth] = React.useState("")
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [resendTime, setResendTime] = React.useState(59)
  const [showResend, setShowResend] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const _verificationInput = React.createRef()
  let opacity = React.useRef(new Animated.Value(1)).current
  let ty = React.useRef(new Animated.Value(0)).current
  let interval = React.useRef(null);
  const dispatch = useDispatch()
  const [code, setCode] = React.useState()
  let SDBC = React.useRef(new SpecificationDBController()).current;



  const ref = useBlurOnFulfill({ code: code, cellCount: CODE_LENGTH });

  const [noneentery, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });

  React.useEffect(() => {
    if (auth.length >= CODE_LENGTH) {
      _verificationInput.current.blur()
      sendAuthCode()
    }
  }, [auth])

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
    if (code == undefined) {
      setErrorContext(lang.confcodealert)
      setErrorVisible(true)
    } else {
      setIsLoading(true)
      const url = urls.identityBaseUrl2 + urls.user + urls.confirmCode
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

    if (response.data.data.userSelectViewModel) {
      const url = urls.userBaseUrl + urls.userProfiles + urls.AddDeviceInfo
      const params = {
        userId: response.data.data.userSelectViewModel.id,
        os: 0,
        brand: getBrand(),
        phoneModel: getModel(),
        brightness: null,
        iPAddress: `${await getIpAddress()}`,
        fontScale: `${await getFontScale()}`,
        display: null,
        apiLevelSdk: `${await getApiLevel()}`,
        androidId: `${await getAndroidId()}`,
        isTablet: isTablet(),
        isEmulator: `${await isEmulator()}`,
        appVersion: `${getVersion()}`,
        // market:"googlePlay",
        // market:"cafe bazar",
        market:"web",
        
      }
      console.error(params);
      const header = {}
      console.log("url => ", url)
      const RC = new RestController()
      RC.post(
        url,
        params,
        header,
        () => { },
        async (err) => { 
          if (response.data.data.userSelectViewModel.id) {
          dispatch(updateUserData(response.data.data.userSelectViewModel))
          getProfile(response.data.data.userSelectViewModel.id, response.data.data.userSelectViewModel.token)
          await AsyncStorage.setItem("user", JSON.stringify(response.data.data.userSelectViewModel))
        } 
      }
      )
      if (response.data.data.userSelectViewModel.id) {
        dispatch(updateUserData(response.data.data.userSelectViewModel))
        getProfile(response.data.data.userSelectViewModel.id, response.data.data.userSelectViewModel.token)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.data.userSelectViewModel))
      }
    }
    else {
      setIsLoading(false)
      setErrorContext(lang.confcodealert)
      setErrorVisible(true)
      setAuth("")
    }
  }

  const onSendAuthFailure = error => {
    console.error(error);
    setIsLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const getProfile = (userId, token) => {
    console.log('LoginScreen => user => ', userId);
    const url =
      urls.userBaseUrl +
      urls.userProfiles +
      urls.getUserTrackSpecification +
      '?userId=' +
      userId;
    const header = {};
    const params = {};
    const RC = new RestController();
    RC.checkPrerequisites(
      'get',
      url,
      params,
      header,
      (response) => onGetProfileSuccess(response, token),
      onGetProfileFailure,
    );
  };

  const onGetProfileSuccess = async (response, token) => {
    console.error(response.data.data);
    const pkExpireDate = moment(response.data.data.userProfile.dietPkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    pkExpireDate.diff(today, "seconds") > 0 ? dispatch(setIsBuy(true)) : dispatch(setIsBuy(false))
    if (response.data.statusCode === 0 && response.data.data) {
      if (response.data.data.trackSpecifications != null) {
        dispatch(updateProfileLocaly(response.data.data.userProfile));
        await SDBC.put(
          response.data.data.trackSpecifications,
          () => getSpecificationFromDB(token),
        );
      }
    }else {
      setErrorContext(lang.serverError)
      setErrorVisible(true)
      setIsLoading(false)
    }
  };
  const getSpecificationFromDB = async (token) => {
    const data = await SDBC.getLastTwo();
    data && dispatch(updateSpecificationLocaly(data));

    Animated.timing(opacity, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true,
    }).start()
    AsyncStorage.setItem("auth", JSON.stringify(token))

    dispatch(setAuthData(token))
    console.error("finishing get Speciication");
  };
  const onGetProfileFailure = (error) => {
    setErrorContext(lang.serverError)
    setErrorVisible(true)
    setIsLoading(false)
  };


  const getToken = () => {
    const url = urls.identityBaseUrl + urls.token
    var params = new FormData();
    params.append('userName', userName);
    params.append('password', pass);
    params.append('grant_type', "password");
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    console.log("url => ", url)
    const RC = new RestController()
    RC.post(
      url,
      params,
      header,
      onGetTokenSuccessful,
      onGetTokenFailure
    )
  }

  const onGetTokenSuccessful = (response) => {

  }

  const onGetTokenFailure = () => {
    setIsLoading(false)
    setErrorContext(lang.userNameOrPassIncorrect)
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
      <Animated.View
        style={{
          flex: 1,
          opacity: opacity,
          transform: [{
            translateY: ty
          }]
        }}

      >
        <View style={styles.logoContainer}>
          <LottieView
            style={{ width: dimensions.WINDOW_WIDTH * 0.7 }}
            source={require('../../../res/animations/forgot_code.json')}
            autoPlay
            loop={false}
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
            title={lang.iConfirmCode}
            lang={lang}
            style={styles.loginButton}
            textStyle={{ color: defaultTheme.lightText }}
            onPress={onConfirm}
            leftImage={require("../../../res/img/done.png")}
            isLoading={isLoading}
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
              style={{ width: moderateScale(15), height: moderateScale(20) }}
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
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
    color: defaultTheme.gray,
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
  signupButton: {
    backgroundColor: defaultTheme.primaryColor,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginTop: moderateScale(10)

  },
  centerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  editNimber: {
    color: defaultTheme.gray,
    marginHorizontal: 8,
    fontSize: moderateScale(11)
  },
  root: {
    flex: 1,
    padding: 20
  },

  title: { textAlign: 'center', fontSize: moderateScale(20) },

  codeFieldRoot: {
    marginVertical: moderateScale(20),
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row"
  },

  cell: {
    width: moderateScale(55),
    height: moderateScale(55),
    fontSize: moderateScale(26),
    borderWidth: 1,
    borderColor: defaultTheme.primaryColor,
    textAlign: 'center',
    borderRadius: moderateScale(13),
    marginHorizontal: moderateScale(6),
    lineHeight: moderateScale(55)
  },
  focusCell: {
    borderColor: defaultTheme.green2,
  },
});

export default AuthCodeScreen;
