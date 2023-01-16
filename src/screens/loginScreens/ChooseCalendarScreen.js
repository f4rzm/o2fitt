
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { ConfirmButton } from '../../components';
import { useSelector , useDispatch} from 'react-redux'
import {updateUserData} from "../../redux/actions"
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseCalendarScreen = props => {
  
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const redux = useSelector(state => state)
  const dispatch = useDispatch()

  const [calendar,setCalendar] =  React.useState(1)

  console.log("redux =>" , redux)
  
  const onNext=()=>{
    dispatch(updateUserData({
      startOfWeek : calendar
    }))
    const newUser = {
      ...user,
      startOfWeek : calendar
    }
    AsyncStorage.setItem("user",JSON.stringify(newUser))
    props.navigation.navigate("LoginScreen")
  }

  const onPrevious = ()=>{
    props.navigation.goBack()
  }

  return (
    <>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../res/img/calendar.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={[styles.text,{fontFamily : lang.font}]} allowFontScaling={false}>
               {lang.selectTypeCalender}
            </Text>
            <ConfirmButton
                style={{...styles.calendarButton , borderColor : calendar === 1 ? defaultTheme.primaryColor : defaultTheme.lightGray}}
                textStyle={{color:defaultTheme.gray}}
                lang={lang}
                title="َAD Calendar"
                onPress={()=>setCalendar(1)}
            />
            <ConfirmButton
                style={{...styles.calendarButton , borderColor : calendar === 6 ? defaultTheme.primaryColor : defaultTheme.lightGray}}
                textStyle={{color:defaultTheme.gray}}
                lang={lang}
                title="هجری شمسی"
                onPress={()=>setCalendar(6)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <ConfirmButton
                style={styles.button}
                lang={lang}
                title={lang.perBtn}
                onPress={onPrevious}
                leftImage={require("../../../res/img/back.png")}
                rotate
            />
            <ConfirmButton
                style={styles.button}
                lang={lang}
                title={lang.continuation}
                onPress={onNext}
                rightImage={require("../../../res/img/next.png")}
                rotate
            />
          </View>
      </View>
    </> 
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent : "center",
    alignItems : "center"
  },
  container :{
    flex: 1.5,
    alignItems : "center",
    justifyContent :"space-between",
  },
  topContainer : {
    alignItems : "center",
    justifyContent :"center"
  },
  buttonContainer: {
    flexDirection : "row",
    alignItems : "center",
    justifyContent :"space-between",
    width : dimensions.WINDOW_WIDTH * 0.9,
    marginBottom : dimensions.WINDOW_HEIGTH * 0.1
  },
  logo : {
    width : dimensions.WINDOW_WIDTH * 0.65,
    height : dimensions.WINDOW_WIDTH * 0.4
  },
  text :{
    color : defaultTheme.gray,
    marginBottom : 15   
  },    
  button : {
    width : dimensions.WINDOW_WIDTH * 0.35,
    borderRadius : 25,
    backgroundColor : defaultTheme.primaryColor,
  },
  calendarButton : {
    height : 50,
    borderWidth : 1.2,
    borderRadius : 10,
    backgroundColor : defaultTheme.lightBackground,
    margin:15
  },
  dropDownContainer : {
    height: 50, 
    width: dimensions.WINDOW_WIDTH*0.8 , 
    borderRadius : 25,
    paddingHorizontal : 5,
    borderWidth : 1 , 
    borderColor : defaultTheme.lightGray 
  }
});

export default ChooseCalendarScreen;
