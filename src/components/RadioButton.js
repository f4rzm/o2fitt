
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
import ColumnWrapper from './layout/ColumnWrapper';

const RadioButton = props => {
    return(
        <TouchableOpacity
            style={styles.conntainer}
            onPress={props.onPress}
        >
                <View
                    style={[styles.tickContainer,props.style]}
                >
                    <View
                        style={[styles.indicator,{backgroundColor : props.isSelected?defaultTheme.primaryColor:defaultTheme.lightBackground }]}
                    />
                </View>
                <ColumnWrapper style={{alignItems : "flex-start"}}>
                <Text style={[styles.text,props.textStyle , {fontFamily : props.lang.font,color:defaultTheme.darkText} , props.textStyle]} allowFontScaling={false}>
                    {props.title.includes("*")?props.title.split("*")[0]:props.title}
                   
                </Text>
                {
                    props.title.includes("*")&&
                    <Text style={[styles.text2,props.textStyle2 , {fontFamily : props.lang.font} , props.textStyle]} allowFontScaling={false}>
                        {
                            props.title.split("*")[1]
                        }
                    </Text>
                }
                </ColumnWrapper>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    conntainer : {
        flexDirection : "row",
        justifyContent:"flex-start",
        alignItems : "center",
        marginVertical : moderateScale(8)
    },
    tickContainer : {
        width : moderateScale(18),
        height : moderateScale(18),
        borderRadius:moderateScale(10),
        borderWidth : 1,
        marginHorizontal : moderateScale(10),
        borderColor : defaultTheme.primaryColor,
        justifyContent : "center",
        alignItems : "center"
    },
    indicator:{
        width:moderateScale(13),
        height:moderateScale(13),
        borderRadius : moderateScale(8),
    },
    text : {
        fontSize : moderateScale(15),
        color : defaultTheme.gray,
    },
    text2 : {
        fontSize : moderateScale(11),
        color : defaultTheme.gray,
        marginTop : moderateScale(5)
    }
})

export default memo(RadioButton)