import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import DietProgresstion from './DietProgresstion'
import RowSpaceBetween from '../layout/RowSpaceBetween'
import AnimatedLottieView from 'lottie-react-native'
import ConfirmButton from '../ConfirmButton'


const DietGoalCard = ({ diet, dietNew, fastingDiet, lang, navigation, profile, user, specification }) => {
    console.warn(profile);
    if (dietNew.isActive && dietNew.isOld == false) {
        return (
            <View style={styles.container}>
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.dietName}</Text>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{dietNew.dietName}</Text>
                </RowSpaceBetween>
                {
                    fastingDiet.isActive == false &&
                    <DietProgresstion
                        lang={lang}
                        diet={dietNew}
                        containerStyle={{ shadowOpacity: 0, padding: 0 }}
                        textStyle={{ padding: 0, paddingHorizontal: moderateScale(10) }}
                    />
                }
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.usedCheetDays}</Text>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{dietNew.cheetDays.length}</Text>

                </RowSpaceBetween>
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>هدف برنامه</Text>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{specification[0].weightSize > profile.targetWeight ? "کاهش وزن" : profile.targetWeight < specification[0].targetWeight ? "افزایش وزن" : 'ثبات وزن'}</Text>
                </RowSpaceBetween>
            </View>
        )

    }
    else if (diet.isActive && dietNew.isOld) {
        return (
            <View style={styles.container}>
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    {/* <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.dietName}</Text> */}
                    <Text style={[styles.text, { fontFamily: lang.font }]}>برنامه شخصی</Text>
                </RowSpaceBetween>
                <DietProgresstion
                    lang={lang}
                    diet={dietNew}
                    containerStyle={{ shadowOpacity: 0, padding: 0 }}
                    textStyle={{ padding: 0, paddingHorizontal: moderateScale(10) }}
                />
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.usedCheetDays}</Text>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{diet.cheetDays.length}</Text>
                </RowSpaceBetween>
                <RowSpaceBetween style={styles.rowSpaceContainer}>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>هدف برنامه</Text>
                    <Text style={[styles.text, { fontFamily: lang.font }]}>{specification[0].weightSize > profile.targetWeight ? "کاهش وزن" : profile.targetWeight < specification[0].targetWeight ? "افزایش وزن" : 'ثبات وزن'}</Text>
                </RowSpaceBetween>
            </View>
        )

    }
    // else if (diet.isActive && dietNew.isOld) {
    //     return (
    //         <View style={styles.container}>
    //             <RowSpaceBetween style={styles.rowSpaceContainer}>
    //                 {/* <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.dietName}</Text> */}
    //                 {/* <Text style={[styles.text, { fontFamily: lang.font }]}></Text> */}
    //             </RowSpaceBetween>
    //             <DietProgresstion
    //                 lang={lang}
    //                 diet={dietNew}
    //                 containerStyle={{ shadowOpacity: 0, padding: 0 }}
    //                 textStyle={{ padding: 0, paddingHorizontal: moderateScale(10) }}
    //             />
    //             <RowSpaceBetween style={styles.rowSpaceContainer}>
    //                 <Text style={[styles.text, { fontFamily: lang.font }]}>{lang.usedCheetDays}</Text>
    //                 <Text style={[styles.text, { fontFamily: lang.font }]}>{diet.cheetDays.length}</Text>
    //             </RowSpaceBetween>
    //             <RowSpaceBetween style={styles.rowSpaceContainer}>
    //                 <Text style={[styles.text, { fontFamily: lang.font }]}>هدف برنامه</Text>
    //                 <Text style={[styles.text, { fontFamily: lang.font }]}>{specification[0].weightSize > profile.targetWeight ? "کاهش وزن" : profile.targetWeight < specification[0].targetWeight ? "افزایش وزن" : 'ثبات وزن'}</Text>
    //             </RowSpaceBetween>
    //         </View>
    //     )

    // }
    else {
        return (
            <Pressable
                onPress={() => navigation.navigate("DietMainScreen", { nextRoute: "DietCategoryTab" })}
                style={[styles.container, { paddingVertical: moderateScale(20) }]}>
                <AnimatedLottieView
                    source={require('../../../res/animations/mealplan.json')}
                    style={{ width: dimensions.WINDOW_WIDTH * 0.2 }}
                    autoPlay={true}
                    loop={true}
                />
                <Text style={[styles.text2, { fontFamily: lang.titleFont, lineHeight: moderateScale(25), marginTop: moderateScale(15) }]}>
                    شما هیچ برنامه غذایی فعالی ندارین
                </Text>
                <Text style={[styles.text2, { fontFamily: lang.font, lineHeight: moderateScale(25), marginTop: moderateScale(15), width: dimensions.WINDOW_WIDTH * 0.8 }]}>
                    اگر نمیخواین کالری شماری کنین میتونین با دریافت برنامه غذایی به هدفتون برسین
                </Text>
                <ConfirmButton
                    lang={lang}
                    title={"دریافت برنامه غذایی"}
                    style={{ marginTop: moderateScale(10), backgroundColor: defaultTheme.lightBackground, borderWidth: 1, borderColor: defaultTheme.green, width: dimensions.WINDOW_WIDTH * 0.55 }}
                    textStyle={{ color: defaultTheme.green }}
                    onPress={() => navigation.navigate("DietMainScreen", { nextRoute: "DietCategoryTab" })}

                />
            </Pressable>
        )
    }

}

export default DietGoalCard

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        // padding: moderateScale(20),
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 2.27,
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: moderateScale(10),
        padding: moderateScale(5),
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    },
    text2: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "center"
    },
    rowSpaceContainer: {
        width: "100%",
        padding: 0
    }
})