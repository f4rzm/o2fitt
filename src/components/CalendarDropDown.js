
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import moment from "moment-jalaali"

const CalendarDropDown = props => {
    
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={[styles.dateContainer , props.style]}>
                <Text style={[styles.dateText,props.dateStyle,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.user.countryId === 128?
                        props.selectedDate === "2021-03-22"?
                        "1400/01/02":
                        (moment(props.selectedDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD').split("T"))[0]:(props.selectedDate.split("T"))[0]
                    }
                </Text>
                <Icon
                    name="caret-down"
                    size={moderateScale(18)}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    dateContainer : {
      flexDirection : "row",
      width : moderateScale(130),
      height : moderateScale(38),
      marginHorizontal : moderateScale(5),
      justifyContent : "space-between",
      alignItems : "center",
      borderRadius : moderateScale(10),
      paddingEnd : moderateScale(8),
    },
    dateText : {
      width : moderateScale(110),
      fontSize : moderateScale(15),
      textAlign : "center"
    },
})

export default memo(CalendarDropDown)