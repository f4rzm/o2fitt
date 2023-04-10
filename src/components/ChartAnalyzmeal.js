import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ChartPieAnimation from './chartpieAnimation/ChartpieAnimation';
import { defaultTheme } from '../constants/theme'
import { nutritions } from '../utils/nutritions';
import { moderateScale } from 'react-native-size-matters';

const ChartAnalyzmeal = props => {
  const budget = props.route.budget
  const remainingCalorie = (props.diet.isActive ? budget * 1.03 : budget) - props.nutrient[23]

  const bigNutrient = [
    { id: 31, color: defaultTheme.error, text: nutritions[4][props.lang.langName] },
    { id: 9, color: defaultTheme.green, text: nutritions[3][props.lang.langName] },
    { id: 0, color: defaultTheme.blue, text: nutritions[2][props.lang.langName] },
  ];

  const calorie = [
    { text: props.lang.calorieGive, color: defaultTheme.green2, amountCalorie: props.nutrient[23].toFixed(0) },
    { text: props.lang.calorieRemain, color: defaultTheme.gray, amountCalorie: remainingCalorie > 0 ? remainingCalorie.toFixed(0) : 0 },
  ];
  const macroNutritious = () => {
    return bigNutrient.map((item, index) => {
      return (
        <View style={styles.row} key={index}>
          <View
            style={[
              styles.circle,
              { backgroundColor: bigNutrient[index].color },
            ]}></View>
          <Text style={[styles.textSmallNutrient, { fontFamily: props.lang.font }]}>{bigNutrient[index].text}</Text>
          <Text style={[styles.number, { fontFamily: props.lang.font }]}>{parseFloat(props.nutrient[bigNutrient[index].id].toFixed(2))}</Text>
          <Text style={[styles.unit, { fontFamily: props.lang.font }]}>{props.lang.gr}</Text>
        </View>
      );
    });
  };
  const getCalories = () => {
    return calorie.map((item, index) => {
      return (

        <View style={[styles.containerCalorie, index == 1 ? { marginStart: 50 } : null]} key={index}>
          <View style={[styles.circleCalorie, { backgroundColor: calorie[index].color }]}>
            <Text style={[styles.styleNumberCalorie, { fontFamily: props.lang.font }]}>{calorie[index].amountCalorie}</Text>
          </View>
          <Text style={[styles.styleTextCalorie, { fontFamily: props.lang.font }]}>{calorie[index].text}</Text>
        </View>
      );
    });
  };

  return useMemo(() => {
    return (
      <View>
        <View style={styles.chart}>
          <ChartPieAnimation route={props.route} nutrient={props.nutrient} />
          <View style={styles.detailsBigNutrient}>
            {macroNutritious()}
            <View style={styles.rowFloor}>{getCalories()}</View>
          </View>
        </View>
      </View>
    )
  }, [])

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenLeft: {
    padding: moderateScale(15),
  },
  rightIcon: {
    transform: [{ rotate: '180deg' }],
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
  },
  contentList: {
    alignItems: 'center',
  },
  list: {
    borderWidth: 0.5,
    borderColor: 'red',
  },
  mainContainer: {
    flex: 1,
  },
  holderActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    backgroundColor: '#FBFBFB',
    paddingVertical: moderateScale(17),
    marginTop: 10,
    paddingStart: 20,
  },
  textTitle: {
    fontSize: moderateScale(14),

  },
  chart: {
    flexDirection: 'row',

  },
  detailsBigNutrient: {
    flex: 1,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginVertical: moderateScale(10),
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginEnd: 10,
    top:moderateScale(2)
  },
  unit: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText
  },
  number: {
    marginHorizontal: moderateScale(5),
    fontSize: moderateScale(15),
    color: defaultTheme.darkText
  },
  rowFloor: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
  circleCalorie: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCalorie: {
    width: '30%',
  },
  styleNumberCalorie: {
    color: defaultTheme.lightText,
    fontSize: moderateScale(18)
  },
  styleTextCalorie: {
    textAlign: 'center',
    fontSize: moderateScale(15),
    color: defaultTheme.darkText,
    left: moderateScale(-4)
  },
  textSmallNutrient: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText
  }
})
export default ChartAnalyzmeal;