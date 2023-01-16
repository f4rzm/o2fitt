import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SectionList, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import AnalyzMealMainToolbar from '../../components/analyzMealToolbar'
import { defaultTheme } from '../../constants/theme'
import { nutritions } from '../../utils/nutritions';
import ChartAnalyzMeal from '../../components/ChartAnalyzmeal'
import { useSelector } from 'react-redux'
import DetailsMeal from '../../components/DetailMealScreen'
import { BlurView } from '@react-native-community/blur'
import Alert from '../../components/Alert'
import Toast from 'react-native-toast-message'
import { Toolbar } from '../../components'
import { ActivityScreen } from '..'

const { width } = Dimensions.get("screen")

const AnalyzMeal = (props) => {
    const { lang, budget, meal, mealName, icon } = props.route.params
    const [showPopup, setShowPopup] = useState(false);
    const [section, setSection] = useState([]);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [disabled, setDisabled] = useState(false)
    const arrayButton = [
        {
            text: lang.ok,
            color: defaultTheme.green2,
            onPress: () => setShowPopup(false),
        },
    ];
    const alertText = lang.overCalorie;
    const dataAlert = { arrayButton, alertText };


    const profile = useSelector(state => state.profile);
    const diet = useSelector(state => state.diet);

    const nutrient = new Array(34).fill(0);

    if (meal.length) {
        meal.map(item => {
            let stringArray =
                typeof item.foodNutrientValue === 'string'
                    ? item.foodNutrientValue.split(',')
                    : item.foodNutrientValue;

            let floatArray = stringArray.map(ind => parseFloat(ind));

            nutrient.map((k, index) => {
                nutrient[index] = nutrient[index] + floatArray[index];
            });
        });
    }
    useEffect(() => {
        let smallNutrient = [];
        nutrient.map((item, index) => {
            if (index !== 0 && index !== 2 && index !== 3 && index !== 4) {
                const data = {
                    name: nutritions[index][lang.langName],
                    unit: nutritions[index].unit,
                    value: nutrient[nutritions[index].id - 1].toFixed(2),
                };
                smallNutrient.push(data);
            }
        });
        setSection([{ title: lang.micronutrientFood, data: smallNutrient }]);
        setLoadingScreen(false)
        const remainingCalorie = (diet.isActive?parseInt(props.route.params.budget)*1.033:parseInt(props.route.params.budget)) - nutrient[23];
        
        if (Math.sign(remainingCalorie) === -1) {
            setTimeout(() => {
                setShowPopup(true);
            }, 1000);
        }
    }, []);

    const closePopup = () => {
        setShowPopup(false);
    };
    const renderItem = ({ item }) => {
        return (
            <View style={[styles.row, styles.container1]}>
                <Text style={[styles.name, { fontFamily: lang.font }]}>{item.name}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
                <Text style={[styles.value, { fontFamily: lang.font }]}>{item.value}</Text>
            </View>
        )
    }

    const renderHeader = () => {
        return (
            <View>
                <View style={styles.header}>
                    <Text style={[styles.headerText, { fontFamily: lang.font }]}>{lang.mealNutrient}</Text>
                </View>
                <View>
                    <ChartAnalyzMeal lang={lang} nutrient={nutrient} profile={profile} route={props.route.params} diet={diet}/>
                </View>
                <DetailsMeal meal={meal} iconMeal={icon} mealName={mealName} budget={budget} diet={diet} />
            </View>
        )
    }
    const renderSectionHeader = () => {
        return (
            <View style={styles.headersection}>
                <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, padding: moderateScale(12), fontSize: moderateScale(18) }}>{lang.micronutrientFood}</Text>
                <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, padding: moderateScale(12), fontSize: moderateScale(18) }}>{lang.get}</Text>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <Toolbar
                lang={lang}
                title={lang.mealAnalyz}
                onBack={() => props.navigation.goBack()}
            />
            {loadingScreen ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator size={"large"} />
                </View>
            ) : (
                <SectionList
                    sections={section}
                    stickySectionHeadersEnabled={true}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    renderSectionHeader={renderSectionHeader}
                    initialNumToRender={20}
                />
            )}
            {showPopup && (
                <TouchableWithoutFeedback onPress={closePopup}>
                    <View style={styles.wrapper}>
                        <BlurView
                            style={styles.absolute}
                            blurType="light"
                            blurAmount={4}
                            reducedTransparencyFallbackColor="white"
                        />
                        <Alert {...{ dataAlert, lang }} />
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        width: width,
        backgroundColor: defaultTheme.grayBackground,
        borderBottomWidth: .5,
        borderBottomColor: defaultTheme.lightGray,
    },
    headerText: {
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
        paddingVertical: moderateScale(9)
    },
    container1: {
        width: width - 50,
        alignSelf: 'center',
        borderWidth: 1.2,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        marginVertical: moderateScale(5),
        paddingVertical: moderateScale(12),

        padding: 5,
        borderRadius: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        paddingHorizontal: moderateScale(5),
        fontSize: moderateScale(16),
        color: defaultTheme.darkText
    },
    unit: {
        fontSize: moderateScale(10),
        flex: 1,
        textAlign: 'left',
    },
    value: {
        paddingHorizontal: moderateScale(5),
        fontSize: moderateScale(17),
        color: defaultTheme.darkText
    },
    headersection: {
        backgroundColor: defaultTheme.grayBackground,
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: moderateScale(21),
        borderBottomColor: defaultTheme.darkGray,
        borderBottomWidth: 0.2,
        height:moderateScale(50)
        
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})
export default AnalyzMeal
