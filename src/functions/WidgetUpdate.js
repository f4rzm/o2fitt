import React from 'react'
import { Alert, NativeModules } from 'react-native'
import PouchDB from '../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateCalorie } from './CalculateDailyCalorie';
import moment from 'moment'
PouchDB.plugin(pouchdbSearch);

const waterDB = new PouchDB('water', { adapter: 'react-native-sqlite' });
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' });
const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' });
const adDB = new PouchDB('ad', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });
const { RNSharedWidget } = NativeModules;

const getWidgetStep = async () => {
    let date = moment().format('YYYY-MM-DD');
    let step = 0
    let burnedCalorie = 0
    const reg = RegExp('^' + date, 'i');
    await pedoDB
        .find({
            selector: { insertDate: { $regex: reg } },
        })
        .then((records) => {
            //console.error(records.docs);
            if (records.docs.length !== 0) {
                records.docs.map((item) => {
                    step += item.stepsCount
                    burnedCalorie += parseFloat(item.burnedCalories);
                })
            }
        });
    return { step: step, burnedCalorie: parseInt(burnedCalorie) }

};
const getActivityFromDB = async date => {
    const reg = RegExp('^' + date, 'i');
    let burnedCalorie = 0
    await activityDB
        .find({
            selector: { insertDate: { $regex: reg } },
        })
        .then(rec => {
            console.log('activityDB', rec.docs);
            const records = rec.docs;
            records.map(item => {
                if (!isNaN(parseFloat(item.burnedCalories))) {
                    burnedCalorie += parseFloat(item.burnedCalories);
                }
            });

        });
    return parseInt(burnedCalorie)
};

export const widgetUpdate = async ({ diet, hasCredit, profile, user, specification }) => {
    const pedometer = await getWidgetStep()
    const burnedCalorie = await getActivityFromDB() + pedometer.burnedCalorie
    const calDailyCalorie = calculateCalorie({ profile: profile, specification: specification, user: user, diet: diet })
    console.error('this is burnedCalorie', calDailyCalorie.targetCalorie);
    let getWeekFoodForWidget = {
        dailyPro: 0,
        dailyCarb: 0,
        DailyFat: 0,
        dailyCalorie: 0,
        dailyCaloriePercent: 0.8,
        pro: 0,
        carbo: 0,
        fat: 0,
        calorie: 0,
        dailyWater: 0,
        drinkedWater: 0,
        dailyPedometer: 0,
        pedometer: 0,
        dietProgress: 0,
        hasCredit: hasCredit
    };

    let date = moment().format('YYYY-MM-DD');
    const reg = RegExp('^' + date, 'i');
    await mealDB
        .find({
            selector: { insertDate: { $regex: reg } },
        })
        .then(records => {
            let cal = 0;
            let prot = 0;
            let carbo = 0;
            let fat = 0;
            let ow = 0
            if (records.docs.length > 0) {
                records.docs.map(item => {
                    const foodNutrientValue =
                        typeof item.foodNutrientValue === 'string'
                            ? item.foodNutrientValue.split(',')
                            : item.foodNutrientValue;
                    cal += parseInt(foodNutrientValue[23]);
                    fat += parseFloat(foodNutrientValue[0]);
                    carbo += parseFloat(foodNutrientValue[31]);
                    prot += parseFloat(foodNutrientValue[9]);
                    ow += parseFloat(foodNutrientValue[1]);


                });
                getWeekFoodForWidget = {
                    dailyPro: calDailyCalorie.targetPro,
                    dailyCarb: calDailyCalorie.targetCarbo,
                    DailyFat: calDailyCalorie.targetFat,
                    dailyCalorie: parseInt(calDailyCalorie.targetCalorie) + parseInt(burnedCalorie),
                    dailyCaloriePercent: (cal / (parseInt(calDailyCalorie.targetCalorie) + parseInt(burnedCalorie))),
                    pro: prot,
                    carbo: carbo,
                    fat: fat,
                    calorie: cal,
                    drinkedWater: parseFloat(ow /= 240).toFixed(2),
                    pedometer: pedometer.step,
                    dailyPedometer: profile.targetStep,
                    dailyWater: hasCredit ? Math.min(15.5, parseFloat((Math.round((parseFloat(specification[0].weightSize) * 41.6150228) * 2 / 240) / 2).toFixed(1))) : 8,
                    dietProgress: parseInt(diet.percent),
                    hasCredit: hasCredit
                };
            } else {
                getWeekFoodForWidget = {
                    dailyPro: calDailyCalorie.targetPro,
                    dailyCarb: calDailyCalorie.targetCarbo,
                    DailyFat: calDailyCalorie.targetFat,
                    dailyCalorie: parseInt(calDailyCalorie.targetCalorie) + parseInt(burnedCalorie),
                    dailyCaloriePercent: (cal / (parseInt(calDailyCalorie.targetCalorie) + parseInt(burnedCalorie))),
                    pro: 0,
                    carbo: 0,
                    fat: 0,
                    calorie: 0,
                    drinkedWater: parseFloat(ow /= 240).toFixed(2),
                    pedometer: pedometer.step,
                    dailyPedometer: profile.targetStep,
                    dailyWater: hasCredit ? Math.min(15.5, parseFloat((Math.round((parseFloat(specification[0].weightSize) * 41.6150228) * 2 / 240) / 2).toFixed(1))) : 8,
                    dietProgress: parseInt(diet.percent),
                    hasCredit: hasCredit
                };
            }
        });

    await waterDB.find({
        selector: { insertDate: { $regex: reg } },
    }).then(records => {
        let water = 0
        records.docs.map(item => { water = parseFloat(item.value) })
        console.error(water, getWeekFoodForWidget.drinkedWater);
        getWeekFoodForWidget = {
            ...getWeekFoodForWidget, drinkedWater: parseFloat(parseFloat(getWeekFoodForWidget.drinkedWater) + parseFloat(water)), pedometer: pedometer.step,
        }

    })

    RNSharedWidget.setData(
        'convertorO2fitt',
        JSON.stringify(getWeekFoodForWidget),
        status => {
            console.error(status);
        },
    );
};