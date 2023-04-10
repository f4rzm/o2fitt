
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager,
  ScrollView,
  Animated,
  Easing
} from 'react-native';
import { ConfirmButton } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { setLang, updateUserData } from "../../redux/actions"
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale } from 'react-native-size-matters';
import RNRestart from 'react-native-restart';
import { fa } from "../../utils/langs/persian"
import { en } from "../../utils/langs/english"
import { ar } from "../../utils/langs/arabic"
import LottieView from 'lottie-react-native';
import NativeSplashScreen from 'react-native-splash-screen'
import analytics from "@react-native-firebase/analytics"

const ChooseLangScreen = props => {

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [selectedLang, setSelectedLang] = useState({ id: 100 })
  const opacity = useRef(new Animated.Value(0)).current

  const showButton = () => {
    Animated.timing(opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 1000,
      easing: Easing.inOut(Easing.exp)

    }).start()
  }

  React.useEffect(() => {
    NativeSplashScreen.hide()
  }, [])
  const langs = [
    { id: 1, lang: "en", name: "English", fontFamily: en.font, continue: en.continuation },
    { id: 0, lang: "fa", name: "فارسی", fontFamily: fa.font, continue: fa.continuation },
    { id: 2, lang: "ar", name: "العربیة", fontFamily: ar.font, continue: ar.continuation },
  ]
  const langSelected = async (lang, id) => {

    if (lang == "en") {
      analytics().logEvent("english")
    } else if (lang == "fa") {
      analytics().logEvent("persian")
    } else if (lang == 'ar') {
      analytics().logEvent("arabic")
    }

    await AsyncStorage.setItem("lang", lang)
    const resetForRtl = await AsyncStorage.getItem("resetForRtl")
    if (lang === "en" && I18nManager.isRTL) {
      await AsyncStorage.removeItem("resetForRtl")
      I18nManager.forceRTL(false)
      NativeSplashScreen.show()
      RNRestart.Restart()
    }
    else if ((lang != "en" && !I18nManager.isRTL) || (lang != "en" && resetForRtl === null)) {
      await AsyncStorage.setItem("resetForRtl", "1")
      I18nManager.forceRTL(true)
      NativeSplashScreen.show()
      RNRestart.Restart()
    }
    else {
      dispatch(setLang(lang))
      dispatch(updateUserData({
        language: id
      }))
      AsyncStorage.setItem("user", JSON.stringify({ ...user, language: id }))
      const onBoarding = await AsyncStorage.getItem("onBoarding")
      if (!onBoarding) {
        props.navigation.navigate("WelcomeOnboardingScreen")
      }
      else {
        props.navigation.navigate("ChooseCountryScreen")
      }
    }
  }
  return (
    <>
      <View style={styles.logoContainer}>
        <LottieView
          style={{ width: "50%" }}
          source={require('../../../res/animations/language.json')}
          autoPlay
          loop={false}
        />
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {/* <ConfirmButton
          title="English"
          lang={en}
          style={styles.button}
          textStyle={{color:defaultTheme.mainText}}
          onPress={()=>langSelected("en" , 1)}
        />
        
        <ConfirmButton
          title="فارسی"
          lang={fa}
          style={styles.button}
          textStyle={{color:defaultTheme.mainText}}
          onPress={()=>langSelected("fa" , 0)}
        />
        
        <ConfirmButton
          title="العربیة"
          lang={ar}
          style={styles.button}
          textStyle={{color:defaultTheme.mainText}}
          onPress={()=>langSelected("ar" , 2)}
        /> */}
        {
          langs.map((item) => {
            return (
              <TouchableOpacity onPress={() => {
                setSelectedLang(item)
                showButton()
              }} activeOpacity={0.8} style={[styles.button, { borderColor: item.id == selectedLang.id ? defaultTheme.primaryColor : defaultTheme.gray }]}>
                <Text style={{ fontFamily: item.fontFamily, fontSize: moderateScale(18), color: item.id == selectedLang.id ? defaultTheme.primaryColor : defaultTheme.gray }}>{item.name}</Text>
              </TouchableOpacity>
            )
          })
        }
        {
          selectedLang.id !== 100 &&
          <Animated.View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center", flex: 1, justifyContent: "center", marginBottom: moderateScale(20), opacity: opacity }}>
            <TouchableOpacity onPress={() => {
              langSelected(selectedLang.lang, selectedLang.id)
            }} style={{ width: dimensions.WINDOW_WIDTH * 0.4, backgroundColor: defaultTheme.primaryColor, borderRadius: moderateScale(50), alignItems: "center", paddingVertical: moderateScale(15), height: moderateScale(55), justifyContent: "center" }}>
              <Text style={{ color: defaultTheme.white, fontSize: moderateScale(22), fontFamily: selectedLang.fontFamily,top:moderateScale(-3) }}>{selectedLang.continue}</Text>
            </TouchableOpacity>
          </Animated.View>
        }

      </ScrollView>
      {/* <Image
        source={require("../../../res/img/logo2.png")}
        style={styles.img}
        resizeMode="contain"
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: dimensions.WINDOW_HEIGTH * 0.05
  },
  buttonContainer: {
    flex: 1.5,
    alignItems: "center",
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.9,
    height: dimensions.WINDOW_WIDTH * 0.6
  },
  button: {
    borderColor: defaultTheme.primaryColor,
    borderWidth: 1.2,
    backgroundColor: defaultTheme.lightBackground,
    margin: 10,
    height: moderateScale(55),
    width: dimensions.WINDOW_WIDTH * 0.5,
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center"
  },
  img: {
    width: moderateScale(100),
    height: moderateScale(60),
    margin: moderateScale(16),
    alignSelf: "center"
  }
});

export default ChooseLangScreen;
