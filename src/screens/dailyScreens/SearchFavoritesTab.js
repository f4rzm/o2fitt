import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchFoodHeader, SearchFoodRow } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import PouchDB from '../../../pouchdb'
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urls } from '../../utils/urls';
import { SyncFavoriteFood } from '../../classess/SyncFavoriteFood';
import { RestController } from '../../classess/RestController';

const favoriteFoodDB = new PouchDB('favoriteFood', { adapter: 'react-native-sqlite' })
const searchHistoryDB = new PouchDB('searchHistory', { adapter: 'react-native-sqlite' })

const SearchFavoritesTab = props => {
    const lang = useSelector(state => state.lang)
    const auth = useSelector(state => state.auth)
    const app = useSelector(state => state.app)
    const user = useSelector(state => state.user)
    const [favorites, setFavorites] = React.useState([])
    const meal = React.useRef({
        foodId: 0,
        foodMeal: props.mealId
    }).current

    React.useEffect(() => {
        // favoriteFoodDB.changes({ since: 'now', live: true }).on('change', getFavorites)
        getFavorites(false)
    }, [])

    React.useEffect(() => {
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus', () => {
            backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.navigate("SearchMainTab"); return true })
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


    const getFavorite = () => {
        if (app.networkConnectivity) {
            const url = urls.foodBaseUrl + urls.userFoodFavorite + `Get?UserId=${user.id}&Page=1&PageSize=50`
            const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }

            const RC = new RestController()
            RC.checkPrerequisites("get", url, {}, header, syncFavoriteSuccess, syncFavoriteFailed, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
        }
    }
    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    const syncFavoriteSuccess = (res) => {
        console.warn('get favoritee success from server');

        if (res.data.data.items.length >= 0) {
            const SF = new SyncFavoriteFood()
            SF.syncFavoriteFoodsByLocal(favoriteFoodDB, res.data.data.items).then((res) => {
                getFavorites(true)
            })
        }
    }


    const syncFavoriteFailed = (error) => {
        console.error("fas")
    }

    const getFavorites = (isSynced) => {
        console.warn("get favorite",isSynced);

        console.log("Changed")
        favoriteFoodDB.allDocs({
            include_docs: true
        }).then(recs => {
            console.warn("recs", recs.total_rows)
            if (recs.total_rows !== 0 || isSynced) {
                const records = recs.rows.map(item => item.doc)
                console.warn("get favorite success");
                setFavorites(records)
            } else {
                getFavorite()
            }
        }).catch(error => console.error("sssssssssssss", error))
    }

    const onFoodPressed = async (food) => {
        const date = await AsyncStorage.getItem("homeDate")
        props.navigation.navigate("FoodDetailScreen", { meal: { ...meal, personalFoodId: food.personalFoodId, foodName: food.name, foodId: null }, food: { ...food }, date: date })
        searchHistoryDB.put({ ...food, _id: food.foodId.toString() })
    }

    console.log("favorites", favorites)
    return (
        <View style={styles.mainContainer}>
            {
                favorites.length === 0 ?
                    <View style={styles.emptyContainer}>
                        <LottieView
                            style={{ width: dimensions.WINDOW_WIDTH * 0.42 }}
                            source={require('../../../res/animations/sabad.json')}
                            autoPlay
                            loop={false}
                        />
                        <Text style={[styles.title, { fontFamily: lang.titleFont }]}>
                            {
                                lang.isNotExistFavorite
                            }
                        </Text>
                        <Text style={[styles.text, { fontFamily: lang.font }]}>
                            {
                                lang.tapHeartToFavorite
                            }
                        </Text>
                    </View> :
                    <ScrollView contentContainerStyle={{ alignItems: "center", flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <LottieView
                            style={{ width: dimensions.WINDOW_WIDTH * 0.42 }}
                            source={require('../../../res/animations/sabad.json')}
                            autoPlay
                            loop={false}
                        />
                        {
                            favorites.length < 0 ? <View style={{ alignItems: "center", justifyContent: "center", paddingTop: moderateScale(200) }}><ActivityIndicator color='#FF900D' size={moderateScale(30)} /></View> :
                                favorites.filter((f) => f.name.includes(props.searchText)).map((item, index) => (
                                    <SearchFoodRow
                                        lang={lang}
                                        item={{ ...item, foodMeal: props.mealId, foodName: item.name }}
                                        key={item.foodId.toString() + index}
                                        onPress={onFoodPressed}
                                    />
                                ))
                        }
                    </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    emptyContainer: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        paddingTop: "15%",
    },
    title: {
        fontSize: moderateScale(15),
        textAlign: "center",
        marginTop: moderateScale(35),
        marginBottom: moderateScale(20),
        color: defaultTheme.darkText
    },
    text: {
        fontSize: moderateScale(13),
        textAlign: "center",
        color: defaultTheme.gray,
        marginHorizontal: "10%",
        lineHeight: moderateScale(25)
    }
});

export default SearchFavoritesTab;
