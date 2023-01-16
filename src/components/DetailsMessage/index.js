import React, {useRef, useState} from 'react';
import {
  Animated,
  I18nManager,
  Linking,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import CommonText from '../CommonText';
import styles from './styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import NoAvatar from '../../../res/img/no_avatar.svg';
import {useEffect} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
const DetailsMessage = ({items, onLongPress, askForDelete, profile}) => {
  //==================VARIABLES=======================
  const {item, index} = items;

  const translateX = useRef(new Animated.Value(55)).current;
  const translateXRight = useRef(new Animated.Value(-55)).current;

  const transformLeft = {
    transform: [{translateX}],
  };

  const transformRight = {
    transform: [{translateX: translateXRight}],
  };
  //==================FUNCTION======================

  const onLongPressItem = (item) => {
    onLongPress(item);
    item.adminId
      ? null
      : Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
  };

  const onPress = (item) => {
    item.adminId
      ? null
      : Animated.timing(translateX, {
          toValue: 55,
          duration: 250,
          useNativeDriver: true,
        }).start();
  };

  return (
    <View
      style={styles.wrapper}
      // onLongPress={onLongPressItem.bind('null', item)}
      onPress={onPress.bind('null', item)}>
      {/* <Animated.View
        style={[
          styles.row,
          item.adminId ? styles.reverse : styles.row,
          item.adminId ? transformRight : transformLeft,
        ]}>
        <TouchableOpacity
          style={styles.delete}
          onPress={askForDelete.bind('null', item)}>
          <Icon name="trash" color={'white'} size={45} />
        </TouchableOpacity> */}

      <View
        style={[
          styles.containerChat,
          !item.toAdmin ? styles.reverse : styles.row,
        ]}>
        <View
          style={[
            styles.imageHolder,
            !item.toAdmin ? styles.marginStart : styles.marginEnd,
            !item.toAdmin
              ? {
                  backgroundColor: 'rgba(247,247,247,1)',
                  borderRadius: moderateScale(25),
                }
              : null,
          ]}>
          {!item.toAdmin ? (
            <FastImage
              source={require('../../../res/img/logo2.png')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : profile.imageUri ? (
            <FastImage
              source={{uri: profile.imageUri}}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <NoAvatar width="100%" height="100%" />
          )}
        </View>
        <View
          style={
            !item.toAdmin
              ? styles.chatHolder
              : {
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 20,
                  padding: moderateScale(10),
                  maxWidth: '79%',
                  backgroundColor: defaultTheme.grayBackground,
                }
          }>
          {item.message.includes(
            'https://' || 'http://' || 'Https://' || 'Http://',
          ) ? (
            <TouchableOpacity onPress={() => Linking.openURL(item.message)}>
              <CommonText text={item.message} styleText={styles.link} />
            </TouchableOpacity>
          ) : (
            <CommonText text={item.message} styleText={styles.chatText} />
          )}
        </View>
      </View>

      {/* </Animated.View> */}
    </View>
  );
};

export default DetailsMessage;
