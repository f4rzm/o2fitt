import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView, I18nManager} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import {RowStart , RowSpaceBetween} from "../components";

const WorkoutRow = props =>{
    //  console.log(props)
    const [showDefautImage , setshowDefautImage] = React.useState(false)
    return(
        <TouchableOpacity
            onPress={()=>props.onPress()}
            activeOpacity={0.6}
        >
            <RowSpaceBetween style={styles.mainContainer}>
                <RowStart style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={showDefautImage?require("../../res/img/noimage.jpg"):props.logo}
                            resizeMode="contain"
                            onError={(e)=>{setshowDefautImage(true)}}
                        />
                    </View>
                    <View style={styles.column}>
                        <Text style={[styles.title , {fontFamily : props.lang.font}]}>
                            {
                                props.title
                            }
                        </Text>
                        {
                            props.text1 &&
                            <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                                {
                                    props.text1  
                                }
                            </Text>
                        }
                        {
                            props.text2 &&
                            <Text style={[styles.text , {fontFamily : props.lang.font}]}>
                                {
                                    props.text2
                                }
                            </Text>
                        }

                    </View>
                </RowStart>
                {
                    props.showArrow &&
                    <Image
                        source={require("../../res/img/back_arrow.png")}
                        style={styles.arrow}
                        resizeMode="contain"
                    />
                }
            </RowSpaceBetween>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
       padding : moderateScale(6),
       marginVertical : 0,
       borderBottomWidth : 1.2,
   },
   logoContainer : {
    borderRadius : moderateScale(10),
    overflow:"hidden",
   },
   logo:{
        width : moderateScale(100),
        height : moderateScale(100),    
   },   
   container : {
        width : null,
        flex : 1,
        marginHorizontal : 0
   },
   column : {
    height : moderateScale(95),
    marginHorizontal : moderateScale(16),
   },
   title:{
       fontSize : moderateScale(15),
       color:defaultTheme.darkText,
       textAlign : "left",
       marginBottom : moderateScale(11),
   },
   text:{
       fontSize : moderateScale(13),
       color:defaultTheme.gray,
       textAlign : "left",
       marginBottom : moderateScale(3),
   },
   arrow : {
       width : moderateScale(15),
       height : moderateScale(15),
       marginHorizontal : moderateScale(12),
       tintColor : defaultTheme.gray,
       transform : [{scale : I18nManager.isRTL?1:-1}]
   }

})

export default memo(WorkoutRow)