import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import CommonText from '../CommonText';
import styles from './styles';

const SliderWeight = ({profile}) => {
  //==================VARIABLES=======================
  const lang = useSelector(state => state.lang);
  const height = profile.heightSize;
  const minWeight = (Math.pow(height / 100, 2) * 18.5).toFixed(1) ;
  const maxWeight = (Math.pow(height / 100, 2) * 25.0).toFixed(1);
  return (
    <View style={styles.mainContainer}>
      <CommonText
        text={lang.sliderWeightSuggest}
        styleText={[styles.title, {fontFamily: lang.titleFont}]}
      />
      <View style={styles.container}>
        <View style={styles.circle} />
        <View style={styles.line} />
        <View style={styles.circle} />
        <View style={styles.minWeight}>
          <View style={styles.weightCircle} />
          <CommonText text={minWeight} styleText={styles.number} />
        </View>

        <View style={styles.maxWeight}>
          <View style={styles.weightCircle} />
          <CommonText text={maxWeight} styleText={styles.number} />
        </View>
      </View>
    </View>
  );
};

export default SliderWeight;
