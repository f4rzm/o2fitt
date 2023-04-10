import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Animated,
    BackHandler,
    Platform,
    I18nManager,
    TouchableWithoutFeedback
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SearchFoodHeader, ConfirmButton, FoodToolbar, RowSpaceBetween, MealDetailsCard, DropDown, EditIngredientRow,  Information, TwoOptionModal,DynamicTimePicker } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import ImagePicker from 'react-native-image-crop-picker';
import { urls } from "../../utils/urls"
import pouchdbSearch from 'pouchdb-find'
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'
import { BlurView } from '@react-native-community/blur';
import moment from 'moment'

const cookType = [
    {
        bakingType: 0,
        persian: "انتخاب کنید",
        english: "Choose",
        arabic: "انتخب"
    },
    {
        bakingType: 9,
        persian: "بدون نوع پخت",
        english: "No type of cooking",
        arabic: "لا يوجد نوع من الطبخ"
    },
    {
        bakingType: 1,
        persian: "شعله خیلی کم",
        english: "Very low flame",
        arabic: "لهب منخفض جدا"
    },
    {
        bakingType: 2,
        persian: "شعله کم",
        english: "Low flame",
        arabic: "لهب منخفض"
    },
    {
        bakingType: 3,
        persian: "شعله متوسط",
        english: "Medium flame",
        arabic: "لهب متوسط"
    },
    {
        bakingType: 4,
        persian: "شعله زیاد",
        english: "High flame",
        arabic: "لهب عالي"
    },
    {
        bakingType: 5,
        persian: "سرخ کردنی",
        english: "Pan frying",
        arabic: "تحمير طاسة"
    },
    {
        bakingType: 6,
        persian: "آتشی یا کبابی",
        english: "Grill",
        arabic: "شواية"
    },
    {
        bakingType: 7,
        persian: "تنوری - فر",
        english: "Electric oven",
        arabic: "فرن كهربائي"
    },
    {
        bakingType: 8,
        persian: "بخارپز",
        english: "Steamer model",
        arabic: "باخرة"
    },
]
PouchDB.plugin(pouchdbSearch)
const personalFoodDB = new PouchDB('personalFood', { adapter: 'react-native-sqlite' })
const CreateFoodScreen = props => {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const auth = useSelector(state => state.auth)
    const app = useSelector(state => state.app)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const personalFoodModel = React.useRef({
        "id": 0,
        "userId": user.id,
        "foodName": "",
        "recip": "",
        "bakingType": 0,
        "bakingTime": "",
        "parentFoodId": 0,
        "ingredients": [],
        "nutrientValue": [],
        "imageUri": "",
        "base64": null
    }).current

    const [food, setFood] = React.useState(personalFoodModel)
    const [hour, setHour] = React.useState(0)
    const [min, setMin] = React.useState(0)
    const ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current
    let currentTy = React.useRef(dimensions.WINDOW_HEIGTH).current
    const [errorVisible, setErrorVisible] = React.useState(false)
    const [errorContext, setErrorContext] = React.useState("")
    const [nutrientLoading, setNutrientLoading] = React.useState(false)
    const [isLoading, setLoading] = React.useState(false)
    const [ImagePickerVisible, setImagePickerVisible] = React.useState(false)
    const [showBlur, setShowBlur] = useState(false);

    React.useEffect(() => {
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus', () => {
            backHandler = BackHandler.addEventListener('hardwareBackPress', goBack)
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

    React.useEffect(() => {
        ty.addListener(value => currentTy = value)
    }, [])

    const showTimePicker = () => {
        Animated.timing(ty, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    const closeTimePicker = () => {
        Animated.timing(ty, {
            toValue: dimensions.WINDOW_HEIGTH,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    const goBack = () => {
        console.log(currentTy)
        if (currentTy.value === 0) {
            closeTimePicker()
        }
        else {
            props.navigation.goBack()
        }

        return true
    }

    const goToMyCookScreen = () => {
        setErrorVisible(false)
        setTimeout(() => {
            props.navigation.replace("FoodFindScreen", { nextRoute: "SearchCookingTab", type: "", name: lang.snack, mealId: 0 })
        }, 300)
    }

    const addIngredient = (ingredient) => {
        console.log("food", food.ingredients)
        console.log("ingredient", ingredient)
        let ingredients = [...food.ingredients]
        const index = ingredients.findIndex(item => item.id === ingredient.id)
        console.log(index)
        if (index != -1) {
            ingredients[index] = ingredient
        }
        else {
            ingredients.push(ingredient)
        }

        console.log("ingredients", ingredients)
        setFood({
            ...food,
            ingredients: ingredients
        })

        props.navigation.navigate("CreateFoodScreen")
    }

    const onAdd = () => {
        props.navigation.navigate("IngredientsSearchScreen", { ingredients: food.ingredients ? food.ingredients : [], addIngredient: addIngredient })
    }

    const valueChanged = (value, index) => {
        if ((/^[0-9\.]+$/i.test(value) || value == "" || value == ".")) {
            let v = { ...food.ingredients[index], value: (value) }
            let newIngredients = [...food.ingredients]
            newIngredients[index] = v
            setFood({ ...food, ingredients: newIngredients })
        }
    }

    const unitChanged = (item, index) => {
        let v = { ...food.ingredients[index], measureUnitName: item.name, measureUnitId: item.id }
        let newIngredients = [...food.ingredients]
        newIngredients[index] = v
        console.log(newIngredients)
        setFood({ ...food, ingredients: newIngredients })
    }

    const editIngredient = (item) => {
        props.navigation.navigate("IngredientAmountScreen", { ingredient: { ...item }, addIngredient: addIngredient })
    }

    const removeIngredient = (index) => {
        const a = [...food.ingredients]
        a.splice(index, 1)

        console.log("a", a)
        setFood({ ...food, ingredients: a })
    }

    const cookTypeChanged = (item) => {
        console.log(item)
        setFood({ ...food, bakingType: item.bakingType })
        if (item.bakingType === 3) {

        }
    }

    const timeChanged = (hour, min) => {
        setHour(hour)
        setMin(min)
    }

    const onConfirm = () => {
        if (food.foodName != "") {
            if (food.ingredients.length > 0) {
                if (food.bakingType > 0) {
                    if (food.bakingType === 9 || parseInt(hour) > 0 || parseInt(min) > 0) {
                        setLoading(true)
                        personalFoodDB.find({
                            selector: { foodName: food.foodName },
                        }).then(records => {
                            console.log("rec =>", records)
                            if (records.docs.length === 0) {
                                const data = {
                                    ...food,
                                    bakingTime: hour + ":" + min,
                                    _id: Date.now().toString()
                                }


                                if (app.networkConnectivity) {
                                    saveServer(data)
                                }
                                else {
                                    setErrorVisible(true)
                                    setErrorContext(lang.noInternet)
                                    // Toast.show({
                                    //     type: "error",
                                    //     props: { text2: lang.noInternet, style: { fontFamily: lang.font } }
                                    // })
                                    setLoading(false)
                                    setShowBlur(true)
                                }
                            }
                            else {
                                setErrorContext(lang.duplicatedFoodName)
                                setErrorVisible(true)
                                // Toast.show({
                                //     type: "error",
                                //     props: { text2: lang.duplicatedFoodName, style: { fontFamily: lang.font } }
                                // })
                                setLoading(false)
                                setShowBlur(true)

                            }
                        })

                    }
                    else {
                        setShowBlur(true)

                        setErrorVisible(true)
                        setErrorContext(lang.noValidInsertDurationTime2)
                        // Toast.show({
                        //     type: "error",
                        //     props: { text2: lang.noValidInsertDurationTime2, style: { fontFamily: lang.font } }
                        // })
                    }
                }
                else {
                    setErrorVisible(true)
                    setErrorContext(lang.whatisTypeCooking)
                    setShowBlur(true)

                    // Toast.show({
                    //     type: "error",
                    //     props: { text2: lang.whatisTypeCooking, style: { fontFamily: lang.font } }
                    // })
                }
            }
            else {
                setErrorVisible(true)
                setErrorContext(lang.addNameItemFood)
                setShowBlur(true)

            }
        }
        else {
            setErrorVisible(true)
            setErrorContext(lang.empityNameFild)
            setShowBlur(true)

            // Toast.show({
            //     type: "error",
            //     props: { text2: lang.empityNameFild, style: { fontFamily: lang.font } }
            // })
        }
    }

    const saveToDB = (food) => {
        personalFoodDB.find({
            selector: { _id: food._id },
            fields: ['_id', '_rev']
        }).then(records => {
            console.log("rec =>", records)
            if (records.docs.length === 0) {
                personalFoodDB.put(food, () => {
                    //  setErrorContext(lang.successful); 
                    //  setErrorVisible(true); 
                    createIndex()
                    Toast.show({
                        type: "success",
                        props: { text2: lang.successful, style: { fontFamily: lang.font } },
                        onShow: props.navigation.replace("FoodFindScreen",{nextRoute : "SearchCookingTab" , type : "" , name : lang.snack , mealId : parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment().format("YYYYMMDD"))
                        &&
                        (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment().format("YYYYMMDD")) : true)
                        ?9:0}),
                        visibilityTime:800
                    })
                }).catch(error => console.log(error))
            }
            else {
                personalFoodDB.put({ ...food, _id: records.docs[0]._id, _rev: records.docs[0]._rev }, () => {
                    // setErrorContext(lang.successful);
                    //  setErrorVisible(true); 
                    createIndex()
                    // setLoading(false)
                    Toast.show({
                        type: "success",
                        props: { text2: lang.successful, style: { fontFamily: lang.font } },
                        onShow:props.navigation.replace("FoodFindScreen",{nextRoute : "SearchCookingTab" , type : "" , name : lang.snack , mealId : parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment().format("YYYYMMDD"))
                        &&
                        (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment().format("YYYYMMDD")) : true)
                        ?9:0}),
                        visibilityTime:800

                    })
                }).catch(error => console.log(error))
            }

        }).catch(error => console.log(error))

        analytics().logEvent('createFood')
    }

    const saveServer = (food) => {
        const url = urls.foodBaseUrl + urls.personalFood
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = {
            ...food,
            imageUri: food.base64
        }

        console.log("params", params)
        console.log("url", url)
        const RC = new RestController()
        RC.checkPrerequisites("post", url, params, header, onSuccess, onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }

    const onSuccess = (response) => {
        setLoading(false)
        if (response.data.data) {
            saveToDB({ ...response.data.data })
        }
        else {
            setErrorVisible(true)
            setErrorContext(lang.foodNoValue)
            // Toast.show({
            //     type: "error",
            //     props: { text2: lang.foodNoValue, style: { fontFamily: lang.font } }
            // })
        }
    }

    const onFailure = () => {

    }

    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    const calNutrition = () => {
        if (food.foodName != "") {
            if (food.ingredients.length > 0) {
                if (food.bakingType > 0) {
                    if (food.bakingType === 9 || (parseInt(hour) > 0 || parseInt(min) > 0)) {
                        if (app.networkConnectivity) {
                            setNutrientLoading(true)
                            const url = urls.foodBaseUrl + urls.personalFood + urls.calculateNutrients
                            const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
                            const params = { ...food, bakingTime: hour + ":" + min, }

                            console.log("params", params)
                            console.log("url", url)
                            const RC = new RestController()
                            RC.checkPrerequisites("post", url, params, header, calSuccess, calFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
                        } else {

                        }
                    }
                    else {
                        setErrorVisible(true)
                        setErrorContext(lang.noValidInsertDurationTime2)
                    }
                }
                else {
                    setErrorVisible(true)
                    setErrorContext(lang.noValidCookType)
                    // Toast.show({
                    //     type: "error",
                    //     props: { text2: lang.noValidCookType, style: { fontFamily: lang.font } }
                    // })
                }
            }
            else {
                setErrorVisible(true)
                setErrorContext(lang.addNameItemFood)
                // Toast.show({
                //     type: "error",
                //     props: { text2: lang.addNameItemFood, style: { fontFamily: lang.font } }
                // })
            }
        }
        else {
            setErrorVisible(true)
            setErrorContext(lang.empityNameFild)
        }

    }

    const calSuccess = (response) => {
        console.log(response.data.data)
        setNutrientLoading(false)
        if (response.data.data) {
            console.log("response", response.data.data)
            setFood({ ...food, nutrientValue: response.data.data })
        }
        else {
            setErrorVisible(true)
            setErrorContext(lang.foodNoValue)
            // Toast.show({
            //     type: "error",
            //     props: { text2: lang.foodNoValue, style: { fontFamily: lang.font } }
            // })
        }
    }

    const calFailure = () => {
        setNutrientLoading(false)
        setErrorVisible(true)
        setErrorContext(lang.serverError)

    }

    const openGallery = () => {
        setImagePickerVisible(false)
        setTimeout(() => {
            ImagePicker.openPicker({
                width: 400,
                height: 184,
                cropping: true,
                multiple: false,
                avoidEmptySpaceAroundImage: false,
                includeBase64: true,
                compressImageQuality: 0.8
            }).then(image => {
                console.log("choosed Image -> ", image);
                setFood({
                    ...food,
                    imageUri: image.path,
                    base64: image.data
                })
            }).catch(error => {
                console.log("error in imagePicker -> ", error)
            })
        }, 1000)

    }

    const openCamera = () => {
        setImagePickerVisible(false)
        setTimeout(() => {
            ImagePicker.openCamera({
                width: 400,
                height: 184,
                cropping: true,
                avoidEmptySpaceAroundImage: false,
                includeBase64: true,
                compressImageQuality: 0.8
            }).then(image => {
                console.log("choosed Image -> ", image);
                setFood({
                    ...food,
                    imageUri: image.path,
                    base64: image.data
                })
            }).catch(error => {
                console.log("error in imagePicker -> ", error)
            })
        }, 1000)
    }

    const createIndex = () => {
        personalFoodDB.createIndex({
            index: { fields: ['personalFoodId'] }
        })
    }

    return (
        <>
            <FoodToolbar
                lang={lang}
                title={lang.coockingPersonalTitle}
                onConfirm={onConfirm}
                onBack={() => props.navigation.goBack()}
                text={lang.saved}
            />
            <ScrollView
                contentContainerStyle={{ alignItems: "center", width: dimensions.WINDOW_WIDTH }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imgContainer}>
                    {
                        food.imageUri && food.imageUri != "" ?
                            <Image
                                source={{ uri: food.imageUri }}
                                style={{
                                    width: dimensions.WINDOW_WIDTH,
                                    height: dimensions.WINDOW_WIDTH * 0.459
                                }}
                                resizeMode={food.imageUri ? "contain" : "cover"}
                            /> :
                            <LottieView
                                style={{
                                    width: dimensions.WINDOW_WIDTH,
                                    height: dimensions.WINDOW_WIDTH * 0.459
                                }}
                                source={require('../../../res/animations/foodcook.json')}
                                autoPlay
                                loop={true}
                                resizeMode="cover"
                            />
                    }
                    <TouchableOpacity style={styles.cameraContainer} onPress={() => setImagePickerVisible(true)}>
                        <Image
                            style={styles.cameraImg}
                            source={require("../../../res/img/camera.png")}
                            resizeMode="contain"
                        />
                        <Text style={[styles.cameraText, { fontFamily: lang.font }]}>
                            {
                                lang.addPhoto
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
                <RowSpaceBetween style={styles.header}>
                    <TextInput
                        style={[styles.nameInput, { fontFamily: lang.font }]}
                        placeholder={lang.writeYourFood}
                        onChangeText={text => setFood({ ...food, foodName: text })}
                        value={food.foodName}
                        autoFocus={true}
                        selectTextOnFocus={true}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={defaultTheme.gray}
                        maxLength={30}
                    />
                </RowSpaceBetween>
                <SearchFoodHeader
                    lang={lang}
                    title={lang.ingredient}
                />
                {
                    food.ingredients.map((item, index) => {
                        return (
                            <EditIngredientRow
                                lang={lang}
                                item={item}
                                index={index}
                                key={item.id.toString()}
                                measureUnitList={item.measureUnitList}
                                valueCahanged={valueChanged}
                                unitChanged={unitChanged}
                                remove={removeIngredient}
                                showEdit={true}
                                edit={editIngredient}
                            />
                        )
                    })
                }

                <View style={styles.buttonContainer2}>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button2}
                        title={lang.addIngerdientFood}
                        leftImage={require("../../../res/img/plus.png")}
                        onPress={onAdd}
                        imageStyle={{ tintColor: defaultTheme.lightBackground }}
                    />
                </View>
                <RowSpaceBetween
                    style={{
                        marginVertical: 0,
                        paddingStart: moderateScale(16)
                    }}
                >
                    <Text style={[styles.text1, { fontFamily: lang.font,color:defaultTheme.darkText }]} allowFontScaling={false}>
                        {
                            lang.typeCoocking
                        }
                    </Text>
                    <DropDown
                        data={cookType.filter(item => item.bakingType > 0).map(item => ({ bakingType: item.bakingType, name: item[lang.langName] }))}
                        lang={lang}
                        style={{ width: moderateScale(140) }}
                        onItemPressed={cookTypeChanged}
                        selectedItem={(cookType.filter(item => item.bakingType === food.bakingType))[0][lang.langName]}
                    />
                </RowSpaceBetween>

                <RowSpaceBetween
                    style={{
                        padding: moderateScale(8),
                        paddingHorizontal: moderateScale(16),
                        borderTopWidth: 1
                    }}
                >
                    <Text style={[styles.text1, { fontFamily: lang.font,color:defaultTheme.darkText }]} allowFontScaling={false}>
                        {
                            lang.timeCoocking
                        }
                    </Text>
                    <TouchableOpacity onPress={showTimePicker}>
                        <Text style={[styles.time, { fontFamily: lang.font, marginEnd: moderateScale(30) }]} allowFontScaling={false}>
                            {parseInt(hour) < 10 ? "0" + hour : hour} : {parseInt(min) < 10 ? "0" + min : min}
                        </Text>
                    </TouchableOpacity>
                </RowSpaceBetween>

                <SearchFoodHeader
                    lang={lang}
                    title={lang.nutritionalValue100}
                />
                <MealDetailsCard
                    style={{ marginBottom: moderateScale(70) }}
                    lang={lang}
                    fat={(food.nutrientValue && food.nutrientValue.length === 34) ? (food.nutrientValue[0]).toFixed(1) : 0}
                    carbo={(food.nutrientValue && food.nutrientValue.length === 34) ? (food.nutrientValue[31]).toFixed(1) : 0}
                    protein={(food.nutrientValue && food.nutrientValue.length === 34) ? (food.nutrientValue[9]).toFixed(1) : 0}
                    calorie={(food.nutrientValue && food.nutrientValue.length === 34) ? (food.nutrientValue[23]).toFixed(1) : 0}
                    renderButton
                    calNutrition={calNutrition}
                    isLoading={nutrientLoading}
                    user={user}
                    showMealDetails={false}
                />
                {
                    errorVisible ||ImagePickerVisible ?
                    <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
                        <View style={styles.wrapper}>
                            <BlurView
                                style={styles.absolute}
                                blurType="light"
                                blurAmount={6}
                                reducedTransparencyFallbackColor="white"
                            />
                        </View>
                    </TouchableWithoutFeedback>:null
                }
            </ScrollView>
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.buttonContainer}>
                <ConfirmButton
                    lang={lang}
                    style={styles.button}
                    title={lang.saved}
                    leftImage={require("../../../res/img/done.png")}
                    onPress={onConfirm}
                    textStyle={styles.buttonText}
                    isLoading={isLoading}
                />
            </LinearGradient>
            <DynamicTimePicker
                lang={lang}
                user={user}
                ty={ty}
                close={closeTimePicker}
                onTimeConfirm={timeChanged}
                hour={hour}
                min={min}
            />
            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => errorContext === lang.successful ? goToMyCookScreen() : setErrorVisible(false)}
                lang={lang}
            />
            <TwoOptionModal
                lang={lang}
                visible={ImagePickerVisible}
                onRequestClose={() => setImagePickerVisible(false)}
                context={lang.addPhoto}
                button1={lang.camera}
                button2={lang.gallery}
                button1Pressed={openCamera}
                button2Pressed={openGallery}
            />

        </>
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: defaultTheme.green,
    },
    header: {
        marginVertical: 0,
        padding: moderateScale(5)
    },
    imgContainer: {
        width: dimensions.WINDOW_WIDTH,
        height: dimensions.WINDOW_WIDTH * 0.459,
        padding: 0
    },
    cameraContainer: {
        flexDirection: "row",
        position: "absolute",
        left: "3%",
        bottom: "6%",
        alignItems: "center"
    },
    cameraImg: {
        width: moderateScale(31),
        height: moderateScale(30),
        marginHorizontal: moderateScale(10)
    },
    cameraText: {
        fontSize: moderateScale(17),
        color: defaultTheme.lightBackground
    },
    nameInput: {
        minWidth: "70%",
        height: moderateScale(37),
        marginHorizontal: moderateScale(20),
        fontSize: moderateScale(16),
        color: defaultTheme.darkText,
        borderBottomColor: 'transparent',
        padding: 0,
        textAlign: Platform.OS === "ios" ? I18nManager.isRTL ? "right" : "left" : "auto"
    },
    rowStyle: {
        borderBottomWidth: 1.2,
        padding: moderateScale(8),
        paddingStart: moderateScale(18),
        marginVertical: 0
    },
    title: {
        fontSize: moderateScale(16),
        color: defaultTheme.gray
    },
    time: {
        fontSize: moderateScale(19),
        color: defaultTheme.gray
    },
    text1: {
        fontSize: moderateScale(13),
        color: defaultTheme.gray
    },
    blank: {
        height: dimensions.WINDOW_HEIGTH * 0.13
    },
    buttonContainer: {
        width: dimensions.WINDOW_WIDTH,
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        height: moderateScale(60)
    },
    buttonContainer2: {
        marginTop: moderateScale(12),
        width: dimensions.WINDOW_WIDTH,
        borderBottomWidth: 1.2,
        borderColor: defaultTheme.border,
        alignItems: "center"
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.65,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
    },
    button2: {
        height: moderateScale(38),
        backgroundColor: defaultTheme.green,
        margin: moderateScale(16)
    },
    buttonText: {
        fontSize: moderateScale(16)
    },
    dropDown1: {
        width: moderateScale(130),
        height: moderateScale(40),
        marginLeft: moderateScale(12),
        borderWidth: 1.2,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(13),
    },
    input: {
        width: moderateScale(70),
        height: moderateScale(40),
        minHeight: moderateScale(30),
        borderWidth: 1.2,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(13),
        borderBottomColor: 'transparent',
        marginVertical: 0,
        borderWidth: 1,
        paddingStart: 0,
        paddingEnd: 0
    },
    meal: {
        width: moderateScale(30),
        height: moderateScale(30)
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
        alignItems: 'center',
    },
});

export default CreateFoodScreen;
