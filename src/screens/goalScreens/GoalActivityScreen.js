
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import { LineChart } from "react-native-chart-kit";
import { ConfirmButton, RowSpaceBetween, TwoOptionModal } from '../../components';
import { ScrollView } from 'react-native-gesture-handler';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';

PouchDB.plugin(pouchdbSearch)
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' })

const GoalActivityScreen = props => {
  const { width, height } = Dimensions.get('screen');

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const auth = useSelector(state => state.auth)
  const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(false)

  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
  const disable = hasCredit ? false : true

  // const days = React.useRef([
  //   lang["1shanbe"],
  //   lang["2shanbe"],
  //   lang["3shanbe"],
  //   lang["4shanbe"],
  //   lang["5shanbe"],
  //   lang["jome"],
  //   lang["shanbe"]
  // ]).current
  const [chartDays, setChartDays] = React.useState(days)
  const [weekData, setWeekData] = React.useState(new Array(7).fill(0))
  const [selectedItem, setSelectedItem] = useState(7);
  const [chartLabel, setChartLabels] = useState();
  const [chartData, setChartData] = useState([]);
  const [ratio, setRatio] = useState(1);
  const reportSteps = new Array(selectedItem).fill(0);
  const days = new Array(selectedItem).fill(0);
  let labels = [];


  // React.useEffect(() => {
  //   const d = []
  //   new Array(7).fill(1).map((item, index) => {
  //     d.push(days[moment().subtract(6 - index, "days").day()])
  //   })
  //   setChartDays(d)

  //   calculateWeekValues()

  //   pedoDB.changes({ since: 'now', live: true }).on('change', calculateWeekValues)
  // }, [])
  useEffect(() => {
    if (hasCredit == true) {
      viewReport(selectedItem)
    }
  }, [selectedItem]);

  React.useEffect(() => {
    let backHandler = null
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => { props.navigation.goBack(); return true })
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

  // const editGoal = () => {
  //   if (hasCredit) {
  //     props.navigation.navigate("EditGoalScreen")
  //   }
  //   else {
  //     goToPackages()
  //   }
  // }

  const dataCurvePicker = [
    { name: `1 ${lang.week}`, id: 7 },
    { name: `2 ${lang.week}`, id: 14 },
    { name: `3 ${lang.week}`, id: 21 },
    { name: `${lang.sleepChartTab_month}`, id: 30 },
  ];

  // const calculateWeekValues = () => {

  //   let m = moment()
  //   m.subtract(6, "days")
  //   let week = new Array(7).fill(0)
  //   pedoDB.allDocs({ include_docs: true }).then(rec => {
  //     console.log("rec", rec.rows)
  //     const allPedos = rec.rows.map(item => item.doc)
  //     new Array(7).fill(0).map(async (item, index) => {

  //       const date = m.format("YYYY-MM-DD")
  //       m = m.add(1, "day")

  //       const records = allPedos.filter(item => item.insertDate.includes(date))

  //       if (records.length > 0) {
  //         let c = 0
  //         records.map(item => c += item.stepsCount)
  //         week[index] = c
  //       }
  //       else {
  //         week[index] = 0
  //       }
  //       if (index === 6) {
  //         console.log("week", week)
  //         setWeekData(week)
  //       }
  //     })

  //   })
  // }

  const goToPackages = () => {
    setTimeout(() => {
      props.navigation.navigate("PackagesScreen")
    }, Platform.OS === "ios" ? 500 : 50)
  }
  const viewReport = (days) => {
    const url = `${urls.workoutBaseUrl}${urls.userTrackSteps}/${urls.userHistory}?userId=${profile.userId}&&days=${days}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const RC = new RestController();
    RC.get(url, header, onSuccessGetHistorySteps, onFailureGetHistorySteps);
  };
  const calculateRatio = () => {
    if (selectedItem === 7) {
      setRatio(1);
    } else if (selectedItem === 14) {
      setRatio(1.3);
    } else if (selectedItem === 21) {
      setRatio(1.6);
    } else if (selectedItem === 30) {
      setRatio(2);
    }
  };

  const onSuccessGetHistorySteps = response => {
    // console.warn(response)
    calculateRatio();
    days.forEach((_, index) => {
      const day = moment()
        .subtract(selectedItem - (index + 1), 'days')
        .format('YYYY-MM-DD');

      labels = [...labels, momentJalaali(day).format('jMM/jDD')];

      response.data.data.map(item => {
        if (item.insertDate.includes(day)) {
          reportSteps[index] = reportSteps[index] + item.stepsCount;
        }
      });
    });
    console.warn(chartData)
    setChartLabels(labels);
    setChartData(reportSteps);

  };

  const onFailureGetHistorySteps = response => {
    // console.log({response});
  };




  return (
    <View style={styles.mainContainer}>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center" }}>
        <View style={{ width: dimensions.WINDOW_WIDTH, margin: 0, overflow: "hidden", alignItems: "center" }}>
          <View style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(50), flexDirection: "row",justifyContent:"space-around" }}>
            {dataCurvePicker.map((item) => {
              return (
                <TouchableOpacity disabled={disable} onPress={() => setSelectedItem(item.id)} style={{justifyContent: "center", alignItems: "center", borderRadius: 20,borderColor:"red",backgroundColor: selectedItem == item.id ? defaultTheme.gold : defaultTheme.lightGray,height:moderateScale(45),marginTop:moderateScale(15) }}>
                  <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal:moderateScale(20), borderRadius: 20, color: selectedItem == item.id ? "white" : defaultTheme.darkText, }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )
            })
            }
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           {!hasCredit? <TouchableOpacity onPress={goToPackages} style={{ position: 'absolute', width: width, height: height * 0.5, zIndex: 10, justifyContent: "center", alignItems: "center" }}>
              <Image
                source={require("../../../res/img/lock.png")}
                style={{ width: moderateScale(40), height: moderateScale(40) }}
                resizeMode='contain'
              />
              <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}>{lang.subscribe1}</Text>
            </TouchableOpacity>:null}
            <LineChart
              bezier
              data={{
                labels: chartLabel,
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={width * ratio}
              height={height * 0.5}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              withShadow={false}
              withVerticalLines={false}
              verticalLabelRotation={-90}
              xLabelsOffset={moderateScale(12)}
              yLabelsOffset={10}
              fromZero={true}
              chartConfig={{
                horizontalOffset: 2,
                width: width * ratio,
                backgroundColor: defaultTheme.green,
                backgroundGradientFrom: defaultTheme.lightBackground,
                backgroundGradientTo: defaultTheme.lightBackground,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(249, 139, 6, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(110, 110, 110, ${opacity})`,
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: defaultTheme.primaryColor,
                },
                propsForLabels: {
                  fontFamily: lang.font,
                },
                style: { margin: 0, padding: 0 },
                propsForVerticalLabels: { fontSize: moderateScale(11) },
              }}
              onDataPointClick={e => console.log(e)}
              style={{
                width: width * ratio,
                marginVertical: 25,
              }}
            />
          </ScrollView>
        </View>

        {/* <RowSpaceBetween  style={styles.titleContainer}>
              <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                {lang.golActivity}
              </Text>
              <Text style={[styles.title , {fontFamily : lang.font}]} allowFontScaling={false}>
                {lang.gol}
              </Text>
            </RowSpaceBetween>
            <RowSpaceBetween>
              <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                {lang.numberStepsInDay}
              </Text>
              <Text style={[styles.text , {fontFamily : lang.font , fontSize : moderateScale(18)}]} allowFontScaling={false}>
                {profile.targetStep}
              </Text>
            </RowSpaceBetween> */}

        {/* <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.editGolActivity}
                leftImage={require("../../../res/img/edit.png")}
                onPress={editGoal}
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
    </View >
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: moderateScale(80),
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: defaultTheme.border
  },
  headerTab: {
    width: dimensions.WINDOW_WIDTH * 0.25,
    height: moderateScale(65),
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: defaultTheme.border,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  headerText: {
    fontSize: moderateScale(15),
    color: defaultTheme.gray
  },
  row: {
    borderBottomWidth: 1,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(10),
    marginTop: 0,
    marginBottom: 0
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.52,
    height: moderateScale(35),
    backgroundColor: defaultTheme.green,
    margin: moderateScale(25)
  },
  title: {
    color: defaultTheme.darkGray,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(10)
  },
  text: {
    color: defaultTheme.gray,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(10)
  },
  titleContainer: {
    backgroundColor: defaultTheme.grayBackground,
    marginVertical: 0,
    paddingVertical: moderateScale(8)
  },
});

export default GoalActivityScreen;
