
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

const BodyHelpRow = props => {
    return(
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.circle}>
                    <Text style={[styles.text2 , {fontFamily : props.lang.font , color : defaultTheme.lightBackground}]} allowFontScaling={false}>
                        {
                            props.number
                        }
                    </Text>
                </View>
                <Text style={[styles.text2 , {fontFamily : props.lang.font , margin : moderateScale(3),textAlign:"left"}]} allowFontScaling={false}>
                    {
                        props.title
                    }
                </Text>
            </View>
            <Text style={[styles.text2 , {fontFamily : props.lang.font , margin : moderateScale(3),textAlign:"left"}]} allowFontScaling={false}>
                {
                    props.desc
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH * 0.45,
        margin : moderateScale(6),
        marginLeft : moderateScale(10),
    },
    container : {
        width : "100%",
        flexDirection : "row",
        justifyContent : "flex-start",
        alignItems : "center",
        marginTop : moderateScale(2)
    },
    text1 : {
        fontSize : moderateScale(15),
        color : defaultTheme.gray
    },
    text2 : {
        fontSize : moderateScale(14),
        color:defaultTheme.gray
    },
    circle : {
        width : moderateScale(20),
        height : moderateScale(20),
        borderRadius : moderateScale(11),
        backgroundColor : defaultTheme.primaryColor,
        alignItems : "center",
        justifyContent : "center",
        margin : moderateScale(3)
    }
    
})

export default memo(BodyHelpRow)