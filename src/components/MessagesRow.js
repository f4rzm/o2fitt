import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/AntDesign';
import { dimensions } from "../constants/Dimensions";
import momentJalaali from "moment-jalaali"
import moment from "moment"
import {RowWrapper} from "../components"

const hitSlop = {
    top : moderateScale(20),
    bottom : moderateScale(20),
    left : moderateScale(20),
    right : moderateScale(20)
}
const MessagesRow = props =>{
    let date = props.user.countryId === 128?
                momentJalaali((props.item.insertDate.split("T")[0]),"YYYY-MM-DD").format("jYYYY/jMM/jDD"):
                props.item.insertDate.split("T")[0]
    let day = moment("2020-11-22").day()
    console.log(day)
    return(
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.item.canReply?props.onPress:()=>false}>
            <View style={styles.leftContainer}>
                <RowWrapper>
                    {
                         props.item.hasUnread &&
                         <View
                             style={{
                                 width : moderateScale(12),
                                 height : moderateScale(12),
                                 borderRadius : moderateScale(10),
                                 marginRight : moderateScale(8),
                                 backgroundColor : defaultTheme.error
                             }}
                         />
                    }
                    <Text style={[styles.title , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.item.title
                        }
                    </Text>
                </RowWrapper>
                <Text style={[styles.title , {fontFamily : props.lang.font}]} allowFontScaling={false}>
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
            <View style={styles.rightContainer}>
                {
                    props.item.canReply &&
                    <TouchableOpacity onPress={props.onPress} hitSlop={hitSlop}>
                        <Icon
                            name="arrowright"
                            style={{
                                transform : [{scale : I18nManager.isRTL?-1:1}],
                                fontSize : moderateScale(20)
                            }}
                        />
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       flexDirection : "row",
       padding : moderateScale(16),
       width : dimensions.WINDOW_WIDTH,
       justifyContent : "center",
       borderBottomColor : defaultTheme.border,
       borderBottomWidth : 1.2,
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
        fontSize : moderateScale(14),
        color : defaultTheme.gray
    },
    context : {
        marginTop : moderateScale(16),
        fontSize : moderateScale(14),
        color : defaultTheme.gray
    }

})

export default memo(MessagesRow)