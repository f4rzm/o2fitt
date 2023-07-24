import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { MainToolbar, Toolbar } from '../../components'

export default function BlogScreen(props) {
    console.warn(props.route.params.data.thumbUri)
    const lang = props.route.params.lang
    return (
        <>
            <Toolbar
                lang={lang}
                onBack={()=>props.navigation.goBack()}
                title={lang.blog}
            />

            <ScrollView>
                <Image
                    source={{ uri: props.route.params.data.thumbUri }}
                    style={{ width: dimensions.WINDOW_WIDTH, alignSelf: "center", height: moderateScale(200) }}
                    resizeMode="cover"
                />
                <View style={{ paddingVertical: 15, borderRadius: 30, top: -20, backgroundColor: defaultTheme.lightBackground }}>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), paddingHorizontal: 15, color: defaultTheme.darkText }}>{props.route.params.data.title}</Text>
                </View>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center" }}>
                    {props.route.params.data.description.split(".").map((item) => {
                        return <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), lineHeight: moderateScale(23),color:defaultTheme.mainText }}>{item}</Text>
                    })}
                </View>
            </ScrollView>
        </>
    )
}