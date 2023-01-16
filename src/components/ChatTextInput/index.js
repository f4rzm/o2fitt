import React, {useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultTheme } from '../../constants/theme';
import { RotateIcon } from '../../utils/rotateIcon';
import Toast from 'react-native-toast-message';

const ChatTextInput = ({lang, sendMessage}) => {
  //=====================VARIABLES=======================
  const [value, setValue] = useState('');

  //=====================FUNCTION=======================
  const onChangeText = value => {
    setValue(value);
  };

  const send = (value) => {
      if(value.length){
        sendMessage(value)
        setValue('');
      }
      else {
        Toast.show({
            type: 'error',
            props:{text2:lang.writeMessageTruely,style:{fontFamily:lang.font}},
            visibilityTime: 1000,
          });
      }
  }

  return (
    <View style={styles.horizontal}>
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.textInput}
          placeholder={lang.writhYourTextForSupport}
          fontFamily={lang.font}
          placeholderTextColor={defaultTheme.darkGray}
          multiline={true}
        />
        <TouchableOpacity style={styles.buttonSend} onPress={send.bind('null', value)} activeOpacity={.8}>
          <Icon name="send" size={20} color={defaultTheme.white} style={RotateIcon()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatTextInput;
