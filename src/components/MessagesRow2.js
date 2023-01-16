import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/AntDesign';
import { dimensions } from "../constants/Dimensions";
import momentJalaali from "moment-jalaali"
import moment from "moment"

const MessagesRow2 = props =>{
    let date = props.user.countryId === 128?
                momentJalaali((props.item.insertDate.split("T")[0]),"YYYY-MM-DD").format("jYYYY/jMM/jDD"):
                props.item.insertDate.split("T")[0]
    let day = moment("2020-11-22").day()
    return(
        <View style={[
                styles.mainContainer,
                {
                    backgroundColor : props.item.adminId === 0?defaultTheme.green:defaultTheme.darkGray,
                    alignSelf:props.item.adminId === 0?"flex-start":"flex-end"
                }
            ]}
        >
            <View style={styles.leftContainer}>
                <Text style={[styles.title , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.item.title
                    }
                </Text>
                <Text style={[styles.dateText , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                       props.days[day] + "  " + date + "  " + props.lang.hour + "  " +  (props.item.insertDate.split("T")[1]).slice(0,5)
                    }
                </Text>
                <Text style={[styles.context , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                        props.item.message
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       flexDirection : "row",
       padding : moderateScale(16),
       width : dimensions.WINDOW_WIDTH * 0.8,
       justifyContent : "center",
       margin : moderateScale(8),
       marginVertical : moderateScale(4),
       borderRadius : moderateScale(15),
       borderColor : defaultTheme.border,
       borderWidth : 1.2,
    },
    rightContainer : {
        width : moderateScale(70),
        justifyContent : "center",
        alignItems : "center"
    },
    leftContainer : {   
        flex : 1,
        alignItems : "flex-start"    
    },
    title : {
        fontSize : moderateScale(16),
        color : defaultTheme.lightText
    },
    dateText : {
        fontSize : moderateScale(14),
        color : defaultTheme.lightText
    },
    context : {
        marginTop : moderateScale(16),
        fontSize : moderateScale(14),
        color : defaultTheme.lightText
    }

})

export default memo(MessagesRow2)