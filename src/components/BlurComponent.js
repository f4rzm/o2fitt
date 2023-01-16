import React , {memo} from "react"
import {View , Text , Image , StyleSheet, ActivityIndicator , ScrollView, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { dimensions } from "../constants/Dimensions";
import { BlurView } from "@react-native-community/blur";
import { defaultTheme } from "../constants/theme";
import ConfirmButton from "./ConfirmButton";

const BlurComponent = props =>{
  
    const [minHeight,setMinHeight] = React.useState(0)
    return(
        <View
            style={[styles.mainContainer , {minHeight : minHeight}]}
        >
            {/* {
                props.children
            } */}
            {/* <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={4}
                reducedTransparencyFallbackColor="white"
            /> */}
        
            <View style={styles.container} onLayout={e=>setMinHeight((e.nativeEvent.layout.height + moderateScale(30)))}>
                
                <Image
                    source={require("../../res/img/lock.png")}
                    style={styles.lock}
                    resizeMode="contain"
                />
                <View style={styles.dialog}>
                    <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                        {
                            props.message
                        }
                    </Text>
                    <ConfirmButton
                        lang={props.lang}
                        style={styles.button}
                        title={props.lang.iBuy}
                        textStyle={{color : defaultTheme.darkText}}
                        onPress={props.buyPressed}
                        rightImage={require("../../res/img/next.png")}
                        imageStyle={{tintColor : defaultTheme.darkText}}
                        rotate
                    />
                </View>
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH,
        overflow:"hidden"
    },
    container : {
        position : "absolute",
        left : 0,
        width : dimensions.WINDOW_WIDTH,
        overflow:"hidden",
        alignItems : "center"
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    text : {
        fontSize : moderateScale(17),
        lineHeight : moderateScale(25),
        color : defaultTheme.lightText,
        marginBottom : moderateScale(15),
        textAlign : "center"
    },
    dialog : {
        marginTop : moderateScale(25),
        width : dimensions.WINDOW_WIDTH * 0.9,
        padding : moderateScale(16),
        alignItems : "center",
        justifyContent : "center",
        borderRadius : moderateScale(20),
        backgroundColor : defaultTheme.blue
    },
    button : {
        width : moderateScale(110),
        height : moderateScale(35),
        backgroundColor : defaultTheme.grayBackground
    },
    lock : {
        width : dimensions.WINDOW_WIDTH * 0.2,
        height : dimensions.WINDOW_WIDTH * 0.2,
        margin : moderateScale(30)
    }

})

export default memo(BlurComponent)