import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
    WelcomeOnboardingScreen,
    ChooseGenderScreen,
    ChooseFoodHabbitationScreen,
    BodyDetailsScreen,
    BMIScreen,
    DailyActivitiesScreen,
    ChooseTargetScreen,
    SetTargetScreen,
    UserDataAcceptionScreen
} from  "../screens"

const Routes = ()=>{
    const options = {
        contentStyle : {backgroundColor : null},
        animationEnabled : false 
    }
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
                contentStyle : {backgroundColor : null},
                // stackAnimation : "none"
            }}
        >
            <Stack.Screen name="ChooseFoodHabbitationScreen" component={ChooseFoodHabbitationScreen} options={options}/>
            <Stack.Screen name="ChooseGenderScreen" component={ChooseGenderScreen} options={options}/>
            <Stack.Screen name="BodyDetailsScreen" component={BodyDetailsScreen} options={options}/>
            <Stack.Screen name="BMIScreen" component={BMIScreen} options={options}/>
            <Stack.Screen name="DailyActivitiesScreen" component={DailyActivitiesScreen} options={options}/>
            <Stack.Screen name="ChooseTargetScreen" component={ChooseTargetScreen} options={options}/>
            <Stack.Screen name="SetTargetScreen" component={SetTargetScreen} options={options}/>
            <Stack.Screen name="UserDataAcceptionScreen" component={UserDataAcceptionScreen} options={options}/>
        </Stack.Navigator>
    )
}



export default Routes
