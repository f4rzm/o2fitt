
import React, { memo } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';


const ProfileRow = props => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={styles.conntainer} onPress={() => {
            props.item.onPress(props.hasCredit)
            setTimeout(() => {
                navigation.dispatch(DrawerActions.closeDrawer());

            }, 1);

        }}>
            <View style={styles.subContainer}>
                <Image
                    source={props.item.img}
                    style={[styles.img, props.imgStyle]}
                    resizeMode="contain"
                />
                <Text style={[styles.text, { fontFamily: props.lang.font }, props.item.textStyle]} allowFontScaling={false}>
                    {props.item.text}
                </Text>
            </View>
            <Image
                source={require("../../res/img/back.png")}
                style={{ width: moderateScale(15), height: moderateScale(15), resizeMode: "contain", tintColor: defaultTheme.gray, paddingHorizontal: moderateScale(18), transform: [{ rotate: props.lang.langName == "english" ? "180deg" : "0deg" }] }}
            />

            {/* <Icon
                name="arrow-left"
                style={{
                    fontSize : moderateScale(20),
                    marginHorizontal :moderateScale(5),
                    color : defaultTheme.gray,
                    transform:[{
                      scale : I18nManager.isRTL?1:-1
                    }]
                  }}
            /> */}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    conntainer: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH * 0.8,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(10),
        borderBottomWidth: 1.2,
        borderColor: defaultTheme.border
    },
    subContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    img: {
        width: moderateScale(20),
        height: moderateScale(20),
        justifyContent: "center",
        alignItems: "center",
        marginVertical: moderateScale(3),
        marginHorizontal: moderateScale(5),
        tintColor: defaultTheme.gray
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText,
        marginHorizontal: moderateScale(5)
    }
})

export default memo(ProfileRow)