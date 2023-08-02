import React from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from "react-native"
import {
  SportsTab,
  MyActivityTab,
} from "../../screens"
import CardoRouter from "../../navigation/cardoRouter"
import BodyBuildingRouter from "../../navigation/bodyBuildingRouter"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import moment from "moment"
import TabBarComp from "./TabBarComp";

const Tab = createMaterialTopTabNavigator();

const ActivityTab = (props) => {

  const pkExpireDate = moment(props.profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
  const lang = props.lang

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: null }}
      tabBar={props => <TabBarComp {...props} lang={lang} />}
      tabBarOptions={{
        scrollEnabled: true,
        activeTintColor: defaultTheme.primaryColor,
        inactiveTintColor: defaultTheme.darkText,
        labelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, marginBottom: moderateScale(5) },
        indicatorStyle: { backgroundColor: defaultTheme.primaryColor, height: moderateScale(1.6) },
        style: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0, borderBottomWidth: 1, borderColor: defaultTheme.border },
        showIcon: !hasCredit,
        tabStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42), width: lang.langName === "persian" ? moderateScale(90) : moderateScale(115) },
      }}
      lazy={true}
      initialRouteName={"SportsTab"}
    >
      <Tab.Screen
        name="MyActivityTab"
        children={(nestedProps) => <MyActivityTab searchText={props.searchText} {...nestedProps} />}
        options={{
          tabBarLabel: lang.myWorkouts,

          tabBarIcon: !hasCredit ? require("../../../res/img/lock.png") : null
        }}
      />
      <Tab.Screen
        name="BodyBuildingRouter"
        children={(nestedProps) => <BodyBuildingRouter searchText={props.searchText} {...nestedProps} />}
        options={{
          tabBarLabel: lang.bodyBuldingFavorite,

          tabBarIcon: !hasCredit ? require("../../../res/img/lock.png") : null
        }}
      />
      <Tab.Screen
        name="CardoRouter"
        children={(nestedProps) => <CardoRouter searchText={props.searchText} {...nestedProps} />}
        options={{
          tabBarLabel: lang.aerobic,

          tabBarIcon: !hasCredit ? require("../../../res/img/lock.png") : null
        }}
      />
      <Tab.Screen
        name="SportsTab"
        children={(nestedProps) => <SportsTab searchText={props.searchText} {...nestedProps} />}
        options={{
          tabBarLabel: lang.sports
        }}
      />


    </Tab.Navigator>
  );
}

export { ActivityTab }
