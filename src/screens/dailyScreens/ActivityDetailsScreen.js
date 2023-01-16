
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  ScrollView,
  BackHandler
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { DoubleInput, RowCenter, FoodToolbar, RowWrapper, ConfirmButton, RowSpaceBetween, DropDown, VideoPlayer, TimePicker, Information, ColumnStart, RowStart } from '../../components';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import moment from "moment"
import { urls } from "../../utils/urls"
import pouchdbSearch from 'pouchdb-find'
import allMuscles from "../../utils/allMuscles"
import { exercise } from "../../utils/exercise.js"
import cardioExcercises from '../../utils/cardios/cardioExcercises';
import bodyBuildingExcercises from '../../utils/bodyBuildingExcercises';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message'

const defaultModel = {
  "id": 0,
  "name": {
    "persian": "",
    "english": "",
    "arabic": "",
    "id": null
  },
  "recommandation": null,
  "howToDo": null,
  "iconUri": null,
  "imageUri": null,
  "video": null,
  "maleVideo": null,
  "femaleVideo": null,
  "burnedCalories": 0,
  "classification": 0,
  "level": null,
  "gender": null,
  "bodyMuscles": [],
  "targetMuscle": 0,
  "attributes": null
}

PouchDB.plugin(pouchdbSearch)
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' })
const offlineDB = new PouchDB("offline", { adapter: 'react-native-sqlite' })
const favoriteActivityDB = new PouchDB('favoriteActivity', { adapter: 'react-native-sqlite' })
const personalActivityDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })
let unitBurnedCalori = 0

const ActivityDetailsScreen = props => {
  console.warn(props.route.params.date)
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const auth = useSelector(state => state.auth)
  const [isFavorite, setFavorite] = React.useState(false)
  const ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current
  let currentTy = React.useRef(dimensions.WINDOW_HEIGTH).current
  const [hour, setHour] = React.useState(props.route.params.activity.duration ? parseInt(props.route.params.activity.duration.split(":")[0]) : 0)
  const [min, setMin] = React.useState(props.route.params.activity.duration ? parseInt(props.route.params.activity.duration.split(":")[1]) : 0)
  const [saving, setSaving] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [renderTimePicker, setRenderTimePicker] = React.useState(false)
  const [model, updateModel] = React.useState({
    ...defaultModel,
    id: props.route.params.activity.workOutId,
    classification: props.route.params.activity.classification,
  })
  const [showDefautImage, setshowDefautImage] = React.useState(false)

  const defaultActivityModel = React.useRef({
    "id": props.route.params.activity.id ? props.route.params.activity.id : 0,
    "workOutId": props.route.params.activity.workOutId,
    "personalWorkOutId": props.route.params.activity.personalWorkOutId,
    "workOutAttributeValueId": (props.route.params.activity.workOutAttributeValueId) ? props.route.params.activity.workOutAttributeValueId : 0,
    "userId": user.id,
    "insertDate": props.route.params.date,
    "duration": props.route.params.activity.duration ? props.route.params.activity.duration : {},
    "burnedCalories": 0,
    "weight": specification[0].weightSize,
    "classification": props.route.params.activity.classification,
    "_id": props.route.params.activity._id ? props.route.params.activity._id : null
  }).current

  const [activityModel, updateActivityModel] = React.useState(defaultActivityModel)

  React.useEffect(() => {
    if (activityModel.workOutId) {
      getWorkoutDetail()
    }
    else if (activityModel.personalWorkOutId) {
      getPersonalActivityFromDB()
    }

    favoriteActivityDB.find({
      selector: { id: activityModel.workOutId }
    }).then(rec => {
      if (rec.docs.length > 0) {
        setFavorite(true)
      }
    })

    if (props.route.params.activity.duration) {
      const d = props.route.params.activity.duration.split(":")

      if (d.length > 1) {

        const h = parseInt(d[0])
        const m = parseInt(d[1])
        setHour(h)
        setMin(m)
        setRenderTimePicker(true)
      }
    }
    else {
      setRenderTimePicker(true)
    }

  }, [])

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

  const getWorkoutDetail = () => {
    console.log("props", props.route.params)
    if (props.route.params.activity.classification === 1) {
      const workout = exercise.find(item => item.id === activityModel.workOutId)
      console.log("workout", workout)
      console.log("activityModel", activityModel)
      if (workout != undefined) {
        updateModel({
          ...workout,
        })
        unitBurnedCalori = (workout.attributes && workout.attributes.length > 0) ? workout.attributes[0].attributeValue[0].burnedCalori : workout.burnedCalories
        if (activityModel.workOutAttributeValueId == 0 && workout.attributes && workout.attributes.length > 0) {
          updateActivityModel({
            ...activityModel,
            attributeId: (workout.attributes && workout.attributes.length > 0) ? workout.attributes[0].id : workout.burnedCalories,
            workOutAttributeValueId: workout.attributes[0].attributeValue[0].id
          })
        }
        else {
          let attributeId = null
          workout.attributes.map(item => item.attributeValue.map(i => {
            if (i.id === activityModel.workOutAttributeValueId) {
              attributeId = item.id
            }
          }))
          console.log("attributeId", attributeId)
          updateActivityModel({
            ...activityModel,
            attributeId: attributeId,
          })
        }
      }
    }
    else if (props.route.params.activity.classification === 2) {
      const workout = cardioExcercises.find(item => item.id === activityModel.workOutId)
      if (workout != undefined) {
        updateModel({ ...workout })
        unitBurnedCalori = workout.burnedCalories
        if (activityModel.workOutAttributeValueId == 0 && workout.attributes && workout.attributes.length > 0) {
          updateActivityModel({ ...activityModel, workOutAttributeValueId: workout.attributes[0].attributeValue[0].id })
        }
      }
    }
    else if (props.route.params.activity.classification === 3) {
      const workout = bodyBuildingExcercises.find(item => item.id === activityModel.workOutId)
      if (workout != undefined) {
        updateModel({ ...workout })
        unitBurnedCalori = workout.burnedCalories
        if (activityModel.workOutAttributeValueId == 0 && workout.attributes && workout.attributes.length > 0) {
          updateActivityModel({ ...activityModel, workOutAttributeValueId: workout.attributes[0].attributeValue[0].id })
        }
      }
    }
  }

  const getPersonalActivityFromDB = () => {
    personalActivityDB.find({
      selector: { id: activityModel.personalWorkOutId }
    }).then((rec) => {
      if (rec.docs.length > 0) {
        const item = rec.docs[0]
        const h = parseInt(item.duration.split(":")[0])
        const m = parseInt(item.duration.split(":")[1])
        const burnedCalories = parseFloat(item.calorie) / ((h * 60 + m))

        updateActivityModel({
          ...activityModel,
          personalWorkOutId: item.id,
          classification: null,
          burnedCalories: burnedCalories / specification[0].weightSize,
        })
        updateModel({
          ...model,
          burnedCalories: burnedCalories / specification[0].weightSize,
          name: {
            persian: item.name,
            arabic: item.name,
            english: item.name
          }
        })
        unitBurnedCalori = parseFloat((burnedCalories / specification[0].weightSize).toFixed(7))
      }
      else {
        getPersonalActivityFromServer()
      }

    })
  }

  const getPersonalActivityFromServer = () => {
    const url = urls.workoutBaseUrl + urls.personalWorkOut + `?userId=${user.id}&Page=1&PageSize=200`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = { ...activity }

    const RC = new RestController()
    RC.checkPrerequisites(method, url, params, header, getPersonalSuccess, getPersonalFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getPersonalSuccess = (res) => {

  }

  const getPersonalFailure = () => {

  }

  const favoritePressed = () => {
    if (isFavorite) {
      removeFavoriteFromDB()
    }
    else {
      addFavoriteToDB()
    }
  }

  const addFavoriteToDB = () => {
    const f = {
      _id: Date.now().toString(),
      id: model.id,
      classification: model.classification
    }

    console.log("f", f)

    favoriteActivityDB.put(f)
    addToFavorite(f)
    setFavorite(true)
  }

  const removeFavoriteFromDB = () => {
    favoriteActivityDB.find({
      selector: { id: model.id }
    }).then(rec => {
      if (rec.docs.length > 0) {
        favoriteActivityDB.bulkDocs(rec.docs.map(item => ({ ...item, _deleted: true })))
        deleteFromFavorite(rec.docs[0])
        setFavorite(false)
      }
    })
  }

  const addToFavorite = (f) => {
    const url = urls.workoutBaseUrl + urls.userWorkoutFavorite + urls.create
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {
      userId: user.id,
      workOutId: f.id,
      _id: f._id
    }
    if (app.networkConnectivity) {
      const RC = new RestController()
      RC.checkPrerequisites("post", url, params, header, () => false, () => false, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }
    else {
      offlineDB.post({
        method: "post",
        type: "favoriteActivity",
        url: url,
        header: header,
        params: { ...params }
      }).then(res => {
        console.log(res)
      })
    }
  }

  const deleteFromFavorite = (f) => {
    const url = urls.workoutBaseUrl + urls.userWorkoutFavorite + `${model.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("delete", url, params, header, () => false, () => false, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const attrTypeChanged = (attr) => {
    updateActivityModel({
      ...activityModel,
      attributeId: attr.id,
      workOutAttributeValueId: model.attributes.find(item => item.id === attr.id).attributeValue[0].id
    })
    unitBurnedCalori = model.attributes.find(item => item.id === attr.id).attributeValue[0].burnedCalori
  }

  const attrChanged = (attr) => {
    console.log(attr)
    updateActivityModel({
      ...activityModel,
      workOutAttributeValueId: attr.id
    })

    unitBurnedCalori = attr.burnedCalori
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
    if ((!isNaN(parseFloat(hour)) && parseFloat(hour) > 0) ||
      (!isNaN(parseFloat(min)) && parseFloat(min) > 0)) {
      setSaving(true)
      const method = activityModel._id ? "put" : "post"
      const activity = {
        ...activityModel,
        duration: `${hour}:${min}:00`,
        burnedCalories: (((parseInt(hour) * 60) + parseInt(min)) * parseFloat(unitBurnedCalori) * specification[0].weightSize).toFixed(3),
        userId: user.id,
        _id: activityModel._id ? activityModel._id : Date.now().toString()
      }

      const data = { ...activity }
      if (data.workOutId === null || parseInt(data.workOutId) === 0 || isNaN(parseInt(data.workOutId))) {
        delete data["workOutId"]
      }
      else if (data.personalWorkOutId === null || parseInt(data.personalWorkOutId) || isNaN(parseInt(data.personalWorkOutId))) {
        delete data["personalWorkOutId"]
      }
      if (activity.workOutAttributeValueId == 0) {
        data.workOutAttributeValueId = null
      }

      if (app.networkConnectivity) {
        saveServer({ ...data }, method)
      }
      else {
        offlineDB.post({
          method: method,
          type: "activity",
          url: urls.workoutBaseUrl + urls.userTrackWorkout,
          header: { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } },
          params: { ...data }
        }).then(res => {
          console.log(res)
          saveToDB({ ...activity })
        })
      }
      // Toast.show({
      //   type: "success",
      //   props: { text2: lang.successful, style: { fontFamily: lang.font } }
      // })
    }
    else {
      // setErrorContext(lang.empityAllFilds)
      // setErrorVisible(true)
      Toast.show({
        type: "error",
        props: { text2: lang.empityAllFilds, style: { fontFamily: lang.font } },
        visibilityTime:1000
      })
    }
  }

  const saveToDB = (activity) => {
    activityDB.find({
      selector: { _id: activity._id }
    }).then(records => {
      if (records.docs.length === 0) {
        activityDB.put(activity, () => {
          setSaving(false);
          // setErrorContext(lang.successful);
          // setErrorVisible(true)
          Toast.show({
            type: "success",
            props: { text2: lang.successful, style: { fontFamily: lang.font } },
            visibilityTime:1000,
            onShow: props.navigation.goBack(),


          })
        }).catch(e => console.log())
      }
      else {
        activityDB.put(
          { ...activity, _id: records.docs[0]._id, _rev: records.docs[0]._rev },
          () => {
            setSaving(false)
            // setErrorContext(lang.successful)
            // setErrorVisible(true)
            Toast.show({
              type: "success",
              props: { text2: lang.successful, style: { fontFamily: lang.font } },
              visibilityTime:1000,
              onShow: props.navigation.goBack()
            })
          })
      }

    })
  }

  const saveServer = (activity, method) => {
    const url = urls.workoutBaseUrl + urls.userTrackWorkout
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = { ...activity }
    const RC = new RestController()
    RC.checkPrerequisites(method, url, params, header, (res) => onSuccess(res, activity), onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onSuccess = (response, activity) => {
    analytics().logEvent("add_activity", { ...activity })
    saveToDB({
      ...activity,
      id: response.data.data.id
    })

  }

  const onFailure = () => {
    setSaving(false)
    // setErrorContext(lang.serverError)
    // setErrorVisible(true)
    Toast.show({
      type: "error",
      props: { text2: lang.serverError, style: { fontFamily: lang.font } },
      visibilityTime:1000
    })
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  console.log("model", model)
  console.log("activityModel", activityModel)
  console.log("unitBurnedCalori", unitBurnedCalori)
  return (
    <>
      <FoodToolbar
        lang={lang}
        title={model.classification === null ? lang.myWorkouts : model.classification === 1 ? lang.sports : model.classification === 2 ? lang.aerobic : lang.bodyBuldingFavorite}
        onConfirm={onConfirm}
        onBack={() => props.navigation.goBack()}
        text={lang.saved}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {
          model.video != null ?
            <VideoPlayer
              url={model.video}
              poster={model.imageUri}
            /> :
            <Image
              source={(model.imageUri && model.imageUri != undefined && !showDefautImage) ? { uri: model.imageUri } : require("../../../res/img/exercise.png")}
              style={styles.img}
              resizeMode="contain"
              onError={(e) => setshowDefautImage(true)}
            />
        }
        <RowStart style={styles.header}>
          <RowWrapper style={{ marginVertical: 0 }}>
            <TouchableOpacity onPress={favoritePressed}>
              <Icon
                name={isFavorite ? "heart" : "heart-outlined"}
                style={{ fontSize: moderateScale(25), marginRight: moderateScale(10), color: defaultTheme.error }}
              />
            </TouchableOpacity>
            <Text style={[styles.title, { fontFamily: lang.font }]} allowFontScaling={false}>
              {model.name && model.name != undefined && model.name[lang.langName]}
            </Text>
          </RowWrapper>
        </RowStart>
        {
          (model.targetMuscle && model.targetMuscle != 0) ?
            <RowStart
              style={styles.rowStyle}
            >
              <Text style={[styles.title, { fontFamily: lang.font }]} allowFontScaling={false}>
                {
                  lang.MuscleGol + " : " + (allMuscles.find(muscle => muscle.id == model.targetMuscle))[lang.langName]
                }
              </Text>
            </RowStart> :
            null
        }
        {
          (model.bodyMuscles && model.bodyMuscles.length > 0) ?
            <RowStart
              style={styles.rowStyle}
            >
              <Text style={[styles.text1, { fontFamily: lang.font, color: defaultTheme.darkText }]} allowFontScaling={false}>
                {
                  lang.MuscleInvolved + ": " + model.bodyMuscles.map(muscleId => {
                    return (allMuscles.find(m => m.id == muscleId))[lang.langName] + "  "
                  })
                }
              </Text>
            </RowStart> :
            null
        }
        {
          (model.howToDo && model.howToDo.id && model.howToDo[lang.langName]) ?
            <ColumnStart
              style={styles.rowStyle2}
            >
              <Text style={[styles.title2, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.howToDo}
              </Text>
              <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                {model.howToDo[lang.langName]}
              </Text>
            </ColumnStart> :
            null
        }

        {
          (model.recommandation && model.recommandation.id && model.recommandation[lang.langName]) ?
            <ColumnStart
              style={styles.rowStyle2}
            >
              <Text style={[styles.title2, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.recommedation}
              </Text>
              <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                {model.recommandation[lang.langName]}
              </Text>
            </ColumnStart> :
            null
        }
        {
          (model.attributes && model.attributes.length > 1) ?
            <>
              <RowSpaceBetween
                style={[styles.rowStyle, { justifyContent: "space-between" }]}
              >
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {
                    lang.choose
                  }
                </Text>
                {
                  activityModel.attributeId &&
                  <DropDown
                    lang={lang}
                    data={model.attributes.map(attr => ({ id: attr.id, name: attr.name[lang.langName] }))}
                    selectedItem={model.attributes.find(attr => attr.id === activityModel.attributeId) != undefined ?
                      (model.attributes.find(attr => attr.id === activityModel.attributeId)).name[lang.langName] : ""}
                    onItemPressed={(attr) => attrTypeChanged(attr)}
                    selectedTextStyle={{ fontSize: moderateScale(18), maxWidth: dimensions.WINDOW_WIDTH * 0.55 }}
                    style={{}}
                  />
                }
              </RowSpaceBetween>
              <RowSpaceBetween
                style={[styles.rowStyle, { justifyContent: "space-between" }]}
              >
                <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                  {
                    lang.choose
                  }
                </Text>
                <DropDown
                  lang={lang}
                  data={model.attributes.find(attr => attr.id === activityModel.attributeId) != undefined ?
                    (model.attributes.find(attr => attr.id === activityModel.attributeId)).attributeValue.map(item => ({ id: item.id, name: item.name[lang.langName], burnedCalori: item.burnedCalori })) : []}

                  selectedItem={model.attributes.find(attr => attr.id === activityModel.attributeId) != undefined &&
                    (model.attributes.find(attr => attr.id === activityModel.attributeId)).attributeValue.find(item => item.id === activityModel.workOutAttributeValueId).name[lang.langName]}
                  onItemPressed={(attr) => attrChanged(attr)}
                  selectedTextStyle={{ fontSize: moderateScale(18), maxWidth: dimensions.WINDOW_WIDTH * 0.55 }}
                  style={{}}
                />
              </RowSpaceBetween>
            </>
            :
            (model.attributes && model.attributes.length > 0) ?
              model.attributes.map(item => (
                <RowSpaceBetween
                  style={[styles.rowStyle, { justifyContent: "space-between" }]}
                  key={item.id.toString()}
                >
                  <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                    {
                      item.name[lang.langName]
                    }
                  </Text>
                  <DropDown
                    lang={lang}
                    data={item.attributeValue.map(attr => ({ id: attr.id, name: attr.name[lang.langName], burnedCalori: attr.burnedCalori }))}
                    selectedItem={item.attributeValue.find(attr => attr.id === activityModel.workOutAttributeValueId) != undefined ?
                      (item.attributeValue.find(attr => attr.id === activityModel.workOutAttributeValueId)).name[lang.langName] : ""}
                    onItemPressed={(attr) => attrChanged(attr)}
                    selectedTextStyle={{ fontSize: moderateScale(18), maxWidth: dimensions.WINDOW_WIDTH * 0.55 }}
                    style={{ width: dimensions.WINDOW_WIDTH * 0.5 }}
                  />
                </RowSpaceBetween>
              )) :
              null
        }
        <View style={styles.timeContainer}>
          <Text style={[styles.text1, { fontFamily: lang.font, color: defaultTheme.darkText, textAlign: "left" }]} allowFontScaling={false}>
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
            burnedCalori={unitBurnedCalori * specification[0].weightSize}
          />
          <RowCenter>
            {/* <DoubleInput
              lang={lang}
              seprator={":"}
              placeholder1={lang.hour}
              placeholder2={lang.min}
              focusControl={() => showTimePicker()}
              editable={false}
              value1={hour}
              value2={min}
            /> */}

          </RowCenter>
        </View>
        <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
          {parseInt((((parseInt(hour) * 60) + parseInt(min)) * parseFloat(unitBurnedCalori) * specification[0].weightSize).toFixed(0)).toString()}
        </Text>
        <Text style={[styles.text3, { fontFamily: lang.font, marginBottom: "5%" }]} allowFontScaling={false}>
          {
            lang.burnColories
          }
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.saved}
          leftImage={require("../../../res/img/done.png")}
          onPress={onConfirm}
          isLoading={saving}
        />
      </View>



      {/* <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => errorContext === lang.successful ? props.navigation.goBack() : setErrorVisible(false)}
        lang={lang}
      /> */}

    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: defaultTheme.error,
  },
  header: {
    marginVertical: 0,
    padding: moderateScale(5),
    backgroundColor: defaultTheme.grayBackground
  },
  img: {
    width: dimensions.WINDOW_WIDTH,
    height: dimensions.WINDOW_WIDTH * 0.389,
  },
  rowStyle: {
    borderBottomWidth: 1.2,
    padding: moderateScale(8),
    paddingStart: moderateScale(18),
    marginVertical: 0,
    justifyContent: "flex-start"
  },
  rowStyle2: {
    padding: moderateScale(8),
    paddingVertical: 0,
    paddingStart: moderateScale(18),
    marginVertical: 0,
  },
  mediaContainer: {
    width: "100%",
  },
  timeContainer: {
    width: dimensions.WINDOW_WIDTH,
    backgroundColor: defaultTheme.grayBackground,
    padding: moderateScale(16),
    alignItems: "flex-start",
    paddingVertical: moderateScale(20)
  },
  title: {
    fontSize: moderateScale(16),
    color: defaultTheme.darkText
  },
  title2: {
    width: "95%",
    fontSize: moderateScale(16),
    color: defaultTheme.darkText,
    lineHeight: moderateScale(24),
    marginVertical: moderateScale(10),
    textAlign: "left"
  },
  text: {
    fontSize: moderateScale(17),
    color: defaultTheme.mainText,
    lineHeight: moderateScale(24)
  },
  text1: {
    width: "95%",
    fontSize: moderateScale(14),
    color: defaultTheme.mainText,
    lineHeight: moderateScale(24),
    textAlign: "left",
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
    marginBottom: "5%",
    width: dimensions.WINDOW_WIDTH,
    alignItems: "center",
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
  },
});

export default ActivityDetailsScreen;
