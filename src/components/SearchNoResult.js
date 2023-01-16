import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import RowStart from "./layout/RowStart";
import LottieView from 'lottie-react-native';
import { dimensions } from "../constants/Dimensions";

const SearchNoResult = props =>{
     
    return(
        <View style={styles.mainContainer}>
            <LottieView 
                style={{
                    width : dimensions.WINDOW_WIDTH * 0.9,
                    height : dimensions.WINDOW_WIDTH * 0.6
                }}
                source={require('../../res/animations/noresulat.json')} 
                autoPlay 
                loop={true}
            />
            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                {
                    props.lang.noFindItemInNewSearch
                }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       alignItems : "center"
   },
    text : {
        textAlign : "center",
        fontSize : moderateScale(16),
        lineHeight:moderateScale(25)
    }

})

export default memo(SearchNoResult)