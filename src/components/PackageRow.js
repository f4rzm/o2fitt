
import { lang } from 'moment';
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
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';

const PackageRow = props => {
    const currency ={
        0 : props.lang.euro,
        1 : props.lang.toman
    }

    return(
       <TouchableOpacity style={styles.mainContainer} onPress={props.onPress}>
           <View style={styles.sub1}>
                <View style={styles.rbtContainer}>
                    <View
                        style={[
                            styles.rbt,
                            {
                                backgroundColor:props.isSelected?defaultTheme.primaryColor:defaultTheme.lightBackground
                            }
                        ]}
                    />
                </View>
           </View>
           <View style={styles.sub2}>
                <Text style={[
                        styles.text1 ,
                        {
                            color:props.isSelected?defaultTheme.green:defaultTheme.darkText,
                            fontFamily : props.lang.font
                        }
                    ]}
                    allowFontScaling={false}
                >
                    {
                        props.item.name + " - " +( (props.item.discountPercent && props.item.discountPercent > 0)?props.item.price - (props.item.price * props.item.discountPercent / 100):props.item.price) + " " + currency[props.item.currency]
                    }
                </Text>
                <Text style={[
                        styles.text2 ,
                        {
                            fontFamily : props.lang.font
                        }
                    ]}
                    allowFontScaling={false}
                >
                    {
                        (props.item.discountPercent && props.item.discountPercent > 0) ? 
                        <Text
                            style={[
                                styles.text2 ,
                                {
                                    fontFamily : props.lang.font,
                                    textDecorationLine : "line-through"
                                }
                            ]}
                        >
                            {
                                props.item.price +  " " + currency[props.item.currency]
                            }
                        </Text>:""
                    }
                    {
                        "  "+props.item.description
                    }
                </Text>
           </View>
       </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flexDirection : "row",
        justifyContent : "flex-start",
        width : dimensions.WINDOW_WIDTH * 0.94 - moderateScale(20),
        marginVertical : moderateScale(8)
    },
    sub1:{
        justifyContent : "flex-start",
        marginEnd : moderateScale(16)
    },
    sub2:{
        alignItems : "flex-start"
    },
    rbtContainer:{
        width : moderateScale(25),
        height : moderateScale(25),
        borderWidth : 1.2,
        borderColor : defaultTheme.lightGray,
        borderRadius : moderateScale(15),
        marginTop : moderateScale(7),
        justifyContent : "center",
        alignItems : "center"
    },
    rbt:{
        width : moderateScale(15),
        height : moderateScale(15),
        borderRadius : moderateScale(10),
    },
    text1 : {
       fontSize : moderateScale(20),
       color : defaultTheme.gray
    },
    text2 : {
       fontSize : moderateScale(14),
       color : defaultTheme.gray
    },
    
})

export default memo(PackageRow)