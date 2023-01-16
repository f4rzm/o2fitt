import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import BarcodeLost from '../../../res/img/barcode_lost.svg';
import {moderateScale} from 'react-native-size-matters';
import CommonText from '../CommonText';
import {defaultTheme} from '../../constants/theme';

const PopupLostBarcode = ({lang, onClosePopup, navigate}) => {
  //=====================VARIABLES============================
  const button = [
    {text: lang.send, color: defaultTheme.green},
    {text: lang.cancel, color: defaultTheme.error},
  ];

  //=======================FUNCTION=======================


  const renderButton = () => {
    return button.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.button, {backgroundColor: item.color}]}
          onPress={index ? onClosePopup : navigate}
          activeOpacity={.8}
          >
          <CommonText text={item.text} styleText={styles.textButton} />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageHolder}>
        <BarcodeLost width={moderateScale(100)} />
      </View>
      <CommonText text={lang.lostBarcode} styleText={styles.text} />
      <CommonText text={lang.sendInfo} styleText={styles.text} />

      <View style={styles.row}>{renderButton()}</View>
    </View>
  );
};

export default PopupLostBarcode;
