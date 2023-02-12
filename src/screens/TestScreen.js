
import React from 'react';
import {
  StyleSheet,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
  Text
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import Video from 'react-native-video';
import RNFS, { mkdir } from 'react-native-fs';
import PushNotification from "react-native-push-notification";
import { BlurComponent } from '../components';


const TestScreen = props => {

  console.log("file://" + RNFS.ExternalStorageDirectoryPath + "/s.mp4")


  // React.useEffect(()=>{
  //   PushNotification.localNotificationSchedule({
  //     id:"sssssssss",
  //     message: "My Notification Message", // (required)
  //     date: new Date(Date.now() + 5 * 1000), // in 60 secs
  //     allowWhileIdle: false,
  //     priority:"max",
  //     repeatType:"minute"
  //   })

  //   PushNotification.getScheduledLocalNotifications((res)=>console.log("sssssss",res));
  //   // PushNotification.cancelLocalNotifications({id: "-782429613"});
  //   // PushNotification.cancelLocalNotifications({id: "-1864078575"});
  // })


  return (
    <>
      <Text>
        sadsadas
      </Text>
      {/* <BlurComponent /> */}

    </>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    width: 300,
    height: 300
  },
});

export default TestScreen;
