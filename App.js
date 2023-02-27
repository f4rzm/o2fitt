// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
//   I18nManager,
//   Platform
// } from 'react-native';
// import {createStore , applyMiddleware} from "redux"
// import {Provider} from "react-redux"
// import ReduxThunk from "redux-thunk"; 
// import reducers from "./src/redux/reducers"
// import {enableScreens} from "react-native-screens"
// import MainRoute from "./src/navigation/MainRouter"
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNRestart  from 'react-native-restart';
// import {NetworkManager} from "./src/classess/NetworkManager"
// import PouchDB from './pouchdb'
// import PushNotification from "react-native-push-notification";
// import { defaultTheme } from './src/constants/theme';
// import Toast, {BaseToast} from 'react-native-toast-message';


// enableScreens()

// let store=createStore(reducers , {} , applyMiddleware(ReduxThunk))

// // const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' })
// // const barcodeGs1DB = new PouchDB('barcodeGs1', { adapter: 'react-native-sqlite' })
// // const barcodeNationalDB = new PouchDB('barcodeNational', { adapter: 'react-native-sqlite' })

// // foodDB.destroy()
// // barcodeGs1DB.destroy()
// // barcodeNationalDB.destroy()
// // AsyncStorage..removeItem("LocalDatabaseVersion")

// const App = () => {

//   // AsyncStorage.clear()
//   I18nManager.allowRTL(false)
//   const NM = React.useRef(new NetworkManager()).current
//   const [allowRender , setAllow] = React.useState(false)
//   React.useEffect(()=>{
//     (async ()=>{
//       // AsyncStorage.clear()
//       const lang = await AsyncStorage.getItem("lang")
//       if(lang){
//         if(lang === "en"){
//           if(I18nManager.isRTL){
//             I18nManager.forceRTL(false)
//             RNRestart.Restart()
//           }
//         }
//         else{
//           I18nManager.allowRTL(true)
//           I18nManager.forceRTL(true)
//           if(!I18nManager.isRTL){
//             RNRestart.Restart()
//           }
//         }
//       }
//       if(lang){
//         store.dispatch({
//           type : "SET_LANGUAGE",
//           data : lang
//         })
//       }
//       networkMonitoring()
//     })()
//   },[])

//   React.useEffect(()=>{
//     PushNotification.createChannel(
//       {
//         channelId: "General", // (required)
//         channelName: "General", // (required)
//         soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//         importance: 4, // (optional) default: 4. Int value of the Android notification importance
//         vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//       })

//     PushNotification.createChannel(
//       {
//         channelId: "Reminder", // (required)
//         channelName: "Reminder", // (required)
//         soundName: "remind", // (optional) See `soundName` parameter of `localNotification` function
//         importance: 4, // (optional) default: 4. Int value of the Android notification importance
//         vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//       })

//   },[])

//   networkMonitoring=()=>{
//     NM.getNetworkState(setNetworkState)
//   }

//   setNetworkState = (isConnected , type)=>{
//     store.dispatch({
//       type : "SET_NETWORK_STATE",
//       data : {
//         networkConnectivity : isConnected,
//         networkConnectionType : type
//       }
//     })

//     NM.addListener((isConnected , type)=>{
//       const currentState = store.getState().app
//       if(currentState.networkConnectivity != isConnected && currentState.networkConnectionType != type){
//         store.dispatch({
//           type : "SET_NETWORK_STATE",
//           data : {
//             networkConnectivity : isConnected,
//             networkConnectionType : type
//           }
//         })
//       }
//     })

//     setAllow(true)
//   }
//   const toastConfig = {
//     success: ({props, text2, ...rest}) => (
//       <BaseToast
//         {...rest}
//         leadingIcon={require('./res/img/check.png')}
//         trailingIcon={{uri: 'null'}}
//         style={{borderLeftColor: defaultTheme.green}}
//         contentContainerStyle={{paddingHorizontal: 15}}
//         text2Style={{
//           fontFamily: 'IRANYekanMobileFN',
//           fontSize: 14,
//         }}
//         text2={text2}
//       />
//     ),
//     error: ({props, text2, ...rest}) => (
//       <BaseToast
//         {...rest}
//         leadingIcon={require('./res/img/close.png')}
//         trailingIcon={{uri: 'null'}}
//         style={{borderLeftColor: defaultTheme.error}}
//         contentContainerStyle={{paddingHorizontal: 15}}
//         text2Style={{
//           fontFamily: 'IRANYekanMobileFN',
//           fontSize: 14,
//         }}
//         text2={text2}
//       />
//     ),
//   };

//   return (
//     <Provider store={store}>
//       <StatusBar 
//         barStyle={Platform.OS==="android"?"light-content":"dark-content"}
//         backgroundColor={defaultTheme.primaryColor}
//       />
//       <SafeAreaView style={{flex : 1}}>
//         {
//           allowRender &&
//           <MainRoute/>
//         }
//         <Toast config={toastConfig}/>
//       </SafeAreaView>
//     </Provider>
//   );
// };

// export default App;
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  I18nManager,
  Platform,
  Text,
  ActivityIndicator,
  Image,
  View,
  Linking,
  AppState,
  LogBox,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/redux/reducers';
import { enableScreens } from 'react-native-screens';
import MainRoute from './src/navigation/MainRouter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { NetworkManager } from './src/classess/NetworkManager';
import PushNotification from 'react-native-push-notification';
import { defaultTheme } from './src/constants/theme';
import Toast, { BaseToast } from 'react-native-toast-message';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
// import Remove from './res/img/remove.svg';
// import {BlurView} from '@react-native-community/blur';
// import MarketMessage from './src/components/MarketMessage';
import { setMarketMessageId } from './src/redux/actions/user';
// import {BlurContainer} from './src/components';
// import {HomeScreen} from './src/screens';
// import {app} from './src/redux/reducers/app/app';
import linking from './src/linking';
import 'react-native-gesture-handler'
import { moderateScale } from 'react-native-size-matters';
import { persistReducer, persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
enableScreens();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['pedometer', "diet", "starRating", "syncedDate"],

};
const persistedReducer = persistReducer(persistConfig, reducers);

let store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);
// const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' })
// const barcodeGs1DB = new PouchDB('barcodeGs1', { adapter: 'react-native-sqlite' })
// const barcodeNationalDB = new PouchDB('barcodeNational', { adapter: 'react-native-sqlite' })

// foodDB.destroy()
// barcodeGs1DB.destroy()
// barcodeNationalDB.destroy()
// AsyncStorage..removeItem("LocalDatabaseVersion")
const toastConfig = {
  success: ({ props, ...rest }) => (
    <BaseToast
      {...rest}
      leadingIcon={require('./res/img/add.png')}
      trailingIcon={{ uri: 'null' }}
      style={{ borderLeftColor: defaultTheme.green }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text2Style={[{
        fontSize: moderateScale(15),
        color: "black",
        textAlign: "left"
      },
      props.style
      ]}
      text2={props.text2}
      text2NumberOfLines={2}

    />
  ),
  error: ({ props, ...rest }) => (
    <BaseToast
      {...rest}
      leadingIcon={require('./res/img/close.png')}
      trailingIcon={{ uri: 'null' }}
      style={{ borderLeftColor: defaultTheme.error }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text2Style={[{
        fontFamily: 'IRANYekanMobileFN',
        fontSize: moderateScale(14),
        color: 'black',
        textAlign: "left"
      },
      props.style
      ]}
      text2={props.text2}
      text2NumberOfLines={2}
      text1={props.text1}
      text1Style={[props.style, { fontSize: moderateScale(15) }]}
    />
  ),
};
const App = () => {

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });
  const onRemoteNotification = (notification) => {
    const actionIdentifier = notification.getActionIdentifier();

    if (actionIdentifier === 'open') {
      // Perform action based on open action
    }

    if (actionIdentifier === 'text') {
      // Text that of user input.
      const userText = notification.getUserText();
      // Perform action based on textinput action
    }
  };
  // Orientation.addOrientationListener(() => Orientation.lockToPortrait());
  // AsyncStorage.clear()
  // Orientation.lockToPortrait()
  I18nManager.allowRTL(false);
  const NM = React.useRef(new NetworkManager()).current;
  const [allowRender, setAllow] = React.useState(false);
  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //  }, []);
  React.useEffect(() => {
    (async () => {
      // LogBox.ignoreAllLogs();
      // AsyncStorage.clear()

      const lang = await AsyncStorage.getItem('lang');
      if (lang) {
        if (lang === 'en') {
          if (I18nManager.isRTL) {
            I18nManager.forceRTL(false);
            RNRestart.Restart();
          }
        } else {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          if (!I18nManager.isRTL) {
            RNRestart.Restart();
          }
        }
      }
      if (lang) {
        store.dispatch({
          type: 'SET_LANGUAGE',
          data: lang,
        });
      }
      networkMonitoring();
    })();
  }, []);

  React.useEffect(() => {
    PushNotification.createChannel({
      channelId: 'General', // (required)
      channelName: 'General', // (required)
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });

    PushNotification.createChannel({
      channelId: 'Reminder', // (required)
      channelName: 'Reminder', // (required)
      soundName: 'remind', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });
  }, []);

  networkMonitoring = () => {
    NM.getNetworkState(setNetworkState);
  };

  setNetworkState = (isConnected, type) => {
    store.dispatch({
      type: 'SET_NETWORK_STATE',
      data: {
        networkConnectivity: isConnected,
        networkConnectionType: type,
      },
    });

    NM.addListener((isConnected, type) => {
      const currentState = store.getState().app;
      console.error("currentState", isConnected, type)
      if (
        currentState.networkConnectivity != isConnected &&
        currentState.networkConnectionType != type
      ) {
        store.dispatch({
          type: 'SET_NETWORK_STATE',
          data: {
            networkConnectivity: isConnected,
            networkConnectionType: type,
          },
        });
        setTimeout(() => {
          setAllow(true);
        }, 2000);
      }
    });
    // setAllow(true)
  };

  // if (!allowRender){
  //   // console.log({allowRender});
  //   return (<SafeAreaView style={{flex: 1, justifyContent:"center", alignContent:"center"}}>
  //     <Text style={{textAlign: "center"}}>Loading ...</Text>
  //   </SafeAreaView>)
  // }


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Test />
      </PersistGate>
    </Provider>
  );
};

export default App;


const Test = () => {
  const user = useSelector(state => state.user);
  const lang = useSelector(state => state.lang);
  const profile = useSelector(state => state.profile);
  // Orientation.lockToPortrait()

  const dispatch = useDispatch();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: defaultTheme.lightBackground,
    },
  };
  const MyStatusBar = () => (
    <View style={[styles.statusBar, { backgroundColor: defaultTheme.primaryColor }]}>
      <SafeAreaView>
        <StatusBar barStyle={"light-content"} translucent backgroundColor={defaultTheme.primaryColor} />
      </SafeAreaView>
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        backgroundColor={defaultTheme.primaryColor}

      />
      {/* <MyStatusBar /> */}


      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer linking={linking} theme={MyTheme}>

          <MainRoute />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </SafeAreaView>

    </>
  );
};


const styles = StyleSheet.create({
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
  },
});
