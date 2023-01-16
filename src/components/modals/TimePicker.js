import React,{useEffect} from "react"
import {View , Text , StyleSheet ,Animated , I18nManager} from "react-native"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { ConfirmButton } from "../../components"
import { Picker, DatePicker } from 'react-native-wheel-pick';
import ColumnCenter from "../layout/ColumnCenter"

const TimePicker = props =>{
    const hour = React.useRef( (new Array(24).fill(1)).map((item,index)=>index.toString())).current
    const min = React.useRef( (new Array(60).fill(1)).map((item,index)=>index.toString())).current
   
    const [selectedHour , updateSelectedHour] = React.useState(!isNaN(parseInt(props.hour))?parseInt(props.hour)<24?props.hour.toString():"0":"0")
    const [selectedMin , updateSelectedMin] = React.useState(!isNaN(parseInt(props.min))?parseInt(props.min)<60?props.min.toString():"0":"0")

    useEffect(() => {
      props.onTimeConfirm(selectedHour,selectedMin)
    }, [selectedHour,selectedMin]);
    
    const onConfirm = ()=>{
       props.close()
       props.onTimeConfirm(selectedHour,selectedMin)
    }
    console.log("burnedCalori",props.burnedCalori)
    return(
        <View 
            style={[styles.mainContainer]}
            activeOpacity={1}
        >
            <View 
                style={styles.container}
            >
               <Picker
                    style={{backgroundColor: defaultTheme.transparent, width: dimensions.WINDOW_WIDTH * 0.22 }}
                    selectedValue={selectedHour}
                    pickerData={hour}
                    onValueChange={value => updateSelectedHour(value)}
                    itemSpace={30} 
                    
                />
                <View style={{marginHorizontal : moderateScale(0)}}>
                    <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.lang.hour}
                    </Text>
                </View>
                <Picker
                    style={{ backgroundColor: defaultTheme.transparent,width: dimensions.WINDOW_WIDTH * 0.3}}
                    selectedValue={selectedMin}
                    pickerData={min}
                    onValueChange={value => updateSelectedMin(value)}
                    itemSpace={30} 
                    itemStyle={{width:moderateScale(100)}}
                />
                <View style={{marginHorizontal : moderateScale(0)}}>
                    <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                         {props.lang.min}
                    </Text>
                </View>
            </View>
            {/* {
                (props.burnedCalori != null) &&
                <ColumnCenter>
                    <Text style={[styles.text2 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {parseInt((((parseInt(selectedHour) * 60) + parseInt(selectedMin)) * parseFloat(props.burnedCalori)).toFixed(0)).toString()}
                    </Text>
                    <Text style={[styles.text3 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.lang.burnColories
                        }
                    </Text>
                </ColumnCenter>
            } 
           <View style={styles.buttonContainer}>
                <ConfirmButton
                    lang={props.lang}
                    style={styles.button}
                    onPress={onConfirm}
                    title={props.lang.saved}
                />
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        top:0,
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        height : dimensions.WINDOW_HEIGTH*0.15,

        alignItems : "center",
        justifyContent : "space-evenly",
        zIndex : 1
    },
    container : {
        flexDirection :I18nManager.isRTL? "row-reverse":"row",
        width : dimensions.WINDOW_WIDTH , 
        alignItems : "center",
        justifyContent : "center"
    },
    backDraw:{
        flexGrow : 1,
        width : "100%",
        height : 200,
        backgroundColor : defaultTheme.dialogBackground
    },
    row : {
        flexDirection : "row",
        width : dimensions.WINDOW_WIDTH ,
        justifyContent : "space-evenly",
        paddingVertical : moderateScale(16)
    },
    buttonContainer : {
        width : "100%",
        padding : moderateScale(16),
        backgroundColor : defaultTheme.lightBackground,
        justifyContent : "center",
        alignItems : "center",
        marginTop : moderateScale(35)
    },
    button : {
        width : dimensions.WINDOW_WIDTH * 0.5,
        height : moderateScale(38),
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.green,
    },
    text : {
        color : defaultTheme.gray,
        fontSize : moderateScale(18)
    },
    plus : {
        marginBottom : 0
    },

    text2 : {
        width : "100%",
        fontSize: moderateScale(30),
        color : defaultTheme.error,
        textAlign : "center"
    },
    text3 : {
        width : "100%",
        fontSize: moderateScale(18),
        color : defaultTheme.gray,
        textAlign : "center"
    },
})

export default (TimePicker)