import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import {SearchToolbar} from '../../components';
import { ActivityTab } from '../../navigation/tabs/ActivityTab';
import {urls} from "../../utils/urls"
import {RestController} from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { SyncFavoriteActivity } from '../../classess/SyncFavoriteActivity';
import { SyncPersonalActivity } from '../../classess/SyncPersonalActivity';
// import Voice from '@react-native-community/voice';

PouchDB.plugin(pouchdbSearch)
const favoriteActivityDB = new PouchDB('favoriteActivity', { adapter: 'react-native-sqlite' })
const personalActivityDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })

const ActivityScreen = props => {

  const lang = useSelector(state=>state.lang)
  const auth = useSelector(state=>state.auth)
  const user = useSelector(state=>state.user)
  const app = useSelector(state=>state.app)
  const profile = useSelector(state=>state.profile)

  const [searchText , setText] = React.useState("")
  const [searchResult , setResult] = React.useState([])

  React.useEffect(()=>{
    getFavorite()
    getPersonal()
  },[])

  const getFavorite = ()=>{
    if(app.networkConnectivity){
      const url = urls.workoutBaseUrl + urls.userWorkoutFavorite + `Get?UserId=${user.id}&Page=1&PageSize=50`
      const header = {headers : {Authorization : "Bearer " + auth.access_token} , Language : lang.capitalName}
      
      const RC = new RestController()
      RC.checkPrerequisites("get" , url , {} , header , syncFavoriteSuccess , syncFavoriteFailed , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
    }
  }

  const syncFavoriteSuccess =(res)=>{
    console.log(res)
    if(res.data.data.items.length >= 0){
      const SF = new SyncFavoriteActivity()
      SF.syncFavoriteActivitysByLocal(favoriteActivityDB,res.data.data.items.map(item => ({classification : item.clasification,id : item.workOutId , _id : item._id})))
    }
  } 

  const syncFavoriteFailed = (error)=>{

  }

  const getPersonal = ()=>{
    if(app.networkConnectivity){
      const url = urls.workoutBaseUrl + urls.personalWorkOut + `?UserId=${user.id}&Page=1&PageSize=200`
      const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
      
      const RC = new RestController()
      RC.checkPrerequisites("get" , url , {} , header , syncPersonalSuccess , syncPersonalFailed , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
    }
  }

  const syncPersonalSuccess =(res)=>{
    if(res.data.data.items.length >= 0){
      const SF = new SyncPersonalActivity()
      SF.syncPersonalActivityByLocal(personalActivityDB,[...res.data.data.items])
    }
  } 

  const syncPersonalFailed = (error)=>{

  }

  const onRefreshTokenSuccess = () =>{

  }

  const onRefreshTokenFailure = () =>{

  }

  return (
      <View style={{backgroundColor : null , flex:1}}>
        <SearchToolbar
          lang={lang}
          title={lang.sport_actives}
          goBack={()=>props.navigation.goBack()}
          placeholder={lang.writeNameSport}
          onChangeText={(search=>setText(search))}
          value={searchText}
          onVoice={search=>setText(search)}
          setTextEmpty={()=>setText("")}
        />
        <ActivityTab
          lang={lang}
          searchText={searchText}
          profile={profile}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor: defaultTheme.error,
  }
});

export default ActivityScreen;
