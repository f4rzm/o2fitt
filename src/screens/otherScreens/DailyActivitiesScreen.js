
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { ConfirmButton , RadioButton , Helper, PageIndicator,Information , RowWrapper} from '../../components';
import { useSelector , useDispatch} from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { updateProfileLocaly } from "../../redux/actions"
import LottieView from 'lottie-react-native';

const DailyActivitiesScreen = props => {

  const lang = useSelector(state=>state.lang)
  const profile = useSelector(state=>state.profile)
  const dispatch = useDispatch()
  const [activeIndex , setActiveIndex]=React.useState(profile.dailyActivityRate)
  const [errorContext , setErrorContext] = React.useState("")
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [helperVisible , setShowHelper]=React.useState(false)

  React.useEffect(()=>{
    activeIndex != profile.dailyActivityRate && onNext()
  },[activeIndex])

  const onNext = ()=>{
    if(activeIndex && parseInt(activeIndex) > 0){
      dispatch(updateProfileLocaly({dailyActivityRate : activeIndex}))
      props.navigation.navigate("ChooseTargetScreen")
    }
    else{
      setErrorContext(lang.selectOneOption)
      setErrorVisible(true)
    }
  }
  try {
    if(lang.langName=="persian"){
      I18nManager.allowRTL(true)
      I18nManager.forceRTL(true)
      I18nManager.swapLeftAndRightInRTL(true);
    }

  } catch (e) {
    console.error(e)
  }

  const onBack = ()=>{
      props.navigation.goBack()
  }

  const showHelper = ()=>{
    setShowHelper(true)
  }

  return (
    <View
        style={styles.container}
    >
        <View style={styles.titleContainer}>
            <Text style={[styles.title,{fontFamily:lang.titleFont}]}  allowFontScaling={false}>
            {lang.rateActivityToDay}
            </Text>
        </View>
        <View style={styles.content}>
            <View style={styles.informationContainer}>
              <RadioButton
                lang={lang}
                title={lang.bedRest}
                isSelected={activeIndex === 10}
                onPress={()=>setActiveIndex(10)}
               />
               <RadioButton
                lang={lang}
                title={lang.veryLittleActivity}
                isSelected={activeIndex === 20}
                onPress={()=>setActiveIndex(20)}
               />
               <RadioButton
                lang={lang}
                title={lang.littleActivity}
                isSelected={activeIndex === 30}
                onPress={()=>setActiveIndex(30)}
               />
               <RadioButton
                lang={lang}
                title={lang.normalLife}
                isSelected={activeIndex === 40}
                onPress={()=>setActiveIndex(40)}
               />
               <RadioButton
                lang={lang}
                title={lang.relativelyActivity}
                isSelected={activeIndex === 50}
                onPress={()=>setActiveIndex(50)}
               />
               <RadioButton
                lang={lang}
                title={lang.veryActivity}
                isSelected={activeIndex === 60}
                onPress={()=>setActiveIndex(60)}
               />
               
               <RadioButton
                lang={lang}
                title={lang.moreActivity}
                isSelected={activeIndex === 70}
                onPress={()=>setActiveIndex(70)}
               />

                <RowWrapper style={{marginTop : moderateScale(25)}}>
                  <LottieView 
                      style={{width : dimensions.WINDOW_WIDTH * 0.1 , height : dimensions.WINDOW_WIDTH * 0.1}}
                      source={require('../../../res/animations/information.json')} 
                      autoPlay 
                      loop={false}
                    />
                    <ConfirmButton
                      lang={lang}
                      style={styles.infoButton}
                      title={lang.moreKnowledge}
                      onPress={showHelper}
                    />
                </RowWrapper>
            </View>
            <View
                style={[styles.genderContainer]}
            >
              <LottieView 
                style={{width : dimensions.WINDOW_WIDTH * 0.37}}
                source={profile.gender?require('../../../res/animations/man.json'):require('../../../res/animations/woman.json')} 
                autoPlay 
                loop={true}
                speed={0.7}
              />
               
            </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <ConfirmButton
                title={lang.perBtn}
                style={styles.confirmButton}
                lang={lang}
                onPress={onBack}
                leftImage={require("../../../res/img/back.png")}
                rotate
            />
            <ConfirmButton
                title={lang.continuation}
                style={styles.confirmButton}
                lang={lang}
                onPress={onNext}
                rightImage={require("../../../res/img/next.png")}
                rotate
            />
          </View>
          <PageIndicator
            pages={new Array(6).fill(1)}
            activeIndex={3}
          />
        </View>
        <Helper
          visible={helperVisible}
          onRequestClose={()=>setShowHelper(false)}
          lang={lang}
        />
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={()=>setErrorVisible(false)}
          lang={lang}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "space-between",
    alignItems : "center",
  },
  titleContainer : {
      width:dimensions.WINDOW_WIDTH,
      marginTop : moderateScale(35),
      marginBottom : moderateScale(30),
      justifyContent : "center",
      alignItems : "center"
  },
  content: {
    flex: 1,
    width : dimensions.WINDOW_WIDTH,
    flexDirection:"row",
    justifyContent  :"space-around",
    alignItems : "center"
  },
  helper:{
    position : "absolute",
    top : -15,
    left:"5%",
    width : dimensions.WINDOW_WIDTH * 0.9,
    padding : 5,
    backgroundColor : defaultTheme.green,
    borderRadius : 8,
    alignItems : "center"
  },
  informationContainer :{
    width : dimensions.WINDOW_WIDTH * 0.65,
    height : "80%",
    alignItems : "flex-start",
    justifyContent : "space-evenly",
    paddingStart  : moderateScale(16)
  },
  infoButton : {
    width:moderateScale(120),
    height : moderateScale(35),
    backgroundColor : defaultTheme.green2,
  },
  bottomContainer : {
      width : dimensions.WINDOW_WIDTH,
      height : moderateScale(75),
      marginTop : moderateScale(30),
      marginBottom : moderateScale(10),
      alignItems : "center",
      justifyContent : "space-around"
  },
  buttonContainer : {
      flexDirection : "row",
      width : dimensions.WINDOW_WIDTH,
      alignItems : "center",
      justifyContent : "space-evenly"
  },
  title:{
      color:defaultTheme.darkText,
      fontSize : moderateScale(19)
  },
  text:{
      color:defaultTheme.gray,
      fontSize : moderateScale(13),
      marginTop : moderateScale(5)
  },
  genderContainer : {
      paddingHorizontal : 15,
      borderRadius : 10,
      borderColor : defaultTheme.green
  },
  confirmButton : {
    width : dimensions.WINDOW_WIDTH * 0.35 , 
    borderRadius : 20 , 
  },
  bmi:{
      fontSize : 28,
      color : defaultTheme.gray,
      marginTop  :25
  },
  bmiValue : {
      fontSize : 28,
      color : defaultTheme.primaryColor
  }
});

export default DailyActivitiesScreen;
