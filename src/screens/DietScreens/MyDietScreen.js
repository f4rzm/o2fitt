import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { ConfirmButton, DietCard } from '../../components'
import { moderateScale } from 'react-native-size-matters'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import AnimatedLottieView from 'lottie-react-native'
import { dimensions } from '../../constants/Dimensions'
import { defaultTheme } from '../../constants/theme'
import ActiveDietRow from '../../components/ActiveDietRow'
import FastingDietplan from '../FastingDiet/FastingDietplan'
import DietplanOld from './DietplanOld'
import DietPlan from './DietPlan'

const MyDietScreen = () => {

  const dietNew = useSelector(state => state.dietNew)
  const diet = useSelector(state => state.diet)
  const profile = useSelector(state => state.profile)
  const fastingDiet = useSelector(state => state.fastingDiet)
  const lang = useSelector(state => state.lang)
  const specification = useSelector(state => state.specification)
  const navigation = useNavigation()
  console.warn('diets', fastingDiet.endDate, dietNew.isOld, dietNew.allBreakfast.length);

  const onDietPressed = () => {

    if (diet.isActive == true && diet.isBuy == true) {
      if (
        parseInt(moment(fastingDiet.startDate).format('YYYYMMDD')) <=
        parseInt(moment().format('YYYYMMDD')) &&
        (fastingDiet.endDate
          ? parseInt(moment(fastingDiet.endDate).format('YYYYMMDD')) >=
          parseInt(moment().format('YYYYMMDD'))
          : true)
      ) {
        navigation.navigate('FastingDietplan');
      } else {
        navigation.navigate('DietPlanScreen');
      }
    } else if (diet.isActive == false && diet.isBuy == true) {
      navigation.navigate('DietStartScreen');
    } else if (diet.isActive == true && diet.isBuy == false) {
      navigation.navigate('PackagesScreen');
    } else {
      navigation.navigate('DietStartScreen');
    }
  };

  const renderDiet = () => {
    if (dietNew.isOld) {
      if (diet.isActive && fastingDiet.isActive == false) {
        return (
          <DietplanOld
          // diet={diet}
          // lang={lang}
          // onPress={onDietPressed}
          />
        )
      } else if (diet.isActive && fastingDiet.isActive) {
        return <FastingDietplan />
      } else {
        return (
          <>
            <AnimatedLottieView
              source={require('../../../res/animations/mealplan.json')}
              style={{ width: dimensions.WINDOW_WIDTH * 0.4 }}
              autoPlay={true}
              loop={true}
            />
            <Text style={[styles.text2, { fontFamily: lang.font, lineHeight: moderateScale(25) }]}>
              {`هنوز برنامه غذایی ندارین ! \nبرای دریافت برنامه غذایی`}
              <TouchableOpacity
                onPress={() => navigation.navigate('DietStartScreen')}
              >
                <Text style={[styles.text2, { color: defaultTheme.green, fontFamily: lang.font, }]}> کلیک کنین </Text>
              </TouchableOpacity>
            </Text>
          </>
        )
      }
    } else {
      if (dietNew.isActive && fastingDiet.isActive == false) {
        return (
          <DietPlan
          // diet={diet}
          // lang={lang}
          // onPress={onDietPressed}
          />
        )
      } else if (dietNew.isActive && fastingDiet.isActive) {

        return <FastingDietplan />
      } else {
        return (
          <>
            <AnimatedLottieView
              source={require('../../../res/animations/mealplan.json')}
              style={{ width: dimensions.WINDOW_WIDTH * 0.4 }}
              autoPlay={true}
              loop={true}
            />
            <Text style={[styles.text2, { fontFamily: lang.font, lineHeight: moderateScale(25) }]}>
              {`هنوز برنامه غذایی ندارین ! \nبرای دریافت برنامه غذایی`}
              <TouchableOpacity
                onPress={() => navigation.navigate('DietStartScreen')}
              >
                <Text style={[styles.text2, { color: defaultTheme.green, fontFamily: lang.font, }]}> کلیک کنین </Text>
              </TouchableOpacity>
            </Text>
          </>
        )
      }
    }

  }
  return (
    <View style={styles.container}>
      {/* <DietCard
        lang={lang}
        profile={profile}
        specification={specification}
        diet={diet}
        fastingDiet={fastingDiet}
        onCardPressed={onDietPressed}
      /> */}

      {/* {
        dietNew.isActive && fastingDiet.isActive ?

          <FastingDietplan
          // diet={diet}
          // lang={lang}
          // onPress={onDietPressed}
          />
          :
          diet.isActive ?
            <DietPlan

            />

            :
            
      } */}
      {renderDiet()}
    </View>

  )
}

export default MyDietScreen

const styles = StyleSheet.create({
  container: {
    maxHeight: dimensions.WINDOW_HEIGTH,
    // paddingVertical: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: moderateScale(100)
  },
  text2: {
    fontSize: moderateScale(15),
    textAlign: "center",
  }
})