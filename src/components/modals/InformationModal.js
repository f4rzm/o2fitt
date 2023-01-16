import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import RowSpaceAround from "../layout/RowSpaceAround"

const Information = props =>{
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
                    <Text style={[styles.context,{...props.textStyle , fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.context}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            {
                props.showMainButton !== false && 
                <TouchableOpacity style={styles.button} onPress={props.onRequestClose}>
                    <Text style={[styles.text2,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.lang.ok
                        }
                    </Text>
                </TouchableOpacity>
            }
            <View style={styles.buttonContainer}>
                {
                    props.button1&&
                    <TouchableOpacity style={[styles.btn1,props.button1Style]} onPress={props.button1Pressed}>
                        <Text style={[styles.text3,{fontFamily : props.lang.font},props.button1TextStyle]} allowFontScaling={false}>
                            {props.button1}
                        </Text>
                    </TouchableOpacity>
                }
                {
                    props.button2&&
                    <TouchableOpacity style={[styles.btn2,props.button2Style]}  onPress={props.button2Pressed}>
                        <Text style={[styles.text3,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                            {props.button2}
                        </Text>
                    </TouchableOpacity>
                }
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
        margin : moderateScale(18),
    },
    context : {
        width : dimensions.WINDOW_WIDTH * 0.8,
        minHeight : dimensions.WINDOW_HEIGTH * 0.07,
        alignSelf : "center",
        textAlign : "center",
        color : defaultTheme.darkText,
        fontSize : moderateScale(15),
        lineHeight : moderateScale(24)
    },
    button : {
        width : moderateScale(150),
        height : moderateScale(37),
        backgroundColor : defaultTheme.primaryColor,
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
    }, 
    text3 : {
        fontSize : moderateScale(14),
        color : defaultTheme.lightText,
        top : moderateScale(-2)
    },
    btn1 : {
        width : moderateScale(80),
        height : moderateScale(35),
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.primaryColor,
        justifyContent  :"center",
        alignItems : "center",
        marginVertical : moderateScale(16)
    },
    btn2 : {
        width : moderateScale(80),
        height : moderateScale(35),
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.primaryColor,
        justifyContent  :"center",
        alignItems : "center",
        marginVertical : moderateScale(16)
    }
})

export default withModal(Information)