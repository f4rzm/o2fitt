import React from "react"
import {View , Text , StyleSheet ,Animated , TouchableOpacity} from "react-native"
import { dimensions } from "../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { ConfirmButton } from "../components"
import { Picker, DatePicker } from 'react-native-wheel-pick';

const WeightPicker = props =>{
    const Kg = React.useRef( (new Array(250).fill(1)).map((item,index)=>(index + 30).toString())).current
    const Gr = React.useRef( (new Array(19).fill(1)).map((item,index)=>(index * 50).toString())).current
   
    let selectedKg = React.useRef(!isNaN(parseInt(props.Kg))?parseInt(props.Kg)<24?props.Kg:"0":"0").current
    let selectedGr = React.useRef(!isNaN(parseInt(props.Gr))?parseInt(props.Gr)<60?props.Gr:"0":"0").current

    const onConfirm = ()=>{
       props.close()
       props.onTimeConfirm(selectedKg,selectedGr)
    }
        
    return(
        <Animated.View 
            style={[styles.mainContainer,{transform:[{translateY : props.ty}]}]}
            activeOpacity={1}
        >
            <View 
                style={styles.container}
            >
               <Picker
                    style={{ bacKgroundColor: 'white', width: dimensions.WINDOW_WIDTH * 0.22, height: moderateScale(210) }}
                    selectedValue={selectedKg}
                    pickerData={Kg}
                    onValueChange={value => selectedKg=value}
                    itemSpace={30} // this only support in android
                />
                <View style={{marginHorizontal : moderateScale(16)}}>
                    <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {props.lang.Kg}
                    </Text>
                </View>
                <Picker
                    style={{ bacKgroundColor: 'white', width: dimensions.WINDOW_WIDTH * 0.22, height: moderateScale(210) }}
                    selectedValue={selectedGr}
                    pickerData={Gr}
                    onValueChange={value => selectedGr=value}
                    itemSpace={30} // this only support in android
                />
                <View style={{marginHorizontal : moderateScale(16)}}>
                    <Text style={[styles.text,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                         {props.lang.Gr}
                    </Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <ConfirmButton
                    lang={props.lang}
                    style={styles.button}
                    onPress={onConfirm}
                    title={props.lang.saved}
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        ...StyleSheet.absoluteFill,
        top:0,
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        height : dimensions.WINDOW_HEIGTH,
        backgroundColor : defaultTheme.lightBacKground,
        alignItems : "center",
        justifyContent : "space-evenly",
    },
    container : {
        flexDirection : "row-reverse",
        width : dimensions.WINDOW_WIDTH , 
        alignItems : "center",
        justifyContent : "center"
    },
    backDraw:{
        flexGrow : 1,
        width : "100%",
        height : 200,
        backgroundColor : defaultTheme.dialogBacKground
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
        backgroundColor : defaultTheme.lightBacKground,
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
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})

export default (WeightPicker)