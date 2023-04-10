import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    BackHandler,
    Animated
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ConfirmButton, FoodToolbar, EditIngredientRow, DropDown, RowSpaceBetween, SearchFoodHeader, DynamicTimePicker } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale, s } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';

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

const EditFoodIngredients = props => {
    console.log(props.route.params)
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const [ingredients, setIngredients] = React.useState(props.route.params ? props.route.params.ingredients : [])
    const [bakingType, setBakingType] = React.useState(props.route.params ? props.route.params.bakingType : 0)
    const [hour, setHour] = React.useState(props.route.params ? parseInt(props.route.params.bakingTime.split(":")[0]).toString() : 0)
    const [min, setMin] = React.useState(props.route.params ? parseInt(props.route.params.bakingTime.split(":")[1]).toString() : 0)
    const ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current
    let currentTy = React.useRef(dimensions.WINDOW_HEIGTH).current

    React.useEffect(() => {
        console.log("ing", ingredients)
    }, [ingredients])

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

    const cookTypeChanged = (item) => {
        console.log(item)
        setBakingType(item.bakingType)
    }

    const timeChanged = (hour, min) => {
        setHour(hour)
        setMin(min)
    }

    const valueChanged = (value, index) => {
        if ((/^[0-9\.]+$/i.test(value) || value == "" || text == ".")) {
            let v = { ...ingredients[index], value: value }
            let newIngredients = [...ingredients]
            newIngredients[index] = v
            setIngredients(newIngredients)
        }
    }

    const unitChanged = (item, index) => {
        console.log(item)
        let v = { ...ingredients[index], measureUnitName: item.name, measureUnitId: item.id }
        let newIngredients = [...ingredients]
        newIngredients[index] = v
        setIngredients(newIngredients)
    }

    const onAdd = () => {
        props.navigation.navigate("IngredientsSearchScreen", { addIngredient: addIngredient })
    }

    const addIngredient = (ingredient) => {

        setIngredients([
            ...ingredients,
            ingredient
        ])
        props.navigation.pop(2)
    }

    const removeIngredient = (index) => {
        const a = [...ingredients]
        a.splice(index, 1)

        console.log("a", a)
        setIngredients([...a])
    }

    const onConfirm = () => {
        props.route.params.updateIngredients(ingredients, bakingType, hour + ":" + min)
        props.navigation.goBack()
    }

    return (
        <>
            <FoodToolbar
                lang={lang}
                title={lang.addAteFoodTitle}
                onConfirm={onConfirm}
                onBack={() => props.navigation.goBack()}
                text={lang.end}
            />
            <View>

                <ScrollView style={{ maxHeight: dimensions.WINDOW_HEIGTH * 0.78 }}>
                    <RowSpaceBetween
                        style={{
                            marginVertical: 0,
                            paddingStart: moderateScale(16)
                        }}
                    >
                        <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {
                                lang.typeCoocking
                            }
                        </Text>
                        <DropDown
                            data={cookType.filter(item => item.bakingType > 0).map(item => ({ bakingType: item.bakingType, name: item[lang.langName] }))}
                            lang={lang}
                            style={{ width: moderateScale(140) }}
                            dateText={{ fontSize: moderateScale(16), color: defaultTheme.darkText }}
                            onItemPressed={cookTypeChanged}
                            selectedItem={(cookType.filter(item => item.bakingType === bakingType))[0][lang.langName]}
                        />
                    </RowSpaceBetween>
                    <RowSpaceBetween
                        style={{
                            padding: moderateScale(8),
                            paddingHorizontal: moderateScale(16),
                            borderTopWidth: 1,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                            {
                                lang.timeCoocking
                            }
                        </Text>
                        <TouchableOpacity onPress={showTimePicker}>
                            <Text style={[styles.time, { fontFamily: lang.font, marginEnd: moderateScale(30), color: defaultTheme.darkText }]} allowFontScaling={false}>
                                {parseInt(hour) < 10 ? "0" + parseInt(hour) : hour} : {parseInt(min) < 10 ? "0" + parseInt(min) : min}
                            </Text>
                        </TouchableOpacity>
                    </RowSpaceBetween>
                    <SearchFoodHeader
                        lang={lang}
                        title={lang.ingList}
                    />
                    {
                        ingredients.map((item, index) => (

                            <EditIngredientRow
                                lang={lang}
                                item={item}
                                index={index}
                                key={item.id.toString()}
                                measureUnitList={item.measureUnitList}
                                valueCahanged={valueChanged}
                                unitChanged={unitChanged}
                                remove={removeIngredient}
                            />
                        ))
                    }
                </ScrollView>
            </View>
            <View style={[styles.buttonContainer, { paddingTop: moderateScale(10) }]}>
                <ConfirmButton
                    lang={lang}
                    style={styles.button}
                    title={lang.save}
                    textStyle={{ fontSize:moderateScale(17) }}
                    leftImage={require("../../../res/img/done.png")}
                    onPress={onConfirm}
                />
                <ConfirmButton
                    lang={lang}
                    style={styles.button2}
                    textStyle={{ color: defaultTheme.green,fontSize:moderateScale(17),marginHorizontal:0 }}
                    imageStyle={{ tintColor: defaultTheme.green, width: moderateScale(15) }}
                    title={lang.addIngerdientFood}
                    leftImage={require("../../../res/img/plus.png")}
                    onPress={onAdd}
                />
            </View>
           
            <DynamicTimePicker
                lang={lang}
                user={user}
                ty={ty}
                close={closeTimePicker}
                onTimeConfirm={timeChanged}
                hour={hour}
                min={min}
            />
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
        fontSize: moderateScale(15),
        color: defaultTheme.darkText
    },
    blank: {
        height: dimensions.WINDOW_HEIGTH * 0.13
    },
    buttonContainer: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        flexDirection: "row",
        justifyContent:"space-around"
    },
    button: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        height: moderateScale(45),
        backgroundColor: defaultTheme.green,
        paddingHorizontal:5
    },
    button2: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        height: moderateScale(45),
        backgroundColor: defaultTheme.lightBackground,
        borderColor: defaultTheme.green,
        borderWidth: 1.5,
        paddingHorizontal:5

    },
    rowAction: {
        height: moderateScale(45),
        backgroundColor: defaultTheme.primaryColor,
        marginVertical: 0,
        borderWidth: StyleSheet.hairlineWidth
    },
    actionText: {
        fontSize: moderateScale(16),
        color: defaultTheme.lightText,
        marginHorizontal: moderateScale(16)
    },
    time: {
        fontSize: moderateScale(17)
    }
});

export default EditFoodIngredients;
