import React from 'react';
import {
    StyleSheet,
    Text,
    BackHandler,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SearchFoodHeader, SearchFoodRow, ConfirmButton, RowWrapper, SearchNoResult, TwoOptionModal } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import moment from "moment"
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { dimensions } from '../../constants/Dimensions';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import More from '../../../res/img/ic_more_24px.svg'

PouchDB.plugin(pouchdbSearch)
const searchHistoryDB = new PouchDB('searchHistory', { adapter: 'react-native-sqlite' })

const SearchMainTab = props => {
    const lang = useSelector(state => state.lang)
    const app = useSelector(state => state.app)
    const profile = useSelector(state => state.profile)
    const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
    let allData = [[], [], [], []]
    const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
    const today = moment()
    const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

    React.useEffect(() => {
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus', () => {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.popToTop(); return true })
            props.setFoodType("")
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

    const meal = React.useRef({
        foodId: 0,
        foodMeal: props.mealId
    }).current

    const onFoodPressed = async (food) => {
        const date = await AsyncStorage.getItem("homeDate")
        props.navigation.navigate("FoodDetailScreen", { meal: { ...meal, foodId: food.foodId, foodName: food.name }, food: { ...food, foodName: food.name }, date: date })
        searchHistoryDB.put({ ...food, _id: food.foodId.toString() })
    }

    const goToPackages = () => {
        setOptionalDialogVisible(false)
        setTimeout(() => {
            props.navigation.navigate("PackagesScreen")
        }, Platform.OS === "ios" ? 500 : 50)
    }

    props.searchResult.map(res => {
        let i = parseInt(res.foodType)
        i = i === 2 ? 1 : i
        let data = [...allData[i]]

        data.push(res)
        allData[i] = data
    })

    console.log("isSearch", props.isSearch)
    console.log("isSearchOnline", props.isSearchOnline)
    console.log("isLastData", props.isLastData)
    console.log("searchText", props.searchText)
    console.log("allData", allData)
    return (
        <>
            {
                props.isSearchOnline &&
                <RowWrapper style={{ alignSelf: "center", marginVertical: moderateScale(25) }}>
                    <ActivityIndicator
                        size="large"
                        color={defaultTheme.green}
                        style={{ marginHorizontal: moderateScale(16) }}
                    />
                    <Text style={[{ fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                            lang.onlineSearch
                        }
                    </Text>
                </RowWrapper>
            }
            <ScrollView keyboardShouldPersistTaps="handled">
                {
                    (props.searchText != "" || (allData[0].length > 0 || allData[1].length > 0 || allData[2].length > 0 || allData[3].length > 0)) ?
                        allData.map((item, index) => (
                            item.length > 0 &&
                            (
                                <>
                                    <SearchFoodHeader
                                        lang={lang}
                                        key={index.toString()}
                                        title={index === 0 ? "" : index === 1 ? lang.foodAndItemFood : index === 2 ? lang.restaurant : lang.market}
                                        // onPress={index === 0 ? () => false : index === 1 ? () => props.navigation.navigate("SearchCookingTab") : index === 3 ? () => props.navigation.navigate("SearchMarketTab") : () => false}
                                    />
                                    {
                                        item.map((f, i) => (
                                            <SearchFoodRow
                                                lang={lang}
                                                item={{ ...f, foodMeal: props.mealId, foodName: item.name }}
                                                key={f.foodId.toString() + i}
                                                onPress={onFoodPressed}
                                                isShowingNutirent={true}
                                            />
                                        ))
                                    }
                                </>
                            )
                        )
                        ) :
                        <>
                            <LottieView
                                style={{
                                    width: dimensions.WINDOW_WIDTH * 0.4,
                                    marginVertical: moderateScale(25),
                                    alignSelf: "center",
                                }}
                                source={require('../../../res/animations/injoori.json')}
                                autoPlay
                                loop={true}
                            />
                            <Text style={[styles.text, { fontFamily: lang.font }]}>
                                {lang.searchyourfoodtitle}
                            </Text>
                        </>

                }
                {
                    (props.searchText != "" && !props.isLastData && props.searchResult.length > 15 && !props.isSearch && (!props.isSearchOnline && app.networkConnectivity)) &&
                    <ConfirmButton
                        lang={lang}
                        style={styles.moreBtn}
                        title={lang.moreView}
                        onPress={props.moreResult}
                        leftSvg={<More style={{}} />}
                        textStyle={{fontSize:moderateScale(16),top:moderateScale(-3)}}
                    />
                }
                {
                    (props.searchText.length > 1 && props.searchResult.length === 0 && !props.isSearch) &&
                    <SearchNoResult lang={lang} />
                }
            </ScrollView>
            <TouchableOpacity
                style={styles.barcode}
                onPress={() => props.navigation.navigate("BarcodeScreen", { foodMeal: props.mealId })}
            >
                <LottieView
                    style={{
                        width: moderateScale(65),
                        height: moderateScale(65),
                        alignSelf: "center",
                    }}
                    source={require('../../../res/animations/barcode.json')}
                    autoPlay
                    loop={false}
                />
            </TouchableOpacity>

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
        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: defaultTheme.green,
    },
    barcode: {
        position: "absolute",
        bottom: "5%",
        right: "5%",
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    barcodeImg: {
        width: moderateScale(30),
        height: moderateScale(30),
        tintColor: defaultTheme.lightBackground
    },
    moreBtn: {
        width: moderateScale(150),
        height: moderateScale(37),
        backgroundColor: defaultTheme.green,
        margin: moderateScale(25),
        marginHorizontal: moderateScale(20),
        alignSelf: "center"
    },
    text: {
        textAlign: "center",
        marginTop: "3%",
        paddingHorizontal: "5%",
        fontSize: moderateScale(14),
        lineHeight: moderateScale(25),

    }
});

export default SearchMainTab;
