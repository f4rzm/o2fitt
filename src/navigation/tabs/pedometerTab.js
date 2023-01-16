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


const Tab = createMaterialTopTabNavigator();

const PedometerTabs = (props) => {
    const [isActiveModal, setisActiveModal] = useState(false)
    const lang = props.lang
    const navigation=useNavigation()
    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.setStepTitle}
                onBack={() => {
                    if (isActiveModal==false) {
                        navigation.goBack()
                    }
                }}
            />
            <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: null }}
                tabBarOptions={{
                    activeTintColor: defaultTheme.primaryColor,
                    inactiveTintColor: defaultTheme.mainText,
                    labelStyle: { fontSize: lang.langName === "persian" ? moderateScale(14) : moderateScale(11), fontFamily: lang.font, top: Platform.OS === "ios" ? moderateScale(5) : moderateScale(-2) },
                    indicatorStyle: { backgroundColor: defaultTheme.primaryColor },
                    style: { backgroundColor: defaultTheme.lightBackground, justifyContent: "center", height: moderateScale(42), elevation: 0, borderBottomWidth: 1.5, borderColor: defaultTheme.border },
                    showIcon: true,
                    tabStyle: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: moderateScale(42) },
                }}
                lazy={true}
            >
                <Tab.Screen name="PedometerScreen"
                    children={() => <PedometerScreen route={{ params: null }} onPress={(item) => setisActiveModal(item)} />}
                    options={{
                        tabBarLabel: lang.step,
                        tabBarIcon: ({ tintColor, focused }) => (
                            <Image
                                source={focused ? require("../../../res/img/RunningShoe.png") : require("../../../res/img/RunningShoe.png")}
                                style={{ width: moderateScale(22), height: moderateScale(21), margin: 0 }}
                                tintColor={focused ? defaultTheme.gold : defaultTheme.gray}
                                resizeMode="contain"
                            />
                        )
                    }}
                />

                <Tab.Screen name="GoalActivityScreen" component={GoalActivityScreen}
                    options={{
                        tabBarLabel: lang.report,
                        tabBarIcon: ({ tintColor, focused }) => (
                            !props.hasCredit ? <Image
                                source={focused ? require("../../../res/img/paper.png") : require("../../../res/img/paper.png")}
                                style={{ width: moderateScale(15), height: moderateScale(18), margin: 0 }}
                                tintColor={focused ? defaultTheme.gold : defaultTheme.gray}
                                resizeMode="contain"
                            /> : <Image
                                source={focused ? require("../../../res/img/lock.png") : require("../../../res/img/lock.png")}
                                style={{ width: moderateScale(15), height: moderateScale(18), margin: 0 }}
                                tintColor={focused ? defaultTheme.gold : defaultTheme.gray}
                                resizeMode="contain"
                            />
                        )
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export { PedometerTabs }
