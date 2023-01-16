// import React, {useMemo,useCallback} from 'react';
// import {
//   StyleSheet,
//   View,
//   BackHandler,
//   Text,
//   Image,
//   Platform,
//   FlatList,
// } from 'react-native';
// import {ConfirmButton, TwoOptionModal, SearchFoodRow} from '../../components';
// import {defaultTheme} from '../../constants/theme';
// import {useSelector, useDispatch} from 'react-redux';
// import {moderateScale} from 'react-native-size-matters';
// import {dimensions} from '../../constants/Dimensions';
// import PouchDB from '../../../pouchdb';
// import pouchdbSearch from 'pouchdb-find';
// import moment from 'moment';
// import LottieView from 'lottie-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PersonalFoods from '../../components/Lists/PersonalFoods';
// import {useState} from 'react';
// import {useEffect} from 'react';
// import {urls} from '../../utils/urls';
// import {RestController} from '../../classess/RestController';
// import {setPersonalFood} from '../../redux/actions/user';
// import Toast from 'react-native-toast-message';
// import {BlurView} from '@react-native-community/blur';
// import Alert from '../../components/Alert';

// PouchDB.plugin(pouchdbSearch);
// const personalFoodDB = new PouchDB('personalFood', {
//   adapter: 'react-native-sqlite',
// });

// const SearchCookingTab = props => {
//   const lang = useSelector(state => state.lang);
//   const profile = useSelector(state => state.profile);
//   const user = useSelector(state => state.user);
//   const auth = useSelector(state => state.auth);
//   const app = useSelector(state => state.app);
//   const dispatch = useDispatch();
//   const [measureUnitList, setMeasureUnitList] = useState();

//   const [personalFoods, setPersonalFoods] = React.useState(user.personalFoods.length ? user.personalFoods : []);
//   const [optionalDialogVisible, setOptionalDialogVisible] = React.useState(
//     false,
//   );
//   const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
//   const today = moment();
//   const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;
//   const meal = React.useRef({
//     foodId: 0,
//     foodMeal: props.mealId,
//   }).current;

// //   const [flag, setFlag] = useState(true);
//   const [showBlur, setShowBlur] = useState(false);
//   const [food, setFood] = useState();
//   const arrayButton = [
//     {
//       text: lang.yes,
//       color: defaultTheme.error,
//       onPress: () => deleteFood(food),
//     },
//     {text: lang.no, color: defaultTheme.green, onPress: () => setShowBlur(false)},
//   ];

//   const alertText = lang.deleteMessage;
//   const dataAlert = {arrayButton, alertText};
//   React.useEffect(() => {
//     let backHandler = null;
//     const focusUnsubscribe = props.navigation.addListener('focus', () => {
//       backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//         props.navigation.navigate('SearchMainTab');
//         return true;
//       });
//       props.setFoodType('');
//     });

//     const blurUnsubscribe = props.navigation.addListener('blur', () => {
//       backHandler && backHandler.remove();
//     });

//     return () => {
//       backHandler && backHandler.remove();
//       focusUnsubscribe();
//       blurUnsubscribe();
//     };
//   }, []);

//   React.useEffect(() => {
//     const url = `${urls.foodBaseUrl + urls.personalFood}GetPesonalMeasureUnits`;
//     const header = {
//       headers: {
//         Authorization: 'Bearer ' + auth.access_token,
//         Language: lang.capitalName,
//       },
//     };
//     const RC = new RestController();
//     RC.get(url, header, onSuccessGetMeasureUnits, onFailureGetMeasureUnits);
//   }, []);

//   const onSuccessGetMeasureUnits = response => {
//     let arrayMeasureUnits = [];
//     response.data.data.map(item => {
//       app.measureUnit.measureUnits.map(element => {
//         if (item === element.id) {
//           arrayMeasureUnits.push({
//             name: element[lang.langName],
//             id: element.id,
//           });
//         }
//       });
//     });
//     setMeasureUnitList(arrayMeasureUnits);
//   };

//   const onFailureGetMeasureUnits = response => {
//     console.log({response});
//   };

//   const call = async () => {
//     const data = JSON.parse(await AsyncStorage.getItem('personalFoods'));
//     setPersonalFoods(data);
//     dispatch(setPersonalFood(data));
//   }

//   useEffect(() => {
//     const unsubscribe = props.navigation.addListener('focus', () => {
//      call()
//     });

//     // Return the function to unsubscribe from the event so it gets removed on unmount
//     return unsubscribe;
//   }, [props.navigation]);

//   React.useEffect(() => {
//     personalFoodDB.changes({since: 'now', live: true , include_docs : true}).on('change',getPersonalFood)
//     getPersonalFood()
// }, [])

// const getPersonalFood = ()=>{
//     console.log("SearchCookingTab Changed")
//     personalFoodDB.allDocs({
//         include_docs : true
//     }).then(recs=>{
//         console.log("SearchCookingTab recs",recs)
//         const records = recs.rows.map(item=>item.doc)
//         setPersonalFoods(records)
//     }).catch(error=>console.error("sssssssssssss",error))
// }

//   const createFood = () => {
//     if (hasCredit) {
//       props.navigation.navigate('CreateFoodScreen', {measureUnitList});
//     } else {
//       setOptionalDialogVisible(true);
//     }
//   };

//   const onFoodPressed = async food => {
//     const date = await AsyncStorage.getItem('dailyDate');
//     props.navigation.navigate('FoodDetailScreen', {
//       meal: {
//         ...meal,
//         personalFoodId: food.personalFoodId,
//         foodName: food.name,
//         foodId: null,
//       },
//       food: {...food},
//       date: date,
//     });
//   };

//   const goToPackages = () => {
//     setOptionalDialogVisible(false);
//     setTimeout(
//       () => {
//         props.navigation.navigate('PackagesScreen');
//       },
//       Platform.OS === 'ios' ? 500 : 50,
//     );
//   };

//   const renderItem = items => (
//     <PersonalFoods {...{items, onFoodPressed, askForDelete}} />
//   );

//   const keyExtractor = (item, index) => `item-${index}-personalFoods`;

//   const askForDelete = item => {
//     setShowBlur(true);
//     setFood(item);
//   };

//   const deleteFood =  food => {
//     setShowBlur(false);

//   const data = personalFoods.filter(
//       element => element.personalFoodId !== food.personalFoodId,
//     );
//     setPersonalFoods(data);
//     dispatch(setPersonalFood(data));
//     AsyncStorage.setItem('personalFoods', JSON.stringify(data));
//     const url = `${urls.foodBaseUrl}PersonalFood/Delete?Id=${food.personalFoodId}`;
//     const header = {
//       headers: {
//         Authorization: 'Bearer ' + auth.access_token,
//         'Content-Type': 'application/json',
//         Language: lang.capitalName,
//       },
//     };

//     const params = {};
//     const RC = new RestController();
//     RC.put(url, params, header, onSuccessDelete, onFailureDelete);
//   };

//   const onSuccessDelete = response => {
//     Toast.show({
//       type: 'success',
//       text2: response.data.message,
//     });
//   };

//   const onFailureDelete = response => {
//     Toast.show({
//       type: 'error',
//       text2: response.data.message,
//     });
//   };

//   const renderHeader = useCallback(() => {
//     return (
//       <View style={styles.header}>
//         <LottieView
//           style={{width: dimensions.WINDOW_WIDTH * 0.45}}
//           source={require('../../../res/animations/foodmaker.json')}
//           autoPlay
//           loop={true}
//         />
//         <Text
//           style={[
//             styles.title,
//             {fontFamily: lang.titleFont, marginTop: moderateScale(20)},
//           ]}>
//           {lang.esyCoocking}
//         </Text>
//         <Text
//           style={[
//             styles.text,
//             {fontFamily: lang.font, marginBottom: moderateScale(15)},
//           ]}>
//           {lang.addItemForYourFood}
//         </Text>
//         <ConfirmButton
//           style={styles.button}
//           textStyle={styles.buttonText}
//           lang={lang}
//           leftImage={require('../../../res/img/plus.png')}
//           title={lang.coocking}
//           imageStyle={styles.buttonImage}
//           onPress={createFood}
//         />
//       </View>
//     );
//   });

//   // return useMemo(() => {
//     return (

// <>
//         <FlatList
//         keyboardShouldPersistTaps="handled"
//           data={personalFoods}
//           extraData={personalFoods}
//           renderItem={renderItem}
//           keyExtractor={keyExtractor}
//           ListHeaderComponent={renderHeader}
//           contentContainerStyle={styles.contentList}
//           style={styles.list}
//           legacyImplementation={true}
//           initialNumToRender={100}
//         />
//         <TwoOptionModal
//           lang={lang}
//           visible={optionalDialogVisible}
//           onRequestClose={() => setOptionalDialogVisible(false)}
//           context={lang.subscribe1}
//           button1={lang.iBuy}
//           button2={lang.motevajeShodam}
//           button1Pressed={goToPackages}
//           button2Pressed={() => setOptionalDialogVisible(false)}
//         />

//         {showBlur && (
//           <View style={styles.wrapper}>
//             <BlurView
//               style={styles.absolute}
//               blurType="light"
//               blurAmount={4}
//               reducedTransparencyFallbackColor="white"
//             />
//             <Alert {...{dataAlert, lang}} />
//           </View>
//         )}
//       </>
//     );
//   // },[personalFoods, showBlur]);
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//   },
//   emptyContainer: {
//     flex: 1,
//     height: '100%',
//     alignItems: 'center',
//     paddingTop: moderateScale(30),
//   },
//   title: {
//     fontSize: moderateScale(15),
//     textAlign: 'center',
//     marginTop: moderateScale(35),
//     marginBottom: moderateScale(10),
//     color: defaultTheme.darkText,
//   },
//   text: {
//     fontSize: moderateScale(13),
//     textAlign: 'center',
//     color: defaultTheme.gray,
//     marginHorizontal: '12%',
//     lineHeight: moderateScale(25),
//   },
//   button: {
//     width: dimensions.WINDOW_WIDTH * 0.65,
//     height : moderateScale(55),
//     maxHeight: moderateScale(60),
//     backgroundColor: defaultTheme.green,
//     marginVertical: moderateScale(25),
//   },
//   buttonText: {
//     fontSize: moderateScale(16),
//   },
//   buttonImage: {
//     tintColor: defaultTheme.lightBackground,
//   },

//   header: {
//     alignItems: 'center',
//   },
//   contentList: {
//     alignItems: 'flex-start',
//   },
//   list: {
//     width: '100%',
//   },
//   indicator: {
//     marginTop: 30,
//   },
//   absolute: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   wrapper: {
//     position: 'absolute',
//     zIndex: 10,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
// });

// export default SearchCookingTab;

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  Text,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ConfirmButton,
  TwoOptionModal,
  SearchCookingRow,
} from '../../components';
import {defaultTheme} from '../../constants/theme';
import {useSelector, useDispatch} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {dimensions} from '../../constants/Dimensions';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BlurView} from '@react-native-community/blur';
import Alert from '../../components/Alert';
import {setPersonalFood} from '../../redux/actions/user';
import {urls} from '../../utils/urls';
import {RestController} from '../../classess/RestController';
import Toast from 'react-native-toast-message';

PouchDB.plugin(pouchdbSearch);
const personalFoodDB = new PouchDB('personalFood', {
  adapter: 'react-native-sqlite',
});

const SearchCookingTab = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  const [personalFoods, setPersonalFoods] = React.useState([]);
  const [showBlur, setShowBlur] = useState(false);
  const [food, setFood] = useState();
  const [foodIndicator, setFoodIndicator] = useState(true);
  const arrayButton = [
    {
      text: lang.yes,
      color: defaultTheme.error,
      onPress: () => deleteFood(food),
    },
    {
      text: lang.no,
      color: defaultTheme.green,
      onPress: () => setShowBlur(false),
    },
  ];

  const alertText = lang.deleteMessage;
  const dataAlert = {arrayButton, alertText};

  const [optionalDialogVisible, setOptionalDialogVisible] =
    React.useState(false);
  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const today = moment();
  const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;
  const meal = React.useRef({
    foodId: 0,
    foodMeal: props.mealId,
  }).current;

  React.useEffect(() => {
    let backHandler = null;
    const focusUnsubscribe = props.navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        props.navigation.navigate('SearchMainTab');
        return true;
      });
      props.setFoodType('');
    });

    const blurUnsubscribe = props.navigation.addListener('blur', () => {
      backHandler && backHandler.remove();
    });

    return () => {
      backHandler && backHandler.remove();
      focusUnsubscribe();
      blurUnsubscribe();
    };
  }, []);

  React.useEffect(() => {
    personalFoodDB
      .changes({since: 'now', live: true, include_docs: true})
      .on('change', getPersonalFood);
    getPersonalFood();
  }, []);

  const askForDelete = (item) => {
    console.log(item);
    setShowBlur(true);
    setFood(item);
  };

  const getPersonalFood = () => {
    console.log('SearchCookingTab Changed');
    personalFoodDB
      .allDocs({
        include_docs: true,
      })
      .then((recs) => {
        console.log('SearchCookingTab recs', recs);
        const records = recs.rows.map((item) => item.doc);
        setPersonalFoods(records);
        setFoodIndicator(false);
      })
      .catch((error) => console.error('sssssssssssss', error));
  };

  const createFood = () => {
    if (hasCredit) {
      props.navigation.navigate('CreateFoodScreen');
    } else {
      goToPackages();
    }
  };

  const onFoodPressed = async (food) => {
    if (hasCredit) {
      console.log('Foooooood', food);
      const date = await AsyncStorage.getItem('homeDate');
      props.navigation.navigate('FoodDetailScreen', {
        meal: {
          ...meal,
          personalFoodId: food.personalFoodId,
          foodName: food.name,
          foodId: null,
          measureUnitId: 36,
        },
        food: {...food},
        date: date,
      });
    } else {
      props.navigation.navigate('PackagesScreen');
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

  const deleteFood = (food) => {
    setShowBlur(false);

    const data = personalFoods.filter(
      (element) => element.personalFoodId !== food.personalFoodId,
    );
    setPersonalFoods(data);
    dispatch(setPersonalFood(data));
    AsyncStorage.setItem('personalFoods', JSON.stringify(data));
    const url = `${urls.foodBaseUrl}PersonalFood/Delete?Id=${food.personalFoodId}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'application/json',
        Language: lang.capitalName,
      },
    };

    const params = {};
    const RC = new RestController();
    RC.put(url, params, header, onSuccessDelete, onFailureDelete);
  };
  const onSuccessDelete = (response) => {
    Toast.show({
      type: 'success',
      props: {text2: response.data.message, style: {fontFamily: lang.font}},
      visibilityTime:800
    });
  };

  const onFailureDelete = (response) => {
    Toast.show({
      type: 'error',
      text2: response.data.message,
      visibilityTime:800
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: moderateScale(30),
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <LottieView
          style={{width: dimensions.WINDOW_WIDTH * 0.45}}
          source={require('../../../res/animations/foodmaker.json')}
          autoPlay
          loop={true}
        />
        <Text
          style={[
            styles.title,
            {fontFamily: lang.titleFont, marginTop: moderateScale(20)},
          ]}>
          {lang.esyCoocking}
        </Text>
        <Text
          style={[
            styles.text,
            {fontFamily: lang.font, marginBottom: moderateScale(15)},
          ]}>
          {lang.addItemForYourFood}
        </Text>
        <ConfirmButton
          style={styles.button}
          textStyle={styles.buttonText}
          lang={lang}
          leftImage={require('../../../res/img/plus.png')}
          title={lang.coocking}
          imageStyle={styles.buttonImage}
          onPress={createFood}
        />

        {personalFoods.length == 0 ? (
          <View style={{flex: 1}}>
            <ActivityIndicator size={'large'} color={defaultTheme.gold} />
          </View>
        ) : personalFoods.length == 0 && !foodIndicator ? (
          <Text style={{fontFamily: lang.font}}>{lang.emptyCreateFood}</Text>
        ) : (
          personalFoods
            .filter((f) => f.foodName && f.foodName.includes(props.searchText))
            .map((item, index) => (
              <SearchCookingRow
                lang={lang}
                item={{...item, name: item.foodName, foodMeal: props.mealId}}
                key={item.personalFoodId.toString() + index}
                onPress={onFoodPressed}
                askForDelete={askForDelete}
                deleteBtn={true}
              />
            ))
        )}
      </ScrollView>
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
      {showBlur && (
        <View style={styles.wrapper}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor="white"
          />
          <Alert {...{dataAlert, lang}} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    paddingTop: moderateScale(30),
  },
  title: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: moderateScale(35),
    marginBottom: moderateScale(10),
    color: defaultTheme.darkText,
  },
  text: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: defaultTheme.lightGray2,
    marginHorizontal: '12%',
    lineHeight: moderateScale(25),
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.65,
    height: moderateScale(40),
    backgroundColor: defaultTheme.green,
    marginVertical: moderateScale(25),
  },
  buttonText: {
    fontSize: moderateScale(16),
  },
  buttonImage: {
    tintColor: defaultTheme.lightBackground,
  },
  wrapper: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SearchCookingTab;
