import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { 
    GoalScreen,
 } from '../../screens';


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
            <Stack.Screen name="GoalScreen" component={GoalScreen} options={options} /> 
            
        </Stack.Navigator>
    )
}

export default Routes
