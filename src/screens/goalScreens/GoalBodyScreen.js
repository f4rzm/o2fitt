import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    I18nManager,
    ScrollView,
    BackHandler
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { ConfirmButton, RowSpaceAround, RowWrapper, TwoOptionModal } from '../../components';
import moment from "moment"
import LinearGradient from 'react-native-linear-gradient';

const GoalBodyScreen = props => {

    const lang = useSelector(state => state.lang)
    const profile = useSelector(state => state.profile)
    const specification = useSelector(state => state.specification)
    const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)

    const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

    React.useEffect(() => {
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus', () => {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.navigate("GoalWeightScreen"); return true })
        })

        const blurUnsubscribe = props.navigation.addListener('blur', () => {
            backHandler && backHandler.remove()
        })

        return () => {
            backHandler && backHandler.remove()
            focusUnsubscribe()
            blurUnsubscribe()
        }
    }, [])

    const editGoal = () => {
        if (hasCredit) {
            props.navigation.navigate("EditGoalBodyScreen")
        }
        else {
            goToPackages()
        }
    }

    const goToPackages = () => {
        setTimeout(() => {
            props.navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }

    return (
        <View style={styles.mainContainer}>
            <RowSpaceAround style={styles.titleContainer}>
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {lang.limbBody}
                </Text>
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {lang.gol}
                </Text>
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {lang.perWeight}
                </Text>
                <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
                    {lang.now}
                </Text>
                <Text style={[styles.title, { fontFamily: lang.titleFont, marginEnd: moderateScale(23) }]} allowFontScaling={false}>
                    {lang.change}
                </Text>
            </RowSpaceAround>
            <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: moderateScale(50) }} showsVerticalScrollIndicator={false}>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfSine}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetBust}</DigitText>

                    <DigitText lang={lang}>{specification[1].bustSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].bustSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].bustSize}
                        oldValue={specification[1].bustSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfGardan}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetNeckSize}</DigitText>

                    <DigitText lang={lang}>{specification[1].neckSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].neckSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].neckSize}
                        oldValue={specification[1].neckSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfBazoo}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetArm}</DigitText>

                    <DigitText lang={lang}>{specification[1].armSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].armSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].armSize}
                        oldValue={specification[1].armSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfKamar}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetWaist}</DigitText>

                    <DigitText lang={lang}>{specification[1].waistSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].waistSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].waistSize}
                        oldValue={specification[1].waistSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfShekam}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetHighHip}</DigitText>

                    <DigitText lang={lang}>{specification[1].highHipSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].highHipSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].highHipSize}
                        oldValue={specification[1].highHipSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfShane}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetShoulder}</DigitText>

                    <DigitText lang={lang}>{specification[1].shoulderSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].shoulderSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].highHipSize}
                        oldValue={specification[1].highHipSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfBasan}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetHip}</DigitText>

                    <DigitText lang={lang}>{specification[1].hipSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].hipSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].hipSize}
                        oldValue={specification[1].hipSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfRan}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetThighSize}</DigitText>

                    <DigitText lang={lang}>{specification[1].thighSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].thighSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].thighSize}
                        oldValue={specification[1].thighSize}
                    />
                </RowSpaceAround>
                <RowSpaceAround>
                    <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {lang.sizeOfMoche}
                    </Text>

                    <DigitText lang={lang} color={defaultTheme.green}>{profile.targetWrist}</DigitText>

                    <DigitText lang={lang}>{specification[1].wristSize}</DigitText>

                    <DigitText lang={lang}>{specification[0].wristSize}</DigitText>

                    <ChangeRateText
                        lang={lang}
                        currentValue={specification[0].wristSize}
                        oldValue={specification[1].wristSize}
                    />
                </RowSpaceAround>
            </ScrollView>
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.buttonGradient}>
                <View style={{zIndex:50,height:moderateScale(60),bottom:moderateScale(60)}}>
                    <ConfirmButton
                        lang={lang}
                        style={styles.editButton}
                        title={lang.editGolTitle}
                        leftImage={require("../../../res/img/edit.png")}
                        onPress={editGoal}
                    /></View>
            </LinearGradient>
            <View style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(50) }} />

            <TwoOptionModal
                lang={lang}
                visible={optionalDialogVisible}
                onRequestClose={() => setOptionalDialogVisible(false)}
                context={lang.subscribe1}
                button1={lang.iBuy}
                button2={lang.motevajeShodam}
                button1Pressed={goToPackages}
                button2Pressed={() => setOptionalDialogVisible(false)}
            />
        </View>
    );
};

const DigitText = (props) => {
    if (props.children) {
        return (
            <Text style={[styles.text, { fontFamily: props.lang.font, color: props.color ? props.color : defaultTheme.darkText }]} allowFontScaling={false}>
                <Text style={[styles.number, { fontFamily: props.lang.font, color: props.color ? props.color : defaultTheme.darkText }]}>{props.children}</Text> cm
            </Text>
        )
    }
    return (
        <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
            -
        </Text>
    )
}

const ChangeRateText = props => {
    if ((props.oldValue && props.currentValue)) {
        const diff = parseFloat(props.currentValue) - parseFloat(props.oldValue)
        return (
            <RowWrapper>
                <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                    <Text style={[styles.number, { fontFamily: props.lang.font }]}>
                        {
                            Math.abs(diff).toFixed(1)
                        }
                    </Text> cm
                </Text>
                {
                    diff != 0 ?
                        <Image
                            source={diff < 0 ? require("../../../res/img/down.png") : require("../../../res/img/up.png")}
                            style={styles.img}
                            resizeMode="contain"
                        /> :
                        <View style={styles.img} />
                }
            </RowWrapper>
        )
    }
    return (
        <RowWrapper>
            <Text style={[styles.text, { fontFamily: props.lang.font }]} allowFontScaling={false}>
                -
            </Text>
        </RowWrapper>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(15),
        marginHorizontal: moderateScale(3),
        width: dimensions.WINDOW_WIDTH * 0.2,
        textAlign: "center"
    },
    text: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(15),
        marginHorizontal: moderateScale(3),
        width: dimensions.WINDOW_WIDTH * 0.2,
        textAlign: "center"
    },
    number: {
        color: defaultTheme.darkText,
        fontSize: moderateScale(18),
        marginHorizontal: moderateScale(3)
    },
    titleContainer: {
        backgroundColor: defaultTheme.grayBackground,
        marginVertical: 0,
        paddingVertical: moderateScale(8)
    },
    rowContainer: {
        paddingHorizontal: moderateScale(16)
    },
    customInput: {
        maxWidth: moderateScale(90),
        height: moderateScale(40),
        minHeight: moderateScale(30),
        borderWidth: 0,
    },
    textInput: {
        fontSize: moderateScale(14)
    },
    dropDownText: {
        color: defaultTheme.gray,
        fontSize: moderateScale(13),
        marginVertical: moderateScale(8)
    },
    editButton: {
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
        marginVertical: moderateScale(15),
    },
    back: {
        width: moderateScale(20),
        height: moderateScale(16),
        marginTop: moderateScale(16),
        transform: [
            { scaleX: I18nManager.isRTL ? 1 : -1 }
        ]
    },
    columContainer: {
        borderTopWidth: 1.2,
        borderBottomWidth: 1.2,
        borderColor: defaultTheme.border,
        marginVertical: 0
    },
    caloryContainer: {
        margin: moderateScale(5),
        alignItems: "center"
    },
    caloryWrapper: {
        width: moderateScale(55),
        height: moderateScale(55),
        borderRadius: moderateScale(28),
        backgroundColor: defaultTheme.primaryColor,
        margin: moderateScale(20),
        marginVertical: moderateScale(8),
        justifyContent: "center",
        alignItems: "center"
    },
    caloryText: {
        fontSize: moderateScale(17),
        color: defaultTheme.darkText
    },
    circle: {
        width: moderateScale(17),
        height: moderateScale(17),
        borderRadius: moderateScale(9),
        margin: moderateScale(8)
    },
    img: {
        width: moderateScale(15),
        height: moderateScale(25)
    },
    buttonGradient: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: moderateScale(50),
        paddingBottom: moderateScale(70)
    }

});

export default GoalBodyScreen;
