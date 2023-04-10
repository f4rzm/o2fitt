
import React, { useCallback, useState,useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import { ConfirmButton, RowSpaceBetween, DoubleInput, Toolbar, RowStart, RowCenter, ColumnCenter, CalendarDropDown, DatePicker, Information, WeightPicker } from '../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { updateSpecification } from "../../redux/actions"
import { SpecificationDBController } from "../../classess/SpecificationDBController"
import analytics from '@react-native-firebase/analytics';
import { WheelPicker } from 'react-native-wheel-picker-android';

const RegisterWeightScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const auth = useSelector(state => state.auth)
  const profile = useSelector(state => state.profile)
  const dispatch = useDispatch()
  const specification = useSelector(state => state.specification)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [showDatePicker, setShowPicker] = React.useState(false)
  const [selectedDate, setDate] = React.useState(moment().format('YYYY-MM-DD'))
  const today = React.useRef(moment().format('YYYY-MM-DD')).current
  // const [kg , setKg] = React.useState("")
  // const [gr , setGr] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [selectedKg, setSelectedKg] = useState(specification[0].weightSize-35)
  const [selectedGr, setSelectedGr] = useState(0)


  const kg = Array.from({ length: 126 }, (x, i) => (i + 35).toString())
  const gr = Array.from({ length: 10 }, (x, i) => (i ).toString())

  const onKGselected = useCallback(
    selectedItem => {
      setSelectedKg(selectedItem);
    },
    [selectedKg],
  );
  const onGRselected = useCallback(
    selectedItem => {
      setSelectedGr(selectedItem);
    },
    [selectedGr],
  );

  useEffect(() => {
    setTimeout(() => {
      
      setSelectedKg(specification[0].weightSize-35)
    }, 500);
  }, [])
  console.log("specification", specification)

  const onDateSelected = (newDate) => {
    setDate(newDate)
    setShowPicker(false)
  }
  console.warn(selectedDate,)

  const onConfirm = async () => {
    if (!isNaN(parseFloat(kg[selectedKg] + "." + gr[selectedGr]))) {
      setLoading(true)
      if (selectedDate === today) {
        dispatch(updateSpecification({
          ...specification[0],
          _id: Date.now(),
          insertDate: selectedDate,
          weightSize: parseFloat(kg[selectedKg] + "." + gr[selectedGr]).toFixed(2),
        }, auth, app, user, backToGoal))
      }
      else {
        const SDBC = new SpecificationDBController()
        const oldData = await SDBC.getCertainDate(selectedDate)
        console.log("oldData", oldData)
        dispatch(updateSpecification({
          ...oldData,
          _id: Date.now(),
          weightSize: parseFloat(kg[selectedKg] + "." + gr[selectedGr]).toFixed(2),
        }, auth, app, user, backToGoal))
      }

      analytics().logEvent('setWeight')
    }
    else {

    }
  }

  const backToGoal = () => {
    if (props.route.params?.setCheckFireWork) {

      props.route.params.setCheckFireWork(true)
      props.navigation.navigate("GoalWeightScreen")
    }
    else {
      props.navigation.navigate("GoalRouter")
      props.navigation.navigate("GoalWeightScreen", { from: "registerWeight" })
    }
  }

  const newWeight = kg === "" ? 0 : isNaN(parseFloat(kg[selectedKg] + "." + gr[selectedGr])) ? 0 : parseFloat(kg[selectedKg] + "." + gr[selectedGr])
  return (
    <View style={styles.mainContainer}>
      <Toolbar
        lang={lang}
        title={lang.setWeightTitle}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }}>
        <RowSpaceBetween style={styles.row}>
          <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.date}
          </Text>

          <CalendarDropDown
            style={styles.dateContainer}
            lang={lang}
            user={user}
            selectedDate={selectedDate}
            onPress={() => setShowPicker(true)}
          />
        </RowSpaceBetween>
        <RowSpaceBetween style={styles.row}>
          <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.oldWeight}
          </Text>
          <Text style={[styles.text, { fontFamily: lang.font, fontSize: moderateScale(17),color:defaultTheme.lightGray2 }]} allowFontScaling={false}>
            {specification[0].weightSize + " " + lang.kg}
          </Text>
        </RowSpaceBetween>
        <View style={styles.inputContainer}>
          <RowStart>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.newWeight}
            </Text>
          </RowStart>
          {/* <DoubleInput
                    lang={lang}
                    seprator="."
                    maxLength1={3}
                    maxLength2={3}
                    onChangeText1={text => setKg(text)}   
                    onChangeText2={text => setGr(text)}   
                    placeholder1={lang.kgMeasureName}
                    placeholder2={lang.gr}
                    autoFocus={true}
                /> */}
          <View style={{ flexDirection: lang.langName === "persian" ? "row-reverse" : "row",}}>
            <View style={{ justifyContent: "center",  alignItems: "center"}}>
              <Text style={{alignItems:"center",justifyContent:"center",fontSize:moderateScale(16),fontFamily:lang.font}}>{lang.kgMeasureName}</Text>
              <WheelPicker
                selectedItem={selectedKg}
                data={kg}
                onItemSelected={onKGselected}
                itemTextFontFamily={lang.font}
                selectedItemTextFontFamily={lang.font}
                itemTextSize={moderateScale(18)}
                selectedItemTextSize={moderateScale(22)}
                indicatorWidth={1}
                indicatorColor='gray'
                selectedItemTextColor={"black"}
                style={{ width: moderateScale(100),height:dimensions.WINDOW_HEIGTH*0.2  }}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", width: 150 }}>
              <Text style={{alignItems:"center",justifyContent:"center",fontSize:moderateScale(16),fontFamily:lang.font}}>{lang.gr}</Text>
              <WheelPicker
                selectedItem={selectedGr}
                data={gr}
                onItemSelected={onGRselected}
                itemTextFontFamily={lang.font}
                selectedItemTextFontFamily={lang.font}
                itemTextSize={lang.langName? moderateScale(20):moderateScale(18)}
                selectedItemTextSize={moderateScale(22)}
                indicatorWidth={1}
                indicatorColor='gray'
                selectedItemTextColor={"black"}
                style={{ width: moderateScale(100),height:dimensions.WINDOW_HEIGTH*0.2}}
              />
            </View>


          </View>
        </View>
        <RowCenter style={{ marginTop: moderateScale(24), borderTopWidth: 1 }}>
          <ColumnCenter>
            <Text style={[styles.title2, { fontFamily: lang.font }]} allowFontScaling={false}>
              <Text style={[styles.title, { fontFamily: lang.fontTitle }]} allowFontScaling={false}>
                {
                  newWeight > 0 ? Math.abs(newWeight - parseFloat(specification[0].weightSize)).toFixed(1) : "-"
                }
              </Text>{newWeight > 0 ? " kg" : ""}
            </Text>
            <Text style={[styles.title2, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.change}
            </Text>
          </ColumnCenter>
        </RowCenter>
      </ScrollView>
      <ConfirmButton
        lang={lang}
        style={styles.button}
        title={lang.setWeightTitle}
        leftImage={require("../../../res/img/done.png")}
        onPress={onConfirm}
        isLoading={loading}
      />
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
      <DatePicker
        lang={lang}
        user={user}
        visible={showDatePicker}
        onRequestClose={() => setShowPicker(false)}
        onDateSelected={onDateSelected}
        selectedDate={selectedDate}
      />
    </View>
  )

};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    alignItems: "center",
    marginTop: moderateScale(15),
    backgroundColor: defaultTheme.border,
    paddingBottom: moderateScale(30)
  },
  row: {
    borderBottomWidth: 1,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(10),
    marginVertical: moderateScale(5)
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    margin: moderateScale(35)
  },
  title: {
    color: defaultTheme.gray,
    fontSize: moderateScale(25),
    marginHorizontal: moderateScale(10)
  },
  title2: {
    color: defaultTheme.gray,
    fontSize: moderateScale(20),
    marginHorizontal: moderateScale(10)
  },
  text: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(10)
  },
  seprator: {
    width: 1,
    height: moderateScale(80),
    backgroundColor: defaultTheme.gray,
    margin: moderateScale(16),
    marginTop: moderateScale(30),
  }
});

export default RegisterWeightScreen;
