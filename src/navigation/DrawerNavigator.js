import React, { memo, useState } from 'react'
import { Button, View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './TabNavigator';
import { useDispatch, useSelector } from 'react-redux';
import DrawerHeader from '../components/DrawerComponents/DrawerHeader';
import { dimensions } from '../constants/Dimensions';
import DrawerPremium from '../components/DrawerComponents/DrawerPremium';
import { defaultTheme } from '../constants/theme';
import DrawerItems from '../components/DrawerComponents/DrawerItems';
import RamadanSwitch from '../components/RamadanSwitch';
import { clearFastingDiet, setActivaitonAndDeativation, setFastingActivation } from '../redux/actions/fasting';
import moment from 'moment'
import { Modal } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { BlurView } from '@react-native-community/blur';
import { ConfirmButton } from '../components';
import { clearDiet, shutDownDiet } from '../redux/actions/dietNew';
import analytics from '@react-native-firebase/analytics';
import { urls } from '../utils/urls';
import { RestController } from '../classess/RestController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'
import Power from '../../res/img/power.svg'

const DrawerNavigator = (props) => {
    const [deletationModal, setDeletationModal] = useState(false)

    const Drawer = createDrawerNavigator()

    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const diet = useSelector(state => state.diet)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const lang = { ...props.route.params.lang }
    const auth = { ...props.route.params.auth }
    const app = { ...props.route.params.app }
    const user = { ...props.route.params.user }
    const dispatch = useDispatch()
    const [normalDietModal, setNormalDietModal] = useState(false)
    const [showFastingModal, setShowFastingModal] = useState(false)

    const deleteAccount = async () => {
        await AsyncStorage.clear().then(() => {
            AsyncStorage.setItem('deletedAccount', user.username).then(() => {

                RNRestart.Restart()
            })
        })
    }

    const CustomDrawer = (props) => {
        const width = useWindowDimensions().width * 0.7;
        return (
            <DrawerContentScrollView>
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
                {
                    lang.langName !== "english" && user.countryId == 128 &&
                    <RamadanSwitch
                        isActive={fastingDiet.isActive}
                        onChangeSwitch={(e) => {
                            if (e == true) {
                                setShowFastingModal(true)
                            }
                            else {
                                setNormalDietModal(true)
                            }
                        }}
                        lang={lang}
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

    const setFastingServerActivationTrue = () => {
        const url = urls.userBaseUrl + urls.userProfiles + "updateFastingMode"
        const RC = new RestController()
        const params = {
            userId: user.id,
            fastingMode: true
        }
        const header = { headers: { Authorization: "Bearer " + auth.access_token } }

        RC.put(url, params, header, onSuccessRead, () => onFailureRead(params));
    }
    const onFailureRead = (params) => {

        const url = urls.userBaseUrl + urls.userProfiles + "updateFastingMode"
        offlineDB.post({
            method: "put",
            type: "profile",
            url: url,
            header: { headers: { Authorization: "Bearer " + auth.access_token } },
            params: params
        }).then(res => {
            onSuccess()
        })
    }
    const onSuccessRead = (params) => {

    }
    const setFastingServerActivationFasle = () => {
        const url = urls.userBaseUrl + urls.userProfiles + "updateFastingMode"
        const RC = new RestController()
        const header = { headers: { Authorization: "Bearer " + auth.access_token } }

        const params = {
            userId: user.id,
            isActive: true
        }

        RC.put(url, params, header, onSuccessRead, () => onFailureRead(params));
    }
    return (
        <>

            <Drawer.Navigator

                drawerContent={(props) => (
                    <CustomDrawer {...props} />
                )}

                drawerStyle={{
                    width: dimensions.WINDOW_WIDTH * 0.8,
                }}
                screenOptions={{
                    headerShown: false,
                    drawerStatusBarAnimation: 'fade',
                    drawerStyle: {
                        width: dimensions.WINDOW_WIDTH * 0.8,
                    }
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
                onDismiss={() => setShowFastingModal(false)}
                visible={showFastingModal}
                style={{ alignItems: "center", justifyContent: "center" }}

            >
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: "white", padding: moderateScale(20), borderRadius: moderateScale(10), alignItems: "center" }}>
                    <Text style={[styles.textHeader, { fontFamily: lang.font }]}>حالت روزه داری براتون فعال بشه؟</Text>
                    {
                        diet.isActive &&
                        <Text style={[styles.desText, { fontFamily: lang.font }]}>با انتخاب بله، اگر از امکان برنامه غذایی استفاده میکنین، برنامه غذایی فعلیتون لغو میشه و متناسب با روزه داری باید مجدد رژیم دریافت کنین.</Text>
                    }
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <ConfirmButton
                            lang={lang}
                            title={lang.yes}
                            onPress={() => {
                                setFastingServerActivationTrue()
                                analytics().logEvent('ramadan_switch_True')
                                if (diet.isActive) {
                                    dispatch(clearFastingDiet())
                                    dispatch(shutDownDiet())
                                    dispatch(clearDiet())
                                }
                                dispatch(setActivaitonAndDeativation({ startDate: moment().format("YYYY-MM-DD"), isActive: true, endDate: null }))
                                setShowFastingModal(false)

                            }}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.35, backgroundColor: defaultTheme.green, elevation: 2 }}
                            textStyle={{ color: defaultTheme.white }}
                        />
                        <ConfirmButton
                            lang={lang}
                            title={lang.no}
                            onPress={() => {
                                setShowFastingModal(false)
                            }}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.35, backgroundColor: defaultTheme.white, borderWidth: 1, borderColor: defaultTheme.error, elevation: 2 }}
                            textStyle={{ color: defaultTheme.error }}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                onDismiss={() => setNormalDietModal(false)}
                visible={normalDietModal}
                style={{ alignItems: "center", justifyContent: "center" }}

            >
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: "white", padding: moderateScale(20), borderRadius: moderateScale(10), alignItems: "center" }}>
                    <Text style={[styles.textHeader, { fontFamily: lang.font }]}>حالت روزه داری براتون غیر فعال بشه؟</Text>
                    {
                        diet.isActive &&
                        <Text style={[styles.desText, { fontFamily: lang.font }]}>با انتخاب بله، اگر از امکان برنامه غذایی استفاده میکنین، برنامه غذایی روزه داری لغو میشه و باید مجدد رژیم دریافت کنین.</Text>
                    }
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <ConfirmButton
                            lang={lang}
                            title={lang.yes}
                            onPress={() => {
                                analytics().logEvent('ramadan_switch_False')
                                setFastingServerActivationFasle()
                                if (diet.isActive) {
                                    dispatch(clearFastingDiet())
                                    dispatch(shutDownDiet())
                                    dispatch(clearDiet())
                                }
                                dispatch(setActivaitonAndDeativation({ endDate: moment().subtract(1, 'day').format("YYYY-MM-DD"), isActive: false }))
                                setNormalDietModal(false)
                            }}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.35, backgroundColor: defaultTheme.green, elevation: 2 }}
                        />
                        <ConfirmButton
                            lang={lang}
                            title={lang.no}
                            onPress={() => {
                                setNormalDietModal(false)
                            }}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.35, backgroundColor: defaultTheme.white, borderWidth: 1, borderColor: defaultTheme.error, elevation: 2 }}
                            textStyle={{ color: defaultTheme.error }}
                        />
                    </View>
                </View>

            </Modal>
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
const styles = StyleSheet.create({
    textHeader: {
        textAlign: "center",
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
        marginBottom: moderateScale(30)
    },
    desText: {
        textAlign: "center",
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        marginBottom: moderateScale(30)
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})