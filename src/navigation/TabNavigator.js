import React, { useEffect, useRef, useState } from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileRouter from "./profileRouter"
import HomeRouter from "./homeRouter"
import DailyRouter from "./dailyRouter"
import GoalRouter from "./goalRouter"
import { Linking, Platform, View, Text, TouchableOpacity, Image, Animated, Easing, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Alert } from "react-native"
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
import UpdateModal from "../components/modals/UpdateModal";
import { getVersion } from "react-native-device-info";
import DietMainScreen from "../screens/DietScreens/DietMainScreen";
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
  const fastingDiet = useSelector(state => state.fastingDiet)
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
    const url = urls.socialBaseUrl + urls.marketMessage + urls.GetByDateUser
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const RC = new RestController()

    RC.get(url, header, onMarketMessageSuccess, onFailedGetMarketMessage)
  }

  const onMarketMessageSuccess = async (res) => {

    console.warn(res.data.data);
    setMarketMsg(res.data.data)
    setShowMarketDialog(true)
    const today = moment()

    let marketMessage = await AsyncStorage.getItem("marketMessage")
    marketMessage = marketMessage ? JSON.parse(marketMessage) : null

    
    if (marketMessage) {

      if (marketMessage.id == res.data.data.id) {
        if (marketMessage.nextTimeShow.diff(today, 'seconds') > 0) {
          setMarketMsg(res.data.data)
          setShowMarketDialog(true)
          AsyncStorage.setItem("marketMessage", JSON.stringify({ ...marketMessage, nextTimeShow: moment().add(marketMessage.postpone, "hours").format("YYYY-MM-DDTHH:mm:ss") }))
          Alert.alert("ok")
        }
      }
      else if (res.data.data) {
        setMarketMsg(res.data.data)
        setShowMarketDialog(true)
        AsyncStorage.setItem("marketMessage", JSON.stringify({ ...res.data.data, nextTimeShow: moment().add(res.data.data.postpone, "hours").format("YYYY-MM-DDTHH:mm:ss") }))
        Alert.alert("ok")
      }
    } else if (res.data.data) {

      setMarketMsg(res.data.data)
      setShowMarketDialog(true)
      AsyncStorage.setItem("marketMessage", JSON.stringify({ ...res.data.data, nextTimeShow: moment().add(res.data.data.postpone, "hours").format("YYYY-MM-DDTHH:mm:ss") }))
      Alert.alert("ok")
    }

    // if (res.data.data) {
    //   let history = await AsyncStorage.getItem("marketHistory")
    //   history = history ? JSON.parse(history) : []
    //   if (history.findIndex(item => item.id == res.data.data.id) === -1) {
    //     history.push(res.data.data.id)
    //     await AsyncStorage.setItem("marketHistory", JSON.stringify(history))
    //     setTimeout(() => {
    //       setMarketMsg(res.data.data)
    //       setShowMarketDialog(true)
    //     }, 800);
    //   }
    // }
  }
  const onFailedGetMarketMessage = async() => {
    let marketMessage =await AsyncStorage.getItem("marketMessage")
    marketMessage = marketMessage ? JSON.parse(marketMessage) : null
    const today = moment()

    if (marketMessage) {

      if (marketMessage.nextTimeShow.diff(today, 'seconds') > 0) {
        setMarketMsg(marketMessage)
        setShowMarketDialog(true)
        AsyncStorage.setItem("marketMessage", JSON.stringify({ ...marketMessage, nextTimeShow: moment().add(marketMessage.postpone, "hours").format("YYYY-MM-DDTHH:mm:ss") }))
      }
    }
  }

  const handleMarketDialogPressed = () => {
    setShowMarketDialog(false)
    // Linking.canOpenURL(marketMsg.url).then(() => {
    //   setTimeout(() => {
    //     Linking.openURL(marketMsg.url).catch(() => {
    //       props.navigation.navigate(marketMsg.url)

    //     })
    //   }, Platform.OS === "ios" ? 500 : 50)
    // })
    // analytics().logEvent('marketMessagePressed')
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
    getMarketMessage()
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

  const [errorVisible, setErrorVisible] = useState(false)
  const [errorContext, setErrorContext] = useState(lang.noInternet)
  const [updateModal, setUpdateModal] = useState(false)

  React.useEffect(() => {
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

    const RC = new RestController()
    const url = urls.socialBaseUrl + urls.appVersion + urls.getAppversion + `?marketType=2&curentAppVersion=${getVersion()}`
    RC.get(url, header, onSuccessGetAppVersion, onFailureGetAppVersion)
  }, [])
  const onSuccessGetAppVersion = (res) => {
    setUpdateModal(res.data.data);
  }
  const onFailureGetAppVersion = (err) => {
    console.error(err);
  }


  return (
    <>

      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          tabBar={props => <TabBar {...props} lang={lang} profile={profile} fastingDiet={fastingDiet} />}
          initialRouteName="HomeRouter"
          backBehavior="firstRoute"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="HomeRouter" component={HomeRouter} />
          <Tab.Screen name="DailyRouter" component={DailyRouter} />
          <Tab.Screen name="DietMainScreen" component={DietMainScreen} />
          <Tab.Screen name="GoalRouter" component={GoalRouter} />
          {
            lang.langName == "persian" ?
              <Tab.Screen name="RecipeRouter" component={RecipeCatScreen} /> :
              <Tab.Screen name="ProfileRouter" component={ProfileRouter} />
          }
        </Tab.Navigator>
      </SafeAreaView>
      {showMmarketDialog &&
        <MarketModal
          lang={lang}
          visible={showMmarketDialog}
          onRequestClose={() => {
            setShowMarketDialog(false)
          }}
          item={marketMsg}
          onPress={handleMarketDialogPressed}
        />
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
        </BlurView>
        : null
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
      {/* {
        updateModal &&
        <UpdateModal
          item={updateModal}
          lang={lang}
          crossPressed={() => {
            setUpdateModal(false)
          }}
        />
      } */}
      {
        parseInt(serverTime) > parseInt(moment().format("YYYYMMDD")) + 3 &&
        <TimeZoneError
          lang={lang}
          crossPressed={() => { }}
        />
      }

      {errorVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            {/* <BlurView style={styles.absolute} blurType="dark" blurAmount={2} /> */}
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
