
import React, { memo } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Switch,
    I18nManager,
    Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import { dimensions } from '../constants/Dimensions';
import RowWrapper from './layout/RowWrapper';



const ReminderRow = props => {
    try{
        I18nManager.allowRTL(false)
    }catch{

    }
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={props.onPress}
        >
            <RowWrapper>
                <Text style={[styles.text, { fontFamily: props.lang.font, maxWidth: dimensions.WINDOW_WIDTH * 0.65, minWidth: dimensions.WINDOW_WIDTH * 0.15 }]} allowFontScaling={false}>
                    {
                        props.item.title
                    }
                </Text>
                <Text style={[styles.text, { fontFamily: props.lang.font, marginHorizontal: moderateScale(10) }]} allowFontScaling={false}>
                    {
                        props.item.time
                    }
                </Text>
            </RowWrapper>
            <View style={styles.subContainer}>
                <Switch
                    value={props.item.isActive}
                    onValueChange={() => props.switchReminder(props.item, props.index)}
                />
                <Image
                    source={require('../../res/img/back.png')}
                    style={{ tintColor: defaultTheme.lightGray, width: moderateScale(18), height: moderateScale(18), resizeMode: "contain",marginLeft:moderateScale(10) ,transform:[{rotate:I18nManager.isRTL?"0deg":"180deg"}]}}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
        borderBottomWidth: 1.2,
        borderBottomColor: defaultTheme.border
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(14),
        minWidth: moderateScale(10),
        textAlign: "left",
        color: defaultTheme.darkText
    }
})

export default memo(ReminderRow)