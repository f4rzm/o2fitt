import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView
} from 'react-native';
import {DropDown, Toolbar, RowSpaceAround, ConfirmButton , TwoOptionModal} from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import {LineChart } from "react-native-chart-kit";
import moment from 'moment-jalaali';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import {nutritions} from '../../utils/nutritions'

PouchDB.plugin(pouchdbSearch)

const waterDB = new PouchDB('water', { adapter: 'react-native-sqlite' })
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' })
const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' })
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' })
const specificationDB = new PouchDB('specification', { adapter: 'react-native-sqlite' })

const ReportScreen = props => {
  const lang = useSelector(state=>state.lang)
  const user = useSelector(state=>state.user)
  const profile = useSelector(state=>state.profile)
  
  const [chartLabels , setChartLabels]=React.useState(new Array(7).fill("01/01"))
  const [type , setType] = React.useState({id : 100})
  const [duration , setDuration] = React.useState({id : 7})
  const [chartData , setChartData] = React.useState(new Array(7).fill(0))
  const [labelsSet , setLabelSet] = React.useState({})
  const [isLoading , setLoading] = React.useState(false)
  const [optionalDialogVisible ,setOptionalDialogVisible] = React.useState(false)
  
  const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
  const today=moment()
  const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false

  const durationList =  React.useRef([
    {
      id : 7,
      name : "1 "+lang.week
    },
    {
      id : 14,
      name : "2 "+lang.week
    },
    {
      id : 21,
      name : "3 "+lang.week
    },
    {
      id : 30,
      name : lang.sleepChartTab_month
    }
  ]).current

  const typeList =  React.useRef([
    {
      id : 100,
      name : lang.weight
    },
    {
      id : 101,
      name : lang.rateActivity
    },
    {
      id : 102,
      name : lang.step
    },
    {
      id : 103,
      name : lang.sleepInfo
    },
    {
      id : 104,
      name : lang.drinkingWater
    },
    ...nutritions.map(item=>({id : parseInt(item.id) , name : item[lang.langName]}))
  ]).current

  React.useEffect(()=>{
    const d = []
    if(user.countryId === 128){
      new Array(30).fill(1).map((item , index)=>{
        d.push(moment().subtract(29-index,"days").format("jMM/jDD"))
      })
    }
    else{
      new Array(30).fill(1).map((item , index)=>{
        d.push(moment().subtract(29-index,"days").format("MM/DD"))
      })
    }
    setChartLabels(d.slice(23))

    setLabelSet({
      7 : d.slice(23),
      14 : d.slice(16),
      21 : d.slice(9),
      30 : d,
    })
  },[])

  const typeChanged = (item)=>{
    setType(item)
  }

  const durationChanged = (item)=>{
    setDuration(item)
  }

  const getWeightReports = ()=>{
    const dur = 30
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    console.log(moment().format("MM/DD"))
    specificationDB.find({
      selector : {
        insertDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log("recs",recs)
      let prevWeight = 0
      days.map((day,index)=>{
        const d = recs.docs.find((res)=>{
          return res.insertDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
        })
        if(d){
          prevWeight = d.weightSize
          report[index]=d.weightSize
        }
        else{
          report[index]=prevWeight
        }
      })

      console.log(report)
      console.log(report.slice(30-duration.id))
      setChartData(report.slice(30-duration.id))
      setChartLabels(labelsSet[duration.id])
      setLoading(false)
    })
  }

  const getWaterReports = ()=>{
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    console.log(startDate)
    waterDB.find({
      selector : {
        insertDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log(recs)
      days.map((day,index)=>{
        let value = 0
        recs.docs.filter((res)=>{
          return res.insertDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
         
        }).map(r=>value += parseFloat(r.value))
        
        report[index]=value
      })

      setChartData(report)
      setChartLabels(labelsSet[dur])
      setLoading(false)
    })
  }
 
  const getStepReports = ()=>{
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    console.log(moment().format("MM/DD"))
    pedoDB.find({
      selector : {
        insertDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log("recs",recs)
      days.map((day,index)=>{
        let value = 0
        recs.docs.filter((res)=>{
          return res.insertDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
        })
        .map(r=>value += parseInt(r.stepsCount))
        console.log(value)
        report[index]=value
      })

      setChartData(report)
      setChartLabels(labelsSet[dur])
      setLoading(false)
    })
  }

  const getWorkoutReports = ()=>{
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    console.log(moment().format("MM/DD"))
    activityDB.find({
      selector : {
        insertDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log("recs",recs)
      days.map((day,index)=>{
        let value = 0
        recs.docs.filter((res)=>{
          return res.insertDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
        })
        .map(r=>value += parseInt(r.burnedCalories))
        console.log(value)
        report[index]=value
    })

      setChartData(report)
      setChartLabels(labelsSet[dur])
      setLoading(false)
    })
  }

  const getSleepReports = ()=>{
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    sleepDB.find({
      selector : {
        endDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log(recs)
      days.map((day,index)=>{
        let value = 0
        recs.docs.filter((res)=>{
          return res.endDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
         
        }).map(r=>value += parseFloat(r.duration))
        
        report[index]=value
      })

      setChartData(report)
      setChartLabels(labelsSet[dur])
      setLoading(false)
    })
  }

  const getNutritionReport = ()=>{
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur , "days").format("YYYY-MM-DD")
    console.log(startDate)
    mealDB.find({
      selector : {
        insertDate : {$gte: startDate}
      }
    }).then(recs=>{
      console.log(recs)
      days.map((day,index)=>{
        let value = 0
        recs.docs.filter((res)=>{
          return res.insertDate.includes(moment().subtract(dur-index-1 , "days").format("YYYY-MM-DD"))
         
        }).map((r)=>value += (parseFloat(r.foodNutrientValue[type.id - 1]) * (r.value/100)))
        
        report[index]=value
      })

      console.log(report)

      setChartData(report)
      setChartLabels(labelsSet[dur])
      setLoading(false)
    })
  }

  const getReport = ()=>{
    if(hasCredit){
      setLoading(true)
      switch (true){
        case type.id < 34:
          getNutritionReport()
        return
        case type.id===100:
          getWeightReports()
        return
        case type.id===101:
          getWorkoutReports()
        return
        case type.id===102:
          getStepReports()
        return
        case type.id===103:
          getSleepReports()
        return
        case type.id===104:
          getWaterReports()
        return
      }
    }
    else{
      goToPackages()
    }
  }

  const goToPackages = ()=>{
    setOptionalDialogVisible(false)
    setTimeout(()=>{
        props.navigation.navigate("PackagesScreen")
    },Platform.OS === "ios"?500:50)
  }

  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.report}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{alignItems : "center"}}>
            <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                {
                    lang.selectYourTypeReport
                }
            </Text>

            <RowSpaceAround>
                <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                    {
                        lang.selected
                    }
                </Text>
                 
                <DropDown
                    data={typeList}
                    lang={lang}
                    style={styles.dropDownContainer1}
                    onItemPressed={typeChanged}
                    selectedItem={typeList.find(item=>item.id===type.id)["name"]}
                    selectedTextStyle={{fontSize : moderateScale(13) , color : defaultTheme.gray}}
                />
                 
                 <DropDown
                    data={durationList}
                    lang={lang}
                    style={styles.dropDownContainer2}
                    onItemPressed={durationChanged}
                    selectedItem={durationList.find(item=>item.id===duration.id)["name"]}
                    selectedTextStyle={{fontSize : moderateScale(13) , color : defaultTheme.gray}}
                />
            </RowSpaceAround>
            <View style={styles.chartContainer}>

            </View>
            <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [
                        {
                            data: chartData
                        }
                        ]
                    }}
                    
                    width={dimensions.WINDOW_WIDTH}
                    height={moderateScale(250)}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    withShadow={false}
                    withVerticalLines={false}
                    verticalLabelRotation={-90}
                    xLabelsOffset={moderateScale(12)}
                    fromZero={true}
                    chartConfig={{
                        horizontalOffset : 0,
                        width:dimensions.WINDOW_WIDTH,
                        backgroundColor: defaultTheme.lightBackground,
                        backgroundGradientFrom: defaultTheme.lightBackground,
                        backgroundGradientTo: defaultTheme.lightBackground,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(249, 139, 6, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(110, 110, 110, ${opacity})`,
                        propsForDots: {
                        r: "2",
                        strokeWidth: "2",
                        stroke: defaultTheme.primaryColor
                        },
                        propsForLabels : {
                            fontFamily : lang.font, 
                        },
                        style:{margin : 0 , padding : 0},
                        propsForVerticalLabels : {fontSize : moderateScale(11)},
                        
                    }}
                    onDataPointClick={(e)=>console.log(e)}
                    style={{
                        width : dimensions.WINDOW_WIDTH,
                        margin : 0 ,
                        marginVertical: 8,
                    }}
                />
                <ConfirmButton
                    lang={lang}
                    style={styles.button}
                    title={lang.send}
                    leftImage={require("../../../res/img/done.png")}
                    onPress={getReport}
                    isLoading={isLoading}
                />
        </ScrollView>
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
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  title : {
    fontSize : moderateScale(14),
    marginVertical : moderateScale(25),
    color : defaultTheme.gray
  },
  dropDownContainer1 : {
    marginHorizontal : 0,
    width : moderateScale(120),
    borderWidth : 1,
    borderColor : defaultTheme.green,
    borderRadius : moderateScale(8)
  },
  dropDownContainer2 : {
    marginHorizontal : 0,
    width : moderateScale(85),
    borderWidth : 1,
    borderColor : defaultTheme.green,
    borderRadius : moderateScale(8)
  },
  text : {
    fontSize : moderateScale(12),
    lineHeight : moderateScale(24),
    color : defaultTheme.gray
  },
  chartContainer : {
    marginTop : moderateScale(25)
  },
  button : {
      width : dimensions.WINDOW_WIDTH * 0.75,
      height : moderateScale(37),
      backgroundColor : defaultTheme.green,
      alignSelf : "center",
      marginTop : moderateScale(35)
  }
});

export default ReportScreen;
