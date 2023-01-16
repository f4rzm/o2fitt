import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  I18nManager,
  NativeEventEmitter,
  TouchableWithoutFeedback,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import {
  Toolbar,
  ConfirmButton,
  RowCenter,
  CustomInput,
  Information,
  RowStart,
  RowSpaceBetween,
  RadioButton,

} from '../../components';
import { moderateScale } from 'react-native-size-matters';
import { Switch, TextInput } from 'react-native-gesture-handler';
// import { AnimatedGaugeProgress, GaugeProgress } from 'react-native-simple-gauge';
import { RestController } from '../../classess/RestController';
import { urls } from '../../utils/urls';
import PouchDB from '../../../pouchdb';
import moment from 'moment';
import pouchdbSearch from 'pouchdb-find';
import stepBurnedCalorie from '../../utils/stepBurnedCalorie';
import analytics from '@react-native-firebase/analytics';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import RNWalkCounter from 'react-native-walk-counter';
import { increase, setAutoCounterZero, setPedometerDate, setActiveCounter, updateTarget, setPedometerCounter } from '../../redux/actions/index'
import Shoe from '../../../res/img/shoe.svg'
import { Modal } from 'react-native-paper';
import BurnedCalorie from '../../../res/img/burned-calorie.svg'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native';
import BackgroundService from 'react-native-background-actions'
import { PERMISSIONS } from 'react-native-permissions'
import IMGTXTmodal from '../../components/IMGTXTmodal';
import { requestIgnoreBatteryOptimizations } from 'react-native-send-intent'

 const WalkEvent = new NativeEventEmitter(RNWalkCounter);


PouchDB.plugin(pouchdbSearch);
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const PedometerScreen = (props) => {

  const sleep = (time) =>
    new Promise((resolve) => setTimeout(() => {
      resolve()
    }, time));

  const dispatch = useDispatch()
  const navigation = useNavigation()


  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);
  const specification = useSelector((state) => state.specification);
  const pedometer = useSelector((state) => state.pedometer);

  let oldWholeSteps = React.useRef(0).current;
  const [autoCounter, setAutoCounter] = React.useState(false);
  const [fill, setFill] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [selectedDate, setDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [hour, setHour] = React.useState(0);
  const [min, setMin] = React.useState(0);
  const [sec, setSec] = React.useState(0);
  const [oldWhole, setOldWhole] = React.useState(0);
  const [goal, setGoal] = React.useState(0)
  const [textStep, setTextStep] = React.useState(props.route.params ? (props.route.params.item.stepsCount).toString() : "0");
  const [wholeSteps, setWholeStep] = React.useState(0);
  const [oldSteps, setOldStep] = React.useState(0);
  const [autoStep, setAutoStep] = React.useState(0);
  const [counter, setCounter] = React.useState(0);
  const [pedometerActivation, setPedometerActivation] = React.useState("")
  const [manualSteps, setManualSteps] = useState()
  const [batteryOptimizeModal, setBatteryOptimizeModal] = useState(false)
  const editId = React.useRef(
    props.route.params ? props.route.params.item._id : null,
  ).current;
  const rev = React.useRef(
    props.route.params ? props.route.params.item._rev : null,
  ).current;
  const translateY = useRef(new Animated.Value(100)).current

  async function getstep1() {
    console.error("user", await AsyncStorage.getItem("pedometerObj"));
  }
  React.useEffect(() => {
    getstep1()
    getStep();
  }, []);
  //========================auto walk counter ===========================\\
  const options = {
    taskName: lang.stepCounter,
    taskTitle: lang.stepCounter,
    taskDesc: lang.o2fitISCountingSteps,
    taskIcon: {
      name: 'notif',
      type: 'mipmap',
    },
    color: "#7f868c",
    linkingURI: 'o2fitt://PedometerScreen',
    parameters: {
      delay: 300000,
      // delay: 900000,
    },
  };


  const veryIntensiveTask = async (taskDataArguments) => {

    let step = await AsyncStorage.getItem('Steps');
    let stepDate = await AsyncStorage.getItem('autoStepCounterDate');
    let wholeSteps = 0


    // setCounter((step == null ? 0 : parseInt(step)) + parseInt(wholeSteps));
    if (step === null) {
      AsyncStorage.setItem("Steps", "1")
    }

    if (moment().format("YYYY-MM-DD") !== stepDate || stepDate === null || stepDate === undefined) {
      await AsyncStorage.setItem("Steps", "1")
      AsyncStorage.setItem("autoStepCounterDate", moment().format("YYYY-MM-DD"))
    }

    RNWalkCounter.RNWalkCounter.startCounter();
    WalkEvent.addListener('onStepRunning', async (event) => {
      wholeSteps = (parseInt(event.steps) + (step == null ? 0 : parseInt(step)))

      if (moment().format("YYYY-MM-DD") !== moment(stepDate).format("YYYY-MM-DD")) {
        onConfirm().then(async () => {
          AsyncStorage.setItem("Steps", "0")
          step = await AsyncStorage.getItem("Steps")
          dispatch(setAutoCounterZero())
          AsyncStorage.setItem("autoStepCounterDate", moment().format("YYYY-MM-DD")).then(async () => {
            stepDate = await AsyncStorage.getItem("autoStepCounterDate")
          })
          RNWalkCounter.RNWalkCounter.stopCounter();
          RNWalkCounter.RNWalkCounter.startCounter();
        })
      }
      //live pedometer Counter

      dispatch(setPedometerCounter(wholeSteps))
      AsyncStorage.setItem('Steps', `${parseInt(event.steps) + (step == null ? 0 : parseInt(step))}`);

      BackgroundService.updateNotification({
        taskDesc: `${lang.o2fitisCountingStepsNum + wholeSteps}`,
      });

    });

    //infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {

      for (let i = 0; BackgroundService.isRunning(); i++) {
        if (i !== 0) {

          if (moment().format("YYYY-MM-DD") !== moment(stepDate).format("YYYY-MM-DD")) {
            onConfirm().then(async () => {
              AsyncStorage.setItem("Steps", "1")
              step = await AsyncStorage.getItem("Steps")
              dispatch(setAutoCounterZero())
              AsyncStorage.setItem("autoStepCounterDate", moment().format("YYYY-MM-DD")).then(async () => {
                stepDate = await AsyncStorage.getItem("autoStepCounterDate")
              })
              RNWalkCounter.RNWalkCounter.stopCounter();
              RNWalkCounter.RNWalkCounter.startCounter();
            })
          } else {
            onConfirm()
          }


        }
        await sleep(delay);
      }
    });
  };

  const onAutoSelected = async () => {
    setAutoCounter(true);
    dispatch(setActiveCounter(true))
    await AsyncStorage.setItem('AutoStepSelected', 'true');
    await AsyncStorage.setItem('autoStepCounterDate', moment().format("YYYY-MM-DD"));
    await BackgroundService.start(veryIntensiveTask, options);

  };

  const onManualSelected = async () => {

    const autoCounter = await AsyncStorage.getItem('AutoStepSelected');

    if (autoCounter == "true") {
      onConfirm().then(async () => {
        BackgroundService.stop();
        WalkEvent.removeAllListeners("onStepRunning")
        dispatch(setActiveCounter(false))
        AsyncStorage.setItem('AutoStepSelected', 'false');
        // dispatch(setPedometerDate(moment().format("YYYY-MM-DD")))
        setPedometerActivation(lang.off)
        setAutoCounter(false);
        AsyncStorage.removeItem("lastPedoID")
      })
    }
    else {
      dispatch(setActiveCounter(false))
      AsyncStorage.setItem('AutoStepSelected', 'false');
      setAutoCounter(false);
    }
  }

  const onSwitchPressed = async () => {
    const autoDate = await AsyncStorage.getItem('autoStepCounterDate')
    const batteryOptimization = await AsyncStorage.getItem('batteryOptimize')
    // !autoCounter && onAutoSelected()
    // setAutoCounter(!autoCounter)
    if (batteryOptimization && batteryOptimization == "true") {
      if (autoCounter == true) {
        console.error("stop tracking");
        onConfirm().then(async () => {
          BackgroundService.stop();
          WalkEvent.removeAllListeners("onStepRunning")
          AsyncStorage.setItem('AutoStepSelected', 'false');
          dispatch(setActiveCounter(false))
          // dispatch(setPedometerDate(moment().format("YYYY-MM-DD")))
          setPedometerActivation(lang.off)
          setAutoCounter(false);
          AsyncStorage.removeItem("lastPedoID")
        })

      } else {
        if (moment().format("YYYY-MM-DD") !== autoDate) {
          await AsyncStorage.setItem("autoStepCounterDate", moment().format("YYYY-MM-DD"))
          await AsyncStorage.setItem("Steps", "1")
        }
        onAutoSelected();
        setPedometerActivation(lang.on)

      }
    } else {
      setBatteryOptimizeModal(true)
    }
  };


  const isAutoSelected = async () => {
    if (pedometer.isCounterActive === false) {
      setAutoCounter(false);
      setPedometerActivation(lang.off)
    } else {
      setAutoCounter(true);
      setPedometerActivation(lang.on)
    }
  };


  React.useEffect(() => {
    // onSwitchPressed()
    isAutoSelected();
    console.log('wholeSteps', wholeSteps);
    console.log('targetStep', profile.targetStep);
    if (autoStep > 0) {
      setWholeStep(oldSteps);
    }
  }, []);

  //==================================End===================================\\


  React.useEffect(() => {
    console.log('wholeSteps', wholeSteps);
    console.log('targetStep', profile.targetStep);
    if (
      !isNaN(parseInt(profile.targetStep)) &&
      !isNaN(parseInt(wholeSteps)) &&
      parseInt(profile.targetStep) > 0
    ) {
      setFill((wholeSteps * 100) / profile.targetStep);
    }
  }, [wholeSteps]);

  // const showLive = async () => {
  //   const date = await AsyncStorage.getItem("homeDate")

  //   if (moment().format("YYYY-MM-DD") == date) {
  //     setWholeStep(parseInt(wholeSteps) + 1)
  //   }

  // }

  // React.useEffect(() => {
  //   showLive()
  // }, [pedometer.AutoStepsCounter])

  // const updateLive = async () => {

  //   const date = await AsyncStorage.getItem("homeDate")
  //   if (moment().format("YYYY-MM-DD") == date) {

  //     let whole = wholeSteps + pedometer.AutoStepsCounter
  //     setWholeStep(whole)

  //   }
  // }
  // React.useEffect(() => {
  //   updateLive()
  // }, [])

  const size = dimensions.WINDOW_WIDTH * 0.6;

  const gaugeWidth = moderateScale(40);
  const cropDegree = 180;
  const textOffset = gaugeWidth;
  const textWidth = size - textOffset * 2;
  const textHeight = size * (1 - cropDegree / 360) - textOffset * 2;

  const getStep = () => {
    if (app.networkConnectivity) {
      getFromServer();
    } else {
      getFromDB();
    }
  };

  const getFromServer = () => {
    const url =
      urls.workoutBaseUrl +
      urls.userTrackSteps +
      `?dateTime=${selectedDate}&userId=${user.id}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {};

    const RC = new RestController();
    RC.checkPrerequisites(
      'get',
      url,
      params,
      header,
      getSuccess,
      getFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getSuccess = (response) => {
    console.log(response);
    getFromDB();
  };
  const getFailure = () => {

  };


  const getFromDB = async () => {
    const date = await AsyncStorage.getItem('homeDate');

    const reg = RegExp('^' + date, 'i');
    pedoDB
      .find({
        selector: { insertDate: { $regex: reg } },
      })
      .then((records) => {

        console.error(records.docs);
        if (records.docs.length <= 0 && pedometer.isCounterActive == false) {
          AsyncStorage.setItem("StepsID", moment().format("YYYYMMDD"))
          AsyncStorage.setItem("Steps", "0")

        } else {
          AsyncStorage.setItem("StepID", `${records.docs[0].id}`)
        }


        console.log('records', records);
        console.log('step', step);
        console.log('oldstep', oldstep);
        console.log('parseInt(textStep)', parseInt(textStep));
        let oldstep = 0;

        records.docs.map((item) =>
          editId != item._id
            ? (oldstep += parseInt(item.stepsCount))
            : (oldstep += 0),
        );

        setOldStep(oldstep);
        const tStep = !isNaN(parseInt(textStep)) ? parseInt(textStep) : 0;
        setWholeStep(
          parseInt(step) +
          parseInt(oldstep) +
          parseInt(tStep)
          // parseInt(AautoSteps)
        );
      });
  };

  // const onManualSelected = async () => {
  //   setAutoCounter(false);
  //   RNWalkCounter.RNWalkCounter.stopCounter();
  //   await BackgroundService.stop();
  // };
  //console.warn(moment('2022-10-30').format("YYYYMMDD"));

  const saveDB = async (data) => {
    const autoStepCounterDate = await AsyncStorage.getItem("autoStepCounterDate")
    pedoDB
      .find({
        selector: { _id: data._id },
      })
      .then((rec) => {
        // console.log('rec', rec);
        if (rec.docs.length > 0) {
          pedoDB
            .put({ ...rec.docs[0], ...data })
            .catch((error) => console.log(error));
        } else {
          pedoDB.put({ ...data }).catch((error) => console.log(error));
        }


      })
      .catch((error) => console.log(error));
    analytics().logEvent('setSteps');

    if (parseInt(moment(autoStepCounterDate).format("YYYYMMDD")) !== parseInt(moment().format("YYYYMMDD"))) {
      AsyncStorage.setItem("autoStepCounterDate", moment().format("YYYY-MM-DD"));
      dispatch(setAutoCounterZero())
    }

  };

  const saveServer = async (data) => {
    // //console.warn("s data", data);
    // console.error(data);

    // const lastPedoID = await AsyncStorage.getItem("lastPedoID")
    // const newPedoID = await AsyncStorage.getItem("StepsID")
    const url = urls.workoutBaseUrl + urls.userTrackSteps
    //console.warn(url);

    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }

    const params = { ...data }
    //console.warn(params);
    const RC = new RestController()
    if (data.stepsCount !== 0) {
      // if (parseInt(lastPedoID) == parseInt(data.id)) {
      if (params.id !== 0) {
        //console.warn("edit", params);
        RC.checkPrerequisites("put", url + "/id", params, header, (res) => onSuccess(res, params), (err) => onFailure(err, params), auth, onRefreshTokenSuccess, onRefreshTokenFailure)
      }
      // }
      else {
        //console.warn('New', params);
        RC.checkPrerequisites("post", url, params, header, (res) => onSuccess(res, params), (err) => onFailure(err, params), auth, onRefreshTokenSuccess, onRefreshTokenFailure)
      }
    }

  }


  const onSuccess = async (response, data) => {
    // console.warn('success');
    if (response.data.data) {
      saveLocal({
        ...response.data.data
      })
    }
    else {
      saveLocal({
        ...data
      })
    }
  }
  const saveLocal = async (data) => {
    console.warn('saveLocal', data);
    pedoDB
      .find({
        selector: { _id: data._id },
      })
      .then((rec) => {
        // console.log('rec', rec);
        if (rec.docs.length > 0) {
          //console.warn(0);
          pedoDB
            .put({ ...rec.docs[0], ...data })
            .catch((error) => console.log(error));
        } else {
          pedoDB.put({ ...data }).catch((error) => console.log(error));
        }
        setLoading(false);


      }).catch((error) => console.log(error));
      
    Toast.show({
      type: "success",
      props: { text2: lang.successful, style: { fontFamily: lang.font } },
      visibilityTime: 1000,
      onShow: navigation.goBack(),
    })
    analytics().logEvent('setSteps');

  };

  const onFailure = (data) => {
    console.error('failed', data);

    if (data.id > 0) {
      offlineDB
        .post({
          method: 'put',
          type: 'pedo',
          url: urls.workoutBaseUrl + urls.userTrackSteps + '/id',
          header: {
            headers: {
              Authorization: 'Bearer ' + auth.access_token,
              Language: lang.capitalName,
            },
          },
          params: data,
        })
        .then((res) => {
          console.error(res);
          saveLocal(data);
        });
    } else {
      offlineDB
        .post({
          method: 'post',
          type: 'pedo',
          url: urls.workoutBaseUrl + urls.userTrackSteps,
          header: {
            headers: {
              Authorization: 'Bearer ' + auth.access_token,
              Language: lang.capitalName,
            },
          },
          params: data,
        })
        .then((res) => {
          console.error(res);
          saveLocal(data);
        });
    }

  };



  const onRefreshTokenSuccess = () => { };

  const onRefreshTokenFailure = () => { };

  const onChangeText = (text) => {
    if (/^[0-9\.]+$/i.test(text) || text == '' || text == '.') {
      setTextStep(!isNaN(parseInt(text)) ? parseInt(text).toString() : '');

      if (text != '' && !isNaN(parseInt(text)) && text != null) {
        console.log(parseInt(text));
        console.log(step);
        console.log(oldSteps);
        setWholeStep(step + oldSteps + parseInt(text));
      } else {
        setWholeStep(step + oldSteps);
      }
    } else {
      Toast.show({
        type: 'error',
        props: { text2: lang.typeEN, style: { fontFamily: lang.font } },
        visibilityTime: 1000,
      })
    }

  };

  const updateOldWhoe = () => {
    setOldWhole(wholeSteps);
  };


  const onConfirm = async () => {

    const autoDate = await AsyncStorage.getItem('autoStepCounterDate')
    const autoSteps = await AsyncStorage.getItem("Steps")
    // const date = await AsyncStorage.getItem("homeDate")
    // let data = JSON.parse(await AsyncStorage.getItem("pedometerObj"))

    const data = {
      id: parseInt(moment(autoDate).format("YYYYMMDD")),
      _id: moment(autoDate).format("YYYYMMDD").toString(),
      "userId": user.id,
      "insertDate": moment(autoDate).format("YYYY-MM-DD"),
      "stepsCount": autoSteps ? parseInt(autoSteps) : 1,
      "duration": `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`,
      "userWeight": specification[0].weightSize,
      "burnedCalories": stepBurnedCalorie(autoSteps ? parseInt(autoSteps) : 1, specification[0].weightSize),
      isManual: false
    }

    const ws = !isNaN(parseInt(wholeSteps)) ? parseInt(wholeSteps) : 0
    const os = !isNaN(parseInt(oldSteps)) ? parseInt(oldSteps) : 0
    if (parseInt(data.stepsCount) > 0) {

      saveDB(data)

      return true


    }
  }

  const [autoFocuse, setAutoFocuse] = React.useState(false)

  const showModal = () => {
    Animated.spring(translateY, {
      toValue: Platform.OS == "ios" ? moderateScale(-150) : -100,
      useNativeDriver: true
    }).start()
    setAutoFocuse(true)
    props.onPress(true)
  }
  const setTargetStep = () => {
    setLoading(true)
    props.onPress(false)
    dispatch(
      updateTarget(
        {
          ...profile,
          targetStep: goal
        },
        auth,
        app,
        user,
        () => {
          setElevationC(0)
          setLoading(false)
          setAutoFocuse(false)
          setTimeout(() => {
            setElevationC(5)
          }, 500)


        },
        showError
      )
    )
  }
  const showError = (err) => {
    setLoading(false)
    console.error(err)
  }
  const [burnedCalorie, setBurnedCalorie] = React.useState(stepBurnedCalorie(parseInt(profile.targetStep), parseInt(specification[0].weightSize)))
  useEffect(() => {
    setBurnedCalorie(stepBurnedCalorie(parseInt(goal), parseInt(specification[0].weightSize)))
  }, [goal])
  const [elevationC, setElevationC] = React.useState(5)
  const textInput = useRef(null)

  const onConfirmManualSteps = async() => {
    const date = await AsyncStorage.getItem("homeDate")
    if (textStep !== 0 && textStep !== "0" && textStep !== "") {
      setLoading(true)
      const data = {
        id: props.route.params ? props.route.params.item.id : 0,
        _id: props.route.params ? props.route.params.item._id : Date.now().toString(),
        "userId": user.id,
        "insertDate":  date,
        "stepsCount": textStep,
        "duration": `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`,
        "userWeight": specification[0].weightSize,
        "burnedCalories": stepBurnedCalorie(textStep, specification[0].weightSize),
        "IsManual": true
      }

      saveServer(data)
    } else {
      Toast.show({
        type: "error",
        props: { text2: lang.fillSteps, style: { fontFamily: lang.font } },
        visibilityTime: 800
      })
    }

  }
  const batteryPermissionRequest = () => {
    setBatteryOptimizeModal(false)
    requestIgnoreBatteryOptimizations().then((res) => {
      AsyncStorage.setItem('batteryOptimize', "true").then(() => {
        onSwitchPressed()
        analytics().logEvent('battery_optimization_turned_on')
      })
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <>
      {
        props.route.params ?
          <Toolbar
            lang={lang}
            title={lang.setStepTitle}
            onBack={() => props.navigation.goBack()}
          /> : null
      }

      <ScrollView
        style={{ flexGrow: 1, height: dimensions.WINDOW_HEIGTH }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {errorVisible ? (
          <TouchableWithoutFeedback
            onPress={() => setCloseDialogVisible(false)}>
            <View style={styles.wrapper}>
              <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={6}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {/* <RowStart style={{ borderBottomWidth: 1, padding: moderateScale(8) }}>
          <Text style={[styles.text, { fontFamily: lang.font }]}>
            {lang.pedTitle}
          </Text>
        </RowStart> */}
        <View style={styles.container}>
          {
            !props.route.params &&
            <RowSpaceBetween style={{ padding: moderateScale(10), width: dimensions.WINDOW_WIDTH * 0.93, justifyContent: "space-between" }}>
              <Text style={{ fontSize: moderateScale(16), fontFamily: lang.font, marginHorizontal: moderateScale(8), color: defaultTheme.darkText }}>
                {lang.stepsDes + " : " + pedometerActivation}
              </Text>
              <View style={{}}>
                <Switch value={autoCounter} onValueChange={onSwitchPressed} />
              </View>
            </RowSpaceBetween>
          }
          {/* <Text
            style={[
              styles.text,
              { fontFamily: lang.font, marginLeft: moderateScale(16),marginBottom:moderateScale(15) },
            ]}>
            {lang.ifYouStartPedometer}
          </Text> */}
        </View>
        <RowSpaceBetween style={{ backgroundColor: defaultTheme.white, width: "93%", borderRadius: moderateScale(13), elevation: 5, paddingVertical: moderateScale(10), marginVertical: moderateScale(20), flexDirection: "column" }}>
          <View style={{ width: "100%", alignItems: "baseline", paddingHorizontal: moderateScale(15) }}>
            <Text style={{ fontSize: moderateScale(15), fontFamily: lang.titleFont, color: defaultTheme.darkText }}>{lang.manualStep}</Text>
            {/* <RadioButton
            lang={lang}
            title={lang.numberOfSteps}
            style={{ borderColor: defaultTheme.gray }}
            textStyle={{ fontSize: moderateScale(15) }}
            isSelected={!autoCounter}
            onPress={onManualSelected}
          /> */}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: lang.font,
                  width: dimensions.WINDOW_WIDTH - moderateScale(170),
                },
              ]}>
              {lang.setYourStepsdesc}
            </Text>
            <CustomInput
              autoFocus={props.route.params ? true : false}
              lang={lang}
              style={styles.number}
              textStyle={{
                fontSize: moderateScale(18),
                color: defaultTheme.blue,
                textAlign: 'center',
              }}
              maxLength={6}
              keyboardType="decimal-pad"
              onChangeText={onChangeText}
              value={textStep.toString()}
            />
          </View>
        </RowSpaceBetween>
        {/* <TouchableOpacity activeOpacity={1} onPress={() => textInput.current.focus()}>
          <RowSpaceBetween style={[styles.targetComponent, { marginBottom: moderateScale(0) }]}>

            <Text style={[styles.text, { fontFamily: lang.font, marginLeft: moderateScale(16), width: dimensions.WINDOW_WIDTH - moderateScale(170) }]}>
              {lang.setYourStepsdesc}
            </Text>
            <TextInput
              ref={textInput}
              style={{ height: moderateScale(45), width: moderateScale(80), borderWidth: 1, borderRadius: 15, fontSize: lang.langName == 'persian' ? moderateScale(20) : moderateScale(19), color: defaultTheme.blue, textAlign: "center", fontFamily: lang.font, borderColor: defaultTheme.border, marginHorizontal: moderateScale(10) }}
              textStyle={{ fontSize: moderateScale(22), color: defaultTheme.blue, textAlign: "center" }}
              maxLength={6}
              keyboardType="decimal-pad"
              onChangeText={onChangeText}
              value={textStep.toString()}
              autoFocus={props.route.params ? true : false}
              placeholder={"0"}


            />
          </RowSpaceBetween>
        </TouchableOpacity> */}
        {props.route.params ? null :
          <TouchableOpacity activeOpacity={0.8} onPress={showModal} style={styles.targetComponent}>
            <View style={{ flexDirection: I18nManager ? "row" : "row-reverse", alignItems: "center" }}>
              <Shoe
                width={moderateScale(45)}
              />
              <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText, paddingHorizontal: moderateScale(10) }}>{lang.targetStep}</Text>
            </View>
            <View style={{ flexDirection: !I18nManager.isRTL ? "row" : "row-reverse", alignItems: "center" }}>
              <TouchableOpacity onPress={showModal} style={{ width: moderateScale(40), height: moderateScale(50), alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require('../../../res/img/back.png')}
                  style={{ width: moderateScale(17), height: moderateScale(17), tintColor: defaultTheme.gray, transform: [{ rotate: I18nManager ? "0deg" : "180deg" }] }}
                  resizeMode={"contain"}

                />
              </TouchableOpacity>
              {/* <TextInput
                style={{ width: moderateScale(80), borderWidth: 1, borderRadius: 15, fontSize: lang.langName == 'persian' ? moderateScale(23) : moderateScale(19), color: defaultTheme.blue, textAlign: "center", fontFamily: lang.font, borderColor: defaultTheme.border, height: Platform.OS == "ios" ? moderateScale(45) : "auto", alignItems: "center", justifyContent: "center" }}
                keyboardType={"numeric"}
                placeholder={`${profile.targetStep}`}
                placeholderTextColor={defaultTheme.blue}
                editable={false}
              /> */}
              <View style={{ borderRadius: 15, borderWidth: 1, width: moderateScale(90), alignItems: "center", justifyContent: "center", height: moderateScale(45), borderColor: defaultTheme.border }}>
                <Text style={{ fontSize: lang.langName == 'persian' ? moderateScale(23) : moderateScale(18), fontFamily: lang.font, color: defaultTheme.blue }}>{profile.targetStep}</Text>
              </View>

            </View>
          </TouchableOpacity>
        }


        <View style={[styles.container2]}>
          <RowStart>

          </RowStart>

          <RowCenter
            style={{
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              paddingTop: moderateScale(30),
            }}>
            <Text
              style={[
                styles.text,
                { fontFamily: lang.font, fontSize: moderateScale(16) },
              ]}>
              0
            </Text>
            {/* <AnimatedGaugeProgress
              size={size}
              width={gaugeWidth}
              fill={fill}
              cropDegree={180}
              tintColor={defaultTheme.primaryColor}
              backgroundColor={defaultTheme.border}
              style={{ marginHorizontal: 20 }}
              // prefill={oldWhole}
              onAnimationComplete={updateOldWhoe}>
              <View
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  bottom: size / 2,
                  left: textOffset,
                  width: textWidth,
                  height: textHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[styles.text3, { fontFamily: lang.font }]}
                  allowFontScaling={false}>
                  <Text
                    style={[styles.text2, { fontFamily: lang.titleFont }]}
                    allowFontScaling={false}>
                    {wholeSteps + ' '}
                  </Text>
                  {lang.step}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  bottom: size / 4,
                  left: 0,
                  width: size,
                  height: textHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[styles.text3, { fontFamily: lang.font }]}
                  allowFontScaling={false}>
                  <Text
                    style={[styles.text4, { fontFamily: lang.titleFont }]}
                    allowFontScaling={false}>
                    {stepBurnedCalorie(
                      wholeSteps,
                      specification[0].weightSize,
                    ) + ' '}
                  </Text>
                  {lang.stepBurnedCal}
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  top: -moderateScale(30),
                  left: 0,
                  width: size,
                  height: textHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.text,
                    { fontFamily: lang.font, fontSize: moderateScale(16) },
                  ]}
                  allowFontScaling={false}>
                  {parseInt(profile.targetStep * 0.5)}
                </Text>
              </View>
            </AnimatedGaugeProgress> */}
            <Text
              style={[
                styles.text,
                { fontFamily: lang.font, fontSize: moderateScale(16) },
              ]}
              allowFontScaling={false}>
              {profile.targetStep}
            </Text>
          </RowCenter>

        </View>

      </ScrollView>
      <ConfirmButton
        lang={lang}
        style={styles.button}
        title={lang.saved}
        leftImage={require('../../../res/img/done.png')}
        onPress={onConfirmManualSteps}
        isLoading={isLoading}
      />
      <Modal
        visible={autoFocuse}
        contentContainerStyle={{ position: Platform.OS == "ios" ? "relative" : "absolute", zIndex: 50, bottom: 0 }}
        onDismiss={() => {
          setAutoFocuse(false)
          setGoal(profile.targetStep)
          props.onPress(false)

        }}
      >
        <Animated.View style={[{ transform: [{ translateY: translateY }] }, styles.AnimatedModal]}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(19), color: defaultTheme.darkText, paddingTop: Platform.OS == 'ios' ? moderateScale(9) : moderateScale(4) }}>{lang.dailyTargetStep}</Text>
          </View>
          <View style={styles.stepTipView}>

            <LottieView
              source={require('../../../res/animations/idea.json')}
              autoPlay={true}
              style={{
                width: moderateScale(30), height: moderateScale(30)
              }}
            />

            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, }}>{lang.stepTip}</Text>
          </View>
          <View style={[styles.modalTip]}>
            {/* <LottieView
            width={moderateScale(100)}
            height={moderateScale(100)}
            source={require('../../../res/animations/idea.json')}
            autoPlay={true}
            /> */}

            <View style={{ flexDirection: I18nManager.isRTL ? "row" : "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: moderateScale(10) }}>
              <Shoe
                width={moderateScale(40)}
                height={moderateScale(40)}
              />
              <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText, }}>{lang.targetStep}</Text>
            </View>
            <TextInput
              autoFocus={autoFocuse}
              style={[styles.modalTextInput, {
                fontSize: lang.langName == 'persian' ? moderateScale(22) : moderateScale(19),
                fontFamily: lang.font,
              }]}
              placeholder={`${profile.targetStep}`}
              onChangeText={text => {
                if (/^[0-9\.]+$/i.test(text) || text == '' || text == '.') {
                  if (text.length <= 0) {
                    setGoal(0)
                  } else {
                    setGoal(parseInt(text).toString())
                  }
                } else {
                  Toast.show({
                    type: 'error',
                    props: { text2: lang.typeEN, style: { fontFamily: lang.font } },
                    visibilityTime: 1000,
                  })

                }
              }}
              maxLength={5}
              value={goal > 0 ? goal.toString() : ""}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ marginBottom: moderateScale(10), flexDirection: "row", alignItems: "center" }}>
            <BurnedCalorie
              width={moderateScale(30)}
              height={moderateScale(30)}
            />
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.8, textAlign: "left" }}>
              {
                lang.calculatedCalorie.split("*")[0] + " " + goal + " " + lang.calculatedCalorie.split("*")[1]
              }
              <Text style={{ color: defaultTheme.error }}> {burnedCalorie} </Text>
              <Text style={{ color: defaultTheme.darkText }}>{lang.calculatedCalorie.split("*")[2]}</Text>
            </Text>

          </View>
          <View style={{ alignItems: "center", paddingBottom: Platform.OS == "ios" ? moderateScale(40) : moderateScale(3) }}>
            <ConfirmButton
              style={styles.button2}
              lang={lang}
              title={lang.set}
              imageStyle={styles.img2}
              textStyle={[styles.buttonText, { fontSize: moderateScale(18) }]}
              onPress={setTargetStep}
              isLoading={isLoading}
            />
          </View>
        </Animated.View>
      </Modal>
      {batteryOptimizeModal &&
        <IMGTXTmodal
          lang={lang}
          text={lang.backgroundProcessText}
          onAccept={batteryPermissionRequest}
          onReject={() => setBatteryOptimizeModal(false)}
          rightBtnText={lang.accept}
          leftBtnText={lang.disagree}
          image={
            <Shoe
              width={moderateScale(100)}
              height={moderateScale(150)}
            />
          }
          acceptStyle={{ width: dimensions.WINDOW_WIDTH * 0.36, backgroundColor: defaultTheme.green, elevation: 2 }}
          acceptTextStyle={{ color: defaultTheme.white }}
          rejectStyle={{ width: dimensions.WINDOW_WIDTH * 0.36, borderColor: defaultTheme.error, backgroundColor: defaultTheme.white, borderWidth: 1, elevation: 2 }}
          rejectTextStyle={{ color: defaultTheme.error }}
        />
      }

      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() =>
          errorContext === lang.successful
            ? props.navigation.goBack()
            : setErrorVisible(false)
        }
        lang={lang}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textView: {
    position: 'absolute',
    top: moderateScale(38),
    left: moderateScale(38),
    width: moderateScale(126),
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
  },
  container: {
    width: dimensions.WINDOW_WIDTH * 0.93,
    marginTop: moderateScale(25),
    borderRadius: moderateScale(15),
    elevation: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

  },
  container2: {
    width: dimensions.WINDOW_WIDTH,
    padding: moderateScale(10),
    alignItems: 'center',
    borderRadius: moderateScale(15),
    marginTop: moderateScale(16),
    backgroundColor: "white",
    borderColor: defaultTheme.border,
  },
  number: {
    width: moderateScale(90),
    borderRadius: moderateScale(10),

  },
  text: {
    fontSize: moderateScale(14),
    color: defaultTheme.darkText,

  },
  text2: {
    fontSize: moderateScale(18),
    color: defaultTheme.darkText,
  },
  text3: {
    fontSize: moderateScale(13),
    color: defaultTheme.gray,
  },
  text4: {
    fontSize: moderateScale(30),
    color: defaultTheme.error,
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.4,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    alignSelf: 'center',
    marginBottom: moderateScale(16),
  },
  circle: {
    width: moderateScale(30),
    height: moderateScale(30),
    backgroundColor: defaultTheme.blue,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(20),
  },
  image: {
    width: moderateScale(18),
    height: moderateScale(18),
    tintColor: defaultTheme.lightBackground,
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
  targetComponent: {
    width: dimensions.WINDOW_WIDTH * 0.93,
    // marginTop: moderateScale(10),
    elevation: 5,
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: "center",
    borderRadius: moderateScale(15),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    justifyContent: "space-between",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  button2: {
    backgroundColor: defaultTheme.green,
    marginBottom: moderateScale(15),

  },
  AnimatedModal: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    backgroundColor: "white",
    top: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
    alignItems: "center"
  },
  modalTextInput: {
    width: moderateScale(80),
    borderWidth: 1,
    borderRadius: 13,
    textAlign: "center",
    borderColor: defaultTheme.border,
    backgroundColor: "white"
  },
  modalTip: {
    width: dimensions.WINDOW_WIDTH * 0.87,
    flexDirection: "row", borderRadius: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: defaultTheme.border,
    justifyContent: "space-between",
    marginVertical: moderateScale(14)
  },
  stepTipView: {
    width: dimensions.WINDOW_WIDTH * 0.87,
    flexDirection: "row",
    borderWidth: 0.7,
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    alignItems: "center",
    borderColor: defaultTheme.border,
    marginTop: moderateScale(10)
  }
});

export default PedometerScreen;
