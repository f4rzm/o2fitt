import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";

const NoteRow = props =>{

    return(
        <View style={styles.mainContainer}>
            <TouchableOpacity
                hitSlop={{
                    top:moderateScale(15),
                    bottom : moderateScale(15),
                    left : moderateScale(15),
                    right : moderateScale(15)
                }}
                onPress={()=>props.deleteNote(props.item)}
            >
                <Image
                    source={require("../../res/img/remove.png")}
                    style={styles.remove}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                {
                    props.item.context
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       flexDirection : "row",
       padding : moderateScale(12),
       width : dimensions.WINDOW_WIDTH,
       justifyContent : "flex-start",
       alignItems : "center",
       borderBottomColor : defaultTheme.border,
       borderBottomWidth : 1.2
    },
    leftContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
    },
    text : {
        fontSize : moderateScale(14),
        color : defaultTheme.gray,
        textAlign : "auto",
        lineHeight : moderateScale(23),
        marginHorizontal : moderateScale(20)
    },
    remove : {
        width : moderateScale(25),
        height : moderateScale(25)
    }

})

export default memo(NoteRow)