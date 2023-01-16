
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

const CheckBox = props => {
    return(
        <TouchableOpacity
            style={styles.conntainer}
            onPress={props.onPress}
        >
                <View
                    style={[styles.tickContainer,{...props.tickContainer}]}
                >
                    {
                        props.isSelected &&
                        <Image
                            style={[styles.tick,{...props.tickStyle}]}
                            source={require("../../res/img/tick.png")}
                        />
                    }
                </View>
                <Text
                    allowFontScaling={false}
                    style={{fontFamily:props.lang.font,color:defaultTheme.mainText,fontSize:moderateScale(14),...props.textStyle}}
                >
                    {props.title}
                </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    conntainer : {
        flexDirection : "row",
        justifyContent:"flex-start",
        alignItems : "center"
    },
    tickContainer : {
        width : moderateScale(22),
        height : moderateScale(22),
        borderRadius:1,
        borderWidth : 1,
        marginHorizontal :10,
        borderColor : defaultTheme.primaryColor,
        justifyContent : "center",
        alignItems : "center"
    },
    tick:{
        width:moderateScale(15),
        height:moderateScale(15),
    }
})

export default memo(CheckBox)