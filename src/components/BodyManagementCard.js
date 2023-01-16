import React, { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { useSelector } from "react-redux"
import { defaultTheme } from "../constants/theme"
import { universalStyles } from "../constants/universalStyles"

const BodyManagementCard = props => {
    const specification = useSelector((state) => state.specification);
    const profile = useSelector((state) => state.profile);
    let ideal = 80
    const [IW, setIW] = React.useState(52)
    const lang = props.lang
    const [bodyShape, setBodyShape] = React.useState(null);

    const bodyShapes = React.useRef({
        hourGlass: {
            name: lang.hourGlass,
            desirableFoods: lang.hgdf,
            harmfulFoods: lang.hghf,
            susceptibleDiseases: lang.hgsd,
            suitableExcersises: lang.hgss,
            AccumulationFats: lang.HGAccumulationFats,
            SlimmingSpeed: lang.HGSlimmingSpeed,
            CommonTendencies: lang.HGCommonTendencies,
            ImproperDietResult: lang.HGImproperDietResult,
            image: require('../../res/img/bodyshape/women/hg.json'),
        },
        apple: {
            name: lang.apple,
            desirableFoods: lang.apdf,
            harmfulFoods: lang.aphf,
            susceptibleDiseases: lang.apsd,
            suitableExcersises: lang.apss,
            AccumulationFats: lang.APAccumulationFats,
            SlimmingSpeed: lang.APSlimmingSpeed,
            CommonTendencies: lang.APCommonTendencies,
            ImproperDietResult: lang.APImproperDietResult,
            image: require('../../res/img/bodyshape/women/apple.json'),
        },
        topHourGlass: {
            name: lang.topHourGlass,
            desirableFoods: lang.thgdf,
            harmfulFoods: lang.thghf,
            susceptibleDiseases: lang.thgsd,
            suitableExcersises: lang.thgss,
            AccumulationFats: lang.THGAccumulationFats,
            SlimmingSpeed: lang.THGSlimmingSpeed,
            CommonTendencies: lang.THGCommonTendencies,
            ImproperDietResult: lang.THGImproperDietResult,
            image: require('../../res/img/bodyshape/women/tophour.json'),
        },
        pear: {
            name: lang.pear,
            desirableFoods: lang.pedf,
            harmfulFoods: lang.pehf,
            susceptibleDiseases: lang.pesd,
            suitableExcersises: lang.pess,
            AccumulationFats: lang.PEAccumulationFats,
            SlimmingSpeed: lang.PESlimmingSpeed,
            CommonTendencies: lang.PECommonTendencies,
            ImproperDietResult: lang.PEImproperDietResult,
            image: require('../../res/img/bodyshape/women/pear.json'),
        },
        trinagle: {
            name: lang.triangle,
            desirableFoods: lang.trdf,
            harmfulFoods: lang.trhf,
            susceptibleDiseases: lang.trsd,
            suitableExcersises: lang.trss,
            AccumulationFats: lang.TRAccumulationFats,
            SlimmingSpeed: lang.TRSlimmingSpeed,
            CommonTendencies: lang.TRCommonTendencies,
            ImproperDietResult: lang.TRImproperDietResult,
            image:
                profile.gender == 1
                    ? require('../../res/img/bodyshape/men/triangle.json')
                    : require('../../res/img/bodyshape/women/triangle.json'),
        },
        invertedTrinagle: {
            name: lang.invertedTriangle,
            desirableFoods: lang.rtrdf,
            harmfulFoods: lang.rtrhf,
            susceptibleDiseases: lang.rtrsd,
            suitableExcersises: lang.rtrss,
            AccumulationFats: lang.RTRAccumulationFats,
            SlimmingSpeed: lang.RTRSlimmingSpeed,
            CommonTendencies: lang.RTRCommonTendencies,
            ImproperDietResult: lang.RTRImproperDietResult,
            image:
                profile.gender == 1
                    ? require('../../res/img/bodyshape/men/it.json')
                    : require('../../res/img/bodyshape/women/it.json'),
        },
        rectangle: {
            name: lang.rectangle,
            desirableFoods: lang.rcdf,
            harmfulFoods: lang.rchf,
            susceptibleDiseases: lang.rcsd,
            suitableExcersises: lang.rcss,
            AccumulationFats: lang.RCAccumulationFats,
            SlimmingSpeed: lang.RCSlimmingSpeed,
            CommonTendencies: lang.RCCommonTendencies,
            ImproperDietResult: lang.RCImproperDietResult,
            image:
                profile.gender == 1
                    ? require('../../res/img/bodyshape/men/rect.json')
                    : require('../../res/img/bodyshape/women/rect.json'),
        },
        unknown: {
            name: lang.unknown,
            desirableFoods: lang.unknown,
            harmfulFoods: lang.unknown,
            susceptibleDiseases: lang.unknown,
            suitableExcersises: lang.unknown,
            AccumulationFats: lang.unknown,
            SlimmingSpeed: lang.unknown,
            CommonTendencies: lang.unknown,
            ImproperDietResult: lang.unknown,
            image:
                profile.gender == 1
                    ? require('../../res/img/bodyshape/men/rect.json')
                    : require('../../res/img/bodyshape/women/rect.json'),
        },
    }).current;

    let bfp = ""

    if (!isNaN(parseFloat(specification[0].waistSize)) && specification[0].waistSize != 0 && !isNaN(parseFloat(specification[0].neckSize)) && specification[0].neckSize != 0 && !isNaN(parseFloat(specification[0].hipSize)) && specification[0].hipSize != 0) {
        if (props.profile.gender == 1) {
            bfp = ((495 / ((1.0324 - 0.19077 * Math.log10(specification[0].waistSize - specification[0].neckSize) + Math.log10(profile.heightSize) * 0.15456))) - 450).toFixed(1)
        }
        else {
            bfp = ((495 / ((1.29579 - 0.35004 * Math.log10(specification[0].hipSize + specification[0].waistSize - specification[0].neckSize) + Math.log10(profile.heightSize) * 0.22100))) - 450).toFixed(1)
        }
    }

    if (props.profile.gender === 1) {//man
        if (profile.heightSize < 152) {
            ideal = 56.2
        }
        else {
            ideal = (56.2 + (((profile.heightSize - 152) / 2.54) * 1.41)).toFixed(1)
        }
    }
    else {
        if (profile.heightSize < 152) {
            ideal = 53.1
        }
        else {
            ideal = (53.1 + (((profile.heightSize - 152) / 2.54) * 1.36)).toFixed(1)
            console.log("ideal 2=> ", ideal)
        }
    }

    React.useEffect(() => {
        if (!props.profile.gender === 1) {
            if (specification[0].bustSize - specification[0].hipSize >= 3.6 * 2.54 && specification[0].bustSize - specification[0].waistSize < 9 * 2.54) {
                setBodyShape({ ...bodyShapes.invertedTrinagle });
            } else if (specification[0].hipSize - specification[0].bustSize >= 3.6 * 2.54 && specification[0].hipSize - specification[0].waistSize < 9 * 2.54) {
                setBodyShape({ ...bodyShapes.trinagle });
            } else if (
                specification[0].hipSize - specification[0].bustSize < 3.6 * 2.54 &&
                specification[0].bustSize - specification[0].hipSize < 3.6 * 2.54 &&
                specification[0].bustSize - specification[0].waistSize < 9 * 2.54 &&
                specification[0].hipSize - specification[0].waistSize < 10 * 2.54
            ) {
                setBodyShape({ ...bodyShapes.rectangle });
            } else {
                setBodyShape({ ...bodyShapes.unknown });
            }
        } else {
            if (
                (specification[0].bustSize - specification[0].hipSize <= 1 * 2.54 &&
                    specification[0].hipSize - specification[0].bustSize < 3.6 * 2.54 &&
                    specification[0].bustSize - specification[0].waistSize >= 9 * 2.54) ||
                    specification[0].hipSize - specification[0].waistSize >= 10 * 2.54
            ) {
                setBodyShape({ ...bodyShapes.hourGlass });
            } else if (
                specification[0].hipSize - specification[0].bustSize >= 3.6 * 2.54 &&
                specification[0].hipSize - specification[0].bustSize < 10 * 2.54 &&
                specification[0].hipSize - specification[0].waistSize >= 9 * 2.54 &&
                specification[0].highHipSize / specification[0].waistSize < 1.193
            ) {
                setBodyShape({ ...bodyShapes.apple });
                console.error("apple")
            } else if (
                specification[0].bustSize - specification[0].hipSize > 1 * 2.54 &&
                specification[0].bustSize - specification[0].hipSize < 10 * 2.54 &&
                specification[0].bustSize - specification[0].waistSize >= 9 * 2.54
            ) {
                setBodyShape({ ...bodyShapes.topHourGlass });
            } else if (
                specification[0].hipSize - specification[0].bustSize > 2 * 2.54 &&
                specification[0].hipSize - specification[0].waistSize >= 7 * 2.54 &&
                specification[0].highHipSize / specification[0].waistSize >= 1.193
            ) {
                setBodyShape({ ...bodyShapes.pear });
            } else if (specification[0].hipSize - specification[0].bustSize >= 3.6 * 2.54 && specification[0].hipSize - specification[0].waistSize < 9 * 2.54) {
                setBodyShape({ ...bodyShapes.trinagle });
            } else if (specification[0].bustSize - specification[0].hipSize >= 3.6 * 2.54 && specification[0].bustSize - specification[0].waistSize < 9 * 2.54) {
                setBodyShape({ ...bodyShapes.invertedTrinagle });
            } else if (
                specification[0].hipSize - specification[0].bustSize < 3.6 * 2.54 &&
                specification[0].bustSize - specification[0].hipSize < 3.6 * 2.54 &&
                specification[0].bustSize - specification[0].waistSize < 9 * 2.54 &&
                specification[0].hipSize - specification[0].waistSize < 10 * 2.54
            ) {
                setBodyShape({ ...bodyShapes.rectangle });
            } else {
                setBodyShape({ ...bodyShapes.unknown });
            }
        }
        if (profile.gender == 1) {

            if (profile.heightSize < 152) {
                ideal = 56.2;
                setIW(56.2);
            } else {
                ideal = parseFloat(56.2 + ((profile.heightSize - 152) / 2.54) * 1.41);
                setIW(56.2 + ((profile.heightSize - 152) / 2.54) * 1.41);
            }
        } else {
            if (profile.heightSize < 152) {
                ideal = 53.1;
                setIW(53.1);
            } else {
                ideal = parseFloat(53.1 + ((profile.heightSize - 152) / 2.54) * 1.36);
                setIW(53.1 + ((profile.heightSize - 152) / 2.54) * 1.36);
            }
        }
        console.error('s');
    }, [props.specification]);

    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={1} onPress={props.onCardPressed}>
            {
                specification[0].waistSize == 0 || specification[0].neckSize == 0 || specification[0].hipSize == 0 || specification[0].bustSize == 0 ?
                    <>
                        <View style={[styles.leftContainer, { flex: 6, }]}>
                            <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                                {
                                    props.lang.golFittBoy
                                }
                            </Text>
                            <View style={{ flex: 6, }}>
                                <Text style={{ padding: moderateScale(15), fontFamily: props.lang.font, fontSize: moderateScale(15), color: defaultTheme.mainText, lineHeight: moderateScale(23), color: props.lang.langName == "persian" ? defaultTheme.mainText : defaultTheme.darkText,textAlign:"left" }}>{props.lang.clickForAnalyse}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: "center", flex: 2, height: "100%", justifyContent: "center", }}>
                            <Image
                                source={require("../../res/img/body_manage.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    </>
                    : <>
                        <View style={styles.leftContainer}>
                            <Text style={[styles.text, { fontFamily: props.lang.titleFont, marginHorizontal: moderateScale(16) }]} allowFontScaling={false}>
                                {
                                    props.lang.golFittBoy
                                }
                            </Text>
                            <TouchableOpacity onPress={props.onPress}>
                                <View style={styles.button}>
                                    <Text style={[styles.text4, { fontFamily: props.lang.font, color: props.lang.langName == "persian" ? defaultTheme.mainText : defaultTheme.darkText }]} allowFontScaling={false}>
                                        {props.lang.shapeBodybot}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.rightContainer}>

                            <View style={styles.container}>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={[styles.text3, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                                        {
                                            props.lang.shapeBodyInfo
                                        }
                                    </Text>
                                    <Text style={[styles.text2, { fontFamily: props.lang.font, color: props.lang.langName == "persian" ? defaultTheme.mainText : defaultTheme.darkText }]} allowFontScaling={false}>
                                        {bodyShape == null ? "" : bodyShape.name}
                                    </Text>
                                </View>

                                <View style={{ marginHorizontal: moderateScale(20), alignItems: "center" }}>
                                    <Text style={[styles.text3, { fontFamily: props.lang.font, fontSize: moderateScale(18), color: props.lang.langName == "persian" ? defaultTheme.mainText : defaultTheme.darkText }]} allowFontScaling={false}>
                                        BMI
                                    </Text>
                                    <Text style={[styles.text2, { fontFamily: props.lang.font, color: props.lang.langName == "persian" ? defaultTheme.mainText : defaultTheme.darkText }]} allowFontScaling={false}>
                                        {
                                            " " + parseFloat((props.specification[0].weightSize / Math.pow(profile.heightSize / 100, 2))).toFixed(1)
                                        }
                                    </Text>
                                </View>

                                <Image
                                    source={require("../../res/img/body_manage.png")}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>

                        </View>
                    </>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: universalStyles.homeScreenCards,
    rightContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        marginHorizontal: moderateScale(70)
    },
    leftContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: moderateScale(15)
    },
    container2: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    container3: {
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        padding: 6
    },
    text: {
        fontSize: moderateScale(16),
        color: defaultTheme.darkText

    },
    text2: {
        fontSize: moderateScale(17),
        marginVertical: 5,
        color: defaultTheme.darkText
    },
    text3: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText
    },
    text4: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText

    },
    button: {
        width: moderateScale(95),
        height: moderateScale(35),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: defaultTheme.lightBackground,
        borderWidth: 1.2,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(8),
        marginVertical: moderateScale(20),
        marginHorizontal: moderateScale(5)
    },
    image: {
        width: moderateScale(55),
        height: moderateScale(55),
    }

})

export default BodyManagementCard