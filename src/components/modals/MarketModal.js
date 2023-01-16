import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView, Linking} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { ConfirmButton } from ".."

const MarketModal = props =>{

    if(props.item){
        return(
            <TouchableOpacity style={styles.mainContainer} onPress={props.onPress} activeOpacity={1}>
                <ScrollView>
                    <View style={styles.imgContainer}>
                    <Image
                        source={{uri : props.item.imageUri}}
                        style={styles.img}
                        resizeMode="contain"
                    />
                    </View>
                    <Text style={[styles.context , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.item.message
                        }
                    </Text>
                </ScrollView>
                <ConfirmButton
                    lang={props.lang}
                    onPress={props.onRequestClose}
                    style={styles.btn}
                    title={props.lang.ok}
                />
            </TouchableOpacity>
        )
    }else{
       return <></> 
    }
    
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH * 0.84 , 
        height : dimensions.WINDOW_HEIGTH * 0.75,
        borderRadius : moderateScale(16),
        backgroundColor : defaultTheme.lightBackground,
        justifyContent : "center",
        alignItems : "center",
        position:"absolute",
        alignSelf:"center",
        marginTop:dimensions.WINDOW_HEIGTH*0.125
    },
    imgContainer:{
        width : dimensions.WINDOW_WIDTH * 0.84 , 
        height : dimensions.WINDOW_HEIGTH * 0.4,
        borderRadius : moderateScale(16),
        overflow : "hidden",
        
    },
    img : {
        width : dimensions.WINDOW_WIDTH * 0.84 , 
        height : dimensions.WINDOW_HEIGTH * 0.4,
    },
    cross : {
        width : moderateScale(18),
        height : moderateScale(18),
        alignSelf : "flex-end",
        margin : moderateScale(18)
    },
    context : {
        width : dimensions.WINDOW_WIDTH * 0.75,
        minHeight : dimensions.WINDOW_HEIGTH * 0.07,
        alignSelf : "center",
        textAlign : "center",
        color : defaultTheme.darkText,
        fontSize : moderateScale(15),
        lineHeight : moderateScale(26)
    },
    btn : {
        width : moderateScale(130),
        backgroundColor : defaultTheme.green,
        marginBottom : moderateScale(16)
    }
})

export default MarketModal