import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import CommonText from '../../CommonText';
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import {RotateIcon} from '../../../utils/rotateIcon';

const InformationPackage = ({items, lang, navigation}) => {
  //==================VARIABLES=======================
  const {item, index} = items;
  //===================FUNCTION===================

  const onPress = (item) => {
    console.log({item});
    navigation.navigate('InformationPackageScreen', {item});
  };

  const renderSubCategory = () => {
    return item.featuresInformationSelectDTOs.map((item, index) => {
      return (
        <TouchableOpacity
          style={[styles.row, styles.button]}
          key={index}
          activeOpacity={1}
          onPress={onPress.bind('', item)}>
          <View style={styles.full}>
            <View style={styles.row}>
              <View style={styles.iconHolder}>
                <FastImage
                  source={{uri: item.icon}}
                  style={styles.icon}
                  resizeMode="cover"
                />
              </View>
              <CommonText
                text={item.title.value}
                styleText={[styles.titleItem, {fontFamily: lang.titleFont}]}
              />
            </View>
            <View style={styles.textHolder}>
              <CommonText
                text={item.subTitle.value}
                styleText={styles.subTitleItem}
              />
            </View>
          </View>
          <Icon name="right" color={'#000'} size={18} style={RotateIcon()} />
        </TouchableOpacity>
      );
    });
  };

  return useMemo(() => {
    return (
      <View style={styles.container}>
        <CommonText
          text={item.featuresCategory.value}
          styleText={[styles.title, {fontFamily: lang.titleFont}]}
        />

        {renderSubCategory()}
      </View>
    );
  }, []);
};

export default InformationPackage;
