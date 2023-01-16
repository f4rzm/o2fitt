import React from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  Text,
  Platform,
  ScrollView
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import {WorkoutRow, SportRow , ConfirmButton , RowStart , PersonalWorkoutRow , TwoOptionModal} from '../../components';
import { moderateScale } from 'react-native-size-matters';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import bodyBuildingExcercises from "../../utils/bodyBuildingExcercises"
import cardioExcercises from "../../utils/cardios/cardioExcercises"
import {exercise} from "../../utils/exercise"
import LottieView from 'lottie-react-native';
import moment from "moment"
import AsyncStorage from '@react-native-async-storage/async-storage';


PouchDB.plugin(pouchdbSearch)
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' })
const favoriteActivityDB = new PouchDB('favoriteActivity', { adapter: 'react-native-sqlite' })
const personalActivityDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })

const MyActivityTab = props => {

  const lang = useSelector(state=>state.lang)
  const profile = useSelector(state=>state.profile) 
  const [favorites , setFavorites] = React.useState([])
  const [recents , setRecents] = React.useState([])
  const [optionalDialogVisible ,setOptionalDialogVisible] = React.useState(false)
  const [personalWorkouts , setPersonalWorkouts] = React.useState([])
  const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
  const today=moment()
  const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
 
  React.useEffect(()=>{
    personalActivityDB.changes({since: 'now', live: true}).on('change',getPersonalActivities)
    activityDB.changes({since: 'now', live: true}).on('change',getLastActivities)
    favoriteActivityDB.changes({since: 'now', live: true}).on('change',getFavorites)
    getPersonalActivities()
    getFavorites()
    getLastActivities()
  },[])
  
  React.useEffect(()=>{
    let backHandler = null
    const focusUnsubscribe = props.navigation.addListener('focus' , ()=>{
        backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{props.navigation.navigate("SportsTab"); return true})
    })

    const blurUnsubscribe = props.navigation.addListener('blur' , ()=>{
        backHandler && backHandler.remove()
    })

    return ()=> {
        backHandler && backHandler.remove()
        focusUnsubscribe()
        blurUnsubscribe()
    }
  },[])

  const getFavorites = ()=>{
    favoriteActivityDB.allDocs({include_docs : true}).then((rec)=>{
      console.log("getFavorites DB",rec)
      const f = []
      rec.rows.map(item=>{
        let data = null
        if(item.doc.classification == 1){
          data = exercise.find(ex=>ex.id === item.doc.id)
        }else if(item.doc.classification == 2){
          data = cardioExcercises.find(ex=>ex.id === item.doc.id)
        }
        else{
          data = bodyBuildingExcercises.find(ex=>ex.id === item.doc.id)
        }
        console.log("data",data)
        console.log("item",item)
        if(data && data != undefined){
          f.push(data)
        }
      })

      setFavorites(f)
    })
  }

  const getLastActivities = ()=>{
    activityDB.find({
      selector : {_id : {$ne : null}},
      sort:[{_id : "desc"}],
    }).then(rec =>{
       console.log(rec)
       const f = []
       rec.docs.map(item=>{
        let data = null
        if(item.classification == 1){
          data = exercise.find(ex=>ex.id === item.workOutId)
        }else if(item.classification == 2){
          data = cardioExcercises.find(ex=>ex.id === item.workOutId)
        }
        else{
          data = bodyBuildingExcercises.find(ex=>ex.id === item.workOutId)
        }
        console.log("data",data)
        console.log("item",item)
        if(data && data != undefined && f.findIndex(i=>i.id === data.id) === -1){
          f.push(data)
        }
      })

      setRecents(f.slice(0,2))
    })
  }

  const getPersonalActivities =()=>{
    personalActivityDB.allDocs({include_docs:true}).then((rec)=>{
      console.log("getPersonalActivities",rec)
      setPersonalWorkouts(rec.rows.map(item=>item.doc))
    })
  }

  const onPress = async(item) =>{
    const date=await AsyncStorage.getItem("homeDate")
    console.log(item)
    props.navigation.navigate("ActivityDetailsScreen",{
      activity : {
        workOutId : item.id,
        classification : item.classification
      },
      date:date
    })
  }

  const onPersonalPress = async(item) =>{
    const date=await AsyncStorage.getItem("homeDate")
    console.log(item)
    const h = parseInt(item.duration.split(":")[0])
    const m = parseInt(item.duration.split(":")[1])
    const burnedCalories = parseFloat(item.calorie) / ((h*60 + m))
    props.navigation.navigate("ActivityDetailsScreen",{
      activity : {
        personalWorkOutId : item.id,
        classification : null,
        burnedCalories : burnedCalories,
        name : {
          persian : item.name,
          arabic : item.name,
          english : item.name
        },
       
      } ,date:date
    })
  }

  const addActivity =()=>{
    if(hasCredit){
      props.navigation.navigate("PersonalActivityScreen")
    }
    else{
      goToPackages()
    }
    
  }

  const goToPackages = ()=>{
    setTimeout(()=>{
        props.navigation.navigate("PackagesScreen")
    },Platform.OS === "ios"?500:50)
  }

  return (
      <>
        {
          (recents.length != 0 || personalWorkouts.length !=0 || favorites.length != 0)?
          (recents.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())).length != 0 || 
            personalWorkouts.filter(item=>item.name.toLowerCase().includes(props.searchText.toLowerCase())).length !=0 || 
              favorites.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())).length != 0)?
            <ScrollView showsVerticalScrollIndicator={false}>       
            {
               personalWorkouts.filter(item=>item.name.toLowerCase().includes(props.searchText.toLowerCase())).length > 0 && 
              <RowStart style={[styles.titleContainer,{marginBottom: 0}]}>
                <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {lang.myWorkoutPersonal}
                </Text>
              </RowStart>
            }
            {
              personalWorkouts.filter(item=>item.name.toLowerCase().includes(props.searchText.toLowerCase())).map(item=>(
                <PersonalWorkoutRow
                  key={item.id.toString()}
                  lang={lang}
                  item={item}
                  onPress={onPersonalPress}
                />
              ))
            }
            {
              favorites.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())).length > 0 && 
              <RowStart style={styles.titleContainer}>
                <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {lang.myWorkouts}
                </Text>
              </RowStart>
            }
            {
              favorites.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())).map(item=>(
                
                item.classification == 1?
                  <SportRow
                    key={item.id.toString()}
                    lang={lang}
                    title={item.name[lang.langName]}
                    logo={item.iconUri}
                    onPress={()=>onPress(item)}
                  />:
                  <WorkoutRow
                      key={item.id.toString()}
                      lang={lang}
                      title={item.name[lang.langName]}
                      logo={{uri : item.iconUri}}
                      onPress={()=>onPress(item)}
                  />
              ))
            }
            
            {
              recents.length > 0 && 
              <RowStart style={styles.titleContainer}>
                <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {lang.sports}
                </Text>
              </RowStart>
            }
            {
              recents.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())).map(item=>(
                
                item.classification == 1?
                  <SportRow
                    key={item.id.toString()}
                    lang={lang}
                    title={item.name[lang.langName]}
                    logo={item.iconUri}
                    onPress={()=>onPress(item)}
                  />:
                  <WorkoutRow
                      key={item.id.toString()}
                      lang={lang}
                      title={item.name[lang.langName]}
                      logo={{uri : item.iconUri}}
                      onPress={()=>onPress(item)}
                  />
              ))
            }
          </ScrollView>:
          <>
            <LottieView 
                style={{
                    width : dimensions.WINDOW_WIDTH * 0.45 ,
                    height : dimensions.WINDOW_WIDTH * 0.8, 
                    alignSelf : "center", 
                }}
                source={require('../../../res/animations/noresultexerise.json')} 
                autoPlay 
                loop={true}
            />
            <Text 
                style={[{
                    fontFamily : lang.font , 
                    alignSelf : "center" , 
                    fontSize : moderateScale(15),
                    textAlign : "left"
                }]} 
                allowFontScaling={false}
            >
                {
                    lang.noMatchedExercise
                }
            </Text>
          </>:
          <View
              style={{
                  marginTop : dimensions.WINDOW_WIDTH * 0.25,
                  marginBottom : moderateScale(20),
                  alignSelf : "center"
              }}
          >
              <LottieView 
                  style={{
                      width : dimensions.WINDOW_WIDTH * 0.3 ,
                  }}
                  source={require('../../../res/animations/activity.json')} 
                  autoPlay 
                  loop={true}
              />
          </View> 
        } 
        <View style={styles.buttonContainer}>
            <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.pesonalexercise}
                imageStyle={{tintColor : defaultTheme.lightText}}
                leftImage={require("../../../res/img/add.png")}
                onPress={addActivity}
            />
        </View> 
        <TwoOptionModal
            lang={lang}
            visible={optionalDialogVisible}
            onRequestClose={()=>setOptionalDialogVisible(false)}
            context={lang.subscribe1}
            button1={lang.iBuy}
            button2={lang.motevajeShodam}
            button1Pressed={goToPackages}
            button2Pressed={()=>setOptionalDialogVisible(false)}
        />
      </>
  );
};

const styles = StyleSheet.create({
  titleContainer : {
    backgroundColor : defaultTheme.grayBackground,
    marginVertical : 0,
    marginBottom : moderateScale(12),
    paddingVertical : moderateScale(6)
  },
  title: {
    fontSize : moderateScale(15),
    color : defaultTheme.darkText,
    marginHorizontal : moderateScale(5)
  },
  buttonContainer : {
    width:dimensions.WINDOW_WIDTH,
    alignItems : "center",
    marginBottom : "2.5%",
  },
  button : {
      width : dimensions.WINDOW_WIDTH * 0.45,
      height : moderateScale(45),
      backgroundColor : defaultTheme.green,
      margin : moderateScale(8),
      marginTop : moderateScale(20)
  }, 
  logo : {
    width : dimensions.WINDOW_WIDTH * 0.3,
    height : dimensions.WINDOW_WIDTH * 0.4,
    marginVertical : moderateScale(30),
    
    alignSelf : "center"
  },
});

export default MyActivityTab;
