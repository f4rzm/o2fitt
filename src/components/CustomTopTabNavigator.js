import { StyleSheet, Text, View, Animated, TouchableOpacity, Image, Pressable, ScrollView, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import { dimensions } from '../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../constants/theme'


const CustomTopTabNavigator = ({ containerStyle, items, lang, onSelectPage, animatedViewStyle, Screens, floatViewStyle, cardsWidth, activeTextColor, deactiveTextColor }) => {

    const floatingViewRef = useRef(new Animated.Value(0)).current
    const changeScreenRef = useRef(new Animated.Value(0)).current
    const cardWidth = cardsWidth ? cardsWidth : dimensions.WINDOW_WIDTH / items.length
    const [selectedPage, setSelectedPage] = useState(0)

    const onPressItem = (index,id) => {
        Animated.timing(floatingViewRef, {
            toValue: index * -cardWidth,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
            duration: 400
        }).start(event=>{
            if(event.finished){
                onSelectPage(id)
            }
        })
        Animated.timing(changeScreenRef, {
            toValue: index,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
            duration: 400
        }).start(event=>{
            if(event.finished){
                onSelectPage(id)
            }
        })

        // setTimeout(() => {
        //     setSelectedPage(index)
        // }, 1);
    }
    if (Screens) {
        const inputRange = [...Array(Screens.length).keys()]
        const outputRange = inputRange.map(element => dimensions.WINDOW_WIDTH * element);
        const translateXScreen = changeScreenRef.interpolate({
            inputRange,
            outputRange
        })
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }} stickyHeaderIndices={[0]}>
            <View style={{ width: dimensions.WINDOW_WIDTH, alignItems: "center" }}>
                <View style={[styles.container, containerStyle,]}>
                    <Animated.View style={[styles.animatedViewContaienr, { transform: [{ translateX: floatingViewRef }], width: cardWidth }, animatedViewStyle]} >
                        <View style={[{ height: moderateScale(50), width: cardWidth , borderBottomColor: defaultTheme.primaryColor, borderBottomWidth: 1, }, floatViewStyle]}>
                        </View>
                    </Animated.View>
                    {
                        items.map((item, index) => {
                            let interPolationInput = []
                            let outputrange = []
                            items.map((e, i) => {
                                if (i == index) {
                                    interPolationInput.push(i)
                                    outputrange.push(activeTextColor ? activeTextColor : defaultTheme.primaryColor)
                                } else {
                                    interPolationInput.push(i)
                                    outputrange.push(deactiveTextColor ? deactiveTextColor : defaultTheme.darkText)
                                }
                            })
                            const colorInterpolate = changeScreenRef.interpolate({
                                inputRange: interPolationInput,
                                outputRange: outputrange
                            })

                            return (
                                <Pressable style={styles.pressableItem}
                                    onPress={() => {
                                        onPressItem(index,item.id)
                                        // onSelectPage(item)
                                    }}
                                >
                                    {
                                        item.image &&
                                        <Animated.Image
                                            source={item.image}
                                            style={{ tintColor: colorInterpolate, marginHorizontal: moderateScale(4), width: moderateScale(27), height: moderateScale(27), resizeMode: 'contain' }}
                                        />
                                    }
                                    <Animated.Text style={{ fontFamily: lang.font, color: colorInterpolate, fontSize: moderateScale(15) }}>{item.name}</Animated.Text>
                                </Pressable>
                            )
                        })
                    }
                </View>
            </View>

            {
                Screens &&
                <Animated.View style={{ transform: [{ translateX: translateXScreen }], flexDirection: "row" }}>
                    {
                        Screens.map((item, index) => {
                            let interPolationInput = []
                            let outputrange = []
                            items.map((e, i) => {
                                if (i == index) {
                                    interPolationInput.push(i)
                                    outputrange.push(defaultTheme.primaryColor)
                                } else {
                                    interPolationInput.push(i)
                                    outputrange.push(defaultTheme.darkText)
                                }
                            })
                            const colorInterpolate = changeScreenRef.interpolate({
                                inputRange: interPolationInput,
                                outputRange: outputrange
                            })
                            return (
                                <View style={{ width: dimensions.WINDOW_WIDTH }}>
                                    {
                                        // selectedPage == index &&
                                        item.screen
                                    }
                                </View>
                            )
                        })
                    }

                </Animated.View>
            }
        </ScrollView>
    )
}

export default CustomTopTabNavigator

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH,
        alignItems: 'center',
        paddingVertical: moderateScale(10),
        backgroundColor: defaultTheme.white,
        borderRadius: moderateScale(10)
    },
    animatedViewContaienr: {
        height: moderateScale(30),
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: defaultTheme.primaryColor,
        // borderBottomWidth: 1
    },
    pressableItem: {
        flex: 1,
        alignItems: "center",
        height: moderateScale(30),
        flexDirection: "row",
        justifyContent: "center"
    }
})