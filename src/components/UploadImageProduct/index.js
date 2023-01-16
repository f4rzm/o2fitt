import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import Camera from '../../../res/img/camera.svg';
import CommonText from '../CommonText';
import FastImage from 'react-native-fast-image';
import Remove from '../../../res/img/remove.svg';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';

const UploadImageProduct = ({
  lang,
  requestCameraPermission,
  mainImage,
  valueImage,
  removeImage,
}) => {
  //==========================VARIABLES========================
  const data = [
    {
      text: lang.nutritionalValueImage,
    },
    {
      text: lang.productMainImage,
    },
  ];

  //==========================FUNCTION================

  const renderItem = () => {
    return data.map((item, index) => {
      if (index === 0 && valueImage) {
        return renderImage(valueImage, index);
      }
      if (index === 1 && mainImage) {
        return renderImage(mainImage, index);
      }
      return (
        <TouchableOpacity
          key={index}
          style={[styles.upload, index % 2 == 0 ? styles.grid : null]}
          activeOpacity={0.6}
          onPress={requestCameraPermission.bind('null', index)}>
          <Camera width={moderateScale(25)} height={moderateScale(25)} />
          <CommonText text={item.text} styleText={styles.textUpload} />
        </TouchableOpacity>
      );
    });
  };

  const renderImage = (image, index) => {
    // console.log({image});
    return (
      <View style={[styles.imageHolder, index % 2 == 0 ? styles.grid : null]}>
        <FastImage
          source={{uri: image.path}}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={removeImage.bind('null', index)}>
          <Remove />
        </TouchableOpacity>
      </View>
    );
  };

  //==========================RENDER===========================
  return (
    <View style={styles.container}>{renderItem()}</View>
  );
};

export default UploadImageProduct;
