import React from 'react';
import {TouchableOpacity} from 'react-native';
import CommonText from '../CommonText';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomDropDown = ({pressCustomDropDown, data, index, styleContainer,styleText}) => {
  return (
    <TouchableOpacity
      style={[styles.container, styleContainer]}
      activeOpacity={0.8}
      onPress={pressCustomDropDown.bind('null', data)}>
      {data[index].name.includes('*') ? (
        <CommonText
          text={data[index].name.split('*')[0]}
          styleText={styles.text}
        />
      ) : (
        <CommonText text={data[index].name} styleText={[styles.text,{styleText}]} />
      )}
      <Icon name="caret-down" style={styles.icon} />
    </TouchableOpacity>
  );
};

export default CustomDropDown;
