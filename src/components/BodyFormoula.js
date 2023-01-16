
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';

const BodyFormoula = props => {
    return(
        <View style={styles.mainContainer}>
            <Text style={[styles.title2 , props.text1Style,{fontFamily : props.lang.font}]}>
                {props.title} =  
                <Text style={[styles.title2 , props.text1Style ,{fontFamily : props.lang.font , color : defaultTheme.primaryColor}]}>
                    {" "+props.value}
                </Text>
                {" "+props.unit}
            </Text>
            <Text style={[styles.text, props.text2Style ,{fontFamily : props.lang.font , marginLeft : 0}]}>
                {
                    props.desc
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        alignItems : "center",
        padding : moderateScale(10),
        borderColor : defaultTheme.border,
        borderRadius : moderateScale(10),
        borderWidth : 1.2,
        margin : moderateScale(8),
        width : dimensions.WINDOW_WIDTH * 0.44,
    },
    title2 : {
      fontSize : moderateScale(17),
      color:defaultTheme.darkText,
    },
    text : {
      fontSize : moderateScale(14),
      color:defaultTheme.darkText,
      marginLeft : moderateScale(16),
      lineHeight : moderateScale(22),
    },
    
})

export default memo(BodyFormoula)