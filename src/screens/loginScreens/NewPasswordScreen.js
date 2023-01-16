
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Linking, 
  BackHandler
} from 'react-native';
import { ConfirmButton , CustomInput , Toolbar , Information } from '../../components';
import { useSelector , useDispatch} from 'react-redux'
import {updateUserData} from '../../redux/actions';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import {RestController}from "../../classess/RestController"
import {urls} from "../../utils/urls"
import { ScrollView } from 'react-native-gesture-handler';

const NewPasswordScreen = props => {
  
  const lang = useSelector(state => state.lang)
  
  const [userName] = React.useState(props.route.params.userName)
  const [token] = React.useState(props.route.params.token)
  const [pass , setPass] = React.useState("")
  const [errorContext , setErrorContext] = React.useState("")
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [isLoading , setIsLoading] = React.useState(false)
  const [secureTextEntry , setSecureTextEntry] = React.useState(true)



  const passChanged = text =>{
    if(text!= "" && /^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(text)){
      setPass(text)
    }
    else if(text=== ""){
      setPass("")
    }else{
      setErrorContext(lang.dataEntryEN)
      setErrorVisible(true)
    }
  }

  const showPass = ()=>{
    setSecureTextEntry(true)
  }

  const hidePass = ()=>{
    setSecureTextEntry(false)
  }

  const signupPressed = async () =>{
    if(pass.length > 3){
      setIsLoading(true)
      const url = urls.identityBaseUrl + urls.user + urls.forgotPasswordChange
      const params = {
        username : userName,
        newPassword: pass,
        code: token,
      }
      const header = {}
      const RC = new RestController()
      RC.post(
          url, 
          params,
          header, 
          onSignUpSuccess, 
          onSignUpFailure, 
      )
    }else{
      setErrorContext(lang.passwordalert)
      setErrorVisible(true)
    }
  }

  const onSignUpSuccess = response =>{
    setIsLoading(false)
    console.log("response" , response)
    props.navigation.pop(3)
  }

  const onSignUpFailure = error=>{
    setIsLoading(false)
    if(error.data && error.data.Message && error.data.Message!= ""){
      setErrorContext(error.data.Message)
    }
    else{
      setErrorContext(lang.serverError)
    }
    setErrorVisible(true)
  }

  return (
    <>
      <Toolbar
        lang={lang}
        style={{backgroundColor : defaultTheme.lightBackground}}
        iconStyle={{tintColor : defaultTheme.primaryColor}}
        onBack={()=>props.navigation.goBack()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../res/img/signup.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <CustomInput
              placeholder={lang.newPassword}
              value={pass}
              secureTextEntry={secureTextEntry}
              onChangeText={passChanged}
              lang={lang}
              icon="lock"
              isPass
              showPass={showPass}
              hidePass={hidePass}
              textStyle={{color:defaultTheme.darkText}}
          />
          <ConfirmButton
            title={lang.set}
            lang={lang}
            style={styles.loginButton}
            textStyle={{color:defaultTheme.lightText}}
            onPress={signupPressed}
            leftImage={require("../../../res/img/done.png")}
            isLoading={isLoading}
          />
          <Information
            visible={errorVisible}
            context={errorContext}
            onRequestClose={()=>setErrorVisible(false)}
            lang={lang}
          />
        </View>
      </ScrollView> 
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent : "center",
    alignItems : "center",
    paddingVertical : dimensions.WINDOW_HEIGTH * 0.035
  },
  content: {
    flex: 2.2,
    alignItems : "center"
  },
  logo : {
    width : dimensions.WINDOW_WIDTH * 0.78,
    height : dimensions.WINDOW_WIDTH * 0.6
  },
  loginButton : {
    backgroundColor : defaultTheme.green2,
    width : dimensions.WINDOW_WIDTH * 0.75,
    height : moderateScale(48),
    borderRadius : moderateScale(25),
    margin : moderateScale(20),
    marginTop:moderateScale(40),

  },
  seprator : {
    flexDirection : "row",
    width:dimensions.WINDOW_WIDTH*0.9,
    alignItems:"center",
    justifyContent :"center",
    margin:moderateScale(16),
  },
  line : {
    width : dimensions.WINDOW_WIDTH * 0.15,
    height:1,
    backgroundColor : defaultTheme.gray
  }
});

export default NewPasswordScreen;
