import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import AnimatedLottieView from 'lottie-react-native'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import moment from 'moment'
import {DrawerActions, useNavigation} from '@react-navigation/native'

const DrawerPremium = (props) => {
    const navigation=useNavigation()
    const lang = props.lang
    const user = props.user
    const profile = props.profile
    const [packageEndDate, updatePackageEndDate] = React.useState(moment().diff(moment(profile.pkExpireDate), "d"))
    console.warn(profile.pkExpireDate);
    return (
        <TouchableRipple
            onPress={() => {
                
                navigation.navigate("PackagesScreen")
                setTimeout(() => {
                    navigation.dispatch(DrawerActions.closeDrawer());
    
                }, 1000);
            }}
            style={{ marginTop: moderateScale(-4),borderBottomWidth:1,borderColor:defaultTheme.border }}
            rippleColor={defaultTheme.primaryLightColor}
            
        >
            <View style={styles.container}>
                <AnimatedLottieView
                    source={require('../../../res/animations/vip.json')}
                    autoPlay={true}
                    loop={false}
                    style={{ width: moderateScale(90), height: moderateScale(90) }}
                />
                <View>
                    <Text style={[styles.premiumText, { fontFamily: lang.font }]}>{lang.buyAccountTitle}</Text>
                    {
                        user.countryId == 128 ? <>{
                            packageEndDate < 0 ?
                                <Text style={[styles.text2, { fontFamily: lang.font}]} allowFontScaling={false}>
                                    {lang.premiumSituation}
                                    <Text style={[styles.text, { fontFamily: lang.titleFont, color: defaultTheme.primaryColor }]} allowFontScaling={false}>
                                        {
                                            Math.abs(parseInt(packageEndDate))
                                        }
                                    </Text>
                                    {
                                        " " + lang.daysRemain
                                    }
                                </Text> : <Text style={[styles.text, { fontFamily: lang.font, color: defaultTheme.primaryColor }]} allowFontScaling={false}>
                                    {
                                        lang.noSubscribe
                                    }
                                </Text>
                        }
                        </>
                            : null

                    }
                </View>
                <View style={{alignItems:"flex-end",flex:1}}>
                <Image
                source={require("../../../res/img/back.png")}
                style={{tintColor:defaultTheme.subText,width:moderateScale(20),height:moderateScale(20),resizeMode:'contain',}}
                />

                </View>
            </View>
        </TouchableRipple>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    premiumText: {
        fontSize: moderateScale(16),
        color:defaultTheme.darkText
    },
    text:{
        fontSize:moderateScale(15)
    },
    text2:{
        fontSize:moderateScale(15)
    }
})

export default DrawerPremium