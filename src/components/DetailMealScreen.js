import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Dimensions, Text, I18nManager } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { defaultTheme } from '../constants/theme';

const { width } = Dimensions.get("screen")
const DetailsMeal = props => {
  const diet = props.diet
  //==================VARIABLES=======================
  const lang = useSelector(state => state.lang);
  const nutrient = new Array(34).fill(0);
  console.log(props.meal);

  //==================FUNCTION=======================
  const calculateCalorie = () => {
    props.meal.map(item => {
      let stringArray =
        typeof item.foodNutrientValue === 'string'
          ? item.foodNutrientValue.split(',')
          : item.foodNutrientValue;

      let floatArray = stringArray.map(ind => parseFloat(ind));

      nutrient.map((_, index) => {
        nutrient[index] = nutrient[index] + floatArray[index];
      });
    });
    return nutrient[23].toFixed(0);
  };

  const renderListMeal = () => {
    return props.meal.map((item, index) => {
      return (
        <View style={[styles.row, styles.itemMealHolder,{borderBottomWidth:1,borderBottomColor:defaultTheme.border}]} key={index}>
          <View style={styles.itemMeal}>
            <Text style={[styles.mealName, { fontFamily: lang.titleFont, color: defaultTheme.darkText,textAlign:"left",paddingVertical:moderateScale(8) }]}>{item.foodName}</Text>
            {item.measureUnitName == undefined ? null : <View style={{ flexDirection: I18nManager.isRTL ? "row" : "row-reverse" }}><Text style={[styles.mealMeasureUnitName, { fontFamily: lang.font }]}>{`${item.value} ${item.measureUnitName}`}</Text></View>}
          </View>
          <Text style={{ fontFamily: lang.font, fontSize: moderateScale(17), color: defaultTheme.darkText }}>
            {
              typeof (item.foodNutrientValue) === "string" ? parseInt(item.foodNutrientValue.split(",")[23]) : parseInt(item.foodNutrientValue[23])
            }
          </Text>
        </View>
      )
    })
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.title]}>
        {props.iconMeal}
        <Text style={[styles.titleMeal, { fontFamily: lang.titleFont, color: defaultTheme.darkText }]}>{props.mealName}</Text>

        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}>{calculateCalorie()}</Text>
        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}> {lang.from} </Text>
        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}>{diet.isActive && diet.isBuy ? parseInt(props.budget * 1.03) : props.budget.split('.')[0]}</Text>
        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16), color: defaultTheme.darkText }}> {lang.calories}</Text>
      </View>
      {renderListMeal()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width - 40,
    alignSelf: 'center',
    borderWidth: .5,
    borderColor: defaultTheme.gray,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  title: {
    backgroundColor: '#F0F0F1',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  titleMeal: {
    flex: 1,
    fontSize: moderateScale(17),
    marginStart: 10,
  },
  itemMealHolder: {
    paddingHorizontal: 10,
  },
  itemMeal: {
    flex: 1,
    marginVertical: 5
  },
  mealName: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText,

  },
  mealMeasureUnitName: {
    fontSize: moderateScale(13),
    color: defaultTheme.darkText,
  }
})

export default DetailsMeal;
