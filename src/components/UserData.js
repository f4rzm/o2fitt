import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'

export default function (props) {
  return (
    <View style={[styles.mainContainer,props.contaierStyle]}>
      <Text style={{fontFamily:props.lang.font,fontSize:moderateScale(17),color:defaultTheme.mainText}}>{props.title}</Text>
      <Text style={{fontFamily:props.lang.font,fontSize:moderateScale(17),color:defaultTheme.darkText}}>{props.data}</Text>
    </View>
  )
}
const styles=StyleSheet.create({
   mainContainer: {flexDirection:"row",
    width:dimensions.WINDOW_WIDTH,
    justifyContent:"space-between",
    borderBottomWidth:0.5,
    borderBottomColor:"gray",
    padding:moderateScale(20)
}
})