import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    I18nManager,
    Platform,
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import {
    BodyFormoula,
    Toolbar,
    Information,
    RowSpaceAround,
    ConfirmButton,
} from '../../components';
import { moderateScale } from 'react-native-size-matters';
import Bmi from '../../../res/img/bmi.svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import LottieView from 'lottie-react-native';
// import React from 'react';
// import {
//     StyleSheet,
//     View,
//     ScrollView,
//     Text,
//     I18nManager,
//     Platform
// } from 'react-native';
// import { dimensions } from '../../constants/Dimensions';
// import { defaultTheme } from '../../constants/theme';
// import { useSelector, useDispatch } from 'react-redux'
// import { BodyFormoula, Toolbar, Information, RowSpaceAround } from '../../components';
// import { moderateScale } from 'react-native-size-matters';
// import Bmi from "../../../res/img/bmi.svg"
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import moment from "moment"
// import LottieView from 'lottie-react-native';
// import Toast from 'react-native-toast-message'


const BodyShapeScreen = props => {
    const lang = useSelector(state => state.lang);
    const user = useSelector(state => state.user);
    const specification = useSelector(state => state.specification);
    const profile = useSelector(state => state.profile);
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
            image: require('../../../res/img/bodyshape/women/hg.json'),
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
            image: require('../../../res/img/bodyshape/women/apple.json'),
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
            image: require('../../../res/img/bodyshape/women/tophour.json'),
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
            image: require('../../../res/img/bodyshape/women/pear.json'),
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
                    ? require('../../../res/img/bodyshape/men/triangle.json')
                    : require('../../../res/img/bodyshape/women/triangle.json'),
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
                    ? require('../../../res/img/bodyshape/men/it.json')
                    : require('../../../res/img/bodyshape/women/it.json'),
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
                    ? require('../../../res/img/bodyshape/men/rect.json')
                    : require('../../../res/img/bodyshape/women/rect.json'),
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
                    ? require('../../../res/img/bodyshape/men/rect.json')
                    : require('../../../res/img/bodyshape/women/rect.json'),
        },
    }).current;
    const nowMoment = moment();
    const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
    const age = React.useRef(nowMoment.diff(birthdayMoment, 'years')).current;
    const height = React.useRef(profile.heightSize).current;
    const weight = React.useRef(specification[0].weightSize).current;
    const neck = React.useRef(specification[0].neckSize).current;
    const waist = React.useRef(specification[0].waistSize).current;
    const wrist = React.useRef(specification[0].wristSize).current;
    const hip = React.useRef(specification[0].hipSize).current;
    const bust = React.useRef(specification[0].bustSize).current;
    const highHip = React.useRef(specification[0].highHipSize).current;
    const [tx, setTx] = React.useState(80);
    const [bodyType, setBodyType] = React.useState('');
    const [bodyShape, setBodyShape] = React.useState(null);
    const [BMI, setBMI] = React.useState(0);
    const [BMR, setBMR] = React.useState(0);
    const [IW, setIW] = React.useState(0);
    const [OVER, setOVER] = React.useState(0);
    const [BFP, setBFP] = React.useState(0);
    const [BF, setBF] = React.useState(0);
    const [TBW, setTBW] = React.useState(0);
    const [LBM, setLBM] = React.useState(0);
    const [IBF, setIBF] = React.useState(0);
    const [classificationBFP, setClassificationBFP] = React.useState('')
    const [errorContext, setErrorContext] = React.useState('');
    const [errorVisible, setErrorVisible] = React.useState(false);

    // console.log(profile);
    // console.log(specification);

    React.useEffect(() => {
        const factor = height / wrist;
        if (profile.gender === 1) {
            if (factor > 10.4) setBodyType(lang.ectomorph);
            else if (factor < 9.6) setBodyType(lang.endomorph);
            else setBodyType(lang.mesomorph);
        } else {
            if (factor > 11) setBodyType(lang.ectomorph);
            else if (factor < 10.1) setBodyType(lang.endomorph);
            else setBodyType(lang.mesomorph);
        }
    }, []);

    React.useEffect(() => {

        if (
            (bust - hip <= 1 * 2.54 &&
                hip - bust < 3.6 * 2.54 &&
                bust - waist >= 9 * 2.54) ||
            hip - waist >= 10 * 2.54
        ) {
            setBodyShape({ ...bodyShapes.hourGlass });
        } else if (
            hip - bust >= 3.6 * 2.54 &&
            hip - bust < 10 * 2.54 &&
            hip - waist >= 9 * 2.54 &&
            highHip / waist < 1.193
        ) {
            setBodyShape({ ...bodyShapes.apple });
        } else if (
            bust - hip > 1 * 2.54 &&
            bust - hip < 10 * 2.54 &&
            bust - waist >= 9 * 2.54
        ) {
            setBodyShape({ ...bodyShapes.topHourGlass });
        } else if (
            hip - bust > 2 * 2.54 &&
            hip - waist >= 7 * 2.54 &&
            highHip / waist >= 1.193
        ) {
            setBodyShape({ ...bodyShapes.pear });
        } else if (hip - bust >= 3.6 * 2.54 && hip - waist < 9 * 2.54) {
            setBodyShape({ ...bodyShapes.trinagle });
        } else if (bust - hip >= 3.6 * 2.54 && bust - waist < 9 * 2.54) {
            setBodyShape({ ...bodyShapes.invertedTrinagle });
        } else if (
            hip - bust < 3.6 * 2.54 &&
            bust - hip < 3.6 * 2.54 &&
            bust - waist < 9 * 2.54 &&
            hip - waist < 10 * 2.54
        ) {
            setBodyShape({ ...bodyShapes.rectangle });
        } else {
            setBodyShape({ ...bodyShapes.unknown });
            setErrorContext(lang.invalidBodyData);
            setErrorVisible(true);
        }

    }, []);

    React.useEffect(() => {
        let bfp = 0;
        let ideal = 0;
        let BMI = weight / Math.pow(height / 100, 2);

        setBMI(BMI);

        const perSlotWidth = (dimensions.WINDOW_WIDTH * 0.6) / 4;

        if (BMI > 16 && BMI < 40) {
            if (BMI >= 16 && BMI <= 18.5) {
                setTx(((BMI - 16) / 2.5) * perSlotWidth);
            } else if (BMI > 18.5 && BMI <= 25) {
                setTx(((BMI - 18.5) / 6.5) * perSlotWidth + perSlotWidth);
            } else if (BMI > 25 && BMI <= 30) {
                setTx(((BMI - 25) / 5) * perSlotWidth + 2 * perSlotWidth);
            } else if (BMI > 30 && BMI <= 40) {
                setTx(((BMI - 30) / 10) * perSlotWidth + 3 * perSlotWidth);
            }
        } else if (BMI > 40) {
            setTx(dimensions.WINDOW_WIDTH * 0.6);
        } else {
            setTx(0);
        }

        if (profile.gender == 1) {
            if (height < 152) {
                ideal = 56.2;
                setIW(56.2);
            } else {
                ideal = parseFloat(56.2 + ((height - 152) / 2.54) * 1.41);
                setIW(56.2 + ((height - 152) / 2.54) * 1.41);
            }

            setBMR(10 * weight + 6.25 * height - 5 * age + 5);

            bfp = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + Math.log10(height) * 0.15456) - 450;
            if (bfp >= 2 && bfp <= 4) {
                setClassificationBFP(lang.essentialFat)
            }
            if (bfp > 4 && bfp <= 13) {
                setClassificationBFP(lang.athletes)

            }
            if (bfp > 13 && bfp <= 17) {
                setClassificationBFP(lang.fitness)

            }
            if (bfp > 17 && bfp <= 25) {
                setClassificationBFP(lang.acceptable)

            }
            if (bfp > 25) {
                setClassificationBFP(lang.obese)

            }

            setBFP(bfp);

            setBF((bfp * weight) / 100);

            setLBM(weight - (bfp * weight) / 100);

            setOVER(weight - ideal);

            setTBW(2.447 - 0.09156 * age + 0.1074 * height + 0.3362 * weight);

            if (age <= 20) {
                setIBF(8.5);
            } else if (age <= 25) {
                setIBF(10.5);
            } else if (age <= 30) {
                setIBF(12.7);
            } else if (age <= 35) {
                setIBF(13.7);
            } else if (age <= 40) {
                setIBF(15.3);
            } else if (age <= 45) {
                setIBF(16.4);
            } else if (age <= 50) {
                setIBF(18.9);
            } else if (age > 50) {
                setIBF(20.9);
            }
        } else {
            if (height < 152) {
                ideal = 53.1;
                setIW(53.1);
            } else {
                ideal = parseFloat(53.1 + ((height - 152) / 2.54) * 1.36);
                setIW(53.1 + ((height - 152) / 2.54) * 1.36);
            }

            setBMR(10 * weight + 6.25 * height - 5 * age - 161);

            bfp =
                495 /
                (1.29579 -
                    0.35004 * Math.log10(hip + waist - neck) +
                    Math.log10(height) * 0.221) -
                450;
            if (bfp >= 10 && bfp <= 12) {
                setClassificationBFP(lang.essentialFat)
            }
            if (bfp > 12 && bfp <= 20) {
                setClassificationBFP(lang.athletes)

            }
            if (bfp > 20 && bfp <= 24) {
                setClassificationBFP(lang.fitness)

            }
            if (bfp > 24 && bfp <= 31) {
                setClassificationBFP(lang.acceptable)

            }
            if (bfp > 31) {
                setClassificationBFP(lang.obese)

            }

            setBFP(bfp);

            setBF((bfp * weight) / 100);

            setLBM(weight - bfp);

            setOVER(weight - ideal);

            setTBW(2.097 + 0.1069 * height + 0.2466 * weight);

            if (age <= 20) {
                setIBF(17.7);
            } else if (age <= 25) {
                setIBF(18.4);
            } else if (age <= 30) {
                setIBF(19.3);
            } else if (age <= 35) {
                setIBF(21.5);
            } else if (age <= 40) {
                setIBF(22.2);
            } else if (age <= 45) {
                setIBF(22.9);
            } else if (age <= 50) {
                setIBF(25.2);
            } else if (age > 50) {
                setIBF(26.3);
            }
        }
    });

    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.shapeBodyInfoTitle}
                onBack={() => props.navigation.popToTop()}
                onRightIconPressed={() => props.navigation.pop(2)}
                rightIcon={require('../../../res/img/cross2.png')}
                rightIconStyle={{ width: moderateScale(15) }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <View style={styles.headerContainer}>

                            <View>
                                <Text style={[styles.text, { fontFamily: lang.titleFont, fontSize: moderateScale(17), textAlign: "left" }]}>{lang.fullAnalys}</Text>
                                <Text style={[styles.title, { fontFamily: lang.titleFont }]}>
                                    {lang.shapeBodyType} :
                                </Text>
                                <Text style={[styles.text, { fontFamily: lang.font }]}>
                                    {bodyType}
                                </Text>

                                <Text style={[styles.title, { fontFamily: lang.titleFont }]}>
                                    {lang.shapeBodyInfo} :
                                </Text>
                                <Text style={[styles.text, { fontFamily: lang.font }]}>
                                    {bodyShape && bodyShape.name && bodyShape.name}
                                </Text>
                                <Text style={[styles.title, { fontFamily: lang.titleFont }]}>
                                    {lang.SlimmingSpeed} :
                                </Text>
                                <Text style={[styles.text, { fontFamily: lang.font, width: dimensions.WINDOW_WIDTH * 0.5 }]}>
                                    {bodyShape &&
                                        bodyShape.SlimmingSpeed &&
                                        bodyShape.SlimmingSpeed}
                                </Text>
                                <View style={styles.bottomContainer}>
                                    <BodyFormoula
                                        lang={lang}
                                        title={'BMI'}
                                        value={BMI.toFixed(1)}
                                        unit=""
                                        desc={lang.todeBadan}
                                        text1Style={{ fontSize: moderateScale(19) }}
                                        text2Style={{ fontSize: moderateScale(15) }}
                                    />

                                    <View
                                        style={{ alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start', paddingTop: Platform.OS == 'ios' ? moderateScale(23) : 0 }}>
                                        <Icon
                                            name="chevron-down"
                                            style={{
                                                fontSize: moderateScale(20),
                                                color: defaultTheme.primaryColor,
                                                transform: [
                                                    {
                                                        translateX: tx - moderateScale(10),
                                                    },
                                                ],
                                            }}
                                        />
                                        <Bmi
                                            width={dimensions.WINDOW_WIDTH * 0.6}
                                            height={dimensions.WINDOW_WIDTH * 0.5 * 0.11}
                                            preserveAspectRatio="none"
                                        />
                                        <View
                                            style={{
                                                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                width: dimensions.WINDOW_WIDTH * 0.6,
                                            }}>
                                            <Text
                                                style={[styles.text2, { fontFamily: lang.font }]}
                                                allowFontScaling={false}
                                                numberOfLines={1}>
                                                {lang.thinPerson}
                                            </Text>
                                            <Text
                                                style={[styles.text2, { fontFamily: lang.font }]}
                                                allowFontScaling={false}
                                                numberOfLines={1}>
                                                {lang.normalPerson}
                                            </Text>
                                            <Text
                                                style={[styles.text2, { fontFamily: lang.font }]}
                                                allowFontScaling={false}
                                                numberOfLines={1}>
                                                {lang.fatPerson}
                                            </Text>
                                            <Text
                                                style={[styles.text2, { fontFamily: lang.font }]}
                                                allowFontScaling={false}
                                                numberOfLines={1}>
                                                {lang.obesePerson}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {bodyShape && bodyShape.image && (
                                <View >
                                    <LottieView
                                        style={{
                                            height: moderateScale(330),
                                            right: I18nManager.isRTL ? moderateScale(10) : moderateScale(-15)

                                        }}
                                        source={bodyShape.image}
                                        autoPlay
                                        loop={true}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={[styles.headerContainer, { flexDirection: "column" }]}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText, textAlign: "left" }}>{lang.baseAnalys}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{"BMI" + " " + lang.todeBadan}</Text>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>  {BMI.toFixed(1)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{"BMR" + " " + lang.the_BMR}</Text>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>  {BMR} Kcal</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: moderateScale(8) }}>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{"TBW" + " " + lang.the_WATER}</Text>
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>  {TBW.toFixed(0)} kg </Text>
                            </View>


                        </View>
                        <View style={[styles.headerContainer, { flexDirection: "column" }]}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText, textAlign: "left" }}>{lang.fatAnalys}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{"BFP" + " " + lang.bfpDesc}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {BFP.toFixed(1) + " " + "%"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{"BMI" + " " + lang.todeBadan}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {BMI.toFixed(1) + " " + "%"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{"IBF" + " " + lang.the_IBF}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {IBF.toFixed(1) + " " + "kg"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{"LBM" + " " + lang.the_LM}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {LBM.toFixed(1) + " " + "kg"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderColor: defaultTheme.border, paddingVertical: moderateScale(8), borderBottomWidth: 1, borderColor: defaultTheme.border, }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font, width: dimensions.WINDOW_WIDTH * 0.37 }]}>{lang.AccumulationFats}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, width: dimensions.WINDOW_WIDTH * 0.4, textAlign: "right" }]}>{bodyShape &&
                                    bodyShape.AccumulationFats &&
                                    bodyShape.AccumulationFats}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.fatClassifiation}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{classificationBFP}</Text>
                            </View>
                        </View>
                        <View style={[styles.headerContainer, { flexDirection: "column" }]}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText, textAlign: "left" }}>{lang.weightAnalyze}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.fitWeight}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {IW.toFixed(1) + " " + "kg"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.currentWeight}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {weight.toFixed(1) + " " + "kg"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.the_over}</Text>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>  {(OVER.toFixed(1) <= 0 ? OVER.toFixed(1) * -1 : OVER.toFixed(1)) + " " + "kg"}</Text>
                            </View>
                        </View>
                        <View style={[styles.headerContainer, { flexDirection: "column" }]}>
                            <Text style={{ fontFamily: lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText, textAlign: "left" }}>{lang.appliedInformation}</Text>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.shapeBodySport}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.suitableExcersises &&
                                    bodyShape.suitableExcersises}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.shapeBodyFood}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.desirableFoods &&
                                    bodyShape.desirableFoods}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.harmfulFoods}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.harmfulFoods &&
                                    bodyShape.harmfulFoods}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.shapeBodyBad}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.susceptibleDiseases &&
                                    bodyShape.susceptibleDiseases}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.AccumulationFats}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.AccumulationFats &&
                                    bodyShape.AccumulationFats}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", borderBottomWidth: 1, borderColor: defaultTheme.border, paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.CommonTendencies}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.CommonTendencies &&
                                    bodyShape.CommonTendencies}</Text>
                            </View>
                            <View style={{ alignItems: "baseline", paddingVertical: moderateScale(8) }}>
                                <Text style={[styles.containerTexts, { fontFamily: lang.font }]}>{lang.ImproperDietResult}</Text>
                                <Text style={[styles.containerTexts2, { fontFamily: lang.font, color: defaultTheme.mainText, }]}>{bodyShape &&
                                    bodyShape.ImproperDietResult &&
                                    bodyShape.ImproperDietResult}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: moderateScale(45) }} />
            </ScrollView>
            <View style={{ bottom: 5, position: "absolute", alignItems: "center", width: dimensions.WINDOW_WIDTH }}>
                <ConfirmButton
                    lang={lang}
                    style={{ backgroundColor: defaultTheme.green }}
                    title={lang.editBodyShape}
                    onPress={() => {
                        props.navigation.navigate("EditBodyScreen")
                    }}
                />
            </View>
            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />
        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,

        //   flexDirection :"row",
    },
    subContainer: {
        // flex : 1.7,
        alignItems: 'center',
        alignItems: 'flex-start',
    },
    subContainer2: {
        position: 'absolute',
    },
    title: {
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
        marginBottom: moderateScale(3),
        marginTop: moderateScale(15),
        marginLeft: moderateScale(12),
        textAlign: 'left',
    },
    title2: {
        fontSize: moderateScale(17),
        color: defaultTheme.gray,
    },
    text: {
        fontSize: moderateScale(14),
        color: defaultTheme.lightGray2,
        marginHorizontal: moderateScale(16),
        lineHeight: moderateScale(22),
        textAlign: "left"
    },
    bottomContainer: {
        padding: moderateScale(8),
        alignItems: 'center',
    },
    bmiContainer: {
        alignItems: 'center',
        padding: moderateScale(10),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        borderWidth: 1.2,
        margin: moderateScale(8),
    },
    rowContainer: {
        flexDirection: 'row',
        width: dimensions.WINDOW_WIDTH * 0.6,
    },
    row: {
        flex: 1,
        paddingVertical: moderateScale(3),
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: "row",
        width: dimensions.WINDOW_WIDTH * .9,
        backgroundColor: defaultTheme.white,
        elevation: 4,
        justifyContent: "space-between",
        borderRadius: 15,
        alignSelf: 'center',
        padding: moderateScale(10),
        marginVertical: moderateScale(15),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 2.27,
    },
    containerTexts: {
        textAlign: "left",
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    },
    containerTexts2: {
        lineHeight: moderateScale(23),
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign: "left"
    }
});

export default BodyShapeScreen;
