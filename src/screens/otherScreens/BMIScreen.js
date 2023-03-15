import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, I18nManager, ScrollView, Easing, Animated,Image } from 'react-native';
import { ConfirmButton, Information, PageIndicator } from '../../components';
import { useSelector } from 'react-redux';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import Bmi from '../../../res/img/bmi.svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
// import Orientation from 'react-native-orientation-locker';
// import RNSpeedometer from 'react-native-speedometer'
import { Gauge } from '@wz-mobile/rn-gauge';

const BMIScreen = props => {
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const Needle = ({ getNeedleStyle }) => (
    <AnimatedImage
      style={[getNeedleStyle(300 / 3, 300 / 3)]}
      source={require("../../../res/img/needle.png")}
      resizeMode={"contain"}
    />
  );
  try {
    I18nManager.allowRTL(false)
    I18nManager.forceRTL(false)
    I18nManager.swapLeftAndRightInRTL(false);

  } catch (e) {
    console.error(e)
  }
  // Orientation.lockToPortrait()
  const lang = useSelector(state => state.lang);
  const profile = useSelector(state => state.profile);
  const specification = useSelector(state => state.specification);
  // console.log({lang})
  // console.log("specification",specification)
  const height = React.useRef(parseFloat(profile.heightSize)).current;
  const weight = React.useRef(parseFloat(specification[0].weightSize)).current;
  console.warn(specification[0], "profile", profile.heightSize);
  const [BMI, setBMI] = React.useState(20);
  const [max, setMax] = React.useState(20);
  const [min, setMin] = React.useState(20);
  const [ideal, setIdeal] = React.useState(20);
  const [tx, setTx] = React.useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorContext, setErrorContext] = useState();
  // const LottieArray = [
  //   require('../../../res/animations/chagh-khatar.json'),
  //   require('../../../res/animations/chagh.json'),
  //   require('../../../res/animations/ezafevazn.json'),
  //   require('../../../res/animations/normal.json'),
  //   require('../../../res/animations/kamboodvazn.json'),
  // ];


  React.useEffect(() => {
    setBMI((weight / Math.pow(height / 100, 2)).toFixed(1));
    setMax((Math.pow(height / 100, 2) * 25.0).toFixed(1));
    setMin((Math.pow(height / 100, 2) * 18.5).toFixed(1));

    if (profile.gender == 1) {
      //man
      if (height < 152) {
        setIdeal('56.2');
      } else {
        // setIdeal((56.2 + (((height - 152)/2.54)*1.41)).toFixed(1))
        setIdeal((56.2 + ((height - 152) / 2.54) * 1.61).toFixed(1));
      }
    } else {
      if (height < 152) {
        setIdeal('53.1');
      } else {
        // setIdeal((53.1 + (((height - 152)/2.54)*1.36)).toFixed(1))
        setIdeal((53.1 + ((height - 152) / 2.54) * 1.46).toFixed(1));
      }
    }

    const perSlotWidth = (dimensions.WINDOW_WIDTH * 0.55) / 4;

    if (BMI > 16 && BMI < 40) {
      if (BMI >= 16 && BMI <= 18.5) {
        setTx(((BMI - 16) / 2.5) * perSlotWidth);
      } else if (BMI > 18.5 && BMI <= 25) {
        setTx(((BMI - 18.5) / 6.5) * perSlotWidth + perSlotWidth);
      } else if (BMI > 25 && BMI <= 30) {
        setTx(((BMI - 25) / 5) * perSlotWidth + 2 * perSlotWidth);
      } else if (BMI > 30 && BMI <= 40) {
        setTx(((BMI - 30) / 10) * perSlotWidth + 3 * perSlotWidth);
      }
    } else if (BMI > 40) {
      setTx(dimensions.WINDOW_WIDTH * 0.55);
      setErrorContext(lang.wrongPersonalDetails)
    } else {
      setTx(0);
    }
  }, []);

  const onNext = () => {
    props.navigation.navigate('DailyActivitiesScreen');
  };

  const onBack = () => {
    props.navigation.goBack();
  };

  // const getSuitableLottie = () => {
  //   const BMICheck = parseFloat(BMI);
  //   if (BMICheck < 18.5) {
  //     return LottieArray[4];
  //   } else if (BMICheck > 18.5 && BMICheck <= 25) {
  //     return LottieArray[3];
  //   } else if (BMICheck > 25 && BMICheck <= 30) {
  //     return LottieArray[2];
  //   } else if (BMICheck > 30 && BMICheck <= 35) {
  //     return LottieArray[1];
  //   } else if (BMICheck > 35) {
  //     return LottieArray[0];
  //   }
  // };

  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { fontFamily: lang.titleFont, color: defaultTheme.darkText }]}
            allowFontScaling={false}>
            {lang.ifWantTapNextBotton}
          </Text>
        </View>
        <Gauge
          emptyColor={defaultTheme.grayBackground}
          colors={['#96031c', '#96031c',"yellow", defaultTheme.green,defaultTheme.error,  defaultTheme.error, defaultTheme.error]}
          sweepAngle={300}
          strokeWidth={0}
          fillProgress={BMI * 2 >= 50 ? (BMI - 0.2) * 2 : BMI * 2}
          size={dimensions.WINDOW_WIDTH * 0.6}
          thickness={20}
          steps={[0, 20, 34, 50, 66, 80, 100]}
          renderStep={({
            step,
            angle,
            getX,
            getY,
            radius,
          }) => (
            <>
              <View
                style={[
                  {
                    width: 4,
                    marginLeft: -2,
                    height: 20,
                    borderRadius: 2,
                    position: 'absolute',
                    left: getX(0, radius + 50),
                    top: getY(10, radius + 50),
                    backgroundColor: defaultTheme.lightGray,
                    transform: [{ rotateZ: `${angle}deg` }],
                  },
                ]}
              />
              <Text
                style={[
                  {
                    position: 'absolute',
                    left: getX(-10, radius + 75),
                    top: getY(10, radius + 75),
                    color: 'rgba(0,0,0,1)',
                    transform: [{ rotateZ: `${angle}deg` }],
                  },
                ]}
              >{`${step}` / 2}</Text>
            </>
          )}
          springConfig={{
            velocity: 1.5,
            mass: 25,
            stiffness: 800,
            damping: 300,
          }}
          renderNeedle={Needle}
        />
        {/* <LottieView
          style={{ width: dimensions.WINDOW_WIDTH * 0.8 }}
          source={getSuitableLottie()}
          autoPlay
          loop={false}
          speed={0.7}
        /> */}
        {/* <RNSpeedometer
          value={BMI}
          minValue={16}
          maxValue={40}
          size={moderateScale(290)}
          defaultValue={16}
          labels={
            [
              {
                activeBarColor: '#ff2900',
              },
             
              {
                activeBarColor: "#52e309",
              },
              {
                activeBarColor: '#fad902',
              },
              {
                activeBarColor: '#c20424',
              },
              {
                activeBarColor: '#96031c',
              },
             
            ]
          }
          easeDuration={300}
          imageStyle={{tintColor:defaultTheme.darkText}}
          labelStyle={{color:"white"}}
          innerCircleStyle={{backgroundColor:"white",top:moderateScale(1)}}
        /> */}
        <View style={styles.content}>
          <View style={styles.informationContainer}>
            <Text
              style={[styles.bmi, { fontFamily: lang.font }]}
              allowFontScaling={false}>
              BMI ={' '}
              <Text
                style={[styles.bmiValue, { fontFamily: lang.titleFont }]}
                allowFontScaling={false}>
                {BMI}
              </Text>
            </Text>
            <Text
              style={[
                styles.text,
                { fontFamily: lang.titleFont, fontSize: moderateScale(18) },
              ]}
              allowFontScaling={false}>
              {BMI <= 16
                ? lang.DangerousThinness
                : BMI > 16 && BMI <= 17
                  ? lang.worryingThinness
                  : BMI > 17 && BMI <= 18.5
                    ? lang.thinPerson
                    : BMI > 18.5 && BMI <= 25
                      ? lang.normalProportionalStatus
                      : BMI > 25 && BMI <= 30
                        ? lang.havingOverweight
                        : BMI > 30 && BMI <= 35
                          ? lang.havingVeryOverweight
                          : BMI > 35 && BMI <= 40
                            ? lang.worryingOverweight
                            : lang.dangerouslyOverweight}
            </Text>
            <Text
              style={[
                {
                  fontFamily: lang.titleFont,
                  color: defaultTheme.green,
                  fontSize: moderateScale(22),
                  marginTop: 20,
                },
              ]}>
              {lang.fitWeight} = {ideal + ' ' + lang.kg}
            </Text>
            <Text style={[styles.text, { fontFamily: lang.font }]}>
              {weight - ideal > 0
                ? lang.yourWeightOver.replace(
                  '[]',
                  parseFloat(parseInt((weight - ideal) * 10) / 10),
                )
                : weight - ideal < 0
                  ? lang.yourWeightLow.replace(
                    '[]',
                    parseFloat(parseInt((ideal - weight) * 10) / 10),
                  )
                  : props.yourWeightNormal}
            </Text>
            {/* <Text style={[styles.text, {fontFamily: lang.font}]}>
              {lang.the_minimumWeight} = {min + ' ' + lang.kg}
            </Text>
            <Text style={[styles.text, {fontFamily: lang.font}]}>
              {lang.the_maximumWeight} = {max + ' ' + lang.kg}
            </Text> */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <ConfirmButton
            title={lang.perBtn}
            style={styles.confirmButton}
            lang={lang}
            onPress={onBack}
            leftImage={require('../../../res/img/back.png')}
            rotate
            textStyle={{ marginHorizontal: moderateScale(10) }}
          />
          <ConfirmButton
            title={lang.continuation}
            style={styles.confirmButton}
            lang={lang}
            onPress={onNext}
            rightImage={require('../../../res/img/next.png')}
            rotate
            textStyle={{ marginHorizontal: moderateScale(0) }}
          />
        </View>
        <PageIndicator pages={new Array(6).fill(1)} activeIndex={2} />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  titleContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(30),
    marginBottom: moderateScale(55),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    // width: dimensions.WINDOW_WIDTH,
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    // paddingHorizontal: 10,
    marginTop: moderateScale(20),
  },
  informationContainer: {
    width: dimensions.WINDOW_WIDTH * 0.55,
    alignItems: 'center',
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: moderateScale(75),
    marginTop: moderateScale(30),
    marginBottom: moderateScale(10),
    // backgroundColor : 'red',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    color: defaultTheme.gray,
    fontSize: moderateScale(19),
    alignSelf: 'center',
    textAlign: 'center',
    width: '85%',
  },
  text: {
    color: defaultTheme.gray,
    fontSize: moderateScale(16),
    marginTop: moderateScale(5),
    textAlign: 'center',
    lineHeight: moderateScale(26),
    width: dimensions.WINDOW_WIDTH
  },
  text2: {
    color: defaultTheme.gray,
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
    textAlign: 'center',
    color: defaultTheme.darkText,
    lineHeight: moderateScale(26),
    width: '25%',
  },
  genderContainer: {
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: defaultTheme.green,
  },
  confirmButton: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
  },
  bmi: {
    fontSize: moderateScale(31),
    color: defaultTheme.gray,
    marginTop: moderateScale(25),
  },
  bmiValue: {
    fontSize: moderateScale(26),
    color: defaultTheme.primaryColor,
  },
  lottie: {
    width: dimensions.WINDOW_WIDTH,
    height: 100,
    backgroundColor: 'red',
  },
});

export default BMIScreen;
