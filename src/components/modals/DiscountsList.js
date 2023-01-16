import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import {withModal} from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"

const DiscountsList = props =>{
    return(
       <View style={styles.mainContainer}>
            <ScrollView>
                {
                    props.discountsList && props.discountsList.map((item,index)=>(
                        <TouchableOpacity 
                            key={item.id.toString()}
                            style={[styles.rowContainer , {borderBottomWidth : (index === props.discountsList.length - 1)?0:1}]}
                            onPress={()=>props.onDiscountSelected(item)}
                        >
                            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                                {
                                    item.translation[props.lang["langName"]] + "  "
                                }
                            </Text>
                            <Text style={[styles.text , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                                {
                                    item.percent + " % " + props.lang.discount
                                }
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
       </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : dimensions.WINDOW_WIDTH * 0.88 , 
        borderRadius : moderateScale(10),
        backgroundColor : defaultTheme.lightBackground,
        borderWidth:0.5,
        borderColor:defaultTheme.green2
    },
    rowContainer : {
        flexDirection : "row",
        width: "100%",
        justifyContent : "center",
        paddingVertical : moderateScale(10),
        borderBottomWidth : 1,
        borderColor  :defaultTheme.border
    },
    text : {
        fontSize : moderateScale(19)
    }
})

export default withModal(DiscountsList)