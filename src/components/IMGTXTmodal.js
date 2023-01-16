import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur'
import { dimensions } from '../constants/Dimensions'
import { defaultTheme } from '../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { universalStyles } from '../constants/universalStyles'
import ConfirmButton from './ConfirmButton'

const IMGTXTmodal = (props) => {
    const lang = props.lang

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                flex: 1, top: 0, right: 0, left: 0, bottom: 0, position: 'absolute', alignItems: "center", justifyContent: "center"
            }}
        >
            <BlurView
                style={{
                    flex: 1, top: 0, right: 0, left: 0, bottom: 0, position: 'absolute'
                }}
                blurAmount={3}
            />
            <View
                style={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: defaultTheme.white, borderRadius: moderateScale(15), alignItems: "center", justifyContent: "center", padding: moderateScale(10) }}
            >
                {
                    props.image && props.image
                }
                {props.title &&
                    <Text style={[universalStyles.headersTextPersian, { fontFamily: lang.font }]}>{props.title}</Text>
                }
                {props.text &&
                    <Text style={[universalStyles.subHeaderTextPersian, { fontFamily: lang.font }]}>{props.text}</Text>
                }

                <View style={universalStyles.doubleBtn}>
                    <ConfirmButton
                        title={props.rightBtnText} onPress={() => {
                            props.onAccept()
                        }} 
                        style={{ ...props.acceptStyle }}
                        lang={lang}
                        textStyle={props.acceptTextStyle}
                    />

                    <ConfirmButton
                        title={props.leftBtnText} onPress={() => {
                            props.onReject()
                        }} 
                        style={{ ...props.rejectStyle }}
                        lang={lang}
                        textStyle={props.rejectTextStyle}
                    />

                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({

})

export default IMGTXTmodal