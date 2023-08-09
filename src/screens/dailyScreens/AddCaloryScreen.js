
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Animated,
    KeyboardAvoidingView
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SearchFoodHeader, ConfirmButton, FoodToolbar, RowSpaceBetween, RowWrapper, Information } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale, s } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import { RestController } from "../../classess/RestController"
import PouchDB from '../../../pouchdb'
import moment from "moment"
import { urls } from "../../utils/urls"
import pouchdbSearch from 'pouchdb-find'
import analytics from '@react-native-firebase/analytics';
import { mealsName } from '../../utils/interfaces/mealsInterface';
import { nutritions } from '../../utils/nutritions';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'

PouchDB.plugin(pouchdbSearch)
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })
const offlineDB = new PouchDB("offline", { adapter: 'react-native-sqlite' })

const AddCaloryScreen = props => {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const fastingDiet = useSelector(state => state.fastingDiet)
    const model = (props.route.params && props.route.params.meal) ?
        React.useRef(props.route.params.meal).current :
        React.useRef({
            "id": 0,
            "userId": user.id,
            "personalFoodId": null,
            "foodId": null,
            "foodName": lang.personalCalorie,
            "value": "",
            "measureUnitId": 0,
            "foodMeal": parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(props.route.params.selectedDate).format("YYYYMMDD"))
                &&
                (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(props.route.params.selectedDate).format("YYYYMMDD")) : true)
                ? 9 : 0,
            "insertDate": props.route.params.selectedDate,
            "foodNutrientValue": new Array(34).fill(0),
            "_id": null
        }).current

    const [meal, setMeal] = React.useState({ ...model })
    const [saving, setSaving] = React.useState(false)
    const [errorContext, setErrorContext] = React.useState("")
    const [errorVisible, setErrorVisible] = React.useState(false)
    console.log(model)
    console.log(props.route)

    const proteinChanged = (text) => {

        if (text.length > 0) {
            if (!isNaN(parseFloat(text))) {
                const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
                f[9] = parseFloat(text)
                cal = (f[9] * 4) + (fat * 9) + (carbo * 4)
                f[23] = cal
                setMeal({
                    ...meal,
                    foodNutrientValue: f
                })
            }
        }
        else {
            const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
            f[9] = 0
            cal = (f[9] * 4) + (fat * 9) + (carbo * 4)
            f[23] = cal
            setMeal({
                ...meal,
                foodNutrientValue: f
            })
        }
    }

    const carboChanged = (text) => {

        if (text.length > 0) {
            if (!isNaN(parseFloat(text))) {
                const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
                f[31] = parseFloat(text)
                cal = (f[31] * 4) + (protein * 4) + (fat * 9)
                f[23] = cal

                setMeal({
                    ...meal,
                    foodNutrientValue: f
                })
            }
        }
        else {
            const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
            f[31] = 0
            cal = (f[31] * 4) + (protein * 4) + (fat * 9)
            f[23] = cal

            setMeal({
                ...meal,
                foodNutrientValue: f
            })
        }
    }

    const fatChanged = (text) => {

        if (text.length > 0) {
            if (!isNaN(parseFloat(text))) {
                const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
                f[0] = parseFloat(text)
                cal = (f[0] * 9) + (protein * 4) + (carbo * 4)
                f[23] = cal
                setMeal({
                    ...meal,
                    foodNutrientValue: f
                })
            }
        }
        else {
            const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
            f[0] = 0
            cal = (f[0] * 4) + (protein * 4) + (carbo * 4)
            f[23] = cal
            setMeal({
                ...meal,
                foodNutrientValue: f
            })
        }
    }

    const calorieChanged = (text) => {
        if (text.length > 0) {
            if (!isNaN(parseFloat(text))) {
                const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
                f[23] = parseFloat(text)
                f[0] = 0
                f[9] = 0
                f[31] = 0
                setMeal({
                    ...meal,
                    foodNutrientValue: f
                })
            }
        }
        else {
            const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
            f[23] = 0
            f[0] = 0
            f[9] = 0
            f[31] = 0

            setMeal({
                ...meal,
                foodNutrientValue: f
            })
        }

    }

    const onConfirm = () => {

        if (!isNaN(parseFloat(meal.foodNutrientValue[23])) &&
            parseFloat(meal.foodNutrientValue[23]) > 0) {

            setSaving(true)
            const m = {
                ...meal,
                userId: user.id,
                _id: meal._id ? meal._id : Date.now().toString()
            }

            if (app.networkConnectivity) {
                saveServer({ ...m })
            }
            else {
                offlineDB.post({
                    method: "post",
                    type: "meal",
                    url: urls.baseFoodTrack + urls.userTrackFood,
                    header: { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } },
                    params: { ...m }
                }).then(res => {
                    console.log(res)
                    saveToDB({ ...m })
                })
            }
        }
        else {
            setErrorContext(lang.empityAllFilds)
            setErrorVisible(true)
        }
    }

    const saveToDB = (meal) => {
        console.log("saved meal", meal)
        mealDB.find({
            selector: { _id: meal._id }
        }).then(records => {
            console.log("rec =>", records)
            if (records.docs.length === 0) {
                mealDB.put(meal, () => props.navigation.goBack()).catch(e => console.log())
            }
            else {
                mealDB.put({ ...meal, _id: records.docs[0]._id, _rev: records.docs[0]._rev }, () => props.navigation.goBack())
            }
            Toast.show({
                type: 'success',
                props: { text2: lang.successful, style: { fontFamily: lang.font } },
                onShow: () => {
                    props.navigation.goBack()
                },
                visibilityTime: 800
            });
        })
        analytics().logEvent('setCalorie')
    }

    const saveServer = (meal) => {
        const url = urls.baseFoodTrack + urls.userTrackFood + urls.calorie
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = { ...meal }

        console.log("params", params)
        console.log("url", url)
        const RC = new RestController()
        RC.checkPrerequisites("post", url, params, header, onSuccess, onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }

    const onSuccess = (response) => {
        saveToDB({
            ...response.data.data,
            foodNutrientValue: response.data.data.foodNutrientValue.split(",").map(item => parseFloat(item).toFixed(1)),
        })
    }

    const onFailure = () => {
        setSaving(false)
        setErrorContext(lang.serverError)
        setErrorVisible(true)
    }

    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    console.log("model", model)
    const nutritionValue = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
    let cal = (!isNaN(parseFloat(nutritionValue[23])) && parseFloat(nutritionValue[23]) > 0) ? parseFloat(nutritionValue[23]) : 0
    let protein = (!isNaN(parseFloat(nutritionValue[9])) && parseFloat(nutritionValue[9]) > 0) ? parseFloat(nutritionValue[9]) : 0
    let fat = (!isNaN(parseFloat(nutritionValue[0])) && parseFloat(nutritionValue[0]) > 0) ? parseFloat(nutritionValue[0]) : 0
    let carbo = (!isNaN(parseFloat(nutritionValue[31])) && parseFloat(nutritionValue[31]) > 0) ? parseFloat(nutritionValue[31]) : 0
    const onDataChanged = (index, text) => {
        console.warn(text);
        if (text.length > 0) {
            if (!isNaN(parseFloat(text))) {
                const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
                f[index] = parseFloat(text)
                setMeal({
                    ...meal,
                    foodNutrientValue: f
                })
            }
        }
        else {
            const f = typeof (meal.foodNutrientValue) === "string" ? meal.foodNutrientValue.split(",") : meal.foodNutrientValue
            f[index] = 0
            setMeal({
                ...meal,
                foodNutrientValue: f
            })
        }

    }
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60}
            style={{ flex: 1 }} behavior='height'>
            <FoodToolbar
                lang={lang}
                title={lang.countCalories}
                onConfirm={onConfirm}
                onBack={() => props.navigation.goBack()}
                text={lang.saved}
            />
            <ScrollView stickyHeaderIndices={[2,6]} contentContainerStyle={{ alignItems: "center", paddingBottom: moderateScale(60) }}>
                
                <RowSpaceBetween style={styles.rowStyle}>
                    <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                            lang.coloriesNumber
                        }
                    </Text>
                    <TextInput
                        style={[styles.nameInput, { fontFamily: lang.font }]}
                        placeholder={lang.required}
                        placeholderTextColor={defaultTheme.lightGray}
                        value={cal > 0 ? cal.toString() : ""}
                        onChangeText={calorieChanged}
                        keyboardType="decimal-pad"
                        autoFocus={true}
                    />
                </RowSpaceBetween>
                <RowSpaceBetween
                    style={styles.rowStyle}
                >
                    <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>

                        {lang.meal +
                            ' - ' +
                            mealsName[parseFloat(meal.foodMeal)][lang.langName]}
                    </Text>

                    {
                        parseInt(moment(fastingDiet.startDate).format("YYYYMMDD")) <= parseInt(moment(props.route.params.selectedDate).format("YYYYMMDD"))
                            &&
                            (fastingDiet.endDate ? parseInt(moment(fastingDiet.endDate).format("YYYYMMDD")) >= parseInt(moment(props.route.params.selectedDate).format("YYYYMMDD")) : true)
                            ?
                            <View
                                style={{
                                    marginVertical: 0,
                                    marginHorizontal: 0,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row"
                                }}>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 9 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 9
                                                ? require('../../../res/img/sahari-icon.png')
                                                : require('../../../res/img/sahari-icon1.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 6 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 6
                                                ? require('../../../res/img/eftar-icon.png')
                                                : require('../../../res/img/eftar-icon1.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 3 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 3
                                                ? require('../../../res/img/dinner-icon.png')
                                                : require('../../../res/img/dinner-icon1.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 7 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 7
                                                ? require('../../../res/img/snack-icon.png')
                                                : require('../../../res/img/snack-icon1.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                            </View>
                            :
                            <RowWrapper
                                style={{
                                    marginVertical: 0,
                                    marginHorizontal: 0,
                                }}>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 0 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 0
                                                ? require('../../../res/img/breakfast.png')
                                                : require('../../../res/img/breakfast2.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 1 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 1
                                                ? require('../../../res/img/lunch.png')
                                                : require('../../../res/img/lunch2.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 3 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 3
                                                ? require('../../../res/img/dinner.png')
                                                : require('../../../res/img/dinner2.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginHorizontal: moderateScale(5) }}
                                    onPress={() => setMeal({ ...meal, foodMeal: 2 })}>
                                    <Image
                                        source={
                                            meal.foodMeal === 2
                                                ? require('../../../res/img/snack.png')
                                                : require('../../../res/img/snack2.png')
                                        }
                                        style={styles.meal}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </RowWrapper>
                    }
                </RowSpaceBetween>
                {/* <SearchFoodHeader
                    lang={lang}
                    title={lang.nutritionalValue}
                /> */}
                <RowSpaceBetween style={styles.stickyHeader1}>
                    <Text style={{fontFamily:lang.font,fontSize:moderateScale(16)}}>
                        {lang.bigNutrition}
                    </Text>
                </RowSpaceBetween>
                
                <RowSpaceBetween style={styles.rowStyle}>
                    <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                            lang.fat + " (" + lang.gr + ")"
                        }
                    </Text>
                    <TextInput
                        style={[styles.nameInput, { fontFamily: lang.font }]}
                        placeholder={lang.optional}
                        placeholderTextColor={defaultTheme.lightGray}
                        value={fat > 0 ? fat.toString() : ""}
                        onChangeText={fatChanged}
                        keyboardType="decimal-pad"
                    />
                </RowSpaceBetween>
                <RowSpaceBetween style={styles.rowStyle}>
                    <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                            lang.carbohydrate + " (" + lang.gr + ")"
                        }
                    </Text>
                    <TextInput
                        style={[styles.nameInput, { fontFamily: lang.font }]}
                        placeholder={lang.optional}
                        placeholderTextColor={defaultTheme.lightGray}
                        value={carbo > 0 ? carbo.toString() : ""}
                        onChangeText={carboChanged}
                        keyboardType="decimal-pad"
                    />
                </RowSpaceBetween>
                <RowSpaceBetween style={styles.rowStyle}>
                    <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                        {
                            lang.protein + " (" + lang.gr + ")"
                        }
                    </Text>
                    <TextInput
                        style={[styles.nameInput, { fontFamily: lang.font }]}
                        placeholder={lang.optional}
                        placeholderTextColor={defaultTheme.lightGray}
                        value={protein > 0 ? protein.toString() : ""}
                        onChangeText={proteinChanged}
                        keyboardType="decimal-pad"
                    />
                </RowSpaceBetween>
                <RowSpaceBetween style={styles.stickyHeader1}>
                    <Text style={{fontFamily:lang.font,fontSize:moderateScale(16)}}>
                        {lang.micronutrientFood}
                    </Text>
                </RowSpaceBetween>
                {
                    nutritions.map((item, index) => {
                        if (item.id == 1 || item.id == 10 || item.id == 32 || item.id == 24 || item.id == 2) {

                        } else {
                            return (
                                <>

                                    <RowSpaceBetween style={styles.rowStyle}>
                                        <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                            {
                                                item.persian + " (" + item.unit + ")"
                                            }
                                        </Text>
                                        <TextInput
                                            style={[styles.nameInput, { fontFamily: lang.font }]}
                                            placeholder={lang.optional}
                                            placeholderTextColor={defaultTheme.lightGray}
                                            value={parseInt(meal.foodNutrientValue[item.id - 1]) == 0 ? '' : parseInt(meal.foodNutrientValue[item.id - 1]).toString()}
                                            onChangeText={(text) => { onDataChanged(item.id - 1, text) }}
                                            keyboardType="decimal-pad"
                                        />
                                    </RowSpaceBetween>
                                </>
                            )
                        }

                    })
                }



            </ScrollView>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.buttonGradient}>
                <View style={{}}>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button}
                        title={lang.saved}
                        leftImage={require("../../../res/img/done.png")}
                        onPress={onConfirm}
                        textStyle={styles.buttonText}
                        isLoading={saving}
                    />
                </View>
            </LinearGradient>

            <Information
                visible={errorVisible}
                context={errorContext}
                onRequestClose={() => setErrorVisible(false)}
                lang={lang}
            />
        </KeyboardAvoidingView>
    );
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
        height: dimensions.WINDOW_WIDTH * 0.39
    },
    cameraContainer: {
        flexDirection: "row",
        position: "absolute",
        left: "3%",
        bottom: "10%",
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
        minWidth: "20%",
        maxWidth: "60%",
        height: moderateScale(35),
        marginHorizontal: moderateScale(20),
        fontSize: moderateScale(18),
        color: defaultTheme.gray,
        textAlign: "center",
        padding: 0
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
    text1: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
        // marginTop: moderateScale(50),
        alignSelf: "center"
    },
    buttonText: {
        fontSize: moderateScale(16)
    },
    input: {
        width: moderateScale(70),
        height: moderateScale(40),
        minHeight: moderateScale(30),
        borderWidth: 1.2,
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(13),
        marginVertical: 0,
        borderWidth: 1,
        paddingStart: 0,
        paddingEnd: 0
    },
    meal: {
        width: moderateScale(30),
        height: moderateScale(30)
    },
    buttonGradient: {
        position: "absolute",
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: moderateScale(50),
        // paddingBottom: 50,
        backgroundColor: defaultTheme.transparent
    },
    stickyHeader1:{
        width:dimensions.WINDOW_WIDTH,
        backgroundColor:defaultTheme.grayBackground
    }
});

export default AddCaloryScreen;
