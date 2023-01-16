import React, { memo, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, FlatList, Platform } from "react-native"
import { moderateScale, scale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions"
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from "@react-native-community/blur"


const DropDown = props => {
    const [showItems, controlShowItems] = React.useState(false)
    const [errorVisible, setErrorVisible] = useState();
    const [selectedIndex, setSelectedIndex] = React.useState(props.initialIndex ? props.initialIndex : 0)
    let _flatlist = React.useRef(null)

    const onOpen = () => {
        props.onOpen ?
            props.onOpen() :
            controlShowItems(true)
    }

    const closeDropDown = () => {
        controlShowItems(false)
    }

    const onItemPressed = (item, index) => {
        props.onItemPressed(item, index)
        controlShowItems(false)
        setSelectedIndex(index)
    }

    const goToOffSet = () => {
        selectedIndex <= (props.data.length - 1) ?
            _flatlist.current.scrollToIndex({ animated: false, index: selectedIndex }) :
            _flatlist.current.scrollToIndex({ animated: false, index: (props.data.length - 1) })

    }

    return (
        <TouchableOpacity style={[styles.mainContainer, props.style]} activeOpacity={0.7} onPress={onOpen}>

            <View style={[styles.dateContainer, props.dateContainerStyle]}>

                <Text style={[styles.dateText, { fontFamily: props.lang.font }, props.selectedTextStyle]} allowFontScaling={false} numberOfLines={2}>
                    {
                        props.selectedItem ? props.selectedItem.includes("*") ? props.selectedItem.split("*")[0] : props.selectedItem.toString() : ""
                    }
                </Text>
                <Icon
                    name="caret-down"
                    size={moderateScale(18)}
                />
            </View>
            <Modal
                visible={showItems}
                onRequestClose={() => controlShowItems(false)}
                animationType="fade"
                transparent
                onShow={goToOffSet}
            >



                <TouchableWithoutFeedback onPress={closeDropDown}>

                    <View style={[styles.modalMainContainer]} >
                        <TouchableWithoutFeedback onPress={() => false}>
                            <View style={[styles.modalContainer]}>
                                    
                                <FlatList
                                    ref={_flatlist}
                                    initialNumToRender={100}
                                    // initialScrollIndex={selectedIndex} 
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ alignItems: "center" }}
                                    data={props.data}
                                    style={{ width: "100%", flexGrow: 0 }}
                                    keyboardShouldPersistTaps={'always'}
                                    keyboardDismissMode={'interactive'}
                                    onScrollToIndexFailed={info => {
                                        const wait = new Promise(resolve => setTimeout(resolve, 1));
                                        wait.then(() => {
                                            _flatlist.current?.scrollToIndex({ index: info.index, animated: false });
                                        });
                                    }}
                                    renderItem={({ item, index }) => {
                                        const value = props.keyName ? item[props.keyName] : item.name ? item.name : ""

                                        console.log(value)
                                        return (
                                            <TouchableOpacity
                                                style={{ alignItems: "center", padding: moderateScale(16), minHeight: moderateScale(30) }}
                                                onPress={() => onItemPressed(item, index)}>
                                                <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                                    {value.includes("*") ? value.split("*")[0] : value}
                                                </Text>
                                                {
                                                    value.includes("*") &&
                                                    <Text style={[styles.text2, props.textStyle2, { fontFamily: props.lang.font }, props.textStyle]} allowFontScaling={false}>
                                                        {
                                                            value.split("*")[1]
                                                        }
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                        )
                                    }
                                    }
                                />
                             
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: moderateScale(130),
        minHeight: moderateScale(30),
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(8),
        marginHorizontal: moderateScale(12)
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    modalMainContainer: {
        width: dimensions.WINDOW_WIDTH,
        height: dimensions.WINDOW_HEIGTH,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: defaultTheme.dialogBackground
    },
    modalContainer: {
        minWidth: dimensions.WINDOW_WIDTH * 0.6,
        maxHeight: dimensions.WINDOW_HEIGTH * 0.7,
        minHeight: moderateScale(50),
        paddingVertical: moderateScale(8),
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: moderateScale(8)
    },
    text: {
        minWidth: dimensions.WINDOW_WIDTH * 0.4,
        fontSize: moderateScale(17),
        color: defaultTheme.lightGray2,
        textAlign: "center"
    },
    dateContainer: {
        flexDirection: "row",
        width: "100%",
        height: moderateScale(38),
        marginHorizontal: moderateScale(5),
        justifyContent: Platform.OS==="ios"?"space-evenly":"flex-end",
        alignItems: "center",
        borderRadius: moderateScale(10),
        paddingEnd: moderateScale(3),
    },
    dateText: {
        minWidth: moderateScale(70),
        maxWidth: moderateScale(120),
        fontSize: moderateScale(14),
        color: defaultTheme.darkText,
        paddingHorizontal: moderateScale(15),
    },
    text2: {
        fontSize: moderateScale(11),
        color: defaultTheme.gray,
        marginTop: moderateScale(5)
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default memo(DropDown)