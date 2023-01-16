import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import RowSpaceBetween from "./layout/RowSpaceBetween";
import RowWrapper from "./layout/RowWrapper";
import RowStart from "./layout/RowStart";
import ActivityRow from "./ActivityRow";

const DailyActivityContainer = props =>{
    let calorie = 0
    props.data.map(item=>calorie+=parseFloat(item.burnedCalories))
    return(
        <View style={styles.mainContainer}>
            <RowSpaceBetween style={styles.header}>
                <RowWrapper style={{marginVertical : 0}}>
                    <Image
                        source={props.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={[styles.title , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </RowWrapper>
                <Text style={[styles.title , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                       parseInt(calorie) + " "+ props.lang.calories
                    }
                </Text>
            </RowSpaceBetween>
            <View style={styles.body}>
                {
                    props.data.reverse().map((item , index)=>{
                        return(
                            <ActivityRow
                                lang={props.lang}
                                item={item}
                                key={index.toString()}
                                onEdit={props.onEdit}
                                onDelete={props.onDelete}
                            />
                        )
                    })
                }
                <RowStart style={{marginVertical : moderateScale(10)}}>            
                    <TouchableOpacity style={styles.addContainer} onPress={props.addPressed}>
                        <Image
                            source={require("../../res/img/add.png")}
                            style={styles.plus}
                            resizeMode="contain"
                        />
                        <Text style={[styles.add , {fontFamily : props.lang.titleFont,fontSize: props.lang.langName === "persian" ? moderateScale(15) : moderateScale(15)}]} allowFontScaling={false}>
                            {
                                props.lang.add
                            }
                        </Text>
                    </TouchableOpacity>
                </RowStart>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       width : "95%",
       justifyContent : "flex-end",
       alignItems : "center",
       marginTop : moderateScale(12)
    },
    header : {
        width : dimensions.WINDOW_WIDTH * 0.95,
        borderRadius : moderateScale(10),
        backgroundColor : defaultTheme.lightGrayBackground,
        marginVertical : 0,
        paddingVertical : moderateScale(5),
        paddingEnd : moderateScale(12),
        borderWidth : 1.2
    },
    image : {
        width : moderateScale(30),
        height : moderateScale(22),
    },
    title : {
        marginStart : moderateScale(8),
        fontSize : moderateScale(16),
        color : defaultTheme.mainText
    },
    body : {
        width : (dimensions.WINDOW_WIDTH * 0.95 )- moderateScale(4),
        borderColor : defaultTheme.lightGray,
        borderWidth :0.7,
        borderTopWidth : 0,
        borderBottomRightRadius : moderateScale(10),
        borderBottomLeftRadius : moderateScale(10),
        padding : moderateScale(10),
        transform : [
            {
                translateY : -moderateScale(3.5)
            }
        ]
    },
    addContainer : {
        flexDirection : "row" , 
        alignItems : "center" , 
    },
    seprator : {
        width : 1.5,
        height : moderateScale(33),
        backgroundColor : defaultTheme.lightGray,
        marginHorizontal : moderateScale(16)
    },
    add : {
        fontSize : moderateScale(17),
        color : defaultTheme.mainText,
        marginStart : moderateScale(3)
    },
    plus : {
        width : moderateScale(22),
        height : moderateScale(22)
    },
    barcode : {
        width : moderateScale(35),
        height : moderateScale(30)
    }

})

export default memo(DailyActivityContainer)