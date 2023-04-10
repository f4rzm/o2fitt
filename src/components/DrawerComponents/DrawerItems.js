import { View, Text, Linking } from 'react-native'
import React, { memo } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'
import ProfileRow from '../ProfileRow'
import moment from 'moment'

const DrawerItems = (props) => {
    const user = props.user
    const lang = props.lang
    const profile = props.lang
    const navigation = useNavigation()
    const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

    const goToPackages = () => {

        setTimeout(() => {
            props.navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }

    const items = React.useRef([

        {
            text: lang.myProfile,
            img: require("../../../res/img/profile.png"),
            onPress: () => navigation.navigate("EditProfileScreen")
        },
        // {
        //     text: lang.botton_menu_gol,
        //     img: require("../../../res/img/goaltab.png"),
        //     onPress: () => {
        //         // const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
        //         // const today=moment()
        //         // const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
        //         hasCredit ? navigation.navigate("EditGoalScreen") : goToPackages()
        //     }
        // },
        {
            text: lang.shareForFriends,
            img: require("../../../res/img/addfriend.png"),
            onPress: () => {

                navigation.navigate("InviteScreen")
            }
        },
        lang.langName !== "english" && user.countryId == 128 ?
            {
                text: lang.setShareFriend,
                img: require("../../../res/img/exchange.png"),
                onPress: () => {
                    navigation.navigate("SetRefferalCode")
                }
            } : null,
        {
            text: lang.report,
            img: require("../../../res/img/paper.png"),
            onPress: () => navigation.navigate("ReportScreen")
        },
        {
            text: lang.notificationRemaind,
            img: require("../../../res/img/reminder.png"),
            onPress: () => navigation.navigate("RemindersListScreen")
        },
        {
            text: lang.pm,
            img: require("../../../res/img/message.png"),
            onPress: () => navigation.navigate("MessagesScreen")
        },
        (Platform.OS === "android" || lang.langName !== "english") && user.countryId == 128 ?
            {
                text: lang.bills,
                img: require("../../../res/img/bills.png"),
                onPress: () => navigation.navigate("BillScreen")
            } : null,
        // {
        //   text: lang.security,
        //   img: require("../../../res/img/phonelock.png"),
        //   onPress: () => navigation.navigate("SecurityScreen")
        // },
        {
            text: lang.support,
            img: require("../../../res/img/call.png"),
            onPress: () => navigation.navigate("SupportScreen")
        },
        // {
        //   text: lang.allergyFood,
        //   img: require("../../../res/img/sentiment.png"),
        //   onPress: () => navigation.navigate("FoodAllergiesScreen")
        // },
        {
            text: lang.privacy,
            img: require("../../../res/img/shield2.png"),
            onPress: () => navigation.navigate("PrivacyPolicyScreen")
        },
        {
            text: lang.guide,
            img: require("../../../res/img/help.png"),
            onPress: () => Linking.openURL("https://o2fitt.com/?culture=" + lang.langLocaleAbout)
        },
        {
            text: lang.oxygenFitt,
            img: require("../../../res/img/amaze.png"),
            onPress: () => Linking.openURL("https://o2fitt.com/?culture=" + lang.langLocaleAbout)
        },
        {
            text: lang.references,
            img: require("../../../res/img/amaze.png"),
            onPress: () => navigation.navigate("ReferencesScreen")
        },
    ]).current
    return (
        <View>
            {
                items.slice(0, Platform.OS === "ios" && lang.langName === "english" ? items.length : items.length - 1).filter(item => item != null).map(item => (

                    <ProfileRow
                        key={item.text}
                        lang={lang}
                        item={item}
                        hasCredit={hasCredit}
                    />
                ))
            }
        </View>
    )
}

export default memo(DrawerItems)