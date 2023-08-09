import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'

 function ActivityPermission(props) {
  
  return (
    <TouchableOpacity onPress={props.onPressPermission} activeOpacity={0.5} style={{width:dimensions.WINDOW_WIDTH,alignItems:"center",height:dimensions.WINDOW_HEIGTH*0.3,justifyContent:"center"}}>
        <Image
        source={require("../../res/img/lock.png")}
        style={{width:moderateScale(60),height:moderateScale(60)}}
        resizeMode={'contain'}
        />
      {/* <Text style={{fontFamily:props.lang.font,paddingTop:moderateScale(15),fontSize:moderateScale(16),color:defaultTheme.darkText}}>{props.lang.subscribe1}</Text> */}
      <Text style={{fontFamily:props.lang.font,fontSize:moderateScale(16),color:defaultTheme.darkText,marginTop:10}}>{props.lang.buyPermission}</Text>
      <View style={{width:dimensions.WINDOW_WIDTH*0.5,height:moderateScale(50),backgroundColor:defaultTheme.green,borderRadius:15,marginTop:moderateScale(15),alignItems:"center",justifyContent:"center"}}>
            <Text style={{fontFamily:props.lang.font,color:defaultTheme.lightText,fontSize:moderateScale(17)}}>
              {props.lang.goTopLevel}
            </Text>
      </View>

    </TouchableOpacity>
  )
}
export default ActivityPermission