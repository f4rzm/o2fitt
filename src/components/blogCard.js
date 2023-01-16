import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'
// import BlogIcon from '../../res/img/blogIcon'

export default function blogCard(props) {
    const lang = props.lang
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => props.onPress()} style={{ width: dimensions.WINDOW_WIDTH * 0.93, alignSelf: "center", backgroundColor: defaultTheme.lightBackground, borderRadius: moderateScale(13), elevation: 5, flexDirection: "row", paddingVertical: moderateScale(5),height: moderateScale(110), }}>
            <View style={{ flex: 3, }}>
                <Text style={{ fontFamily: lang.titleFont, paddingHorizontal: moderateScale(10),fontSize: moderateScale(16), color: defaultTheme.darkText }}>{lang.blog}</Text>
                <Text style={{ flex: 3, fontFamily: lang.font, paddingHorizontal: moderateScale(10), fontSize: moderateScale(14), color: defaultTheme.darkText, lineHeight: moderateScale(23),marginTop:moderateScale(10) }}>{lang.blogTitle}</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: moderateScale(10) }}>
                {/* <BlogIcon
                    width={moderateScale(80)}
                    height={moderateScale(80)}
                /> */}

            </View>
        </TouchableOpacity>
    )
}

