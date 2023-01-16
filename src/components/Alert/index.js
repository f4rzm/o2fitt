import React from 'react';
import {Pressable, View} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CommonText from '../CommonText';
import styles from './styles';

const Alert = ({dataAlert, lang}) => {
  //===================VARIABLES=======================
  const {arrayButton, alertText} = dataAlert;

  //===================FUNCTION=======================
  const renderButton = () => {
    return arrayButton.map((item, index) => {
      return (
        <Pressable
          onPress={item.onPress}
          key={index}
          style={[styles.button, {backgroundColor: item.color}]}>
          <CommonText text={item.text} styleText={styles.textButton} />
        </Pressable>
      );
    });
  };

  return (
    <View style={styles.container}>
      <CommonText
        text={alertText}
        styleText={[styles.textAlert, {fontFamily: lang.titleFont,lineHeight:moderateScale(24),textAlign:"left"}]}
      />

      <View style={styles.row}>{renderButton()}</View>
    </View>
  );
};

export default Alert;
