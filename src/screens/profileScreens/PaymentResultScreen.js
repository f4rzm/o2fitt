
import React from 'react';
import {
  StyleSheet,
  Platform,
  BackHandler,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmButton, Toolbar } from "../../components"
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import HomeScreen from '../homeScreeen/HomeScreen';
import LottieView from 'lottie-react-native';
import { updateProfileLocaly } from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dimensions } from '../../constants/Dimensions';
import { firebase } from '@react-native-firebase/analytics';
import { setIsBuy } from '../../redux/actions/diet';
import moment from 'moment';


const PaymentResultScreen = props => {
  // console.error(props.route.params.orderid);
  const lang = useSelector(state => state.lang)
  const auth = useSelector(state => state.auth)
  const user = useSelector(state => state.user)
  const profile = useSelector(state => state.profile)
  const [loading, setLoading] = React.useState(true)
  const [successFul, setSuccessFul] = React.useState(false)
  const [trackingCode, setTrackingCode] = React.useState("")
  const dispatch = useDispatch()

  React.useEffect(() => {
    checkOrder(props.route.params.orderid)
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack
    );

    return () => backHandler.remove();
  }, [])

  const goBack = () => {
    props.navigation.popToTop()
    return true
  }

  const checkOrder = (orderId) => {
    const url = urls.orderBaseUrl + urls.order + urls.checkOrder + `?OrderId=${orderId}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("post", url, params, header, checkOrderSuccess, checkOrderFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const checkOrderSuccess = (response) => {
    console.warn(response.data.data.state);
    if (response.data.data.state==true) {
      firebase.analytics().logPurchase({ transaction_id: props.route.params ? `${props.route.params.orderid}` : "1"})
      getProfile()
      setTrackingCode(response.data.data.trackingCode)
    }
    else {
      setLoading(false)
      setSuccessFul(false)
      firebase.analytics().logEvent('failedPurchase')
    }

  }

  const checkOrderFailure = () => {
    setLoading(false)
  }

  const getProfile = () => {
    const url = urls.userBaseUrl + urls.userProfiles + urls.getUserTrackSpecification + "?userId=" + user.id
    const header = {}
    const params = {}
    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, onGetProfileSuccess, onGetProfileFailure)
  }

  const onGetProfileSuccess = async (response) => {
    console.error(response);
    const pkExpireDate = moment(response.data.data.userProfile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    pkExpireDate.diff(today, "seconds") > 0 ? dispatch(setIsBuy(true)) : dispatch(setIsBuy(false))
    setSuccessFul(true)
    setLoading(false)
    if (response.data.statusCode === 0 && response.data.data) {
      AsyncStorage.setItem("profile", JSON.stringify({ id: user.id, ...response.data.data.userProfile }))
      dispatch(updateProfileLocaly(response.data.data.userProfile))
    }
  }

  const onGetProfileFailure = (error) => {
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  const backToProfile = () => {
    props.navigation.popToTop()
  }

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.paymentReceipt}
        onBack={goBack}
      />
      <View style={styles.mainContainer}>
        {
          loading ?
            <ActivityIndicator
              color={defaultTheme.primaryColor}
              size="large"
              style={{ marginTop: dimensions.WINDOW_HEIGTH * 0.3 }}
            /> :
            <>
              <LottieView
                style={{
                  width: dimensions.WINDOW_WIDTH * 0.8,
                  height: dimensions.WINDOW_WIDTH * 0.6,
                }}
                source={successFul ? require('../../../res/animations/payment_success.json') : require('../../../res/animations/payment_faild.json')}
                autoPlay
                loop={false}
              />

              <Text
                style={[
                  styles.text,
                  { fontFamily: lang.titleFont }
                ]}
                allowFontScaling={false}
              >
                {
                  successFul ? lang.tanksToBuy : lang.ohhhh
                }
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font, color: successFul ? defaultTheme.green : defaultTheme.error }]} allowFontScaling={false}>
                {
                  successFul ? lang.isSuccessFullBuyPakage : lang.unSuccessPaymentBanck
                }
              </Text>
              <Text
                style={[
                  styles.text2,
                  { fontFamily: lang.titleFont }
                ]}
                allowFontScaling={false}
              >
                {
                  lang.traceCode + " : " + trackingCode
                }
              </Text>
              <ConfirmButton
                style={successFul ? styles.btnSuccess : styles.btnFailed}
                lang={lang}
                title={lang.back}
                onPress={backToProfile}
              />
            </>

        }
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: moderateScale(40)
  },
  text: {
    color: defaultTheme.darkGray,
    fontSize: moderateScale(17),
    marginHorizontal: "3%",
    textAlign: "center",
    lineHeight: moderateScale(25),
    marginVertical: moderateScale(16)
  },
  text2: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(18),
    marginHorizontal: "3%",
    textAlign: "center",
    lineHeight: moderateScale(25),
    marginTop: moderateScale(5)
  },
  text3: {
    color: defaultTheme.darkGray,
    fontSize: moderateScale(16),
    marginHorizontal: "3%",
    textAlign: "center",
    lineHeight: moderateScale(25),
    marginVertical: moderateScale(10)
  },
  btnSuccess: {
    margin: moderateScale(10),
    height: moderateScale(37),
    width: moderateScale(130),
    backgroundColor: defaultTheme.green
  },
  btnFailed: {
    margin: moderateScale(10),
    height: moderateScale(37),
    width: moderateScale(130)
  }
});

export default PaymentResultScreen;
