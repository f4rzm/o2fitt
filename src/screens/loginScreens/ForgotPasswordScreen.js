import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  I18nManager
} from 'react-native';
import { ConfirmButton, CustomInput, Information, Toolbar } from '../../components';
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { urls } from "../../utils/urls"
import { RestController } from '../../classess/RestController';
import { latinNumbers } from "../../utils/latinNumbers"

const ForgotPasswordScreen = props => {

  const lang = useSelector(state => state.lang)
  const [userName, setUserName] = React.useState("")
  const [pass, setPass] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)

  const userNameChanged = text => {
    setUserName(text)
  }

  const sendPressed = () => {
    setIsLoading(true)
    if (userName == "") {
      setErrorVisible(true)
      setErrorContext(lang.noInsertUserName)
      setIsLoading(false)
    } else {

      const url = urls.identityBaseUrl + urls.user + urls.forgotPassword + `?userName=${latinNumbers(userName)}`
      const params = {}
      const header = {}
      console.log("url => ", url)
      const RC = new RestController()
      RC.post(
        url,
        params,
        header,
        onUserNameSuccess,
        onUserNameFailure
      )
    }
  }

  const onUserNameSuccess = response => {
    console.log(response)
    setIsLoading(false)
    if (response.data.data != false) {
      props.navigation.navigate("ForgotPasswordConfirmCodeScreen", { userName: userName, code: response.data.data })
    }
    else {
      setErrorContext(lang.wrongUserName)
      setErrorVisible(true)
    }

  }

  const onUserNameFailure = error => {
    setIsLoading(false)
  }

  return (
    <>
      <Toolbar
        lang={lang}
        style={{ backgroundColor: defaultTheme.lightBackground }}
        iconStyle={{ tintColor: defaultTheme.primaryColor }}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../res/img/forgot.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
        <Text style={[{
            fontFamily: lang.font,
            color: defaultTheme.darkText,
            width: "70%",
            textAlign: "center",
            fontSize: moderateScale(16),
            lineHeight: moderateScale(25)
          }]}
            allowFontScaling={false}
          >
            {lang.insertYourMobileOrEmailForForgotPass}
          </Text>
          <CustomInput
            placeholder={lang.mobileOrEmail}
            value={userName}
            onChangeText={userNameChanged}
            lang={lang}
            icon="user-alt"
            textStyle={{color:defaultTheme.darkText}}
          />
         
          <ConfirmButton
            title={lang.sendYourCode}
            lang={lang}
            style={styles.signupButton}
            textStyle={{ color: defaultTheme.lightText }}
            onPress={sendPressed}
            iconColor={defaultTheme.primaryColor}
            leftImage={require("../../../res/img/redo.png")}
            isLoading={isLoading}
          />
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
    minHeight: dimensions.WINDOW_HEIGTH * .4,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flex: 1.8,
    alignItems: "center"
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.6,
    height: dimensions.WINDOW_WIDTH * 0.45
  },
  loginButton: {
    backgroundColor: defaultTheme.green,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginBottom: moderateScale(10)

  },
  signupButton: {
    backgroundColor: defaultTheme.green2,
    width: dimensions.WINDOW_WIDTH * 0.7,
    height: moderateScale(48),
    borderRadius: moderateScale(25),
    margin: moderateScale(20),
    marginTop: moderateScale(50)

  },
  seprator: {
    flexDirection: "row",
    width: dimensions.WINDOW_WIDTH * 0.5,
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: moderateScale(10)
  },
  line: {
    width: dimensions.WINDOW_WIDTH * 0.15,
    height: 1,
    backgroundColor: defaultTheme.gray
  }
});

export default ForgotPasswordScreen;
