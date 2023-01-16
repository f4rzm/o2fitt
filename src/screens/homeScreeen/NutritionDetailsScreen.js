import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Image,
  I18nManager,
  ScrollView,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { TwoOptionModal, MealDetailsCard, RowSpaceBetween, BlurComponent, Toolbar } from '../../components';
import { nutritions } from "../../utils/nutritions"
import moment from "moment"
import PouchDB from '../../../pouchdb'
import AsyncStorage from '@react-native-async-storage/async-storage';


const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })

const NutritionDetailsScreen = props => {
  // console.warn(props.route.params.data)

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const specification = useSelector(state => state.specification)
  const user = useSelector(state => state.user)
  const diet = useSelector(state => state.diet)
  const [targetCalorie, setTargetCalorie] = React.useState(2000)
  const [targetCarbo, setTargetCarbo] = React.useState(2000)
  const [targetPro, setTargetPro] = React.useState(2000)
  const [targetFat, setTargetFat] = React.useState(2000)
  const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
  const [mealsNutirtions, setMealsNutritions] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
  let unblurComponents = null

  console.log("Profile", profile)
  React.useEffect(() => {
    getMealFromDB(props.route.params.date)
  }, [])

  const goBack = () => {
    props.navigation.popToTop()
    return true
  }
  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", goBack);

    return () => BackHandler.removeEventListener("hardwareBackPress", goBack);
  }, [])

  const getData = async () => {
    const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
    const nowMoment = moment()
    const age = nowMoment.diff(birthdayMoment, "years")
    const height = profile.heightSize
    let targetWeight;
    const weight = specification[0].weightSize
    const wrist = specification[0].wristSize
    let activityRate;
    let bmr = 1
    let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
    let bodyType = null
    let targetCalorie;
    let carbo = 0
    let pro = 0
    let fat = 0
    let oldData;
    let weightChangeRate;
    await AsyncStorage.getItem('oldChanges').then((res => {
      oldData = JSON.parse(res)
      if (oldData.oldDateChange > props.route.params.date) {
        targetWeight = oldData.oldTargetWeight
        activityRate = oldData.oldDailyActivityRate
        weightChangeRate = oldData.oldWeightChangeRate
      } else {
        targetWeight = profile.targetWeight
        activityRate = profile.dailyActivityRate
        weightChangeRate = profile.weightChangeRate
      }
    })).catch(() => {
      targetWeight = profile.targetWeight
      activityRate = profile.dailyActivityRate
      weightChangeRate = profile.weightChangeRate
    })
    // console.log("NutritionCard profile",props.profile)
    console.log('target weight', targetWeight);
    console.log('target weight old', weightChangeRate);


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

    switch (activityRate) {
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

    console.log("targetCalorie", targetCalorie)
    const targetCaloriPerDay = (7700 * weightChangeRate * 0.001) / 7
    // checkForZigZagi
    if (weight > targetWeight) {
      if (user.countryId === 128) {
        if (moment(props.route.params.date).day() == 4) {
          targetCalorie *= 1.117
        } else if (moment(props.route.params.date).day() == 5) {
          targetCalorie *= 1.116
        } else {
          targetCalorie *= 0.97
        }
      }
      else {
        if (moment(props.route.params.date).day() == 6) {
          targetCalorie *= 1.117
        } else if (moment(props.route.params.date).day() == 0) {
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

    console.log("targetCalorie", targetCalorie)
    console.log("carbo", carbo)
    console.log("fat", fat)
    console.log("pro", pro)

    setTargetCalorie(parseInt(targetCalorie))
    setTargetCarbo(carbo / 4)
    setTargetFat(fat / 9)
    setTargetPro(pro / 4)
  }

  React.useEffect(() => {
    getData()
  }, [specification])

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
          const fn = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",").map(i => parseFloat(i)) : meal.foodNutrientValue.map(i => parseFloat(i))
          index === 23 ? value += parseInt(fn[index]) : value += parseFloat(fn[index])
        })
        nutritions[index] = value
      })
      console.log("meal nutritions", nutritions)
      setMealsNutritions(nutritions)
      setLoading(false)
    })
  }

  const goToPackages = () => {
    setOptionalDialogVisible(false)
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
    nutritionsValue = profile.targetNutrient.split(",")
  }
  else {
    nutritionsValue = profile.targetNutrient
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
           diet.isActive == false || diet.isBuy == false ? <>
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
                    {nutritionsValue[parseInt(item.id) - 1]}
                  </Text>
              }
            </>
              :
              null
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
              <Text style={[styles.text, { fontFamily: lang.font, marginHorizontal:diet.isActive == false || diet.isBuy == false ? moderateScale(8) : moderateScale(150) }]} allowFontScaling={false}>
                {mealsNutirtions[parseInt(item.id) - 1] && mealsNutirtions[parseInt(item.id) - 1].toFixed(1)}
              </Text>
          }
          {
           diet.isActive == false || diet.isBuy == false ? <>
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
                      color: parseFloat(nutritionsValue[parseInt(item.id) - 1]) - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) >= 0 ? defaultTheme.green : defaultTheme.error
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
            </>
              :
              null
          }
        </RowSpaceBetween>
      </RowSpaceBetween>
    ))
  console.log("mealsNutirtions", mealsNutirtions)
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={defaultTheme.primaryColor} />
      </View>
    )
  }
  else {
    return (
      <View style={styles.mainContainer}>
        <Toolbar
          lang={lang}
          title={lang.nutritionalValue}
          onBack={() => props.navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1, 5]}
        >
          {/* <RowStart style={styles.titleContainer}>
              <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {lang.golInDay}
                </Text>
            </RowStart> */}

          <MealDetailsCard
            user={user}
            lang={lang}
            fat={parseInt(mealsNutirtions[0])}
            carbo={parseInt(mealsNutirtions[31])}
            protein={parseInt(mealsNutirtions[9])}
            calorie={parseInt(mealsNutirtions[23])}
            calNutrition={editGoal}
            giveCalorie={true}
            pieShown={true}
            targetCalorie={targetCalorie}
            data={props.route.params.data}
            showMealDetails={props.route.params.data.length > 0 ? true : false}
            date={props.route.params.date}
            showLock={!hasCredit}
          />
          <RowSpaceBetween style={[styles.titleContainer, { paddingHorizontal: 0, marginVertical: moderateScale(5) }]}>
            <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
              {lang.bigNutrition}
            </Text>
            <RowSpaceBetween style={[styles.row]}>
              {
               diet.isActive == false || diet.isBuy == false ?
                  <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
                    {lang.gol}
                  </Text> :
                  null
              }
              <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont, marginHorizontal:diet.isActive == false || diet.isBuy == false ? moderateScale(8) : moderateScale(150), width:diet.isActive == false || diet.isBuy == false ? null : moderateScale(50), }]} allowFontScaling={false}>
                {lang.get}
              </Text>
              {
               diet.isActive == false || diet.isBuy == false ?
                  <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
                    {lang.modWater}
                  </Text> : null
              }
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
                     diet.isActive == false || diet.isBuy == false ? <>
                        {
                          hasCredit || item.id == 1 ?
                            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                              {
                                val && val.toFixed(1)
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
                        }</> :
                        null
                    }
                    {hasCredit || item.id == 1 ? <Text style={[
                      styles.text,
                      {
                        fontFamily: lang.font
                        , marginHorizontal:diet.isActive == false || diet.isBuy == false ? moderateScale(8) : moderateScale(150)
                      }
                    ]}
                      allowFontScaling={false}
                    >
                      {mealsNutirtions[parseInt(item.id) - 1] && mealsNutirtions[parseInt(item.id) - 1].toFixed(1)}
                    </Text>
                      : <Image
                        source={require("../../../res/img/lock.png")}
                        style={styles.lock}
                        resizeMode="contain"
                      />
                    }
                    {
                     diet.isActive == false || diet.isBuy == false ?
                        <>
                          {
                            hasCredit || item.id == 1 ?
                              <Text style={[
                                styles.text,
                                {
                                  fontFamily: lang.font,
                                  color: (val - parseFloat(mealsNutirtions[parseInt(item.id) - 1])) >= 0 ? defaultTheme.green : defaultTheme.error
                                }
                              ]}
                                allowFontScaling={false}
                              >

                                {
                                  (val && mealsNutirtions[parseInt(item.id) - 1] && (val - parseFloat(mealsNutirtions[parseInt(item.id) - 1]) >= 0)) ?
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
                          }</> : null
                    }
                  </RowSpaceBetween>
                </RowSpaceBetween>
              )
            }
            )
          }
          <RowSpaceBetween style={[styles.titleContainer, { paddingHorizontal: 0, marginVertical: moderateScale(5) }]}>
            <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
              {lang.micronutrientFood}
            </Text>
            <RowSpaceBetween style={[styles.row]}>
              {
               diet.isActive == false || diet.isBuy == false ? <>
                  <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
                    {lang.gol}
                  </Text>
                </>
                  :
                  null
              }
              <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont, marginHorizontal:diet.isActive == false || diet.isBuy == false ? moderateScale(8) : moderateScale(150), width:diet.isActive == false || diet.isBuy == false ? null : moderateScale(50) }]} allowFontScaling={false}>
                {lang.get}
              </Text>
              {
               diet.isActive == false || diet.isBuy == false ? <>
                  <Text style={[styles.title, { fontFamily: lang.langName === "persian" ? lang.font : lang.titleFont }]} allowFontScaling={false}>
                    {lang.modWater}
                  </Text>
                </>
                  :
                  null
              }

            </RowSpaceBetween>
          </RowSpaceBetween>

          {
            unblurComponents
          }
        </ScrollView>
        {/* <TwoOptionModal
            lang={lang}
            visible={optionalDialogVisible}
            onRequestClose={()=>setOptionalDialogVisible(false)}
            context={lang.subscribe1}
            button1={lang.iBuy}
            button2={lang.motevajeShodam}
            button1Pressed={goToPackages}
            button2Pressed={()=>setOptionalDialogVisible(false)}
          /> */}
      </View>
    )
  };
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
    height: moderateScale(25),

  },
  text: {
    color: defaultTheme.darkText,
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
    alignItems: "center",
    justifyContent: "center"
  },
  rowContainer: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    backgroundColor: defaultTheme.lightBackground,
    marginVertical: 0,
    borderWidth: 1.2,
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(5),
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
    marginHorizontal: 0,
  },
  lockContainer: {
    width: "30%",
    alignItems: "center"
  },
  lock: {
    width: moderateScale(20),
    height: moderateScale(20),
  }

});

export default NutritionDetailsScreen;
