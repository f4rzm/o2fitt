import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';

const analyzMealToolbar = props => {

    return (
        <View style={styles.container}>
            {
                props.left && (
                    <View style={styles.leftContainer}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={props.goBack}>
                            <Image
                                source={require("../../res/img/next.png")}
                                style={{ width: moderateScale(17), height: moderateScale(17) }}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }
            <View style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
                <Text style={[styles.headerText, { fontFamily: props.lang.titleFont }]} >{props.lang.mealAnalyz}</Text>
            </View>
            <View style={{ flex: 1 }} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: moderateScale(65),
        backgroundColor: defaultTheme.gold,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerText: {
        color: "white",
        fontSize: moderateScale(17)
    },
    leftContainer: { flex: 1, justifyContent: "center", alignItems: "center" }
})
export default analyzMealToolbar;