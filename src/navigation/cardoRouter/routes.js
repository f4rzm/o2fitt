import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import {
  CardioCategoryScreen,
  CardioTrainScreen
} from  "../../screens"
import { defaultTheme } from '../../constants/theme';
import { createStackNavigator } from '@react-navigation/stack';

const Routes = (props)=>{
    const options = {
        contentStyle : {backgroundColor : null},
        animationEnabled : true 
    }
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown : false,
                contentStyle : {backgroundColor : defaultTheme.lightBackground},
                animationEnabled:"true"
            }}
        >
            <Stack.Screen 
                name="CardioCategoryScreen"
                children={(nestedProps)=><CardioCategoryScreen searchText={props.searchText} {...nestedProps}/>} 
                options={options}
            />
            <Stack.Screen 
                name="CardioTrainScreen"
                children={(nestedProps)=><CardioTrainScreen searchText={props.searchText} {...nestedProps}/>} 
                options={options} 
            />
        </Stack.Navigator>
    )
}



export default Routes
