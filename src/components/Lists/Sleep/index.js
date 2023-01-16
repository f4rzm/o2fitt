import React, {useRef, useState} from 'react';
import {Animated, Pressable, View} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import CommonText from '../../CommonText';
import momentJalaali from 'moment-jalaali';

const SleepList = ({items, lang, askForDelete, askForEdit}) => {
  //==================VARIABLEs==================
  const {item, index} = items;
  const date = momentJalaali(item.date.split('T')[0], 'YYYY/MM/DD').format(
    'jYYYY/jMM/jDD',
  );
  const duration = `${item.duration.split(':')[0]} ${lang.hour}  ${
    item.duration.split(':')[1]
  } ${lang.min}`;
  const translateXDelete = useRef(new Animated.Value(140)).current;
  const [activeDelete, setActiveDelete] = useState(false);

  const transform = {transform: [{translateX: translateXDelete}]};

  //==================FUNCTION==================

  const onLongPress = () => {
    setActiveDelete(true);
    Animated.timing(translateXDelete, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  

  const pressDelete = item => {
    askForDelete(item)
    hideDelete();
  };

  const onPress = () => {
    if (activeDelete) {
      hideDelete();
      setActiveDelete(false);
    }
    
  };

  const pressEdit = item => {
    askForEdit(item)
    hideDelete();
  };

  const hideDelete = () => {
    Animated.timing(translateXDelete, {
      toValue: 140,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable style={styles.container} onPress={onPress} onLongPress={onLongPress}>
      <Animated.View style={[styles.container, transform]}>
        <Pressable
          style={styles.buttonRemove}
          onPress={pressDelete.bind('null', item)}>
          <Icon name="trash" color={'white'} size={45} />
        </Pressable>
        <Pressable
          style={styles.buttonEdit}
          onPress={pressEdit.bind('null', item)}>
          <Icon name="pencil" color={'white'} size={45} />
        </Pressable>

        <View style={[styles.row, styles.padding]}>
          <CommonText text={date} styleText={[styles.date, {fontFamily: lang.titleFont}]} />
          <CommonText text={duration} styleText={[styles.duration, {fontFamily: lang.titleFont}]} />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default SleepList;
