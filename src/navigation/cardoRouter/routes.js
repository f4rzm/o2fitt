import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import {
  CardioCategoryScreen,
  CardioTrainScreen
} from  "../../screens"

const Routes = (props)=>{
    const options = {
        contentStyle : {backgroundColor : null},
        animationEnabled : false 
    }
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown : false,
                contentStyle : {backgroundColor : null},
                stackAnimation : "none"
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
