import React, {useRef, useState,memo} from 'react';
import {Animated, Pressable, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Remove from '../../../../res/img/remove.svg';
import CommonText from '../../CommonText';
import Reciepe from '../../../../res/img/reciepe.svg';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/EvilIcons';

const PersonalFoods = ({items, onFoodPressed, askForDelete}) => {
  //==================FUNCTION==================

  const {item, index} = items;
  const translateXDelete = useRef(new Animated.Value(70)).current;
  const [activeDelete, setActiveDelete] = useState(false);

  const transform = {transform: [{translateX: translateXDelete}]};
  //==================FUNCTION==================

  const onLongPress = () => {
    setActiveDelete(true)
    Animated.timing(translateXDelete, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const pressDelete = (item) => {
    askForDelete(item)
    hideDelete();
  };

  const onPress = () => {
    if(activeDelete){
      hideDelete();
      setActiveDelete(false)
    }
    else{
      onFoodPressed(item);
    }
    
    
  };

  const hideDelete = () => {
    Animated.timing(translateXDelete, {
      toValue: 70,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity  activeOpacity={0.7} onPress={onPress} onLongPress={onLongPress} >
      <Animated.View style={[styles.container, transform]}>

        <TouchableOpacity activeOpacity={.9} style={styles.buttonRemove} onPress={pressDelete.bind('null', item)}>
          <Icon name="trash" color={'white'} size={45} />
        </TouchableOpacity>

        <View style={[styles.row, styles.padding]}>
          <Reciepe
            width={moderateScale(33)}
            height={moderateScale(33)}
            preserveAspectRatio="none"
          />
          <CommonText text={item.foodName} styleText={styles.foodName} />
        </View>
    </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(PersonalFoods);
