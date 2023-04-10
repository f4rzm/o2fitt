import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarcodeReader, Information, Toolbar } from '../../components';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import PouchDB from '../../../pouchdb';
import { defaultTheme } from '../../constants/theme';
import { BlurView } from '@react-native-community/blur';
import { BackHandler, StyleSheet, View } from 'react-native';
import PopupLostBarcode from '../../components/PopupLostBarcode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' });
const barcodeGs1DB = new PouchDB('barcodeGs1', {
  adapter: 'react-native-sqlite',
});
const barcodeNationalDB = new PouchDB('barcodeNational', {
  adapter: 'react-native-sqlite',
});
const searchHistoryDB = new PouchDB('searchHistory', {
  adapter: 'react-native-sqlite',
});

const BarcodeScreen = props => {
  const lang = useSelector(state => state.lang);
  const auth = useSelector(state => state.auth);
  const app = useSelector(state => state.app);
  let isFetching = React.useRef(false).current;
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [showPopupWrapper, setShowPopupWrapper] = useState(false);
  const [barcode, setBarcode] = useState();
  const onBarcodeRead = e => {
    // console.log(e);
    setBarcode(e)
    if (!isFetching) {
      isFetching = true;
      getBarcodeGs1(e);
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
        setShowPopupWrapper(false)
        
    });
    return ()=>{
      BackHandler.removeEventListener()
    }
  }, [])
  

  const getBarcodeGs1 = barcode => {
    barcodeGs1DB
      .allDocs({
        include_docs: true,
        startkey: `${barcode}`,
        endkey: `${barcode}\uffff`,
        limit: 1,
      })
      .then(res => {
        // console.log('getBarcodeGs1', res);
        if (res.rows.length > 0) {
          getFoodOffline(res.rows[0].doc.name);
        } else {
          getbarcodeNational(barcode);
        }
      });
  };

  const getbarcodeNational = barcode => {
    barcodeNationalDB
      .allDocs({
        include_docs: true,
        startkey: `${barcode}`,
        endkey: `${barcode}\uffff`,
        limit: 1,
      })
      .then(res => {
        // console.log('getbarcodeNational', res);
        if (res.rows.length > 0) {
          getFoodOffline(res.rows[0].doc.name, barcode);
        } else {
          getFoodOnline(barcode);
        }
      });
  };

  const getFoodOffline = (name, barcode) => {
    // console.log('name', name);
    foodDB
      .allDocs({
        include_docs: true,
        startkey: `${name}`,
        endkey: `${name}\uffff`,
        limit: 1,
      })
      .then(res => {
        // console.log('resssssssssssssssss', res);
        if (res.rows.length > 0) {
          props.navigation.replace('FoodDetailScreen', {
            meal: {
              foodId: res.rows[0].doc.foodId,
              foodMeal: props.route.params.foodMeal,
            },
            food: { ...res.rows[0].doc, foodName: res.rows[0].doc.name },
          });
        } else {
          if (app.networkConnectivity) {
            getFoodOnline(barcode);
          }
        }
      });
  };

  const getFoodOnline = (barcode = '') => {
    const url =
      urls.foodBaseUrl +
      urls.food +
      urls.search +
      `?Page=1&PageSize=20&Barcode=${encodeURI(barcode)}`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };

    if (app.networkConnectivity) {
      const RC = new RestController();
      RC.checkPrerequisites(
        'get',
        url,
        {},
        header,
        onSuccess,
        onFailure,
        auth,
        onRefreshTokenSuccess,
        onRefreshTokenFailure,
      );
    } else {
      setErrorVisible(true);
      setErrorContext(lang.noInternet);
    }
  };

  const onSuccess = async(response) => {
    const date =await AsyncStorage.getItem("homeDate")
    // console.log(response.data.data);
    const items = response.data.data.items;
    if (items.length > 0) {
      console.warn(items[0]);
      searchHistoryDB.put({ ...items[0], _id: items[0].foodId.toString() });
      // props.navigation.navigate("FoodDetailScreen", { 
      //   meal: { ...meal, foodId: food.foodId, foodName: food.name },
      //    food: { ...food, foodName: food.name }, 
      //    date: date
      //    })
      props.navigation.replace('FoodDetailScreen', {
        meal: { foodId: items[0].foodId, foodMeal: props.route.params.foodMeal,foodName: items[0].name },
        food: { ...items[0],foodName: items[0].name },
        date:date
      });
    } else {
      // setErrorVisible(true);
      // setErrorContext(lang.noFindItem);
      setShowPopupWrapper(true)
    }
  };

  const onFailure = error => {
    // console.log(error);
    setErrorVisible(true);
    setErrorContext(lang.serverError);
  };

  const onRefreshTokenSuccess = () => { };

  const onRefreshTokenFailure = () => { };

  const onClosePopup = () => {
    props.navigation.goBack()
    setShowPopupWrapper(false)
  }

  const navigate = () => {
    props.navigation.navigate('InformationProductScreen', { barcode })
    setTimeout(() => {
      setShowPopupWrapper(false)
    }, 1000);
  }

  return (
    <>
      <Toolbar lang={lang} onBack={() => props.navigation.goBack()} />
      <BarcodeReader onBarcodeRead={onBarcodeRead} />

      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => { setErrorVisible(false); isFetching = false; }}
        lang={lang}
      /> 

      {showPopupWrapper && (
        <View style={styles.wrapper}>
          <BlurView
            style={styles.absolute}
            blurType="xlight"
            blurAmount={4}
            reducedTransparencyFallbackColor="white"
            overlayColor='transparent'
          />
          <PopupLostBarcode {...{ lang, onClosePopup, navigate }} />
        </View>
      )}
    </>
  );
};

export default BarcodeScreen;


const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,0.5)", 
    overflow:"hidden"
  },
})