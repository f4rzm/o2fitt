import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { dimensions } from '../constants/Dimensions'
import { allMeasureUnits } from '../utils/measureUnits'
import FastingFoodRow from './FastingFoodRow'
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme'
import ConfirmButton from './ConfirmButton'
import analytics from '@react-native-firebase/analytics';
import { urls } from '../utils/urls'
import { setFastingMeal } from '../redux/actions/fasting'
import { useDispatch } from 'react-redux';
import { calculatePercent } from '../redux/actions/diet'

const FastingPlanFoodRow = ({ pack, meal, title, foodDB, lang, onChangepackage, offlineDB, user, auth, selectedDate, mealDB, fastingDiet,diet }) => {
    const dispatch = useDispatch()
    const getFromDb = async () => {

        await pack.dietPackFoods.forEach(async (item, index) => {
            await foodDB.get(`${item.foodName}_${item.foodId}`)
                .then(async (records) => {
                    saveServer(records, item, index)
                }).catch((err) => {
                    // console.error(err);
                })
        })
        analytics().logEvent('set_fasting_meal');
    }
    const saveServer = (food, packageItem, index) => {

        // alert(packageData.dietPackFoods.length)

        const filteredMeasureUnit = allMeasureUnits.filter((item) => item.id == packageItem.measureUnitId)
        const nutrientValue = food.nutrientValue.map((item) => (item * packageItem.value * filteredMeasureUnit[0].value) / 100)
        // //console.error(packages.foodName, nutrientValue);
        const params = {
            id: 0,
            foodId: packageItem.foodId,
            value: packageItem.value,
            foodName: packageItem.foodName,
            userId: user.id,
            foodMeal: parseInt(meal),
            insertDate: selectedDate,
            foodNutrientValue: nutrientValue,
            measureUnitId: packageItem.measureUnitId,
            measureUnitName: packageItem.measureUnitName,
            personalFoodId: '',
            _id: `${user.id}${Date.now().toString()}`
        }


        offlineDB.allDocs({ include_docs: false }).then((records) => {

            offlineDB.post({
                method: 'post',
                type: 'meal',
                url: urls.foodBaseUrl + urls.userTrackFood,
                header: {
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token,
                        Language: lang.capitalName,
                    },
                },
                params: params,
                index: records.total_rows
            })
                .then((res) => {
                    onSuccess(params, index)
                });
        })
    }

    const onSuccess = (params, index) => {
        saveToDB({
            ...params
        });
        let serverIdPackChange = fastingDiet
        serverIdPackChange[selectedDate][meal].dietPackFoods[index].serverId = params._id
        dispatch(setFastingMeal(serverIdPackChange))

        if (pack.dietPackFoods.length - 1 == index) {
            let changeIsAte = fastingDiet
            changeIsAte[selectedDate][meal].isAte = true

            dispatch(setFastingMeal(changeIsAte))

            let percent = diet.percent + 0.55
            setTimeout(() => {
                dispatch(calculatePercent(percent))
    
            }, 1000);
        }

        

    }

    const saveToDB = (meal) => {
        mealDB
            .find({
                selector: { _id: meal._id },
            })
            .then((records) => {
                console.log('rec =>', records);
                if (records.docs.length === 0) {
                    mealDB.put(meal, () => {
                        // setSaving(false);
                    });
                } else {
                    mealDB.put(
                        { ...meal, _id: records.docs[0]._id, _rev: records.docs[0]._rev },
                        () => {
                            // setSaving(false);
                        },
                    );
                }
            });
        // analytics().logEvent('setMeal', {
        //     id: meal.foodMeal,
        // });
    };

    const removeFromServer = (id, modalId) => {

        pack.dietPackFoods.forEach((element, index) => {

            offlineDB.allDocs({ include_docs: false }).then((records) => {

                offlineDB.post({
                    method: "delete",
                    type: "meal",
                    url: urls.foodBaseUrl2 + urls.userTrackFood + `?_id=${element.serverId}`,
                    header: { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } },
                    params: { ...element },
                    index: records.total_rows
                }).then(res => {
                    //console.log(res)
                    removeMealDB(element, index)

                })
            })

        });

    }

    const removeMealDB = (element, index) => {

        let removedmealFromServer=fastingDiet
        removedmealFromServer[selectedDate][meal].isAte=false
        if (pack.dietPackFoods.length - 1 == index) {
            dispatch(setFastingMeal(removedmealFromServer))
            let percent = diet.percent - 0.55
            setTimeout(() => {
                dispatch(calculatePercent(percent))
           
            }, 1000);
        }

        mealDB.find({
            selector: { _id: element.serverId }
        }).then(rec => {
            if (rec.docs.length > 0) {
                mealDB.put({ ...rec.docs[0], _deleted: true }).then(() => {

                })
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15) }}>
                    {title}
                </Text>
                <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15) }}>
                    {pack.caloriValue} کالری
                </Text>
            </View>
            {pack.dietPackFoods &&
                pack.dietPackFoods.map((item) => (
                    <FastingFoodRow item={item} foodDB={foodDB} lang={lang} />
                ))
            }

            {
                pack.isAte == true ?
                    <View style={[styles.footerContainer, { justifyContent: "center" }]}>
                        <ConfirmButton
                            lang={lang}
                            title={"لغو"}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.5, backgroundColor: defaultTheme.white, borderWidth: 1, borderColor: defaultTheme.error, elevation: 5 }}
                            textStyle={{ fontSize: moderateScale(15), color: defaultTheme.error }}

                            onPress={removeFromServer}
                        />
                    </View>
                    :
                    <View style={styles.footerContainer}>
                        <ConfirmButton
                            lang={lang}
                            title={lang.add}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.4 }}
                            textStyle={{ fontSize: moderateScale(15) }}

                            onPress={getFromDb}
                        />
                        <ConfirmButton
                            lang={lang}
                            title={lang.change}
                            style={{ width: dimensions.WINDOW_WIDTH * 0.4, backgroundColor: defaultTheme.white }}
                            textStyle={{ color: defaultTheme.mainText, fontSize: moderateScale(15) }}
                            onPress={() => { onChangepackage(meal) }}
                        />
                    </View>
            }


        </View>
    )
}

export default FastingPlanFoodRow

const styles = StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        borderRadius: moderateScale(10),
        overflow: "hidden",
        borderColor: defaultTheme.border,
        borderWidth: 1,
        marginVertical: moderateScale(10)
    },
    headerContainer: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: defaultTheme.grayBackground,
        padding: moderateScale(15),
        justifyContent: "space-between"
    },
    footerContainer: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: defaultTheme.grayBackground,
        padding: moderateScale(15),
        justifyContent: "space-between",
        alignItems: "center"
    }
})