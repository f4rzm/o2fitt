import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import {
    ProfileScreen,
} from  "../../screens"
import { useSelector } from 'react-redux'

const Routes = ()=>{
    const options = {
        contentStyle : {backgroundColor : null},
        stackAnimation : "fade" 
    }
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown : false,
                contentStyle : {backgroundColor : null},
            }}
        >
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={options}/> 
        </Stack.Navigator>
    )
}



export default Routes
