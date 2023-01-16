import {lang} from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import {nutritions} from '../../../utils/nutritions';
import CommonText from '../../CommonText';
import styles from './styles';

const VerticalListSmallNutrient = ({items, lang, nutrient}) => {
  const {item, index} = items;

  if (index === 0 || index === 2 || index === 3 || index === 4) {
    return null;
  }

  return (
    <View style={styles.row}>
      <View style={styles.fixRow}>
        <CommonText text={nutritions[index][lang.langName]} styleText={styles.title} />
        <CommonText text={` ${' '} (${nutritions[index].unit}) ${' '}`} />
      </View>
      <CommonText text={nutrient[nutritions[index].id - 1].toFixed(2)} styleText={styles.number} />
    </View>
  );
};

export default VerticalListSmallNutrient;
