import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  AppState,
  Platform,
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import {
  Information,
  Calendar,
  MainToolbar,
  DailyActivityContainer,
  DailyFoodContainer,
  RowSpaceBetween,
  ConfirmButton,
  DatePicker,
  TwoOptionModal,
  DietCard,
} from '../../components';
import moment from 'moment';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import { SyncMealDB } from '../../classess/SyncMealDB';
import { SyncActivityDB } from '../../classess/SyncActivityDB';
import { SyncPedoDB } from '../../classess/SyncPedoDB';
import Lunch from '../../../res/img/lunch.svg';
import Breakfast from '../../../res/img/breakfast.svg';
import Dinner from '../../../res/img/dinner.svg';
// import Orientation from 'react-native-orientation-locker'
import Toast from 'react-native-toast-message';
import { BlurView } from '@react-native-community/blur';
import { setIsBuy, clearDiet } from '../../redux/actions/diet';
import axios from 'axios';
import StarRatingModal from '../../components/starRatingModal';
import VIP from '../../components/VIP';
import { addDate } from '../../redux/actions/syncedDate';
import { Modal } from 'react-native-paper';
import { setStarRatingTimer } from '../../redux/actions';

PouchDB.plugin(pouchdbSearch);
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const DailyScreen = props => {
  const dispatch = useDispatch();

  // Orientation.lockToPortrait();

  const [targetCarbo, setTargetCarbo] = useState(0);
  const [targetProtein, setTargetProtein] = useState(0);
  const [targetFat, setTargetFat] = useState(0);
  const lang = useSelector(state => state.lang);
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const app = useSelector(state => state.app);
  const fastingDiet = useSelector(state => state.fastingDiet);

  const syncedDate = useSelector(state => state.syncedDate);

  const specification = useSelector(state => state.specification);
  const profile = useSelector(state => state.profile);
  const diet = useSelector(state => state.diet);
  const starRating = useSelector(state => state.starRating);

  const [targetCalorie, setTargetCalorie] = React.useState(2000);
  const [showDatePicker, setShowPicker] = React.useState(false);
  const [selectedDate, setDate] = React.useState(moment().format('YYYY-MM-DD'));
  const [activities, setActivities] = React.useState([]);
  const [pedos, setPedos] = React.useState([]);
  const [meals, setMeals] = React.useState([]);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [deleteDialog, showDeleteDialog] = React.useState(false);
  const [deleteAction, setDeleteAction] = React.useState(() => false);
  const [optionalDialogVisible, setOptionalDialogVisible] =
    React.useState(false);
  const [calDisabledBtn, setCalDisabledBtn] = useState(false);
  const [showRating, setShowRating] = useState(false);
  let mealBulkSync = React.useRef(false).current;
  let activityBulkSync = React.useRef(false).current;
  let stepBulkSync = React.useRef(false).current;
  let carbo,
    pro,
    fat = 0;
  let factor;
  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const today = moment();
  const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;

  React.useEffect(() => {
    let backHandler = null;
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      // getData()
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        props.navigation.navigate('HomeScreen');
        return true;
      });
    });

    const blurUnsubscribe = props.navigation.addListener('blur', () => {
      backHandler && backHandler.remove();
    });

    return () => {
      backHandler && backHandler.remove();
      focusUnsubscribe();
      blurUnsubscribe();
    };
  }, []);
  useEffect(() => {
    getData();
  }, [profile, specification[0], selectedDate]);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => { };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // console.warn("work");
      setDate(moment().format('YYYY-MM-DD'));
      AsyncStorage.setItem('homeDate', moment().format('YYYY-MM-DD'));
    }

    appState.current = nextAppState;
    // setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  const getData = async () => {
    const aa = await AsyncStorage.getItem('profile');
    let d = JSON.parse(aa);
    // console.error(d.weightChangeRate);
    const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
    const nowMoment = moment();
    const age = nowMoment.diff(birthdayMoment, 'years');
    const height = profile.heightSize;
    let targetWeight = profile.targetWeight;
    const wrist = specification[0].wristSize;
    let activityRate = profile.dailyActivityRate;
    var bmr = 1;
    let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
    let bodyType = null;
    let targetCalorie = 0;
    let carbo = 0;
    let pro = 0;
    let fat = 0;
    let oldData;
    let weightChangeRate = profile.weightChangeRate;
    await AsyncStorage.getItem('oldChanges')
      .then(res => {
        console.error(res);
        oldData = JSON.parse(res);
        if (oldData.oldDateChange > selectedDate) {
          targetWeight = oldData.oldTargetWeight;
          activityRate = oldData.oldDailyActivityRate;
          weightChangeRate = oldData.oldWeightChangeRate;
        } else {
          targetWeight = d.targetWeight;
          activityRate = d.dailyActivityRate;
          weightChangeRate = d.weightChangeRate;
        }
      })
      .catch(() => {
        targetWeight = d.targetWeight;
        activityRate = d.dailyActivityRate;
        weightChangeRate = d.weightChangeRate;
      });

    if (profile.gender == 1) {
      bmr = 10 * specification[0].weightSize + 6.25 * height - 5 * age + 5;
      if (factor > 10.4) bodyType = 1;
      else if (factor < 9.6) bodyType = 3;
      else bodyType = 2;
    } else {
      bmr = 10 * specification[0].weightSize + 6.25 * height - 5 * age - 161;
      if (factor > 11) bodyType = 1;
      else if (factor < 10.1) bodyType = 3;
      else bodyType = 2;
    }

    switch (activityRate) {
      case 10:
        targetCalorie = bmr * 1;
        break;
      case 20:
        targetCalorie = bmr * 1.2;
        break;
      case 30:
        targetCalorie = bmr * 1.375;
        break;
      case 40:
        targetCalorie = bmr * 1.465;
        break;
      case 50:
        targetCalorie = bmr * 1.55;
        break;
      case 60:
        targetCalorie = bmr * 1.725;
        break;
      case 70:
        targetCalorie = bmr * 1.9;
        break;
    }

    console.log('targetCalorie', targetCalorie);
    const targetCaloriPerDay = (7700 * d.weightChangeRate * 0.001) / 7;
    // checkForZigZagi

    if (specification[0].weightSize > d.targetWeight) {
      if (!diet.isActive) {
        if (user.countryId === 128) {
          if (moment(selectedDate).day() == 4) {
            targetCalorie *= 1.117;
          } else if (moment(selectedDate).day() == 5) {
            targetCalorie *= 1.116;
          } else {
            targetCalorie *= 0.97;
          }
        } else {
          if (moment(selectedDate).day() == 6) {
            targetCalorie *= 1.117;
          } else if (moment(selectedDate).day() == 0) {
            targetCalorie *= 1.116;
          } else {
            targetCalorie *= 0.97;
          }
        }
      }
      targetCalorie -= targetCaloriPerDay;
    } else if (specification[0].weightSize < d.targetWeight) {
      targetCalorie += targetCaloriPerDay;
    }

    targetCalorie = parseInt(targetCalorie);

    if (factor) {
      switch (bodyType) {
        case 1:
          fat = targetCalorie * 0.32;
          carbo = targetCalorie * 0.33;
          pro = targetCalorie * 0.35;
          break;
        case 2:
          fat = targetCalorie * 0.3;
          carbo = targetCalorie * 0.49;
          pro = targetCalorie * 0.21;
          break;
        case 3:
          fat = targetCalorie * 0.4;
          carbo = targetCalorie * 0.35;
          pro = targetCalorie * 0.25;
          break;
      }
    } else {
      fat = targetCalorie * 0.33;
      carbo = targetCalorie * 0.33;
      pro = targetCalorie * 0.34;
    }

    // console.log("targetCalorie", targetCalorie)
    // console.log("carbo",carbo)
    // console.log("fat",fat)
    // console.log("pro",pro)

    setTargetCalorie(parseInt(targetCalorie));
  };

  React.useEffect(() => {
    const starRatingTimer = moment(
      starRating.starRatingTimer,
      'YYYY-MM-DDTHH:mm:ss',
    );
    starRatingTimer.diff(today, 'seconds') > 0
      ? setShowRating(false)
      : setShowRating(true);
    // console.warn(starRatingTimer.diff(today, "seconds"))

    getData();
  }, []);

  // React.useEffect(() => {
  //   let date = profile.pDay
  //     ? profile.pDay
  //     : moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  //   setDate(date);
  //   dispatch(updateDate(date));
  // }, []);

  // React.useEffect(() => {
  //   AsyncStorage.setItem("homeDate", selectedDate)
  //   mealDB.changes({ since: 'now', live: true }).on('change', mealChangeDetected)
  //   pedoDB.changes({ since: 'now', live: true }).on('change', activityChangeDetected)
  //   activityDB.changes({ since: 'now', live: true }).on('change', activityChangeDetected)
  // }, [])

  React.useEffect(() => {
    setActivities([]);
    setPedos([]);
    setMeals([]);
    // getPedofromDB(selectedDate)
    getMealFromDB(selectedDate, false);
    if (app.networkConnectivity) {
      //   syncMeal(selectedDate)
      getPedoFromServer(selectedDate);
      syncActivities(selectedDate);
    } else {
      getActivityFromDB(selectedDate);
    }
  }, [selectedDate, app.networkConnectivity]);

  const mealChangeDetected = async record => {
    const date = await AsyncStorage.getItem('homeDate');
    setDate(date);
    // console.warn("mealChangeDetected record", record)
    getMealFromDB(date, false);
  };

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      const date = await AsyncStorage.getItem('homeDate');
      setDate(date);
      getMealFromDB(date, false);
      getActivityFromDB(date);
      getPedofromDB(date);
    });
    return unsubscribe;
  }, [props.navigation]);

  const activityChangeDetected = async record => {
    if (!activityBulkSync) {
      const date = await AsyncStorage.getItem('homeDate');
      //console.log("activityChangeDetected date", date)
      //console.log("record", record)
      getActivityFromDB(date);
    }
  };

  const getActivityFromDB = date => {
    const reg = date;
    //console.log("RegExp", reg)
    activityDB
      .allDocs({
        include_docs: true,
        attachments: false,
      })
      .then(async rec => {
        // console.warn("activityDB", rec.rows[0].doc)

        const records = await rec.rows.map(item => item.doc);
        setActivities(records.filter(item => item.insertDate.includes(date)));
        //console.log("activity records", records)
        // getPedofromDB(date)
      });
  };

  const getMealFromDB = async (date, isSynced) => {
    const syncedDates = await AsyncStorage.getItem('syncedDates');

    let arrayOfDates;

    if (syncedDates) {
      arrayOfDates = syncedDates.split(',');

      if (arrayOfDates.indexOf(date) == -1) {
        AsyncStorage.setItem('syncedDates', `${syncedDates},${date}`);
      }
    } else {
      AsyncStorage.setItem('syncedDates', `${date}`);
    }

    // dispatch(addDate([]))
    console.warn('thisis syncedDate', syncedDate.dates);
    const reg = date;
    //console.log("RegExp", reg)
    mealDB
      .allDocs({
        include_docs: true,
        attachments: false,
      })
      .then(rec => {
        const updatedMeal = rec.rows
          .map(item => item.doc)
          .filter(item => item.insertDate.includes(date));
        console.error(updatedMeal);
        if (
          updatedMeal.length == 0 &&
          !isSynced &&
          arrayOfDates.indexOf(date) == -1
        ) {
          // alert("server")
          // dispatch(addDate([...syncedDate.dates,date]))
          console.warn('no Data');
          syncMeal(date);
        } else {
          setMeals(updatedMeal);
          setCalDisabledBtn(false);
          console.log('updatedMeal', updatedMeal);
        }
      });
  };

  const getPedofromDB = date => {
    const reg = date;
    pedoDB
      .allDocs({
        include_docs: true,
      })
      .then(records => {
        setPedos([
          ...records.rows
            .map(item => item.doc)
            .filter(item => item.insertDate.includes(date)),
        ]);
      });
  };

  const nextDayPressed = () => {
    setCalDisabledBtn(true);
    let nDay =
      selectedDate === '2021-03-21'
        ? '2021-03-22'
        : selectedDate === '2021-03-22'
          ? '2021-03-23'
          : moment(selectedDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    setDate(nDay);
    AsyncStorage.setItem('homeDate', nDay);
    // dispatch(updateDate(nDay));
    // getPedofromDB(nDay)
  };

  const prevDayPressed = () => {
    setCalDisabledBtn(true);
    let pDay =
      selectedDate === '2021-03-23'
        ? '2021-03-22'
        : selectedDate === '2021-03-22'
          ? '2021-03-21'
          : moment(selectedDate, 'YYYY-MM-DD')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
    setDate(pDay);
    AsyncStorage.setItem('homeDate', pDay);
    // dispatch(updateDate(pDay));
    // getPedofromDB(pDay)
  };

  const addBreakfast = () => {
    props.navigation.navigate('FoodFindScreen', {
      type: '',
      name: lang.breakfast,
      mealId: 0,
    });
  };

  const addLunch = () => {
    props.navigation.navigate('FoodFindScreen', {
      type: '',
      name: lang.lunch,
      mealId: 1,
    });
  };

  const addSnack = () => {
    props.navigation.navigate('FoodFindScreen', {
      type: '',
      name: lang.snack,
      mealId: 2,
    });
  };

  const addDinner = () => {
    props.navigation.navigate('FoodFindScreen', {
      type: '',
      name: lang.dinner,
      mealId: 3,
    });
  };

  const addActivity = () => {
    props.navigation.navigate('ActivityScreen');
  };

  const addCalorie = () => {
    if (hasCredit) {
      props.navigation.navigate('AddCaloryScreen', {
        selectedDate: selectedDate,
      });
    } else {
      goToPackages();
    }
  };

  const editMeal = item => {
    if (item.foodId === null && item.personalFoodId === null) {
      props.navigation.navigate('AddCaloryScreen', { meal: item });
    } else {
      props.navigation.navigate('FoodDetailScreen', {
        meal: item,
        food: {
          ...item,
          foodMeal: item.foodMeal,
          name: item.foodName,
          measureUnitName: undefined,
        },
      });
    }
  };

  const showCalendar = () => {
    setShowPicker(true);
  };

  const onDateSelected = newDate => {
    setCalDisabledBtn(true);
    //console.log(newDate)
    setDate(newDate);
    setShowPicker(false);
    AsyncStorage.setItem('homeDate', newDate);
    getPedofromDB(newDate);
  };

  const onActivityEdit = async item => {
    const date = await AsyncStorage.getItem('homeDate');
    if (item.stepsCount) {
      props.navigation.navigate('PedometerScreen', { item: item, date: date });
    } else {
      props.navigation.navigate('ActivityDetailsScreen', {
        activity: item,
        date: date,
      });
    }
  };

  const deleteConfirmed = () => {
    //console.log("deleteAction", deleteAction)
    showDeleteDialog(false);
    !isNaN(parseInt(deleteAction.foodMeal))
      ? removeMeal(deleteAction)
      : deleteActivity(deleteAction);
  };

  const removeMeal = item => {
    // console.error('item._id', item._id);
    // if (app.networkConnectivity) {
    //   //console.log(item)
    // const url = urls.foodBaseUrl2 + urls.userTrackFood + `?_id=${item._id}`
    // const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    // const params = {}

    // const RC = new RestController()
    // RC.checkPrerequisites("delete", url, params, header, (res) => removeMealSuccess(res, item), removeMealFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    // }
    // else {
    offlineDB.allDocs({ include_docs: false }).then(records => {
      offlineDB
        .post({
          method: 'delete',
          type: 'meal',
          url: urls.baseFoodTrack2 + urls.userTrackFood + `?_id=${item._id}`,
          header: {
            headers: {
              Authorization: 'Bearer ' + auth.access_token,
              Language: lang.capitalName,
            },
          },
          params: { ...item },
          index: records.total_rows,
        })
        .then(res => {
          //console.log(res)
          removeMealDB(item);
        });
    });

    // }
  };

  const removeMealDB = item => {
    mealDB
      .find({
        selector: { _id: item._id },
      })
      .then(rec => {
        if (rec.docs.length > 0) {
          mealDB.put({ ...rec.docs[0], _deleted: true }).then(() => {
            // setErrorContext(lang.successful)
            // setErrorVisible(true)
            Toast.show({
              type: 'success',
              props: { text2: lang.successful, style: { fontFamily: lang.font } },
              visibilityTime: 800,
            });
          });
          getMealFromDB(selectedDate, false);
        }
      });
  };

  const removeMealSuccess = (response, item) => {
    console.warn(response);
    // removeMealDB(item)
  };

  const removeMealFailure = () => {
    if (!errorVisible) {
      // setErrorContext(lang.serverError)
      // setErrorVisible(true)
      Toast.show({
        type: 'error',
        props: { text2: lang.serverError, style: { fontFamily: lang.font } },
        visibilityTime: 800,
      });
    }
  };

  const deleteActivity = item => {
    if (item.stepsCount) {
      if (app.networkConnectivity) {
        const url =
          urls.baseWorkout +
          urls.userTrackSteps +
          `?userTrackStepsId=${item.id}`;
        const header = {
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            Language: lang.capitalName,
          },
        };
        const params = {};

        const RC = new RestController();
        RC.checkPrerequisites(
          'delete',
          url,
          params,
          header,
          res => deleteActivitySuccess(res, item),
          deleteActivityFailure,
          auth,
          onRefreshTokenSuccess,
          onRefreshTokenFailure,
        );
      } else {
        offlineDB
          .post({
            method: 'delete',
            type: 'pedo',
            url:
              urls.baseWorkout +
              urls.userTrackSteps +
              `?userTrackStepsId=${item.id}`,
            header: {
              headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
              },
            },
            params: item,
          })
          .then(res => {
            //console.log(res)
            deleteActivityFromDB(item);
          });
      }

      //console.log(item)
    } else {
      if (app.networkConnectivity) {
        const url =
          urls.baseWorkout +
          urls.userTrackWorkout +
          `?userTrackWorkoutId=${item.id}`;
        const header = {
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            Language: lang.capitalName,
          },
        };
        const params = {};

        const RC = new RestController();
        RC.checkPrerequisites(
          'delete',
          url,
          params,
          header,
          res => deleteActivitySuccess(res, item),
          deleteActivityFailure,
          auth,
          onRefreshTokenSuccess,
          onRefreshTokenFailure,
        );
      } else {
        offlineDB
          .post({
            method: 'delete',
            type: 'activity',
            url:
              urls.baseWorkout +
              urls.userTrackWorkout +
              `?userTrackWorkoutId=${item.id}`,
            header: {
              headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
              },
            },
            params: item,
          })
          .then(res => {
            //console.log(res)
            deleteActivityFromDB(item);
          });
      }
    }
  };

  const deleteActivitySuccess = (response, item) => {
    //console.log(item)
    deleteActivityFromDB(item);
  };

  const deleteActivityFromDB = item => {
    if (item.stepsCount) {
      pedoDB.put({ ...item, _deleted: true }).then(() => {
        // setErrorContext(lang.successful)
        // setErrorVisible(true)
        Toast.show({
          type: 'success',
          props: { text2: lang.successful, style: { fontFamily: lang.font } },
        });
      });
      getPedofromDB(selectedDate);
    } else {
      activityDB.put({ ...item, _deleted: true }).then(res => {
        // setErrorContext(lang.successful)
        // setErrorVisible(true)
        Toast.show({
          type: 'success',
          props: { text2: lang.successful, style: { fontFamily: lang.font } },
          visibilityTime: 800,
        });
      });
      getActivityFromDB(selectedDate);
    }
  };

  const deleteActivityFailure = () => {
    if (!errorVisible) {
      setErrorContext(lang.serverError);
      setErrorVisible(true);
    }
  };

  const syncMeal = date => {
    const url =
      urls.baseFoodTrack +
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
      res => getMealsSuccess(res, date),
      getMealsFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getMealsSuccess = (response, selectedDate) => {
    //console.log(response)

    const SP = new SyncMealDB();
    SP.syncMealsByLocal(
      mealDB,
      response.data.data,
      selectedDate,
      mealBulkSync,
      () => getMealFromDB(selectedDate, true),
    );
  };

  const getMealsFailure = () => { };

  const getPedoFromServer = date => {
    const url =
      urls.baseWorkout +
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
      res => getPedoSuccess(res, date),
      getPedoFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getPedoSuccess = (response, selectedDate) => {
    const SP = new SyncPedoDB();
    SP.syncStepsByLocal(
      pedoDB,
      response.data.data,
      selectedDate,
      stepBulkSync,
      getPedofromDB,
    );
  };

  const getPedoFailure = () => { };

  const syncActivities = date => {
    const url =
      urls.baseWorkout +
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
      res => getActivitySuccess(res, date),
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

  const getActivityFailure = () => { };

  const onRefreshTokenSuccess = () => { };

  const onRefreshTokenFailure = () => { };
  const goToPackages = () => {
    setTimeout(
      () => {
        props.navigation.navigate('PackagesScreen');
      },
      Platform.OS === 'ios' ? 500 : 50,
    );
  };

  const calculateTarget = targetCal => {
    // //console.log({
    //   ss: bodyType,
    //   factor: profile.heightSize,
    //   s: specification[0].wristSize,
    //   targetCal,
    // });
    if (factor) {
      switch (bodyType) {
        case 1:
          fat = targetCal * 0.32;
          carbo = targetCal * 0.35;
          pro = targetCal * 0.33;
          break;
        case 2:
          fat = targetCal * 0.3;
          carbo = targetCal * 0.49;
          pro = targetCal * 0.21;
          break;
        case 3:
          fat = targetCal * 0.4;
          carbo = targetCal * 0.25;
          pro = targetCal * 0.35;
          break;
      }
    } else {
      fat = targetCal * 0.33;
      carbo = targetCal * 0.33;
      pro = targetCal * 0.34;
      // ////console.log({fat, carbo, pro});
    }

    setTargetCarbo(parseInt(carbo));
    setTargetFat(parseInt(fat));
    setTargetProtein(parseInt(pro));
  };

  console.error(meals.filter(item => item.foodMeal === 8));
  const analyzMealPress = type => {
    console.warn(type);
    if (hasCredit) {
      switch (type) {
        case 'breakFast': {
          calculateTarget(parseInt(targetCalorie * 0.25).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 0),
            budget: (targetCalorie * 0.25).toFixed(2),
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
            mealName: lang.breakfast,
            icon: <Breakfast />,
          });
          break;
        }
        case 'lunch': {
          calculateTarget(parseInt(targetCalorie * 0.35).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 1),
            budget: (targetCalorie * 0.35).toFixed(2),
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
            mealName: lang.lunch,
            icon: <Lunch />,
          });
          break;
        }
        case 'dinner': {
          calculateTarget(parseInt(targetCalorie * 0.25).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 3),
            budget: (targetCalorie * 0.25).toFixed(2),
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
            mealName: lang.dinner,
            icon: <Dinner />,
          });
          break;
        }
        case 'snack': {
          calculateTarget(parseInt(targetCalorie * 0.25).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 2),
            budget: (targetCalorie * 0.15).toFixed(2),
            mealName: lang.snack,
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
          });
          break;
        }
        case 'sahar': {
          calculateTarget(parseInt(targetCalorie * 0.25).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 9),
            budget: (targetCalorie * 0.25).toFixed(2),
            mealName: lang.sahari,
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
          });
          break;
        }
        case 'eftar': {
          calculateTarget(parseInt(targetCalorie * 0.3).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 6),
            budget: (targetCalorie * 0.3).toFixed(2),
            mealName: lang.eftar,
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
          });
          break;
        }
        case 'Rdinner': {
          calculateTarget(parseInt(targetCalorie * 0.35).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: meals.filter(item => item.foodMeal === 3),
            budget: (targetCalorie * 0.35).toFixed(2),
            mealName: lang.dinner,
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
          });
          break;
        }
        case 'Rsnack': {
          calculateTarget(parseInt(targetCalorie * 0.1).toFixed(2));
          props.navigation.navigate('AnalyzMealScreen', {
            lang: lang,
            meal: [
              ...meals.filter(item => item.foodMeal === 7),
              ...meals.filter(item => item.foodMeal === 8),
            ],
            budget: (targetCalorie * 0.1).toFixed(2),
            mealName: lang.snack,
            targetCarbo: carbo / 4,
            targetProtein: pro / 4,
            targetFat: fat / 9,
          });
          break;
        }
        default:
          break;
      }
    } else {
      goToPackages();
    }
  };
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
        props.navigation.navigate('FastingDietplan');
      } else {
        props.navigation.navigate('DietPlanScreen');
      }
    } else if (diet.isActive == false && diet.isBuy == true) {
      props.navigation.navigate('DietStartScreen');
    } else if (diet.isActive == true && diet.isBuy == false) {
      props.navigation.navigate('PackagesScreen');
    } else {
      props.navigation.navigate('DietStartScreen');
    }
  };
  const onRecipePresse = () => {
    props.navigation.navigate('RecipeCatScreen');
  };
  const starRatingmodalShown = () => {
    setShowRating(false);
  };

  const fastingContainerData = [
    {
      lang: lang,
      image: require('../../../res/img/sahari-icon.png'),
      title: 'سحری',
      addPressed: () =>
        props.navigation.navigate('FoodFindScreen', {
          type: '',
          name: lang.sahari,
          mealId: 9,
        }),
      data: meals.filter(item => item.foodMeal === 9),
      edit: editMeal,
      remove: item => {
        setDeleteAction(item);
        showDeleteDialog(true);
      },
      barcode: () => props.navigation.navigate('BarcodeScreen', { foodMeal: 9 }),
      budget: (targetCalorie * 0.25).toFixed(2),
      hasCredit: hasCredit,
      analyzMealPress: analyzMealPress.bind(null, 'sahar'),
      diet: diet,
    },
    {
      lang: lang,
      image: require('../../../res/img/eftar-icon.png'),
      title: 'افطار',
      addPressed: () =>
        props.navigation.navigate('FoodFindScreen', {
          type: '',
          name: lang.eftar,
          mealId: 6,
        }),
      data: meals.filter(item => item.foodMeal === 6),
      edit: editMeal,
      remove: item => {
        setDeleteAction(item);
        showDeleteDialog(true);
      },
      barcode: () => props.navigation.navigate('BarcodeScreen', { foodMeal: 6 }),
      budget: (targetCalorie * 0.3).toFixed(2),
      hasCredit: hasCredit,
      analyzMealPress: analyzMealPress.bind(null, 'eftar'),
      diet: diet,
    },
    {
      lang: lang,
      image: require('../../../res/img/dinner-icon.png'),
      title: 'شام',
      addPressed: () =>
        props.navigation.navigate('FoodFindScreen', {
          type: '',
          name: lang.dinner,
          mealId: 3,
        }),
      data: meals.filter(item => item.foodMeal === 3),
      edit: editMeal,
      remove: item => {
        setDeleteAction(item);
        showDeleteDialog(true);
      },
      barcode: () => props.navigation.navigate('BarcodeScreen', { foodMeal: 3 }),
      budget: (targetCalorie * 0.35).toFixed(2),
      hasCredit: hasCredit,
      analyzMealPress: analyzMealPress.bind(null, 'Rdinner'),
      diet: diet,
    },
    {
      lang: lang,
      image: require('../../../res/img/snack-icon.png'),
      title: 'میان وعده',
      addPressed: () =>
        props.navigation.navigate('FoodFindScreen', {
          type: '',
          name: lang.snack,
          mealId: 7,
        }),
      data: [
        ...meals.filter(item => item.foodMeal === 7),
        ...meals.filter(item => item.foodMeal === 8),
      ],
      edit: editMeal,
      remove: item => {
        setDeleteAction(item);
        showDeleteDialog(true);
      },
      barcode: () => props.navigation.navigate('BarcodeScreen', { foodMeal: 7 }),
      budget: (targetCalorie * 0.1).toFixed(2),
      hasCredit: hasCredit,
      analyzMealPress: analyzMealPress.bind(null, 'Rsnack'),
      diet: diet,
    },
  ];

  return (
    <>
      <MainToolbar
        onMessagePressed={() => props.navigation.navigate('MessagesScreen')}
        unreadNum={app.unreadMessages}
        // showRecipe={user.countryId == 128 ? true : false}
        onRecipePresse={onRecipePresse}
      />

      {errorVisible || deleteDialog || optionalDialogVisible ? (
        <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={6}
              reducedTransparencyFallbackColor="white"
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <Calendar
        lang={lang}
        onNext={nextDayPressed}
        onBack={prevDayPressed}
        calendarPressed={showCalendar}
        selectedDate={selectedDate}
        user={user}
      // disabled={calDisabledBtn}
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(20) }}
        />
        {/* {user.countryId !== 128 ||
          !diet.isActive ||
          lang.name == 'persian' ? null : (
          <DietCard
            lang={lang}
            profile={profile}
            specification={specification}
            diet={diet}
            onCardPressed={onDietPressed}
          />
        )} */}
        {parseInt(moment(fastingDiet.startDate).format('YYYYMMDD')) <=
          parseInt(moment(selectedDate).format('YYYYMMDD')) &&
          (fastingDiet.endDate
            ? parseInt(moment(fastingDiet.endDate).format('YYYYMMDD')) >=
            parseInt(moment(selectedDate).format('YYYYMMDD'))
            : true) ? (
          <>
            {fastingContainerData.map(item => {
              return (
                <DailyFoodContainer
                  lang={item.lang}
                  image={item.image}
                  title={item.title}
                  addPressed={item.addPressed}
                  data={item.data}
                  edit={item.edit}
                  remove={item.remove}
                  barcode={item.barcode}
                  budget={item.budget}
                  hasCredit={item.hasCredit}
                  analyzMealPress={item.analyzMealPress}
                  diet={diet}
                />
              );
            })}
          </>
        ) : (
          <>
            <DailyFoodContainer
              lang={lang}
              image={require('../../../res/img/breakfast.png')}
              title={lang.breakfast}
              addPressed={addBreakfast}
              data={meals.filter(item => item.foodMeal === 0)}
              edit={editMeal}
              remove={item => {
                setDeleteAction(item);
                showDeleteDialog(true);
              }}
              barcode={() =>
                props.navigation.navigate('BarcodeScreen', { foodMeal: 0 })
              }
              budget={(targetCalorie * 0.25).toFixed(2)}
              hasCredit={hasCredit}
              analyzMealPress={analyzMealPress.bind(null, 'breakFast')}
              diet={diet}
            />

            <DailyFoodContainer
              lang={lang}
              image={require('../../../res/img/lunch.png')}
              title={lang.lunch}
              addPressed={addLunch}
              data={meals.filter(item => item.foodMeal === 1)}
              edit={editMeal}
              remove={item => {
                setDeleteAction(item);
                showDeleteDialog(true);
              }}
              barcode={() =>
                props.navigation.navigate('BarcodeScreen', { foodMeal: 1 })
              }
              budget={(targetCalorie * 0.35).toFixed(2)}
              hasCredit={hasCredit}
              analyzMealPress={analyzMealPress.bind(null, 'lunch')}
              diet={diet}
            />

            <DailyFoodContainer
              lang={lang}
              image={require('../../../res/img/dinner.png')}
              title={lang.dinner}
              addPressed={addDinner}
              data={meals.filter(item => item.foodMeal === 3)}
              edit={editMeal}
              remove={item => {
                setDeleteAction(item);
                showDeleteDialog(true);
              }}
              barcode={() =>
                props.navigation.navigate('BarcodeScreen', { foodMeal: 3 })
              }
              budget={(targetCalorie * 0.25).toFixed(2)}
              hasCredit={hasCredit}
              analyzMealPress={analyzMealPress.bind(null, 'dinner')}
              diet={diet}
            />

            <DailyFoodContainer
              lang={lang}
              image={require('../../../res/img/snack.png')}
              title={lang.snack}
              addPressed={addSnack}
              data={meals.filter(item => item.foodMeal === 2)}
              edit={editMeal}
              remove={item => {
                setDeleteAction(item);
                showDeleteDialog(true);
              }}
              barcode={() =>
                props.navigation.navigate('BarcodeScreen', { foodMeal: 2 })
              }
              budget={(targetCalorie * 0.15).toFixed(2)}
              hasCredit={hasCredit}
              analyzMealPress={analyzMealPress.bind(null, 'snack')}
              diet={diet}
            />
          </>
        )}

        {/* {
            !hasCredit &&
            <AdMobBanner
              adSize="smartBannerLandscape"
              adUnitID="ca-app-pub-3940256099942544/6300978111"
              onAdFailedToLoad={error => false}
              testDevices={[AdMobBanner.simulatorId]}
            />
          } */}
        <DailyActivityContainer
          lang={lang}
          image={require('../../../res/img/activity2.png')}
          title={lang.sport_actives}
          data={[...activities, ...pedos]}
          onEdit={onActivityEdit}
          onDelete={item => {
            setDeleteAction(item);
            showDeleteDialog(true);
          }}
          addPressed={addActivity}
        />
        <RowSpaceBetween style={styles.buttonContainer}>
          <ConfirmButton
            style={styles.button2}
            lang={lang}
            title={lang.countCalories}
            leftImage={require('../../../res/img/plus.png')}
            imageStyle={styles.img2}
            textStyle={[styles.buttonText, { fontSize: moderateScale(16) }]}
            onPress={addCalorie}
          />
          <ConfirmButton
            style={styles.button1}
            lang={lang}
            title={lang.addNote}
            leftImage={require('../../../res/img/note.png')}
            imageStyle={styles.img}
            textStyle={styles.buttonText}
            onPress={() => props.navigation.navigate('NotesScreen')}
          />

          {/* <ConfirmButton
            style={styles.button1}
            lang={lang}
            title={lang.addWeight}
            leftImage={require("../../../res/img/scale.png")}
            imageStyle={styles.img}
            textStyle={styles.buttonText}
            onPress={() => props.navigation.navigate("RegisterWeightScreen")}
          /> */}
        </RowSpaceBetween>
        <View
          style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(50) }}
        />
      </ScrollView>
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
      <TwoOptionModal
        lang={lang}
        visible={deleteDialog}
        onRequestClose={() => showDeleteDialog(false)}
        context={lang.isSure}
        button1={lang.yes}
        button2={lang.no}
        button1Pressed={deleteConfirmed}
        button2Pressed={() => showDeleteDialog(false)}
      />

      <Modal
        visible={
          meals.length !== 0 && starRating.isRating == false && showRating
        }
        onDismiss={() => {
          dispatch(
            setStarRatingTimer(
              moment().add(7, 'days').format('YYYY-MM-DDTHH:mm:ss'),
            ),
          );
          starRatingmodalShown();
        }}>
        <StarRatingModal
          lang={lang}
          starRating={starRating}
          setShowStarModal={starRatingmodalShown}
          user={user}
        />
      </Modal>
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
  buttonContainer: {
    width: dimensions.WINDOW_WIDTH * 0.95 - moderateScale(4),
    paddingHorizontal: 0,
    marginVertical: moderateScale(16),
    justifyContent: 'space-around',
  },
  button1: {
    width: dimensions.WINDOW_WIDTH * 0.38,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    borderRadius: moderateScale(6),
  },
  button2: {
    width: dimensions.WINDOW_WIDTH * 0.38,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    borderRadius: moderateScale(6),
  },
  buttonText: {
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(2),
  },
  img: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: defaultTheme.lightBackground,
  },
  img2: {
    width: moderateScale(19),
    height: moderateScale(19),
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
});

export default DailyScreen;
