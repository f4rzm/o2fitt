import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ConfirmButton,
  CustomInput,
  Information,
  Toolbar,
} from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import {
  setAuthData,
  updateUserData,
  updateProfileLocaly,
  updateSpecificationLocaly,
} from '../../redux/actions';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import { latinNumbers } from '../../utils/latinNumbers';
import LottieView from 'lottie-react-native';
import NativeSplashScreen from 'react-native-splash-screen';
import { firebase } from '@react-native-firebase/analytics';
import { TextInput } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import { setIsBuy } from '../../redux/actions/diet';
import moment from 'moment'

const LoginScreen = (props) => {
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack
    );
    return () => backHandler.remove();
  }, [])

  const goBack = () => {
    props.navigation.navigate("LoginOrSignUpScreen")
    return true
  }
  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  let userId = React.useRef(0).current;
  let opacity = React.useRef(new Animated.Value(1)).current;

  const dispatch = useDispatch();

  const [userName, setUserName] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  let SDBC = React.useRef(new SpecificationDBController()).current;

  React.useEffect(() => {
    NativeSplashScreen.hide();
  }, []);

  const userNameChanged = (text) => {
    setUserName(text);
  };

  const passChanged = (text) => {
    if (text != '' && /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(text)) {
      setPass(text);
    } else if (text === '') {
      setPass('');
    } else {
      setErrorContext(lang.dataEntryEN);
      setErrorVisible(true);
    }
  };

  const loginPressed = async () => {
    const profileUsername = await AsyncStorage.getItem("deletedAccount")
    if (profileUsername) {

      if (profileUsername.toLowerCase() !== userName.toLowerCase()) {

        if (userName != '') {
          if (pass != '') {
            if (
              /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(userName) &&
              /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(pass)
            ) {
              if (app.networkConnectivity) {
                setIsLoading(true);
                const url = urls.identityBaseUrl + urls.user + urls.login;
                const params = {
                  userName: latinNumbers(userName),
                  password: latinNumbers(pass),
                };
                const header = {};
                console.log('url => ', url);
                const RC = new RestController();
                RC.post(url, params, header, onLoginSuccess, onLoginFailure);
              } else {
                setErrorContext(lang.noInternet);
                setErrorVisible(true);
              }
            } else {
              setErrorContext(lang.dataEntryEN);
              setErrorVisible(true);
            }
          } else {
            setErrorContext(lang.fillPassword);
            setErrorVisible(true);
          }
        } else {
          setErrorContext(lang.fillUserName);
          setErrorVisible(true);
        }
      } else {
        setErrorContext(lang.doesNotExist);
        setErrorVisible(true);
      }
    }else{
      if (userName != '') {
        if (pass != '') {
          if (
            /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(userName) &&
            /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(pass)
          ) {
            if (app.networkConnectivity) {
              setIsLoading(true);
              const url = urls.identityBaseUrl + urls.user + urls.login;
              const params = {
                userName: latinNumbers(userName),
                password: latinNumbers(pass),
              };
              const header = {};
              console.log('url => ', url);
              const RC = new RestController();
              RC.post(url, params, header, onLoginSuccess, onLoginFailure);
            } else {
              setErrorContext(lang.noInternet);
              setErrorVisible(true);
            }
          } else {
            setErrorContext(lang.dataEntryEN);
            setErrorVisible(true);
          }
        } else {
          setErrorContext(lang.fillPassword);
          setErrorVisible(true);
        }
      } else {
        setErrorContext(lang.fillUserName);
        setErrorVisible(true);
      }
    }

  };

  const onLoginSuccess = (response) => {
    if (response.data.data.id) {
      firebase.analytics().logLogin({ method: 'pass' });
      AsyncStorage.setItem(
        'user',
        JSON.stringify({ ...user, ...response.data.data }),
      );
      userId = response.data.data.id;
      dispatch(updateUserData(response.data.data));
      if (
        !response.data.data.phoneNumberConfirmed &&
        !response.data.data.emailConfirmed
      ) {
        props.navigation.navigate('AuthCodeScreen', {
          userName: userName,
          pass: pass,
          code: response.data.data.value,
        });
      } else {
        getProfile();
      }
    } else if (response.data.data.description === 'Active User') {
      setIsLoading(false);
      props.navigation.navigate('AuthCodeScreen', {
        userName: userName,
        pass: pass,
        code: response.data.data.value,
      });
    } else {
      setIsLoading(false);
      setErrorContext(lang.doesNotExist);
      setErrorVisible(true);
    }
  };

  const onLoginFailure = (error) => {
    setIsLoading(false);
    if (error.response.status === 400) {
      setErrorContext(lang.userNameOrPassIncorrect);
      setErrorVisible(true);
    } else {
      setErrorContext(lang.serverError);
      setErrorVisible(true);
    }
  };

  const getProfile = () => {
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
      onGetProfileSuccess,
      onGetProfileFailure,
    );
  };

  const onGetProfileSuccess = async (response) => {
    const pkExpireDate = moment(response.data.data.userProfile.dietPkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    pkExpireDate.diff(today, "seconds") > 0 ? dispatch(setIsBuy(true)) : dispatch(setIsBuy(false))
    if (response.data.statusCode === 0 && response.data.data) {
      if (response.data.data.trackSpecifications != null) {
        dispatch(updateProfileLocaly(response.data.data.userProfile));
        await SDBC.put(
          response.data.data.trackSpecifications,
          getSpecificationFromDB,
        );
      } else {
        dispatch(updateProfileLocaly(response.data.data.userProfile));
        getSpecificationFromDB();
      }
    }
  };

  const onGetProfileFailure = (error) => {
    // setErrorContext(lang.serverError)
    // setErrorVisible(true)
  };

  const getSpecificationFromDB = async () => {
    const data = await SDBC.getLastTwo();
    data && dispatch(updateSpecificationLocaly(data));
    getToken();
  };

  const getToken = () => {
    const url = urls.identityBaseUrl + urls.token;
    var params = new FormData();
    params.append('userName', userName);
    params.append('password', pass);
    params.append('grant_type', 'password');
    const header = { headers: { 'Content-Type': 'multipart/form-data' } };
    console.log('url => ', url);
    const RC = new RestController();
    RC.post(url, params, header, onGetTokenSuccessful, onGetTokenFailure);
  };

  const onGetTokenSuccessful = (response) => {
    fadeOut();
    AsyncStorage.setItem('auth', JSON.stringify(response.data));
    dispatch(setAuthData(response.data));
  };

  const onGetTokenFailure = () => {
    setIsLoading(false);
    setErrorContext(lang.userNameOrPassIncorrect);
    setErrorVisible(true);
  };

  const signupPressed = () => {
    props.navigation.navigate('SignUpScreen');
  };

  const onForgotPressed = () => {
    props.navigation.navigate('ForgotPasswordScreen');
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true,
    }).start();
  };

  const showPass = () => {
    setSecureTextEntry(true);
  };

  const hidePass = () => {
    setSecureTextEntry(false);
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS=="ios"?'position':"none"}>
      <SafeAreaView>
        <Toolbar
          lang={lang}
          style={{ backgroundColor: defaultTheme.lightBackground }}
          iconStyle={{ tintColor: defaultTheme.primaryColor }}
          onBack={() => props.navigation.navigate('LoginOrSignUpScreen')}
        />
        {errorVisible ? (
          <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
            <View style={styles.wrapper}>
              <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <Animated.ScrollView
          style={{
            opacity: opacity,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <LottieView
              style={{ width: '75%', marginBottom: moderateScale(35) }}
              source={require('../../../res/animations/login.json')}
              autoPlay
              loop={true}
            />
          </View>
          <View style={styles.content}>
            {/* <CustomInput
              placeholder={lang.mobileOrEmail}
              value={userName}
              onChangeText={userNameChanged}
              lang={lang}
              keyboardType="email-address"
              icon="user-alt"
          /> */}
            {user.countryId == 128 ? (
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
                testID='userNameInput'
                mode="outlined"
                label={lang.phone}
                placeholder={lang.phoneExample}
                style={{
                  width: moderateScale(290),
                  height: moderateScale(47),
                  fontSize: moderateScale(18),
                  backgroundColor: defaultTheme.lightBackground,
                  fontFamily: lang.font,
                  lineHeight: moderateScale(25)
                }}
                activeOutlineColor={defaultTheme.gold}
                theme={{
                  roundness: moderateScale(30),
                  fonts: { regular: lang.font },
                }}
                placeholderTextColor={defaultTheme.lightGray}
                outlineColor={defaultTheme.lightGray}
                keyboardType="decimal-pad"
                fontFamily={lang.font}
                onChangeText={userNameChanged}
                maxLength={11}
                selectTextOnFocus={true}
                autoCorrect={false}
                selectionColor={'#dbdbdb'}
                text
              />
            ) : (
              // <CustomInput
              //   placeholder={lang.email}
              //   value={email}
              //   onChangeText={emailChanged}
              //   keyboardType="email-address"
              //   lang={lang}
              //   icon="user-alt"
              // />
              <TextInput
                testID='userNameInput'
                mode="outlined"
                label={lang.email}
                placeholder={lang.emailExample}
                style={{
                  width: moderateScale(290),
                  height: moderateScale(47),
                  fontSize: moderateScale(18),
                  backgroundColor: defaultTheme.lightBackground,
                  fontFamily: lang.font,
                  lineHeight: moderateScale(25)

                }}
                activeOutlineColor={defaultTheme.gold}
                theme={{
                  roundness: moderateScale(30),
                  fonts: { regular: lang.font },
                }}
                placeholderTextColor={defaultTheme.lightGray}
                outlineColor={defaultTheme.lightGray}
                keyboardType="email-address"
                fontFamily={lang.font}
                onChangeText={userNameChanged}
                selectTextOnFocus={true}
                autoCorrect={false}
                selectionColor={'#dbdbdb'}
              />
            )}
            <TextInput
              testID='passInput'
              mode="outlined"
              label={lang.password}
              right={
                <TextInput.Icon
                  style={{ marginTop: moderateScale(13) }}
                  color={defaultTheme.lightGray2}
                  onPress={() =>
                    secureTextEntry
                      ? setSecureTextEntry(false)
                      : setSecureTextEntry(true)
                  }
                  name="eye"
                />
              }
              style={{
                width: moderateScale(290),
                height: moderateScale(47),
                backgroundColor: defaultTheme.lightBackground,
                marginVertical: 15,
                fontFamily: lang.font,
                fontSize: moderateScale(18),
                lineHeight: moderateScale(25)

              }}
              activeOutlineColor={defaultTheme.gold}
              theme={{ roundness: moderateScale(30), fonts: { regular: lang.font } }}
              onChangeText={passChanged}
              outlineColor={defaultTheme.lightGray}
              secureTextEntry={secureTextEntry}
              fontFamily={lang.font}
              selectTextOnFocus={true}
              autoCorrect={false}
              selectionColor={'#dbdbdb'}
              value={pass}
            />

            {/* <CustomInput
              placeholder={lang.password}
              value={pass}
              secureTextEntry={secureTextEntry}
              onChangeText={passChanged}
              lang={lang}
              icon="lock"
              isPass
              showPass={showPass}
              hidePass={hidePass}
          /> */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onForgotPressed}>
              <Image
                source={require('../../../res/img/forgot_lock.png')}
                style={{
                  width: moderateScale(20),
                  height: moderateScale(22),
                  marginRight: moderateScale(10),
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: lang.font,
                  color: defaultTheme.gray,
                  fontSize: moderateScale(15),
                  marginVertical: 16,
                }}
                allowFontScaling={false}>
                {lang.forgetPassword}
              </Text>
            </TouchableOpacity>

            <ConfirmButton
              title={lang.loginToFiit}
              lang={lang}
              style={styles.loginButton}
              textStyle={{
                color: defaultTheme.lightText,
                fontSize: moderateScale(17),
              }}
              onPress={loginPressed}
              isLoading={isLoading}
              leftImage={require('../../../res/img/enter.png')}
            />

            <Information
              visible={errorVisible}
              context={errorContext}
              // onRequestClose={() => setErrorVisible(false)}
              lang={lang}
              button2={lang.ok}
              button1={lang.goToSignUp}
              button1Pressed={() => props.navigation.navigate("SignUpScreen")}
              button2Pressed={() => {
                setErrorVisible(false)
              }}
              showMainButton={false}

              button1Style={{ backgroundColor: defaultTheme.green, width: moderateScale(100) }}
              button2Style={{ backgroundColor: defaultTheme.gold, width: moderateScale(100) }}
            />
            {/* {errorVisible && (
            <TouchableWithoutFeedback
              onPress={() => setErrorVisible(false)}>
              <View style={styles.wrapper}>
                <BlurView
                  style={styles.absolute}
                  blurType="light"
                  blurAmount={6}
                />
              </View>
            </TouchableWithoutFeedback>
          )} */}
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dimensions.WINDOW_HEIGTH * 0.05,
  },
  content: {
    flex: 2,
    alignItems: 'center',
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.65,
    height: dimensions.WINDOW_WIDTH * 0.5,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: defaultTheme.green2,
    width: dimensions.WINDOW_WIDTH * 0.75,
    height: moderateScale(46),
    borderRadius: moderateScale(25),
    margin: moderateScale(10),
  },
  signupButton: {
    backgroundColor: defaultTheme.primaryColor,
    width: dimensions.WINDOW_WIDTH * 0.75,
    height: moderateScale(46),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginTop: moderateScale(10),
  },
  seprator: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH * 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 6,
  },
  line: {
    width: dimensions.WINDOW_WIDTH * 0.15,
    height: 1,
    backgroundColor: defaultTheme.gray,
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

export default LoginScreen;
