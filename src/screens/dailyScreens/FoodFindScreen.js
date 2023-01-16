
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import moment from "moment"
import { useSelector, useDispatch } from 'react-redux'
import { SearchToolbar } from '../../components';
import { FoodTabs } from '../../navigation/tabs/FoodTabs';
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { SyncFavoriteFood } from '../../classess/SyncFavoriteFood';
import { SyncPersonalFood } from '../../classess/SyncPersonalFood';
import firebase from '@react-native-firebase/analytics'

PouchDB.plugin(pouchdbSearch)
const searchHistoryDB = new PouchDB('searchHistory', { adapter: 'react-native-sqlite' })
const favoriteFoodDB = new PouchDB('favoriteFood', { adapter: 'react-native-sqlite' })
const personalFoodDB = new PouchDB('personalFood', { adapter: 'react-native-sqlite' })
const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' })

let pageNumber = 0
let timeOut = null
const FoodFindScreen = props => {
  const lang = useSelector(state => state.lang)
  const auth = useSelector(state => state.auth)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const profile = useSelector(state => state.profile)
  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

  const [searchText, setText] = React.useState("")
  const [searchResult, setResult] = React.useState([])
  const [history, setHistory] = React.useState([])
  const [isLastData, setIsLastData] = React.useState(false)
  const [isSearch, setIsSearch] = React.useState(false)
  const [isSearchOnline, setIsSearchOnline] = React.useState(false)
  const [foodType, setFoodType] = React.useState("")

  React.useEffect(() => {
    AsyncStorage.setItem("foodSearchText", "")
    searchHistoryDB.changes({ since: 'now', live: true }).on('change', getHistory)
    // getFavorite()
    getPersonalFood()
    getHistory()
    setTimeout(() => {
      props.route.params && props.route.params.nextRoute && props.navigation.navigate(props.route.params.nextRoute)
    }, 300)
  }, [])

  useEffect(() => {
    const focus = props.navigation.addListener("focus", async() => {
      await AsyncStorage.getItem("foodSearchText").then((response)=>{
        console.error(response);
        setText(response==null?"":response)
      })

    })
    return () => {
      focus()
    }
  }, [props.navigation])

  const setCurrentFoodType = () => {

  }

  const getHistory = () => {
    searchHistoryDB.allDocs({
      include_docs: true
    }).then(async (result) => {
      console.log("history", result);
      const text = await AsyncStorage.getItem("foodSearchText")
      console.log(result);
      setHistory(result.rows.map(item => item.doc))
      if (text === null || text === "") {
        console.log("history");
        console.log("searchText", searchText);
        setResult(result.rows.map(item => item.doc))
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const searchTextChanged = (text) => {
    pageNumber = 0
    setIsLastData(false)
    setText(text)
    text != "" && setIsSearch(true)
    console.log("TTTTTTT", timeOut)
    timeOut && clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      search(text)
      AsyncStorage.setItem("foodSearchText",text)
    }, 1000);
  }

  const moreResult = () => {
    search(searchText)
  }

  const search = (text,pageCount) => {
    firebase().logEvent("search_food")
    pageCount==null?pageNumber++:pageNumber==0
    console.log(text)
    if (text != ""&&text.length>2) {
      if (text.length > 1)
        setIsSearch(true)
      if (app.networkConnectivity) {
        searchOnline(text)
      }
      else {
        searchOffline(text)
      }
    }
    else {
      setIsSearchOnline(false)
      setIsSearch(false)
      setTimeout(() => {
        setResult(history)
      }, 500)
    }
  }

  const searchOffline = (text) => {
    setIsSearchOnline(false)
    foodDB.allDocs({
      include_docs: true,
      startkey: `${text}`,
      endkey: `${text}\uffff`,
      limit: 15,
      skip: (pageNumber - 1) * 15
    }).then(data => {
      console.log(data)
      setIsSearch(false)
      if (data.rows.length > 0) {
        if (pageNumber > 1) {
          setResult([...searchResult, ...data.rows.map(item => ({ ...item.doc }))])
        }
        else {
          setResult([...data.rows.map(item => ({ ...item.doc }))])
        }
      }
      else {
        setIsSearch(false)
        setResult([])
      }
    });

  }

  const searchOnline = (text) => {
    setIsSearchOnline(true)
    const url = urls.foodBaseUrl + urls.food + urls.search + `?Page=${pageNumber}&PageSize=20&Name=${encodeURI(text)}&FoodType=${foodType}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const RC = new RestController()
    RC.checkPrerequisites("get", url, {}, header, onSuccess, (err)=>onFailure(err,text), auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onSuccess = (response) => {
    console.warn(response.data.data)
    setIsSearch(false)
    setIsSearchOnline(false)
    if (pageNumber > 1) {
      setResult([...searchResult, ...response.data.data.items])
    }
    else {
      setResult(response.data.data.items)
    }
    if (response.data.data.items.length === 0) {
      setIsLastData(true)
    }
  }

  const onFailure = (err,text) => {
    console.warn(err);
    setIsSearch(false)
    setIsSearchOnline(false)
    searchOffline(text)
  }

  // const getFavorite = () => {
  //   if (app.networkConnectivity) {
  //     const url = urls.foodBaseUrl + urls.userFoodFavorite + `Get?UserId=${user.id}&Page=1&PageSize=50`
  //     const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }

  //     const RC = new RestController()
  //     RC.checkPrerequisites("get", url, {}, header, syncFavoriteSuccess, syncFavoriteFailed, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  //   }
  // }

  const syncFavoriteSuccess = (res) => {
    console.log(res)
    if (res.data.data.items.length >= 0) {
      const SF = new SyncFavoriteFood()
      SF.syncFavoriteFoodsByLocal(favoriteFoodDB, res.data.data.items)
    }
  }

  const syncFavoriteFailed = (error) => {

  }

  const getPersonalFood = () => {
    if (app.networkConnectivity) {
      const url = urls.foodBaseUrl + urls.personalFood + `GetByUserId?UserId=${user.id}`
      const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }

      const RC = new RestController()
      RC.checkPrerequisites("get", url, {}, header, syncPersonalSuccess, syncPersonalFailed, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }
  }

  const syncPersonalSuccess = (res) => {
    console.log(res)
    if (res.data.data.length >= 0) {
      const SF = new SyncPersonalFood()
      SF.syncPersonalFoodsByLocal(personalFoodDB, res.data.data)
    }
  }

  const syncPersonalFailed = (error) => {

  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  return (
    <>
      <SearchToolbar
        lang={lang}
        title={props.route.params ? props.route.params.name : lang.breakfast}
        goBack={() => props.navigation.navigate("Tabs")}
        placeholder={lang.searchItemFoodTitle}
        onChangeText={searchTextChanged}
        value={searchText}
        onVoice={searchTextChanged}
        setTextEmpty={()=>setText("")}
      />
      <FoodTabs
        lang={lang}
        mealId={props.route.params ? props.route.params.mealId : 0}
        searchResult={searchResult}
        searchText={searchText}
        moreResult={moreResult}
        isLastData={isLastData}
        profile={profile}
        isSearch={isSearch}
        isSearchOnline={isSearchOnline}
        setFoodType={setFoodType}
      />
      {/* {
          !hasCredit &&
          <AdMobBanner
            adSize="smartBannerLandscape"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            onAdFailedToLoad={error => false}
          />
        } */}
    </>
  );
};

export default FoodFindScreen;
