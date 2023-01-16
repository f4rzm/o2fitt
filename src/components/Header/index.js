import React from 'react';
import {Text, View} from 'react-native';
import CommonText from '../CommonText';
import styles from './styles';

const Header = ({data}) => {
  const {title, childrenLeft, childrenRight} = data;
  return (
    <View style={styles.container}>
      <View style={styles.left}>{childrenLeft}</View>

      <View style={styles.title}>
        <CommonText text={title} styleText={styles.styleTitle} />
      </View>

      <View style={styles.right}>{childrenRight}</View>
    </View>
  );
};

export default Header;
