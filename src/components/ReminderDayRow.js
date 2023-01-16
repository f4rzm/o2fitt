
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
import { dimensions } from '../constants/Dimensions';

const ReminderDayRow = props => {
    return(
        <TouchableOpacity
            style={styles.container}
            onPress={()=>props.onPress(props.day)}
        >
            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                {
                    props.day.name
                }
            </Text> 
            <View style={[
                styles.imgContainer , {
                backgroundColor : props.isSelected?defaultTheme.primaryColor:defaultTheme.lightGray
            }]}>
                <Image
                    source={require("../../res/img/tick.png")}
                    style={styles.img}
                    resizeMode="contain"
                /> 
            </View> 
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container : {
        justifyContent:"space-between",
        alignItems : "center",
    },
    text : {
        fontSize : moderateScale(13),
        color:defaultTheme.darkText
    },
    img : {
        width : moderateScale(10),
        height : moderateScale(10),
        tintColor : defaultTheme.lightText  
    },
    imgContainer : {
        width : moderateScale(17),
        height : moderateScale(17),
        borderRadius : moderateScale(12),
        marginTop : moderateScale(8),
        justifyContent : "center",
        alignItems : "center",
        tintColor : defaultTheme.lightText  
    }
})

export default memo(ReminderDayRow)