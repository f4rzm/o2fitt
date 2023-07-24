import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Text,
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { tokenLoadingFinished, updateUserData, setAuthData, updateProfileLocaly, updateSpecificationLocaly } from "../../redux/actions"
import { useDispatch, useSelector } from "react-redux"
import { NoInternetModal, Information } from '../../components';
import { RestController } from '../../classess/RestController';
import { urls } from "../../utils/urls"
import Logo from "../../../res/img/logo.svg"
import Byo2 from "../../../res/img/byo2.svg"
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NativeSplashScreen from 'react-native-splash-screen'
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message'
import DeviceInfo from 'react-native-device-info'
import { isForceUpdate, setIsBuy, clearDiet } from '../../redux/actions/dietNew';
import moment from 'moment'
import { vipShown } from '../../redux/actions/starRating';

const SplashScreen = props => {

  const app = useSelector(state => state.app)
  const lang = useSelector(state => state.lang)
  // const redux = useSelector(state => state)
  let userId = React.useRef(0).current
  let SDBC = React.useRef(new SpecificationDBController()).current
  const [showNoInternetModal, setShowNoInternetModal] = React.useState(false)
  let opacity = React.useRef(new Animated.Value(1)).current
  const dispatch = useDispatch()
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)

  React.useEffect(() => {
    loadAuth()
  }, [])

  const loadAuth = async () => {
    let auth = await AsyncStorage.getItem("auth")
    if (auth) {
      auth = JSON.parse(auth)
      dispatch(setAuthData(auth))
      loadUser()
    }
    else {
      NativeSplashScreen.hide()
      loadDataFinished()
    }
  }

  const loadUser = async () => {
    let user = await AsyncStorage.getItem("user")
    if (user) {
      user = JSON.parse(user)
      console.log("SplashScreen => user => ", user)
      userId = user.id
      dispatch(updateUserData(user))
      getProfile()
    }
    else {
      NativeSplashScreen.hide()
      loadDataFinished()
    }
  }

  const getProfile = async () => {
    // if(app.networkConnectivity){
    const url = urls.userTrackBase + urls.userProfiles + urls.getUserTrackSpecification + "?userId=" + userId
    const header = {}
    const params = {}
    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, onGetProfileSuccess, onGetProfileFailure)
    // }

    let profile = await AsyncStorage.getItem("profile")
    if (profile) {
      dispatch(updateProfileLocaly(JSON.parse(profile)))
      getUserSpec()
    }
    else {
      getUserSpec()
      loadDataFinished()
    }

  }

  const onGetProfileSuccess = async (response) => {
    const pkExpireDate = moment(response.data.data.userProfile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    pkExpireDate.diff(today, "seconds") > 0 ? dispatch(setIsBuy(true)) : dispatch(setIsBuy(false))
    pkExpireDate.diff(today, "seconds") > 0 ? dispatch(vipShown(false)) : dispatch(vipShown(true))

    console.error(response.data.data)
    let appVersions = response.data.data.forceUpdateVersions.split(",")
    let index = appVersions.indexOf(DeviceInfo.getVersion())
    if (index !== -1) {
  
      dispatch(isForceUpdate(true))
    } else {
      dispatch(isForceUpdate(false))
    }
    if (response.data.statusCode === 0 && response.data.data && response.data.data.trackSpecifications != null) {

      AsyncStorage.setItem("profile", JSON.stringify({ id: userId, ...response.data.data.userProfile }))
      if (response.data.data.trackSpecifications) await SDBC.put(response.data.data.trackSpecifications, getSpecificationFromDB)
      dispatch(updateProfileLocaly(response.data.data.userProfile))
    }
    else {
      getUserSpec()
    }
  }

  const onGetProfileFailure = (error) => {
    if (app.networkConnectivity) {
      // setErrorContext(lang.serverError)
      // setErrorVisible(true)
      // Toast.show({
      //   type: "error",
      //   props: { text2: lang.noInternet, style: { fontFamily: lang.font, color: "black" } }
      // })
    }
    else {
      NativeSplashScreen.hide()
      loadDataFinished()
    }
  }

  const getSpecificationFromDB = async () => {
    console.log("SplashScreen => getSpecificationFromDB")
    const data = await SDBC.getLastTwo()
    data && dispatch(updateSpecificationLocaly(data))
    NativeSplashScreen.hide()
    loadDataFinished()
  }

  const getUserSpec = async () => {
    const SCDB = new SpecificationDBController()
    const spec = await SCDB.getLastTwo()
    console.log("updateSpecification spec", spec)
    dispatch(updateSpecificationLocaly(spec))
    NativeSplashScreen.hide()
    loadDataFinished()
  }

  const loadDataFinished = () => {
    Animated.timing(opacity, {
      duration: 10,
      toValue: 0,
      useNativeDriver: true
    }).start()

    dispatch(tokenLoadingFinished())
  }

  const NoInternetCallback = () => {
    setShowNoInternetModal(false)
    setTimeout(() => {
      NativeSplashScreen.hide()
      loadDataFinished()
    }, 500)
  }

  const closeInternetModal = () => {

  }

  return (
    <Animated.View style={[styles.mainContainer, { opacity: 0 }]}>
      <View style={[styles.container]}>
        <Logo
          width={dimensions.WINDOW_WIDTH * 0.6}
        />

      </View>

      <Byo2
        width={dimensions.WINDOW_WIDTH * 0.27}
      />
      {/* {errorVisible && (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      )} */}

      <View style={{ marginBottom: 12, marginTop: 15 }}>
        <Text style={styles.text}>
          everyone's needs it
        </Text>
      </View>
      <NoInternetModal
        visible={showNoInternetModal}
        onRequestClose={closeInternetModal}
        callBack={NoInternetCallback}
        networkConnectivity={app.networkConnectivity}
        lang={lang}
      />
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: dimensions.WINDOW_HEIGTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: defaultTheme.primaryColor,
  },
  container: {
    flex: 1,
    height: dimensions.WINDOW_HEIGTH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: dimensions.WINDOW_WIDTH * 0.15
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.25,
    height: dimensions.WINDOW_WIDTH * 0.25
  },
  text: {
    color: defaultTheme.lightText,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2
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

export default SplashScreen;
