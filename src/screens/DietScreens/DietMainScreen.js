import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConfirmButton, MainToolbar } from '../../components'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import MainToolbarWithTopCurve from '../../components/ScreentTemplate/MainToolbarWithTopCurve'
import { lang } from '../../redux/reducers/lang/lang';
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController'
import DietCategoryItems from '../../components/dietComponents/DietCategoryItems'
import { dimensions } from '../../constants/Dimensions'
import DietBanner from '../../components/dietComponents/DietBanner'
import MainToolbarWithTopCurveView from '../../components/ScreentTemplate/MainToolbarWithTopCurveView'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MyCustomTabBar from '../../components/Navigators/CustomTabNavigator'
// import CustomTopTabNavigator from '../../components/CustomTopTabNavigator'
import MyDietScreen from './MyDietScreen'
import DietCategoryScreen from './DietCategoryScreen'
import { useNavigation } from '@react-navigation/native'

const DietMainScreen = (props) => {
    const dietNew = useSelector(state => state.dietNew)
    const diet = useSelector(state => state.diet)
    const lang = useSelector(state => state.lang)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const Tabs = createMaterialTopTabNavigator()
    const navigation=useNavigation()
    useEffect(() => {
        navigation.navigate("SetRefferalCode1")
    
      return () => {
        
      }
    }, [])
    
    return (
        <MainToolbarWithTopCurveView
            onMessagePressed={() => props.navigation.navigate('MessagesScreen')}
            unreadNum={app.unreadMessages}
            lang={lang}
            contentScrollViewStyle={styles.containerContent}
        >
            {/* <CustomTopTabNavigator
                items={Screens}
                lang={lang}
                Screens={pages}
            />   */}
            <Tabs.Navigator
                tabBar={(props) => <MyCustomTabBar {...props} cardWidth={dimensions.WINDOW_WIDTH * 0.97 / 2} lang={lang} />}
                needsOffscreenAlphaCompositing={true}
                screenOptions={{
                    // swipeEnabled: false
                    
                }}
                initialRouteName={dietNew.isActive || diet.isActive ? 'MyDietTab' : "DietCategoryTab"}
            >
                <Tabs.Screen options={{ title: lang.myDiets }} name='MyDietTab' children={() => <MyDietScreen />} />
                <Tabs.Screen options={{ title: lang.diets, }} name='DietCategoryTab' children={() => <DietCategoryScreen />} />
            </Tabs.Navigator>
        </MainToolbarWithTopCurveView>
    )
}

export default DietMainScreen

const styles = StyleSheet.create({

})