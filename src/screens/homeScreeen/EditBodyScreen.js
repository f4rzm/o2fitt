import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { Toolbar, BodyInput, ConfirmButton, Information } from '../../components';
import { moderateScale } from 'react-native-size-matters';
import { updateSpecification } from "../../redux/actions"
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-toast-message'
import Info from '../../../res/img/info5.svg'

const EditBodyScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const auth = useSelector(state => state.auth)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const profile = useSelector(state => state.profile)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [bottomMargin, setBottomMargin] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  console.log("specification", specification)
  const dispatch = useDispatch()
  const [body, setBody] = React.useState({ ...specification[0] })

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    // cleanup function

  }, [])

  const keyboardDidShow = (e) => {
    console.log(e)
    // setBottomMargin(e.endCoordinates.height - moderateScale(90))
  }

  const keyboardDidHide = (e) => {
    setBottomMargin(0)
  }

  const updateNeckSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, neckSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateBustSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, bustSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateWaistSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, waistSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateHipSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, hipSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateWristSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, wristSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateShoulderSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, shoulderSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }
  
  const updateArmSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, armSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateHighHipSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, highHipSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const updateThighSize = (value) => {
    (/^[0-9\.]+$/i.test(value) || value == '' || value == '.') ?
    setBody({ ...body, thighSize: value })

      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  }

  const onConfirm = () => {
    if (!isNaN(parseFloat(body.neckSize)) && !isNaN(parseFloat(body.bustSize)) && !isNaN(parseFloat(body.waistSize)) &&
      !isNaN(parseFloat(body.hipSize)) && !isNaN(parseFloat(body.wristSize)) && !isNaN(parseFloat(body.shoulderSize)) &&
      !isNaN(parseFloat(body.armSize)) && !isNaN(parseFloat(body.highHipSize)) && !isNaN(parseFloat(body.thighSize))) {
      let bfp = null

      const neck = parseFloat(body.neckSize)
      const height = parseFloat(profile.heightSize)
      const hip = parseFloat(body.hipSize)
      const waist = parseFloat(body.waistSize)

      if (profile.gender == 1) {
        bfp = (495 / ((1.0324 - 0.19077 * Math.log10(waist - neck) + Math.log10(height) * 0.15456)) - 450);
      }
      else {
        bfp = (495 / ((1.29579 - 0.35004 * Math.log10(hip + waist - neck) + Math.log10(height) * 0.22100)) - 450);
      }
      console.error(bfp);
      if (10 < body.wristSize && body.wristSize < 30 && bfp < 70 && neck > 25) {
        if (!profile.gender === 1) {
          if (bfp > 2) {

            if (body.bustSize - body.hipSize >= 3.6 * 2.54 && body.bustSize - body.waistSize < 9 * 2.54) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (body.hipSize - body.bustSize >= 3.6 * 2.54 && body.hipSize - body.waistSize < 9 * 2.54) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (
              body.hipSize - body.bustSize < 3.6 * 2.54 &&
              body.bustSize - body.hipSize < 3.6 * 2.54 &&
              body.bustSize - body.waistSize < 9 * 2.54 &&
              body.hipSize - body.waistSize < 10 * 2.54
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else {
              Toast.show({
                type: "error",
                props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } },
                visibilityTime:800
              })
            }
          } else {
            Toast.show({
              type: "error",
              props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } },
              visibilityTime:800
            })
          }
        } else {
          if (bfp > 10) {

            if (
              (body.bustSize - hip <= 1 * 2.54 &&
                hip - body.bustSize < 3.6 * 2.54 &&
                body.bustSize - waist >= 9 * 2.54) ||
              hip - waist >= 10 * 2.54
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (
              body.hipSize - body.bustSize >= 3.6 * 2.54 &&
              body.hipSize - body.bustSize < 10 * 2.54 &&
              body.hipSize - body.waistSize >= 9 * 2.54 &&
              body.highHipSize / body.waistSize < 1.193
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (
              body.bustSize - body.hipSize > 1 * 2.54 &&
              body.bustSize - body.hipSize < 10 * 2.54 &&
              body.bustSize - body.waistSize >= 9 * 2.54
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (
              body.hipSize - body.bustSize > 2 * 2.54 &&
              body.hipSize - body.waistSize >= 7 * 2.54 &&
              body.highHipSize / body.waistSize >= 1.193
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (body.hipSize - body.bustSize >= 3.6 * 2.54 && body.hipSize - body.waistSize < 9 * 2.54) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (body.bustSize - body.hipSize >= 3.6 * 2.54 && body.bustSize - body.waistSize < 9 * 2.54) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else if (
              body.hipSize - body.bustSize < 3.6 * 2.54 &&
              body.bustSize - body.hipSize < 3.6 * 2.54 &&
              body.bustSize - body.waistSize < 9 * 2.54 &&
              body.hipSize - body.waistSize < 10 * 2.54
            ) {
              setIsLoading(true)
              dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
            } else {
              Toast.show({
                type: "error",
                props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } },
                visibilityTime:800
              })
            }
          } else {
            Toast.show({
              type: "error",
              props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } },
              visibilityTime:800
            })
          }
        }
      } else {
        console.error("s");
        Toast.show({
          type: "error",
          props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } },
          visibilityTime:800
        })
      }
      // if (bfp > 0) {
      //   setIsLoading(true)
      //   dispatch(updateSpecification(body, auth, app, user, upateSuccesfull, upateFailure))
      // }
      // else {
      // setErrorContext(lang.completInfoForBidyTitle)
      //   setErrorVisible(true)
      //   Toast.show({
      //     type: "error",
      //     props: { text2: lang.completInfoForBidyTitle, style: { fontFamily: lang.font } }
      //   })
      // }
    }
    else {
      // setErrorContext(lang.fillAllFild)
      // setErrorVisible(true)
      Toast.show({
        type: "error",
        props: { text2: lang.fillAllFild, style: { fontFamily: lang.font } },
        visibilityTime:800
      })
    }
  }

  const upateSuccesfull = () => {
    setIsLoading(false)
    props.navigation.replace("BodyShapeScreen")
    analytics().logEvent('setBodySize')
  }

  const upateFailure = () => {
    setIsLoading(false)
    props.navigation.replace("BodyShapeScreen")
    // setErrorContext(lang.serverError)
    // setErrorVisible(true)
    // Toast.show({
    //   type: "error",
    //   props: { text2: lang.serverError, style: { fontFamily: lang.font } },
    //   visibilityTime:800
    // })
  }
  const stickyHeader = () => {
    return (
      <View style={{ height: moderateScale(50) }}>
        <View style={{ width: dimensions.WINDOW_WIDTH, backgroundColor: defaultTheme.grayBackground, paddingVertical: moderateScale(15), alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
          <Info

          />
          <Text style={{ fontFamily: lang.font, color: defaultTheme.darkText, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>{lang.plsInsertCarefuly}</Text>
        </View>
      </View>
    )
  }

  return (
    <>

      <Toolbar
        lang={lang}
        title={lang.bodymeasurementtitle}
        onBack={() => props.navigation.goBack()}
      />
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS=="ios" ?moderateScale(60):moderateScale(-190)}>
        <SafeAreaView style={{flex:1}}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: "center", paddingBottom: moderateScale(66)
          }}
          stickyHeaderIndices={[0]}
        >

          {
            stickyHeader()
          }
          <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("BodyHelpScreen")}>
            <View style={styles.helpContainer}>
              <Image
                source={require("../../../res/img/info2.png")}
                style={{ width: moderateScale(22), height: moderateScale(22), marginHorizontal: moderateScale(10) }}
                resizeMode="contain"
              />
              <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.mainText }]} allowFontScaling={false}>
                {
                  lang.TapForGetMorInformationAboutYourBody
                }
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <BodyInput
                lang={lang}
                title={lang.sizeOfGardan}
                autoFocus={true}
                number={1}
                desc={lang.sizeOfGardanDescription}
                value={(isNaN(parseInt(body.neckSize)) || parseInt(body.neckSize) === 0) ? "" : body.neckSize.toString()}
                onChangeText={updateNeckSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfShane}
                number={2}
                desc={lang.sizeOfShaneDescription}
                value={(isNaN(parseInt(body.shoulderSize)) || parseInt(body.shoulderSize) === 0) ? "" : body.shoulderSize.toString()}
                onChangeText={updateShoulderSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfSine}
                number={3}
                desc={lang.sizeOfSineDescription}
                value={(isNaN(parseInt(body.bustSize)) || parseInt(body.bustSize) === 0) ? "" : body.bustSize.toString()}
                onChangeText={updateBustSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfBazoo}
                number={4}
                desc={lang.sizeOfBazooDescription}
                value={(isNaN(parseInt(body.armSize)) || parseInt(body.armSize) === 0) ? "" : body.armSize.toString()}
                onChangeText={updateArmSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfKamar}
                number={5}
                desc={lang.sizeOfKamarDescription}
                value={(isNaN(parseInt(body.waistSize)) || parseInt(body.waistSize) === 0) ? "" : body.waistSize.toString()}
                onChangeText={updateWaistSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfShekam}
                number={6}
                desc={lang.sizeOfShekamDescription}
                value={(isNaN(parseInt(body.highHipSize)) || parseInt(body.highHipSize) === 0) ? "" : body.highHipSize.toString()}
                onChangeText={updateHighHipSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfBasan}
                number={7}
                desc={lang.sizeOfBasanDescription}
                value={(isNaN(parseInt(body.hipSize)) || parseInt(body.hipSize) === 0) ? "" : body.hipSize.toString()}
                onChangeText={updateHipSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfRan}
                number={8}
                desc={lang.sizeOfRanDescription}
                value={(isNaN(parseInt(body.thighSize)) || parseInt(body.thighSize) === 0) ? "" : body.thighSize.toString()}
                onChangeText={updateThighSize}
              />
              <BodyInput
                lang={lang}
                title={lang.sizeOfMoche}
                number={9}
                desc={lang.sizeOfMocheDescription}
                value={(isNaN(parseInt(body.wristSize)) || parseInt(body.wristSize) === 0) ? "" : body.wristSize.toString()}
                onChangeText={updateWristSize}
              />
            </View>
          </View>
        </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.saved}
          onPress={onConfirm}
          leftImage={require("../../../res/img/done.png")}
          isLoading={isLoading}
        />
      </LinearGradient>
      {/* <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      /> */}

    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gold",
  },
  helpContainer: {
    flexDirection: "row",
    width: dimensions.WINDOW_WIDTH * 0.94,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: moderateScale(5),
    margin: moderateScale(8),
    marginTop: moderateScale(15),
    borderWidth: 1.3,
    borderRadius: moderateScale(12),
    borderColor: defaultTheme.border
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(15),
    color: defaultTheme.gray
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.5,
    height: moderateScale(50),
    backgroundColor: defaultTheme.green,
    alignSelf: "center",
    marginBottom: moderateScale(16)
  }
});

export default EditBodyScreen;
