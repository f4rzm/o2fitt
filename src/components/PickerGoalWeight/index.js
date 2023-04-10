import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { WheelPicker } from 'react-native-wheel-picker-android';
import CommonText from '../CommonText';
import styles from './styles';

const PickerGoalWeight = ({
  lang,
  target,
  setTargetWeight,
  targetWeight,
  setWeightChangeRate,
  stableWeight,
  text1
}) => {
  //==================VARIABLES============================
  const weight = parseInt(targetWeight) - 1;
  // console.log({stableWeight});
  const [selectItemGoalWeight, setSelectGoalWeight] = useState(0);
  const [selectAmount, setSelectAmount] = useState(0);
  const [flag, setFlag] = useState(false);
  let arrayGoalWeight = [];
  for (let index = 0; index < 95; index++) {
    arrayGoalWeight.push((index + 35).toString());
  }
  // if (target == 1) {
  //   for (let index = stableWeight + 1; index <= 150; index++) {
  //     arrayGoalWeight.push((index).toString());
  //   }

  // } else {
  //   for (let index = stableWeight - 1; index >= 35; index--) {
  //     arrayGoalWeight.push((index).toString());

  //   }
  // }

  const text =
    target === 0 ? lang.stable : target === 1 ? lang.increase : lang.decrease;

  const arrayAmount = [
    `100 ${lang.perweek}`,
    `200 ${lang.perweek}`,
    `300 ${lang.perweek}`,
    `400 ${lang.perweek}`,
    `500 ${lang.perweek}`,
    `600 ${lang.perweek}`,
    `700 ${lang.perweek}`,
    `800 ${lang.perweek}`,
    `900 ${lang.perweek}`,
    `1000 ${lang.perweek}`,
  ];

  const idArray = [
    { id: 100 },
    { id: 200 },
    { id: 300 },
    { id: 400 },
    { id: 500 },
    { id: 600 },
    { id: 700 },
    { id: 800 },
    { id: 900 },
    { id: 1000 },
  ];

  useEffect(() => {
    setTimeout(() => {

      if (weight) {
        setSelectGoalWeight(weight);
        setFlag(true);
      }
    }, 100);
  }, [weight]);

  //==================FUNCTION============================
  const onItemSelected = selectedItem => {
    setTargetWeight(selectedItem + 1);
    setSelectGoalWeight(selectedItem);
  }

  const onItemSelectedAmount = selectedItem => {
    setWeightChangeRate(idArray[selectedItem]);
    setSelectAmount(selectedItem);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.holderGoalWeight, styles.right]}>
        <CommonText
          text={lang.golWeight + '   ' + lang.kg}
          styleText={styles.title}
        />

        <WheelPicker
          selectedItem={selectItemGoalWeight}
          data={target !== 0 ? arrayGoalWeight : [stableWeight.toString()]}
          onItemSelected={onItemSelected}
          itemTextFontFamily={lang.titleFont}
          selectedItemTextFontFamily={lang.titleFont}
          itemTextSize={moderateScale(16)}
          selectedItemTextSize={moderateScale(17)}
          indicatorWidth={2}
          indicatorColor='gray'
        />
      </View>
      {target == 0 ? null : <View style={styles.holderGoalWeight}>
        <CommonText text={text1} styleText={styles.title} />
        <WheelPicker
          selectedItem={selectAmount}
          data={target !== 0 ? arrayAmount : ["0"]}
          onItemSelected={onItemSelectedAmount}
          itemTextFontFamily={lang.titleFont}
          selectedItemTextFontFamily={lang.titleFont}
          itemTextSize={moderateScale(16)}
          selectedItemTextSize={moderateScale(18)}
          indicatorWidth={2}
          indicatorColor='gray'
        />
      </View>}

    </View>
  );
};

export default PickerGoalWeight;
