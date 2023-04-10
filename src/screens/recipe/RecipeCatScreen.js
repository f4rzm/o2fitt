import { View, Text, Image, TouchableOpacity, FlatList, Platform, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConfirmButton, MainToolbar, Toolbar } from '../../components';
import { useSelector } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import Hood from '../../../res/img/hood.svg'
import { urls } from '../../utils/urls';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native'
import moment from 'moment'

import pouchdbSearch from 'pouchdb-find';
import PouchDB from '../../../pouchdb';
import RecipeCatRender from '../../components/RecipeCatRender';
PouchDB.plugin(pouchdbSearch);

const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });

function RecipeCatScreen(props) {
    const recipes = require('../../utils/recipe/recipe.json')
    const lang = useSelector((state) => state.lang);
    const auth = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user);
    const app = useSelector((state) => state.app);
    const profile = useSelector((state) => state.profile);
    const [recipesCat, setRecipesCat] = useState([])
    const [filteredRecipes, setFilteredRecipes] = useState([])
    const [searchText, setSearchText] = useState('')
    const [noResult, setNoResult] = useState(false)

    const [selectedCat, setSelectedCat] = useState(1)
    const [loading, setLoading] = useState(true)
    const [hasnetwork, setHasnetwork] = useState(true)
    const [noInternetLoad, setnoInternetLoad] = useState(false)
    const [isChange, setIsChange] = useState(false)

    const data = [
        { id: 1, image: require("../../../res/img/mainCouse.png"), title: "غذای اصلی" },
        { id: 2, image: require("../../../res/img/appetizer.png"), title: "پیش غذا" },
        { id: 3, image: require("../../../res/img/desert.png"), title: "دسر" },
        { id: 4, image: require("../../../res/img/beverage.png"), title: "نوشیدنی" },
        { id: 6, image: require("../../../res/img/vegtable.png"), title: "گیاه خواری" },
        { id: 9, image: require("../../../res/img/keto.png"), title: "کتو" },
        { id: 7, image: require("../../../res/img/sweet.png"), title: "شیرینی" },

    ]
    const onDietPressed = () => {


    }

    const getRecipes = async (recipe) => {
        setnoInternetLoad(true)
        let recipesArray = []
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };


        await recipe.forEach(async (items, index) => {
            let DB = foodDB;
            await DB.get(`${items.name}_${items.id}`)
                .then(async (records) => {
                    recipesArray.push(records)
                    if (records.recipe == null) {
                        console.warn(records.foodId);
                    }
                }).catch((err) => {
                    //    console.warn(err);
                })

            if (recipe.length - 1 == index) {
                // console.warn(recipesArray);
                setLoading(false)
                setRecipesCat(recipesArray)
            }
        })

    }
    useEffect(() => {
        let recipe = []
        setRecipesCat([])
        recipes.filter((item, index) => {
            if (item.cat == selectedCat) {
                recipe = [...recipe, { id: item.id, name: item.name }]
                // console.warn(recipe);
            }
            if (recipes.length - 1 == index) {
                getRecipes(recipe)

            }
        })
    }, [selectedCat, isChange])

    const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
    const today = moment();
    const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;
    const onRecipePresse = () => {
        props.navigation.navigate("RecipeCatScreen")
    }
    const onChangeText = (text) => {
        setSearchText(text)
        if (text == "" || text == null) {
            setFilteredRecipes(recipesCat)
        } else {
            let filteredData = recipesCat.filter((item) => {
                var tags = item.name.search(text)

                if (tags !== -1) {
                    return {...item}

                }
            })
            filteredData.length == 0 ? setNoResult(true) : setNoResult(false)
            setFilteredRecipes(filteredData)
        }
    }

    return (
        <>
            <MainToolbar
                onMessagePressed={() => props.navigation.navigate('MessagesScreen')}
                unreadNum={app.unreadMessages}
                onRecipePresse={onRecipePresse}
            />
            <View style={{ flexDirection: "row", width: dimensions.WINDOW_WIDTH, height: moderateScale(75), justifyContent: "space-evenly", marginTop: moderateScale(-20), backgroundColor: "white", borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
                {
                    data.map((item) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                if(item.id!==selectedCat){
                                    setSelectedCat(item.id)
                                setLoading(true)
                                setSearchText(null)
                                setNoResult(false)
                                setFilteredRecipes([])
                                }
                                
                            }} style={{ alignItems: "center", marginTop: moderateScale(15) }}>
                                <Image
                                    source={item.image}
                                    style={{ width: moderateScale(30), height: moderateScale(30), tintColor: selectedCat == item.id ? defaultTheme.primaryColor : defaultTheme.gray, resizeMode: 'contain' }}
                                />
                                <Text style={{ fontFamily: lang.font, color: selectedCat == item.id ? defaultTheme.primaryColor : defaultTheme.gray }}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, backgroundColor: defaultTheme.grayBackground, borderRadius: moderateScale(10),  paddingHorizontal: moderateScale(10), marginVertical: moderateScale(10),flexDirection:"row",alignItems:"center" }}>
                    <Image
                        source={require("../../../res/img/search.png")}
                        style={{width:moderateScale(25),height:moderateScale(25)}}
                    />
                    <TextInput
                        style={{fontFamily: lang.font,width:"100%",marginHorizontal:moderateScale(5)}}
                        placeholder={"اینجا جستجو کنین"}
                        onChangeText={onChangeText}
                        value={searchText}
                    >

                    </TextInput>
                </View>
                <View style={{ paddingBottom: moderateScale(150) }}>
                    <View style={{ flexWrap: "wrap", width: dimensions.WINDOW_WIDTH }}>
                        {
                            // hasnetwork ?
                            loading ? <View style={{ width: dimensions.WINDOW_WIDTH, height: "80%", alignItems: 'center', justifyContent: 'center' }}>
                                <LottieView
                                    source={require('../../../res/animations/dietLoader.json')}
                                    style={{ width: moderateScale(200), height: moderateScale(200) }}
                                    autoPlay={true}
                                    loop={true}
                                />
                            </View> :
                                <>
                                    {
                                        noResult ?
                                            <View style={{ width: dimensions.WINDOW_WIDTH, height: "90%", alignItems: 'center', justifyContent: 'center' }}>
                                                <LottieView
                                                    source={require("../../../res/animations/noresulat.json")}
                                                    style={{ width: moderateScale(200), height: moderateScale(200) }}
                                                    autoPlay={true}
                                                    loop={true}
                                                />
                                                <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16) }}>{lang.noFindItem}</Text>
                                            </View> :
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                numColumns={3}
                                                data={filteredRecipes.length > 0 ? filteredRecipes : recipesCat}
                                                contentContainerStyle={{ paddingBottom: moderateScale(200) }}
                                                renderItem={({ item, index }) => <RecipeCatRender item={item} index={index} lang={lang} hasCredit={hasCredit} />}
                                            />

                                    }
                                </>
                            // : (
                            //     <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: dimensions.WINDOW_WIDTH * 0.4, marginHorizontal: dimensions.WINDOW_WIDTH * 0.05 }}>
                            //         <View style={{ flexDirection: "row", alignItems: "center" }}>
                            //             <Image
                            //                 source={require("../../../res/img/cross.png")}
                            //                 style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain", tintColor: defaultTheme.error }}
                            //             />
                            //             <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), textAlign: "left" }}>{lang.noInternet}</Text>
                            //         </View>
                            //         <ConfirmButton
                            //             lang={lang}
                            //             title={lang.tryAgin}
                            //             style={{ alignSelf: 'center', marginVertical: moderateScale(20), paddingVertical: moderateScale(25), width: moderateScale(150), backgroundColor: defaultTheme.green }}
                            //             onPress={() => {
                            //                 setnoInternetLoad(true)
                            //                 setTimeout(() => {
                            //                     setIsChange(!isChange)
                            //                 }, 100);
                            //             }}
                            //             isLoading={noInternetLoad}
                            //         />
                            //     </View>
                            // )
                        }
                    </View>
                </View>
                {/* <TouchableOpacity style={{ alignSelf: "center", flexDirection: "row" }}>
                    <Hood />
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingBottom: moderateScale(15), color: defaultTheme.green2 }}>مشاهده بیشتر</Text>
                </TouchableOpacity> */}
            </View>
        </>
    )
}

export default RecipeCatScreen;