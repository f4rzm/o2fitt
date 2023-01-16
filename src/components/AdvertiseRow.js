import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import {RowSpaceBetween , RowStart} from ".";
import RowWrapper from "./layout/RowWrapper";
import Icon from 'react-native-vector-icons/FontAwesome';

const AdvertiseRow = props =>{
    return(
        <TouchableOpacity style={styles.mainContainer} onPress={()=>props.onPress(props.item)} activeOpacity={0.8}>
            <RowSpaceBetween style={styles.rows}>
                <Text style={[styles.title , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    {
                        props.item.title
                    }
                </Text>
            </RowSpaceBetween>
            <RowSpaceBetween style={styles.rows}>
                <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.item.description
                    }
                </Text>
            </RowSpaceBetween>
            <Image
                source={{uri : props.item.bannerUri}}
                style={styles.img}
                resizeMode="cover"
            />
            
            <RowSpaceBetween style={styles.rows}>
                <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.item.shortDescription
                    }
                </Text>
            </RowSpaceBetween>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       paddingHorizontal : moderateScale(12),
       width : dimensions.WINDOW_WIDTH * 0.95,
       alignItems : "center",
       borderColor : defaultTheme.border,
       backgroundColor : defaultTheme.grayBackground,
       borderWidth : 1.2,
       marginVertical : (5),
       borderRadius : (10)
    },
    title : {
        fontSize : moderateScale(16),
        color : defaultTheme.lightGray2,
        marginTop : moderateScale(8)
    },
    text1:{
        fontSize : moderateScale(15),
        color : defaultTheme.lightGray2,
        lineHeight : moderateScale(24),
        marginVertical : moderateScale(16)
    },
    rows:{
        width : "100%",
        marginVertical : moderateScale(0)
    },
    img : {
        width : dimensions.WINDOW_WIDTH * 0.93,
        height : dimensions.WINDOW_WIDTH * 0.5,
    },

})

export default memo(AdvertiseRow)