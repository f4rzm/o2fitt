import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { DropDown, Toolbar, RowSpaceAround, ConfirmButton, TwoOptionModal, Information } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { LineChart } from "react-native-chart-kit";
import moment from 'moment-jalaali';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { nutritions } from '../../utils/nutritions'
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
import analytics from '@react-native-firebase/analytics';
import { allMeasureUnits } from '../../utils/measureUnits';


const width = Dimensions.get("screen").width

PouchDB.plugin(pouchdbSearch)

// const waterDB = new PouchDB('water', { adapter: 'react-native-sqlite' })
// const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' })
// const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' })
// const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })
// const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' })
// const specificationDB = new PouchDB('specification', { adapter: 'react-native-sqlite' })

const ReportScreen = props => {
  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const auth = useSelector(state => state.auth)
  const profile = useSelector(state => state.profile)
  const [widthC, setWidth] = useState(1);

  const [chartLabels, setChartLabels] = React.useState(new Array(7).fill("01/01"))
  const [type, setType] = React.useState({ id: 1 })
  const [duration, setDuration] = React.useState({ id: 7 })
  const [chartData, setChartData] = React.useState(new Array(7).fill(0))
  const [labelsSet, setLabelSet] = React.useState({"7":new Array(7).fill(1).map((item, index) => {
    if (user.countryId == 128) {
      return (moment().subtract(6 - index, "days").format("jMM/jDD"))
    }else{
      return (moment().subtract(7 - index, "days").format("MM/DD"))
    }
  })})
  const [isLoading, setLoading] = React.useState(false)
  const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")
  const [selectedItem, setSelectedItem] = useState(1)
  const [selectedWeek, setSelectedWeek] = useState("1 " + lang.week)
  const [selectedCat, setSelectedCat] = useState(1)
  const [color, setcolor] = useState(defaultTheme.gold)
  const [unit, setUnit] = useState(lang.unit)

  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

  const durationList = React.useRef([
    {
      id: 7,
      name: "1 " + lang.week
    },
    {
      id: 14,
      name: "2 " + lang.week
    },
    {
      id: 21,
      name: "3 " + lang.week
    },
    {
      id: 30,
      name: lang.sleepChartTab_month
    }
  ]).current

  const typeList = React.useRef([
    {
      id: 100,
      name: lang.weight,
      unit: "kg"
    },
    {
      id: 101,
      name: lang.rateActivity
    },
    {
      id: 102,
      name: lang.step,
      unit: lang.step
    },
    {
      id: 103,
      name: lang.sleepInfo
    },
    {
      id: 104,
      name: lang.water,
      unit: lang.glass
    },
    ...nutritions.filter(item => item.id != "2").map(item => ({ id: parseInt(item.id), name: item[lang.langName], unit: item.unit }))
  ]).current
  console.error(chartLabels);


  const scrollViewRef = useRef(null);

  const bigNutrient = [1, 10, 32]
  const minerals = [19, 11, 23, 27, 7, 5, 9, 13, 30, 21, 3]
  const vitamins = [6, 31, 16, 17, 25, 14, 29, 8, 20, 18, 34, 22]
  const fats = [33, 15, 12]
  const carbos = [4, 28]
  const calories = [24, 101]
  const weight = [100]
  const other = [104, 103, 102]

  const allNutrient = [
    { id: 1, name: lang.bigNutrition, color: defaultTheme.gold },
    { id: 2, name: lang.minerals, color: defaultTheme.blue },
    { id: 3, name: lang.vitamins, color: defaultTheme.green2 },
    { id: 4, name: lang.calories, color: "brown" },
    { id: 5, name: lang.weight, color: defaultTheme.green },
    { id: 6, name: lang.fats, color: defaultTheme.blue },
    { id: 7, name: lang.carbohydrate, color: defaultTheme.error },
    { id: 8, name: lang.other, color: defaultTheme.accentColor },
  ]

  const filteredMinerals = typeList.filter(item => minerals.includes(item.id))
  const filteredfats = typeList.filter(item => fats.includes(item.id))
  const filteredcarbos = typeList.filter(item => carbos.includes(item.id))
  const filteredVitamins = typeList.filter(item => vitamins.includes(item.id))
  const filteredcalorie = typeList.filter(item => calories.includes(item.id))
  const filteredmore = typeList.filter(item => other.includes(item.id))
  const filteredweight = typeList.filter(item => weight.includes(item.id))
  const filteredBigNutrient = typeList.filter(item => bigNutrient.includes(item.id))

  React.useEffect(() => {
    const d = []
    if (user.countryId === 128) {
      new Array(30).fill(1).map((item, index) => {
        d.push(moment().subtract(29 - index, "days").format("jMM/jDD"))
      })
    }
    else {
      new Array(30).fill(1).map((item, index) => {
        d.push(moment().subtract(29 - index, "days").format("MM/DD"))
      })
    }
    setChartLabels(d.slice(23))

    setLabelSet({
      7: d.slice(23),
      14: d.slice(16),
      21: d.slice(9),
      30: d,
    })
  }, [])

  // const typeChanged = (item) => {
  //   setType(item)
  // }

  // const durationChanged = (item) => {
  //   setDuration(item)
  // }

  const calculateWidth = () => {
    if (duration.id === 7) {
      setWidth(1);
    } else if (duration.id === 14) {
      setWidth(2.5);
    } else if (duration.id === 21) {
      setWidth(3.5);
    } else if (duration.id === 30) {
      setWidth(4.5);
    }
  };

  const getWeightReports = () => {
    const url = urls.userBaseUrl + urls.userProfiles + urls.userSpecificationHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getSpecificationSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getSpecificationSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur, "days").format("YYYY-MM-DD")
    console.log(startDate)
    let prevWeight = 0
    days.map((day, index) => {
      const d = data.find((res) => {
        return res.insertDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))
      })
      if (d) {
        prevWeight = d.weightSize
        report[index] = d.weightSize
      }
      else {
        report[index] = prevWeight
      }
    })
    setChartData(report)
    setChartLabels(labelsSet[dur])
    setLoading(false)
  }

  const getWaterReports = () => {

    const url = urls.baseFoodTrack + urls.userTrackWater + "/" + urls.userHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getWaterSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getWaterSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    days.map((day, index) => {
      let value = 0
      data.filter((res) => {
        return res.insertDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))

      }).map(r => value += parseFloat(r.value))

      report[index] = value
    })

    setChartData(report)
    setChartLabels(labelsSet[dur])
    setLoading(false)
  }

  const getStepReports = () => {
    const url = urls.baseWorkout + urls.userTrackSteps + "/" + urls.userHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getStepSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getStepSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur, "days").format("YYYY-MM-DD")
    console.log(startDate)
    days.map((day, index) => {
      let value = 0
      data.filter((res) => {
        return res.insertDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))

      }).map(r => value += parseInt(r.stepsCount))

      report[index] = value
    })

    console.log(report)

    setChartData(report)
    setChartLabels(labelsSet[dur])
    setLoading(false)
  }

  const getWorkoutReports = () => {
    const url = urls.baseWorkout + urls.userTrackWorkout + "/" + urls.userHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getWorkoutSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getWorkoutSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur, "days").format("YYYY-MM-DD")
    console.log(startDate)
    days.map((day, index) => {
      let value = 0
      data.filter((res) => {
        return res.insertDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))

      }).map(r => value += parseInt(r.burnedCalories))

      report[index] = value
    })

    setChartData(report)
    setChartLabels(labelsSet[dur])
    setLoading(false)
  }

  const getSleepReports = () => {

    const url = urls.baseWorkout + urls.userTrackSleep + urls.userHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getSleepSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getSleepSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur, "days").format("YYYY-MM-DD")
    console.log(startDate)
    days.map((day, index) => {
      let value = 0
      data.filter((res) => {
        return res.endDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))

      }).map(r => value += parseFloat(r.duration))

      report[index] = value
    })


    setChartData(report)
    setChartLabels(labelsSet[dur])
    setLoading(false)
  }

  const getNutritionReport = () => {

    const url = urls.baseFoodTrack + urls.userTrackFood + urls.userHistory + `?days=${duration.id}&userId=${user.id}`
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
    const params = {}

    const RC = new RestController()
    RC.checkPrerequisites("get", url, params, header, getNutritionSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const getNutritionSuccess = (response) => {
    const data = [...response.data.data]
    const dur = duration.id
    let days = new Array(dur).fill(0)
    let report = new Array(dur).fill(0)
    const startDate = moment().subtract(dur, "days").format("YYYY-MM-DD")
    console.log("start date", startDate)
    days.map((day, index) => {
      let value = 0
      data.filter((res) => {
        return res.insertDate.includes(moment().subtract(dur - index - 1, "days").format("YYYY-MM-DD"))

      }).map((r) => {

        // value += (parseFloat((r.foodNutrientValue.split(',')[type.id - 1]) * (r.value)) / 100)
        value += parseInt((r.foodNutrientValue.split(',')[type.id - 1]))
      })

      report[index] = value
    })

    setChartLabels(labelsSet[dur])
    setChartData(report)
    setLoading(false)
  }

  // const getReport = () => {
  //   if (hasCredit) {

  //     analytics().logEvent('getReport')
  //     setLoading(true)
  //     switch (true) {
  //       case type.id < 34:
  //         getNutritionReport()
  //         return
  //       case type.id === 100:
  //         getWeightReports()
  //         return
  //       case type.id === 101:
  //         getWorkoutReports()
  //         return
  //       case type.id === 102:
  //         getStepReports()
  //         return
  //       case type.id === 103:
  //         getSleepReports()
  //         return
  //       case type.id === 104:
  //         getWaterReports()
  //         return
  //     }
  //   }
  //   else {
  //     goToPackages()
  //   }
  // }

  const goToPackages = () => {
    setTimeout(() => {
      props.navigation.navigate("PackagesScreen")
    }, Platform.OS === "ios" ? 500 : 50)
  }

  const getFailure = (error) => {
    setErrorVisible(true)
    setErrorContext(lang.serverError)
    setLoading(false)

  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }
  const onSelectedCat = (item, index) => {

    if (lang.langName === "english"||Platform.OS=="ios") {
      scrollViewRef.current.scrollTo({
        x: (width / 4) * (index - 1),
        animated: true,
      });
    } else {
      scrollViewRef.current.scrollTo({
        x: (width / 5) * (6 - index),
        animated: true,
      });
    }

    setSelectedCat(item.id)

    switch (item.id) {
      case 1: {
        setcolor(item.color)
        setSelectedItem(1)
        setType({ id: 1 })
        setUnit(typeList[6].unit)
        break
      }
      case 2: {
        setcolor(item.color)
        setSelectedItem(19)
        setType({ id: 19 })
        setUnit(typeList[20].unit)
        break
      }
      case 3: {
        setSelectedItem(6)
        setcolor(item.color)
        setType({ id: 6 })
        setUnit(typeList[27].unit)
        break
      }
      case 4: {
        setSelectedItem(101)
        setcolor(item.color)
        setType({ id: 101 })
        setUnit("mcg")
        break
      }
      case 5: {
        setSelectedItem(100)
        setcolor(item.color)
        setType({ id: 100 })
        setUnit(typeList[0].unit)
        break
      }
      case 6: {
        setSelectedItem(33)
        setcolor(item.color)
        setType({ id: 33 })
        setUnit("mg")
        break
      }
      case 7: {
        setSelectedItem(28)
        setcolor(item.color)
        setType({ id: 28 })
        setUnit("gr")
        break
      }
      case 8: {
        setSelectedItem(104)
        setcolor(item.color)
        setType({ id: 104 })
        setUnit(lang.glass)
        break
      }
    }
  }
  const onItemSelected = (item) => {

    setLoading(true)
    setType(item)
    setSelectedItem(item.id)
    setUnit(item.unit)

  }
  const onWeekSelected = (item) => {
    setSelectedWeek(item.name)
    setDuration(item)
  }
  useEffect(() => {
    if (hasCredit) {

      analytics().logEvent('getReport')
      setLoading(true)
      switch (true) {
        case selectedItem < 34:
          getNutritionReport()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break
        case selectedItem === 100:
          getWeightReports()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break
        case selectedItem === 101:
          getWorkoutReports()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break
        case selectedItem === 102:
          getStepReports()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break
        case selectedItem === 103:
          getSleepReports()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break
        case selectedItem === 104:
          getWaterReports()
          setTimeout(() => {
            calculateWidth();
          }, 400);
          break

      }
    }
    else {
      goToPackages()
    }
  }, [duration, type])

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.report}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Text style={[styles.title, { fontFamily: lang.font }]} allowFontScaling={false}>
          {
            lang.chooseReportType
          }
        </Text>

        <RowSpaceAround>


          {/* <DropDown
                    data={typeList}
                    lang={lang}
                    style={styles.dropDownContainer1}
                    dateContainerStyle={styles.dropDownDateContainer1}
                    onItemPressed={typeChanged}
                    selectedItem={typeList.find(item=>item.id===type.id)["name"]}
                    selectedTextStyle={{fontSize : moderateScale(15) , color : defaultTheme.gray ,  paddingHorizontal : moderateScale(2)}}
                /> */}

          {/* <DropDown
            data={durationList}
            lang={lang}
            style={styles.dropDownContainer2}
            dateContainerStyle={styles.dropDownDateContainer2}
            onItemPressed={durationChanged}
            selectedItem={durationList.find(item => item.id === duration.id)["name"]}
            selectedTextStyle={{ fontSize: moderateScale(15), color: defaultTheme.gray, paddingHorizontal: moderateScale(2) }}
          /> */}
        </RowSpaceAround>

        <ScrollView style={{ borderBottomWidth: 1, borderBottomColor: defaultTheme.border, flexDirection: "row" }} ref={scrollViewRef} showsHorizontalScrollIndicator={false} horizontal>
          {
            allNutrient.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{ borderBottomColor: selectedCat == item.id ? item.color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: selectedCat == item.id ? 2 : 0 }}
                  onPress={() => onSelectedCat(item, index)}
                >
                  <Text style={{ color: selectedCat == item.id ? item.color : "black", fontFamily: lang.font, padding: moderateScale(9), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
        <View style={{ marginTop: moderateScale(16), width: "100%", flexDirection: "row", flexWrap: "wrap" }} horizontal>
          {
            selectedCat == 1 ?
              filteredBigNutrient.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={[styles.catChild, { borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, borderBottomWidth: 1, marginHorizontal: moderateScale(5), borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }]}
                    onPress={() => onItemSelected(item)}
                  >
                    <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )
              }) :
              selectedCat == 2 ?
                filteredMinerals.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, borderBottomWidth: 1, marginHorizontal: moderateScale(5), borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                      onPress={() => onItemSelected(item)}
                    >
                      <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )
                }) : selectedCat == 6 ?
                  filteredfats.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                        onPress={() => onItemSelected(item)}
                      >
                        <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  }) : selectedCat == 7 ?
                    filteredcarbos.map((item, index) => {
                      return (
                        <TouchableOpacity
                          style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                          onPress={() => onItemSelected(item)}
                        >
                          <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )
                    }) : selectedCat == 3 ?
                      filteredVitamins.map((item, index) => {
                        return (
                          <TouchableOpacity
                            style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                            onPress={() => onItemSelected(item)}
                          >
                            <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )
                      }) : selectedCat == 4 ?
                        filteredcalorie.map((item, index) => {
                          return (
                            <TouchableOpacity
                              style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                              onPress={() => onItemSelected(item)}
                            >
                              <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          )
                        }) : selectedCat == 8 ?
                          filteredmore.map((item, index) => {
                            return (
                              <TouchableOpacity
                                style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                                onPress={() => onItemSelected(item)}
                              >
                                <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            )
                          }) : selectedCat == 5 ?
                            filteredweight.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  style={{ borderColor: selectedItem == item.id ? color : defaultTheme.lightGray, alignItems: "center", justifyContent: "center", marginHorizontal: moderateScale(5), borderBottomWidth: 1, borderRadius: 13, borderWidth: 1, margin: moderateScale(5) }}
                                  onPress={() => onItemSelected(item)}

                                >
                                  <Text style={{ color: selectedItem == item.id ? color : "black", fontFamily: lang.font, padding: moderateScale(5), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              )
                            }) : null
          }
        </View>

        <View style={styles.chartContainer}></View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          showsHorizontalScrollIndicator={false}>
          <View style={{ width: dimensions.WINDOW_WIDTH * widthC, alignItems: 'flex-start' }}>
            <View style={{ width: "100%", paddingHorizontal: moderateScale(30), alignItems: "flex-end" }}>
              <Text style={{ fontSize: moderateScale(14), fontFamily: lang.font }}>{unit}</Text>
            </View>
            <LineChart
              bezier
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={dimensions.WINDOW_WIDTH * widthC}
              height={dimensions.WINDOW_HEIGTH * 0.4}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              // decimalPlaces={0}
              // yAxisSuffix={' ' + unitLabel[indexUnitLabel]}
              withShadow={true}
              verticalLabelRotation={-90}
              
              renderDotContent={(r) => {
                return(
                <Text style={{ color: defaultTheme.darkText,  position: 'absolute', width: dimensions.WINDOW_WIDTH * widthC ,paddingTop:r.y-20,paddingRight:Platform.OS=="ios"? r.x-5:0,paddingLeft:Platform.OS=="android"?r.x-5:0}}>{r.indexData}</Text>
              )}}
              xLabelsOffset={moderateScale(30)}
              yLabelsOffset={5}
              fromZero={false}
              chartConfig={{
                horizontalOffset: 2,
                width: dimensions.WINDOW_WIDTH * widthC,
                backgroundColor: defaultTheme.lightBackground,
                backgroundGradientFrom: defaultTheme.lightBackground,
                backgroundGradientTo: defaultTheme.lightBackground,
                // formatYLabel: () => yLabelIterator.next().value,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => color,
                labelColor: (opacity = 1) => `rgba(110, 110, 110, ${opacity})`,
                propsForBackgroundLines: { stroke: "rgba(110, 110, 110, 0.2)" },
                propsForDots: {
                  r: '3',
                  strokeWidth: '4',
                  stroke: color,
                },
                propsForLabels: {
                  fontFamily: lang.font,
                  fontSize: moderateScale(14)
                },
                style: { margin: 0, padding: 0 },
                propsForVerticalLabels: { fontSize: moderateScale(14) },
              }}
              style={{
                width: dimensions.WINDOW_WIDTH * widthC,
                marginVertical: 8,

              }}
              withVerticalLines={true}
            />
          </View>
        </ScrollView>

        <ScrollView showsHorizontalScrollIndicator={false} style={{ marginBottom: moderateScale(10) }} horizontal>
          {
            durationList.map((item, index) => {
              return (
                <TouchableOpacity
                  style={[styles.scrollItems, { backgroundColor: selectedWeek == item.name ? defaultTheme.gold : defaultTheme.lightGray }]}
                  onPress={() => onWeekSelected(item)}
                >
                  <Text style={{ color: selectedWeek == item.name ? "white" : "black", fontFamily: lang.font, padding: moderateScale(9), paddingHorizontal: moderateScale(20), fontSize: moderateScale(15) }} key={`${index - item.name}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
        {/* <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.send}
          leftImage={require("../../../res/img/done.png")}
          onPress={getReport}
          isLoading={isLoading}
        /> */}
      </ScrollView>
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
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(17),
    marginVertical: moderateScale(25),
    marginBottom: 0,
    color: defaultTheme.gray
  },
  dropDownContainer1: {
    marginHorizontal: 0,
    width: moderateScale(130),
    borderWidth: 1,
    borderColor: defaultTheme.green,
    borderRadius: moderateScale(8),

  },
  dropDownDateContainer1: {
    marginHorizontal: 0,
    width: moderateScale(125),
    alignSelf: "center",
    justifyContent: "space-around"
  },
  dropDownContainer2: {
    marginHorizontal: 0,
    width: moderateScale(100),
    borderWidth: 1,
    borderColor: defaultTheme.green,
    borderRadius: moderateScale(8)
  },
  dropDownDateContainer2: {
    marginHorizontal: 0,
    width: moderateScale(90),
    alignSelf: "center",
    justifyContent: "space-around"
  },
  text: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(24),
    color: defaultTheme.gray
  },
  chartContainer: {
    marginTop: moderateScale(25)
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.75,
    height: moderateScale(37),
    backgroundColor: defaultTheme.green,
    alignSelf: "center",
    marginTop: moderateScale(35)
  },
  scrollItems: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(5),
  },
  catChild: {

  }

});

export default ReportScreen;
