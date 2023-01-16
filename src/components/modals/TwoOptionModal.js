import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import RowSpaceAround from "../layout/RowSpaceAround"

const TwoOptionModal = props =>{
    return(
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={props.onRequestClose}>
                <Image
                    source={require("../../../res/img/cross.png")}    
                    style={styles.cross}        
                />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={1}>
                    <Text style={[styles.context,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.context}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
                
                <TouchableOpacity style={styles.btn1} onPress={props.button1Pressed}>
                    <Text style={[styles.btn1Text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.button1}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn2}  onPress={props.button2Pressed}>
                    <Text style={[styles.btn2Text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.button2}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH * 0.88 , 
        maxHeight : dimensions.WINDOW_HEIGTH * 0.95,
        borderRadius : moderateScale(10),
        backgroundColor : defaultTheme.lightBackground,
        borderWidth:0.5,
        borderColor:defaultTheme.green2
    },
    cross : {
        width : moderateScale(18),
        height : moderateScale(18),
        alignSelf : "flex-end",
        margin : moderateScale(18)
    },
    context : {
        width : dimensions.WINDOW_WIDTH * 0.8,
        minHeight : dimensions.WINDOW_HEIGTH * 0.07,
        alignSelf : "center",
        textAlign : "center",
        color : defaultTheme.darkText,
        fontSize : moderateScale(16),
        lineHeight : 25
    },
    button : {
        width : moderateScale(150),
        height : moderateScale(37),
        backgroundColor : defaultTheme.green,
        justifyContent : "center",
        alignItems : "center",
        alignSelf : "center" ,
        marginTop : moderateScale(20),
        borderRadius : moderateScale(8)
    },
    buttonContainer : {
        width : "100%",
        flexDirection : "row",
        justifyContent : "space-around",
        alignItems : "center",
        marginVertical : moderateScale(8)
    },
    text : {
        fontSize : moderateScale(16),
        color : defaultTheme.darkText,
        margin : moderateScale(10)
    },    
    text2 : {
        fontSize : moderateScale(16),
        color : defaultTheme.lightText,
        margin : moderateScale(10)
    },  
    btn1Text : {
        fontSize : moderateScale(14),
        color : defaultTheme.lightText,
        // margin : Platform.OS === "ios" ? moderateScale(5) : moderateScale(5)
        margin:moderateScale(5)

    },
    btn2Text : {
        fontSize : moderateScale(14),
        color : defaultTheme.darkText,
        // margin :Platform.OS === "ios" ? moderateScale(5) :  moderateScale(5)
        margin:moderateScale(5)
    },
    btn1 : {
        width : moderateScale(110),
        height : moderateScale(45),
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.green,
        justifyContent  :"center",
        alignItems : "center",
        marginVertical :  moderateScale(16)
    },
    btn2 : {
        width : moderateScale(110),
        height : moderateScale(45),
        borderRadius : moderateScale(8),
        justifyContent  :"center",
        alignItems : "center",
        marginVertical : moderateScale(16),
        borderWidth : 1.1,
        borderColor : defaultTheme.green
    }
})

export default withModal(TwoOptionModal)