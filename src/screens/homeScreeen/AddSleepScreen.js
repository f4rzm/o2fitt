import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Animated,
  I18nManager,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';
import {useSelector, useDispatch} from 'react-redux';
import {
  Toolbar,
  Information,
  ConfirmButton,
  RowCenter,
  DatePicker,
  CalendarDropDown,
  DoubleInput,
  RowStart,
  RowSpaceBetween,
  ColumnCenter,
  DynamicTimePicker,
  RowSpaceAround,
} from '../../components';
import {moderateScale} from 'react-native-size-matters';
import Snooze from '../../../res/img/snooze.svg';
import StarRating from 'react-native-star-rating';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import moment from 'moment';
import {urls} from '../../utils/urls';
import sleepBurnedCalorie from '../../utils/sleepBurnedCalorie';
import {RestController} from '../../classess/RestController';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';
import {BlurView} from '@react-native-community/blur';

PouchDB.plugin(pouchdbSearch);
const sleepDB = new PouchDB('sleep', {adapter: 'react-native-sqlite'});
const offlineDB = new PouchDB('offline', {adapter: 'react-native-sqlite'});

const AddSleepScreen = (props) => {
  console.warn(props)

  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const specification = useSelector((state) => state.specification);
  const age = React.useRef(
    moment().diff(moment(profile.birthDate), 'years'),
  ).current;

  const app = useSelector((state) => state.app);
  const ty1 = React.useRef(
    new Animated.Value(dimensions.WINDOW_HEIGTH),
  ).current;
  const ty2 = React.useRef(
    new Animated.Value(dimensions.WINDOW_HEIGTH),
  ).current;
  let currentTy1 = React.useRef(dimensions.WINDOW_HEIGTH).current;
  let currentTy2 = React.useRef(dimensions.WINDOW_HEIGTH).current;
  const [isAwake, setIsAwake] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [showDatePicker, setShowPicker] = React.useState(false);
  const [sleepDate, setSleepDate] = React.useState(
    moment().format('YYYY-MM-DD'),
  );
  const [awakeDate, setAwakeDate] = React.useState(
    moment().format('YYYY-MM-DD'),
  );
  const [sleepHour, setSleepHour] = React.useState('');
  const [sleepMin, setSleepMin] = React.useState('');
  const [awakeHour, setAwakeHour] = React.useState('');
  const [awakeMin, setAwakeMin] = React.useState('');
  const [diffMin, setDiffMin] = React.useState(0);
  const [durationHours, setDurationHours] = React.useState(0);
  const [durationMinutes, setDurationMinutes] = React.useState(0);
  const [dateError, showDateError] = React.useState(false);
  const [rate, setRate] = React.useState(0);

  const sleep = props.route.params?.item;

  useEffect(() => {
    if (sleep) {
      const startClockSleep = sleep.startdate.split('T')[1];
      const endClockSleep = sleep.enddate.split('T')[1];

      const startDate = sleep.startdate.split('T')[0];
      const startSleepHour = startClockSleep.split(':')[0];
      const startSleepMinute = startClockSleep.split(':')[1];

      const endDate = sleep.enddate.split('T')[0];
      const endSleepHour = endClockSleep.split(':')[0];
      const endSleepMinute = endClockSleep.split(':')[1];

      setSleepHour(startSleepHour);
      setSleepMin(startSleepMinute);

      setAwakeHour(endSleepHour);
      setAwakeMin(endSleepMinute);

      setSleepDate(startDate);
      setAwakeDate(endDate);

      setRate(0);
    }
  }, []);

  React.useEffect(() => {
    if (
      !isNaN(parseInt(sleepHour)) &&
      parseInt(sleepHour) < 24 &&
      !isNaN(parseInt(sleepMin)) &&
      parseInt(sleepMin) < 60 &&
      !isNaN(parseInt(awakeHour)) &&
      parseInt(awakeHour) < 24 &&
      !isNaN(parseInt(awakeMin)) &&
      parseInt(awakeMin) < 60
    ) {
      const sleepObj = moment(`${sleepDate} ${sleepHour}:${sleepMin}`);
      const awakeObj = moment(`${awakeDate} ${awakeHour}:${awakeMin}`);
      const sleepTime = sleepObj.format('YYYY-MM-DD HH:mm');
      const awakeTime = awakeObj.format('YYYY-MM-DD HH:mm');

      if (sleepObj.isValid() && awakeObj.isValid(awakeObj)) {
        if (awakeTime > sleepTime) {
          dateError && showDateError(false);
          const h = parseInt(awakeObj.diff(sleepObj) / (60 * 60 * 1000));
          const m = parseInt(
            (awakeObj.diff(sleepObj) - h * 60 * 60 * 1000) / (60 * 1000),
          );
          setDurationHours(h);
          setDurationMinutes(m);

          setDiffMin(parseInt(awakeObj.diff(sleepObj) / (1000 * 60)));
        } else {
          showDateError(true);
          setErrorContext(lang.dateError2);
        }
      } else {
        showDateError(true);
        setErrorContext(lang.dateError1);
      }
      console.log('sleepTime', sleepTime);
      console.log('awakeTime', awakeTime);
    } else if (
      sleepHour != '' &&
      sleepMin != '' &&
      awakeHour != '' &&
      awakeMin != ''
    ) {
      showDateError(true);
      setErrorContext(lang.dateError1);
    }
  }, [awakeDate, awakeHour, awakeMin, sleepDate, sleepHour, sleepMin]);

  React.useEffect(() => {
    ty1.addListener((value) => (currentTy1 = value.value));
    ty2.addListener((value) => (currentTy2 = value.value));
  }, []);

  React.useEffect(() => {
    let backHandler = null;
    backHandler = BackHandler.addEventListener('hardwareBackPress', goBack);

    return () => {
      backHandler && backHandler.remove();
    };
  }, []);

  const showTimePicker1 = (type) => {
    Animated.timing(ty1, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const showTimePicker2 = (type) => {
    Animated.timing(ty2, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const goBack = () => {
    if (currentTy1 === 0) {
      closeTimePicker1();
    } else if (currentTy2 === 0) {
      closeTimePicker2();
    } else {
      props.navigation.goBack();
    }

    return true;
  };

  const closeTimePicker1 = () => {
    Animated.timing(ty1, {
      toValue: dimensions.WINDOW_HEIGTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeTimePicker2 = () => {
    Animated.timing(ty2, {
      toValue: dimensions.WINDOW_HEIGTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const awakeDatePressed = () => {
    setIsAwake(true);
    setShowPicker(true);
  };

  const sleepDatePressed = () => {
    setIsAwake(false);
    setShowPicker(true);
  };

  const awakeTimeChanged = (hour, min) => {
    setAwakeHour(parseInt(hour) < 10 ? '0' + parseInt(hour) : hour);
    setAwakeMin(parseInt(min) < 10 ? '0' + parseInt(min) : min);
  };

  const sleepTimeChanged = (hour, min) => {
    setSleepHour(parseInt(hour) < 10 ? '0' + parseInt(hour) : hour);
    setSleepMin(parseInt(min) < 10 ? '0' + parseInt(min) : min);
  };

  const onDateSelected = (newDate) => {
    setShowPicker(false);
    if (isAwake) {
      setAwakeDate(newDate);
    } else {
      setSleepDate(newDate);
    }
  };

  const saveDB = (data) => {
    console.log('sleep', data);

    sleepDB
      .put(data)
      .then(() => {
        setLoading(false);
        // setErrorContext(lang.successful)
        // setErrorVisible(true)
        Toast.show({
          type: 'success',
          props: {text2: lang.successful, style: {fontFamily: lang.font}},
          visibilityTime: 1000,
          onShow: props.navigation.goBack()

        });
      })
      .catch(() => {
        setLoading(false);
      });

    analytics().logEvent('setSleep');
  };

  const saveServer = (data) => {
    const url = urls.workoutBaseUrl + urls.userTrackSleep;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {...data};

    if (app.networkConnectivity) {
      const RC = new RestController();
      if (sleep) {
        RC.checkPrerequisites(
          'put',
          url,
          params,
          header,
          (res) => onSuccessEditSleep(res, data),
          onFailureEditSleep,
          auth,
          onRefreshTokenSuccess,
          onRefreshTokenFailure,
        );
      } else {
        RC.checkPrerequisites(
          'post',
          url,
          params,
          header,
          (res) => onSuccess(res, data),
          onFailure,
          auth,
          onRefreshTokenSuccess,
          onRefreshTokenFailure,
        );
      }
    } else {
      props.navigation.navigate('SleepDetailScreen');
    }
  };
  const onFailureEditSleep = (response) => {
    console.log({response: response});
  };

  const onSuccessEditSleep = (res, data) => {
    // console.log({sleepEdit: sleep});
    // sleepDB
    //   .find({
    //     selector: {_id: sleep._Id},
    //   })
    //   .then(rec => {
    //     if (rec.docs.length > 0) {
    //       sleepDB.put({...rec.docs[0], _deleted: true}).then(() => {
    //         console.log('delete success');
    //         saveDB(data);
    //       });
    //     }
    //   });
    console.log({dataaaa: data});

    sleepDB
      .find({
        selector: {_id: sleep._Id},
      })
      .then((rec) => {
        console.log({rec});
        if (rec.docs.length > 0) {
          sleepDB
            .put({...rec.docs[0], ...data})
            .catch((error) => console.log(error));
        }
        setLoading(false);

        Toast.show({
          type: 'success',
          props: {text2: lang.successful, style: {fontFamily: lang.font}},
          visibilityTime: 1000,
          onShow: props.navigation.goBack()

        });
      })
      .catch((error) => console.log(error));
  };

  const onSuccess = (response, data) => {
    saveDB(data);
  };

  const onFailure = () => {};

  const onRefreshTokenSuccess = () => {};

  const onRefreshTokenFailure = () => {};

  const onConfirm = () => {
    if (!dateError && diffMin > 0) {
      setLoading(true);
      let data;
      if (sleep?.id > 0) {
        data = {
          id: sleep.id,
          _id: sleep._Id,
          userId: user.id,
          rate: rate,
          startDate: moment(`${sleepDate} ${sleepHour}:${sleepMin}`).format(
            'YYYY-MM-DDTHH:mm',
          ),
          endDate: moment(`${awakeDate} ${awakeHour}:${awakeMin}`).format(
            'YYYY-MM-DDTHH:mm',
          ),
          burnedCalories: sleepBurnedCalorie(
            profile.gender,
            specification[0].weightSize,
            profile.heightSize,
            age,
            diffMin,
          ),
          weight: specification[0].weightSize,
          height: profile.heightSize,
          age: age,
          gender: user.gender,
        };
      } else {
        data = {
          _id: Date.now().toString(),
          userId: user.id,
          rate: rate,
          startDate: moment(`${sleepDate} ${sleepHour}:${sleepMin}`).format(
            'YYYY-MM-DDTHH:mm',
          ),
          endDate: moment(`${awakeDate} ${awakeHour}:${awakeMin}`).format(
            'YYYY-MM-DDTHH:mm',
          ),
          burnedCalories: sleepBurnedCalorie(
            profile.gender,
            specification[0].weightSize,
            profile.heightSize,
            age,
            diffMin,
          ),
          duration: diffMin,
          weight: specification[0].weightSize,
          height: profile.heightSize,
          age: age,
          gender: user.gender,
        };
      }

      console.log('data', data);

      if (app.networkConnectivity) {
        saveServer(data);
      } else {
        offlineDB
          .post({
            method: 'post',
            type: 'sleep',
            url: urls.workoutBaseUrl + urls.userTrackSleep,
            header: {
              headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
              },
            },
            params: data,
          })
          .then((res) => {
            // console.log(res)
            saveDB(data);
          });
      }
    } else {
      setErrorContext(lang.sleeptimenotset);
      setErrorVisible(true);
    }
  };

  return (
    <>
      <Toolbar lang={lang} title={lang.saveSleepTitle} onBack={goBack} />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <View style={styles.container}>
          <RowStart
            style={{
              marginVertical: 0,
              marginStart: moderateScale(14),
              marginTop: moderateScale(10),
            }}>
            <Text style={[styles.text, {fontFamily: lang.font}]}>
              {lang.startSleepTime}
            </Text>
          </RowStart>
          <RowSpaceAround
            style={{marginVertical: 0, paddingHorizontal: moderateScale(8)}}>
            <CalendarDropDown
              lang={lang}
              user={user}
              style={styles.dateStyle}
              dateStyle={styles.dateText}
              selectedDate={sleepDate}
              onPress={sleepDatePressed}
            />
            <DoubleInput
              seprator=":"
              lang={lang}
              placeholder1={lang.hour}
              placeholder2={lang.min}
              maxLength1={2}
              maxLength2={2}
              focusControl={() => showTimePicker1()}
              editable={false}
              value1={sleepHour}
              value2={sleepMin}
              textStyle={{fontSize: moderateScale(17)}}
              style={{width: moderateScale(75)}}
            />
          </RowSpaceAround>
        </View>
        <View style={styles.container}>
          <RowStart
            style={{
              marginVertical: 0,
              marginStart: moderateScale(24),
              marginTop: moderateScale(10),
            }}>
            <Text style={[styles.text, {fontFamily: lang.font}]}>
              {lang.endSleepTime}
            </Text>
          </RowStart>
          <RowSpaceAround
            style={{marginVertical: 0, paddingHorizontal: moderateScale(8)}}>
            <CalendarDropDown
              lang={lang}
              user={user}
              style={styles.dateStyle}
              dateStyle={styles.dateText}
              selectedDate={awakeDate}
              onPress={awakeDatePressed}
            />
            <DoubleInput
              seprator=":"
              lang={lang}
              placeholder1={lang.hour}
              placeholder2={lang.min}
              maxLength1={2}
              maxLength2={2}
              focusControl={() => showTimePicker2()}
              editable={false}
              value1={awakeHour}
              value2={awakeMin}
              textStyle={{fontSize: moderateScale(17)}}
              style={{width: moderateScale(75)}}
            />
          </RowSpaceAround>
        </View>
        <RowCenter>
          <ColumnCenter>
            <Text
              style={[styles.text, {fontFamily: lang.font}]}
              allowFontScaling={false}>
              {lang.timeOfSleep}
            </Text>
            {dateError ? (
              <Text
                style={[styles.errorText, {fontFamily: lang.font}]}
                allowFontScaling={false}>
                {errorContext}
              </Text>
            ) : (
              <Text
                style={[styles.text2, {fontFamily: lang.font}]}
                allowFontScaling={false}>
                {durationHours}
                <Text
                  style={[styles.text, {fontFamily: lang.font}]}
                  allowFontScaling={false}>
                  {'  ' + lang.hour + '  '}
                </Text>
                {durationMinutes}
                <Text
                  style={[styles.text, {fontFamily: lang.font}]}
                  allowFontScaling={false}>
                  {'  ' + lang.min + '  '}
                </Text>
              </Text>
            )}
          </ColumnCenter>
          <Snooze width={moderateScale(65)} />
        </RowCenter>

        <ColumnCenter>
          <Text
            style={[styles.text, {fontFamily: lang.font}]}
            allowFontScaling={false}>
            {lang.whatIsRateForSleep}
          </Text>
          <StarRating
            containerStyle={{
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              
            }}
            starStyle={{
              marginHorizontal: moderateScale(8),
              marginTop: moderateScale(25),
              
            }}
            disabled={false}
            maxStars={5}
            rating={rate}
            fullStarColor={defaultTheme.gold}
            emptyStarColor={defaultTheme.gray}
            
            selectedStar={(rating) => setRate(rating)}
          />
        </ColumnCenter>
      </ScrollView>
      <ConfirmButton
        lang={lang}
        style={styles.button}
        title={lang.saved}
        onPress={onConfirm}
        leftImage={require('../../../res/img/done.png')}
        isLoading={isLoading}
      />
      <DatePicker
        lang={lang}
        user={user}
        visible={showDatePicker}
        onRequestClose={() => setShowPicker(false)}
        onDateSelected={onDateSelected}
        selectedDate={isAwake ? awakeDate : sleepDate}
        isLoading={isLoading}
      />
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() =>
          errorContext === lang.successful
            ? props.navigation.replace('SleepDetailScreen')
            : setErrorVisible(false)
        }
        lang={lang}
      />

      {errorVisible && (
        <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <DynamicTimePicker
        lang={lang}
        user={user}
        ty={ty1}
        close={closeTimePicker1}
        onTimeConfirm={sleepTimeChanged}
        hour={sleepHour}
        min={sleepMin}
      />
      <DynamicTimePicker
        lang={lang}
        user={user}
        ty={ty2}
        close={closeTimePicker2}
        onTimeConfirm={awakeTimeChanged}
        hour={awakeHour}
        min={awakeMin}
      />
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
  container: {
    width: dimensions.WINDOW_WIDTH,
    backgroundColor: defaultTheme.border,
    padding: moderateScale(0),
    marginTop: moderateScale(25),
  },
  dateStyle: {
    width: moderateScale(105),
  },
  dateText: {
    width: moderateScale(95),
  },
  number: {
    width: moderateScale(60),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
  },
  text: {
    fontSize: moderateScale(14),
    color: defaultTheme.gray,
  },
  text2: {
    fontSize: moderateScale(23),
    color: defaultTheme.gray,
  },
  errorText: {
    fontSize: moderateScale(15),
    maxWidth: dimensions.WINDOW_WIDTH * 0.45,
    textAlign: 'center',
    lineHeight: moderateScale(25),
    color: defaultTheme.error,
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
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
});

export default AddSleepScreen;
