import React from "react"
import {View , Text , StyleSheet , Image , TouchableOpacity , ScrollView} from "react-native"
import { dimensions } from "../constants/Dimensions"
import { moderateScale} from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { BlurView } from "@react-native-community/blur";

const PageIndicator = props =>{
    return(
        <View 
            style={styles.mainContainer}
        >
            {
                props.pages.map((item,index)=>{
                    return(
                        <View
                            key={index.toString()}
                            style={[
                                styles.indicator,
                                {
                                    height : props.activeIndex === index?moderateScale(5):moderateScale(2),
                                    backgroundColor : props.activeIndex === index?defaultTheme.primaryColor:defaultTheme.gray
                                }
                            ]}
                        />    
                    )
                })
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flexDirection : "row",
        minHeight : 20 ,
        alignItems : "center",
        marginTop : moderateScale(8)
    },
    indicator : {
        width : moderateScale(12),
        marginHorizontal : moderateScale(2)
    }
})

export default PageIndicator