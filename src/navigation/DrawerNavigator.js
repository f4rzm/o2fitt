import React, { memo } from 'react'
import { Button, View, Text, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './TabNavigator';
import { useSelector } from 'react-redux';
import DrawerHeader from '../components/DrawerComponents/DrawerHeader';
import { dimensions } from '../constants/Dimensions';
import DrawerPremium from '../components/DrawerComponents/DrawerPremium';
import { defaultTheme } from '../constants/theme';
import DrawerItems from '../components/DrawerComponents/DrawerItems';

const DrawerNavigator = (props) => {

    const Drawer = createDrawerNavigator()

    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const diet = useSelector(state => state.diet)
    const lang = { ...props.route.params.lang }
    const auth = { ...props.route.params.auth }
    const app = { ...props.route.params.app }
    const user = { ...props.route.params.user }


    const CustomDrawer = (props) => {
        const width = useWindowDimensions().width * 0.3;
        return (
            <DrawerContentScrollView >
                <DrawerHeader
                    lang={lang}
                    user={user}
                    profile={profile}
                    specification={specification}
                />
                {
                    user.countryId == 128 &&
                    <DrawerPremium
                        lang={lang}
                        user={user}
                        profile={profile}
                        specification={specification}
                    />
                }
                <DrawerItems
                    lang={lang}
                    user={user}
                    profile={profile}
                    specification={specification}
                />
            </DrawerContentScrollView>
        )
    }
    return (
        <Drawer.Navigator

            drawerContent={(props) => (
                <CustomDrawer {...props} />
            )}

            drawerStyle={{
                width: dimensions.WINDOW_WIDTH * 0.8,
            }}
            screenOptions={{ headerShown: false,drawerStatusBarAnimation:'fade' }}
            drawerType='slide'
            
        >
            <Drawer.Screen
                name="Tabs"
                component={Tabs}
                initialParams={{
                    lang: lang,
                    profile: profile,
                    auth: auth,
                    app: app,
                    user: user
                }}
            />
            {/* <Drawer.Screen name="homeprofile" component={() => <View><Text>asdhpi</Text></View>} /> */}
        </Drawer.Navigator>
    )
}

export default DrawerNavigator