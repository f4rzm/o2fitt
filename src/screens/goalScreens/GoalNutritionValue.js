import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Image,
  I18nManager,
  ScrollView,
  BackHandler
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { TwoOptionModal, MealDetailsCard, RowSpaceBetween, BlurComponent, DropDown, ConfirmButton, RowStart, ColumnCenter, RowSpaceAround } from '../../components';
import { nutritions } from "../../utils/nutritions"
import moment from "moment"
import PouchDB from '../../../pouchdb'


const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })

const GoalNutritionValue = props => {

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const specification = useSelector(state => state.specification)
  const user = useSelector(state => state.user)
  const [targetCalorie, setTargetCalorie] = React.useState(2000)
  const [targetCarbo, setTargetCarbo] = React.useState(2000)
  const [targetPro, setTargetPro] = React.useState(2000)
  const [targetFat, setTargetFat] = React.useState(2000)
  const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
  const [mealsNutirtions, setMealsNutritions] = React.useState(new Array(34).fill(0))

  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
  let unblurComponents = null
  let blurComponents = null

  React.useEffect(() => {
    getMealFromDB()
    mealDB.changes({ since: 'now', live: true }).on('change', getMealFromDB)
  }, [])

  React.useEffect(() => {
    const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
    const nowMoment = moment()
    const age = nowMoment.diff(birthdayMoment, "years")
    const height = profile.heightSize
    const weight = specification[0].weightSize
    const wrist = specification[0].wristSize
    const targetWeight = profile.targetWeight
    let bmr = 1
    let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
    let bodyType = null
    let targetCalorie = 0
    let carbo = 0
    let pro = 0
    let fat = 0

    console.log(age)
    console.log(height)
    console.log(weight)
    console.log(wrist)
    if (profile.gender == 1) {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
      if (factor > 10.4) bodyType = 1;
      else if (factor < 9.6) bodyType = 3
      else bodyType = 2
    }
    else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
      if (factor > 11) bodyType = 1;
      else if (factor < 10.1) bodyType = 3
      else bodyType = 2
    }

    console.log("profile.dailyActivityRate", profile.dailyActivityRate)
    switch (profile.dailyActivityRate) {
      case 10:
        targetCalorie = (bmr * 1)
        break
      case 20:
        targetCalorie = (bmr * 1.2)
        break
      case 30:
        targetCalorie = (bmr * 1.375)
        break
      case 40:
        targetCalorie = (bmr * 1.465)
        break
      case 50:
        targetCalorie = (bmr * 1.55)
        break
      case 60:
        targetCalorie = (bmr * 1.725)
        break
      case 70:
        targetCalorie = (bmr * 1.9)
        break
    }


    const targetCaloriPerDay = (7700 * profile.weightChangeRate * 0.001) / 7
    // checkForZigZagi
    if (weight > targetWeight) {
      if (user.countryId === 128) {
        if (moment().day() == 4) {
          targetCalorie *= 1.117
        } else if (moment().day() == 5) {
          targetCalorie *= 1.116
        } else {
          targetCalorie *= 0.97
        }
      }
      else {
        if (moment().day() == 6) {
          targetCalorie *= 1.117
        } else if (moment().day() == 0) {
          targetCalorie *= 1.116
        } else {
          targetCalorie *= 0.97
        }
      }
      targetCalorie -= targetCaloriPerDay
    }
    else if (weight < targetWeight) {
      targetCalorie += targetCaloriPerDay
    }

    targetCalorie = parseInt(targetCalorie)

    if (factor) {
      switch (bodyType) {
        case 1:
          fat = targetCalorie * 0.32
          carbo = targetCalorie * 0.33
          pro = targetCalorie * 0.35
          break
        case 2:
          fat = targetCalorie * 0.3
          carbo = targetCalorie * 0.49
          pro = targetCalorie * 0.21
          break
        case 3:
          fat = targetCalorie * 0.4
          carbo = targetCalorie * 0.35
          pro = targetCalorie * 0.25
          break
      }
    }
    else {
      fat = targetCalorie * 0.33
      carbo = targetCalorie * 0.33
      pro = targetCalorie * 0.34
    }

    setTargetCalorie(parseInt(targetCalorie))
    setTargetCarbo(parseInt(carbo / 4))
    setTargetFat(parseInt(fat / 9))
    setTargetPro(parseInt(pro / 4))

  }, [specification, profile])

  React.useEffect(() => {
    let backHandler = null
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.navigate("GoalWeightScreen"); return true })
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

  const getMealFromDB = (date) => {

    const reg = RegExp("^" + moment(date).format("YYYY-MM-DD"), "i")
    mealDB.find({
      selector: { insertDate: { $regex: reg } },
    }).then(records => {
      console.log("meal rec", records)
      const meals = records.docs.map(item => ({ ...item }))
      const nutritions = new Array(34).fill(0)
      new Array(34).fill(0).map((item, index) => {
        let value = 0
        meals.map((meal, i) => {
          const nut = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",").map(i => parseFloat(i)) : meal.foodNutrientValue.map(i => parseFloat(i))
          value += parseFloat(nut[index])
        })
        nutritions[index] = value
      })
      console.log("meal nutritions", nutritions)
      setMealsNutritions(nutritions)
    })
  }

  const goToPackages = () => {
    setTimeout(() => {
      props.navigation.navigate("PackagesScreen")
    }, Platform.OS === "ios" ? 500 : 50)
  }

  const editGoal = () => {
    if (hasCredit) {
      props.navigation.navigate("EditGoalNutritionScreen")
    }
    else {
      goToPackages()
    }
  }

  let nutritionsValue = null
  if (typeof (profile.targetNutrient) === "string") {
    nutritionsValue = profile.targetNutrient.split(",").map(i => parseFloat(i))
  }
  else {
    nutritionsValue = profile.targetNutrient.map(i => parseFloat(i))
  }
  unblurComponents =
    nutritions.map((item, index) => (
      (item.id != 1 && item.id != 2 && item.id != 10 && item.id != 24 && item.id != 32) &&
      <RowSpaceBetween style={[styles.rowContainer, { paddingHorizontal: 0 }]} key={index.toString()}>
        <Text style={[styles.text, { fontFamily: lang.font, textAlign: "left", marginHorizontal: moderateScale(8) }]} allowFontScaling={false}>
          {item[lang.langName] + ` (${item.unit})`}
        </Text>
        <RowSpaceBetween style={[styles.row, { width: dimensions.WINDOW_WIDTH * 0.65 }]}>
          {
            !hasCredit ?
              <View style={styles.lockContainer}>
                <Image
                  source={require("../../../res/img/lock.png")}
                  style={styles.lock}
                  resizeMode="contain"
                />
              </View> :
              <Text style={[
                styles.text,
                {
                  fontFamily: lang.font,
                }
              ]}
                allowFontScaling={false}
              >
                {parseFloat(nutritionsValue[parseInt(item.id) - 1]).toFixed(1)}
              </Text>
          }
          {
            !hasCredit ?
              <View style={styles.lockContainer}>
                <Image
                  source={require("../../../res/img/lock.png")}
                  style={styles.lock}
                  resizeMode="contain"
                />
              </View> :
              <Text style={[
                styles.text,
                {
                  fontFamily: lang.font,
                }
              ]}
                allowFontScaling={false}
              >
                {parseFloat(mealsNutirtions[parseInt(item.id) - 1]).toFixed(1)}
              </Text>
          }
          {
            !hasCredit ?
              <View style={styles.lockContainer}>
                <Image
                  source={require("../../../res/img/lock.png")}
                  style={styles.lock}
                  resizeMode="contain"
                />
              </View> :
              <Text style={[
                styles.text,
                {
                  fontFamily: lang.font,
                  color: parseFloat(nutritionsValue[parseInt(item.id) - 1]) - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) >= 0 ? defaultTheme.green : defaultTheme.gray
                }
              ]}
                allowFontScaling={false}
              >
                {parseFloat(nutritionsValue[parseInt(item.id) - 1]) - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) > 0 ?
                  (parseFloat(nutritionsValue[parseInt(item.id) - 1]) - parseFloat(mealsNutirtions[parseInt(item.id) - 1])).toFixed(1) :
                  0
                }
              </Text>
          }
        </RowSpaceBetween>
      </RowSpaceBetween>
    ))

  return (
    <View style={styles.mainContainer}>

      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: moderateScale(50) }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1, 5]}
      >
        {/* <RowStart style={styles.titleContainer}>
              <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {lang.golInDay}
                </Text>
            </RowStart> */}

        <MealDetailsCard
          lang={lang}
          fat={parseInt(targetFat)}
          carbo={parseInt(targetCarbo)}
          protein={parseInt(targetPro)}
          calorie={parseInt(targetCalorie)}
          // renderButton={true}
          buttonStyle={{ height: moderateScale(45), backgroundColor: defaultTheme.green }}
          showLock={!hasCredit}
          user={user}
          showMealDetails={true}

        />
        <RowSpaceBetween style={[styles.titleContainer, { paddingHorizontal: 0, marginVertical: moderateScale(5) }]}>
          <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
            {lang.bigNutrition}
          </Text>
          <RowSpaceBetween style={[styles.row]}>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.gol}
            </Text>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.get}
            </Text>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.modWater}
            </Text>
          </RowSpaceBetween>
        </RowSpaceBetween>
        {
          nutritions.map((item, index) => {
            const val = item.id == 1 ? targetFat :
              item.id == 10 ? targetPro : targetCarbo
            return (
              (item.id == 1 || item.id == 10 || item.id == 32) &&
              <RowSpaceBetween style={[styles.rowContainer, { paddingHorizontal: 0 }]} key={index.toString()}>
                <Text style={[styles.text, { fontFamily: lang.font, textAlign: "left", marginHorizontal: moderateScale(8) }]} allowFontScaling={false}>
                  {item[lang.langName] + ` (${item.unit})`}
                </Text>
                <RowSpaceBetween style={[styles.row, { width: dimensions.WINDOW_WIDTH * 0.65 }]}>
                  {
                    hasCredit ?
                      <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                          val.toFixed(1)
                        }
                      </Text>
                      :

                      <View style={styles.lockContainer}>
                        <Image
                          source={require("../../../res/img/lock.png")}
                          style={styles.lock}
                          resizeMode="contain"
                        />
                      </View>
                  }
                  {hasCredit ? <Text style={[
                    styles.text,
                    {
                      fontFamily: lang.font,
                    }
                  ]}
                    allowFontScaling={false}
                  >
                    {mealsNutirtions[parseInt(item.id) - 1].toFixed(1)}
                  </Text> : <Image
                    source={require("../../../res/img/lock.png")}
                    style={styles.lock}
                    resizeMode="contain"
                  />}
                  {
                    hasCredit ?
                      <Text style={[
                        styles.text,
                        {
                          fontFamily: lang.font,
                          color: val - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) >= 0 ? defaultTheme.green : defaultTheme.error
                        }
                      ]}
                        allowFontScaling={false}
                      >
                        {val - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) > 0 ?
                          (val - parseFloat(mealsNutirtions[parseInt(item.id) - 1])).toFixed(1) :
                          0
                        }
                      </Text>
                      :

                      <View style={styles.lockContainer}>
                        <Image
                          source={require("../../../res/img/lock.png")}
                          style={styles.lock}
                          resizeMode="contain"
                        />
                      </View>
                  }
                </RowSpaceBetween>
              </RowSpaceBetween>
            )
          }
          )

        }
        <RowSpaceBetween style={[styles.titleContainer, { paddingHorizontal: 0, marginVertical: moderateScale(5) }]}>
          <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
            {lang.micronutrientFood}
          </Text>
          <RowSpaceBetween style={[styles.row]}>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.gol}
            </Text>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.get}
            </Text>
            <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
              {lang.modWater}
            </Text>
          </RowSpaceBetween>
        </RowSpaceBetween>

        {
          unblurComponents
        }

<View style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(60) }} />

      </ScrollView >
      <View style={{ position: "absolute", bottom: moderateScale(70) }}>
        <ConfirmButton
          title={lang.editGolNutritionalValueFood}
          lang={lang}
          onPress={editGoal}
          style={{backgroundColor:defaultTheme.green,width:dimensions.WINDOW_WIDTH*0.6,height:moderateScale(45)}}
        />
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(8),
    height: moderateScale(25)
  },
  text: {
    color: defaultTheme.mainText,
    fontSize: moderateScale(15),
    marginHorizontal: moderateScale(3),
    width: "30%",
    textAlign: "center"
  },
  titleContainer: {
    backgroundColor: defaultTheme.grayBackground,
    marginVertical: 0,
    borderTopWidth: 1.2,
    borderBottomWidth: 1.2,
    borderColor: defaultTheme.border,
    height: moderateScale(50),

  },
  rowContainer: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    backgroundColor: defaultTheme.lightBackground,
    marginVertical: 0,
    borderWidth: 1.2,
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(5)
  },
  customInput: {
    maxWidth: moderateScale(90),
    height: moderateScale(40),
    minHeight: moderateScale(30),
    borderWidth: 0,
  },
  textInput: {
    fontSize: moderateScale(14)
  },
  dropDownText: {
    color: defaultTheme.gray,
    fontSize: moderateScale(13),
    marginVertical: moderateScale(8)
  },
  editButton: {
    width: dimensions.WINDOW_WIDTH * 0.6,
    height: moderateScale(32),
    backgroundColor: defaultTheme.green,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(16)
  },
  back: {
    width: moderateScale(20),
    height: moderateScale(16),
    marginTop: moderateScale(16),
    transform: [
      { scaleX: I18nManager.isRTL ? 1 : -1 }
    ]
  },
  columContainer: {
    borderTopWidth: 1.2,
    borderBottomWidth: 1.2,
    borderColor: defaultTheme.border,
    marginVertical: 0
  },
  caloryContainer: {
    margin: moderateScale(5),
    alignItems: "center"
  },
  caloryWrapper: {
    width: moderateScale(55),
    height: moderateScale(55),
    borderRadius: moderateScale(28),
    backgroundColor: defaultTheme.primaryColor,
    margin: moderateScale(20),
    marginVertical: moderateScale(8),
    justifyContent: "center",
    alignItems: "center"
  },
  caloryText: {
    fontSize: moderateScale(17),
    color: defaultTheme.lightText
  },
  circle: {
    width: moderateScale(17),
    height: moderateScale(17),
    borderRadius: moderateScale(9),
    margin: moderateScale(8)
  },
  row: {
    width: dimensions.WINDOW_WIDTH * 0.6,
    paddingHorizontal: 0,
    marginHorizontal: moderateScale(-5),

  },
  lockContainer: {
    width: "30%",
    alignItems: "center"
  },
  lock: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  container: {
    width: dimensions.WINDOW_WIDTH,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: moderateScale(30)
  },
  dialog: {
    marginTop: moderateScale(25),
    width: dimensions.WINDOW_WIDTH * 0.9,
    padding: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(20),
    backgroundColor: defaultTheme.blue
  },
  button: {
    width: moderateScale(110),
    height: moderateScale(35),
    backgroundColor: defaultTheme.grayBackground
  },
  lock2: {
    width: dimensions.WINDOW_WIDTH * 0.2,
    height: dimensions.WINDOW_WIDTH * 0.2,
    margin: moderateScale(30)
  },
  text2: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(25),
    color: defaultTheme.lightText,
    marginBottom: moderateScale(15),
    textAlign: "center"
  },

});

export default GoalNutritionValue;
