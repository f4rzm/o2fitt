import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import { useNavigation } from '@react-navigation/native'
import Discount from "../../../res/img/discount.svg"



function paymentCalorieComponent(props) {
    const navigation = useNavigation()
    const scrollX = useRef(new Animated.Value(0)).current
    const flatlistRef = React.useRef();
    const [selectedItem, setSelectedItem] = useState()
    const lang = props.lang
    React.useEffect(() => {
        if (flatlistRef.current) flatlistRef.current.scrollToOffset({
            offset: 0, animated: true

        });
    }, [flatlistRef]);
    // const snapToOffsetsLikeGooglePlay = props.data.map((x, i) => {
    //     return ((i * dimensions.WINDOW_WIDTH * .8 + moderateScale(30)) + dimensions.WINDOW_WIDTH * 0.7)
    // })
    // const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    //     if (viewableItems.length >= 1) {
    //         if (viewableItems[0].isViewable) {
    //             props.onItemScroll(viewableItems)
    //         }
    //     }
    // }, []);
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50,
    };
    // const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const inputRange = [-dimensions.WINDOW_WIDTH * 0.8, 0, dimensions.WINDOW_WIDTH * 0.8];
    // const translateX = scrollX.interpolate({
    //     inputRange,
    //     outputRange: [
    //         -moderateScale(17),
    //         0,
    //         moderateScale(17),
    //     ],
    // });
    return (
        <View style={{ overflow: 'visible' }}>
            <Animated.FlatList
                scrollEnabled={false}
                ref={flatlistRef}
                showsHorizontalScrollIndicator={false}
                // onViewableItemsChanged={onViewableItemsChanged}
                // viewabilityConfig={viewabilityConfig}
                // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                // onScroll={
                //     Animated.event(
                //         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                //         { useNativeDriver: true }
                //     )
                // }
                data={props.data.sort((a, b) => Number(b.isPromote) - Number(a.isPromote))}
                contentContainerStyle={{ paddingHorizontal: moderateScale(40) }}
                // snapToInterval={dimensions.WINDOW_WIDTH * 0.8}
                // snapToAlignment={"center"}
                // snapToOffsets={snapToOffsetsLikeGooglePlay}
                style={{ flexDirection: "row" }}
                renderItem={({ item, index }) => {
                    const width = dimensions.WINDOW_WIDTH
                    // const inputRange = [width * ((props.data.packages.length-1) - index), width * ((props.data.packages.length) - index), width * (7.8 - index), width * ((props.data.packages.length+2) - index)]
                    // const scale = scrollX.interpolate({
                    //     inputRange: inputRange,
                    //     outputRange: [0, 1, 1, 0]
                    // })
                    // const opacity = scrollX.interpolate({
                    //     inputRange: inputRange,
                    //     outputRange: [0, 1, 1, 0]
                    // })

                    return (
                        <View style={[styles.packages]}>
                            <View style={{ alignItems: "center", justifyContent: "center", height: moderateScale(120) }}>
                                <TouchableOpacity
                                    onPress={() => props.payPressed(item)}
                                    style={[styles.paymentCard, { flexDirection: "row" }]}
                                    activeOpacity={0.7}
                                >
                                    <View>
                                        <Image
                                            source={require("../../../res/img/back.png")}
                                            style={{ tintColor: defaultTheme.mainText, width: moderateScale(30), height: moderateScale(20), resizeMode: "contain", transform: [{ rotate: "180deg" }] }}
                                        />
                                    </View>
                                    <View style={{ paddingHorizontal: moderateScale(10) }}>
                                        <Text style={{ fontFamily: props.lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText, textAlign: "center" }}>
                                            {item.name}
                                        </Text>
                                        <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15), textAlign: "center", paddingVertical: Platform.OS == "ios" ? moderateScale(6) : 0 }}>
                                            <Text style={{ textDecorationLine: "line-through", textAlign: "left" }}>{item.price} {item.currency == 1 ? "تومان" : " € "}</Text> | {((item.discountPercent && item.discountPercent > 0) ? item.price - (item.price * item.discountPercent / 100) : item.price)} {item.currency == 1 ? "تومان" : " € "}
                                        </Text>
                                        <Text style={{ color: defaultTheme.green, fontSize: moderateScale(19), fontFamily: lang.titleFont, textAlign: "center" }}>{item.description} </Text>
                                    </View>
                                    <View style={{}}>
                                        <View onPress={() => navigation.navigate("PaymentScreen", { package: item })} style={styles.circle}>
                                            <Text style={[styles.circleText, { fontFamily: props.lang.font, marginVertical: moderateScale(-5) }]}>%{item.discountPercent}</Text>
                                            <Text style={[styles.circleText, , { fontFamily: props.lang.font, fontSize: moderateScale(13) }]}>{props.lang.discount}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
            />

            {/* <View style={{ height: moderateScale(17), alignSelf: "center", flexDirection: "row-reverse", marginBottom: moderateScale(15) }}>
                <Animated.View
                    style={[
                        {
                            width: moderateScale(17),
                            height: moderateScale(17),
                            borderRadius: moderateScale(9),
                            flexDirection: "row-reverse",
                            borderColor: defaultTheme.primaryColor,
                        },
                        // eslint-disable-next-line react-native/no-inline-styles
                        styles.slidingIndicatorStyle,
                        {
                            position: 'absolute',
                            transform: [{ translateX }],
                        },
                    ]}
                />
                {props.data.sort((a, b) => Number(a.isPromote) - Number(b.isPromote)).map((_item, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                {
                                    width: moderateScale(17),
                                    height: moderateScale(17),
                                    borderRadius: moderateScale(7.5),

                                },
                                styles.dotContainerStyle
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        width: moderateScale(10),
                                        height: moderateScale(10),
                                        borderRadius: moderateScale(5),
                                    },
                                    styles.dotStyle
                                ]}
                            />
                        </View>
                    );
                })}
            </View> */}



            {/* <TouchableOpacity style={{ flexDirection: "row", borderWidth: 1, borderRadius: 10, padding: moderateScale(9), borderColor: defaultTheme.border, alignItems: "center", alignSelf: "center", width: moderateScale(300), justifyContent: "center" }} onPress={() => props.checkDisountCode()}>
                <Discount
                    width={moderateScale(25)}
                    height={moderateScale(25)}
                    preserveAspectRatio="none"
                />
                <Text style={{ color: defaultTheme.darkText, fontSize: moderateScale(18), textAlign: "center", fontFamily: lang.font, marginStart: 8 }}>{lang.discountCode}</Text>
            </TouchableOpacity> */}
            <View style={{ width: dimensions.WINDOW_WIDTH, borderBottomColor: defaultTheme.border, borderBottomWidth: 1, margin: 25 }} />
            {
                props.showFooter ? <Text style={{ textAlign: "center", fontFamily: props.lang.titleFont, fontSize: moderateScale(20), marginVertical: moderateScale(20), color: defaultTheme.mainText }}>
                    {props.title}
                </Text> :
                    null
            }
            {props.showFooter ?
                props.describes.map((item) => (
                    <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require("../../../res/img/done.png")}
                                style={{ width: moderateScale(25), height: moderateScale(25), resizeMode: "contain", tintColor: defaultTheme.green }}
                            />
                            <Text style={{ paddingHorizontal: moderateScale(10), fontFamily: props.lang.titleFont, fontSize: moderateScale(17), marginBottom: moderateScale(10), color: defaultTheme.mainText }}>{item.title}</Text>
                        </View>
                        <Text style={{ fontFamily: props.lang.font, lineHeight: moderateScale(23), fontSize: moderateScale(15), color: defaultTheme.mainText, marginBottom: moderateScale(15) ,textAlign:"left"}}>{item.decribe}</Text>
                    </View>
                )) : null
            }
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(20),
        color: defaultTheme.lightGray2
    },
    text2: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    packages: {
        width: dimensions.WINDOW_WIDTH * 0.8,
        alignItems: "center",
        alignSelf: "center",
    },
    buttonGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: moderateScale(50),
        paddingBottom: 50,
    },
    button: {
        backgroundColor: defaultTheme.green
    },
    navigationText: {
        fontSize: moderateScale(15),
        padding: moderateScale(6)
    },
    circleText: {
        fontSize: moderateScale(25),
        color: defaultTheme.white
    },
    circle: {
        width: moderateScale(70),
        height: moderateScale(70),
        backgroundColor: defaultTheme.primaryColor,

        borderRadius: moderateScale(35),
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    paymentCard: {
        width: dimensions.WINDOW_WIDTH * 0.85,
        backgroundColor: "white",
        borderColor: defaultTheme.primaryColor,
        borderWidth: 1,
        height: moderateScale(100),
        borderRadius: 13,
        alignItems: "center",
        elevation: 4,
        justifyContent: "center"
    },
    slidingIndicatorStyle: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    dotContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dotStyle: {
        backgroundColor: "#e0e0e0",
    },
});
export default paymentCalorieComponent;