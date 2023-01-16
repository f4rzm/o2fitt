import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView
} from 'react-native';
import {Information, ProfileHeader, RowCenter, CustomInput, Toolbar, ConfirmButton, RowSpaceBetween} from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import {urls} from "../../utils/urls"
import {RestController} from "../../classess/RestController"


const SecurityScreen = props => {

  const lang = useSelector(state=>state.lang)
  const user = useSelector(state=>state.user)
  const profile = useSelector(state=>state.profile)
  const app = useSelector(state=>state.app)
  const auth = useSelector(state=>state.auth)
  const [pass , setPass]=React.useState("")
  const [passRepeat , setPassRepeat]=React.useState("")
  const [errorContext , setErrorContext] = React.useState("")
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [loading , setLoading] = React.useState(false)

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

  const savePressed = ()=>{

    if(app.networkConnectivity){
      if(pass != "" && pass === passRepeat){
        if(/^[a-z0-9\.\@\_\!\$\?\*\%\&\#\s\-]+$/i.test(pass)){
          if(pass.trim().length >= 4){
            getToken()
          }
          else{
            setErrorContext(lang.passwordalert)
            setErrorVisible(true)
          }
        }
        else{
          setErrorContext(lang.dataEntryEN)
          setErrorVisible(true)
        }
      }
      else{
        setErrorContext(lang.nomatchpassandconfirmpass)
        setErrorVisible(true)
      }
    }
    else {
      setErrorContext(lang.noInternet)
      setErrorVisible(true)
    }
  }

  const getToken = ()=>{
    setLoading(true)
    const url = urls.identityBaseUrl + urls.user + urls.resetPasswordToken + `?UserName=${user.username}`
    const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
    const params = {}
    const RC = new RestController()
    RC.checkPrerequisites("post" , url , params , header , onTokenSuccess , onTokenFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
  }

  const onTokenSuccess = (response)=>{
    const token = response.data.data
    setNewPass(token)
  }

  const onTokenFailure = ()=>{
    setLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const setNewPass = (token)=>{
    setLoading(true)
    const url = urls.identityBaseUrl + urls.user + urls.resetPassword 
    const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName , "Content-Type": "multipart/form-data"}}
    var params = new FormData();
    params.append('userName', user.username);
    params.append('NewPassword', pass);
    params.append('Code', token);
  
    const RC = new RestController()
    RC.checkPrerequisites("post" , url , params , header , setPassSuccess , setPassFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
  }

  const setPassSuccess = (response)=>{
   setLoading(false)
   setErrorContext(lang.successful)
   setErrorVisible(true)
  }

  const setPassFailure = ()=>{
    setLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const onRefreshTokenSuccess = () =>{

  }

  const onRefreshTokenFailure = () =>{

  }

  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.security}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{alignItems : "center"}}>
            <RowSpaceBetween>
                <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                    {
                        lang.changePassword
                    }
                </Text>
            </RowSpaceBetween>
            <CustomInput
                lang={lang}
                style={styles.input}
                icon="lock"
                placeholder={lang.pasword}
                value={pass}
                onChangeText={text=>setPass(text)}
            />
            
            <CustomInput
                lang={lang}
                style={styles.input}
                icon="lock"
                placeholder={lang.confirmPass}
                value={passRepeat}
                onChangeText={text=>setPassRepeat(text)}
            />

            <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.saved}
                leftImage={require("../../../res/img/done.png")}
                onPress={savePressed}
                isLoading={loading}
            />
        </ScrollView>
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={()=>setErrorVisible(false)}
          lang={lang}
        />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  input :{
    borderRadius : moderateScale(8)
  },
  text : {
    fontSize : moderateScale(15),
    lineHeight : moderateScale(24),
    color : defaultTheme.gray,
    marginVertical : moderateScale(20),
    marginHorizontal : moderateScale(10)
  },
  text2 : {
    fontSize : moderateScale(12),
    lineHeight : moderateScale(24),
    color : defaultTheme.gray,
    marginVertical : moderateScale(8),
    marginStart : moderateScale(10)
  },
  row : {
    borderTopWidth :1,
    borderBottomWidth : 1,
    marginTop : moderateScale(50)
  },
  button : {
      width : dimensions.WINDOW_WIDTH * 0.45,
      height : moderateScale(45),
      backgroundColor : defaultTheme.green,
      alignSelf : "center",
      marginTop : moderateScale(30)
  }
});

export default SecurityScreen;
