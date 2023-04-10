import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  I18nManager,
  FlatList,
  LayoutAnimation,
  Pressable,
  Linking,
} from 'react-native';
import {
  ColumnWrapper,
  ProfileHeader,
  RowCenter,
  RowSpaceAround,
  MessagesRow,
  Toolbar,
  ConfirmButton,
} from '../../components';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';
import {moderateScale} from 'react-native-size-matters';
import {useSelector, useDispatch} from 'react-redux';
import {urls} from '../../utils/urls';
import {RestController} from '../../classess/RestController';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {setUnreadMessageNumber} from '../../redux/actions';
import LottieView from 'lottie-react-native';
import {setMarketMessageId, updateMessage} from '../../redux/actions/user';
import Header from '../../components/Header';
import ArrowBack from '../../../res/img/arrowBack.svg';
import MessageRow from '../../components/MessageRow';
// import SwipeableFlatList from 'react-native-swipeable-list';
import {ActivityIndicator} from 'react-native-paper';
import Toast from 'react-native-toast-message';
// import Button from '../../components/Button';
// import MarketMessage from '../../components/MarketMessage';
import {BlurView} from '@react-native-community/blur';
import Alert from '../../components/Alert';
// import CommonText from '../../components/CommonText';
import { updateShowBottomTab } from '../../redux/actions/app';
const darkColors = {
  background: '#121212',
  primary: '#BB86FC',
  primary2: '#3700b3',
  secondary: '#03DAC6',
  onBackground: '#FFFFFF',
  error: '#CF6679',
};
const MessagesScreen = (props, route) => {
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const app = useSelector(state => state.app);
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = React.useState(
    user.messages.length ? user.messages : [],
  );
  // const [badge, setBadge] = useState([]);
  let badge = []
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [generalMessageIdRead, setGeneralMessageIdRead] = React.useState([]);
  const [index, setIndex] = useState();
  const days = React.useRef([
    lang['1sh'],
    lang['2sh'],
    lang['3sh'],
    lang['4sh'],
    lang['5sh'],
    lang['jome2'],
    lang['sh'],
  ]).current;
  const [showBlur, setShowBlur] = useState(false);
  const arrayButton = [
    {
      text: lang.yes,
      color: defaultTheme.error,
      onPress: () => deleteMessage(index),
    },
    {
      text: lang.no,
      color: defaultTheme.green,
      onPress: () => setShowBlur(false),
    },
  ];

  const alertText = lang.deleteMessage;
  const dataAlert = {arrayButton, alertText};
  const RC = new RestController();
  React.useEffect(() => {
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      // getMessagesLocaly();
    });

    return () => {
      focusUnsubscribe();
    };
  }, []);

  const onSuccess = response => {
    let marketMessage = null;
    let generalMessages = [];
    let messages = [];
    response.data.data.map(item => {
      if (item.isGeneral && item.isForce) {
        marketMessage = item;
      } else if (item.isGeneral && !item.isForce) {
        generalMessages.push(item);
      } else if (!item.isGeneral && !item.isForce) {
        messages.push(item);
      }
    });

    messages = [...messages, ...generalMessages];
    const data = {
      marketMessage,
      generalMessages,
      messages,
    };

    // console.log({data});

    const help = messages.filter(item => item.replyToMessage === 0).reverse();

    setRootMessage(help);
    setLoading(false);

    AsyncStorage.setItem('messages', JSON.stringify(messages));
    // AsyncStorage.setItem('marketMessageId', marketMessage.id.toString());

    dispatch(updateMessage(data));
    // dispatch(setMarketMessageId(marketMessage.id));
  };

  const onFailure = response => {
    // console.log({responseMessage: response});
    setLoading(false);
  };

  const getMessagesLocaly = async () => {
    const m = JSON.parse(await AsyncStorage.getItem('messages'));
    // console.log('mmmmmmmmm', messages);
    let rootMsg = m.filter(item => item.replyToMessage === 0);
    const setUnread = rootMsg.map(item => {
      const hasUnread = m.find(i => i.replyToMessage === item.id && !i.isRead);
      if (hasUnread != undefined) {
        return {...item, hasUnread: true};
      }
      return {...item, hasUnread: false};
    });
    setMessages(setUnread);
    // console.log(m.filter(item => item.replyToMessage === 0));
    setRead([...m.filter(item => item.replyToMessage === 0)]);
  };

  const setRead = async readMessage => {
    const allMessages = JSON.parse(await AsyncStorage.getItem('messages'));
    const m = allMessages.map(item => {
      if (readMessage.find(rm => rm.id === item.id) != undefined) {
        return {...item, isRead: true};
      }
      return {...item};
    });

    // console.log('m', m);
    let unread = 0;
    m.map(item => !item.isRead && !item.isGeneral && unread++);
    // dispatch(setUnreadMessageNumber(unread));
    setReadToServer(readMessage);
  };

  const setReadToServer = readMessage => {
    if (app.networkConnectivity) {
      // readMessage.map(message => {
      //   const url =
      //     urls.socialBaseUrl +
      //     urls.contactUs +
      //     urls.readMessage +
      //     `?Id=${message.id}`;
      //   const header = {
      //     headers: {
      //       Authorization: 'Bearer ' + auth.access_token,
      //       Language: lang.capitalName,
      //     },
      //   };
      //   const params = {};
      //   const RC = new RestController();
      //   RC.put(url, params, header, onSuccessRead, onFailureRead);
      //   RC.checkPrerequisites(
      //     'put',
      //     url,
      //     params,
      //     header,
      //     res => false,
      //     res => false,
      //     auth,
      //     onRefreshTokenSuccess,
      //     onRefreshTokenFailure,
      //   );
      // });
    }
  };

  const onSuccessRead = response => {
    // console.log({response});
  };

  const onFailureRead = response => {};
const [disabled, setDisabled] = useState(false)
  // console.log('messages', messages);

  //===================VARIABLES============================
  const [rootMessage, setRootMessage] = useState([]);
  const title = lang.pm;
  const childrenLeft = (
    <TouchableOpacity
    disabled={disabled}
      style={styles.childrenLeft}
      activeOpacity={1}
      onPress={() => {setDisabled(true);props.navigation.goBack() }}>
      <Image
      source={require("../../../res/img/back.png")}
      style={{width:moderateScale(20),height:moderateScale(18),resizeMode:"contain",transform:[{rotate:I18nManager.isRTL ? "180deg" : "180deg"}]}}
      />
    </TouchableOpacity>
  );

  const dataHeader = {
    title,
    childrenLeft,
    lang,
  };

  //===================USE_EFFECT============================

  // useEffect(() => {
  //   updateMessageFirstly();
  //   // console.log('rr');
  //   // const help = user.messages.filter(item => item.replyToMessage === 0);
  //   // setRootMessage(help);
  // }, []);

  const setMessage = async () => {
    const messages = JSON.parse(await AsyncStorage.getItem('messages'));

    setLoading(false);
    const help = messages.filter(item => item.replyToMessage === 0);

    // console.log({help});
    setRootMessage(help);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updateMessageFirstly();
    });
    return unsubscribe;
  }, [props.navigation,]);

  //===================FUNCTION============================
  const renderItem = items => (
    <MessageRow {...{items, lang, profile, goToDetails, askForDelete,user}} />
  );



  const keyExtractor = (item, index) => `item-${index}-message`;

  const goToDetails = item => {
    let detailsChat = [];
    detailsChat = user.messages.filter(
      element => element.replyToMessage === item.id,
    );
    detailsChat.splice(0, 0, item);
    // console.log({detailsChat});
    setLoading(true);
    if (!detailsChat[0].isGeneral) {
      callApiForReadMessage(detailsChat);
    } else {
      const index = generalMessageIdRead.findIndex(
        item => item === detailsChat[0].id,
      );
      if (index === -1) {
        setGeneralMessageIdRead([...generalMessageIdRead, detailsChat[0].id]);
        AsyncStorage.setItem(
          'generalMessageIdRead',
          JSON.stringify([...generalMessageIdRead, detailsChat[0].id]),
        );
      }
    }
    props.navigation.navigate('ChatScreen', {detailsChat, app});
  };
  const callApiForReadMessage = detailsChat => {
    detailsChat.forEach(item => {
      if (!item.isRead) {
        const url =
          urls.socialBaseUrl +
          urls.contactUs +
          urls.readMessage +
          `?Id=${item.id}`;
        const header = {
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            Language: lang.capitalName,
          },
        };
        const params = {};

        const RC = new RestController();
        RC.put(url, params, header, onSuccessRead, onFailureRead);
      }
    });
  };

  const updateMessageFirstly = async () => {
    const marketMessageId = await AsyncStorage.getItem('marketMessageId');

    const url = `${urls.socialBaseUrl}ContactUs/UserMessages?lastMessageId=${
      marketMessageId ? parseInt(marketMessageId) : 0
    }&userId=${profile.userId}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/json',
        Language: lang.capitalName,
      },
    };

    RC.get(url, header, onSuccess, onFailure);
  };

  const askForDelete = index => {
    setShowBlur(true);
    setIndex(index);
  };

  const deleteMessage = index => {
    setShowBlur(false);
    const obj = rootMessage[index];
    // console.log({object: obj});
    const url = `${urls.socialBaseUrl}ContactUs/Delete?messageId=${obj.id}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/json',
        Language: lang.capitalName,
      },
    };

    const params = {};

    RC.delete(url, params, header, onSuccessDelete, onFailureDelete);

    const filter = rootMessage.filter(item => item.id !== obj.id);

    const messages = user.messages.filter(
      item => item.id !== obj.id && obj.id !== item.replyToMessage,
    );

    dispatch(
      updateMessage({
        marketMessage: user.marketMessage,
        messages,
        generalMessages: user.generalMessages,
      }),
    );

    setRootMessage(filter);
  };

  const onSuccessDelete = response => {
    Toast.show({
      type: 'success',
      // text2: response.data.message,
      props:{text2:response.data.message,style:{fontFamily:lang.font}},
      visibilityTime: 1000,
    });
  };

  const onFailureDelete = response => {
    Toast.show({
      type: 'error',
      // text2: response.data.message,
      props:{text2:response.data.message,style:{fontFamily:lang.font}},
      visibilityTime: 1000,
    });
  };

  const goToSupportScreen = () => {
    props.navigation.navigate('SupportScreen');
  };

  
  const [showMarketMessage, setShowMarketMessage] = useState(false);

  // useEffect(() => {
  //   if (user.marketMessage && user.marketMessage.id !== user.marketMessageId ) {
  //     setShowMarketMessage(true);
  //     dispatch(updateShowBottomTab(false));
  //   }
  // }, [user.marketMessage]);

  //==================BACKGROUND=======================

  const pressConfirmButton = () => {
    setShowMarketMessage(false)

    dispatch(setMarketMessageId(user.marketMessage.id));
    AsyncStorage.setItem('marketMessageId', user.marketMessage.id.toString())
    dispatch(updateShowBottomTab(true));

  };

  const pressGoToAddress = (data) => {
    setShowMarketMessage(false)
    dispatch(updateShowBottomTab(true));
    if(data.url.includes('https' || 'http')){
      Linking.openURL(data.url);
    }else{
      props.navigation.navigate(data.url);
    }
    dispatch(setMarketMessageId(user.marketMessage.id));
    AsyncStorage.setItem('marketMessageId', user.marketMessage.id.toString())
    
  }

  if (loading) {
    return (
      <>
        <Header {...{data: dataHeader}} />
        <View style={styles.holderActivity}>
          <ActivityIndicator size={"large"} color={defaultTheme.green2} />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Header {...{data: dataHeader}} />
      {rootMessage.length ? (
        <>
          <FlatList
            style={styles.list}
            data={rootMessage}
            extraData={rootMessage}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
          {/* <Button
            {...{
              text: lang.sendMsg,
              onPress: goToSupportScreen,
              styleButton: styles.styleButtonSend,
            }}
          /> */}
          <Pressable style={styles.styleButtonSend} onPress={goToSupportScreen}>
            <LottieView
              style={{
                width: dimensions.WINDOW_WIDTH * 0.25,
              }}
              source={require('../../../res/animations/new_message.json')}
              autoPlay
              loop={false}
            />
            {/* <CommonText text={lang.newMessage} styleText={{fontFamily: lang.titleFont, fontSize: moderateScale(16)}} /> */}
          </Pressable>
          {showBlur && (
            <View style={styles.wrapper}>
              <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={4}
                reducedTransparencyFallbackColor="white"
              />
              <Alert {...{dataAlert, lang}} />
            </View>
          )}
        </>
      ) : (
        <View
          style={{
            marginTop: dimensions.WINDOW_WIDTH * 0.2,
            marginBottom: moderateScale(20),
            alignSelf: 'center',
          }}>
          <LottieView
            style={{
              width: dimensions.WINDOW_WIDTH * 0.4,
            }}
            source={require('../../../res/animations/msg.json')}
            autoPlay
            loop={false}
          />
          <ConfirmButton
            lang={lang}
            style={{
              width: moderateScale(140),
              marginTop: moderateScale(50),
              backgroundColor: defaultTheme.green,
            }}
            title={lang.sendMsg}
            onPress={() => props.navigation.navigate('SupportScreen')}
          />
        </View>
      )}

{/* {showMarketMessage && (
        <View style={styles.wrapper}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor="white"
          />
          <MarketMessage
            {...{data: user.marketMessage, lang, pressConfirmButton, pressGoToAddress}}
          />
        </View>
      )} */}
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenLeft: {
    padding: moderateScale(25),
  },
  rightIcon: {
    transform: [{rotate: '180deg'}],
  },
  list: {
    flex: 1,
  },
  contentList: {
    paddingHorizontal: 15,
    marginTop: 15,
    paddingBottom: 15,
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    opacity: 0.87,
  },
  button1Text: {
    color: darkColors.primary,
  },
  button2Text: {
    color: darkColors.secondary,
  },
  button3Text: {
    color: darkColors.error,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: darkColors.backgroundColor,
  },
  holderActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleButtonSend: {
    marginStart: 10,
    position: 'absolute',
    bottom: 0,
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
  },
});
