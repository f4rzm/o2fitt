import React, {memo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from './ConfirmButton';
import {dimensions} from '../constants/Dimensions';

const MainToolbar = props => {
  return (
    <View style={styles.mainContainer}>
      <View style={{flexDirection: 'row', height: moderateScale(60)}}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            hitSlop={{
              top: moderateScale(15),
              bottom: moderateScale(15),
              left: moderateScale(15),
              right: moderateScale(15),
            }}
            onPress={props.BackPressed}>
            <Image
              source={require('../../res/img/back.png')}
              style={[
                styles.chat,
                {transform: [{rotate: !I18nManager ? '0deg' : '180deg'}]},
              ]}
              resizeMode="contain"
            />
            {parseInt(props.unreadNum) > 0 && (
              <View style={styles.numContainer}>
                <Text style={styles.num} allowFontScaling={false}>
                  {props.unreadNum}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Image
            source={require('../../res/img/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightContainer}></View>
      </View>
      <View
        style={{
          width: dimensions.WINDOW_WIDTH,
          backgroundColor: 'white',
          height: moderateScale(25),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: dimensions.WINDOW_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultTheme.primaryColor,
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(35),
  },
  chat: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  numContainer: {
    position: 'absolute',
    top: moderateScale(-5),
    right: moderateScale(14),
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(10),
    backgroundColor: defaultTheme.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  num: {
    color: defaultTheme.lightText,
    fontSize: moderateScale(12),
  },
});

export default memo(MainToolbar);
