import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import {
  BodyBuildinCategoryScreen,
  BodyBuildinTrainScreen
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
                name="BodyBuildinCategoryScreen"
                children={(nestedProps)=><BodyBuildinCategoryScreen searchText={props.searchText} {...nestedProps}/>} 
                options={options}
            />
            <Stack.Screen 
                name="BodyBuildinTrainScreen"
                children={(nestedProps)=><BodyBuildinTrainScreen searchText={props.searchText} {...nestedProps}/>} 
                options={options}
            />
        </Stack.Navigator>
    )
}



export default Routes
