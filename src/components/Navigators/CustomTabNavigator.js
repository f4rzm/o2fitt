import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { defaultTheme } from '../../constants/theme'

const MyCustomTabBar = ({ state, descriptors, navigation, position, cardsWidth, floatViewStyle, animatedViewStyle, lang }) => {
  
    const cardWidth = cardsWidth ? cardsWidth : dimensions.WINDOW_WIDTH * 0.94 / state.routes.length
    const floatingViewRef = useRef(new Animated.Value(0)).current
    const changeScreenRef = useRef(new Animated.Value(0)).current
    const onPressItem = (i) => {
        Animated.timing(floatingViewRef, {
            toValue: cardWidth * i,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
            duration: 400
        }).start(event => {

        })
        Animated.timing(changeScreenRef, {
            toValue: i,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
            duration: 400
        }).start(event => {

        })
    }
    const indexInputRange = state.routes.map((item, idx) => idx)
    const putputRageIndex = state.routes.map((item, idx) => cardWidth * idx)
    const animatedViewTranslationx = position.interpolate({
        inputRange: indexInputRange,
        outputRange: putputRageIndex,
        extrapolate: "clamp"
    })

    return (
        <View style={{ flexDirection: 'row-reverse', height:moderateScale(45),backgroundColor: defaultTheme.grayBackground, margin: dimensions.WINDOW_WIDTH * 0.03, borderRadius: moderateScale(10),alignItems:"center" }}>
            <Animated.View style={[styles.animatedViewContaienr, { transform: [{ translateX: animatedViewTranslationx }], width: cardWidth, marginVertical: moderateScale(3) }, animatedViewStyle]} >
                <View style={[{ width: cardWidth * 0.9, borderBottomColor: defaultTheme.primaryColor, borderBottomWidth: 1, backgroundColor: defaultTheme.primaryColor, flex: 1, borderRadius: moderateScale(10) }, floatViewStyle]}>
                </View>
            </Animated.View>

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const inputRange = state.routes.map((_, i) => i);
                const opacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
                });
                const color = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? defaultTheme.white : defaultTheme.gray)),
                });

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={() => {
                            onPress()
                            onPressItem(index)
                        }}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: "center" }}

                    >
                        <Animated.Text style={{
                            opacity:1, fontFamily: lang.font, fontSize: moderateScale(15),color:defaultTheme.darkText,position:"absolute"
                        }}>
                            {label}
                        </Animated.Text>
                        <Animated.Text style={{
                            opacity, fontFamily: lang.font, fontSize: moderateScale(15),color:defaultTheme.white
                        }}>
                            {label}
                        </Animated.Text>
                    </TouchableOpacity>
                );
            })}

        </View>
    )
}

export default MyCustomTabBar

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(10)
    },
    animatedViewContaienr: {
        height: moderateScale(40),
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: defaultTheme.primaryColor,
        flex: 1
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