import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
  TextInput,
  BackHandler,
  Platform,
  I18nManager,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Information,
  ProfileHeader,
  RowCenter,
  TimePicker,
  ReminderDayRow,
  Toolbar,
  ConfirmButton,
} from '../../components';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';
import {useSelector, useDispatch} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BlurView} from '@react-native-community/blur';

PouchDB.plugin(pouchdbSearch);
const reminderDB = new PouchDB('reminder', {adapter: 'react-native-sqlite'});
const maxInt = 2147483647;
const model = {
  id: null,
  name: '',
  time: '00:00',
  days: [
    {
      id: 0,
      reminderId: null,
    },
  ],
};

const RemindersDetailScreen = (props) => {
  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const [hour, setHour] = React.useState(
    props.route.params
      ? parseInt(props.route.params.reminder.time.split(':')[0])
      : 0,
  );
  const [min, setMin] = React.useState(
    props.route.params
      ? parseInt(props.route.params.reminder.time.split(':')[1])
      : 0,
  );
  const ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current;
  let currentTy = React.useRef(dimensions.WINDOW_HEIGTH).current;
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const foreignWeek = React.useRef([
    {
      id: 0,
      name: lang['1sh'],
    },
    {
      id: 1,
      name: lang['2sh'],
    },
    {
      id: 2,
      name: lang['3sh'],
    },
    {
      id: 3,
      name: lang['4sh'],
    },
    {
      id: 4,
      name: lang['5sh'],
    },
    {
      id: 5,
      name: lang['jome2'],
    },
    {
      id: 6,
      name: lang['sh'],
    },
  ]).current;
  const persianWeek = React.useRef([
    {
      id: 6,
      name: lang['sh'],
    },
    {
      id: 0,
      name: lang['1sh'],
    },
    {
      id: 1,
      name: lang['2sh'],
    },
    {
      id: 2,
      name: lang['3sh'],
    },
    {
      id: 3,
      name: lang['4sh'],
    },
    {
      id: 4,
      name: lang['5sh'],
    },
    {
      id: 5,
      name: lang['jome2'],
    },
  ]).current;
  const [reminder, setReminder] = React.useState(
    props.route.params
      ? {
          ...props.route.params.reminder,
        }
      : {
          ...model,
          days: [],
        },
  );

  console.log('reminder', reminder);

  const [week, setWeek] = React.useState(
    user.countryId === 128 ? persianWeek : foreignWeek,
  );

  React.useEffect(() => {
    let backHandler = null;
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener('hardwareBackPress', goBack);
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
  const notificationService = () => {
    reminderDB
      .allDocs({
        include_docs: true,
      })
      .then((rec) => {});
  };
  React.useEffect(() => {
    notificationService();
    ty.addListener((value) => (currentTy = value));
  }, []);

  const goBack = () => {
    console.log(currentTy);
    if (currentTy.value === 0) {
      closeTimePicker();
    } else {
      props.navigation.goBack();
    }

    return true;
  };

  const showTimePicker = () => {
    Animated.timing(ty, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeTimePicker = () => {
    Animated.timing(ty, {
      toValue: dimensions.WINDOW_HEIGTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onDayPressed = (day) => {
    const index = reminder.days.findIndex((item) => item.id === day.id);

    if (index === -1) {
      setReminder({
        ...reminder,
        days: [...reminder.days, {id: day.id}],
      });
    } else {
      const d = [...reminder.days];
      const notificationId = d[index].notificationId;
      PushNotification.cancelLocalNotifications({id: notificationId});
      d.splice(index, 1);
      setReminder({
        ...reminder,
        days: [...d],
      });
    }
  };

  const timeChanged = (hour, min) => {
    setHour(hour);
    setMin(min);
    setReminder({
      ...reminder,
      time: hour + ':' + min,
    });
  };

  const onConfirm = () => {
    if (reminder.name != '') {
      if (reminder.days.length > 0) {
        const newDays = reminder.days.map((item) => {
          if (item.notificationId) {
            PushNotification.cancelLocalNotifications({
              id: item.notificationId,
            });
          }
          return {id: item.id};
        });

        setNotificationDays(newDays);
      } else {
        setErrorContext(lang.selectOneOption);
        setErrorVisible(true);
      }
    } else {
      setErrorContext(lang.noReminderValue);
      setErrorVisible(true);
    }
  };

  const setNotificationDays = async (days) => {
    const notificationServic = await AsyncStorage.getItem('notifCalled');
    console.warn('=>', reminder);
    const newDays = [...days];
    days.map((day, index) => {
      const todayObj = moment();
      const todayDayOfWeek = moment().day();
      const h = parseInt(hour) < 10 ? '0' + hour : hour.toString();
      const m = parseInt(min) < 10 ? '0' + min : min.toString();
      const templateDay = moment(
        todayObj.format('YYYY-MM-DDT') + `${h}:${m}:00`,
      );
      const targetObj = moment(todayObj.format('YYYY-MM-DDT') + `${h}:${m}:00`);
      // console.log("templateDay", templateDay)
      // console.log("targetObj", targetObj)
      // console.log("todayObj", todayObj)

      if (!day.notificationId) {
        let targetDay = null;

        if (day.id > todayDayOfWeek) {
          console.log(1);
          targetDay = templateDay.add(day.id - todayDayOfWeek, 'days');
        } else if (day.id < todayDayOfWeek) {
          targetDay = templateDay.add(6 - todayDayOfWeek + day.id + 1, 'days');
        } else {
          const diff = targetObj.diff(todayObj);
          console.log('diff', diff);
          if (diff > 0) {
            console.log(3);
            targetDay = templateDay.add(parseInt(1000/diff), 'seconds');
          } else {
            console.log(4);
            targetDay = templateDay.add(7, 'days');
          }
        }
        console.log('targetDay', targetDay);

        const diffSeconds = parseInt(targetDay.diff(todayObj));

        const notificationId = (
          Math.floor(Math.random() * maxInt) + 1
        ).toString();
        PushNotification.localNotificationSchedule({
          id: notificationId,
          title: lang.notificationRemaind,
          message: reminder.name, // (required)
          date: new Date(Date.now() + diffSeconds),
          allowWhileIdle: true,
          repeatType: 'week',
          channelId: 'Reminder',
          priority: 'max',
          soundName: 'remind',
          when:new Date(Date.now()),
          
          
        });
        

        newDays[index] = {id: day.id, notificationId: notificationId};

        PushNotification.getScheduledLocalNotifications((res) =>
          console.log('sssssss', res),
        );
      }
    });

    setReminder({
      ...reminder,
      days: newDays,
    });

    if (reminder._id) {
      reminderDB
        .put({
          ...reminder,
          days: newDays,
          isActive: newDays.length > 0 ? true : false,
        })
        .then(() => props.navigation.goBack());
    } else {
      reminderDB
        .post({
          ...reminder,
          id: Date.now().toString(),
          days: newDays,
          isActive: true,
        })
        .then((res) => {
          props.navigation.goBack();
          console.warn(res);
        });
    }
    analytics().logEvent('setReminder');
  };

  return (
    <>
      <ScrollView>
        <Toolbar
          lang={lang}
          title={lang.notificationRemaind}
          onBack={() => props.navigation.goBack()}
        />
        <View style={styles.subContainer}>
          <TextInput
            style={[styles.input, {fontFamily: lang.font}]}
            allowFontScaling={false}
            placeholder={lang.remindename}
            value={reminder.name}
            underlineColorAndroid={'transparent'}
            onChangeText={(text) =>
              setReminder({...reminder, name: text, title: text})
            }
            autoFocus={true}
          />
        </View>
        <View style={styles.subContainer2}>
          {week.map((item, index) => (
            <ReminderDayRow
              key={index.toString()}
              day={item}
              isSelected={
                reminder.days.findIndex((d) => d.id === item.id) === -1
                  ? false
                  : true
              }
              lang={lang}
              onPress={onDayPressed}
            />
          ))}
        </View>
        <View
          style={[
            styles.subContainer,
            {flexDirection: 'column', height: moderateScale(200)},
          ]}>
          <Text
            style={[styles.text, {fontFamily: lang.font,textAlign:"left"}]}
            allowFontScaling={false}>
            {lang.timeRemaind}
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
        <View style={{marginTop: moderateScale(50)}}>
          <ConfirmButton
            lang={lang}
            style={styles.button}
            title={lang.saved}
            onPress={onConfirm}
          />
        </View>
      </ScrollView>

      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
      {errorVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: dimensions.WINDOW_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1.2,
    borderBottomColor: defaultTheme.border,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1.2,
    borderColor: defaultTheme.border,
  },
  input: {
    width: dimensions.WINDOW_WIDTH * 0.98,
    minHeight: moderateScale(30),
    fontSize: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    borderBottomColor: 'transparent',
    marginVertical: moderateScale(5),
    alignSelf: 'center',
    textAlign:
      Platform.OS === 'android' ? 'auto' : I18nManager.isRTL ? 'right' : 'left',
  },
  text: {
    fontSize: moderateScale(15),
    minWidth: moderateScale(10),
    padding: moderateScale(16),
    color: defaultTheme.darkText,
  },
  text2: {
    fontSize: moderateScale(18),
    minWidth: moderateScale(10),
    padding: moderateScale(16),
  },
  button: {
    backgroundColor: defaultTheme.green,
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    alignSelf: 'center',
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

export default RemindersDetailScreen;
