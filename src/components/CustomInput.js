import React, { memo } from "react"
import { View, Text, TouchableOpacity, StyleSheet, TextInput,Image } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions"
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomInput = props => {
    let textRef = React.createRef().current
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => props.focusControl ? props.focusControl() : textRef ? textRef.focus() : false}>
            <View style={[styles.container, props.style]}>
                {
                    props.icon &&
                    <Icon
                        name={props.icon}
                        size={moderateScale(20)}
                        color={props.iconColor ? props.iconColor : defaultTheme.lightGray}
                    />
                }
                {
                    props.editable === false ?

                        <Text
                            style={[styles.textStyle, { fontFamily: props.lang.font }, props.textStyle]}
                        >
                            {(typeof (props.value) === "string" && props.value != "") ? props.value : props.placeholder}
                        </Text> :
                        <TextInput
                            ref={ref => textRef = ref}
                            style={[styles.textStyle, { fontFamily: props.lang.font,textAlign: props.lang.langName=="english"?"left":"right", }, props.textStyle]}
                            autoFocus={props.autoFocus ? props.autoFocus : false}
                            keyboardType={props.keyboardType}
                            placeholder={props.placeholder}
                            placeholderTextColor={props.placeholderTextColor ? props.placeholderTextColor : defaultTheme.lightGray}
                            secureTextEntry={props.secureTextEntry}
                            onChangeText={props.onChangeText}
                            multiline={props.multiline ? true : false}
                            allowFontScaling={false}
                            value={props.value}
                            maxLength={props.maxLength ? props.maxLength : null}
                            editable={props.editable != null ? props.editable : true}
                            autoCorrect={false}
                            selectTextOnFocus={true}
                            underlineColorAndroid={'transparent'}
                        />
                }
                {
                    props.isPass ?
                        props.secureTextEntry ?
                            <TouchableOpacity onPress={props.hidePass}>
                                <Icon
                                    name="eye"
                                    size={moderateScale(18)}
                                    color={props.iconColor ? props.iconColor : defaultTheme.lightGray}
                                />
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={props.showPass}>
                                <Icon
                                    name="eye-slash"
                                    size={moderateScale(18)}
                                    color={props.iconColor ? props.iconColor : defaultTheme.lightGray}
                                />
                            </TouchableOpacity> :
                        null
                }
                {   props.cross&&
                    <TouchableOpacity onPress={props.crossPressed} style={{padding:moderateScale(4)}}>
                        <Image
                            source={require('../../res/img/cross.png')}
                            style={{width:moderateScale(15),height:moderateScale(15),tintColor:"red"}}
                        />
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH * 0.75,
        minHeight: moderateScale(40),
        borderRadius: moderateScale(25),
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: moderateScale(5),
        borderWidth: 1,
        borderColor: defaultTheme.lightGray,
        paddingStart: moderateScale(15),
        paddingEnd: moderateScale(8)
    },
    textStyle: {
        flex: 1,
        fontSize: moderateScale(17),
        color: defaultTheme.gray,
        
        marginHorizontal: 5,
        borderBottomColor: 'transparent',
        padding: 0,
        
    },
})

export default memo(CustomInput)