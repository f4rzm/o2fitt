import React, { memo } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native"
import { defaultTheme } from "../constants/theme";
import { TabBarIcon, TabPlusButton } from "../components"
import { moderateScale } from "react-native-size-matters";
import Recipe from '../../res/img/reciep.svg'

const TabBar = ({ state, descriptors, navigation, lang, profile, fastingDiet }) => {


    return (
        <View style={styles.container}>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    return (
                        <TabBarIcon
                            descriptors={descriptors}
                            state={state}
                            navigation={navigation}
                            route={route}
                            index={index}
                            image={options.tabBarIcon}
                            name={options.tabBarLabel}
                            font={lang.font}
                        />
                    )
                })
            }
            {/* <TabBarIcon
                descriptors={descriptors}
                state={state}
                navigation={navigation}
                route={state.routes[0]}
                index={0}
                image={require("../../res/img/home.png")}
                name={lang.botton_menu_home}
                font={lang.font}
            />
            <TabBarIcon
                descriptors={descriptors}
                state={state}
                navigation={navigation}
                route={state.routes[1]}
                index={1}
                image={require("../../res/img/daily.png")}
                name={lang.botton_menu_calender}
                font={lang.font}
            />
            <TabBarIcon
                descriptors={descriptors}
                state={state}
                navigation={navigation}
                route={state.routes[2]}
                index={2}
                image={require("../../res/img/plan-icon.png")}
                name={lang.PayDietName}
                font={lang.font}
            /> */}
            {/* <TabPlusButton
                navigation={navigation}
                lang={lang}
                profile={profile}
                fastingDiet={fastingDiet}
            /> */}
            {/* <TabBarIcon
                descriptors={descriptors}
                state={state}
                navigation={navigation}
                route={state.routes[3]}
                index={3}
                image={require("../../res/img/goaltab.png")}
                name={lang.botton_menu_gol}
                font={lang.font}
            />
            {
                lang.langName !== "persian" ?
                    <TabBarIcon
                        descriptors={descriptors}
                        state={state}
                        navigation={navigation}
                        route={state.routes[4]}
                        index={4}
                        image={require("../../res/img/profile.png")}
                        name={lang.botton_menu_profile}
                        font={lang.font}
                    /> :
                    <TabBarIcon
                        descriptors={descriptors}
                        state={state}
                        navigation={navigation}
                        route={state.routes[4]}
                        index={4}
                        image={require("../../res/img/ChiefHood.png")}
                        name={lang.chief}
                        font={lang.font}
                    />
            } */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: "rgba(255,255,255,0.9)",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: moderateScale(50),
        paddingTop: 3,
        borderColor: defaultTheme.border,
        bottom: moderateScale(0),
        alignSelf: "center",
        // borderRadius: 12,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // borderRadius:15,
        position: "absolute"

    },
})

export default TabBar