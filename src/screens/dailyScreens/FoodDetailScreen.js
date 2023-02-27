import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import {
  SearchFoodHeader,
  ConfirmButton,
  FoodToolbar,
  RowSpaceBetween,
  RowWrapper,
  MealDetailsCard,
  DropDown,
  CustomInput,
  CalendarDropDown,
  DatePicker,
  RowSpaceAround,
  Information,
  RowCenter,
  TwoOptionModal,
} from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';
import Icon from 'react-native-vector-icons/Entypo';
import { RestController } from '../../classess/RestController';
import PouchDB from '../../../pouchdb';
import moment from 'moment';
import { urls } from '../../utils/urls';
import pouchdbSearch from 'pouchdb-find';
import { allMeasureUnits } from '../../utils/measureUnits';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import analytics from '@react-native-firebase/analytics';
import Textricker from 'react-native-text-ticker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

PouchDB.plugin(pouchdbSearch);
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' });
const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const personalFoodDB = new PouchDB('personalFood', {
  adapter: 'react-native-sqlite',
});
const favoriteFood = new PouchDB('favoriteFood', {
  adapter: 'react-native-sqlite',
});
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' });
const barcodeGs1DB = new PouchDB('barcodeGs1', {
  adapter: 'react-native-sqlite',
});
const barcodeNationalDB = new PouchDB('barcodeNational', {
  adapter: 'react-native-sqlite',
});

const FoodDetailScreen = (props) => {
  const f = props.route.params;
  const lang = useSelector((state) => state.lang);
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  const profile = useSelector((state) => state.profile);
  const [originalFood, setOriginalFood] = React.useState({});
  const [showTextEditor, setShowTextEditor] = React.useState(false);
  const [isEdited, setIsEdited] = React.useState(false);
  const [showDefautImage, setshowDefautImage] = React.useState(false);
  const mealsName = [
    {
      persian: 'صبحانه',
      arabic: 'الفطور',
      english: 'Breakfast',
    },
    {
      persian: 'ناهار',
      arabic: 'الغداء',
      english: 'Lunch',
    },
    {
      persian: 'میان وعده',
      arabic: 'وجبة خفيفة',
      english: 'Snack',
    },
    {
      persian: 'شام',
      arabic: 'العشاء',
      english: 'Dinner',
    },
  ];
  const mealModel = React.useRef({
    id: 0,
    userId: user.id,
    personalFoodId: '',
    foodId: 0,
    foodName: '',
    value: '',
    measureUnitId: 0,
    foodMeal: 0,
    insertDate: props.route.params.date
      ? props.route.params.date
      : moment().format('YYYY-MM-DD'),
    foodNutrientValue: new Array(34).fill(0),
    _id: null,
  }).current;
  
  const foodModel = React.useRef({
    foodId: 0,
    foodName: '',
    recipe: '',
    foodCode: 0,
    bakingType: {
      text: '',
      _id: '',
      value: '',
    },
    bakingTime: {
      ticks: 0,
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      totalMilliseconds: 0,
      totalMinutes: 0,
      totalSeconds: 0,
    },
    imageUri: '',
    imageThumb: '',
    foodType: {
      text: '',
      _id: '',
      value: '',
    },
    brand: '',
    nutrientValue: [0],
    measureUnits: [
      {
        text: '',
        _id: '',
        value: 0,
      },
    ],
    ingredients: [],
  }).current;
  const [food, setFood] = React.useState(
    props.route.params ? { ...foodModel, ...props.route.params.food } : null,
  );
  const [isFavorite, setFavorite] = React.useState(false);
  const [meal, setMeal] = React.useState(
    props.route.params ? { ...mealModel, ...props.route.params.meal } : null,
  );
  const [selectedMeasureUnit, updateSelectedMeasureUnit] = React.useState(0);
  const [showDatePicker, setShowPicker] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [successVisible, setSuccessVisible] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [button1, setButton1] = React.useState(null);
  const [button2, setButton2] = React.useState(null);
  const [optionalDialogVisible, setOptionalDialogVisible] =
    React.useState(false);
  let inputRef = React.createRef();

  const measureUnitName = props.route.params.food.measureUnitName;
  console.log('this is measure unit Name meal', props.route.params.meal);
  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const today = moment();
  const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;

  React.useEffect(() => {
    favoriteFood
      .find({
        selector: { foodId: food.foodId },
      })
      .then((rec) => {
        if (rec.docs.length > 0) {
          setFavorite(true);
        }
      });
  }, []);

  React.useEffect(() => {
    getFromServer()

  }, []);

  const getFromDB = async () => {
    // const measureUnitsPersonal = JSON.parse(await AsyncStorage.getItem('unit'));
    const measureUnitsPersonal = [1214, 1215, 1122, 1106, 1213, 1211, 1212, 1120, 1209, 1210, 1208, 1207, 1205, 1206, 1118, 1204, 1202, 1203, 1201, 1200, 1199, 1193, 1198, 1121, 1197, 1116, 1191, 1196, 1194, 1192, 1187, 1189, 1190, 1186, 1124, 1125, 1123, 1113, 1112, 1111, 1107];

    // const wholeMeasureunits = JSON.parse(
    //   await AsyncStorage.getItem('MeasureUnits'),
    // );
    // console.warn(wholeMeasureunits);
    let DB = null;
    if (!isNaN(parseInt(food.personalFoodId))) {
      DB = personalFoodDB;
      DB.find({
        selector: { personalFoodId: food.personalFoodId },
      }).then((records) => {
        if (records.docs.length > 0) {
          // console.log('#####', records);
          const mealVal = isNaN(parseFloat(meal.value))
            ? 0
            : parseFloat(meal.value).toFixed(1);
          setLoading(false);
          let retrivedFood = records.docs[0];
          const nutrientValue = retrivedFood.nutrientValue.map((item) =>
            parseFloat((parseFloat(item) * mealVal).toFixed(1)),
          );

          let measureUnits = [];
          let foodMeasureunit = [];
          if (f.food.personalFoodId > 0) {
            foodMeasureunit = [
              ...retrivedFood.measureUnits,
              ...measureUnitsPersonal,
            ];
          } else {
            foodMeasureunit = [...retrivedFood.measureUnits];
          }
          // console.warn({ ffffff: f.food });


          //  let unitData= allMeasureUnits.filter((element) => foodMeasureunit.includes(element.id))
          // measureUnitsPersonal.map((item) => {
          //   if (item === element) {
          //     measureUnits.push({
          //       id: element.id,
          //       name: element[lang.langName],
          //       value: element.value,
          //     });
          //   }
          // });

          // });

          // unitData.map((item)=>{
          //   measureUnits.push({
          //     id:item.id,
          //     name:item[lang.langName],
          //     value:item.value
          //   })
          // })

          allMeasureUnits.map((element) => {
            foodMeasureunit.map((item) => {
              if (item === element.id) {
                measureUnits.push({
                  id: element.id,
                  name: element[lang.langName],
                  value: element.value,
                });
              }
            });
          });

          measureUnits.map((item, index) => {
            if (item.name === measureUnitName) {
              setIndex(index);
            }
          });

          setFood({
            ...retrivedFood,
            personalFoodId: food.personalFoodId,
            measureUnits,
          });
          setOriginalFood(retrivedFood);
          if (
            props.route.params &&
            props.route.params.meal &&
            props.route.params.meal.measureUnitId > 0
          ) {
            updateSelectedMeasureUnit(props.route.params.meal.measureUnitId);
          } else {
            updateSelectedMeasureUnit(retrivedFood.measureUnits[0]);
          }

          setMeal({
            ...meal,
            measureUnitId:
              props.route.params &&
                props.route.params.meal &&
                props.route.params.meal.measureUnitId
                ? props.route.params.meal.measureUnitId
                : retrivedFood.measureUnits[0].id,
            foodNutrientValue: nutrientValue,
            measureUnitName:props.route.params &&
            props.route.params.meal &&
            props.route.params.meal.measureUnitName
            ? props.route.params.meal.measureUnitName
            : measureUnits[0].name,
          });
        } else {
          console.warn("log")
          // getFromServer();
        }
      });
    } else {
      DB = foodDB;
      // console.log(`${food.foodName}_${food.foodId}`);
      DB.get(`${food.foodName}_${food.foodId}`)
        .then((records) => {
          // console.log('getFromDB records', records);
          if (records) {
            const mealVal = isNaN(parseFloat(meal.value))
              ? 0
              : parseFloat(meal.value).toFixed(1);
            setLoading(false);
            let retrivedFood = records;
            const nutrientValue = retrivedFood.nutrientValue.map((item) =>
              parseFloat((parseFloat(item) * mealVal * 0.01).toFixed(1)),
            );
            console.log('#ss####', retrivedFood);
            let measureUnits = [];
            // retrivedFood.measureUnits.map(
            //   item =>
            //     allMeasureUnits.find(unit => item === unit.id) !== undefined &&
            //     measureUnits.push(
            //       allMeasureUnits.find(unit => item === unit.id),
            //     ),
            // );
            // console.log('ff');
            // console.log({retrivedFood});
            let foodMeasureunit = [];
            if (f.food.personalFoodId) {
              foodMeasureunit = [
                ...retrivedFood.measureUnits,
                ...measureUnitsPersonal,
              ];
            } else {
              foodMeasureunit = [...retrivedFood.measureUnits];
            }
            // const a = [...retrivedFood.measureUnits, ...measureUnitsPersonal];
            // retrivedFood = [...retrivedFood.measureUnits, ...measureUnitsPersonal]
            //======================MEASURE_UNITS_FROM_REDUX======================
            // retrivedFood.measureUnits.map(element => {
            //   // console.log({element});
            //   const index = app.measureUnit.measureUnits.findIndex(
            //     item => item.id === element,
            //   );
            //   // console.log({index2: index});

            //   // measureUnits.push(app.measureUnit.measureUnits[index]);
            //   measureUnits.push({
            //     id: app.measureUnit.measureUnits[index].id,
            //     name: app.measureUnit.measureUnits[index][lang.langName],
            //     value: app.measureUnit.measureUnits[index].value,
            //   });
            // });

            // allMeasureUnits.map((item) => console.warn(item));
            // allMeasureUnits.map((element) => {
            //   wholeMeasureunits.measureUnits.map((item) => {
            //     if (item.id === element) {
            //       measureUnits.push({
            //         id: item.id,
            //         name: item[lang.langName],
            //         value: item.value,
            //       });
            //     }
            //   });
            // });
            allMeasureUnits.map((element) => {
              foodMeasureunit.map((item) => {
                if (item === element.id) {
                  measureUnits.push({
                    id: element.id,
                    name: element[lang.langName],
                    value: element.value,
                  });
                }
              });
            });
            console.warn('measureUnitssssss', measureUnits);

            // measureUnits.map((item, index) => {
            //   if (item.name === measureUnitName) {
            //     setIndex(index);
            //   }
            // });
            // console.log('measureUnitssd', measureUnits);
            setFood({
              ...retrivedFood,
              foodName: retrivedFood.name,
              personalFoodId: food.personalFoodId,
              measureUnits,
            });
            setOriginalFood(retrivedFood);
            if (
              props.route.params &&
              props.route.params.meal &&
              props.route.params.meal.measureUnitId > 0
            ) {
              updateSelectedMeasureUnit(props.route.params.meal.measureUnitId);
            } else {
              updateSelectedMeasureUnit(retrivedFood.measureUnits[0]);
            }
            setMeal({
              ...meal,
              measureUnitId:
                props.route.params &&
                  props.route.params.meal &&
                  props.route.params.meal.measureUnitId
                  ? props.route.params.meal.measureUnitId
                  : retrivedFood.measureUnits[0],
              foodNutrientValue: nutrientValue,
              measureUnitName:props.route.params &&
              props.route.params.meal &&
              props.route.params.meal.measureUnitName
              ? props.route.params.meal.measureUnitName
              : measureUnits[0].name,
            });
          } else {
            console.warn("log")
            // getFromServer();
          }
        })
        .catch((error) => {
          // console.log('getFromDB error', error);
          // getFromServer();
          console.warn("log")
        });
    }
  };

  const getFromServer = () => {
    let url = null;

    if (!isNaN(parseInt(food.personalFoodId))) {
      console.error("personal");
      url =
        urls.foodBaseUrl + urls.personalFood + `?foodId=${food.personalFoodId}`;
    } else {
      console.error("dd");

      url = urls.foodBaseUrl + urls.food + `?foodId=${food.foodId}`;
    }
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {};

    const RC = new RestController();
    RC.checkPrerequisites(
      'get',
      url,
      params,
      header,
      getSuccess,
      getFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getSuccess = (response) => {
    // console.warn("this is food data", response.data);

    if (response.data.data.measureUnits.length > 0) {
      if (!isNaN(parseInt(food.personalFoodId))) {
        personalFoodDB.put({ ...response.data.data });
      } else {
        const fName = response.data.data.name[lang.langName];
        foodDB
          .put({
            ...response.data.data,
            _id: fName + '_' + food.foodId,
            name: fName,
            foodName: fName,
          })
          .catch((e) => console.warn(e));
        if (
          food.foodType === 3 &&
          ((food.barcodeGs1 && food.barcodeGs1 != '') ||
            (food.barcodeNational && food.barcodeNational != ''))
        ) {
          barcodeGs1DB.put({
            _id: food.barcodeGs1 + '_' + food._id,
            name: fName + '_' + food._id,
          });
          barcodeNationalDB.put({
            _id: food.barcodeNational + '_' + food._id,
            name: fName + '_' + food._id,
          });
        }
      }
    }
    setLoading(false);
    let measureUnits = [];
    response.data.data.measureUnits.map(
      (item) =>
        allMeasureUnits.find((unit) => item === unit.id) !== undefined &&
        measureUnits.push(allMeasureUnits.find((unit) => item === unit.id)),
    );
    setFood({
      ...food,
      ...response.data.data,
      foodName: response.data.data.name[lang.langName],
      measureUnits: measureUnits.map((unit) => ({
        id: unit.id,
        name: unit[lang.langName],
        value: unit.value,
      })),
    });
    setOriginalFood(response.data.data);
    if (
      props.route.params &&
      props.route.params.meal &&
      props.route.params.meal.measureUnitId > 0
    ) {
      updateSelectedMeasureUnit(props.route.params.meal.measureUnitId);
    } else {
      updateSelectedMeasureUnit(response.data.data.measureUnits[0]);
    }
    setMeal({
      ...meal,
      measureUnitId: meal.measureUnitId
        ? meal.measureUnitId
        : response.data.data.measureUnits[0],
      foodNutrientValue: response.data.data.nutrientValue,
      measureUnitName:meal.measureUnitName
      ? meal.measureUnitName
      : response.data.data.measureUnitName[0],
    });
  };

  const getFailure = () => {
    getFromDB()
  };

  const setSelectedMeasureUnit = (item) => {
    updateSelectedMeasureUnit(item.id);
    setMeal({ ...meal, measureUnitId: item.id,measureUnitName:item.name });
  };

  const valueCahanged = (text) => {
    (/^[0-9\.]+$/i.test(text) || text == '' || text == '.') ?
      setMeal({
        ...meal,
        value: text,
        foodNutrientValue: isNaN(parseFloat(text))
          ? food.nutrientValue.map((item) => 0)
          : food.nutrientValue.map((item) =>
            ((item * parseFloat(text)) / 100).toFixed(1),
          ),
          
      })
      :Toast.show({
        type:"error",
        props:{text2:lang.typeEN},
        visibilityTime:1800
      })
  };

  const onDateSelected = (newDate) => {
    setMeal({ ...meal, insertDate: newDate });
    setShowPicker(false);
  };

  const edit = () => {
    if (hasCredit) {
      if (app.networkConnectivity) {
        console.log(food);
        let ingredient = food.ingredients.map((item) => ({
          ...item,
          measureUnitName: item.measureUnitName
            ? item.measureUnitName
            : allMeasureUnits.find((unit) => item.measureUnitId == unit.id)[
            lang.langName
            ],
          measureUnitList: item.measureUnitList[0].id
            ? [...item.measureUnitList]
            : item.measureUnitList.map((m) =>
              allMeasureUnits.find((unit) => m == unit.id),
            ),
        }));
        console.log(ingredient);
        ingredient = ingredient.map((item) => ({
          ...item,
          measureUnitList: item.measureUnitList.map((m) => ({
            ...m,
            name: m.name ? m.name : m[lang.langName],
          })),
        }));
        props.navigation.navigate('EditFoodIngredients', {
          ingredients: food.ingredients ? ingredient : [],
          bakingType: food.bakingType,
          bakingTime: food.bakingTime,
          updateIngredients: updateIngredients,
        });

        analytics().logEvent('editFood');
      } else {
        setErrorVisible(true);
        setErrorContext(lang.noInternet);
      }
    } else {
      goToPackages();
    }
  };

  const goToPackages = () => {
    setOptionalDialogVisible(false);
    setTimeout(
      () => {
        props.navigation.navigate('PackagesScreen');
      },
      Platform.OS === 'ios' ? 500 : 50,
    );
  };

  const favoritePressed = () => {
    if (isFavorite) {
      removeFavoriteFromDB();
    } else {
      addFavoriteToDB();
    }
  };

  const addFavoriteToDB = () => {
    const f = {
      _id: Date.now().toString(),
      foodId: food.foodId,
      name: food.foodName,
    };

    favoriteFood.put(f);
    addToFavorite(f);
    setFavorite(true);
  };

  const removeFavoriteFromDB = () => {
    favoriteFood
      .find({
        selector: { foodId: food.foodId },
      })
      .then((rec) => {
        if (rec.docs.length > 0) {
          favoriteFood.bulkDocs(
            rec.docs.map((item) => ({ ...item, _deleted: true })),
          );
          deleteFromFavorite(rec.docs[0]);
          setFavorite(false);
        }
      });
  };

  const addToFavorite = (f) => {
    const url = urls.foodBaseUrl + urls.userFoodFavorite + urls.create;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {
      userId: user.id,
      foodId: f.foodId,
      _id: f._id,
    };

    const RC = new RestController();
    RC.checkPrerequisites(
      'post',
      url,
      params,
      header,
      () => false,
      () => false,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const deleteFromFavorite = (f) => {
    const url =
      urls.foodBaseUrl +
      urls.userFoodFavorite +
      `?foodId=${f.foodId}&userId=${user.id}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {};

    const RC = new RestController();
    RC.checkPrerequisites(
      'delete',
      url,
      params,
      header,
      () => false,
      () => false,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const saveToDB = (meal) => {
    console.log('saved meal', meal);
    mealDB
      .find({
        selector: { _id: meal._id },
      })
      .then((records) => {
        console.log('rec =>', records);
        if (records.docs.length === 0) {
          mealDB.put(meal, () => {
            setSaving(false);
          });
        } else {
          mealDB.put(
            { ...meal, _id: records.docs[0]._id, _rev: records.docs[0]._rev },
            () => {
              setSaving(false);
            },
          );
        }
        Toast.show({
          type: 'success',
          props: { text2: lang.successful, style: { fontFamily: lang.font } },
          onShow: props.navigation.goBack(),
          visibilityTime:800
        });
      });
    analytics().logEvent('setMeal', {
      id: meal.foodMeal,
    });
  };

  const saveServer = (meal) => {
    const url = urls.foodBaseUrl + urls.userTrackFood;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = { ...meal };

    console.error('params', params);
    console.log('url', params.foodNutrientValue.toString());
    if (app.networkConnectivity) {
      const method = meal.id ? 'put' : 'post';
      const RC = new RestController();
      RC.checkPrerequisites(
        method,
        url,
        params,
        header,
        onSuccess,
        onFailure,
        auth,
        onRefreshTokenSuccess,
        onRefreshTokenFailure,
      );
    } else {
      setSaving(false);
      setButton1(null);
      setButton2(null);
      Toast.show({
        type: 'error',
        props: { text2: lang.noInternet, style: { fontFamily: lang.font } },
        visibilityTime:800
      });
    }
  };

  const onSuccess = (response) => {
    saveToDB({
      ...response.data.data,
      foodNutrientValue:
        typeof response.data.data.foodNutrientValue === 'string'
          ? response.data.data.foodNutrientValue
            .split(',')
            .map((item) => parseFloat(item).toFixed(1))
          : response.data.data.foodNutrientValue.map((item) =>
            parseFloat(item).toFixed(1),
          ),
    });
    Toast.show({
      type: 'success',
      props: { text2: lang.successful, style: { fontFamily: lang.font } },
      visibilityTime:800

      // onShow: props.navigation.goBack()
    });
  };

  const onFailure = () => {
    setSaving(false);
    setErrorContext(lang.serverError);
    setErrorVisible(true);
  };

  const onRefreshTokenSuccess = () => { };

  const onRefreshTokenFailure = () => { };

  const updateIngredients = (ingredients, bakingType, bakingTime) => {
    if (ingredients && checkIsEdited(ingredients, bakingType, bakingTime)) {
      setShowTextEditor(true);
      setIsEdited(true);
      calNutrition(ingredients, bakingType, bakingTime);
    }
  };

  const checkIsEdited = (ingredients, bakingType, bakingTime) => {
    console.log(ingredients);
    console.log('originalFood', originalFood);
    console.log('bakingTime', bakingTime);
    console.log('bakingType', bakingType);
    let edited = ingredients.length !== originalFood.ingredients.length;
    ingredients.map((ingredient) => {
      const matchItem = originalFood.ingredients.find(
        (item) =>
          item.id === ingredient.id &&
          item.value === ingredient.value &&
          item.measureUnitId === ingredient.measureUnitId,
      );

      if (!matchItem) {
        edited = true;
      }
    });
    const originalHour = parseInt(originalFood.bakingTime.split(':')[0]);
    const originalMin = parseInt(originalFood.bakingTime.split(':')[1]);
    const currentHour = parseInt(bakingTime.split(':')[0]);
    const currentMin = parseInt(bakingTime.split(':')[1]);
    if (
      bakingType != originalFood.bakingType ||
      originalHour != currentHour ||
      originalMin != currentMin
    ) {
      edited = true;
    }

    return edited;
  };

  const calNutrition = (ingredients, bakingType, bakingTime) => {
    if (ingredients.length > 0) {
      if (app.networkConnectivity) {
        const url =
          urls.foodBaseUrl + urls.personalFood + urls.calculateNutrients;
        const header = {
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            Language: lang.capitalName,
          },
        };
        const params = {
          ...food,
          ingredients: ingredients,
          bakingType: bakingType,
          bakingTime: bakingTime,
        };

        console.log('params', params);
        console.log('url', url);
        const RC = new RestController();
        RC.checkPrerequisites(
          'post',
          url,
          params,
          header,
          (res) => calSuccess(res, ingredients, bakingType, bakingTime),
          calFailure,
          auth,
          onRefreshTokenSuccess,
          onRefreshTokenFailure,
        );
      } else {
      }
    } else {
      setErrorVisible(true);
      setErrorContext(lang.addNameItemFood);
    }
  };

  const calSuccess = (response, ingredients, bakingType, bakingTime) => {
    if (response.data.data) {
      console.log('response', response.data.data);
      setFood({
        ...food,
        foodName: '',
        nutrientValue: response.data.data,
        ingredients: ingredients,
        bakingType: bakingType,
        bakingTime: bakingTime,
      });
    } else {
      setFood({
        ...food,
        foodName: '',
        ingredients: ingredients,
        bakingType: bakingType,
        bakingTime: bakingTime,
      });
      setErrorVisible(true);
      setErrorContext(lang.foodNoValue);
    }
  };

  const calFailure = () => {
    setErrorVisible(true);
    setErrorContext(lang.serverError);
  };

  const savePersonalFoodServer = () => {
    const url = urls.foodBaseUrl + urls.personalFood;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {
      id: 0,
      foodName: food.foodName,
      recipe: '',
      bakingType: food.bakingType,
      bakingTime: food.bakingTime,
      parentFoodId: food.foodId,
      ingredients: [...food.ingredients],
      userId: user.id,
      _id: Date.now().toString(),
    };

    console.log('food', food);
    console.log('params', params);
    console.log('url', url);
    const RC = new RestController();
    RC.checkPrerequisites(
      'post',
      url,
      params,
      header,
      (res) => onPersonalFoodSuccess(res, meal),
      onPersonalFoodFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const onPersonalFoodSuccess = (response, meal) => {
    if (response.data.data) {
      personalFoodDB.put({
        ...response.data.data,
        personalFoodId: response.data.data.personalFoodId,
        foodId: null,
        nutrientValue:
          typeof response.data.data.nutrientValue === 'string'
            ? response.data.data.nutrientValue
              .split(',')
              .map((item) => parseFloat(item).toFixed(1))
            : response.data.data.nutrientValue.map((item) =>
              parseFloat(item).toFixed(1),
            ),
      });
      saveServer({
        ...meal,
        foodId: null,
        personalFoodId: response.data.data.personalFoodId,
        foodName: response.data.data.name,
        foodNutrientValue: response.data.data.nutrientValue,
        _id: Date.now().toString(),
      });
    } else {
      setSaving(false);
      setErrorVisible(true);
      setErrorContext(lang.foodNoValue);
    }
  };

  const onPersonalFoodFailure = () => { };

  const onConfirm = () => {
    console.warn('this is meal', meal.measureUnitId);
    console.warn('this is food', food.measureUnitId);
    const edited =
      food.ingredients &&
      checkIsEdited(food.ingredients, food.bakingType, food.bakingTime);
    if (!isNaN(parseFloat(meal.value)) && parseFloat(meal.value) > 0) {
      if (meal.measureUnitId > 0) {
        if (!edited || (edited && food.foodName != '')) {
          const nValue = food.nutrientValue.map(
            (item) => (item * meal.value * unit.value) / 100,
          );
          const m = meal._id
            ? { ...meal, foodNutrientValue: nValue }
            : { ...meal, foodNutrientValue: nValue, _id: `${user.id}${Date.now().toString()}` };
          console.log(m);
          setSaving(true);
          setMeal(m);

          if (edited) {
            if (app.networkConnectivity) {
              if (
                food.personalFoodId &&
                food.personalFoodId != '' &&
                parseInt(food.personalFoodId) > 0
              ) {
                saveServer({ ...m, foodId: null });
              } else {
                savePersonalFoodServer();
              }
            } 
            else {
              setSaving(false);
              setButton1(null);
              setButton2(null);
              // setErrorVisible(true)
              // setErrorContext(lang.noInternet)
              Toast.show({
                type: 'seccess',
                props: { text2: lang.noInternet, style: { fontFamily: lang.font } },
                visibilityTime: 800
              });
            }
          } 
          else {
            // if (app.networkConnectivity) {
            //   if (
            //     !isNaN(parseInt(food.personalFoodId)) &&
            //     parseInt(food.personalFoodId) > 0
            //   ) {
            //     let model = { ...m };
            //     delete model['foodId'];
            //     saveServer({ ...model });
            //   } else {
            //     let model = { ...m, foodId: food.foodId };
            //     delete model['personalFoodId'];
            //     saveServer({ ...model });
            //   }
            // } else {
              console.log('meal data', m);
              offlineDB.allDocs({ include_docs: false }).then((records) => {
                console.log('records', records.total_rows);
                offlineDB.post({
                  method: props.route.params.meal.insertDate ? 'put' : 'post',
                  type: 'meal',
                  url:props.route.params.meal.insertDate ? urls.foodBaseUrl2 + urls.userTrackFood: urls.foodBaseUrl + urls.userTrackFood,
                  header: {
                    headers: {
                      Authorization: 'Bearer ' + auth.access_token,
                      Language: lang.capitalName,
                    },
                  },
                  params: {
                    ...m,
                    foodId:
                      parseInt(food.personalFoodId) > 0 ? null : food.foodId,
                  },
                  index: records.total_rows
                })
                  .then((res) => {
                    console.log(res);
                    saveToDB({
                      ...m,
                      foodId:
                        parseInt(food.personalFoodId) > 0 ? null : food.foodId,
                    });
                  });
              })
            // }
          }

        } else {
          setSaving(false);
          setErrorVisible(true);
          setButton1(lang.yes);
          setButton2(lang.no);
          setErrorContext(lang.byEditItemsAddNewFood);
        }
      } else {
        setSaving(false);
        setErrorVisible(true);
        setErrorContext(lang.noInsertAmountUsed);
      }
    } else {
      setSaving(false);
      setErrorVisible(true);
      setButton2(lang.ok);
      setErrorContext(lang.noInsertAmountUsed);
    }
  };

  const unit =
    selectedMeasureUnit != 0 &&
      food.measureUnits.find((unit) => unit.id == selectedMeasureUnit) !=
      undefined
      ? food.measureUnits.find((unit) => unit.id == selectedMeasureUnit)
      : { ...food.measureUnits[0] };
  // console.log("food",food)
  // console.log("unit",unit)
  // console.log("selectedMeasureUnit",selectedMeasureUnit)
  console.error(dimensions.WINDOW_HEIGTH);
  return (
    <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60} style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "none"}>
      <View style={{flex:1}}>
        <FoodToolbar
          lang={lang}
          title={lang.addAteFoodTitle}
          onConfirm={onConfirm}
          onBack={() => props.navigation.goBack()}
          text={lang.iAte}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.imgContainer}>
            <FastImage
              source={
                food.imageUri && food.imageUri != '' && !showDefautImage
                  ? {
                    uri: food.personalFoodId
                      ? food.imageUri
                      : 'https://food.o2fitt.com/FoodImage/' + food.imageUri,
                  }
                  : require('../../../res/img/food.jpg')
              }
              style={{
                width: dimensions.WINDOW_WIDTH,
                height: dimensions.WINDOW_WIDTH * 0.459,
              }}
              onError={(e) => {
                console.warn(e.nativeEvent);
                setshowDefautImage(true);
              }}
              resizeMode={'contain'}
            />
          </View>
          <RowSpaceBetween style={styles.header}>
            <RowWrapper style={{ marginVertical: 0, paddingVertical: 0 }}>
              {!showTextEditor && isNaN(parseInt(food.personalFoodId)) && (
                <TouchableOpacity onPress={favoritePressed}>
                  <Icon
                    name={isFavorite ? 'heart' : 'heart-outlined'}
                    style={{
                      fontSize: moderateScale(25),
                      marginRight: moderateScale(10),
                      color: defaultTheme.error,
                    }}
                  />
                </TouchableOpacity>
              )}
              {!showTextEditor ? (
                <Textricker
                  duration={5000}
                  style={{
                    fontFamily: lang.font,
                    fontSize: moderateScale(17),
                    color: defaultTheme.darkText,
                  }}>
                  {food && food.foodName}
                  {food && food.brand && ' - '}
                  {food && food.brand && (
                    <Text
                      style={[
                        styles.title,
                        { fontFamily: lang.font, color: defaultTheme.error },
                      ]}
                      allowFontScaling={false}>
                      {food && food.brand[lang.langName]}
                    </Text>
                  )}
                </Textricker>
              ) : (
                <TextInput
                  ref={inputRef}
                  style={[
                    {
                      fontFamily: lang.font,
                      fontSize: moderateScale(16),
                      height: moderateScale(28),
                      width: '85%',
                      margin: 0,
                      padding: 0,
                      color: defaultTheme.gray,
                      borderBottomColor: 'transparent',
                      textAlign:
                        Platform.OS === 'ios'
                          ? I18nManager.isRTL
                            ? 'right'
                            : 'left'
                          : 'auto',
                    },
                  ]}
                  allowFontScaling={false}
                  value={food.foodName}
                  placeholder={lang.writeYourFood}
                  onChangeText={(text) => setFood({ ...food, foodName: text })}
                  numberOfLines={1}
                  autoFocus={true}
                  underlineColorAndroid={'transparent'}
                  maxLength={30}
                />
              )}
            </RowWrapper>
          </RowSpaceBetween>
          <SearchFoodHeader lang={lang} title={lang.whatTimeAndHowMany} />
          <RowSpaceBetween style={styles.rowStyle}>
            <Text
              style={[styles.text1, { fontFamily: lang.font }]}
              allowFontScaling={false}>
              {lang.consumptionSize}
            </Text>

            <RowWrapper
              style={{
                marginVertical: 0,
                marginHorizontal: 0,
              }}>
              <CustomInput
                lang={lang}
                autoFocus={true}
                style={styles.input}
                textStyle={styles.inputText}
                value={
                  isNaN(parseFloat(meal.value)) && meal.value != '.'
                    ? ''
                    : meal.value.toString()
                }
                onChangeText={valueCahanged}
                keyboardType="decimal-pad"
                placeholder="0"
                editable={food.measureUnits &&food.measureUnits.length > 1?true:false}
              />
              {food.measureUnits &&
                food.measureUnits.length > 1 &&
                typeof food.measureUnits[0] === 'object' ? (
                <DropDown
                  data={food.measureUnits ? food.measureUnits : []}
                  lang={lang}
                  style={styles.dropDown1}
                  onItemPressed={setSelectedMeasureUnit}
                  selectedItem={unit && unit.name}
                  selectedTextStyle={{
                    maxWidth: moderateScale(150),
                    fontSize: moderateScale(14),
                  }}
                  keyName={'name'}
                />
              ) : (
                <ActivityIndicator
                  size={'large'}
                  color={defaultTheme.primaryColor}
                  style={{
                    marginLeft: moderateScale(65),
                    marginRight: moderateScale(65),
                  }}
                />
              )}
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.rowStyle}>
            <Text
              style={[styles.text1, { fontFamily: lang.font }]}
              allowFontScaling={false}>
              {lang.meal +
                ' - ' +
                mealsName[parseFloat(meal.foodMeal)][lang.langName]}
            </Text>

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
                  style={styles.meal2}
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
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.rowStyle}>
            <Text
              style={[styles.text1, { fontFamily: lang.font }]}
              allowFontScaling={false}>
              {lang.dateCedar}
            </Text>

            <RowWrapper
              style={{
                marginVertical: 0,
                marginHorizontal: 0,
              }}>
              <CalendarDropDown
                style={styles.dateContainer}
                lang={lang}
                user={user}
                selectedDate={meal.insertDate}
                onPress={() => setShowPicker(true)}
              />
            </RowWrapper>
          </RowSpaceBetween>
          <SearchFoodHeader lang={lang} title={lang.nutTab} />
          <MealDetailsCard
            showMealDetails={true}
            user={user}
            lang={lang}
            fat={
              unit && food.nutrientValue && food.nutrientValue.length === 34
                ? parseInt(
                  (
                    (food.nutrientValue[0] * meal.value * unit.value) /
                    100
                  ).toFixed(1),
                )
                : 0
            }
            carbo={
              unit && food.nutrientValue && food.nutrientValue.length === 34
                ? parseInt(
                  (
                    (food.nutrientValue[31] * meal.value * unit.value) /
                    100
                  ).toFixed(1),
                )
                : 0
            }
            protein={
              unit && food.nutrientValue && food.nutrientValue.length === 34
                ? parseInt(
                  (
                    (food.nutrientValue[9] * meal.value * unit.value) /
                    100
                  ).toFixed(1),
                )
                : 0
            }
            calorie={
              unit && food.nutrientValue && food.nutrientValue.length === 34
                ? (
                  (food.nutrientValue[23] * meal.value * unit.value) /
                  100
                ).toFixed(1)
                : 0
            }
            fiber={
              unit && food.nutrientValue && food.nutrientValue.length === 34
                ? (
                  (food.nutrientValue[27] * meal.value * unit.value) /
                  100
                ).toFixed(1)
                : 0
            }

          />
          {food.ingredients && food.ingredients.length > 0 && (
            <SearchFoodHeader lang={lang} title={lang.ingList} />
          )}
          {!food.personalFoodId &&
            food.ingredients &&
            food.ingredients.length > 1 &&
            food.foodType != 2 &&
            food.foodType != 3 &&
            !isEdited && (
              <View style={styles.cautionContainer}>
                <RowWrapper>
                  <LottieView
                    style={{
                      width: moderateScale(35),
                      height: moderateScale(35),
                      padding: 0,
                    }}
                    source={require('../../../res/animations/foodinfo.json')}
                    autoPlay
                    loop={true}
                  />
                  <Text
                    style={[styles.text1, { fontFamily: lang.font }]}
                    allowFontScaling={false}>
                    {lang.tavajoh}
                  </Text>
                </RowWrapper>
                <Text
                  style={[styles.textInfo, { fontFamily: lang.font }]}
                  allowFontScaling={false}>
                  {lang.foodIng}
                </Text>
              </View>
            )}
          {food.ingredients &&
            food.ingredients.map((item, index) => {
              return (
                <RowSpaceBetween style={styles.rowStyle} key={index.toString()}>
                  <Text
                    style={[styles.text1, { fontFamily: lang.font }]}
                    allowFontScaling={false}>
                    {item.name[lang.langName]}
                  </Text>
                  <Text
                    style={[styles.text1, { fontFamily: lang.font }]}
                    allowFontScaling={false}>
                    {item.value +
                      ' ' +
                      allMeasureUnits.find(
                        (unit) => unit.id === item.measureUnitId,
                      )[lang.langName]}
                  </Text>
                </RowSpaceBetween>
              );
            })}
          <View style={styles.blank} />
        </ScrollView>
        {!isLoading ? (
          !saving ? (
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              style={styles.buttonGradient}>
              <View style={{}}>
                <ConfirmButton
                  lang={lang}
                  style={styles.button}
                  title={lang.iAte}
                  leftImage={require('../../../res/img/done.png')}
                  onPress={onConfirm}
                /></View>
              {!food.personalFoodId &&
                food.ingredients &&
                food.ingredients.length > 1 &&
                !meal.id &&
                food.foodType != 2 &&
                food.foodType != 3 && (
                  <View style={{ height: moderateScale(60) }}><ConfirmButton
                    lang={lang}
                    style={styles.button2}
                    title={lang.editFoodTitle}
                    imageStyle={{ tintColor: defaultTheme.lightText }}
                    leftImage={
                      hasCredit
                        ? require('../../../res/img/edit.png')
                        : require('../../../res/img/lock.png')
                    }
                    onPress={edit}
                  /></View>
                )}
            </LinearGradient>
          ) : (
            <RowCenter style={styles.buttonContainer}>
              <ActivityIndicator size="large" color={defaultTheme.primaryColor} />
            </RowCenter>
          )
        ) : null}
        <DatePicker
          lang={lang}
          user={user}
          visible={showDatePicker}
          onRequestClose={() => setShowPicker(false)}
          onDateSelected={onDateSelected}
          selectedDate={meal.insertDate}
        />
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
          button1={button1}
          button2={button2}
          button1Pressed={() => {
            setErrorVisible(false);
            setButton1(null);
            setButton2(null);
            inputRef.current.focus();
          }}
          button2Pressed={() => {
            setErrorVisible(false);
            setButton1(null);
            setButton2(null);
          }}
          showMainButton={false}
        />
        {errorVisible && (
          <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
            <View style={styles.wrapper}>
              <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={6}
                reducedTransparencyFallbackColor="white"
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        <Information
          visible={successVisible}
          context={lang.successful}
          onRequestClose={() => props.navigation.goBack()}
          lang={lang}
        />
        <TwoOptionModal
          lang={lang}
          visible={optionalDialogVisible}
          onRequestClose={() => setOptionalDialogVisible(false)}
          context={lang.subscribe1}
          button1={lang.iBuy}
          button2={lang.motevajeShodam}
          button1Pressed={goToPackages}
          button2Pressed={() => setOptionalDialogVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultTheme.green,
  },
  header: {
    marginVertical: 0,
    padding: moderateScale(8),
  },
  rowStyle: {
    borderBottomWidth: 1.2,
    padding: moderateScale(8),
    paddingStart: moderateScale(18),
    marginVertical: 0,
  },
  imgContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: dimensions.WINDOW_WIDTH * 0.459,
  },
  title: {
    fontSize: moderateScale(16),
    color: defaultTheme.darkText,
  },
  text1: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText,
  },
  blank: {
    height: dimensions.WINDOW_HEIGTH * 0.13,
  },
  buttonContainer: {
    bottom: '2%',
    left: 0,
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.4,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    marginHorizontal: moderateScale(0),
    marginBottom: moderateScale(16),
  },
  button2: {
    width: dimensions.WINDOW_WIDTH * 0.4,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green2,
    marginHorizontal: moderateScale(0),

  },
  rowAction: {
    height: moderateScale(45),
    backgroundColor: defaultTheme.primaryColor,
    marginVertical: 0,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionText: {
    fontSize: moderateScale(16),
    color: defaultTheme.lightText,
    marginHorizontal: moderateScale(16),
  },
  dropDown1: {
    width: moderateScale(120),
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
    paddingEnd: 0,
  },
  inputText: {
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: defaultTheme.mainText
  },
  meal: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  meal2: {
    width: moderateScale(25),
    height: moderateScale(25),
  },
  cautionContainer: {
    width: dimensions.WINDOW_WIDTH - moderateScale(32),
    borderWidth: 1,
    borderColor: defaultTheme.blue,
    borderRadius: moderateScale(15),
    marginVertical: moderateScale(16),
    paddingBottom: moderateScale(10),
    alignSelf: 'center',
  },
  cautImage: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  textInfo: {
    color: defaultTheme.gray,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(8),
    lineHeight: moderateScale(24),
    textAlign:"left"
  },
  buttonGradient: {
    position: "absolute",
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: moderateScale(50),
    paddingBottom: 50,
    backgroundColor: defaultTheme.transparent
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

export default FoodDetailScreen;
