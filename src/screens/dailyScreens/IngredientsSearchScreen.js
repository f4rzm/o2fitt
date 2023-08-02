import React from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    Text,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchToolbar, SearchFoodRow, Information, ConfirmButton, SearchNoResult } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
import { moderateScale } from "react-native-size-matters"
import { dimensions } from '../../constants/Dimensions';
import LottieView from 'lottie-react-native';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';

PouchDB.plugin(pouchdbSearch)
const ingredientHistoryDB = new PouchDB('ingredientHistory', { adapter: 'react-native-sqlite' })

let pageNumber = 0
let timeOut = null

const IngredientsSearchScreen = props => {
    const lang = useSelector(state => state.lang)
    const auth = useSelector(state => state.auth)
    const [searchText, setText] = React.useState("")
    const [ingredients, setIngredients] = React.useState([])
    const [history, setHistory] = React.useState([])
    const [isLoading, setLoading] = React.useState(false)
    const [isWaitingForType, setIsWaitingForType] = React.useState(false)
    const [errorVisible, setErrorVisible] = React.useState(false)
    const [errorContext, setErrorContext] = React.useState("")
    const [isLastData, setIsLastData] = React.useState(false)

    React.useEffect(() => {
        ingredientHistoryDB.allDocs({
            include_docs: true,
            limit: 10,
            descending: true
        }).then((res) => {
            let records = res.rows.map(item => item.doc)
            setHistory(records)
        })
    })

    const onTextChanged = text => {
        pageNumber = 0
        setText(text)
        setIsWaitingForType(true)
        AsyncStorage.setItem("ingredientSearchText", text)
        if (text.length > 1) {
            timeOut && clearTimeout(timeOut)
            timeOut = setTimeout(async () => {
                const sText = await AsyncStorage.getItem("ingredientSearchText")
                if (sText && sText != "") {
                    setIsWaitingForType(false)
                    search(text)
                    setIsLastData(false)
                }
            }, 700);
        }
        else if (text.length === 0) {
            setIngredients([])
        }
    }

    const search = (text) => {
        setLoading(true)
        pageNumber++
        const url = urls.foodBaseUrl + urls.ingredient + urls.search + `?name=${encodeURI(text)}&Page=${pageNumber}&PageSize=20`
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = {}

        const RC = new RestController()
        RC.checkPrerequisites("get", url, params, header, getSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)

    }

    const getSuccess = async (response) => {
        console.log(response.data.items)

        const sText = AsyncStorage.getItem("ingredientSearchText")
        setLoading(false)
        if (sText && sText != "") {
            if (pageNumber > 1) {
                setIngredients([...ingredients, ...response.data.data.items])
            }
            else {
                setIngredients(response.data.data.items)
            }
            if (response.data.data.items.length < 20) {
                setIsLastData(true)
            }
        }
    }

    const getFailure = () => {
        setLoading(false)
        setErrorVisible(true)
        setErrorContext(lang.serverError)
    }

    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    const onPress = item => {
        console.log(item)
        ingredientHistoryDB.put({ _id: item.id.toString(), ...item })
        props.navigation.navigate("IngredientAmountScreen", { ingredient: item, addIngredient: props.route.params.addIngredient })
    }

    return (
        <>
            <SearchToolbar
                lang={lang}
                title={lang.searchItemFoodTitle2}
                onChangeText={onTextChanged}
                goBack={() => props.navigation.goBack()}
                placeholder={lang.ingredientSearchHint}
                value={searchText}
                onVoice={search => onTextChanged(search)}
                setTextEmpty={()=>setText("")}
            />
            <ScrollView >
                {
                    (searchText.length > 1 && ingredients.length === 0 && !isLoading && !isWaitingForType) ?

                        <SearchNoResult lang={lang} />
                        :
                        <>
                            {
                                searchText.length > 0 &&
                                ingredients.map((item, index) => {
                                    return (
                                        <SearchFoodRow
                                            lang={lang}
                                            item={item}
                                            key={item.id.toString()}
                                            onPress={onPress}
                                        />
                                    )
                                })
                            }
                            {
                                isLoading ?
                                    <ActivityIndicator
                                        style={styles.loading}
                                        color={defaultTheme.primaryColor}
                                        size="large"
                                    /> :
                                    (!isLastData && searchText.length > 0 && ingredients.length > 0) ?
                                        <ConfirmButton
                                            lang={lang}
                                            style={styles.moreBtn}
                                            title={lang.moreView}
                                            onPress={() => search(searchText)}
                                        /> :
                                        !isLastData && history.length === 0 ?
                                            <View
                                                style={{
                                                    alignSelf: "center"
                                                }}
                                            >
                                                <LottieView
                                                    style={{
                                                        width: dimensions.WINDOW_WIDTH * 0.4,
                                                        marginVertical: moderateScale(25),
                                                    }}
                                                    source={require('../../../res/animations/injoori.json')}
                                                    autoPlay
                                                    loop={true}
                                                />
                                            </View>
                                            :
                                            (searchText.length === 0) ?
                                                history.map(item => (
                                                    <SearchFoodRow
                                                        lang={lang}
                                                        item={item}
                                                        key={item.id.toString()}
                                                        onPress={onPress}
                                                    />
                                                )) :
                                                null
                            }
                        </>
                }
            </ScrollView>
            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />
            {
                errorVisible &&
                <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
                    <View style={styles.wrapper}>
                        <BlurView
                            style={styles.absolute}
                            blurType="light"
                            blurAmount={9}
                            // blurRadius={9}
                        />
                    </View>
                </TouchableWithoutFeedback>
            }
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
    loading: {
        marginTop: moderateScale(50),
        alignSelf: "center"
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.gray,
        alignSelf: "center",
        marginTop: moderateScale(dimensions.WINDOW_WIDTH * 0.2)
    },
    moreBtn: {
        width: moderateScale(130),
        height: moderateScale(37),
        backgroundColor: defaultTheme.green,
        margin: moderateScale(25),
        marginHorizontal: moderateScale(20),
        alignSelf: "center"
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
});

export default IngredientsSearchScreen;
