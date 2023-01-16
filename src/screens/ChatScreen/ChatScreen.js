import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  I18nManager,
  Pressable,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import Header from '../../components/Header';
import styles from './ChatStyles';
import ArrowBack from '../../../res/img/arrowBack.svg';
import { useDispatch, useSelector } from 'react-redux';
// import FastImage from 'react-native-fast-image';
// import CommonText from '../../components/CommonText';
import ChatTextInput from '../../components/ChatTextInput';
import moment from 'moment';
// import Icon from 'react-native-vector-icons/EvilIcons';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import { updateMessage } from '../../redux/actions/user';
import DetailsMessage from '../../components/DetailsMessage';
import Toast from 'react-native-toast-message';
import { BlurView } from '@react-native-community/blur';
import Alert from '../../components/Alert';
import { defaultTheme } from '../../constants/theme';
import { setUnreadMessageNumber } from '../../redux/actions';
import { useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';

const ChatScreen = ({ navigation, route }) => {
  //==================VARIABLES=======================
  const [detailsChat, setDetailsChat] = useState(route.params.detailsChat);
  const app = route.params.app;
  const [removeMessage, setRemoveMessage] = useState();
  const [showBlur, setShowBlur] = useState(false);
  const translateX = useRef(new Animated.Value(70)).current;
  const transform = {
    transform: [{ translateX }],
  };
  const lang = useSelector(state => state.lang);
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false)
  const title = lang.pm;
  const childrenLeft = (
    <TouchableOpacity
      disabled={disabled}
      style={styles.childrenLeft}
      activeOpacity={1}
      onPress={() => { setDisabled(true); navigation.navigate('MessagesScreen', { update: 'false' }) }}>
      <Image
        source={require("../../../res/img/back.png")}
        style={{ width: moderateScale(20), height: moderateScale(18), resizeMode: "contain", transform: [{ rotate: I18nManager.isRTL ? "180deg" : "180deg" }] }}
      />
    </TouchableOpacity>
  );
  const dataHeader = {
    title,
    childrenLeft,
    lang,
  };

  const arrayButton = [
    {
      text: lang.yes,
      color: defaultTheme.error,
      onPress: () => deleteMessage(removeMessage),
    },
    { text: lang.no, color: defaultTheme.green, onPress: () => setShowBlur(false) },
  ];

  const alertText = lang.deleteMessage;
  const dataAlert = { arrayButton, alertText };

  //===================EFFECT===================
  useEffect(() => {
    let countRead = 0;
    detailsChat.forEach(item => {
      if (item.adminId && !item.isRead) {
        countRead++;
      }
    });
    dispatch(setUnreadMessageNumber(app.unreadMessages - countRead));
  })

  //==================FUNCTION=======================

  const onLongPress = item => {
    setRemoveMessage(item);
  };

  const askForDelete = () => {
    setShowBlur(true)
  }

  const deleteMessage = item => {
    setShowBlur(false);
    const url = `${urls.socialBaseUrl}ContactUs/Delete?messageId=${item.id}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/json',
        Language: lang.capitalName,
      },
    };

    const params = {};
    const RC = new RestController();

    RC.delete(url, params, header, onSuccessDelete, onFailureDelete);
  };

  const onSuccessDelete = response => {
    const remainingMessage = detailsChat.filter(
      item => item.id !== removeMessage.id,
    );
    const allMessages = user.messages.filter(
      item => item.id !== removeMessage.id,
    );
    setDetailsChat(remainingMessage);
    const data = {
      marketMessage: user.marketMessage,
      generalMessages: user.generalMessages,
      messages: allMessages,
    };
    dispatch(updateMessage(data));
    Toast.show({
      type: 'success',
      // text2: response.data.message,
      props: { text2: response.data.message, style: { fontFamily: lang.font } },
      visibilityTime: 1000,
    });
  };

  const onFailureDelete = response => {
    Toast.show({
      type: 'error',
      // text2: response.data.message,
      props: { text2: response.data.message, style: { fontFamily: lang.font } },
      visibilityTime: 1000,
    });
  };

  const renderItem = items => <DetailsMessage {...{ items, onLongPress, askForDelete, profile }} />

  const keyExtractor = useCallback((item, index) => `item-${index}-chat`, []);

  const sendMessage = value => {
    const url = urls.socialBaseUrl + urls.contactUs + "Admin"
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {
      id: 0,
      userId: detailsChat[0].userId,
      insertDate: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
      message: value,
      isRead: true,
      adminId: 0,
      toAdmin: true,
      isGeneral: false,
      title: '',
      isForce: true,
      classification: detailsChat[0].classification,
      isReadAdmin: true,
      replyToMessage: detailsChat[0].id,
      canReply: true,
    };
    setDetailsChat([...detailsChat, params]);
    const data = {
      marketMessage: user.marketMessage,
      generalMessages: user.generalMessages,
      messages: [...user.messages, ...detailsChat, params],
    };
    dispatch(updateMessage(data));

    const RC = new RestController();

    RC.post(url, params, header, onSuccessSend, onFailureSend);
  };

  const onSuccessSend = (response) => {

  }

  const onFailureSend = (response) => {
    Toast.show({
      type: 'error',
      // text2: response.data.message,
      props: { text2: response.data.data, style: { fontFamily: lang.font } },
      visibilityTime: 1000,
    });
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60}
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "none"}
    >

      <View style={styles.container}>
        <Header {...{ data: dataHeader }} />
        <FlatList
          style={styles.container}
          data={detailsChat}
          extraData={detailsChat}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentList}
          initialNumToRender={30}
        />
        {!detailsChat[0].isGeneral && <ChatTextInput {...{ lang, sendMessage }} />}

        {showBlur && (
          <View style={styles.wrapperBlur}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={4}
              reducedTransparencyFallbackColor="white"
            />
            <Alert {...{ dataAlert, lang }} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
