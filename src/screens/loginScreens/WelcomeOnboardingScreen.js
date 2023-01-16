
import React from 'react';
import {
  StyleSheet,
  Animated ,
} from 'react-native';
import { WelcomeSlider } from '../../components';
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const WelcomeOnboardingScreen = props => {

  const lang = useSelector(state=>state.lang)
  let opacity = React.useRef(new Animated.Value(1)).current

  const items = React.useRef([
        {
            logo : require("../../../res/animations/welcome.json"),
            title : lang.onboardingTitle1,
            context : lang.welcomeonboarding,
            width : dimensions.WINDOW_WIDTH * 0.7,
            loop : false
        }, {
            logo : require("../../../res/animations/calorie.json"),
            title : lang.onboardingTitle2,
            context : lang.calorieonboarding,
            width : dimensions.WINDOW_WIDTH * 0.7,
            loop : false
        }, {
            logo : require("../../../res/animations/charkh.json"),
            title : lang.dailyActivityControl,
            context : lang.exerciseonboarding,
            width : dimensions.WINDOW_WIDTH * 0.7,
            loop : false
        }, {
            logo : require("../../../res/animations/foodmaker2.json"),
            title : lang.onboardingTitle4,
            context : lang.foodmakeronboarding,
            width : dimensions.WINDOW_WIDTH * 0.7,
            loop : false
        }, {
            logo : require("../../../res/animations/goal.json"),
            title : lang.onboardingTitle5,
            context : lang.goalonboarding,
            width : dimensions.WINDOW_WIDTH * 0.7,
            loop : false
        }
  ]).current

  React.useEffect(()=>{
    AsyncStorage.setItem("onboardingShown","true")
  },[])

  const onNext = ()=>{
    props.navigation.navigate("ChooseCountryScreen")
  }

  return (
    <Animated.View style={{flex : 1 , opacity : opacity}}>
      <WelcomeSlider
          items={items}
          lang={lang}
          onNext={onNext}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent : "center",
    alignItems : "center"
  },
  content: {
    flex: 2.2,
    alignItems : "center"
  },
  logo : {
    width : dimensions.WINDOW_WIDTH * 0.6,
    height : dimensions.WINDOW_WIDTH * 0.45
  },
  loginButton : {
    backgroundColor : defaultTheme.green,
    width : dimensions.WINDOW_WIDTH * 0.7,
    height : moderateScale(48),
    borderRadius : moderateScale(25),
    margin : moderateScale(20),
    marginBottom:moderateScale(10)

  },
  signupButton:{
    backgroundColor : defaultTheme.primaryColor,
    width : dimensions.WINDOW_WIDTH * 0.7,
    height : moderateScale(48),
    borderRadius : moderateScale(25),
    margin : moderateScale(20),
    marginTop : moderateScale(10)

  },
  seprator : {
    flexDirection : "row",
    width:dimensions.WINDOW_WIDTH*0.9,
    alignItems:"center",
    justifyContent :"center",
    margin:moderateScale(10)
  },
  line : {
    width : dimensions.WINDOW_WIDTH * 0.15,
    height:1,
    backgroundColor : defaultTheme.gray
  }
});

export default WelcomeOnboardingScreen;
