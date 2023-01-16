import React from 'react';
import {TouchableOpacity} from 'react-native';
import CommonText from '../CommonText';
import styles from './styles';

const BlurItemList = ({items, selectMeasureUnit}) => {
  const {item, index} = items;
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={selectMeasureUnit.bind('null', index)}>
      {item.name.includes('*') ? (
        <>
          <CommonText text={item.name.split('*')[0]} styleText={styles.measureUnitText} />
          <CommonText text={item.name.split('*')[1]} />
        </>
      ) : (
        <CommonText text={item.name} styleText={styles.measureUnitText} />
      )}
    </TouchableOpacity>
  );
};

export default BlurItemList;
