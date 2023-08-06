import React from "react"
import { NavigationContainer , DefaultTheme} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    ChooseFoodHabbitationScreen,
    ChooseGenderScreen,
    BodyDetailsScreen,
    BMIScreen,
    DailyActivitiesScreen,
    ChooseTargetScreen,
    SetTargetScreen
} from '../screens';

import { useSelector } from 'react-redux'
import { defaultTheme } from "../constants/theme";
import Tabs from "./TabNavigator" 


const InitialProfileRouter = props => {
    const options = {
        contentStyle : {backgroundColor : null},
        cardStyle:{backgroundColor : null},
    }
    const app = useSelector(state => state.app)
    
    const Stack = createStackNavigator();
    const MyTheme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: null,
        },
    };

    React.useEffect(()=>{
        // console.log( "sssssssssssssssssssss" , auth.auth)
    })

    return(
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown : false,
                    cardStyle:{backgroundColor : null},
                    cardOverlayEnabled : false
                }}
            >
                 <Stack.Screen name="ChooseFoodHabbitationScreen" component={ChooseFoodHabbitationScreen} options={options}/>
                 <Stack.Screen name="ChooseGenderScreen" component={ChooseGenderScreen} options={options}/>
                 <Stack.Screen name="BodyDetailsScreen" component={BodyDetailsScreen} options={options}/>
                 <Stack.Screen name="BMIScreen" component={BMIScreen} options={options}/>
                 <Stack.Screen name="DailyActivitiesScreen" component={DailyActivitiesScreen} options={options}/>
                 <Stack.Screen name="ChooseTargetScreen" component={ChooseTargetScreen} options={options}/>
                 <Stack.Screen name="SetTargetScreen" component={SetTargetScreen} options={options}/>
                         
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default InitialProfileRouter