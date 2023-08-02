import React from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  TestScreen,
  GoalWeightScreen,
  GoalNutritionValue,
  GoalBodyScreen,
  GoalActivityScreen,
} from "../../screens"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import { Image } from "react-native"
import TabBarComp from "./TabBarComp";


const tabbarOptions = {
  showLabel: false,
  showIcon: true,
  activeTintColor: defaultTheme.primaryColor,
  inactiveTintColor: defaultTheme.grayBackground,

}

const Tab = createMaterialTopTabNavigator();

const GoalTabs = (props) => {
  const lang = props.lang
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: null }}
      // tabBarOptions={{
      //   activeTintColor: defaultTheme.primaryColor,
      //   inactiveTintColor: defaultTheme.mainText,
      //   labelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, marginBottom: Platform.OS === "ios" ? moderateScale(0) : moderateScale(0) },
      //   indicatorStyle: { backgroundColor: defaultTheme.primaryColor },
      //   style: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0, },
      //   showIcon: true,
      //   tabStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42) },

      // }}
      tabBar={props => <TabBarComp {...props} lang={lang} />}

      // screenOptions={{
      //   tabBarActiveTintColor: defaultTheme.primaryColor,
      //   tabBarInactiveTintColor: defaultTheme.mainText,
      //   tabBarLabelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, bottom: Platform.OS === "ios" ? moderateScale(0) : moderateScale(4) },
      //   tabBarIndicatorStyle: { backgroundColor: defaultTheme.primaryColor },
      //   tabBarStyle: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0,borderTopLeftRadius:20,borderTopRightRadius:20 },
      //   showIcon: true,
      //   tabBarItemStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42) },
      //   tabBarPressColor:defaultTheme.lightGray,

      // }}
      initialRouteName={"GoalWeightScreen"}
      lazy={true}
    >
      <Tab.Screen name="GoalBodyScreen" component={GoalBodyScreen}
        options={{
          tabBarLabel: lang.limbBody,
          tabBarIcon: ({ tintColor, focused }) => (
            <Image
              source={focused ? require("../../../res/img/body2.png") : require("../../../res/img/body.png")}
              style={{ width: moderateScale(15), height: moderateScale(18) }}
              tintColor={tintColor}
              resizeMode="contain"
            />
          ),
          tabBarIcon: require("../../../res/img/body.png")
        }}
      />
      {
        !props.diet.isActive || props.diet.isBuy == false ?
          <Tab.Screen name="GoalNutritionValue" component={GoalNutritionValue}
            options={{
              tabBarLabel: lang.nutTab,
              tabBarIcon: ({ tintColor, focused }) => (
                <Image
                  source={focused ? require("../../../res/img/donut2.png") : require("../../../res/img/donut.png")}
                  style={{ width: moderateScale(15), height: moderateScale(18) }}
                  tintColor={tintColor}
                  resizeMode="contain"
                />
              ),
              tabBarIcon: require("../../../res/img/donut.png")

            }}

          /> : null
      }
      <Tab.Screen name="GoalWeightScreen" component={GoalWeightScreen}
        options={{
          tabBarLabel: lang.weight,
          tabBarBadge: ({ tintColor, focused }) => (
            <Image
              source={focused ? require("../../../res/img/scale2.png") : require("../../../res/img/scale.png")}
              style={{ width: moderateScale(15), height: moderateScale(18) }}
              tintColor={tintColor}
              resizeMode="contain"
            />
          ),
          tabBarShowIcon: true,
          tabBarIcon: require("../../../res/img/scale.png")

        }}
      />


      {/* <Tab.Screen name="GoalActivityScreen" component={GoalActivityScreen} 
          options={{ 
            tabBarLabel: lang.exerciseFavorite , 
            tabBarIcon:({tintColor , focused}) =>(
              <Image
                  source={focused?require("../../../res/img/activity2.png") : require("../../../res/img/activity.png")}
                  style={{width : moderateScale(15) , height : moderateScale(18) , margin:0}}
                  tintColor={tintColor}
                  resizeMode="contain"
              />
            )
          }}
        /> */}
    </Tab.Navigator>
  );
}

export { GoalTabs }
