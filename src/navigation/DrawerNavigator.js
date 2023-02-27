import React, { memo, useState } from 'react'
import { Button, View, Text, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './TabNavigator';
import { useSelector } from 'react-redux';
import DrawerHeader from '../components/DrawerComponents/DrawerHeader';
import { dimensions } from '../constants/Dimensions';
import DrawerPremium from '../components/DrawerComponents/DrawerPremium';
import { defaultTheme } from '../constants/theme';
import DrawerItems from '../components/DrawerComponents/DrawerItems';
import { Modal } from 'react-native-paper';
import Power from '../../res/img/power.svg'
import { moderateScale } from 'react-native-size-matters';
import { ConfirmButton } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';


const DrawerNavigator = (props) => {
    const [deletationModal, setDeletationModal] = useState(false)

    const Drawer = createDrawerNavigator()

    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const diet = useSelector(state => state.diet)
    const lang = { ...props.route.params.lang }
    const auth = { ...props.route.params.auth }
    const app = { ...props.route.params.app }
    const user = { ...props.route.params.user }


    const deleteAccount = async () => {
        await AsyncStorage.clear().then(() => {
            AsyncStorage.setItem('deletedAccount', user.username).then(() => {

                RNRestart.Restart()
            })
        })
    }

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
                    setDelete={() => {
                        setDeletationModal(true)
                    }}
                />
            </DrawerContentScrollView>
        )
    }
    return (
        <>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,

                }}

                drawerContent={(props) => (
                    <CustomDrawer {...props} />
                )}

                drawerStyle={{
                    width: dimensions.WINDOW_WIDTH * 0.8,
                }}

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
            <Modal
                visible={deletationModal}
                onDismiss={() => setDeletationModal(false)}
            >
                <View style={{ alignItems: "center" }}>
                    <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: dimensions.WINDOW_HEIGTH * 0.4, backgroundColor: defaultTheme.white, borderRadius: 13, alignItems: "center", justifyContent: "center" }}>
                        <Power width={moderateScale(50)} height={moderateScale(50)} />
                        <Text style={{ paddingVertical: moderateScale(50), fontSize: moderateScale(18), paddingHorizontal: moderateScale(20), textAlign: "center", lineHeight: moderateScale(27) }}>{lang.confirmationDeleteAccount}</Text>
                        <View style={{ bottom: moderateScale(20), position: "absolute", flexDirection: "row", width: dimensions.WINDOW_WIDTH * 0.7, alignItems: "center", justifyContent: "center" }}>
                            <ConfirmButton
                                lang={lang}
                                title={"Yes"}
                                style={{ backgroundColor: defaultTheme.white, borderColor: defaultTheme.error, borderWidth: 1, width: moderateScale(110) }}
                                textStyle={{ color: defaultTheme.darkText }}
                                onPress={deleteAccount}
                            />
                            <ConfirmButton
                                lang={lang}
                                title={"No"}
                                style={{ backgroundColor: defaultTheme.green, width: moderateScale(110) }}
                                textStyle={{}}
                                onPress={() => setDeletationModal(false)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default DrawerNavigator