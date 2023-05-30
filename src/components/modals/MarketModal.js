import React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from "react-native"
import { withModal } from "../hoc/withModal"
import { dimensions } from "../../constants/Dimensions"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../../constants/theme"
import { ConfirmButton } from ".."
import { useNavigation } from "@react-navigation/native"
import { urls } from "../../utils/urls"
import { BlurView } from "@react-native-community/blur"

const MarketModal = props => {
    const navigation = useNavigation()
    const item = props.item
    if (item) {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", width: dimensions.WINDOW_WIDTH, height: dimensions.WINDOW_HEIGTH, position: "absolute", top: moderateScale(-40) }}>
                    <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }} blurType="dark" blurAmount={1}
                    />
                <TouchableOpacity style={styles.mainContainer} onPress={props.onPress} activeOpacity={1}>
                    <ScrollView>
                        <Text style={[styles.headerText, { fontFamily: props.lang.font }]}>
                            {
                                item.title[props.lang.langName]
                            }
                        </Text>
                        {/* <View style={styles.imgContainer}> */}
                        <Image
                            source={{ uri: "https://socialtest.o2fitt.com/MarketMessageImages/" + item.image }}
                            style={styles.img}
                            resizeMode="cover"
                        />
                        {/* </View> */}
                        <Text style={[styles.context, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                            {
                                props.item.description[props.lang.langName]
                            }
                        </Text>
                    </ScrollView>
                    <ConfirmButton
                        lang={props.lang}
                        onPress={() => { navigation.navigate(item.link) }}
                        style={styles.btn}
                        title={item.buttonName[props.lang.langName]}
                    />
                </TouchableOpacity>
            </View>
        )
    } else {
        return <></>
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        width: dimensions.WINDOW_WIDTH * 0.84,

        borderRadius: moderateScale(16),
        backgroundColor: defaultTheme.lightBackground,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        alignSelf: "center",
        marginTop: dimensions.WINDOW_HEIGTH * 0.125
    },
    imgContainer: {
        width: dimensions.WINDOW_WIDTH * 0.8,
        height: dimensions.WINDOW_HEIGTH * 0.4,
        borderRadius: moderateScale(16),

    },
    img: {
        width: dimensions.WINDOW_WIDTH * 0.8,
        height: dimensions.WINDOW_HEIGTH * 0.3,
        borderRadius: moderateScale(10)
    },
    cross: {
        width: moderateScale(18),
        height: moderateScale(18),
        alignSelf: "flex-end",
        margin: moderateScale(18)
    },
    context: {
        width: dimensions.WINDOW_WIDTH * 0.75,
        minHeight: dimensions.WINDOW_HEIGTH * 0.07,
        alignSelf: "center",
        textAlign: "center",
        color: defaultTheme.darkText,
        fontSize: moderateScale(15),
        lineHeight: moderateScale(26),
        marginVertical: moderateScale(20)
    },
    btn: {
        width: moderateScale(130),
        backgroundColor: defaultTheme.green,
        marginBottom: moderateScale(16)
    },
    headerText: {
        color: defaultTheme.darkText,
        textAlign: "center",
        marginVertical: moderateScale(10),
        fontSize: moderateScale(17)
    }
})

export default MarketModal