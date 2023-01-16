import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";

const HabitationRow = props =>{
     const lang=props.lang
    return(
        <TouchableOpacity
            onPress={()=>props.onPress(props.index)}
            activeOpacity={0.6}
        >
            <View style={[styles.mainContainer,{borderWidth : props.isSelected?1:0}]}>
                <View style={styles.container}>
                    <Image
                        source={props.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={[styles.title , props.textStyle , { fontFamily:lang.langName!=="english"?lang.font:lang.titleFont}]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       width : (dimensions.WINDOW_WIDTH * 0.6),
       borderColor : defaultTheme.green,
       borderRadius : 15,
       justifyContent : "center",
       alignItems : "flex-end",
       padding : moderateScale(6)
   },
   container :{
       width : (dimensions.WINDOW_WIDTH * 0.46),
       height : dimensions.WINDOW_WIDTH * 0.13,
       paddingStart : dimensions.WINDOW_WIDTH * 0.08,
       borderRadius : 8,
       backgroundColor : defaultTheme.grayBackground,
       justifyContent : "center",
       alignItems : "center"
   },
   image : {
       position : "absolute",
       top : 0,
       left:-dimensions.WINDOW_WIDTH * 0.13,
       width : dimensions.WINDOW_WIDTH * 0.25,
       height : dimensions.WINDOW_WIDTH * .15,
   },
   title:{
       fontSize : moderateScale(17),
       color:defaultTheme.mainText,
       textAlign : "center"
   }

})

export default memo(HabitationRow)