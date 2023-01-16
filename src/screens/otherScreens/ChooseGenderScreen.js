
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager
} from 'react-native';
import { ConfirmButton, PageIndicator } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { updateProfileLocaly } from "../../redux/actions"
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';

const ChooseGenderScreen = props => {

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const [gender, setGender] = React.useState(profile.gender)
  const dispatch = useDispatch()

  const onPress = (gender) => {
    setGender(gender)
    onNext(gender)
  }

  const onNext = (gender) => {
    analytics().logEvent('foodHabitation', {
      id: gender
    })
    dispatch(updateProfileLocaly({ gender: gender }))
    props.navigation.navigate("BodyDetailsScreen")
  }

  const onBack = () => {
    props.navigation.goBack()
  }

  return (
    <View
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
          {lang.selectYoutSex}
        </Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => onPress(1)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.genderContainer, { borderWidth: gender === 1 ? 1 : 0 }]}
          >

            <LottieView
              style={{ width: dimensions.WINDOW_WIDTH * 0.4 }}
              source={require('../../../res/animations/man.json')}
              autoPlay
              loop={true}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(0)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.genderContainer, { borderWidth: gender === 0 ? 1 : 0 }]}
          >
            <LottieView
              style={{ width: dimensions.WINDOW_WIDTH * 0.4 }}
              source={require('../../../res/animations/woman.json')}
              autoPlay
              loop={true}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <ConfirmButton
            title={lang.perBtn}
            style={styles.confirmButton}
            lang={lang}
            onPress={onBack}
            leftImage={require("../../../res/img/back.png")}
            rotate
          />
          <ConfirmButton
            title={lang.continuation}
            style={styles.confirmButton}
            lang={lang}
            onPress={() => onNext(gender)}
            rightImage={require("../../../res/img/next.png")}
            rotate
          />
        </View>
        <PageIndicator
          pages={new Array(6).fill(1)}
          activeIndex={0}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(35),
    marginBottom: moderateScale(30),
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flex: 1,
    width: dimensions.WINDOW_WIDTH,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: moderateScale(75),
    marginTop: moderateScale(30),
    marginBottom: moderateScale(10),
    alignItems: "center",
    justifyContent: "space-around"
  },
  buttonContainer: {
    flexDirection: "row",
    width: dimensions.WINDOW_WIDTH,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  title: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(19),
    alignSelf: "center",
    textAlign: "center",
    width: "85%"
  },
  genderContainer: {
    padding: moderateScale(8),
    borderRadius: 10,
    borderColor: defaultTheme.green
  },
  confirmButton: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
  }
});

export default ChooseGenderScreen;
