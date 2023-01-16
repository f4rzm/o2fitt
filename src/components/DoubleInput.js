
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import {CustomInput , RowWrapper} from '../components';

const DoubleInput = props => {
    return(
      <RowWrapper style={{flexDirection : I18nManager.isRTL ? "row-reverse" : "row"}}>
          <CustomInput
            lang={props.lang}
            style={[styles.input,props.style]}
            textStyle={[styles.inputText,props.textStyle]}
            keyboardType="decimal-pad"
            maxLength={props.maxLength1}
            placeholder={props.placeholder1}
            value={props.value1}
            onChangeText={props.onChangeText1}
            editable={props.editable!=null?props.editable:true}
            focusControl={props.focusControl?props.focusControl:null}
            autoFocus={props.autoFocus}
          />
          <Text style={[styles.seprator,{fontFamily:props.lang.titleFont}]}>
            {props.seprator}
          </Text>
           <CustomInput
            lang={props.lang}
            style={[styles.input,props.style]}
            textStyle={[styles.inputText,props.textStyle]}
            keyboardType="decimal-pad"
            maxLength={props.maxLength2}
            placeholder={props.placeholder2}
            value={props.value2}
            onChangeText={props.onChangeText2}   
            editable={props.editable!=null?props.editable:true}
            focusControl={props.focusControl?props.focusControl:null}
          />
      </RowWrapper>
    )
}

const styles = StyleSheet.create({
   input : {
       borderWidth : 1.2,
       borderRadius : moderateScale(10),
       width : moderateScale(90),
       height : moderateScale(40),
       borderColor : defaultTheme.lightGray,
       marginHorizontal : moderateScale(8),
       paddingStart : 0,
       paddingEnd : 0
   },
   inputText : {
     width : "85%",
       fontSize : moderateScale(20),
       textAlign : "center",
       paddingStart : 0,
       paddingEnd:0
   },
   seprator : {
       fontSize : moderateScale(20),
       marginHorizontal : moderateScale(0)
   }
})

export default memo(DoubleInput)