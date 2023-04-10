import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { defaultTheme } from '../constants/theme'
import { Switch } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters';

const RamadanSwitch = ({ onChangeSwitch, isActive, lang }) => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: moderateScale(15), fontFamily: lang.font, color: defaultTheme.mainText }}>حالت روزه داری{isActive?" : فعال":" : غیر فعال"}</Text>
            <Switch
                value={isActive}
                onValueChange={(e) => {
                    onChangeSwitch(e)
                }}
                color={defaultTheme.primaryColor}
            />
        </View>
    )
}

export default RamadanSwitch

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultTheme.lightBackground,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.border
    }
})