import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/AntDesign';
import {defaultTheme} from '../../constants/theme';
import CommonText from '../CommonText';
import styles from './styles';
import CameraPopup from '../../../res/img/cameraPopup.svg';
import Gallery from '../../../res/img/gallery.svg';

const PopupUploadImage = ({lang, onClosePopup, openCamera, openGallery}) => {
  //=====================VARIABLES=======================
  const data = [
    {text: lang.camera},
    {
      text: lang.gallery,
    },
  ];

  //=======================FUNCTION=======================
  const onClose = () => {onClosePopup()};

  const renderUpload = () => {
    return data.map((item, index) => {
      return (
        <View style={styles.wrapperSelectButton} key={index}>
          <TouchableOpacity style={styles.selectButton} onPress={index ? openGallery : openCamera}>
            {index ? <Gallery /> : <CameraPopup />}
          </TouchableOpacity>
          <CommonText text={item.text} styleText={styles.textSelectButton} />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}>
        <Icon
          name="close"
          color={defaultTheme.error}
          size={moderateScale(30)}
        />
      </TouchableOpacity>
      <CommonText text={lang.selectImage} styleText={styles.title} />

      <View style={styles.row}>{renderUpload()}</View>
    </View>
  );
};

export default PopupUploadImage;
