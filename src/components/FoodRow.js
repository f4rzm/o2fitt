
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
import RowSpaceBetween from './layout/RowSpaceBetween';
import RowWrapper from './layout/RowWrapper';
import {allMeasureUnits} from "../utils/measureUnits"

const FoodRow = props => {
    const value = (!isNaN(parseFloat(props.item.value)) && parseFloat(props.item.value) > 0)?parseFloat(props.item.value):1    
    return(
        <TouchableOpacity style={styles.mainContainer}  onPress={()=>props.edit(props.item)} activeOpacity={1}>
            <RowWrapper style={{paddingHorizontal : 0}}>
                <TouchableOpacity style={{marginRight : moderateScale(16)}} onPress={()=>props.remove(props.item)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../../res/img/remove.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight : moderateScale(16)}} onPress={()=>props.edit(props.item)}>
                    <Image
                        style={styles.image2}
                        resizeMode="contain"
                        source={require("../../res/img/edit.png")}
                    />
                </TouchableOpacity>
                <View style={{justifyContent : "flex-start"}}>
                    <Text style={[styles.text3 , {fontFamily : props.lang.font}]} allowFontScaling={false} numberOfLines={2}>
                        {
                            props.item.foodName
                        }
                    </Text>                 
                    <Text style={[styles.text2 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.item.measureUnitName && value + " "  + props.item.measureUnitName
                        }
                    </Text>
                    
                </View>
            </RowWrapper>
            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                {
                   typeof(props.item.foodNutrientValue)==="string"?parseInt(props.item.foodNutrientValue.split(",")[23]) : parseInt(props.item.foodNutrientValue[23])
                }
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH * 0.94 - moderateScale(20),
        marginVertical : moderateScale(0),
        flexDirection : "row",
        justifyContent : "space-between",
        paddingEnd : moderateScale(12)
    },
    text : {
       fontSize : moderateScale(14),
       color : defaultTheme.darkText,
       paddingTop : moderateScale(8),
       
    },
    text3 : {
       width : dimensions.WINDOW_WIDTH * 0.5,
       fontSize : moderateScale(15),
       color : defaultTheme.darkText,
       textAlign : "left",
       lineHeight : moderateScale(20)
    },
    text2:{
        fontSize : moderateScale(13),
        color : defaultTheme.mainText,
        textAlign : "left"
    },
    image : {
        width : moderateScale(21),
        height : moderateScale(21),
    },
    image2 : {
        width : moderateScale(20),
        height : moderateScale(17),
        tintColor : defaultTheme.green
    }
    
})

export default memo(FoodRow)