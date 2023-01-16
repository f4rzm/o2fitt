import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { useNavigation } from '@react-navigation/native'

const DrawerHeader = (props) => {
    const navigation=useNavigation()
    const lang = props.lang
    const profile = props.profile
    const specification=props.specification
    return (
        <TouchableOpacity onPress={()=>navigation.navigate("EditProfileScreen")} style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center",marginTop:moderateScale(20) }}>
                <View style={styles.imgcontainer}>
                    <Image
                        source={props.profile.imageUri ? { uri: props.profile.imageUri } : require("../../../res/img/logo2.png")}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </View>
                <View style={{ paddingHorizontal: moderateScale(15) }}>
                    <Text style={[styles.profileName, { fontFamily: props.lang.font }]}>{props.profile.fullName}</Text>
                    <Text style={[styles.profileName, { fontFamily: props.lang.font }]}>{props.user.username}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font }]}>{lang.golWeight}</Text>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font,fontSize:moderateScale(17) }]}>{props.profile.targetWeight}</Text>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font }]}>{lang.currentWeight}</Text>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font,fontSize:moderateScale(17) }]}>{specification[0].weightSize}</Text>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font }]}>{lang.lastWeight}</Text>
                    <Text style={[styles.bottomHeader, { fontFamily: lang.font,fontSize:moderateScale(17) }]}>{specification[1].weightSize}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultTheme.primaryColor,
        alignItems: "center",
        top: moderateScale(-4),
        // flexDirection: "row",
        justifyContent: "center",

    },
    img: {
        width: dimensions.WINDOW_WIDTH * .2,
        height: dimensions.WINDOW_WIDTH * 0.2,
    },
    imgcontainer: {
        width: dimensions.WINDOW_WIDTH * .2,
        height: dimensions.WINDOW_WIDTH * 0.2,
        borderRadius: dimensions.WINDOW_WIDTH * 0.18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        overflow: "hidden",

    },
    profileName: {
        color: defaultTheme.white,
        fontSize: moderateScale(17)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
        marginTop:moderateScale(10),
        paddingBottom:moderateScale(10)
    },
    bottomHeader: {
        color: defaultTheme.white,
        fontSize: moderateScale(15)
    }

})

export default DrawerHeader