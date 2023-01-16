
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
import DropDown from './DropDown';
import {RowSpaceBetween,RowWrapper,CustomInput} from '../components';

const EditIngredientRow = props => {

    const unitChanged=(item)=>{
        props.unitChanged(item , props.index)
    }

    console.log("ssss",props.item)
    return(
        <RowSpaceBetween style={styles.mainContainer}>
            <RowWrapper style={{paddingHorizontal : 0}}>
                <TouchableOpacity style={{marginRight : moderateScale(16)}} onPress={()=>props.remove(props.index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../../res/img/remove.png")}
                    />
                </TouchableOpacity>
                {
                    props.showEdit &&
                    <TouchableOpacity style={{marginRight : moderateScale(16)}} onPress={()=>props.edit(props.item)}>
                        <Image
                            style={styles.image2}
                            resizeMode="contain"
                            source={require("../../res/img/edit.png")}
                        />
                    </TouchableOpacity>
                }
                <Text style={[styles.text , {fontFamily : props.lang.font,color:defaultTheme.darkText}]} allowFontScaling={false} numberOfLines={2}>
                    {props.item.name[props.lang.langName]}
                </Text>
            </RowWrapper>
            <CustomInput
                lang={props.lang}
                style={styles.input}
                textStyle={{textAlign : "center" , fontSize : moderateScale(17),color:defaultTheme.mainText}}
                value={props.item.value.toString()}
                onChangeText={(text)=>props.valueCahanged(text,props.index)}
                keyboardType="decimal-pad"
                placeholder="0"
            />
           <DropDown
                lang={props.lang}
                data={props.item.measureUnitList}
                onItemPressed={unitChanged}
                selectedItem={props.item.measureUnitName}
                style={styles.dropDown1}
           />
        </RowSpaceBetween>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH,
        marginVertical : moderateScale(0),
        borderBottomWidth : StyleSheet.hairlineWidth,
        borderTopWidth : StyleSheet.hairlineWidth,
        paddingVertical:moderateScale(5)
    },
    text : {
       fontSize : moderateScale(13),
       color : defaultTheme.gray,
       width : dimensions.WINDOW_WIDTH * 0.25
    },
    input : {
        width : moderateScale(70),
        height : moderateScale(35),
        minHeight : moderateScale(30),
        borderWidth : 1.2,
        borderColor : defaultTheme.border,
        borderRadius : moderateScale(13),
        marginVertical : 0,
        borderWidth : 1,
        paddingStart : 0,
        paddingEnd : 0,
    },
    image : {
        width : moderateScale(21),
        height : moderateScale(21),
    },
    image2 : {
        width : moderateScale(20),
        height : moderateScale(17),
        tintColor : defaultTheme.green
    },
    dropDown1 : {
        width : moderateScale(100),
        marginStart : moderateScale(0)
    }
    
})

export default memo(EditIngredientRow)