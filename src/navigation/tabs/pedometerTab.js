import React, { useState } from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    TestScreen,
    GoalWeightScreen,
    GoalNutritionValue,
    GoalBodyScreen,
    GoalActivityScreen,
    PedometerScreen
} from "../../screens"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import { Image } from "react-native"
import { Toolbar } from "../../components";
import { useNavigation } from "@react-navigation/native";
import TabBarComp from "./TabBarComp";


const Tab = createMaterialTopTabNavigator();

const PedometerTabs = (props) => {
    const [isActiveModal, setisActiveModal] = useState(false)
    const lang = props.lang
    const navigation = useNavigation()
    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.setStepTitle}
                onBack={() => {
                    if (isActiveModal == false) {
                        navigation.goBack()
                    }
                }}
            />
            <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: null }}
                screenOptions={{
                    tabBarActiveTintColor: defaultTheme.primaryColor,
                    tabBarInactiveTintColor: defaultTheme.mainText,
                    tabBarLabelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, bottom: Platform.OS === "ios" ? moderateScale(0) : moderateScale(4) },
                    tabBarIndicatorStyle: { backgroundColor: defaultTheme.primaryColor },
                    tabBarStyle: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                    tabBarShowIcon: true,
                    tabBarItemStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42) },
                    tabBarPressColor: defaultTheme.lightGray
                }}
                tabBar={props => <TabBarComp {...props} lang={lang} />}
                lazy={true}
                initialRouteName={"PedometerScreen"}
            >
                <Tab.Screen name="GoalActivityScreen" component={GoalActivityScreen}
                    options={{
                        tabBarLabel: lang.report,
                        tabBarIcon: require("../../../res/img/paper.png")
                    }}
                />
                <Tab.Screen name="PedometerScreen"
                    children={() => <PedometerScreen route={{ params: null }} onPress={(item) => setisActiveModal(item)} />}
                    options={{
                        tabBarLabel: lang.step,
                        tabBarIcon: require("../../../res/img/RunningShoe.png")
                    }}
                />

            </Tab.Navigator>
        </>
    );
}

export { PedometerTabs }
