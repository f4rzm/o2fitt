import React from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    SleepWeekTab , 
    SleepMonthTab , 
} from "../../screens"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import {Image} from "react-native"

const Tab = createMaterialTopTabNavigator();

const SleepDetailsTab = (props) => {
  const lang = props.lang
  return (
    <Tab.Navigator  
        tabBarOptions={{
          activeTintColor : defaultTheme.primaryColor,
          inactiveTintColor : defaultTheme.gray,
          labelStyle: { fontSize: lang.langName === "persian"?moderateScale(14):moderateScale(11), fontFamily : lang.font , top : moderateScale(-2)} ,
          indicatorStyle : {backgroundColor : defaultTheme.primaryColor},
          style: { backgroundColor: defaultTheme.lightBackground , justifyContent : "center" ,height : moderateScale(42),elevation : 0 , borderBottomWidth : 1.5 , borderColor : defaultTheme.border},
          showIcon:true,
          tabStyle : {flexDirection : "row" , alignItems : "center" , justifyContent:"center" , height : moderateScale(42)},
        }}
    >
        <Tab.Screen 
            name="SleepWeekTab" 
            children={(nestedProps)=><SleepWeekTab sleepData={{...props.sleepWeekData}} {...nestedProps}/>} 
            options={{ 
                tabBarLabel: lang.sleepChartTab_week , 
                tabBarIcon:({tintColor , focused}) =>(
                    <Image
                        source={require("../../../res/img/chart.png")}
                        style={{width : moderateScale(18) , height : moderateScale(20),tintColor:focused?defaultTheme.primaryColor:defaultTheme.gray}}
                        resizeMode="contain"
                    />
                )
            }}
        />
        <Tab.Screen 
            name="SleepMonthTab" 
            children={(nestedProps)=><SleepMonthTab sleepData={{...props.sleepMonthData}} {...nestedProps}/>}  
            options={{ 
                tabBarLabel: lang.sleepChartTab_month , 
                tabBarIcon:({tintColor , focused}) =>(
                    <Image
                        source={require("../../../res/img/chart.png")}
                        style={{width : moderateScale(18) , height : moderateScale(20),tintColor:focused?defaultTheme.primaryColor:defaultTheme.gray}}
                        resizeMode="contain"
                    />
                )
            }}
        />
    </Tab.Navigator>
  );
}

export {SleepDetailsTab}
