
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  BackHandler
} from 'react-native';
import { ConfirmButton , CustomInput , Information} from '../../components';
import { useSelector , useDispatch } from 'react-redux'
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import { setAuthData , updateUserData , updateProfileLocaly , updateSpecificationLocaly} from '../../redux/actions';
import {urls} from "../../utils/urls"
import { RestController } from '../../classess/RestController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import {latinNumbers} from "../../utils/latinNumbers"
import LottieView from 'lottie-react-native';
import NativeSplashScreen from 'react-native-splash-screen'
import { firebase } from '@react-native-firebase/analytics';

const LoginOrSignUpScreen = props => {

  
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  let userId = React.useRef(0).current
  let opacity = React.useRef(new Animated.Value(1)).current

  const dispatch = useDispatch()

  const [userName , setUserName] = React.useState("")
  const [pass , setPass] = React.useState("")
  const [errorContext , setErrorContext] = React.useState("")
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [secureTextEntry , setSecureTextEntry] = React.useState(true)
  const [isLoading , setIsLoading] = React.useState(false)
  let SDBC = React.useRef(new SpecificationDBController()).current

  React.useEffect(()=>{
    NativeSplashScreen.hide()
  },[])

  const loginPressed = () =>{
      props.navigation.navigate("LoginScreen")
  }

  const signupPressed = () =>{
    props.navigation.navigate("SignUpScreen")
  }

  return (
    <Animated.ScrollView 
      style={{
        opacity : opacity
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoContainer}>
        <LottieView 
          style={{width : "75%" , marginBottom : moderateScale(35)}}
          source={require('../../../res/animations/loginorsignup.json')} 
          autoPlay 
          loop={true}
        />
      </View>
      <View style={styles.content}>
        <Text style={{fontFamily:lang.font,fontSize:moderateScale(15),color:defaultTheme.mainText}}>{lang.doYouSignup}</Text>
        <ConfirmButton
          title={lang.iRegister}
          lang={lang}
          style={styles.signupButton}
          textStyle={{color:defaultTheme.lightText , fontSize : moderateScale(17),fontFamily:lang.langName!=="english"?lang.font:lang.titleFont}}
          onPress={signupPressed}
          iconColor={defaultTheme.primaryColor}
          leftImage={require("../../../res/img/shield.png")}
        />
        
        <View style={styles.seprator}>
          <View style={styles.line}/>
          <Text style={{fontFamily : lang.font , color : defaultTheme.darkText , fontSize : moderateScale(14),marginVertical:moderateScale(10)}} allowFontScaling={false}>
            {lang.ya}
          </Text>
          <View style={styles.line}/>
        </View> 
        <Text style={{fontFamily : lang.font , color : defaultTheme.mainText , fontSize : moderateScale(14)}} allowFontScaling={false}>
            {lang.loginOrSignup}
        </Text>
        <ConfirmButton
          title={lang.loginToFiit}
          lang={lang}
          style={styles.loginButton}
          textStyle={{color:defaultTheme.lightText , fontSize : moderateScale(17),fontFamily:lang.langName!=="english"?lang.font:lang.titleFont}}
          onPress={loginPressed}
          isLoading={isLoading}
          leftImage={require("../../../res/img/enter.png")}
        />
      </View>
    </Animated.ScrollView> 
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent : "center",
    alignItems : "center",
    marginVertical : dimensions.WINDOW_HEIGTH *0.1
  },
  content: {
    flex: 2,
    alignItems : "center"
  },
  logo : {
    width : dimensions.WINDOW_WIDTH * 0.75,
    height : dimensions.WINDOW_WIDTH * 0.6,
    marginBottom : 15
  },
  loginButton : {
    backgroundColor : defaultTheme.green2,
    width : dimensions.WINDOW_WIDTH * 0.75,
    height : moderateScale(46),
    borderRadius : moderateScale(25),
    margin : moderateScale(10),
  },
  signupButton:{
    backgroundColor : defaultTheme.primaryColor,
    width : dimensions.WINDOW_WIDTH * 0.75,
    height : moderateScale(46),
    borderRadius : moderateScale(25),
    margin : moderateScale(10),

  },
  seprator : {
    flexDirection : "row",
    width:dimensions.WINDOW_WIDTH*0.5,
    alignItems:"center",
    justifyContent :"space-evenly",
    margin : moderateScale(3)
  },
  line : {
    width : dimensions.WINDOW_WIDTH * 0.15,
    height:1,
    backgroundColor : defaultTheme.gray
  }
});

export default LoginOrSignUpScreen;
