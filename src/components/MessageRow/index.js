import React, { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { Animated, I18nManager, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/EvilIcons';
import CommonText from '../CommonText';
import styles from './styles';
import ArrowBack from '../../../res/img/arrowBack.svg';
import { useSelector } from 'react-redux';
// import momentJalaali from 'moment-jalaali';
import * as shamsi from 'shamsi-date-converter';
import { Month } from '../../utils/month';
// import SvgUri from 'react-native-fast-svg';
import NoAvatar from '../../../res/img/no_avatar.svg';
import { moderateScale, scale } from 'react-native-size-matters';
const MessageRow = ({ items, lang, profile, goToDetails, askForDelete }) => {
  const { item, index } = items;
  // console.log({item});
  const category = [lang.msgCat1, lang.msgCat2, lang.msgCat3, lang.msgCat4];
  const [badge, setBadge] = useState(0);
  const [activeDelete, setActiveDelete] = useState(false);
  const user = useSelector(state => state.user);
  const s = item.insertDate.split('T')[0]
  const a = user.countryId===128?shamsi.gregorianToJalali(parseInt(s.split('-')[0]), parseInt(s.split('-')[1]), parseInt(s.split('-')[2])):s
  // const day = a[2].toString()
  // const month = Month[a[1]]
  const translateX = useRef(new Animated.Value(lang.langName=="persian"?72:-72)).current;
  const transform = { transform: [{ translateX }] };
  let counter = 0;

  //==================EFFECT================
  useEffect(() => {
    user.messages.filter(message => {
      if (item.id === message.replyToMessage && !message.isRead) {
        counter++;
      }
    });
    setBadge(counter);
  }, []);
  //===================FUNCTION===================

  const deleteBtn = index => {
    onClose();
    askForDelete(index);
  };

  const onLongPress = () => {
    setActiveDelete(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    if (activeDelete) {
      onClose();
      setActiveDelete(false);
    } else {
      goToDetails(item);
    }
  };

  const onClose = () => {
    Animated.timing(translateX, {
      toValue: lang.langName=="persian"?72:-72,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={onLongPress}
      onPress={onPress}>
      <Animated.View style={[styles.row, transform]}>
        <TouchableOpacity
          style={styles.inherit}
          onPress={deleteBtn.bind('null', index)}>
          <Icon name="trash" color={'white'} size={45} />
        </TouchableOpacity>

        <View style={styles.button}>
          <View style={styles.left}>
            <View style={styles.top}>
              <View style={styles.imageHolder}>
                {profile.imageUri ? (
                  <FastImage
                    source={{ uri: profile.imageUri }}
                    style={[styles.image]}
                    resizeMode="contain"
                  />
                ) : (
                  <NoAvatar width="100%" height="100%" />
                )}
              </View>
              <View>
                <View style={{ flexDirection: I18nManager ? "row" : "row-reverse",marginBottom:Platform.OS=='ios'? moderateScale(10):2 }}>
                  <CommonText
                    text={category[item.classification - 1]}
                    styleText={[styles.title, { fontFamily: lang.titleFont }]}
                  />
                  {badge > 0 && (
                    <View style={{ paddingHorizontal: 5 }}>
                      <CommonText text={`${badge}`} styleText={styles.textUnread} />
                    </View>
                  )}
                </View>


                <View style={styles.row}>
                  <CommonText
                    text={`${item.title}`}
                    styleText={styles.subTitle}
                  />
                  <CommonText
                    text={` ${a} `}
                    styleText={styles.subTitle}

                  />
                </View>
              </View>
            </View>
            <View style={{ width: scale(270) }}>
              <CommonText
                text={item.message}
                styleText={styles.description}
                numberOfLines={1}
              />
            </View>
          </View>

          <View style={[styles.moreButton, styles.row]}>

            <View>
              <View style={[styles.arrowBack,{transform:[{rotate:lang.langName=="persian"?"0deg":"180deg"}]}]}>
                <ArrowBack width={14} />
              </View>
              {/* <CommonText text={lang.more} styleText={styles.textMoreView} /> */}
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default MessageRow;
