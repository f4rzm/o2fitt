import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { calculatePercent } from '../redux/actions/dietNew'
import ChangePackage from '../../res/img/changePackage.svg'
import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find';

PouchDB.plugin(pouchdbSearch);

const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });

const FastingPlanFoodRow = ({ pack, meal, title,  lang, onChangepackage,  user, auth, selectedDate,fastingDiet, diet, icon }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const getFromDb = async () => {
        setLoading(true)

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
                url: urls.baseFoodTrack2 + urls.userTrackFood,
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
                setLoading(false)
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
        setLoading(true)
        pack.dietPackFoods.forEach((element, index) => {

            offlineDB.allDocs({ include_docs: false }).then((records) => {

                offlineDB.post({
                    method: "delete",
                    type: "meal",
                    url: urls.baseFoodTrack2 + urls.userTrackFood + `?_id=${element.serverId}`,
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
        let removedmealFromServer = fastingDiet
        removedmealFromServer[selectedDate][meal].isAte = false
        if (pack.dietPackFoods.length - 1 == index) {
            dispatch(setFastingMeal(removedmealFromServer))
            let percent = diet.percent - 0.55
            setTimeout(() => {
                dispatch(calculatePercent(percent))
                setLoading(false)
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
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image
                        source={icon}
                        style={{ width: moderateScale(27), height: moderateScale(27), resizeMode: "contain" }}
                    />
                    <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(10) }}>
                        {title}
                    </Text>
                </View>
                <Text style={{ color: defaultTheme.mainText, fontFamily: lang.font, fontSize: moderateScale(15) }}>
                    {pack.caloriValue} کالری
                </Text>
            </View>
            {pack.dietPackFoods &&
                pack.dietPackFoods.map((item) => (
                    <FastingFoodRow item={item} foodDB={foodDB} lang={lang} selectedDate={selectedDate} />
                ))
            }

            {
                loading ?
                    <View style={{paddingVertical:moderateScale(18)}}>
                        <ActivityIndicator color={defaultTheme.primaryColor} size={"large"}/>
                    </View> :
                    pack.isAte == true ?
                        <View style={[styles.footerContainer, { justifyContent: "center" }]}>
                            <ConfirmButton
                                lang={lang}
                                title={"لغو"}
                                style={{ width: dimensions.WINDOW_WIDTH * 0.5, backgroundColor: defaultTheme.white, borderWidth: 1, borderColor: defaultTheme.error}}
                                textStyle={{ fontSize: moderateScale(15), color: defaultTheme.error }}
                                onPress={removeFromServer}
                            />
                        </View>
                        :
                        <View style={styles.footerContainer}>

                            <TouchableOpacity onPress={() => getFromDb()} activeOpacity={0.8} style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, backgroundColor: defaultTheme.primaryColor, alignItems: "center", padding: moderateScale(10) }}>
                                <Image
                                    source={require('../../res/img/done.png')}
                                    style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain" }}
                                />
                                <Text style={{ color: "white", fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>ثبت در روزانه</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => onChangepackage(meal)} activeOpacity={0.8} style={{ height: moderateScale(42), justifyContent: "center", flexDirection: "row", borderRadius: 10, alignItems: "center", borderColor: defaultTheme.border, borderWidth: 1, paddingHorizontal: moderateScale(15) }}>
                                <ChangePackage />
                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5), color: defaultTheme.darkText }}>تعویض برنامه</Text>
                            </TouchableOpacity>


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
        paddingVertical: moderateScale(15),
        justifyContent: "space-around",
        alignItems: "center"
    }
})