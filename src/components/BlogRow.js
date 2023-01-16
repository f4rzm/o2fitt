import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import ConfirmButton from "./ConfirmButton";
import { dimensions } from "../constants/Dimensions";
import { RowSpaceBetween, RowStart } from "../components";
import RowWrapper from "./layout/RowWrapper";
import Icon from 'react-native-vector-icons/FontAwesome';

const BlogRow = props => {
    
    const hitSlop = {
        top: moderateScale(10),
        left: moderateScale(20),
        right: moderateScale(20),
        bottom: moderateScale(10),
    }
    // const indexOfLike = props.blogIsLiked.indexOf(props.item.id)
    // const isLiked = indexOfLike != -1 ? true : false
    // console.error(isLiked)

    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={0.9} onPress={() => props.onPress()}>
            <RowSpaceBetween style={styles.rows}>
                <Text style={[styles.title, { fontFamily: props.lang.titleFont }]} allowFontScaling={false}>
                    {
                        props.item.title
                    }
                </Text>
            </RowSpaceBetween>

            {
                props.item.thumbUri &&
                <Image
                    source={{ uri: props.item.thumbUri }}
                    style={styles.img}
                    resizeMode="cover"
                />
            }

            <RowSpaceBetween style={styles.rows}>
                <Text style={[styles.text1, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                    {
                        props.item.shortDescription
                    }
                </Text>
            </RowSpaceBetween>

            <RowStart style={styles.rows}>
                {/* <RowWrapper>
                    <TouchableOpacity hitSlop={hitSlop} onPress={() => props.onLike(props.item)}>
                        <Icon
                            name={isLiked ? "heart" : "heart-o"}
                            style={{
                                fontSize: moderateScale(22),
                                marginHorizontal: moderateScale(5),
                                color: defaultTheme.error
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.text2, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                        {
                            isLiked ? parseInt(props.item.likeCount) + 1 : props.item.likeCount
                        }
                    </Text>
                </RowWrapper> */}
                <RowWrapper>
                    <Icon
                        name="eye"
                        style={{
                            fontSize: moderateScale(22),
                            marginHorizontal: moderateScale(5),
                            color: defaultTheme.gray
                        }}
                    />
                    <Text style={[styles.text2, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                        {
                            props.item.viewCount
                        }
                    </Text>
                </RowWrapper>
            </RowStart>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: moderateScale(12),
        width: dimensions.WINDOW_WIDTH * 0.95,
        alignItems: "center",
        borderColor: defaultTheme.border,
        borderWidth: 1.2,
        marginVertical: (5),
        borderRadius: (10)
    },
    title: {
        fontSize: moderateScale(16),
        color: defaultTheme.lightGray2
    },
    text1: {
        fontSize: moderateScale(15),
        lineHeight: moderateScale(24),
        color: defaultTheme.lightGray2
    },
    text2: {
        fontSize: moderateScale(18),
        lineHeight: moderateScale(24),
        color: defaultTheme.lightGray2
    },
    rows: {
        width: "100%",
        marginVertical: moderateScale(5)
    },
    img: {
        width: dimensions.WINDOW_WIDTH * 0.93,
        height: dimensions.WINDOW_WIDTH * 0.5,
        borderRadius: moderateScale(13)
    },

})

export default memo(BlogRow)