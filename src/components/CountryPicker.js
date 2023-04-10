import React , {memo} from "react"
import {View , Text , Image , StyleSheet, SectionList , ScrollView , Animated, FlatList, TouchableOpacity} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import { SearchToolbar } from ".";

const CountryPicker = props =>{
     
    const [searchText , setText] = React.useState("")
    const searchTextChanged=(text)=>{
        search(text)
    }

    return(
       <Animated.View 
        style={[
            styles.mainContainer,
            {
                transform : [
                    {
                        translateY : props.ty
                    }
                ]
            }
        ]}
       >
           <SearchToolbar
                lang={props.lang}
                title={""}
                goBack={props.closePicker}
                placeholder={props.lang.country}
                onChangeText={(search=>props.searchTextChanged(search))}
                value={props.searchText}
                onVoice={search=>props.searchTextChanged(search)}
                autoFocusDisable
                setTextEmpty={()=>setText("")}
           />
         
           <SectionList
                 sections={props.data}
                 extraData={props.data}
                 keyExtractor={(item, index) => index.toString()}
                 showsVerticalScrollIndicator={false}
                 renderItem={({ item }) => {
                     return(
                        <TouchableOpacity style={styles.rowContainer} onPress={()=>props.countryChanged(item)}>
                            
                            <Text style={[styles.text,{fontFamily : props.lang.langName!=="persian"?props.lang.titleFont:props.lang.font,fontSize:props.lang.langName!=="persian"?moderateScale(15):moderateScale(16)}]} allowFontScaling={false}>
                                {
                                    item.name
                                }
                            </Text>
                        </TouchableOpacity>
                     )
                 }}
                 renderSectionHeader={({ section: { title , data}})  => {
                     return(
                        <View style={[styles.rowContainer,{borderBottomWidth:0.5,borderBottomColor:defaultTheme.gray}]}>
                            <Text style={[styles.title,{fontFamily : props.lang.font}]} allowFontScaling={false}>
                                {
                                    title
                                }
                            </Text>
                        </View>
                 )}}
             />

       </Animated.View>
    )
}

const styles = StyleSheet.create({
    mainContainer :{
        position : "absolute",
        top : 0,
        left : 0,
        right : 0,
        width : dimensions.WINDOW_WIDTH ,
        height : dimensions.WINDOW_HEIGTH,
        zIndex : 1000,
        backgroundColor : defaultTheme.lightBackground
   },
   rowContainer : {
       width : dimensions.WINDOW_WIDTH,
       flexDirection : "row",
       justifyContent : "flex-start",
       alignItems : "center",
       padding : moderateScale(10),
       backgroundColor:defaultTheme.white
   },
   title : {
        fontSize : moderateScale(18),
        marginHorizontal : moderateScale(10),
        color : defaultTheme.darkText,
   },
   text : {
       fontSize : moderateScale(16),
       marginHorizontal : moderateScale(10),
       color:defaultTheme.darkText
   }

})

export default memo(CountryPicker)