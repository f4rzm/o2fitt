import React, { useEffect, useRef, useState } from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileRouter from "./profileRouter"
import HomeRouter from "./homeRouter"
import DailyRouter from "./dailyRouter"
import GoalRouter from "./goalRouter"
import { Linking, Platform, View, Text, TouchableOpacity, Image, Animated, Easing, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from "react-native"
import { urls } from "../utils/urls"
import { RestController } from "../classess/RestController"
import { TabBar, MarketModal, ConfirmButton, TabPlusButton, VpnErrprModal, NoInternetModal, Information } from "../components";
import { LocalFoodsHandler } from "../classess/LocalFoodsHandler"
import AsyncStorage from "@react-native-async-storage/async-storage";
import NativeSplashScreen from 'react-native-splash-screen'
import analytics from '@react-native-firebase/analytics';
import { dimensions } from "../constants/Dimensions";
import { BlurView } from "@react-native-community/blur";
import { defaultTheme } from "../constants/theme";
import { moderateScale } from "react-native-size-matters";
import LottieView from 'lottie-react-native'
import moment from 'moment'
import VIP from '../components/VIP'
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setVipTimer, vipShown } from "../redux/actions/starRating";
import TimeZoneError from "../components/TimeZoneError";
import { RecipeCatScreen } from "../screens";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
// import Source from 'react-native-vpn-detect'

const Tab = createBottomTabNavigator();

const Tabs = (props) => {

  const netInfo = useNetInfo();
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const lang = { ...props.route.params.lang }
  const auth = { ...props.route.params.auth }
  const app = { ...props.route.params.app }
  const user = { ...props.route.params.user }
  const diet = useSelector(state => state.diet)
  const profile = useSelector(state => state.profile)
  const starRating = useSelector(state => state.starRating)
  const [showMmarketDialog, setShowMarketDialog] = React.useState(false)
  const [marketMsg, setMarketMsg] = React.useState(null)
  const [Vip, setVIP] = React.useState(false)
  const [premiumModal, setPremiumModal] = React.useState(false)
  const translateY = new Animated.Value(moderateScale(-185))
  const [billLength, setBillLength] = React.useState()
  const [hasCredit, setHasCredit] = React.useState(false)
  const [serverTime, setServerTime] = React.useState(moment().format("YYYYMMDD"))
  const [vpn, setVpn] = React.useState(false)


  useEffect(() => {
    VpnShown()

  }, [netInfo])

  const VpnShown = async () => {
    const doNotShow = await AsyncStorage.getItem("vpnShown")
    setVpn(doNotShow == undefined && netInfo.type == "vpn" ? true : false)
    // setVpn(true)
  }


  React.useEffect(() => {
    manageFoodLocalDB()
    console.warn(user);
    // AsyncStorage.removeItem("dailyDate")
  }, [])

  const manageFoodLocalDB = () => {
    const LFH = new LocalFoodsHandler(lang.langName)
    LFH.hasUnsavedData(chooseOperation)
  }

  const chooseOperation = (hasUnsavedData) => {
    if (hasUnsavedData) {
      props.navigation.navigate("DatabaseSyncScreen", { callBack: getMarketMessage })
    }
    else {
      checkOnline()
    }
  }

  const checkOnline = async () => {
    const lastVersion = await AsyncStorage.getItem("foodDatabaseVersion")
    const url = urls.foodBaseUrl + urls.food + urls.getVersion + `?lastVersion=${lastVersion ? lastVersion : app.foodDataBaseVersion}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const RC = new RestController()
    RC.checkPrerequisites("get", url, {}, header, onSuccess, onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onSuccess = res => {
    if (res.data.data && res.data.data.foods && res.data.data.foods.length > 0) {
      props.navigation.navigate("DatabaseSyncScreen", { newFoods: res.data.data.foods, version: res.data.data.version, callBack: getMarketMessage })
    } else {
      // getMarketMessage()
    }
  }


  const getMarketMessage = () => {
    const url = urls.socialBaseUrl + urls.contactUs + urls.marketMessage
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {
    }

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, onMarketMessageSuccess, () => false, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onMarketMessageSuccess = async (res) => {
    if (res.data.data) {
      let history = await AsyncStorage.getItem("marketHistory")
      history = history ? JSON.parse(history) : []
      if (history.findIndex(item => item == res.data.data.id) === -1) {
        history.push(res.data.data.id)
        await AsyncStorage.setItem("marketHistory", JSON.stringify(history))
        setTimeout(() => {
          setMarketMsg(res.data.data)
          setShowMarketDialog(true)
        }, 800);
      }
    }
  }

  const handleMarketDialogPressed = () => {
    setShowMarketDialog(false)
    Linking.canOpenURL(marketMsg.url).then(() => {
      setTimeout(() => {
        Linking.openURL(marketMsg.url).catch(() => {
          props.navigation.navigate(marketMsg.url)

        })
      }, Platform.OS === "ios" ? 500 : 50)
    })
    analytics().logEvent('marketMessagePressed')
  }

  const onFailure = () => {

  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  NativeSplashScreen.hide()

  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const todays = moment();
  const hadCredit = pkExpireDate.diff(todays, 'seconds') > 0 ? true : false;



  useEffect(() => {
    // const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
    const vipTimer = moment(starRating.vipTimer, "YYYY-MM-DDTHH:mm:ss")
    const today = moment();

    if (pkExpireDate.diff(today, 'seconds') > 0 || vipTimer.diff(today, 'seconds') > 0) {
      setHasCredit(true)
      setVIP(false)
    } else {
      setHasCredit(false)
      setVIP(true);
    }

  }, [profile])

  useEffect(() => {
    const url = `${urls.orderBaseUrl + urls.order}GetOrdersByUserId?UserId=${profile.userId}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };

    const RC = new RestController();
    RC.get(url, header, onSuccessBill, onFailureBill);
  }, []);

  const onSuccessBill = (res) => {
    setBillLength(res.data.data.length)
    if (res.data.data.length > 0 && hadCredit == false) {
      setTimeout(() => {
        setPremiumModal(true)
      }, 20000);
    }

  }
  const onFailureBill = (err) => {

  }

  useEffect(() => {
    if (premiumModal == true) {
      Animated.spring(translateY, {
        toValue: moderateScale(20),
        useNativeDriver: true
      }).start()
    } else {

    }

  }, [premiumModal, profile])

  const fadeModal = () => {
    Animated.timing(translateY, {
      duration: 1000,
      toValue: moderateScale(-180),
      useNativeDriver: true,
      easing: Easing.out(Easing.exp)
    }).start()
    setTimeout(() => {
      setPremiumModal(false)
    }, 100);
  }

  useEffect(() => {
    const url = urls.identityBaseUrl2 + urls.user + urls.getUtcTime;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const RC = new RestController();
    RC.checkPrerequisites(
      'get',
      url,
      null,
      header,
      (res) => onSuccessGetToday(res),
      (err) => onFailureGetTime(err),
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  }, [])
  const onSuccessGetToday = async (res) => {
    console.warn(parseInt(moment(res.data.data.utcDateTime).format("YYYYMMDD")) > parseInt(moment().format("YYYYMMDD")) + 3);
    console.error(moment(res.data.data.utcDateTime).format("YYYYMMDD"), moment().format("YYYYMMDD"));
    await AsyncStorage.setItem("serverTime", moment(res.data.data.utcDateTime).format("YYYY-MM-DD"))
    setServerTime(moment(res.data.data.utcDateTime).format("YYYYMMDD"))
  }
  const onFailureGetTime = async () => {
    setServerTime(await AsyncStorage.getItem("serverTime"))
  }

  const plusRotation = useRef(new Animated.Value(0)).current
  const spin = plusRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"]
  })
  const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{ top: -30, justifyContent: "center", alignItems: "center", zIndex: 90 }}
      onPress={() => {
        Animated.timing(
          plusRotation,
          {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.exp), // Easing is an additional import from react-native
            useNativeDriver: true  // To make use of native driver for performance
          }
        ).start(() => {
          Animated.timing(
            plusRotation,
            {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.exp), // Easing is an additional import from react-native
              useNativeDriver: true  // To make use of native driver for performance
            }
          ).start()
        })
      }}
    >
      <View style={{ width: 50, height: 50, borderRadius: 35, backgroundColor: defaultTheme.primaryColor, elevation: 10, alignItems: "center", justifyContent: "center" }}>
        <Animated.Image
          style={{ width: 30, height: 30, resizeMode: "contain", tintColor: "white", transform: [{ rotate: spin }] }}
          source={require("../../res/img/plus.png")}
        />
      </View>
    </TouchableOpacity>
  )
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorContext, setErrorContext] = useState(lang.noInternet)

  React.useEffect(() => {
    console.warn(user.id);
    // dispatch(clearDiet())
    console.error(diet.oldData);
    for (let i = 0; i < diet.weekSnack.length - 1; i++) {
      if (diet.weekSnack[i].id == undefined || diet.weekSnack[i].id == null) {
        console.error(diet.weekSnack[i])
      }
    }
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    axios.defaults.timeout = 2000
    axios.get("https://identity.o2fitt.com/api/v1/Users/DayOfWeeks", header)
      .then((res) => { })
      .catch((err) => {
        setErrorVisible(true)
        setErrorContext(lang.noInternet)
      })
  }, [])


  return (
    <>

      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          tabBar={props => <TabBar {...props} lang={lang} profile={profile} />}
          initialRouteName="HomeRouter"
          backBehavior="firstRoute"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="HomeRouter" component={HomeRouter} />
          <Tab.Screen name="DailyRouter" component={DailyRouter} />
          <Tab.Screen name="GoalRouter" component={GoalRouter} />
          {
            lang.langName == "persian" ?
              <Tab.Screen name="RecipeRouter" component={RecipeCatScreen} /> :
              <Tab.Screen name="ProfileRouter" component={ProfileRouter} />
          }
        </Tab.Navigator>
      </SafeAreaView>
      {/* {showMmarketDialog &&
        <MarketModal
          lang={lang}
          visible={showMmarketDialog}
          onRequestClose={() => {
            setShowMarketDialog(false)
          }}
          item={marketMsg}
          onPress={handleMarketDialogPressed}
        />
      } */}

      {
        diet.isForceUpdate == true &&
        <TouchableOpacity activeOpacity={1} style={{ width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, position: "absolute", alignItems: "center", justifyContent: "center" }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }} blurType="dark" blurAmount={1}
          />
          <View style={{ backgroundColor: defaultTheme.white, width: dimensions.WINDOW_WIDTH * 0.9, borderRadius: moderateScale(10), alignItems: "center", justifyContent: "center", padding: moderateScale(5), borderWidth: 1, borderColor: defaultTheme.green }}>
            <LottieView
              source={require('../../res/animations/forceU.json')}
              style={{ width: moderateScale(400), height: moderateScale(400) }}
              autoPlay={true}
              loop={true}
            />
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText }}>{lang.forceUpdateTitle}</Text>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, textAlign: "center", padding: 10, lineHeight: moderateScale(23) }}>{lang.forceUpdateText}</Text>

            <ConfirmButton
              lang={lang}
              title={lang.forceUpdateBtn}
              style={{ backgroundColor: defaultTheme.green, marginVertical: moderateScale(10) }}
              onPress={() => {
                Linking.openURL("https://play.google.com/store/apps/details?id=com.o2fitt")
              }}
            />
          </View>
        </TouchableOpacity>
      }
      {premiumModal && user.countryId == 128 && starRating.vipShown ?
        <BlurView style={{ position: "absolute", height: moderateScale(160), width: dimensions.WINDOW_WIDTH }} blurType={"dark"} overlayColor={"transparent"} blurAmount={5}>
          <Animated.View style={{ transform: [{ translateY: translateY }] }}>
            <TouchableOpacity
              onPress={() => fadeModal()}
              style={{ alignSelf: "baseline", alignItems: "center", padding: moderateScale(7), flexDirection: "row", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: moderateScale(20), marginHorizontal: moderateScale(15), marginVertical: moderateScale(5) }}>
              <Image
                source={require('../../res/img/cross.png')}
                style={{ width: moderateScale(18), height: moderateScale(18), tintColor: defaultTheme.white }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => fadeModal()} style={{ flexDirection: "row", alignItems: "center", width: dimensions.WINDOW_WIDTH * 0.95, alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: moderateScale(11) }}>
              <LottieView
                source={require('../../res/animations/vip.json')}
                autoPlay={true}
                loop={false}
                style={{ width: moderateScale(100), height: moderateScale(100) }}
              />
              <View style={{ width: dimensions.WINDOW_WIDTH * 0.45 }}>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{lang.expiredPremium}</Text>
                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, textAlign: "left" }}>{lang.expirePremiumDes}</Text>
              </View>
              <ConfirmButton
                lang={lang}
                style={{ backgroundColor: defaultTheme.green2, width: moderateScale(80), heigth: moderateScale(20) }}
                title={lang.reNew}
                onPress={() => {
                  setPremiumModal(false)
                  navigation.navigate("PackagesScreen")
                }}
              />
            </TouchableOpacity>
          </Animated.View>
        </BlurView> : null
      }
      {
        Vip && user.countryId == 128 && starRating.vipShown ?
          <VIP
            lang={lang}
            auth={auth}
            user={user}
            crossPressed={() => {
              setVIP(false)
              dispatch(setVipTimer(moment().add(3, "days").format("YYYY-MM-DD")))
              dispatch(vipShown(false))
            }}
          />
          :
          null
      }

      {
        parseInt(serverTime) > parseInt(moment().format("YYYYMMDD")) + 3 &&
        <TimeZoneError
          lang={lang}
          crossPressed={() => { }}
        />
      }
      {vpn && errorVisible == false &&
        <VpnErrprModal
          lang={lang}
          user={user}
          onDismiss={(doNotShow) => {
            if (doNotShow == true) {
              AsyncStorage.setItem("vpnShown", 'true')
            }
            setVpn(false)
          }}

        />
      }
      {errorVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="dark" blurAmount={2} />
            <Information
              visible={errorVisible}
              context={errorContext}
              onRequestClose={() => setErrorVisible(false)}
              lang={lang}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      {/* <NoInternetModal
        visible={showNoInternetModal}
        onRequestClose={closeInternetModal}
        callBack={NoInternetCallback}
        networkConnectivity={app.networkConnectivity}
        lang={lang}
      /> */}
    </>
  );
}
const styles = StyleSheet.create({
  shadow: {
    elevation: 0
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

export default Tabs
