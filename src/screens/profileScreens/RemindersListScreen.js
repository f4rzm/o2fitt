import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {
  ColumnWrapper,
  ProfileHeader,
  RowCenter,
  ConfirmButton,
  ReminderRow,
  Toolbar,
} from '../../components';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import PushNotification from 'react-native-push-notification';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { defaultReminders } from '../../utils/defaultReminders';
import AsyncStorage from '@react-native-async-storage/async-storage';

PouchDB.plugin(pouchdbSearch);
const reminderDB = new PouchDB('reminder', { adapter: 'react-native-sqlite' });
const maxInt = 2147483647;

const RemindersListScreen = (props) => {
  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const [reminders, setReminders] = React.useState([]);

  React.useEffect(() => {
    getAll();
    reminderDB.changes({ since: 'now', live: true }).on('change', getAll);
    // reminderDB.destroy()
    // PushNotification.cancelAllLocalNotifications()
    PushNotification.getScheduledLocalNotifications((res) =>
      console.log('schedul notification', res),
    );
  }, []);

  const getAll = () => {
    reminderDB.allDocs({ include_docs: true }).then((rec) => {
      console.log(rec.rows);
      if (rec.rows.length > 0) {
        setReminders(rec.rows.map((item) => item.doc));
      } else {
        defaultReminders(lang).map((item) => {
          reminderDB.post(item);
        });
      }
    });
  };

  const onReminderPressed = (item) => {
    console.warn(item);
    props.navigation.navigate('RemindersDetailScreen', { reminder: item });
  };

  const switchReminder = (item, index) => {
    if (item.isActive) {
      const newDays = item.days.map((day) => {
        console.log('day', day);
        PushNotification.cancelLocalNotifications({ id: day.notificationId });
        return { id: day.id };
      });

      let newReminder = [...reminders][index];
      newReminder = {
        ...item,
        isActive: false,
        days: newDays,
      };
      console.log(newReminder);
      reminderDB
        .put({
          ...newReminder,
        })
        .then(() =>
          PushNotification.getScheduledLocalNotifications((n) =>
            console.log(n),
          ),
        );
    } else {
      setNotificationDays(item, index);
    }
  };

  const setNotificationDays = async (reminder, index) => {
    const newDays = [...reminder.days];

    reminder.days.map((day, index) => {
      const todayObj = moment();
      const todayDayOfWeek = moment().day();
      const hour = reminder.time.split(':')[0];
      const min = reminder.time.split(':')[1];
      const h = parseInt(hour) < 10 ? '0' + parseInt(hour) : hour.toString();
      const m = parseInt(min) < 10 ? '0' + parseInt(min) : min.toString();
      const templateDay = moment(
        todayObj.format('YYYY-MM-DDT') + `${h}:${m}:00`,
      );
      const targetObj = moment(todayObj.format('YYYY-MM-DDT') + `${h}:${m}:00`);
      if (!day.notificationId) {
        console.log('if');
        let targetDay = null;
        if (day.id > todayDayOfWeek) {
          console.log(1);
          targetDay = templateDay.add(day.id - todayDayOfWeek, 'days');
        } else if (day.id < todayDayOfWeek) {
          console.log(2);
          targetDay = templateDay.add(6 - todayDayOfWeek + day.id + 1, 'days');
        }
        else {
          const diff = targetObj.diff(todayObj);
          console.log('diff', diff);
          if (diff > 0) {
            console.log(3);
            targetDay = templateDay.add(parseInt(1000 / diff), 'seconds');
          } else {
            console.log(4);
            targetDay = templateDay.add(7, 'days');
          }
        }

        const diffSeconds = parseInt(targetDay.diff(todayObj));
        // console.log("targetDay",targetDay)
        // console.log("diffSeconds",diffSeconds)
        // console.log("date",new Date(Date.now() + diffSeconds))

        const notificationId = (
          Math.floor(Math.random() * maxInt) + 1
        ).toString();
        PushNotification.localNotificationSchedule({
          id: notificationId,
          message: reminder.name, // (required)
          date: new Date(Date.now() + diffSeconds),
          allowWhileIdle: true,
          repeatType: 'week',
          channelId: 'Reminder',
          priority: 'max',
          soundName: 'default',
          playSound: true,
          ignoreInForeground: false,

        });
        // PushNotification.localNotificationSchedule({
        //   //... You can use all the options from localNotifications
        //   message: "My Notification Message", // (required)
        //   date: new Date(Date.now() + 6 * 1000), // in 60 secs
        //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        //   channelId: 'Reminder',
        //   priority: 'max',
        //   soundName: 'remind',
        //   playSound:true,
        //   /* Android Only Properties */
        //   repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
        // });

        newDays[index] = { id: day.id, notificationId: notificationId };
        PushNotification.getScheduledLocalNotifications((res) =>
          console.log('notifService', res),
        );
      } else {
        console.log('else');
        newDays[index] = { ...day };
      }
    });

    const newReminder = {
      ...reminder,
      days: newDays,
      isActive: false,
    };

    reminderDB
      .put({
        ...newReminder,
        isActive: true,
      })
      .then(() =>
        PushNotification.getScheduledLocalNotifications((n) => console.log(n)),
      );
  };

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.notificationRemaind}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView>
        {reminders.map((item, index) => (
          <ReminderRow
            key={item.id}
            lang={lang}
            item={item}
            index={index}
            onPress={() => onReminderPressed(item)}
            switchReminder={switchReminder}
          />
        ))}
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.newreminder}
          onPress={() => props.navigation.navigate('RemindersDetailScreen')}
          leftImage={require('../../../res/img/reminder2.png')}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: defaultTheme.green2,
    width: dimensions.WINDOW_WIDTH * 0.4,
    height: moderateScale(45),
    margin: moderateScale(40),
    marginHorizontal: moderateScale(16),
  },
});

export default RemindersListScreen;
