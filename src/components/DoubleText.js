
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
import {CustomInput , RowWrapper} from '.';
import ColumnWrapper from './layout/ColumnWrapper';

const DoubleText = props => {
    return(
      <RowWrapper style={{flexDirection : I18nManager.isRTL ? "row-reverse" : "row"}}>
          
          <ColumnWrapper style={styles.container}>
            <Text style={[styles.text1,{fontFamily:props.lang.titleFont}]} allowFontScaling={false}>
                {
                  props.text1
                }
            </Text>
            <Text style={[styles.text2,{fontFamily:props.lang.font}]} allowFontScaling={false}>
                {
                  props.subText1
                }
            </Text>
          </ColumnWrapper>
          <Text style={[styles.seprator,{fontFamily:props.lang.titleFont}]} allowFontScaling={false}>
            {props.seprator}
          </Text>
          <ColumnWrapper style={styles.container}>
            <Text style={[styles.text1,{fontFamily:props.lang.titleFont}]} allowFontScaling={false}>
                {
                  props.text2
                }
            </Text>
            <Text style={[styles.text2,{fontFamily:props.lang.font}]} allowFontScaling={false}>
                {
                  props.subText2
                }
            </Text>
           </ColumnWrapper>
      </RowWrapper>
    )
}

const styles = StyleSheet.create({
   container : {
       borderWidth : 1.2,
       borderRadius : moderateScale(10),
       width : moderateScale(100),
       minHeight : moderateScale(60),
       borderColor : defaultTheme.lightGray,
       marginHorizontal : moderateScale(8)
   },
   text1 : {
       fontSize : moderateScale(22),
       color : defaultTheme.blue,
       textAlign : "center"
   },
   text2 : {
       fontSize : moderateScale(12),
       color : defaultTheme.gray,
       textAlign : "center"
   },
   seprator : {
       fontSize : moderateScale(20),
       marginHorizontal : moderateScale(3)
   }
})

export default memo(DoubleText)