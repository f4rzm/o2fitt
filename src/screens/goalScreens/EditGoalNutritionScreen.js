import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  I18nManager,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { Toolbar, CustomInput, RowSpaceBetween, RowWrapper, ConfirmButton, ColumnWrapper, Information } from '../../components';
import { nutritions } from "../../utils/nutritions"
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import moment from "moment"
import { urls } from "../../utils/urls"
import pouchdbSearch from 'pouchdb-find'
import { updateTargetNutrient, updateProfileLocaly } from "../../redux/actions"
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-toast-message'
import TargetNutrition from '../../components/TargetNutrition'

PouchDB.plugin(pouchdbSearch)
const offlineDB = new PouchDB("offline", { adapter: 'react-native-sqlite' })

const EditGoalNutritionScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const auth = useSelector(state => state.auth)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const profile = useSelector(state => state.profile)
  const dispatch = useDispatch()
  const [nutritionsValue, setNutritonValue] = React.useState(new Array(34).fill(1))
  const [targetCalorie, setTargetCalorie] = React.useState(2000)
  const [targetCarbo, setTargetCarbo] = React.useState(2000)
  const [targetPro, setTargetPro] = React.useState(2000)
  const [targetFat, setTargetFat] = React.useState(2000)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [bottomPadding, setBottomPadding] = React.useState(0)

  console.log(profile)
  React.useEffect(() => {
    const birthdayMoment = moment((profile.birthDate.split("/")).join("-"))
    const nowMoment = moment()
    const age = nowMoment.diff(birthdayMoment, "years")
    const height = profile.heightSize
    const weight = specification[0].weightSize
    const wrist = specification[0].wristSize
    const targetWeight = profile.targetWeight
    let bmr = 1
    let factor = height / wrist;
    let bodyType = 1
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

  }, [specification])

  React.useEffect(() => {
    let n = new Array(34).fill(0)
    if (typeof (profile.targetNutrient) === "string") {
      n = profile.targetNutrient.split(",")
    }
    else {
      n = profile.targetNutrient
    }

    setNutritonValue(n)
  }, [])

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
    }
  }, [])

  const keyboardDidShow = (e) => {
    console.log(e)
    if(Platform.OS=='android'){
      setTimeout(() => {
        setBottomPadding(moderateScale(75))
      }, 50);
    }
  }

  const keyboardDidHide = (e) => {
    if(Platform.OS=='android'){
      setBottomPadding(moderateScale(0))
    }
  }

  const onChange = (text, index) => {
    const f = [...nutritionsValue]
    f[index] = text
    setNutritonValue(f)
  }

  const onConfirm = () => {
    const newNut = nutritionsValue.map(item => {
      if (!isNaN(parseFloat(item))) {
        return parseFloat(item)
      }

      return 0
    })

    setIsLoading(true)
    dispatch(updateTargetNutrient({
      ...profile,
      targetNutrient: newNut
    },
      auth,
      app,
      user,
      (data) => {
        dispatch(updateProfileLocaly(data))
        // setErrorContext(lang.successful)
        // setErrorVisible(true)
        Toast.show({
          type: "success",
          props: { text2: lang.successful, style: { fontFamily: lang.font } },
          visibilityTime: 800
        })
        setIsLoading(false)
      }
    ))

    analytics().logEvent('editNutritionGoal')
  }

  return (
    <View style={[styles.mainContainer]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS=='ios'?"padding":"none"} keyboardVerticalOffset={Platform.OS=='ios'&&dimensions.WINDOW_HEIGTH<800?20:Platform.OS=='ios'&&dimensions.WINDOW_HEIGTH>800?45:0}>
        <Toolbar
          lang={lang}
          title={lang.changeTargetNutritionTitle}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: bottomPadding }}

        >
          <RowSpaceBetween
            style={[styles.header]}
          >
            <Text style={[styles.textHeader, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.golDailyNutritionFood}
            </Text>
            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gol}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween
            style={[styles.row]}
          >
            <Text style={[styles.textHeader, { fontFamily: lang.font, color: defaultTheme.green }]} allowFontScaling={false}>
              {lang.coloriesNumber}
            </Text>
            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {targetCalorie.toString()}
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gr}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween
            style={[styles.row]}
          >
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.fat}
            </Text>

            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {targetFat.toString()}
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gr}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween
            style={[styles.row]}
          >
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.carbohydrate}
            </Text>
            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {targetCarbo.toString()}
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gr}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween
            style={[styles.row]}
          >
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.protein}
            </Text>
            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {targetPro.toString()}
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gr}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          {/***/}
          <RowSpaceBetween
            style={[styles.header]}
          >
            <Text style={[styles.textHeader, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.micronutrientFood}
            </Text>
          </RowSpaceBetween>
          <ColumnWrapper style={{ borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: 0, marginHorizontal: 0 }}>
            <RowSpaceBetween
              style={[styles.row, { borderBottomWidth: 0 }]}
            >
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.fat}
              </Text>
              <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {targetFat.toFixed(1)}
                </Text>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {lang.gr}
                </Text>
              </RowWrapper>
            </RowSpaceBetween>

            <TargetNutrition
              title={nutritions.find(i => i.id == 12)[lang.langName]}
              lang={lang}
              onChangeText={(text) => onChange(text, 11)}
              symbol={nutritions.find(i => i.id == 12)["unit"]}
              value={nutritionsValue[11].toString()}

            />
            <TargetNutrition
              title={nutritions.find(i => i.id == 15)[lang.langName]}
              lang={lang}
              onChangeText={(text) => onChange(text, 14)}
              symbol={nutritions.find(i => i.id == 12)["unit"]}
              value={nutritionsValue[14].toString()}
            />

          </ColumnWrapper>
          <ColumnWrapper style={{ borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: 0, marginHorizontal: 0 }}>
            <RowSpaceBetween
              style={[styles.row, { borderBottomWidth: 0 }]}
            >
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.carbohydrate}
              </Text>
              <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {targetCarbo.toFixed(1)}
                </Text>
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {lang.gr}
                </Text>
              </RowWrapper>
            </RowSpaceBetween>

            <TargetNutrition
              title={nutritions.find(i => i.id == 28)[lang.langName]}
              lang={lang}
              onChangeText={(text) => onChange(text, 27)}
              symbol={nutritions.find(i => i.id == 28)["unit"]}
              value={nutritionsValue[27].toString()}
            />
            <TargetNutrition
              title={nutritions.find(i => i.id == 4)[lang.langName]}
              lang={lang}
              onChangeText={(text) => onChange(text, 3)}
              symbol={nutritions.find(i => i.id == 4)["unit"]}
              value={nutritionsValue[3].toString()}
            />


          </ColumnWrapper>
          <RowSpaceBetween
            style={[styles.row]}
          >
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.protein}
            </Text>
            <RowWrapper style={{ marginVertical: 0, paddingHorizontal: 0 }}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {targetPro.toFixed(1)}
              </Text>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gr}
              </Text>
            </RowWrapper>
          </RowSpaceBetween>

          {/***/}
          <RowSpaceBetween
            style={[styles.header]}
          >
            <Text style={[styles.textHeader, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.microNutrition}
            </Text>
          </RowSpaceBetween>
          <TargetNutrition
            title={nutritions.find(i => i.id == 3)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 2)}
            symbol={nutritions.find(i => i.id == 3)["unit"]}
            value={nutritionsValue[2].toString()}
          />

          <TargetNutrition
            title={nutritions.find(i => i.id == 5)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 4)}
            symbol={nutritions.find(i => i.id == 5)["unit"]}
            value={nutritionsValue[4].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 6)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 5)}
            symbol={nutritions.find(i => i.id == 6)["unit"]}
            value={nutritionsValue[5].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 8)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 7)}
            symbol={nutritions.find(i => i.id == 8)["unit"]}
            value={nutritionsValue[7].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 9)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 8)}
            symbol={nutritions.find(i => i.id == 9)["unit"]}
            value={nutritionsValue[8].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 11)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 10)}
            symbol={nutritions.find(i => i.id == 11)["unit"]}
            value={nutritionsValue[10].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 13)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 12)}
            symbol={nutritions.find(i => i.id == 13)["unit"]}
            value={nutritionsValue[12].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 14)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 13)}
            symbol={nutritions.find(i => i.id == 14)["unit"]}
            value={nutritionsValue[13].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 16)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 15)}
            symbol={nutritions.find(i => i.id == 16)["unit"]}
            value={nutritionsValue[15].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 17)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 16)}
            symbol={nutritions.find(i => i.id == 17)["unit"]}
            value={nutritionsValue[16].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 18)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 17)}
            symbol={nutritions.find(i => i.id == 18)["unit"]}
            value={nutritionsValue[17].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 19)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 18)}
            symbol={nutritions.find(i => i.id == 19)["unit"]}
            value={nutritionsValue[18].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 20)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 19)}
            symbol={nutritions.find(i => i.id == 20)["unit"]}
            value={nutritionsValue[19].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 21)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 20)}
            symbol={nutritions.find(i => i.id == 21)["unit"]}
            value={nutritionsValue[20].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 22)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 21)}
            symbol={nutritions.find(i => i.id == 22)["unit"]}
            value={nutritionsValue[21].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 23)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 22)}
            symbol={nutritions.find(i => i.id == 23)["unit"]}
            value={nutritionsValue[22].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 25)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 24)}
            symbol={nutritions.find(i => i.id == 25)["unit"]}
            value={nutritionsValue[24].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 26)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 25)}
            symbol={nutritions.find(i => i.id == 26)["unit"]}
            value={nutritionsValue[25].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 26)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 25)}
            symbol={nutritions.find(i => i.id == 26)["unit"]}
            value={nutritionsValue[25].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 27)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 26)}
            symbol={nutritions.find(i => i.id == 27)["unit"]}
            value={nutritionsValue[26].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 29)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 28)}
            symbol={nutritions.find(i => i.id == 29)["unit"]}
            value={nutritionsValue[28].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 30)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 29)}
            symbol={nutritions.find(i => i.id == 30)["unit"]}
            value={nutritionsValue[29].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 31)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 30)}
            symbol={nutritions.find(i => i.id == 31)["unit"]}
            value={nutritionsValue[30].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 33)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 32)}
            symbol={nutritions.find(i => i.id == 33)["unit"]}
            value={nutritionsValue[32].toString()}
          />
          <TargetNutrition
            title={nutritions.find(i => i.id == 34)[lang.langName]}
            lang={lang}
            onChangeText={(text) => onChange(text, 33)}
            symbol={nutritions.find(i => i.id == 34)["unit"]}
            value={nutritionsValue[33].toString()}
          />
          <View style={{ height: moderateScale(50) }} />
        </ScrollView>
        <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.buttonGradient}>
          <ConfirmButton
            lang={lang}
            title={lang.saved}
            style={styles.savedButton}
            onPress={onConfirm}
            isLoading={isLoading}
          />
        </LinearGradient>

        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    borderBottomWidth: 1,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(8),
    backgroundColor: defaultTheme.grayBackground,
    marginTop: 0,
    marginBottom: 0,
  },
  row: {
    borderBottomWidth: 1,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(10),
    marginTop: 0,
    marginBottom: 0,
  },
  row2: {
    borderBottomWidth: 0,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(10),
    marginTop: 0,
    marginBottom: 0,
    paddingStart: moderateScale(20)
  },
  input: {
    width: moderateScale(70),
    height: moderateScale(32),
    minHeight: moderateScale(10),
    borderRadius: moderateScale(8),
    paddingStart: moderateScale(5),
    paddingEnd: moderateScale(5),
    marginVertical: 0,
  },
  textHeader: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(8)
  },
  text: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(8)
  },
  unitText: {
    width: moderateScale(35),
    textAlign: "center",
    color: defaultTheme.gray,
    fontSize: moderateScale(13),
  },
  rowContainer: {
    paddingHorizontal: moderateScale(16),
    marginVertical: moderateScale(0),
    borderBottomWidth: 1
  },
  customInput: {
    maxWidth: moderateScale(110),
    minWidth: moderateScale(70),
    height: moderateScale(40),
    minHeight: moderateScale(30),
    borderWidth: 0,
    textAlign: "center"
  },
  textInput: {
    fontSize: moderateScale(14)
  },
  dropDownText: {
    color: defaultTheme.gray,
    fontSize: moderateScale(13),
    marginVertical: moderateScale(8)
  },
  savedButton: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    marginVertical: moderateScale(16)
  },
  back: {
    width: moderateScale(20),
    height: moderateScale(16),
    marginTop: moderateScale(16),
    transform: [
      { scaleX: I18nManager.isRTL ? 1 : -1 }
    ]
  },
  buttonGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: moderateScale(70),
    paddingTop: moderateScale(5)

  }

});

export default EditGoalNutritionScreen;
