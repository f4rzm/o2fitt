import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  Linking,
  TouchableWithoutFeedback,
  View,
  NativeEventEmitter,
  Text,
  AppState
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import {
  TwoOptionModal,
  Calendar,
  MainToolbar,
  NutritionCard,
  GoalCard,
  StepCard,
  WaterCard,
  SleepCard,
  BodyManagementCard,
  DatePicker,
  Uploader,
  BlogRow,
  AdvertiseRow,
  MarketModal,
  DietCard,
  Information
} from '../../components';
import moment from 'moment';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import { SyncPedoDB } from '../../classess/SyncPedoDB';
import { SyncWaterDB } from '../../classess/SyncWaterDB';
import { SyncSleepDB } from '../../classess/SyncSleepDB';
import { SyncMealDB } from '../../classess/SyncMealDB';
import { SyncActivityDB } from '../../classess/SyncActivityDB';
import { SyncBulkData } from '../../classess/SyncBulkData';
import {
  setStarRatingTimer,
  setUnreadMessageNumber,
  updateUnitMeasurement,
} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';
import messaging from '@react-native-firebase/messaging';
// import RNWalkCounter from 'react-native-walk-counter';

import PushNotification from 'react-native-push-notification';
import { isSetRating, setVipTimer } from '../../redux/actions/starRating';
import { Button } from 'react-native-paper';
import { openSettings } from 'react-native-send-intent';
import { addDate } from '../../redux/actions/syncedDate';
// const WalkEvent = new NativeEventEmitter(RNWalkCounter);

PouchDB.plugin(pouchdbSearch);
const waterDB = new PouchDB('water', { adapter: 'react-native-sqlite' });
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' });
const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' });
// const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const adDB = new PouchDB('ad', { adapter: 'react-native-sqlite' });
// const reminderDB = new PouchDB('reminder', { adapter: 'react-native-sqlite' });
// const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const HomeScreen = (props) => {

  const lang = useSelector((state) => state.lang);
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  const profile = useSelector((state) => state.profile);
  const pedometer = useSelector((state) => state.pedometer);
  const diet = useSelector((state) => state.diet)
  const starRating = useSelector((state) => state.starRating)
  const syncedDate = useSelector((state) => state.syncedDate)

  const specification = useSelector((state) => state.specification);

  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const today = moment();
  const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;

  const dispatch = useDispatch();
  const [showDatePicker, setShowPicker] = React.useState(false);
  const [selectedDate, setDate] = React.useState(
    moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
  );
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorContext, setErrorContext] = useState('')
  const [userWater, setUserWater] = React.useState(0);
  const [userStep, setUserStep] = React.useState([]);
  const [meals, setMeals] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  const [advertises, setAdvertises] = React.useState([]);
  const [optionalDialogVisible, setOptionalDialogVisible] =
    React.useState(false);
  const [closeDialogVisible, setCloseDialogVisible] = React.useState(false);
  const [userSleepCalories, setUserSleepCalories] = React.useState(0);
  const [userSleepDuration, setUserSleepDuration] = React.useState(0);
  const [blogIsLiked, setBolgIsLiked] = React.useState(0);
  const [calBtnDisabled, setCalBtnDisabled] = useState(false);
  const [changeGoalDate, setChangeGoalDate] = useState();
  let waterBulkSync = React.useRef(false).current;
  let stepBulkSync = React.useRef(false).current;
  let mealBulkSync = React.useRef(false).current;
  let activityBulkSync = React.useRef(false).current;
  let syncedDays = React.useRef([]).current;

  const appState = useRef(AppState.currentState);
  useEffect(() => {

    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      ////console.warn("work");
      setDate(moment().format("YYYY-MM-DD"))
      AsyncStorage.setItem("homeDate", moment().format("YYYY-MM-DD"))

    }

    appState.current = nextAppState;
    // setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };


  // console.error(user.id);
  const getStepFromDB = async (date, serverResponse) => {

    const url = urls.workoutBaseUrl + urls.userTrackSteps
    const RC = new RestController()

    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }

    let data;
    if (!stepBulkSync) {
      const reg = RegExp('^' + date, 'i');
      pedoDB
        .find({
          selector: { insertDate: { $regex: reg } },
        })
        .then((records) => {
          setUserStep(records.docs);
          let ServerPedoCounter = [];
          let DbPedometer = [];
          for (let i = 0; i < serverResponse.length; i++) {
            const element = serverResponse[i];
            if (element.isManual == false) {

              ServerPedoCounter.push(element)
            }
          }
          for (let i = 0; i < records.docs.length; i++) {
            const element1 = records.docs[i];
            if (element1.isManual == false) {
              DbPedometer.push(element1)
            }
          }

          if (app.networkConnectivity) {

            if (DbPedometer.length > 0) {
              if (serverResponse) {
                //EDIT
                if (ServerPedoCounter.length > 0) {

                  if (parseInt(DbPedometer[0].stepsCount) > parseInt(ServerPedoCounter[ServerPedoCounter.length - 1].stepsCount)) {
                    data = { ...ServerPedoCounter[0], stepsCount: DbPedometer[0].stepsCount, burnedCalories: DbPedometer[0].burnedCalories }
                    RC.checkPrerequisites("put", url + "/id", data, header, (res) => onSuccessStep(res, params), onFailureStep, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
                  }

                }
                else {
                  //console.warn("NEw");
                  data = {
                    id: 0,
                    _id: DbPedometer[0]._id,
                    "userId": parseInt(user.id),
                    "insertDate": DbPedometer[0].insertDate,
                    "stepsCount": parseInt(DbPedometer[0].stepsCount),
                    "duration": DbPedometer[0].duration,
                    "userWeight": parseInt(DbPedometer[0].userWeight),
                    "burnedCalories": parseInt(DbPedometer[0].burnedCalories),
                  }
                  RC.checkPrerequisites("post", url, data, header, (res) => onSuccessStep(res, params), onFailureStep, auth, onRefreshTokenSuccess, onRefreshTokenFailure)

                }
              }
            }
          }
        });
    }
  }
  const onSuccessStep = () => {
    console.error("Success");
  }
  const onFailureStep = (err) => {
    // console.error(err);
  }

  React.useEffect(() => {
    //console.warn(starRating.starRatingTimer)
    if (starRating.starRatingTimer == undefined) {
      dispatch(setStarRatingTimer(moment().add(7, "days").format("YYYY-MM-DDTHH:mm:ss")))
      dispatch(isSetRating(false))
    }
    if (starRating.vipTimer == undefined) {

      dispatch(setVipTimer(moment().add(3, "days").format("YYYY-MM-DD")))
    }

    // getAdvertises();
    // getUnit();


    AsyncStorage.setItem('homeDate', selectedDate);
    // waterDB
    //   .changes({ since: 'now', live: true, include_docs: true })
    //   .on('change', waterChangeDetected);
    // pedoDB
    //   .changes({ since: 'now', live: true, include_docs: true })
    //   .on('change', pedoChangeDetected);
    // sleepDB
    //   .changes({ since: 'now', live: true, include_docs: true })
    //   .on('change', sleepChangeDetected);
    // mealDB
    //   .changes({ since: 'now', live: true, include_docs: true })
    //   .on('change', mealChangeDetected);
    // activityDB
    //   .changes({ since: 'now', live: true, include_docs: true })
    //   .on('change', activityChangeDetected);
  }, []);

  const getWholeData = (date) => {
    let time = date ? date : selectedDate
    //  console.warn(selectedDate);
    // getStepFromDB(selectedDate);
    // console.error(diet.weekDinner[0].id)
    // console.error(diet.weekSnack[1])
    // console.error(diet.weekLunch[0].id)
    // console.error(diet.weekBreafkast[0].id)
    // setMeals([])
    // setUserWater(0)
    // setUserStep([])
    // setActivities([])
    syncSteps(time);
    getMealFromDB(time, false);
    if (app.networkConnectivity) {

    //syncedDays.indexOf(selectedDate) === -1
    // syncedDays.push(selectedDate)
    // syncMeal(time);
    syncWater(time);
    // // syncSteps(selectedDate);
    syncSleep(time);
    syncActivities(time);

    } else {
    getWaterFromDB(time);
    getSleepFromDB(time);
    getActivityFromDB(time);
    }
  }

  React.useEffect(() => {
    getWholeData()
  }, [selectedDate, app.networkConnectivity]);

  const changeDate = async () => {
    const date = await AsyncStorage.getItem("homeDate")
    setDate(date)
    getWholeData(date)
    const stepDate = await AsyncStorage.getItem("autoStepCounterDate")
    const step = await AsyncStorage.getItem("Steps")
    if (moment().format("YYYY-MM-DD") == stepDate) {
      ////console.warn("stepDate changed");
    }
  }
  React.useEffect(() => {
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      //   getAdvertises();
      //   getDates();
      //   if (app.networkConnectivity) {

      //     //syncedDays.indexOf(selectedDate) === -1
      //     // syncedDays.push(selectedDate)
      //     syncMeal(selectedDate);
      //     syncWater(selectedDate);
      //     // syncSteps(selectedDate);
      //     syncSleep(selectedDate);
      //     syncActivities(selectedDate);

      //   } else {
      //     getWaterFromDB(selectedDate);
      //     getSleepFromDB(selectedDate);
      //     getMealFromDB(selectedDate);
      //     getActivityFromDB(selectedDate);
      //   }
      changeDate()

    });

    return () => {
      focusUnsubscribe();
    };
  }, [props.navigation]);

  React.useEffect(() => {
    if (app.networkConnectivity) {
      getMessageFromServer();
    } else {
      getMessagesLocaly();
    }
  }, [app.networkConnectivity]);

  React.useEffect(() => {
    Linking.getInitialURL().then((res) => {
      checkUrl(res);
    });

    Linking.addEventListener('url', (url) => checkUrl(url.url));

    requestUserPermission();
  }, []);

  // React.useEffect(() => {
  //   ////console.warn(app.unreadMessages)
  //   let backHandler = null;
  //   const focusUnsubscribe = props.navigation.addListener('focus', () => {
  //     backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //       setCloseDialogVisible(true);
  //       return true;
  //     });
  //   });

  //   const blurUnsubscribe = props.navigation.addListener('blur', () => {
  //     backHandler && backHandler.remove();
  //   });

  //   return () => {
  //     backHandler && backHandler.remove();
  //     focusUnsubscribe();
  //     blurUnsubscribe();
  //   };
  // }, []);

  // const pD = async () => {
  //   console.log("workeFine");
  //   const Pdata = await AsyncStorage.getItem('profile')
  //   setChangeGoalDate(Pdata)
  //   console.log("profile Data=>",profile.oldChanges);

  // }
  // useEffect(() => {
  //   const focusUnsubscribe = props.navigation.addListener('focus', () => {
  //     pD()
  //   });
  //   return ()=>focusUnsubscribe()

  // }, [props.navigation])

  //================notification service======================\\
  const setNotificationService = async () => {
    const notificationServic = await AsyncStorage.getItem('notifDisable');
    ////console.warn('this is notificatin', notificationServic);
    if (!notificationServic) {
      ////console.warn(notificationServic, 'works ');
      PushNotification.cancelAllLocalNotifications()
      AsyncStorage.setItem('notifDisable', 'disabled');
    } else {
      ////console.warn('notif is set');
    }
  };
  useEffect(() => {
    setNotificationService();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const checkUrl = (url) => {
    console.error("this is url", url);

    ////console.warn(url);
    if (url && url.includes('https://bank.o2fitt.com/Home/BackApp?orderid')) {
      const id = url.split('https://bank.o2fitt.com/Home/BackApp?orderid=')[1];
      console.log('url', url);
      console.log('id', id);

      props.navigation.navigate('PaymentResultScreen', { orderid: id });
    } else if (url && url.includes("tatoken")) {
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while (match = regex.exec(url)) {
        params[match[1]] = match[2];
      }
      console.error("this is url", url);
      console.error("this is params", params)
      props.navigation.navigate('PackagesScreen',
        {
          utm_medium: params.utm_medium,
          utm_campaign: params.utm_campaign,
          utm_content: params.utm_content,
          utm_source: params.utm_source,
          tatoken: params.tatoken
        });

    }
  };

  const getMessageFromServer = () => {
    const url =
      urls.socialBaseUrl +
      urls.contactUs +
      `GetByUserId?userId=${user.id}`
      ;
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
      getMessagesSuccess,
      getMessagesFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };
  const getDates = async () => {
    let date = await AsyncStorage.getItem('homeDate');
    setDate(date);
  };

  const getMessagesSuccess = (response) => {
    ////console.warn('ssssssss', response.data.data);
    AsyncStorage.setItem('messages', JSON.stringify(response.data.data));
    let ur = 0;
    response.data.data.map((item) => {
      ////console.warn(item.isReadAdmin);
      if (!item.toAdmin) {
        if (!item.isRead) {
          ur++;
        }
      }
    });

    dispatch(setUnreadMessageNumber(ur));
  };

  const getMessagesFailure = () => {

  };

  const getMessagesLocaly = () => { };

  const getWaterFromDB = (selectedDate) => {
    if (!waterBulkSync) {
      const reg = RegExp('^' + moment(selectedDate).format('YYYY-MM-DD'), 'i');
      waterDB
        .find({
          selector: { insertDate: { $regex: reg } },
          fields: ['_id', 'insertDate', 'value'],
        })
        .then((records) => {
          console.log('sssssssss', records);
          let water = 0;
          records.docs.map((item) => (water = parseFloat(item.value)));
          setUserWater(water);
        });
    }
  };

  const getSleepFromDB = (date) => {
    console.log('getSleepFromDB', date);
    const reg = RegExp('^' + date, 'i');

    sleepDB
      .find({
        selector: { endDate: { $regex: reg } },
      })
      .then((records) => {
        console.log('rec', records);
        let totalDuration = 0;
        let totalBurnedCalories = 0;
        records.docs.map((item) => {
          totalBurnedCalories += parseFloat(item.burnedCalories);
          totalDuration += parseFloat(item.duration);
        });
        setUserSleepCalories(totalBurnedCalories);
        setUserSleepDuration(totalDuration);
      });
  };

  // useEffect(() => {
  //   PushNotification.localNotificationSchedule({
  //     //... You can use all the options from localNotifications
  //     message: "My Notification Message", // (required)
  //     date: new Date(Date.now() + 6 * 1000), // in 60 secs
  //     allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  //     channelId: 'Reminder',
  //     priority: 'max',
  //     soundName: 'remind',
  //     playSound:true,
  //     /* Android Only Properties */
  //     repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  //   });
  //   console.warn("notif set");
  //   PushNotification.getScheduledLocalNotifications((res) =>
  //   console.log('sssssss', res),
  // );
  // }, [])


  const getMealFromDB = async (date, isSynced) => {
    const syncedDates = await AsyncStorage.getItem("syncedDates")

    let arrayOfDates;

    if (syncedDates) {
      arrayOfDates = syncedDates.split(",")

      if (arrayOfDates.indexOf(date) == -1) {
        AsyncStorage.setItem("syncedDates", `${syncedDates},${date}`)
      }

    } else {
      arrayOfDates=[]
      AsyncStorage.setItem("syncedDates", `${date}`)
    }

    const reg = RegExp('^' + date, 'i');
    console.warn('isSynced', isSynced);
    mealDB
      .find({
        selector: { insertDate: { $regex: reg } },
      })
      .then((records) => {
        // if(isSynced){
        //   setCalBtnDisabled(false);
        // }
        if (records.docs.length == 0 && !isSynced && arrayOfDates.indexOf(date) == -1) {
          // alert("get from server")
          // dispatch(addDate([...syncedDate.dates,date]))
          syncMeal(date)
        } else {
          console.warn('meal rec', records.docs.length);
          setMeals(records.docs.map((item) => ({ ...item })));
          setCalBtnDisabled(false);
        }
      });
  };

  const getActivityFromDB = (date) => {
    const reg = RegExp('^' + date, 'i');
    console.log('RegExp', reg);
    activityDB
      .find({
        selector: { insertDate: { $regex: reg } },
      })
      .then((rec) => {
        console.log('activityDB', rec.docs);
        const records = rec.docs;
        setActivities(records);
        console.log('activity records', records);
      });
  };

  const nextDayPressed = () => {
    setCalBtnDisabled(true);
    let nDay =
      selectedDate === '2021-03-21'
        ? '2021-03-22'
        : selectedDate === '2021-03-22'
          ? '2021-03-23'
          : moment(selectedDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    AsyncStorage.setItem('homeDate', nDay);
    // AsyncStorage.setItem("dailyDate", nDay)
    setDate(nDay);
    setUserWater(0);
    // dispatch(updateDate(nDay))
  };

  const prevDayPressed = () => {
    setCalBtnDisabled(true);
    let pDay =
      selectedDate === '2021-03-23'
        ? '2021-03-22'
        : selectedDate === '2021-03-22'
          ? '2021-03-21'
          : moment(selectedDate, 'YYYY-MM-DD')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
    AsyncStorage.setItem('homeDate', pDay);
    setDate(pDay);
    setUserWater(0);
  };

  const waterChangeDetected = async (record) => {
    const date = await AsyncStorage.getItem('homeDate');
    getWaterFromDB(date);
  };

  const pedoChangeDetected = async (record) => {
    if (!stepBulkSync) {
      const date = await AsyncStorage.getItem('homeDate');
      getStepFromDB(date);
    }
  };

  const sleepChangeDetected = async (record) => {
    const date = await AsyncStorage.getItem('homeDate');
    getSleepFromDB(date);
  };

  const mealChangeDetected = async (record) => {
    console.log('mealChangeDetected');
    const date = await AsyncStorage.getItem('homeDate');
    getMealFromDB(date);
  };

  const activityChangeDetected = async (record) => {
    if (!activityBulkSync) {
      const date = await AsyncStorage.getItem('homeDate');
      console.log('activityChangeDetected date', date);
      console.log('record', record);
      getActivityFromDB(date);
    }
  };

  const showCalendar = () => {
    setShowPicker(true);
  };

  const onDateSelected = async (newDate) => {
    setCalBtnDisabled(true);
    setDate(newDate);
    await AsyncStorage.setItem('homeDate', newDate);
    setShowPicker(false);
  };

  const syncWater = (date) => {
    const url =
      urls.foodBaseUrl +
      urls.userTrackWater +
      `?StartDate=${date}&EndDate=${date}&userId=${user.id}`;
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
      (res) => getWaterSuccess(res, date),
      getWaterFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getWaterSuccess = (response, date) => {
    console.log('SyncWaterDB', response);
    const SW = new SyncWaterDB();
    SW.syncWaterByLocal(
      waterDB,
      response.data.data,
      selectedDate,
      waterBulkSync,
      getWaterFromDB,
    );
  };

  const getWaterFailure = () => {
    getWaterFromDB(selectedDate);
  };

  const syncSteps = (date) => {
    const url =
      urls.workoutBaseUrl +
      urls.userTrackSteps +
      `?dateTime=${date}&userId=${user.id}`;
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
      (res) => getStepsSuccess(res, date),
      getStepsFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getStepsSuccess = (response, selectedDate) => {
    const SP = new SyncPedoDB();
    getStepFromDB(selectedDate, response.data.data)
    // SP.syncStepsByLocal(
    //   pedoDB,
    //   response.data.data,
    //   selectedDate,
    //   stepBulkSync,
    //   getStepFromDB,
    // );
  };

  const getStepsFailure = () => {
    getStepFromDB(selectedDate);
  };

  const syncSleep = (date) => {
    const url =
      urls.workoutBaseUrl +
      urls.userTrackSleep +
      urls.getByDate +
      `?userId=${user.id}&dateTime=${date}`;
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
      (res) => getSleepSuccess(res, date),
      getSleepFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getSleepSuccess = (response, date) => {
    const SP = new SyncSleepDB();
    SP.syncSleeprByLocal(sleepDB, response.data.data, date, getSleepFromDB);
  };

  const getSleepFailure = () => {
    getSleepFromDB(selectedDate);
  };

  const syncMeal = (date) => {
    // alert("asd")
    const url =
      urls.foodBaseUrl +
      urls.userTrackFood +
      `UserMealsByDate?dateTime=${date}&userId=${user.id}`;
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
      (res) => getMealsSuccess(res, date),
      getMealsFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getMealsSuccess = (response, selectedDate) => {
    console.log('meal sync', response.data.data);
    console.log(response);

    const SP = new SyncMealDB();
    SP.syncMealsByLocal(
      mealDB,
      response.data.data,
      selectedDate,
      mealBulkSync,
      () => getMealFromDB(selectedDate, true),
    );
  };

  const getMealsFailure = () => {
    getMealFromDB(selectedDate, true);
  };

  const syncActivities = (date) => {
    const url =
      urls.workoutBaseUrl +
      urls.userTrackWorkout +
      `/GetByDate?dateTime=${date}&userId=${user.id}`;
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
      (res) => getActivitySuccess(res, date),
      getActivityFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getActivitySuccess = (response, selectedDate) => {
    const SP = new SyncActivityDB();
    SP.syncActivitiesByLocal(
      activityDB,
      response.data.data,
      selectedDate,
      activityBulkSync,
      getActivityFromDB,
    );
  };

  const getActivityFailure = () => {

  };



  // const getAdvertises = () => {
  //   const url =
  //     urls.adBaseUrl + urls.advertise + `?countryId=${user.countryId}`;
  //   const header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       Language: lang.capitalName,
  //     },
  //   };
  //   const params = {};

  //   const RC = new RestController();
  //   RC.checkPrerequisites(
  //     'get',
  //     url,
  //     params,
  //     header,
  //     getAdvertisesSuccess,
  //     getAdvertisesFailure,
  //     auth,
  //     onRefreshTokenSuccess,
  //     onRefreshTokenFailure,
  //   );
  // };

  // const getAdvertisesSuccess = (response) => {
  //   if (response.data.data) {
  //     const ads = response.data.data;
  //     setAdvertises([ads]);
  //     new Array(1).fill(ads).map((ad) => {
  //       adDB
  //         .get(ad.id.toString())
  //         .then((res) => {
  //           setAdHint(ad.id);
  //         })
  //         .catch((err) => {
  //           adDB.put({ _id: ad.id.toString(), ...ad });
  //           setAdSeen(ad.id);
  //         });
  //     });
  //   }
  // };

  // const getAdvertisesFailure = () => { };

  // const setAdSeen = (id) => {
  //   const url = urls.adBaseUrl + urls.advertise + urls.adState;
  //   const header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       Language: lang.capitalName,
  //     },
  //   };
  //   const params = {
  //     id: id,
  //     click: false,
  //     view: true,
  //     hint: false,
  //   };

  //   const RC = new RestController();
  //   RC.checkPrerequisites(
  //     'post',
  //     url,
  //     params,
  //     header,
  //     () => true,
  //     () => false,
  //     auth,
  //     onRefreshTokenSuccess,
  //     onRefreshTokenFailure,
  //   );
  // };

  // const setAdHint = (id) => {
  //   const url = urls.adBaseUrl + urls.advertise + urls.adState;
  //   const header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       Language: lang.capitalName,
  //     },
  //   };
  //   const params = {
  //     id: id,
  //     click: false,
  //     view: false,
  //     hint: true,
  //   };

  //   const RC = new RestController();
  //   RC.checkPrerequisites(
  //     'post',
  //     url,
  //     params,
  //     header,
  //     () => true,
  //     () => false,
  //     auth,
  //     onRefreshTokenSuccess,
  //     onRefreshTokenFailure,
  //   );
  // };

  // const setAdClick = (item) => {
  //   const url = urls.adBaseUrl + urls.advertise + urls.adState;
  //   const header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       Language: lang.capitalName,
  //     },
  //   };
  //   const params = {
  //     id: item.id,
  //     click: true,
  //     view: false,
  //     hint: false,
  //   };

  //   const RC = new RestController();
  //   RC.checkPrerequisites(
  //     'post',
  //     url,
  //     params,
  //     header,
  //     () => true,
  //     () => false,
  //     auth,
  //     onRefreshTokenSuccess,
  //     onRefreshTokenFailure,
  //   );

  //   Linking.canOpenURL(item.url).then(() => {
  //     Linking.openURL(item.url);
  //   });
  // };

  const onRefreshTokenSuccess = () => { };

  const onRefreshTokenFailure = () => { };

  const onBodyPressed = () => {
    if (
      !isNaN(parseFloat(specification[0].armSize)) &&
      specification[0].armSize != 0 &&
      !isNaN(parseFloat(specification[0].bustSize)) &&
      specification[0].bustSize != 0 &&
      !isNaN(parseFloat(specification[0].highHipSize)) &&
      specification[0].highHipSize != 0 &&
      !isNaN(parseFloat(specification[0].neckSize)) &&
      specification[0].neckSize != 0 &&
      !isNaN(parseFloat(specification[0].shoulderSize)) &&
      specification[0].shoulderSize != 0 &&
      !isNaN(parseFloat(specification[0].thighSize)) &&
      specification[0].thighSize != 0 &&
      !isNaN(parseFloat(specification[0].waistSize)) &&
      specification[0].waistSize != 0 &&
      !isNaN(parseFloat(specification[0].weightSize)) &&
      specification[0].weightSize != 0 &&
      !isNaN(parseFloat(specification[0].wristSize)) &&
      specification[0].wristSize != 0
    ) {
      if (hasCredit) {
        props.navigation.navigate('BodyShapeScreen');

      } else {
        goToPackages()
      }
    } else {
      props.navigation.navigate('BodyAnalyzeScreen', { hasCredit: hasCredit });
    }
  };

  const onSleepCardPressed = () => {
    if (hasCredit) {
      props.navigation.navigate('SleepDetailScreen');
    } else {
      goToPackages();
    }
  };

  const onAddSleepPressed = () => {
    if (hasCredit) {
      props.navigation.navigate('AddSleepScreen');
    } else {
      goToPackages();
    }
  };

  const goToPackages = () => {
    setOptionalDialogVisible(false);
    setTimeout(
      () => {
        props.navigation.navigate('PackagesScreen');
      },
      Platform.OS === 'ios' ? 500 : 50,
    );
  };


  //====================HASANI=======================\\
  // const getUnit = () => {
  //   const url = `${urls.foodBaseUrl + urls.personalFood}GetPesonalMeasureUnits`;
  //   const header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       Language: lang.capitalName,
  //     },
  //   };
  //   const RC = new RestController();
  //   RC.get(url, header, onSuccessGetMeasureUnits, onFailureGetMeasureUnits);
  // };
  // const onSuccessGetMeasureUnits = async (response) => {
  //   ////console.warn({ response: response.data.data });
  //   // setMeasureUnitsPersonal(response.data.data);
  //   // dispatch(setUnit(response.data.data))
  //   AsyncStorage.setItem('unit', JSON.stringify(response.data.data));
  // };
  // const onFailureGetMeasureUnits = () => {
  //   ////console.warn('failed to get units');
  // };

  // const onSuccessUnit = (response) => {
  //   if (app.measureUnit.version == -0.01) {
  //     dispatch(updateUnitMeasurement(response.data.data));
  //     AsyncStorage.setItem('MeasureUnits', JSON.stringify(response.data.data));
  //   } else {
  //     AddNewMeasureUnits(response.data.data);
  //   }
  // };
  // const AddNewMeasureUnits = (data) => {
  //   let arrayUnits = app.measureUnit.measureUnits;

  //   data.measureUnits.forEach((element) => {
  //     const index = arrayUnits.findIndex((item) => item.id === element.id);
  //     if (index !== -1) {
  //       arrayUnits.splice(index, 1, element);
  //     } else {
  //       arrayUnits.push(element);
  //     }
  //   });

  //   const array = {
  //     version: data.version,
  //     measureUnits: arrayUnits,
  //   };
  //   dispatch(updateUnitMeasurement(array));
  //   AsyncStorage.setItem('MeasureUnits', JSON.stringify(array));
  //   ////console.warn('this is array', array);
  //   console.log('measurent units', array);
  // };

  // useEffect(() => {

  //   let url = `${urls.foodBaseUrl}MeasureUnit/GetByVersion?versionNum=${app.measureUnit.version}`;
  //   let header = {
  //     headers: {
  //       Authorization: 'Bearer ' + auth.access_token,
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   const RC = new RestController();
  //   RC.get(url, header, onSuccessUnit, onFailureUnit);

  // }, []);

  const onFailureUnit = () => {
    console.log('failure');
  };

  const onDietPressed = () => {

    if (diet.isActive == true && diet.isBuy == true) {
      props.navigation.navigate("DietPlanScreen")
    } else if (diet.isActive == false && diet.isBuy == true) {
      props.navigation.navigate("DietStartScreen")
    } else if (diet.isActive == true && diet.isBuy == false) {
      props.navigation.navigate("PackagesScreen")
    } else {
      props.navigation.navigate("DietStartScreen")
    }

  }

  const onRecipePresse = () => {
    props.navigation.navigate("RecipeCatScreen")
  }


  const openBlogPressed = () => {
    props.navigation.navigate("BlogCatScreen")
  }
  async function timezone() {
    var time = new Date()

  }
  useEffect(() => {
    timezone()
  }, [])


  return (
    <>
      <MainToolbar
        onMessagePressed={() => props.navigation.navigate('MessagesScreen')}
        unreadNum={app.unreadMessages}
        // showRecipe={user.countryId == 128 ? true : false}
        onRecipePresse={onRecipePresse}
      />

      {/* {closeDialogVisible || optionalDialogVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      ) : null} */}

      <Calendar
        lang={lang}
        onNext={nextDayPressed}
        onBack={prevDayPressed}
        calendarPressed={showCalendar}
        selectedDate={profile.pDay ? profile.pDay : selectedDate}
        user={user}
        disabled={calBtnDisabled}
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: moderateScale(15),
        }}
        showsVerticalScrollIndicator={false}
      >

        <NutritionCard
          lang={lang}
          hasCredit={hasCredit}
          meals={meals}
          activities={activities}
          userStep={userStep}
          diet={diet}
          userSleepCalories={userSleepCalories}
          selectedDate={selectedDate}
          user={user}
          profile={profile}
          specification={specification[0]}
          onPress={() =>
            props.navigation.navigate('NutritionDetailsScreen', {
              date: selectedDate,
              data: meals,
              diet: diet
            })
          }
          autoSteps={pedometer.AutoStepsCounter}
        />
        {
          user.countryId !== 128 ? null :
            <DietCard
              lang={lang}
              profile={profile}
              specification={specification}
              diet={diet}
              onCardPressed={onDietPressed}
            />
        }


        {/* <View style={{ backgroundColor: "black" }}>
          <Text style={{ color: defaultTheme.white }}>dietPK:{profile.dietPkExpireDate}</Text>
          <Text style={{ color: defaultTheme.white }}>pkExpireDate:{profile.pkExpireDate}</Text>
        </View> */}

        {/* <GoalCard
          lang={lang}
          profile={profile}
          specification={specification}
          onPress={() => props.navigation.navigate('GoalRouter')}
          onCardPressed={() => props.navigation.navigate('GoalRouter')}
        /> */}

        <BodyManagementCard
          lang={lang}
          profile={profile}
          specification={specification}
          onPress={onBodyPressed}
          onCardPressed={onBodyPressed}
        />

        <StepCard
          lang={lang}
          profile={profile}
          user={user}
          selectedDate={selectedDate}
          onPress={() =>
            props.navigation.navigate('PedometerTabScreen', {
              date: selectedDate,
            })
          }
          pedometer={pedometer}
          onCardPressed={() =>
            props.navigation.navigate('PedometerTabScreen', {
              date: selectedDate,
            })
          }
          specification={specification[0]}
          steps={userStep}
          autoSteps={pedometer.AutoStepsCounter}
        />

        <WaterCard
          lang={lang}
          profile={profile}
          water={userWater}
          hasCredit={hasCredit}
          weightSize={specification[0].weightSize}
          meals={meals}
          onPress={() =>
            props.navigation.navigate('AddWaterScreen', {
              date: selectedDate,
            })
          }
          onCardPressed={() =>
            props.navigation.navigate('AddWaterScreen', {
              date: selectedDate,
            })
          }
        />

        {/* {
          !hasCredit && 
          <AdMobBanner
              adSize="smartBannerLandscape"
              adUnitID="ca-app-pub-3940256099942544/6300978111"
              onAdFailedToLoad={error => false} 
              testDevices={[AdMobBanner.simulatorId]}
              />
            } */}

        <SleepCard
          lang={lang}
          onPress={onSleepCardPressed}
          onAddPressed={onAddSleepPressed}
          duration={userSleepDuration}
          calorie={userSleepCalories}
        />

        {/* {
          lang.langName !== "persian" ? null :
            <BlogCard
              lang={lang}
              onPress={() => openBlogPressed()}
            />
        } */}

        {/* {advertises.map((item) => (
          <AdvertiseRow
            lang={lang}
            item={item}
            key={item.id.toString()}
            onPress={setAdClick}
          />
        ))} */}
        <View style={{ height: moderateScale(50) }} />

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

        {/* <TwoOptionModal
          lang={lang}
          visible={closeDialogVisible}
          onRequestClose={() => setCloseDialogVisible(false)}
          context={lang.areShureExit}
          button1={lang.yes}
          button2={lang.no}
          button1Pressed={() => RNExitApp.exitApp()}
          button2Pressed={() => setCloseDialogVisible(false)}
        /> */}

        <DatePicker
          lang={lang}
          user={user}
          visible={showDatePicker}
          onRequestClose={() => setShowPicker(false)}
          onDateSelected={onDateSelected}
          selectedDate={selectedDate}
        />

        {/* {advertises.map((item) => (
          <AdvertiseRow
            lang={lang}
            item={item}
            key={item.id.toString()}
            onPress={setAdClick}
          />
        ))} */}

        {/* {blogs.map((item) => (
          <BlogRow
            lang={lang}
            item={item}
            key={item.id.toString()}
            onLike={onLike}
            blogIsLiked={blogIsLiked}
            onPress={() => onPressBlog(item)}
          />
          
        ))} */}

      </ScrollView>

      <Uploader app={app} auth={auth} />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
  },


});

export default HomeScreen;
