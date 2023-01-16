import React, { Profiler } from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Linking,
  View,
  BackHandler
} from 'react-native';
import { ColumnWrapper, ProfileHeader, RowCenter, RowSpaceAround, ProfileRow, TwoOptionModal } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import moment from "moment"
import FastImage from 'react-native-fast-image';

const ProfileScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const profile = useSelector(state => state.profile)
  const [packageEndDate, updatePackageEndDate] = React.useState(moment().diff(moment(profile.pkExpireDate), "d"))
  const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)

  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

  console.log("packageEndDate", packageEndDate)
  console.log("user", user)

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updatePackageEndDate(moment().diff(moment(profile.pkExpireDate), "d"))
    });

    return unsubscribe;
  })
  React.useEffect(() => {
    let backHandler = null
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.navigate("HomeScreen"); return true })
    })

    const blurUnsubscribe = props.navigation.addListener('blur', () => {
      backHandler && backHandler.remove()
    })

    return () => {
      backHandler && backHandler.remove()
      focusUnsubscribe()
      blurUnsubscribe()
    }
  }, [])

  const goToPackages = () => {
    setOptionalDialogVisible(false)
    setTimeout(() => {
      props.navigation.navigate("PackagesScreen")
    }, Platform.OS === "ios" ? 500 : 50)
  }

  const items = React.useRef([
    (Platform.OS === "android" || lang.langName !== "english") && user.countryId == 128 ?
      {
        text: lang.goTopLevel,
        img: require("../../../res/img/cart.png"),
        onPress: () => props.navigation.navigate("PackagesScreen"),
        textStyle: { fontSize: moderateScale(15), color: defaultTheme.primaryColor, fontFamily: lang.titleFont }
      } : null,
    {
      text: lang.myProfile,
      img: require("../../../res/img/profile.png"),
      onPress: () => props.navigation.navigate("EditProfileScreen")
    },
    {
      text: lang.botton_menu_gol,
      img: require("../../../res/img/goaltab.png"),
      onPress: (hasCredit) => {
        // const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
        // const today=moment()
        // const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
        hasCredit ? props.navigation.navigate("EditGoalScreen") : goToPackages()
      }
    },
    {
      text: lang.shareForFriends,
      img: require("../../../res/img/addfriend.png"),
      onPress: () => props.navigation.navigate("InviteScreen")
    },
    {
      text: lang.report,
      img: require("../../../res/img/paper.png"),
      onPress: () => props.navigation.navigate("ReportScreen")
    },
    {
      text: lang.notificationRemaind,
      img: require("../../../res/img/reminder.png"),
      onPress: () => props.navigation.navigate("RemindersListScreen")
    },
    {
      text: lang.pm,
      img: require("../../../res/img/message.png"),
      onPress: () => props.navigation.navigate("MessagesScreen")
    },
    (Platform.OS === "android" || lang.langName !== "english") && user.countryId == 128 ?
    {
      text: lang.bills,
      img: require("../../../res/img/bills.png"),
      onPress: () => props.navigation.navigate("BillScreen")
    }:null,
    // {
    //   text: lang.security,
    //   img: require("../../../res/img/phonelock.png"),
    //   onPress: () => props.navigation.navigate("SecurityScreen")
    // },
    {
      text: lang.support,
      img: require("../../../res/img/call.png"),
      onPress: () => props.navigation.navigate("SupportScreen")
    },
    // {
    //   text: lang.allergyFood,
    //   img: require("../../../res/img/sentiment.png"),
    //   onPress: () => props.navigation.navigate("FoodAllergiesScreen")
    // },
    {
      text: lang.privacy,
      img: require("../../../res/img/shield2.png"),
      onPress: () => props.navigation.navigate("PrivacyPolicyScreen")
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
      onPress: () => props.navigation.navigate("ReferencesScreen")
    },
  ]).current

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        lang={lang}
        user={user}
        profile={profile}
      />
      <View style={{ backgroundColor: defaultTheme.lightBackground, height: moderateScale(50), borderRadius: moderateScale(20), marginTop: moderateScale(-15) }} />
      <RowCenter>
        {
          user.countryId == 128 ? <>{
            packageEndDate < 0 ?
              <Text style={[styles.text2, { fontFamily: lang.font, marginTop: moderateScale(-60) }]} allowFontScaling={false}>
                <Text style={[styles.text, { fontFamily: lang.titleFont, color: defaultTheme.primaryColor }]} allowFontScaling={false}>
                  {
                    Math.abs(parseInt(packageEndDate)) + 1
                  }
                </Text>
                {
                  " " + lang.yourAccountToDate1
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
      </RowCenter>
      <RowSpaceAround>
        <ColumnWrapper>
          <Text style={[styles.text, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
            {specification[1].weightSize + " kg"}
          </Text>
          <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.lastWeight}
          </Text>
        </ColumnWrapper>
        <ColumnWrapper>
          <Text style={[styles.text, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
            {profile.targetWeight + " kg"}
          </Text>
          <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.golWeight}
          </Text>
        </ColumnWrapper>
        <ColumnWrapper>
          <Text style={[styles.text, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
            {specification[0].weightSize + " kg"}
          </Text>
          <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.currentWeight}
          </Text>
        </ColumnWrapper>
      </RowSpaceAround>
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
      {
        lang.langName === "persian" &&
        <RowCenter>
          <TouchableOpacity onPress={() => Linking.openURL("Https://t.me/o2fit_fa")}>
            <FastImage
              source={require("../../../res/img/telegram.jpeg")}
              style={{ width: moderateScale(30), height: moderateScale(30), margin: moderateScale(16) }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("http://www.instagram.com/o2fit.fa")}>
            <FastImage
              source={require("../../../res/img/instagram.jpeg")}
              style={{ width: moderateScale(30), height: moderateScale(30), margin: moderateScale(16) }}
            />
          </TouchableOpacity>
        </RowCenter>
      }
      <TwoOptionModal
        lang={lang}
        visible={optionalDialogVisible}
        onRequestClose={() => setOptionalDialogVisible(false)}
        context={lang.subscribe1}
        button1={lang.iBuy}
        button2={lang.motevajeShodam}
        button1Pressed={goToPackages}
        button2Pressed={() => setOptionalDialogVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(18),
    color: defaultTheme.mainText
  },
  text2: {
    fontSize: moderateScale(15),
    color: defaultTheme.mainText
  }
});

export default ProfileScreen;
