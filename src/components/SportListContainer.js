import React , {memo} from "react"
import {View , Text , Image , StyleSheet, TouchableOpacity , ScrollView} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import {SportRow , SportRowHeader} from "../components"

const SportListContainer = props =>{
     const data = props.item.data.filter(item=>item.name.includes(props.searchText))
     if(data.length > 0){
        return(
            <>
                <SportRowHeader
                    lang={props.lang}
                    title={props.item.title}
                    logo={props.item.iconUri}
                    style={{borderTopWidth :props.index === 0 ? 0 : 1}}
                />
                <ScrollView>
                    {
                        data.map((sport,index)=>{
                            return(
                                <SportRow
                                    key={sport.id.toString()}
                                    lang={props.lang}
                                    title={sport.name}
                                    logo={sport.iconUri}
                                    index={index}
                                    onPress={()=>props.onPress(sport)}
                                />
                            )
                        })
                    }
                </ScrollView>
            </>
         )   
      }
     
      return null
}

const styles = StyleSheet.create({
    mainContainer :{
       padding : moderateScale(6),
       paddingHorizontal : moderateScale(16),
       marginVertical : moderateScale(8)
   },
   logo:{
        width : moderateScale(37),
        height : moderateScale(37),
        marginHorizontal : moderateScale(10)
   },   
   title:{
       fontSize : moderateScale(15),
       color:defaultTheme.darkText,
       textAlign : "center",
       marginHorizontal : moderateScale(8),
       marginVertical : moderateScale(6)
   }

})

export default memo(SportListContainer)