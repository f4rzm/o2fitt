import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity, I18nManager} from "react-native"
import {CustomInput,ConfirmButton} from "../components"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";

const ReplyMessage = props =>{
    return(
        <View 
            style={[styles.mainContainer]}
        >
            <CustomInput
                lang={props.lang}
                style={styles.input}
                placeholder={props.lang.writhYourTextForSupport}
                multiline
                value={props.replyText}
                onChangeText={props.onChangeText}
            />
            <ConfirmButton
                lang={props.lang}
                title={props.lang.sendMsg}
                style={styles.send}
                onPress={props.onPress}
                isLoading={props.isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       padding : moderateScale(16),
       width : dimensions.WINDOW_WIDTH * 0.9,
       justifyContent : "center",
       alignItems : "center",
       margin : moderateScale(8),
       marginVertical : moderateScale(4),
       alignSelf : "center"
    },
    input:{
      width : dimensions.WINDOW_WIDTH * 0.85,
      borderWidth : 1,
      borderColor : defaultTheme.darkGray,
      borderRadius : moderateScale(12),
      minHeight : moderateScale(120),
      padding : moderateScale(10),
      alignItems : "flex-start"
    },
    send : {
        backgroundColor : defaultTheme.green,
        marginVertical : moderateScale(4),
    }

})

export default memo(ReplyMessage)