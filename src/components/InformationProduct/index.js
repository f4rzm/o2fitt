import React, { useState } from 'react';
import { useEffect } from 'react';
import { I18nManager, ScrollView, Text, TextInput, View } from 'react-native';
import { defaultTheme } from '../../constants/theme';
import CommonText from '../CommonText';
import styles from './styles';

const InformationProduct = (props) => {
  //=======================VARIABLES=======================
  const [inputText, setInputText] = useState('');

  const array = [
    {
      text: props.lang.productName,
    },
    {
      text: props.lang.barcode,
    },
  ];

  //=======================FUNCTION=======================

  const renderInformation = () => {
    return array.map((item, index) => {
      return (
        <View style={styles.row} key={index}>
          <Text style={[styles.title, { fontFamily: props.lang.font }]} >{item.text}</Text>

          <TextInput
            ref={index ? null : props.textInput}
            style={index ? styles.barcode : [styles.textInput]}
            onChangeText={(text)=>props.onChangeText(text)}
            defaultValue={index ? props.barcode : inputText}
            textAlign={I18nManager.isRTL ? 'right' : 'right'}
            fontFamily={props.lang.font}
            editable={index ? false : true}
            placeholder={index ? props.barcode.toString() : props.lang.example}
            autoFocus={index ? null : true}
            placeholderTextColor={defaultTheme.darkGray}
          />
        </View>
      );
    });
  };

  //=======================RENDER=======================
  return <View style={styles.container}>{renderInformation()}</View>;
};

export default InformationProduct;
