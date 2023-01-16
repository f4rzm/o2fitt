import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    Image,
    Animated
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchFoodHeader, ConfirmButton, FoodToolbar, RowSpaceBetween, RowWrapper, MealDetailsCard, Information, RowStart, DropDown, CustomInput } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale, s } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
import Toast from "react-native-toast-message"

const ingredientModel = {
    "id": "",
    "name": "",
    "measureUnitList": [],
    "value": 0,
    "measureUnitId": 0,
    "measureUnitName": "",
    "measureUnitNameId": 0,
    "measureUnitValue": 1
}

const IngredientAmountScreen = props => {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const auth = useSelector(state => state.auth)
    const [errorVisible, setErrorVisible] = React.useState(false)
    const [errorContext, setErrorContext] = React.useState("")
    const [isLoading, setLoading] = React.useState(true)
    const [ingredient, setIngredient] = React.useState({
        ...ingredientModel,
        ...props.route.params.ingredient,
        value: props.route.params.ingredient.value ? props.route.params.ingredient.value : "",
    })

    console.log(ingredient)

    React.useEffect(() => {
        console.log(props.route)
        const url = urls.foodBaseUrl + urls.ingredient + urls.getById + `?Id=${ingredient.id}`
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = {}

        const RC = new RestController()
        RC.checkPrerequisites("get", url, params, header, getSuccess, getFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }, [])

    React.useEffect(() => {
        console.log("ing", ingredient)
    }, [ingredient])

    const getSuccess = (response) => {
        const i = response.data.data
        const m = i.messureUnits.map(item => ({ id: item.id, name: item[lang.langName], value: item.value }))

        setIngredient({
            ...ingredient,
            name: i.name,
            thumbUri: i.thumbUri,
            measureUnitList: m,
            measureUnitId: ingredient.measureUnitId === 0 ? m[0].id : ingredient.measureUnitId,
            measureUnitName: ingredient.measureUnitName === "" ? m[0].name : ingredient.measureUnitName,
            measureUnitValue: m[0].value,
            nutrientValue: i.nutrientValue.split(",").map(i => parseFloat(i))
        })
        setLoading(false)
    }

    const getFailure = () => {
        setLoading(false)
        setErrorVisible(true)
        setErrorContext(lang.serverError)
    }

    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    const unitChanged = (item) => {
        setIngredient({
            ...ingredient,
            measureUnitId: item.id,
            measureUnitName: item.name,
            measureUnitValue: item.value,
        })
    }

    const valueChanged = (text) => {
        (/^[0-9\.]+$/i.test(text) || text == "" || text == ".") ?
            setIngredient({
                ...ingredient,
                value: text
            }): Toast.show({
                type: 'error',
                props: { text2: lang.typeEN, style: { fontFamily: lang.font } },
                visibilityTime: 1000,
              });
    }

    const onConfirm = () => {
        if (!isNaN(parseFloat(ingredient.value)) && parseFloat(ingredient.value) > 0) {
            props.route.params.addIngredient(ingredient)
        }
        else {
            setErrorContext(lang.noInsertAmountUsed)
            setErrorVisible(true)
        }
    }

    console.log("ingredirent", ingredient)
    return (
        <>
            <FoodToolbar
                lang={lang}
                title={lang.addItemIngredientFoodTitle}
                onConfirm={onConfirm}
                onBack={() => props.navigation.goBack()}
                text={lang.add}
            />
            <Image
                source={(ingredient.thumbUri && ingredient.thumbUri != "") ? { uri: ingredient.thumbUri } : require("../../../res/img/food.jpg")}
                style={{
                    width: dimensions.WINDOW_WIDTH,
                    height: dimensions.WINDOW_WIDTH * 0.459
                }}
                resizeMode="contain"
            />
            {
                !isLoading ?
                    <>
                        <ScrollView>

                            <RowSpaceBetween
                                style={styles.rowStyle}
                            >
                                <Text style={[styles.text1, { fontFamily: lang.font,fontSize:moderateScale(18),color:defaultTheme.darkText }]} allowFontScaling={false}>
                                    {ingredient.name[lang.langName]}
                                </Text>
                            </RowSpaceBetween>
                            <SearchFoodHeader
                                lang={lang}
                                title={lang.whatIsAdd}
                            />

                            <RowSpaceBetween
                                style={styles.rowStyle}
                            >
                                <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                    {lang.consumptionSize}
                                </Text>
                                <RowWrapper
                                    style={{
                                        marginVertical: 0,
                                        marginHorizontal: 0
                                    }}
                                >
                                    <CustomInput
                                        lang={lang}
                                        style={styles.input}
                                        autoFocus={true}
                                        textStyle={{ textAlign: "center", fontSize: moderateScale(17) }}
                                        keyboardType="decimal-pad"
                                        onChangeText={valueChanged}
                                        value={ingredient.value.toString()}
                                        placeholder="0"
                                    />
                                    <DropDown
                                        lang={lang}
                                        style={styles.dropDown1}
                                        data={ingredient.measureUnitList}
                                        onItemPressed={unitChanged}
                                        selectedItem={ingredient.measureUnitName}
                                    />
                                </RowWrapper>
                            </RowSpaceBetween>

                            <SearchFoodHeader
                                lang={lang}
                                title={lang.nutTab}
                            />

                            <MealDetailsCard
                                user={user}
                                lang={lang}
                                fat={(ingredient.nutrientValue && ingredient.nutrientValue.length === 34) ? (ingredient.nutrientValue[0] * ingredient.value * ingredient.measureUnitValue / 100).toFixed(1) : 0}
                                carbo={(ingredient.nutrientValue && ingredient.nutrientValue.length === 34) ? (ingredient.nutrientValue[31] * ingredient.value * ingredient.measureUnitValue / 100).toFixed(1) : 0}
                                protein={(ingredient.nutrientValue && ingredient.nutrientValue.length === 34) ? (ingredient.nutrientValue[9] * ingredient.value * ingredient.measureUnitValue / 100).toFixed(1) : 0}
                                calorie={(ingredient.nutrientValue && ingredient.nutrientValue.length === 34) ? (ingredient.nutrientValue[23] * ingredient.value * ingredient.measureUnitValue / 100).toFixed(1) : 0}
                            />
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <ConfirmButton
                                lang={lang}
                                style={styles.button}
                                title={lang.add}
                                leftImage={require("../../../res/img/done.png")}
                                onPress={onConfirm}
                            />
                        </View>
                        <Information
                            visible={errorVisible}
                            context={errorContext}
                            onRequestClose={() => setErrorVisible(false)}
                            lang={lang}
                        />
                    </> :
                    <ActivityIndicator
                        style={styles.loading}
                        color={defaultTheme.primaryColor}
                        size="large"
                    />

            }

        </>
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
        fontSize: moderateScale(16),
        color: defaultTheme.lightGray2
    },
    buttonContainer: {
        position: "absolute",
        bottom: "2%",
        width: dimensions.WINDOW_WIDTH,
        alignItems:"center"
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.45,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
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
        marginVertical: 0,
        borderWidth: 1,
        paddingStart: 0,
        paddingEnd: 0

    },
    loading: {
        marginTop: moderateScale(50),
        alignSelf: "center"
    }
});

export default IngredientAmountScreen;
