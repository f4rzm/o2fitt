import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Text,
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { DoubleInput, TimePicker, Toolbar, RowWrapper, RowSpaceBetween, ConfirmButton, Information, CustomInput } from '../../components';
import { moderateScale } from 'react-native-size-matters';
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import { urls } from "../../utils/urls"
import pouchdbSearch from 'pouchdb-find'
import { BlurView } from '@react-native-community/blur';


const m = {
  "id": 0,
  "userId": 0,
  "calorie": 0,
  "name": "",
  "duration": "00:00",
  "_id": null
}

PouchDB.plugin(pouchdbSearch)
const personalActivityDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })
const offlineDB = new PouchDB("offline", { adapter: 'react-native-sqlite' })

const PersonalActivityScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const auth = useSelector(state => state.auth)
  const defaultModel = props.route.params ? React.useRef({ ...props.route.params }).current : React.useRef({ ...m }).current

  const ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current
  let currentTy = React.useRef(dimensions.WINDOW_HEIGTH).current
  const [hour, setHour] = React.useState(parseInt(defaultModel.duration.split(":")[0]))
  const [min, setMin] = React.useState(parseInt(defaultModel.duration.split(":")[1]))
  const [saving, setSaving] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [activityModel, updateActivityModel] = React.useState({ ...defaultModel })


  React.useEffect(() => {
    ty.addListener(value => currentTy = value.value)
  }, [])

  React.useEffect(() => {
    let backHandler = null
    backHandler = BackHandler.addEventListener('hardwareBackPress', goBack)

    return () => {
      backHandler && backHandler.remove()
    }
  }, [])

  const goBack = () => {
    if (currentTy === 0) {
      closeTimePicker()
    }
    else {
      props.navigation.goBack()
    }

    return true
  }

  const nameChanged = (text) => {
    updateActivityModel({ ...activityModel, name: text })
  }

  const calorieChanged = (text) => {
    updateActivityModel({ ...activityModel, calorie: text })
  }

  const showTimePicker = () => {
    Animated.timing(ty, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start()
  }

  const closeTimePicker = () => {
    Animated.timing(ty, {
      toValue: dimensions.WINDOW_HEIGTH,
      duration: 250,
      useNativeDriver: true
    }).start()
  }

  const timeChanged = (hour, min) => {
    setHour(parseInt(hour) < 10 ? "0" + parseInt(hour) : hour)
    setMin(parseInt(min) < 10 ? "0" + parseInt(min) : min)
  }

  const onConfirm = () => {
    if (activityModel.name != "" &&
      !isNaN(parseFloat(activityModel.calorie)) &&
      !isNaN(parseFloat(hour)) &&
      !isNaN(parseFloat(min)) &&
      (parseFloat(hour) > 0 || parseFloat(min) > 0)
    ) {
      setSaving(true)
      const method = activityModel._id ? "put" : "post"
      const activity = {
        ...activityModel,
        duration: `${hour}:${min}:00`,
        userId: user.id,
        _id: activityModel._id ? activityModel._id : Date.now().toString()
      }
      if (app.networkConnectivity) {
        saveServer({ ...activity }, method)
      }
      else {
        offlineDB.post({
          method: method,
          type: "personalActivity",
          url: urls.workoutBaseUrl + urls.personalWorkOut + urls.create,
          header: { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } },
          params: { ...activity }
        }).then(res => {
          console.log(res)
          saveToDB({ ...activity })
        })
      }
    }
    else {
      setErrorContext(lang.wrngTime)
      setErrorVisible(true)
    }
  }

  const saveToDB = (activity) => {
    console.log("saved activity", activity)
    personalActivityDB.find({
      selector: { _id: activity._id }
    }).then(records => {
      console.log("rec =>", records)
      if (records.docs.length === 0) {
        personalActivityDB.put(activity, () => props.navigation.goBack()).catch(e => console.log())
      }
      else {
        personalActivityDB.put({ ...activity, _id: records.docs[0]._id, _rev: records.docs[0]._rev }, () => props.navigation.goBack())
      }
    })
  }

  const saveServer = (activity, method) => {
    const url = urls.workoutBaseUrl + urls.personalWorkOut + urls.create
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = { ...activity }

    console.log("params", params)
    console.log("url", url)
    const RC = new RestController()
    RC.checkPrerequisites(method, url, params, header, (res) => onSuccess(res, activity), onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onSuccess = (response, activity) => {
    saveToDB({
      ...activity,
      id: response.data.data.id
    })
  }

  const onFailure = () => {
    setSaving(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.pesonalexercise}
        onBack={goBack}
      />
      {errorVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <ScrollView >
        <RowSpaceBetween
          style={styles.rowStyle}
        >
          <CustomInput
            lang={lang}
            style={styles.input}
            placeholder={lang.writeNameSport}
            value={activityModel.name}
            onChangeText={nameChanged}
            autoFocus={true}
            textStyle={{color:defaultTheme.darkText}}

          />
        </RowSpaceBetween>
        <RowSpaceBetween
          style={styles.rowStyle}
        >
          <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
            {
              lang.coloriesNumber
            }
          </Text>
          <RowWrapper style={{ marginVertical: 0, paddingVertical: 0 }}>
            <CustomInput
              lang={lang}
              style={styles.input2}
              textStyle={{ height: moderateScale(35), fontSize: moderateScale(19), textAlign: "center" }}
              value={activityModel.calorie}
              onChangeText={calorieChanged}
              keyboardType="decimal-pad"
              placeholder="0"
            />
            <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
              {
                lang.calories
              }
            </Text>
          </RowWrapper>
        </RowSpaceBetween>
        <RowSpaceBetween
          style={[styles.rowStyle, { alignItems: "flex-start" }]}
        >
          <View style={{paddingVertical:moderateScale(20),paddingBottom:moderateScale(50)}}>
            <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
              {
                lang.inTime
              }
            </Text>

            <TimePicker
              lang={lang}
              user={user}
              ty={ty}
              close={closeTimePicker}
              onTimeConfirm={timeChanged}
              hour={hour}
              min={min}

            />
          </View>
          <RowWrapper style={{ marginVertical: 0, paddingVertical: 0 }}>

            {/* <DoubleInput
                  lang={lang}
                  seprator={":"}
                  placeholder1={lang.hour}
                  placeholder2={lang.min}
                  focusControl={()=>showTimePicker()}
                  editable={false}
                  value1={hour}
                  value2={min}
                /> */}
          </RowWrapper>
        </RowSpaceBetween>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.saved}
          leftImage={require("../../../res/img/done.png")}
          onPress={onConfirm}
        />
      </View>

      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 0,
    height: moderateScale(35),
    marginVertical: moderateScale(3),
    paddingStart: 5,
    borderRadius: moderateScale(10),
  },
  input2: {
    borderWidth: 1,
    width: moderateScale(85),
    height: moderateScale(35),
    minHeight: moderateScale(30),
    marginVertical: moderateScale(3),
    marginHorizontal: moderateScale(15),
    borderRadius: moderateScale(10)
  },
  rowStyle: {
    borderBottomWidth: 1.2,
    padding: moderateScale(8),
    paddingStart: moderateScale(18),
    marginVertical: 0
  },
  mediaContainer: {
    width: "100%",
    height: dimensions.WINDOW_HEIGTH * 0.25,
    backgroundColor: "gold"
  },
  timeContainer: {
    width: dimensions.WINDOW_WIDTH,
    backgroundColor: defaultTheme.grayBackground,
    padding: moderateScale(16),
    alignItems: "flex-start"
  },
  text1: {
    fontSize: moderateScale(14),
    color: defaultTheme.darkText,
    textAlign:"left"
  },
  text2: {
    width: "100%",
    fontSize: moderateScale(40),
    color: defaultTheme.error,
    textAlign: "center"
  },
  text3: {
    width: "100%",
    fontSize: moderateScale(20),
    color: defaultTheme.gray,
    textAlign: "center"
  },
  buttonContainer: {
    position: "absolute",
    width: dimensions.WINDOW_WIDTH,
    alignItems: "center",
    bottom:moderateScale(15)
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wrapper: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PersonalActivityScreen;
