import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { DiscountsList, ConfirmButton, RowCenter, Information, RowWrapper, Toolbar, RowStart, RowSpaceAround, CustomInput, RadioButton } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import Discount from "../../../res/img/discount.svg"
import { BlurView } from '@react-native-community/blur';

const banksUrl = [
  urls.bankBaseUrl + "melatpayment",
  urls.bankBaseUrl + "samanpayment"
]
const PaymentScreen = props => {

  const discountPercent = props.route.params.package.discountPercent ? props.route.params.package.discountPercent : 0
  console.log(props.route.params)


  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const auth = useSelector(state => state.auth)
  const app = useSelector(state => state.app)
  const showYekPay = user.countryId != 128
  const [paymentData, setPaymentData] = React.useState({
    "userId": user.id,
    "packageId": props.route.params.package.id,
    "packageName": props.route.params.package.name,
    "packagePrice": props.route.params.package.price - ((props.route.params.package.price * discountPercent) / 100),
    "isDiscountActive": false,
    "discountId": 0,
    "discountAmount": (props.route.params.package.price * discountPercent) / 100,
    "amount": props.route.params.package.price - ((props.route.params.package.price * discountPercent) / 100),
    "currency": props.route.params.package.currency
  }
  )
  const currency = {
    0: lang.euro,
    1: lang.toman
  }

  const [discountsList, setDiscountsList] = React.useState(null)
  const [discountCode, setDiscountCode] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [postalCode, setPostalCode] = React.useState("")
  const [country, setCountry] = React.useState("")
  const [city, setCity] = React.useState("")
  const [desc, setDesc] = React.useState("")
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [discountListVisible, setDiscountListVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [getDiscountLoading, setGetDiscountLoading] = React.useState(false)
  const [discountLoading, setDiscountLoading] = React.useState(false)
  const keybordIsShown = React.useRef(false)

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => keybordIsShown.current = true)
    Keyboard.addListener("keyboardDidHide", () => keybordIsShown.current = false)
    checkDiscount()
  }, [])

  const goBack = () => {
    keybordIsShown.current ?
      Keyboard.dismiss() :
      props.navigation.goBack()
  }

  const onGetDiscountPressed = () => {
    if (discountsList === null) {
      getDiscounts()
    }
    else if (discountsList.length > 0) {
      setDiscountListVisible(true)
    }
    else {
      setErrorContext(lang.noDiscountList)
      setErrorVisible(true)
    }
  }

  const getDiscounts = () => {
    setGetDiscountLoading(true)
    const url = urls.orderBaseUrl + urls.discount + "?Page=1&PageSize=100&userId=" + user.id
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    var params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getSuccess = (response) => {
    setGetDiscountLoading(false)
    const validDiscounts = [...response.data.data.items.filter(item => !(item.code.toLowerCase().startsWith("o2fit")))]
    setDiscountsList(validDiscounts)
    if (validDiscounts.length === 0) {
      setErrorContext(lang.noDiscountList)
      setErrorVisible(true)
    }
    else {
      setDiscountListVisible(true)
    }
  }

  const getFailure = () => {
    setGetDiscountLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const onDiscountSelected = (discount) => {
    setDiscountCode(discount.code)
    setDiscountListVisible(false)
  }

  const discountChanged = text => {
    setDiscountCode(text)
  }

  const checkDiscount = () => {
    setDiscountLoading(true)
    const url = urls.orderBaseUrl + urls.order + urls.discountCheck + `?UserId=${user.id}&Code=${discountCode}&PackageId=${paymentData.packageId}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    var params = {}

    const RC = new RestController()
    RC.checkPrerequisites("post", url, params, header, checkSuccess, checkFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const checkSuccess = (response) => {
    setDiscountLoading(false)
    if (response.data.data.isActive) {
      setPaymentData({
        ...paymentData,
        "discountUser": response.data.data.discountUser,
        "discountId": response.data.data.discountId,
        "isDiscountActive": true,
        "amount": response.data.data.amount,
        "discountAmount": paymentData.currency == 0 ?
          parseFloat(parseFloat(paymentData.packagePrice) - parseFloat(response.data.data.amount)).toFixed(3) :
          parseInt(paymentData.packagePrice) - parseInt(response.data.data.amount)
      })
    }
    else {
      setPaymentData({
        ...paymentData,
        discountId: null,
        discountUser: null,
        isDiscountActive: false,
        discountAmount: 0,
        amount: props.route.params.package.price - ((props.route.params.package.price * discountPercent) / 100)
      })
    }
  }

  const checkFailure = () => {
    setDiscountLoading(false)
    setPaymentData({
      ...paymentData,
      discountId: 0,
      isDiscountActive: false
    })
  }

  const addOrder = () => {
    setLoading(true)
    const url = urls.orderBaseUrl + urls.order + urls.addOrder
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    var params = { ...paymentData }

    const RC = new RestController()
    RC.checkPrerequisites("post", url, params, header, addSuccess, addFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const addSuccess = (response) => {
    console.warn(response.data.data)
    setLoading(false)
    if (response.data.isSuccess) {
      if (paymentData.amount == 0) {
        props.navigation.navigate('PaymentResultScreen', { orderid: response.data.data })
      }
      else {
        const index = Math.floor(Math.random() * 1.99)
        const url = banksUrl[index] + "?orderid=" + response.data.data
        console.log(url)
        Linking.openURL(
          url
        )
      }
    }

  }

  const addFailure = () => {
    setLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const addYekPayOrder = () => {
    setLoading(true)
    const url = urls.orderBaseUrl + urls.order + urls.addOrderYekPay
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    var params = {
      ...paymentData,
      "id": 0,
      "email": email,
      "mobile": mobile,
      "firstName": firstName,
      "lastName": lastName,
      "address": address,
      "postalCode": postalCode,
      "country": country,
      "city": city,
      "description": desc,
    }

    const RC = new RestController()
    RC.checkPrerequisites("post", url, params, header, addYekPaySuccess, addYekPayFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const addYekPaySuccess = (response) => {
    setLoading(false)
    if (response.data.isSuccess) {
      Linking.openURL(
        response.data.data
      )
    }
    else {
      response.data.message && response.data.message != "" ?
        setErrorContext(response.data.message) :
        setErrorContext(lang.serverError)
      setErrorVisible(true)
    }
  }

  const addYekPayFailure = () => {
    setLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  const payPressed = () => {
    if (showYekPay) {
      if (mobile != "" && email != "" && firstName != "" && lastName != "" && address != "" && country != "" && city != "" && postalCode != "") {
        addYekPayOrder()
      }
      else {
        setErrorContext(lang.fillAllFild)
        setErrorVisible(true)
      }
    }
    else {
      addOrder()
    }
  }

  console.log("paymentData", paymentData)
  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.SelectBankTitle}
        onBack={goBack}
      />
      {errorVisible || discountListVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <RowCenter style={styles.row2}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {
                lang.pakagNameSelected + " : " + paymentData.packageName
              }
            </Text>
          </RowCenter>
          <RowStart style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {
                lang.amount + " : " + paymentData.packagePrice + " " + currency[paymentData.currency]
              }
            </Text>
          </RowStart>
          <RowStart style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {
                lang.discount + " : " + paymentData.discountAmount + " " + currency[paymentData.currency]
              }
            </Text>
          </RowStart>
          <RowStart style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.green }]} allowFontScaling={false}>
              {
                lang.payable + " : " + paymentData.amount + " " + currency[paymentData.currency]
              }
            </Text>
          </RowStart>
          <RowSpaceAround>
            <ConfirmButton
              lang={lang}
              style={styles.discountBtn}
              title={lang.applyCode}
              onPress={checkDiscount}
              isLoading={discountLoading}
            />
            <CustomInput
              lang={lang}
              style={styles.discountInput}
              textStyle={{ textAlign: "center", fontSize: moderateScale(16) }}
              placeholder={lang.discountCode}
              onChangeText={discountChanged}
              value={discountCode}
            />
          </RowSpaceAround>
          <RowStart style={styles.row}>
            {
              getDiscountLoading ?
                <ActivityIndicator
                  size="large"
                  color={defaultTheme.primaryColor}
                  style={{ marginStart: moderateScale(40) }}
                /> :
                <TouchableOpacity style={styles.discountTxt} onPress={onGetDiscountPressed} >
                  <Discount
                    width={moderateScale(25)}
                    height={moderateScale(25)}
                    preserveAspectRatio="none"
                  />
                  <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.blue, marginStart: moderateScale(6) }]} allowFontScaling={false}>
                    {
                      lang.viewDiscountList
                    }
                  </Text>
                </TouchableOpacity>
            }
          </RowStart>
          {
            showYekPay &&
            <View style={{ flex: 1, alignItems: "center" }}>
              <RowStart>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {
                    lang.fillEN
                  }
                </Text>
              </RowStart>

              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.name}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                multiline={true}
                numberOfLines={1}
              />
              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.family}
                value={lastName}
                onChangeText={text => setLastName(text)}
                multiline={true}
                numberOfLines={1}
              />

              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.email}
                value={email}
                onChangeText={text => setEmail(text)}
                multiline={true}
                numberOfLines={1}
              />

              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.mobile}
                value={mobile}
                onChangeText={text => setMobile(text)}
                multiline={true}
                numberOfLines={1}
              />

              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.country}
                value={country}
                onChangeText={text => setCountry(text)}
                multiline={true}
                numberOfLines={1}
              />
              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.city}
                value={city}
                onChangeText={text => setCity(text)}
                multiline={true}
                numberOfLines={1}
              />
              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.address}
                value={address}
                onChangeText={text => setAddress(text)}
                multiline={true}
                numberOfLines={1}
              />
              <TextInput
                lang={lang}
                style={[styles.input, { fontFamily: lang.font }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.ZipCode}
                value={postalCode}
                onChangeText={text => setPostalCode(text)}
                multiline={true}
                numberOfLines={1}
              />
              <TextInput
                lang={lang}
                style={[[styles.input, { fontFamily: lang.font }], { marginBottom: moderateScale(100) }]}
                textStyle={{ textAlign: "center", color: defaultTheme.darkGray }}
                placeholder={lang.descriptionBank}
                value={desc}
                onChangeText={text => setDesc(text)}
                multiline={true}
                numberOfLines={1}
              />

            </View>
          }
        </View>
      </ScrollView>
      <View style={{width:dimensions.WINDOW_WIDTH,alignItems:"center"}}>
        <ConfirmButton
          lang={lang}
          style={styles.payBtn}
          title={lang.finalPay}
          onPress={payPressed}
          isLoading={loading}
        />
      </View>
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
      <DiscountsList
        visible={discountListVisible}
        discountsList={discountsList}
        onRequestClose={() => setDiscountListVisible(false)}
        lang={lang}
        onDiscountSelected={onDiscountSelected}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: moderateScale(22),
    backgroundColor: defaultTheme.green,
    width: dimensions.WINDOW_WIDTH * .75,
    height: moderateScale(37)
  },
  row: {
    marginVertical: 0,
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1.2
  },
  row2: {
    marginVertical: 0,
    paddingVertical: moderateScale(10),
    backgroundColor: defaultTheme.grayBackground
  },
  row3: {
    marginVertical: 0,
    paddingVertical: moderateScale(10),
  },
  text: {
    fontSize: moderateScale(16),
    color: defaultTheme.darkText,
    lineHeight: moderateScale(20),
  },
  discountBtn: {
    width: dimensions.WINDOW_WIDTH * 0.37,
    height: moderateScale(37),
    backgroundColor: defaultTheme.green,
    borderRadius: moderateScale(6),
  },
  discountInput: {
    width: dimensions.WINDOW_WIDTH * 0.55,
    borderRadius: moderateScale(6),
    backgroundColor: defaultTheme.grayBackground,
    borderWidth: 0
  },
  input: {
    width: dimensions.WINDOW_WIDTH * 0.8,
    height: moderateScale(45),
    borderRadius: moderateScale(6),
    backgroundColor: defaultTheme.grayBackground,
    borderWidth: 0,
    marginVertical: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    color: defaultTheme.darkGray,
    textAlign: "center"
  },
  payBtn: {
    marginBottom: moderateScale(22),
    marginHorizontal: dimensions.WINDOW_WIDTH * 0.45,
    backgroundColor: defaultTheme.green,
    width: dimensions.WINDOW_WIDTH * 0.5,
    height: moderateScale(45),
  },
  discountTxt: {
    flexDirection: "row",
    alignItems: "center"
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

})

export default PaymentScreen;