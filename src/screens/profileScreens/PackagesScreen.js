import React, { useState, useEffect, useRef } from 'react'
import { AppState, View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, ActivityIndicator, Linking, TextInput, TouchableWithoutFeedback, Easing } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment, DiscountsList } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import moment from "moment"
import { moderateScale } from 'react-native-size-matters'
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController'
import { dimensions } from '../../constants/Dimensions'
import LinearGradient from 'react-native-linear-gradient'
import { Modal } from 'react-native-paper'
import More from '../../../res/img/MORE.svg'
import Discount from "../../../res/img/discount.svg"
import { BlurView } from '@react-native-community/blur'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { firebase } from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage'
import PackageResultModal from '../../components/PackageResultModal'
import { useDispatch } from 'react-redux'
import { updateProfileLocaly } from '../../redux/actions'
import { setIsBuy } from '../../redux/actions/dietNew'
// import { useBazaar } from '@cafebazaar/react-native-poolakey'
import { setPackageSale } from '../../redux/actions/user'


function PackagesScreen(props) {
    const dispatch = useDispatch()
    // console.warn("this is packages props",props.route.params);
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current)
    const [orderId, setOrderId] = useState(null)
    const testOrder = useRef(0)
    const [trackingCode, setTrackingCode] = useState()
    const [resultModal, setResultModal] = useState(false)
    // const bazaar = useBazaar("MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwCaUsHehyaWDjCIwIR2rjyxkk4KhXXaVk85OGJitwLiKnqU8MJlUaC9Gl2wdcJsYUD1r/nLcviGnm8GdMXrNCfJmBeMcWqpu/BotMrSiYNa4NZhwl5UKomInryu3AlHGYxPoV8z+qI6CHpYrx8beXAX9opn1wjk23RR83VbN4lU9XwXDOR2rFL6htI/nluDiE6p0REaQ30OkCoCTnp6bcpBU/L1fKnqFb8Kxh10DycCAwEAAQ==")

    useEffect(() => {

        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            if (testOrder.current != 0) {
                console.error("check order", testOrder.current);
                checkOrderResult()
            }
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
    };

    const checkOrderResult = () => {
        console.error("checkOrder", testOrder.current);
        const url = urls.orderBaseUrl + urls.order + urls.checkOrder + `?OrderId=${testOrder.current}`
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = {}

        const RC = new RestController()
        RC.checkPrerequisites("post", url, params, header, checkOrderSuccess, checkOrderFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)

    }
    const checkOrderSuccess = (response) => {
        if (response.data.data.state) {
            setResultModal(true)
            getProfile()
            setTrackingCode(response.data.data.trackingCode)
            console.error(response.data.data.trackingCode);
            firebase.analytics().logPurchase({ transaction_id: testOrder.current })
        }
        else {
            console.error("faild to bul Package");
            setResultModal(true)

            firebase.analytics().logEvent('failedPurchase')
        }

    }
    const checkOrderFailure = () => {

    }
    const getProfile = () => {
        const url = urls.userTrackBase + urls.userProfiles + urls.getUserTrackSpecification + "?userId=" + user.id
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

        if (response.data.statusCode === 0 && response.data.data) {
            AsyncStorage.setItem("profile", JSON.stringify({ id: user.id, ...response.data.data.userProfile }))
            dispatch(updateProfileLocaly(response.data.data.userProfile))
        }
    }
    const onGetProfileFailure = (error) => {
    }

    const specification = useSelector(state => state.specification)
    const profile = useSelector(state => state.profile)
    const [packages, setPackages] = useState([])
    const [diet, setDiet] = useState([])
    const [errorContext, setErrorContext] = React.useState("")
    const [errorVisible, setErrorVisible] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [selectedPackage, setSelectedPackage] = useState({ id: null })
    const [selectedPage, setSelectedPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [selectedFeature, setSelectedFeature] = useState([])
    const [discountCode, setDiscountCode] = useState('')
    const [discountListVisible, setDiscountListVisible] = useState(false)
    const [discountsList, setDiscountsList] = React.useState(null)
    const [showDiscountModal, setShowDiscountModal] = useState(false)
    const [getDiscountLoading, setGetDiscountLoading] = React.useState(false)
    const [buyModal, setBuyModal] = useState(false)

    const translateY = useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current

    const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const [packageEndDate, updatePackageEndDate] = React.useState(moment().diff(moment(profile.pkExpireDate), "d"))
    const [DietPackageEndDate, updateDietPackageEndDate] = React.useState(moment().diff(moment(profile.dietPkExpireDate), "d"))
    const today = moment()
    const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
    useEffect(() => {
        getPackages()
    }, [])


    const getPackages = () => {
        if (app.networkConnectivity) {
            const url = urls.orderBaseUrl2 + urls.package
            const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName, "Content-Type": "multipart/form-data" } }
            var params = {}

            const RC = new RestController()
            RC.checkPrerequisites("get", url, params, header, getSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
        }
        else {
            setErrorContext(lang.noInternet)
            setErrorVisible(true)
        }
    }

    const getSuccess = (response) => {
        let regim = response.data.data.filter(item => item.packageType == 1)
        let normalPackage = response.data.data.filter(item => item.packageType == 0)
        if (selectedPackage.id === null) {
            if (user.countryId === 128) {
                const fp = response.data.data.filter(item => item.currency === 1)
                if (fp != undefined) {
                    setSelectedPackage(fp)
                    setPackages(fp)
                }
            }
            else {
                const fp = response.data.data.filter(item => item.currency === 0)
                if (fp != undefined) {
                    setSelectedPackage(fp)
                    setPackages(fp)
                }
            }
        }
    }
    const getFailure = (err) => {
        console.error(err);
        setLoading(false)
        setErrorContext(lang.serverError)
        setErrorVisible(true)
    }
    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }
    const dietDescribeData = [
        { id: 0, title: lang.getDiet, decribe: lang.getDietTitle },
        { id: 1, title: lang.principledDietCalculate, decribe: lang.principledDietCalculateDescribe },
        { id: 2, title: lang.getYourGoal, decribe: lang.getYourGoalTitle },

    ]
    const dietplusCalorie = [
        { id: 0, title: null, describe: null },
        { id: 1, title: null, describe: null },
        { id: 2, title: null, describe: null }
    ]
    // console.warn(packages)
    const pachagesData = [
        { id: 0, free: true, name: lang.PayCalorieName, title: lang.PayCalorieTitle, shortdes: lang.PayCalorieSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/calorieimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/calorieimgen.jpg') : require('../../../res/img/calorieimg.jpg'), longdes: lang.PayCalorieLd },
        { id: 1, free: true, name: lang.PayStepName, title: lang.PayStepTitle, shortdes: lang.PayStepSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/stepimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/stepimgen.jpg') : require('../../../res/img/stepimg.jpg'), longdes: lang.PayStepLd },
        (
            lang.langName == "persian"
        )?
        { id: 0, free: true, name: lang.fastingCalorie, title: lang.fastingCalorie, shortdes: "", img: require('../../../res/img/en/fastingcalorie.jpg'), longdes: lang.fastingCalorieDes }
        :null
        ,
        { id: 2, free: true, name: lang.PayWaterName, title: lang.PayWaterTitle, shortdes: lang.PayWaterSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/waterimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/waterimgen.jpg') : require('../../../res/img/waterimg.jpg'), longdes: lang.PayWaterLd },
        { id: 3, free: false, name: lang.PayDietName, title: lang.PayDietTitle, shortdes: lang.PayDietSd, img: require('../../../res/img/mealimg.jpg'), longdes: lang.PayDietLd },
        { id: 15, free: false, name: lang.PayRecipeName, title: lang.PayRecipetitle, shortdes: lang.PayRecipeSd, img: require('../../../res/img/Recipesimg.jpg'), longdes: lang.PayRecipeLd },
        { id: 4, free: false, name: lang.PayFoodMakerName, title: lang.PayFoodMakerTitle, shortdes: lang.PayFoodMakerSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/foodmakerimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/foodmakerimgen.jpg') : require('../../../res/img/foodmakerimg.jpg'), longdes: lang.PayFoodMakerLd },
        { id: 12, free: false, name: lang.PayFoodEditName, title: lang.PayFoodEdittitle, shortdes: lang.PayFoodEditSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/editfimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/editfimgen.jpg') : require('../../../res/img/editfimg.jpg'), longdes: lang.PayFoodEditLd },
        { id: 7, free: false, name: lang.PayBAName, title: lang.PayBAtitle, shortdes: lang.PayBASd, img: lang.langName == "arabic" ? require('../../../res/img/ar/BodyAar.jpg') : lang.langName == "english" ? require('../../../res/img/en/BodyAen.jpg') : require('../../../res/img/bodyanimg.jpg'), longdes: lang.PayBALd },
        (
            lang.langName == "persian"
        )?
        { id: 0, free: false, name: lang.fastingMode, title: lang.fastingMode, shortdes: "", img: require('../../../res/img/en/fastingcalorie.jpg'), longdes: lang.fastingModeDes }
        :null
        ,
        { id: 8, free: false, name: lang.PayDAName, title: lang.PayDAtitle, shortdes: lang.PayDASd, img: lang.langName == "arabic" ? require('../../../res/img/ar/analyzeimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/analyzeimgen.jpg') : require('../../../res/img/analyzeimg.jpg'), longdes: lang.PayDALd },
        { id: 9, free: false, name: lang.PayMealAName, title: lang.PayMealAtitle, shortdes: lang.PayMealSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/analyzeimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/analyzeimgen.jpg') : require('../../../res/img/analyzeimg.jpg'), longdes: lang.PayMealLd },
        { id: 5, free: false, name: lang.PaySleepName, title: lang.PaySleepitle, shortdes: lang.PaySleepSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/sleepar.jpg') : lang.langName == "english" ? require('../../../res/img/en/sleepen.jpg') : require('../../../res/img/sleep.jpg'), longdes: lang.PaySleepLd },
        { id: 6, free: false, name: lang.PayMicName, title: lang.PayMictitle, shortdes: lang.PayMicSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/microimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/microimgen.jpg') : require('../../../res/img/microimg.jpg'), longdes: lang.PayMicLd },
        { id: 10, free: false, name: lang.PayGoalName, title: lang.PayGoalAtitle, shortdes: lang.PayGoalSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/goalimgar.jpg') : lang.langName == "enlish" ? require('../../../res/img/en/goalimgen.jpg') : require('../../../res/img/goalimg.jpg'), longdes: lang.PayGoalLd },
        { id: 16, free: false, name: lang.PayReporteName, title: lang.PayReporttitle, shortdes: lang.PayReportSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/reportimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/reportimgen.jpg') : require('../../../res/img/reportimg.jpg'), longdes: lang.PayReportLd },
        { id: 11, free: false, name: lang.PayNutGoalName, title: lang.PayNutGoalAtitle, shortdes: lang.PayNutGoalSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/microimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/microimgen.jpg') : require('../../../res/img/microimg.jpg'), longdes: lang.PayNutGoalLd },
        { id: 13, free: false, name: lang.PayBodyBName, title: lang.PayBodyBtitle, shortdes: lang.PayBodyBSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/exerciseimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/exerciseimgen.jpg') : require('../../../res/img/exerciseimg.jpg'), longdes: lang.PayBodyBLd },
        { id: 14, free: false, name: lang.PayACalName, title: lang.PayACaltitle, shortdes: lang.PayACalSd, img: lang.langName == "arabic" ? require('../../../res/img/ar/exerciseimgar.jpg') : lang.langName == "english" ? require('../../../res/img/en/exerciseimgen.jpg') : require('../../../res/img/exerciseimg.jpg'), longdes: lang.PayACalLd },
    ]

    const showMoreData = (item) => {
        setBuyModal(true)
        Animated.spring(translateY, {
            toValue: dimensions.WINDOW_HEIGTH < 800 ? moderateScale(-145) : moderateScale(-110),
            useNativeDriver: true
        }).start()
    }
    const showMoreData1 = (item) => {
        setShowModal(true)
        // setTimeout(() => {
        Animated.timing(translateY, {
            toValue: dimensions.WINDOW_HEIGTH < 800 ? moderateScale(-145) : moderateScale(-110),
            useNativeDriver: true,
            duration: 700,
            easing: Easing.out(Easing.exp)
        }).start()
        // }, 200);
        setSelectedFeature(item)

    }

    const onItemScroll = (item) => {
        const discountPercent = item[0].item.discountPercent ? item[0].item.discountPercent : 0

    }
    //-----------------CoffeBazar------------------\\
    // const payPressed = (item) => {
    //     console.error(item)
    //     var date = new Date()
    //     const payload = 'm' + date.getTime()
    //     bazaar.connect()
    //         .then((res) => {
    //             if (`${res}` === "Error: Bazaar is not installed") {
    //                 setSelectedPackage({
    //                     userId: user.id,
    //                     packageId: item.id,
    //                     packageName: item.name,
    //                     packagePrice: item.price,
    //                     isDiscountActive: false,
    //                     discountId: 0,
    //                     discountAmount: 0,
    //                     amount: item.price - ((item.price * item.discountPercent) / 100),
    //                     currency: item.currency,
    //                     description: item.description,
    //                     customerType: 1,
    //                     customerData: JSON.stringify({
    //                         utm_medium: props.route.params.utm_medium,
    //                         utm_campaign: props.route.params.utm_campaign,
    //                         utm_content: props.route.params.utm_content,
    //                         utm_source: props.route.params.utm_source,
    //                         tatoken: props.route.params.tatoken
    //                     })
    //                 })
    //                 addOrder()
    //             } else {
    //                 bazaar.purchaseProduct(`${item.id}`, payload, 1)
    //                     // bazaar.purchaseProduct(`38`, payload, 1)
    //                     .then(async (details) => {
    //                         var result = details
    //                         console.warn(result);
    //                         console.warn({ result });

    //                         const url = urls.baseUrl + 'api/v1/Order/AddOrderCafeBazar';
    //                         const params = {
    //                             userId: profile.userId,
    //                             price:
    //                                 item.price -
    //                                 (item.price * item.discountPercent) / 100,
    //                             packageId: item.id,
    //                             isSuccess: true,
    //                             bank: 4,
    //                             saleReferenceId: result.developerPayload,
    //                             language: lang.capitalName,
    //                         };

    //                         const header = {
    //                             headers: {
    //                                 Authorization: 'Bearer ' + auth.access_token,
    //                                 'Content-Type': 'application/json',
    //                                 Language: lang.capitalName,
    //                             },
    //                         };

    //                         // console.warn({ params });

    //                         if (
    //                             user.salePackages.findIndex(item => item === result.developerPayload) === -1
    //                         ) {
    //                             AsyncStorage.setItem(
    //                                 'salePackages',
    //                                 JSON.stringify([...user.salePackages, result.developerPayload]),
    //                             );
    //                             dispatch(setPackageSale([...user.salePackages, result.developerPayload]));
    //                             const RC = new RestController();
    //                             console.log('user', user);

    //                             RC.post(url, params, header, onPaymentSuccess, onPaymentFailure);
    //                         }
    //                     })
    //             }
    //         })
    // }

    const onPaymentSuccess = (response) => {
        console.error(response.data.data);
        props.navigation.navigate('PaymentResultScreen', {
            orderid: response.data.data,
        });
        bazaar.disconnect()
    };
    const onPaymentFailure = error => {
        console.warn("{ error }", error);
    };

    //------------------CoffeBazaar------------------\\
    const addOrder = () => {
        console.error(selectedPackage);
        if (user.countryId !== 128) {
            props.navigation.navigate("PaymentScreen", {
                package: {
                    id: selectedPackage.packageId,
                    name: selectedPackage.packageName,
                    price: selectedPackage.packagePrice,
                    amount: selectedPackage.amount,
                    currency: selectedPackage.currency
                }
            })
        } else {
            const url = urls.orderBaseUrl + urls.order + urls.addOrder
            const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
            const discountPercent = selectedPackage.discountPercent ? selectedPackage.discountPercent : 0

            var params = { ...selectedPackage }

            const RC = new RestController()
            RC.checkPrerequisites("post", url, params, header, addSuccess, addFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)

        }
    }
    const banksUrl = [
        urls.bankBaseUrl + "melatpayment",
        urls.bankBaseUrl + "samanpayment"
    ]

    const addSuccess = async (response) => {
        testOrder.current = response.data.data
        console.warn(testOrder)
        if (response.data.isSuccess) {
            if (selectedPackage.amount == 0) {
                setBuyModal(false)
                props.navigation.navigate('PaymentResultScreen', { orderid: response.data.data })
            }
            else {
                const index = Math.floor(Math.random() * 1.99)
                const url = banksUrl[index] + "?orderid=" + response.data.data
                console.log(url)
                Linking.openURL(
                    url
                ).then(() => {
                    setBuyModal(false)
                })

            }
        }

    }

    const addFailure = (err) => {
        console.error(err);
        setErrorContext(lang.serverError)
        setErrorVisible(true)
    }
    const checkDiscount = () => {
        console.warn(discountCode);
        const url = urls.orderBaseUrl + urls.order + urls.discountCheck + `?UserId=${user.id}&Code=${discountCode}&PackageId=${selectedPackage.packageId}`
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        var params = {}

        const RC = new RestController()
        RC.checkPrerequisites("post", url, params, header, checkSuccess, checkFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }

    const checkSuccess = (response) => {
        console.error(response.data.data);
        const discountPercent = selectedPackage.discountPercent ? selectedPackage.discountPercent : 0
        if (response.data.data.isActive) {
            setSelectedPackage({
                ...selectedPackage,
                "discountUser": response.data.data.discountUser,
                "discountId": response.data.data.discountId,
                "isDiscountActive": true,
                "amount": response.data.data.amount,
                "discountAmount": selectedPackage.currency == 0 ?
                    parseFloat(parseFloat(selectedPackage.packagePrice) - parseFloat(response.data.data.amount)).toFixed(3) :
                    parseInt(selectedPackage.packagePrice) - parseInt(response.data.data.amount)
            })
        }
        else {
            // setSelectedPackage({
            //     ...selectedPackage,
            //     discountId: null,
            //     discountUser: null,
            //     isDiscountActive: false,
            //     discountAmount: 0,
            //     amount: selectedPackage.price - ((selectedPackage.price * selectedPackage.discountPercent) / 100)
            // })
        }
    }

    const checkFailure = (err) => {
        setSelectedPackage({
            ...selectedPackage,
            discountId: 0,
            isDiscountActive: false
        })
        setErrorContext(lang.serverError)
        setErrorVisible(true)

    }

    const checkDisountCode = () => {
        Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true
        }).start()
        setShowDiscountModal(true)
    }
    const getDiscounts = () => {
        setGetDiscountLoading(true)
        const url = urls.orderBaseUrl + urls.discount + "?Page=1&PageSize=100&userId=" + user.id
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        var params = {}

        const RC = new RestController()
        RC.checkPrerequisites("get", url, params, header, getDiscountSuccess, getDiscountFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }

    const getDiscountSuccess = (response) => {
        console.error(response.data.data);
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

    const getDiscountFailure = () => {
        setGetDiscountLoading(false)
        setErrorContext(lang.serverError)
        setErrorVisible(true)
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
    const onDiscountSelected = (discount) => {
        setDiscountCode(discount.code)
        setDiscountListVisible(false)
    }
    const onPayPressed = (item) => {

        console.error(item.description)
        if (props.route.params) {
            setSelectedPackage({
                userId: user.id,
                packageId: item.id,
                packageName: item.name,
                packagePrice: item.price,
                isDiscountActive: false,
                discountId: 0,
                discountAmount: 0,
                amount: item.price - ((item.price * item.discountPercent) / 100),
                currency: item.currency,
                description: item.description,
                customerType: 1,
                customerData: JSON.stringify({
                    utm_medium: props.route.params.utm_medium,
                    utm_campaign: props.route.params.utm_campaign,
                    utm_content: props.route.params.utm_content,
                    utm_source: props.route.params.utm_source,
                    tatoken: props.route.params.tatoken
                })
            })
        } else {
            setSelectedPackage({
                userId: user.id,
                packageId: item.id,
                packageName: item.name,
                packagePrice: item.price,
                isDiscountActive: false,
                discountId: 0,
                discountAmount: 0,
                amount: item.price - ((item.price * item.discountPercent) / 100),
                currency: item.currency,
                description: item.description
            })
        }
        showMoreData()
    }

    return (
        <SafeAreaView>
            <Toolbar
                title={lang.iBuy}
                lang={lang}
                onBack={() => props.navigation.popToTop()}
            />
            {errorVisible || discountListVisible ? (
                <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView style={styles.absolute} blurType="dark" blurAmount={6} />
                    </View>
                </TouchableWithoutFeedback>
            ) : null}
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: defaultTheme.primaryColor }}>
                    <Image
                        source={require("../../../res/img/paymenttop.jpg")}
                        style={{ borderTopRightRadius: 30, borderTopLeftRadius: 30, width: "100%", height: moderateScale(150) }}
                    />
                </View>
                {/* <View style={{ flexDirection: "row", width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 0.5, borderRadius: 10, marginVertical: moderateScale(15), borderColor: defaultTheme.primaryColor }}>
                    <View style={{ borderColor: defaultTheme.primaryColor, flex: 1, justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: selectedPage == 1 ? defaultTheme.primaryColor : null }}>
                        <Text style={[styles.navigationText, { color: selectedPage == 1 ? "white" : defaultTheme.darkText, fontFamily: lang.titleFont }]}>{lang.calorieCounting}</Text>
                    </View>
                </View> */}
                {
                    packageEndDate < 0 ?
                        <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
                            <Text style={[styles.text, { fontFamily: lang.titleFont, color: defaultTheme.primaryColor }]} allowFontScaling={false}>
                                {
                                    Math.abs(parseInt(packageEndDate)) + 1
                                }
                            </Text>
                            {
                                " " + lang.yourAccountToDate1
                            }
                        </Text> : <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.primaryColor, paddingHorizontal: moderateScale(20), textAlign: "left" }]} allowFontScaling={false}>
                            {
                                lang.noSubscribe
                            }
                        </Text>
                }


                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(30), marginVertical: moderateScale(10), textAlign: "left" }}>{lang.chooseOneOfPackages}</Text>

                {packages.length <= 0 ? <ActivityIndicator style={{ height: moderateScale(200) }} size={"large"} color={defaultTheme.primaryColor} /> :
                    (
                        <DietCaloriePayment
                            title={lang.dietPlus}
                            data={packages.filter(item => item.packageType == 1)}
                            describes={dietDescribeData}
                            lang={lang}
                            selectedPackage={diet.packageType}
                            payPressed={(item) => onPayPressed(item)}
                            showFooter={true}
                            onItemScroll={onItemScroll}
                            onChangeText={(text) => setDiscountCode(text)}
                            checkDisountCode={checkDisountCode}
                            package={selectedPackage}
                        />
                    )
                }


                <View style={{ flexDirection: "row-reverse", justifyContent: "space-evenly", width: dimensions.WINDOW_WIDTH * 0.35, alignSelf: "flex-end", paddingBottom: moderateScale(10) }}>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText }}>{lang.premiumAc}</Text>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText }}>{lang.freeAc}</Text>
                </View>
                <View style={{ paddingBottom: moderateScale(50) }}>
                    {
                        pachagesData.map((item) => {
                            return (
                                <TouchableOpacity onPress={() => showMoreData1(item)} style={{ paddingBottom: 15, borderBottomWidth: 1, borderColor: defaultTheme.border, marginVertical: moderateScale(4) }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: dimensions.WINDOW_WIDTH, alignItems: "center", paddingHorizontal: moderateScale(25) }}>
                                        <View style={{ flexDirection: "row", width: dimensions.WINDOW_WIDTH * 0.55, justifyContent: "space-between", alignItems: "center" }}>

                                            <More
                                                width={moderateScale(17)}
                                            />
                                            <View style={{ width: "90%", alignItems: "center" }}>
                                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: "center" }}>
                                            {
                                                item.free ?

                                                    <Image
                                                        source={require("../../../res/img/done.png")}
                                                        style={{ width: moderateScale(17), height: moderateScale(17), tintColor: defaultTheme.green }}
                                                        resizeMode={"contain"}
                                                    />
                                                    : <Image
                                                        source={require("../../../res/img/lock.png")}
                                                        style={{ width: moderateScale(17), height: moderateScale(17) }}
                                                        resizeMode={"contain"}
                                                    />
                                            }
                                        </View>
                                        <View style={{}}>
                                            <Image
                                                source={require("../../../res/img/done.png")}
                                                style={{ width: moderateScale(17), height: moderateScale(17), tintColor: defaultTheme.green }}
                                            />
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            )

                        })
                    }
                </View>
            </ScrollView>
            {/* {
                selectedPackage.packageName == undefined ? <></> :
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                        style={styles.buttonGradient}>
                        <View style={{ height: moderateScale(60) }}>
                            <ConfirmButton
                                lang={lang}
                                style={styles.button}
                                title={`${lang.iBuy} ${selectedPackage.packageName.split(" | ")[0]}`}
                                onPress={addOrder}
                            />
                        </View>
                    </LinearGradient>
            } */}
            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />
            <Modal
                visible={showModal}
                contentContainerStyle={{ position: 'absolute', bottom: 0, alignSelf: 'center'}}
                onDismiss={() => {
                    Animated.timing(translateY, {
                        toValue: dimensions.WINDOW_HEIGTH,
                        useNativeDriver: true,
                        duration:1200,
                        easing:Easing.out(Easing.exp)

                    }).start()
                    // setTimeout(() => {
                        setShowModal(false)
                    // }, 100);

                }}

            >
                <Animated.View style={[{ transform: [{ translateY: translateY }] }, styles.AnimatedModal]}>
                    <TouchableOpacity onPress={() => {
                        Animated.timing(translateY, {
                            toValue: dimensions.WINDOW_HEIGTH,
                            useNativeDriver: true,
                            duration: 1200,
                            easing: Easing.out(Easing.exp)

                        }).start()
                        setTimeout(() => {
                            setShowModal(false)
                        }, 170);
                    }} style={{ padding: moderateScale(15), alignSelf: "flex-start" }}>
                        <Image
                            source={require("../../../res/img/cross.png")}
                            style={{ tintColor: defaultTheme.darkGray, width: moderateScale(20), height: moderateScale(20), alignSelf: "flex-start" }}
                        />
                    </TouchableOpacity>
                    <View style={{ padding: moderateScale(10), alignSelf: "flex-start", paddingHorizontal: moderateScale(15) }}>
                        <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, alignSelf: "flex-start", fontSize: moderateScale(15), textAlign: "left" }}>- {selectedFeature.title}</Text>
                        <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, alignSelf: "flex-start", textAlign: "left" }}>{selectedFeature.shortdes}</Text>
                    </View>
                    <Image
                        source={selectedFeature.img}
                        style={{ width: dimensions.WINDOW_WIDTH * 0.75, resizeMode: "contain", height: dimensions.WINDOW_HEIGTH * 0.30 }}
                    />
                    <Text style={{ color: defaultTheme.darkText, fontSize: moderateScale(14), fontFamily: lang.font, lineHeight: moderateScale(23), width: dimensions.WINDOW_WIDTH * 0.95, paddingHorizontal: dimensions.WINDOW_WIDTH * 0.05, paddingVertical: moderateScale(15), textAlign: "left" }}>{selectedFeature.longdes}</Text>

                    <View style={{ height: moderateScale(30) }} />

                </Animated.View>

            </Modal>
            <Modal
                visible={buyModal}
                contentContainerStyle={{ position: 'absolute', bottom: 0 }}
                onDismiss={() => {
                    setBuyModal(false)
                    setDiscountCode()
                }}
            >
                <Animated.View style={[{ transform: [{ translateY: translateY }] }, styles.AnimatedModal]}>
                    <Text style={{ fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(20), padding: moderateScale(20) }}>{selectedPackage.packageName}</Text>
                    <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15) }}>
                        <Text style={{ textDecorationLine: "line-through" }}>{selectedPackage.packagePrice} {selectedPackage.currency == 1 ? "تومان" : " € "}</Text> | {((selectedPackage.discountPercent && selectedPackage.discountPercent > 0) ? selectedPackage.amount - (selectedPackage.amount * selectedPackage.discountPercent / 100) : selectedPackage.amount)} {selectedPackage.currency == 1 ? "تومان" : " € "}
                    </Text>
                    <Text style={{ color: defaultTheme.green, fontSize: moderateScale(19), fontFamily: lang.titleFont }}>{selectedPackage.description} </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", width: dimensions.WINDOW_WIDTH * 0.95, alignSelf: 'center', justifyContent: "space-around", padding: moderateScale(15) }}>
                        <ConfirmButton
                            lang={lang}
                            title={lang.applyCode}
                            onPress={checkDiscount}
                            style={{ width: moderateScale(140) }}
                            textStyle={{ fontSize: moderateScale(18) }}
                        />
                        <TextInput
                            onChangeText={text => {
                                if (text != '' && /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(text)) {
                                    setDiscountCode(text);
                                } else if (text === '') {
                                    setDiscountCode('');
                                } else {
                                    Toast.show({
                                        type: "error",
                                        props: { text2: lang.typeEN },
                                        visibilityTime: 1800
                                    })
                                }
                            }}
                            style={{ fontFamily: lang.font, width: moderateScale(150), backgroundColor: defaultTheme.grayBackground, borderRadius: 10, textAlign: "center", fontSize: moderateScale(17), height: moderateScale(40) }}
                            placeholder={lang.discountCode}
                            value={discountCode}
                        />
                    </View>
                    {
                        getDiscountLoading ?
                            <View style={{ width: dimensions.WINDOW_WIDTH * 0.95, alignItems: "center" }}>
                                <ActivityIndicator
                                    size="large"
                                    color={defaultTheme.primaryColor}
                                    style={{ alignSelf: 'center', }}
                                />
                            </View>
                            :
                            <TouchableOpacity style={styles.discountTxt} onPress={onGetDiscountPressed} >
                                <Discount
                                    width={moderateScale(25)}
                                    height={moderateScale(25)}
                                    preserveAspectRatio="none"
                                />
                                <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.blue, marginStart: moderateScale(6), fontSize: moderateScale(16) }]} allowFontScaling={false}>
                                    {
                                        lang.viewDiscountList
                                    }
                                </Text>
                            </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', alignSelf: "center", justifyContent: "space-between", width: dimensions.WINDOW_WIDTH * 0.8, margin: moderateScale(5), borderTopColor: defaultTheme.border, borderTopWidth: 1, borderBottomColor: defaultTheme.border, borderBottomWidth: 1, padding: moderateScale(5) }}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.mainText }}>{lang.discount}</Text>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17) }}>{selectedPackage.discountAmount} {lang.toman}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: "center", justifyContent: "space-between", width: dimensions.WINDOW_WIDTH * 0.8, margin: moderateScale(15), borderTopColor: defaultTheme.border, borderTopWidth: 1, borderBottomColor: defaultTheme.border, borderBottomWidth: 1, padding: moderateScale(5) }}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(20), color: defaultTheme.green }}>{lang.payable}</Text>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(20), color: defaultTheme.darkText }}>{selectedPackage.amount} {lang.toman}</Text>
                    </View>
                    <ConfirmButton
                        lang={lang}
                        title={lang.iBuy}
                        onPress={addOrder}
                        style={{ backgroundColor: defaultTheme.green }}
                    />
                    <View style={{ height: moderateScale(50) }} />
                </Animated.View>
            </Modal>
            <DiscountsList
                visible={discountListVisible}
                discountsList={discountsList}
                onRequestClose={() => setDiscountListVisible(false)}
                lang={lang}
                onDiscountSelected={onDiscountSelected}
            />
            {
                resultModal &&
                <PackageResultModal
                    closePressed={() => {
                        props.navigation.popToTop()
                    }}
                    lang={lang}
                    trackingCode={trackingCode}
                />
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(17),
        color: defaultTheme.lightGray2,
    },
    text2: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    packages: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        alignSelf: "center",
        height: moderateScale(150),

    },
    buttonGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: moderateScale(50),
        paddingBottom: 50,
    },
    button: {
        backgroundColor: defaultTheme.green
    },
    navigationText: {
        fontSize: moderateScale(15),
        padding: moderateScale(6)
    },
    AnimatedModal: {
        backgroundColor: "white",
        top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        paddingBottom: moderateScale(15),
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
    discountTxt: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(10)
    },
});
export default PackagesScreen