import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  I18nManager,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ConfirmButton,
  Helper2,
  PageIndicator,
  Information,
  DropDown,
  TwoOptionModal,
} from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import { updateProfileLocaly, updateSpecification } from '../../redux/actions';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import PickerGoalWeight from '../../components/PickerGoalWeight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SliderWeight from '../../components/SliderWeight';
// import Orientation from 'react-native-orientation-locker';
import { CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';

const SetTargetScreen = (props) => {
  // Orientation.lockToPortrait()
  // console.warn(props.route.params);
  const lang = useSelector((state) => state.lang);
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  const auth = useSelector((state) => state.auth);
  const specification = useSelector((state) => state.specification);
  const height = React.useRef(profile.heightSize).current;
  // console.log('user => ', user);
  // console.log('specification => ', specification);
  const dropDownData = React.useRef([
    { id: 100, name: ' 100 ' + lang.perweek },
    { id: 200, name: ' 200 ' + lang.perweek },
    { id: 300, name: ' 300 ' + lang.perweek },
    { id: 400, name: ' 400 ' + lang.perweek },
    { id: 500, name: ' 500 ' + lang.perweek },
    { id: 600, name: ' 600 ' + lang.perweek },
    { id: 700, name: ' 700 ' + lang.perweek },
    { id: 800, name: ' 800 ' + lang.perweek },
    { id: 900, name: ' 900 ' + lang.perweek },
    { id: 1000, name: ' 1000 ' + lang.perweek },
  ]).current;
  const [helperVisible, setShowHelper] = React.useState(false);
  const [targetWeight, setTargetWeight] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [weightChangeRate, setWeightChangeRate] = React.useState(
    dropDownData[0],
  );
  const [optionalDialogVisible, setOptionalDialogVisible] =
    React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const distanceValues = [1, 200];
  const [sliderPosition, setSliderPosition] = useState();
  const [calculetedCalorie, setCalculetedCalorie] = useState();
  const dispatch = useDispatch();

  const onValuesChange = (value) => {
    setSliderPosition(value);
  };

  const onValuesRelease = (value) => {
    console.log({ value });
  };

  React.useEffect(() => {
    // console.log('height => ', height);
    let ideal = 80;
    // if (props.route.params.target === 0) {
    //   setTargetWeight(specification[0].weightSize.toString());
    // } else {
    if (profile.gender === 1) {
      //     //man
      //     if (height < 152) {
      //       setTargetWeight('56.2');
      //     } else {
      ideal = 56.2 + ((height - 152) / 2.54) * 1.41;
      //       // console.log('ideal => ', ideal);
      //       setTargetWeight(
      ideal > 99 ? ideal.toPrecision(4) : ideal.toPrecision(3);
      //       );
      //     }
    } else {
      //     if (height < 152) {
      //       setTargetWeight('53.1');
      //     } else {
      ideal = 53.1 + ((height - 152) / 2.54) * 1.36;
      //       // console.log('ideal 2=> ', ideal);
      //       setTargetWeight(
      ideal > 99 ? ideal.toPrecision(4) : ideal.toPrecision(3);
      //       );
      //     }
      //   }
    }
    if (props.route.params.target == 1) {
      setTargetWeight(specification[0].weightSize - 33);
    } else if (props.route.params.target == 0) {
      setTargetWeight(specification[0].weightSize);
    } else if (props.route.params.target == 2) {
      setTargetWeight(specification[0].weightSize - 35);
    }
  }, []);

  const calCalorie = (tw, WCR) => {

    const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
    const nowMoment = moment();
    const age = nowMoment.diff(birthdayMoment, 'years');
    const height = profile.heightSize;
    const weight = specification[0].weightSize;
    const wrist = specification[0].wristSize;
    const targetWeight = parseFloat(tw + 34);
    let bmr = 1;
    let factor = height / wrist;
    let bodyType = 1;
    let targetCalorie = 0;

    // console.log(age);
    // console.log(height);
    // console.log(weight);
    // console.log(wrist);
    if (profile.gender == 1) {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      if (factor > 10.4) bodyType = 1;
      else if (factor < 9.6) bodyType = 3;
      else bodyType = 2;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      if (factor > 11) bodyType = 1;
      else if (factor < 10.1) bodyType = 3;
      else bodyType = 2;
    }

    // console.log('profile.dailyActivityRate', profile.dailyActivityRate);
    switch (profile.dailyActivityRate) {
      case 10:
        targetCalorie = bmr * 1;
        break;
      case 20:
        targetCalorie = bmr * 1.2;
        break;
      case 30:
        targetCalorie = bmr * 1.375;
        break;
      case 40:
        targetCalorie = bmr * 1.465;
        break;
      case 50:
        targetCalorie = bmr * 1.55;
        break;
      case 60:
        targetCalorie = bmr * 1.725;
        break;
      case 70:
        targetCalorie = bmr * 1.9;
        break;
    }
    const targetCaloriPerDay = (7700 * WCR * 0.001) / 7;
    // checkForZigZagi
    if (weight > targetWeight) {

      if (user.countryId === 128) {
        if (moment().day() == 4) {
          targetCalorie *= 1.117;
        } else if (moment().day() == 5) {
          targetCalorie *= 1.116;
        } else {
          targetCalorie *= 0.97;
        }
      } else {
        if (moment().day() == 6) {
          targetCalorie *= 1.117;
        } else if (moment().day() == 0) {
          targetCalorie *= 1.116;
        } else {
          targetCalorie *= 0.97;
        }
      }
      targetCalorie -= targetCaloriPerDay;

      setCalculetedCalorie(targetCalorie.toFixed(0));

    }
    if (weight < targetWeight) {
      targetCalorie += targetCaloriPerDay;
      setCalculetedCalorie((targetCalorie + targetCaloriPerDay).toFixed(0));
    }
    if (weight == targetWeight) {
      setCalculetedCalorie(targetCalorie.toFixed(0));
    }

    return targetCalorie;
  };

  useEffect(() => {
    // console.warn(weightChangeRate.id);
    calCalorie(targetWeight, parseInt(weightChangeRate.id));
  }, [targetWeight, weightChangeRate.id]);

  const onNext = () => {
    if (!isNaN(parseInt(targetWeight))) {
      setProfile();
      // console.warn(targetWeight)
      // const calorie = calCalorie(targetWeight, parseInt(weightChangeRate.id));
      // setCalculetedCalorie(calCalorie(targetWeight, parseInt(weightChangeRate.id)))
      // if (calorie > 1000) {
      //   setProfile();
      // } else if (calorie < 1000) {
      //   setErrorContext(lang.lowCalerieDanger2);
      //   setErrorVisible(true);
      // }
      // else if (calorie < 1200) {
      //   setOptionalDialogVisible(true);
      // }
    }
    // else {
    //   setErrorContext(lang.fillAllFild);
    //   setErrorVisible(true);
    // }
  };


  const setProfile = () => {
    setIsLoading(true);
    if (props.route.params.target == 0) {
      dispatch(
        updateProfileLocaly({
          // targetStep: targetStep,
          targetWeight: specification[0].weightSize,
          weightChangeRate: weightChangeRate.id,
        }),
      );
    } else {
      dispatch(
        updateProfileLocaly({
          // targetStep: targetStep,
          targetWeight: (parseInt(targetWeight) + 34),
          weightChangeRate: weightChangeRate.id,
        }),
      );
    }

    setIsLoading(false);
    // const url = urls.userBaseUrl + urls.userProfiles + urls.register;
    // const params = {
    //   ...profile,
    //   userId: user.id,
    //   // targetStep: targetStep,
    //   targetWeight: targetWeight,
    //   weightChangeRate: weightChangeRate.id,
    //   insertDate: moment().format('YYYY-MM-DD'),
    // };
    // analytics().logEvent('user_target', {
    //   userId: user.id,
    //   gender: profile.gender,
    //   // targetStep: targetStep,
    //   targetWeight: targetWeight,
    //   weightChangeRate: weightChangeRate.id,
    //   currentWeight: specification[0].weightSize,
    // });
    // const header = {};
    // // console.log('params => ', params);
    // const RC = new RestController();
    // RC.post(url, params, header, onSetProfileSuccess, onSetProfileFailure);
    props.navigation.navigate('UserDataAcceptionScreen');
  };

  // const onSetProfileSuccess = response => {
  //   dispatch(
  //     updateProfileLocaly({
  //       ...response.data.data,
  //       targetNutrient: response.data.data.targetNutrient.split(','),
  //     }),
  //   );
  //   if (app.networkConnectivity) {
  //     dispatch(
  //       updateSpecification(
  //         {
  //           ...specification[0],
  //           userProfileId: response.data.data.id,
  //           insertDate: moment().format('YYYY-MM-DD'),
  //         },
  //         auth,
  //         app,
  //         user,
  //       ),
  //     );
  //   }

  //   setIsLoading(false);
  //   AsyncStorage.setItem('welcomeRoute', 'false')
  //   // props.navigation.navigate('Tabs')
  //   props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Tabs' }] }))

  // };

  // const onSetProfileFailure = error => {
  //   setErrorContext(lang.serverError);
  //   setErrorVisible(true);
  //   setIsLoading(false);
  // };

  const onBack = () => {
    props.navigation.goBack();
  };

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        {errorVisible ? (
          <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
            <View style={styles.wrapper}>
              <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}

        {/* <ScrollView contentContainerStyle={styles.container}> */}
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { fontFamily: lang.titleFont }]}
            allowFontScaling={false}>
            {lang.yourGolWeight}
          </Text>
        </View>


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: moderateScale(20) }}>
          <PickerGoalWeight
            {...{
              lang,
              target: props.route.params.target,
              setTargetWeight,
              targetWeight,
              setWeightChangeRate,
              stableWeight: specification[0].weightSize,
              text1: props.route.params.text,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: moderateScale(15),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScale(15),
              padding: moderateScale(3), borderColor: defaultTheme.darkGray, borderWidth: 0.9, borderRadius: 15,
              paddingHorizontal: moderateScale(10)
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontFamily: lang.font,
                  color: 'black',
                  fontSize: moderateScale(17),
                }}>
                {' '}{lang.targetCalorieForDay}{' '}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: lang.titleFont,
                  color:
                    weightChangeRate.id === 1000 || weightChangeRate.id == 900
                      ? '#ab0000'
                      : weightChangeRate.id === 800 || weightChangeRate.id == 700
                        ? 'red'
                        : weightChangeRate.id === 600 ||
                          weightChangeRate.id == 500 ||
                          weightChangeRate.id == 400
                          ? defaultTheme.gold
                          : weightChangeRate.id < 400
                            ? defaultTheme.green
                            : null,
                  fontSize: moderateScale(30),
                }}>
                {calculetedCalorie}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: lang.langName == 'persian' ? 'row-reverse' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <Image
              source={
                weightChangeRate.id === 1000 || weightChangeRate.id == 900
                  ? require('../../../res/img/poker-face.png')
                  : weightChangeRate.id === 800 || weightChangeRate.id == 700
                    ? require('../../../res/img/sad.png')
                    : weightChangeRate.id === 600 ||
                      weightChangeRate.id == 500 ||
                      weightChangeRate.id == 400
                      ? require('../../../res/img/happiness.png')
                      : weightChangeRate.id < 400
                        ? require('../../../res/img/happy.png')
                        : null
              }
              style={{
                width: moderateScale(25),
                height: moderateScale(25),
                tintColor:
                  weightChangeRate.id === 1000 || weightChangeRate.id == 900
                    ? '#ab0000'
                    : weightChangeRate.id === 800 || weightChangeRate.id == 700
                      ? 'red'
                      : weightChangeRate.id === 600 ||
                        weightChangeRate.id == 500 ||
                        weightChangeRate.id == 400
                        ? defaultTheme.gold
                        : weightChangeRate.id < 400
                          ? defaultTheme.green
                          : null,
              }}
            />
            <Text
              style={{
                fontFamily: lang.font,
                fontSize: moderateScale(19),
                textAlign: 'center',
                lineHeight: moderateScale(28),
                color:
                  weightChangeRate.id === 1000 || weightChangeRate.id == 900
                    ? '#ab0000'
                    : weightChangeRate.id === 800 || weightChangeRate.id == 700
                      ? 'red'
                      : weightChangeRate.id === 600 ||
                        weightChangeRate.id == 500 ||
                        weightChangeRate.id == 400
                        ? defaultTheme.gold
                        : weightChangeRate.id < 400
                          ? defaultTheme.green
                          : null,
                marginHorizontal: moderateScale(5),
              }}>
              {weightChangeRate.id === 1000 || weightChangeRate.id == 900
                ? lang.soHard
                : weightChangeRate.id === 800 || weightChangeRate.id == 700
                  ? lang.hard
                  : weightChangeRate.id === 600 ||
                    weightChangeRate.id == 500 ||
                    weightChangeRate.id == 400
                    ? lang.medium
                    : weightChangeRate.id < 400
                      ? lang.easy
                      : null}
            </Text>
            <Text
              style={{
                fontFamily: lang.font,
                fontSize: moderateScale(19),
                textAlign: 'center',
                lineHeight: moderateScale(28),
                color: 'black',
                marginHorizontal: moderateScale(5),
              }}>
              {lang.hardshipLevel}
            </Text>
          </View>
          {calculetedCalorie < 1000 &&
            (
              <Text
                style={{
                  fontFamily: lang.font,
                  fontSize: moderateScale(17),
                  textAlign: 'center',
                  lineHeight: moderateScale(28),
                  color: '#ab0000',
                }}
              >
                {lang.welcomeCalorieAlert}
              </Text>
            )}

          <View style={{ marginTop: moderateScale(0) }}>
            <SliderWeight {...{ profile }} />
          </View>
          {/* <View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center" }}>
          <LottieView
            style={{ width: dimensions.WINDOW_WIDTH * 0.3 }}
            source={require('../../../res/animations/winner.json')}
            autoPlay
            loop={false}
          />
        </View> */}
        </View>

        <Helper2
          visible={helperVisible}
          onRequestClose={() => setShowHelper(false)}
          onNext={onNext}
          lang={lang}
          specification={specification}
          targetWeight={targetWeight}
          isLoading={isLoading}
        />
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
        />
        <TwoOptionModal
          lang={lang}
          visible={optionalDialogVisible}
          onRequestClose={() => setOptionalDialogVisible(false)}
          context={lang.lowCalerieDanger}
          button1={lang.continuation}
          button2={lang.motevajeShodam}
          button1Pressed={() => {
            setOptionalDialogVisible(false);
            setProfile();
          }}
          button2Pressed={() => setOptionalDialogVisible(false)}
        />

        {/* </ScrollView> */}
        {/* <View style={styles.bottomContainer}>
        </View> */}
          <View style={{height:moderateScale(80)}}/>
      </ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color={defaultTheme.primaryColor} />
      ) : (
        <View style={{ position: "absolute", bottom: moderateScale(20) }}>
          

          <View style={styles.buttonContainer}>
            <ConfirmButton
              title={lang.perBtn}
              style={styles.confirmButton}
              lang={lang}
              onPress={onBack}
              leftImage={require('../../../res/img/back.png')}
              rotate
            />
            <ConfirmButton
              title={lang.continuation}
              style={styles.confirmButton}
              lang={lang}
              onPress={onNext}
              rightImage={require('../../../res/img/next.png')}
              rotate
            />
            
          </View>
          <View style={{width:dimensions.WINDOW_WIDTH,alignItems:"center"}}> 

          <PageIndicator pages={new Array(6).fill(1)} activeIndex={5} />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: moderateScale(10),
    marginBottom: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // marginTop : moderateScale(30)
  },
  title: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(19),
  },
  text: {
    fontSize: moderateScale(16),
    color: defaultTheme.gray,
    marginHorizontal: moderateScale(17),
    maxWidth: dimensions.WINDOW_WIDTH * 0.52,
  },
  gradient: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH * 0.5,
    height: moderateScale(45),
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: defaultTheme.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: 0,
  },
  confirmButton: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
  },
  rowContainer: {
    width: dimensions.WINDOW_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(30),
  },
  subRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  subView: {
    width: moderateScale(60),
  },
  dropDownContainer: {
    width: moderateScale(60),
    height: moderateScale(45),
    backgroundColor: defaultTheme.lightGray,
    margin: 3,
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

export default SetTargetScreen;
