import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { useSelector , useDispatch} from 'react-redux'
import { SleepDetailsTab } from '../../navigation/tabs/SleepDetailsTab';
import {Toolbar} from "../../components"
import {urls} from "../../utils/urls"
import {RestController} from "../../classess/RestController"
import {SyncSleepDB} from "../../classess/SyncSleepDB"
import moment from "moment"

PouchDB.plugin(pouchdbSearch)

const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' })
const model =  {
  "avrageRate": 0,
  "avrageBurnedCalories": 0,
  "avrageSleepDuration": 0,
  "sleepDetails":[{
      "duration": 0,
      "value": 0,
      "date": ""
  }]
}

const sleepModel = {
  "duration": 0,
  "value": 0,
  "date": ""
}
const SleepDetailScreen = props => {
    const lang = useSelector(state=>state.lang)
    const auth = useSelector(state=>state.auth) 
    const user = useSelector(state=>state.user) 
    const app = useSelector(state=>state.app) 
    React.useEffect(()=>{
      if(app.networkConnectivity){
        getSleepData()
      }
      else{
        getFromDB()
      }
    },[])

    const [sleepWeekData , setWeekData] = React.useState({...model,sleepDetails : new Array(7).fill(sleepModel)})
    const [sleepMonthData , setMonthData] = React.useState({...model,sleepDetails : new Array(30).fill(sleepModel)})

    const getFromDB = ()=>{
      sleepDB.allDocs({include_docs:true}).then(res=>{
        console.log(res)
        calculateWeekValues(res.rows.map(item=>item.doc))
        calculateMonthValues(res.rows.map(item=>item.doc))
      })
    }

    const getSleepData = ()=>{
      const url = urls.workoutBaseUrl + urls.userTrackSleep + `UserHistory?userId=${user.id}&days=11`
      const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
      const params = {}
  
      const RC = new RestController()
      RC.checkPrerequisites("get" , url , params , header , getSleepSuccess , getSleepFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure) 
    }

    const getSleepSuccess = (response)=>{
      console.log(response)
      const SP = new SyncSleepDB()
      SP.syncSleeprByLocal(sleepDB , response.data.data)
      calculateWeekValues(response.data.data)
      calculateMonthValues(response.data.data)
    }

    const getSleepFailure = ()=>{

    }

    const onRefreshTokenSuccess = () =>{

    }

    const onRefreshTokenFailure = () =>{

    }

    const calculateWeekValues = (allSleeps)=>{

      let m =moment()
      m.subtract(6,"days")
      let week = new Array(7).fill(model)
      let totalRate = 0  
      let totalRecord = 0
      let totalBurnedCalories= 0
      let totalDuration= 0
      new Array(7).fill(model).map(async(item , index)=>{
         
          const date = m.format("YYYY-MM-DD")
          m=m.add(1,"day")
          
          const records = allSleeps.filter(item=>item.endDate.includes(date))
           
          
          let sleepDetails = {
              "duration": 0,
              "value": 0,
              "date": ""
          }

          records.map(item=>{
              totalRate += (parseFloat(item.rate) * parseFloat(item.duration))
              totalBurnedCalories += parseFloat(item.burnedCalories)
              totalDuration += parseFloat(item.duration)
              sleepDetails.value+=parseFloat(item.duration)
              totalRecord++
          })
          week[index]=sleepDetails
          
          if(index === 6){
            const filledDays = week.filter(item=>item.value != 0)
            console.log("ssssssss",filledDays)
              setWeekData({
                  "avrageRate": totalRecord > 0 ? (totalRate / totalDuration).toFixed(1) : 0,
                  "avrageBurnedCalories":  totalRecord > 0 ? (totalBurnedCalories / totalRecord).toFixed(1) : 0,
                  "avrageSleepDuration":  totalRecord > 0 ? (totalDuration / filledDays.length).toFixed(1) : 0,
                  "sleepDetails":[...week]
              })
          }
      })
    }

    const calculateMonthValues = (allSleeps)=>{
      let m =moment()
      m.subtract(29,"days")
      let month = new Array(30).fill(model)
      let totalRate = 0  
      let totalRecord = 0
      let totalBurnedCalories= 0
      let totalDuration= 0
      new Array(30).fill(model).map(async(item , index)=>{
         
          const date = m.format("YYYY-MM-DD")
          m=m.add(1,"day")
          
          const records = allSleeps.filter(item=>item.endDate.includes(date))
           
          
          let sleepDetails = {
              "duration": 0,
              "value": 0,
              "date": ""
          }

          records.map(item=>{
              totalRate += (parseFloat(item.rate) * parseFloat(item.duration))
              totalBurnedCalories += parseFloat(item.burnedCalories)
              totalDuration += parseFloat(item.duration)
              sleepDetails.value+=parseFloat(item.duration)
              totalRecord++
          })
          month[index]=sleepDetails
          
          // console.log("month" , month)
          // console.log("totalRate" , totalRate)
          // console.log("totalBurnedCalories" , totalBurnedCalories)
          // console.log("totalDuration" , totalDuration)
          // console.log("totalDuration" , totalDuration)
          if(index === 29){
              const filledDays = month.filter(item=>item.value != 0)
              setMonthData({
                  "avrageRate": totalRecord > 0 ? (totalRate / totalDuration).toFixed(1) : 0,
                  "avrageBurnedCalories":  totalRecord > 0 ? (totalBurnedCalories / totalRecord).toFixed(1) : 0,
                  "avrageSleepDuration":  totalRecord > 0 ? (totalDuration / filledDays.length).toFixed(1) : 0,
                  "sleepDetails":[...month]
              })
          }
      })
    }

    return ( 
    <>
        <Toolbar
            lang={lang}
            title={lang.sleepInfo}
            onBack={()=>props.navigation.popToTop()}
        />
        <SleepDetailsTab
          lang={lang}
          sleepWeekData={sleepWeekData}
          sleepMonthData={sleepMonthData}
        />
    </>
    );
};


export default SleepDetailScreen;
