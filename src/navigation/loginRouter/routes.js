import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ChooseLangScreen,
    LoginOrSignUpScreen,
    LoginScreen,
    SignUpScreen,
    AuthCodeScreen,
    ChooseCountryScreen,
    ChooseCalendarScreen,
    ForgotPasswordScreen,
    ForgotPasswordConfirmCodeScreen,
    NewPasswordScreen,
    WelcomeOnboardingScreen
} from  "../../screens"
import { useSelector } from 'react-redux'
import { setUnreadMessageNumber } from '../../redux/actions';

const Routes = ()=>{
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const [render,setRender]=React.useState(false)
    const [onboardingShown,setOnboardingShown]=React.useState(false)

    React.useEffect(()=>{
        AsyncStorage.getItem("onboardingShown").then(res=>{
            setOnboardingShown(res)
            setRender(true)
        })
    },[])

    const options = {
        contentStyle : {backgroundColor : null},
    }
    const Stack = createNativeStackNavigator();

    if(render){
        return (
            
            <Stack.Navigator
                screenOptions={{
                    headerShown : false,
                    contentStyle : {backgroundColor : null},
                    stackAnimation : "none"
                }}
                initialRouteName={lang.langName?onboardingShown?user.countryId?"LoginScreen":"ChooseCountryScreen":"WelcomeOnboardingScreen":"ChooseLangScreen"}
            >
                <Stack.Screen name="WelcomeOnboardingScreen" component={WelcomeOnboardingScreen} options={options}/>
                <Stack.Screen name="ChooseLangScreen" component={ChooseLangScreen} options={options}/> 
                <Stack.Screen name="ChooseCountryScreen" component={ChooseCountryScreen} options={options}/>
                <Stack.Screen name="ChooseCalendarScreen" component={ChooseCalendarScreen} options={options}/>
                <Stack.Screen name="LoginOrSignUpScreen" component={LoginOrSignUpScreen} options={options}/>
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={options}/>
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={options}/>
                <Stack.Screen name="AuthCodeScreen" component={AuthCodeScreen} options={options}/>
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={options}/>
                <Stack.Screen name="ForgotPasswordConfirmCodeScreen" component={ForgotPasswordConfirmCodeScreen} options={options}/>
                <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} options={options}/>
            </Stack.Navigator>
        )
    }

    return null
}



export default Routes
