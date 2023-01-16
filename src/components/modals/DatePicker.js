import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView, Platform} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { BlurView } from "@react-native-community/blur";
import ModernDatePicker,{getFormatedDate} from 'react-native-modern-datepicker';
import { ConfirmButton } from "../../components"
import moment from "moment-jalaali"

const DatePicker = props =>{
    const [selectedDate, setSelectedDate] = React.useState('');

    const onConfirm = ()=>{
        
        if(props.user.countryId === 128){
            selectedDate === "1400/01/02"?
            props.onDateSelected("2021-03-22"):
            props.onDateSelected(moment(selectedDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'))
        }
        else{
            props.onDateSelected(moment(selectedDate, 'YYYY/MM/DD').format('YYYY-MM-DD'))
        }
    }

    // React.useEffect(()=>{
    //     alert(props.selectedDate+" "+moment().format('jYYYY/jMM/jDD'))
    // },[])
    
    return(
        <TouchableOpacity 
            style={styles.mainContainer}
            onPress={props.onRequestClose}
            activeOpacity={1}
        >
            <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={4}
                reducedTransparencyFallbackColor="white"
            />
            <ModernDatePicker
                isGregorian={props.user.countryId != 128}
                onSelectedChange={date => {setSelectedDate(date)}}
                options={{
                    defaultFont: props.lang.font,
                    headerFont: props.lang.font,
                }}
                mode="calendar"
                current={props.current?props.user.countryId === 128?props.selectedDate === "2022-03-22"?"1401/01/02":moment(props.current, 'YYYY-MM-DD').format('jYYYY/jMM/jDD'):props.current:null}
                selected={props.user.countryId === 128?props.selectedDate === "2022-03-22"?"1401/01/02":moment(props.selectedDate, 'YYYY-MM-DD').format('jYYYY/jMM/jDD'):props.selectedDate}
                maximumDate={props.user.countryId === 128?moment().add(3,"days").format("jYYYY-jMM-jDD"):moment().add(3,"days").format('YYYY-MM-DD')}
                
            />
            <View style={styles.buttonContainer}>
                <ConfirmButton
                    lang={props.lang}
                    style={styles.button}
                    onPress={onConfirm}
                    title={props.lang.saved}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        flexDirection : "column",
        width : dimensions.WINDOW_WIDTH , 
        minHeight : dimensions.WINDOW_HEIGTH ,
        alignItems : "center",
        justifyContent : "center"
    },
    container : {
        paddingTop : "10%",
        flex : 1,
        width : dimensions.WINDOW_WIDTH , 
        alignItems : "center",
        justifyContent : "center"
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
        alignItems : "center"
    },
    button : {
        width : dimensions.WINDOW_WIDTH * 0.35,
        height : moderateScale(38),
        borderRadius : moderateScale(8),
        backgroundColor : defaultTheme.green,
    },
    text : {
        color : defaultTheme.gray,
        fontSize : moderateScale(15)
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

export default withModal(DatePicker)