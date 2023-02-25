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
    screenOptions={{
        tabBarActiveTintColor: defaultTheme.primaryColor,
        tabBarInactiveTintColor: defaultTheme.mainText,
        tabBarLabelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, bottom: Platform.OS === "ios" ? moderateScale(0) : moderateScale(4) },
        tabBarIndicatorStyle: { backgroundColor: defaultTheme.primaryColor },
        tabBarStyle: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0,borderTopLeftRadius:20,borderTopRightRadius:20 },
        tabBarShowIcon: true,
        tabBarItemStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42) },
        tabBarPressColor:defaultTheme.lightGray,
        
        
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
