import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  I18nManager,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';
import {useSelector} from 'react-redux';
import {
  Toolbar,
  Information,
  ConfirmButton,
  RowCenter,
  DatePicker,
  CustomInput,
  DoubleText,
  CalendarDropDown,
  RowWrapper,
} from '../../components';
import {moderateScale} from 'react-native-size-matters';
import Water from '../../../res/img/glass.svg';

import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import moment from 'moment';
import {RestController} from '../../classess/RestController';
import {urls} from '../../utils/urls';
import {SyncWaterDB} from '../../classess/SyncWaterDB';
import {SyncMealDB} from '../../classess/SyncMealDB';
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

PouchDB.plugin(pouchdbSearch);
const waterDB = new PouchDB('water', {adapter: 'react-native-sqlite'});
const offlineDB = new PouchDB('offline', {adapter: 'react-native-sqlite'});
const mealDB = new PouchDB('meal', {adapter: 'react-native-sqlite'});
waterDB.info().then(res => {
  console.log('info', res);
});

const AddWaterScreen = props => {
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const app = useSelector(state => state.app);
  const auth = useSelector(state => state.auth);
  const specification = useSelector(state => state.specification);
  const profile = useSelector(state => state.profile);

  const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
  const today = moment();
  const hasCredit = pkExpireDate.diff(today, 'seconds') > 0;

  const [waterValue, setValue] = React.useState(0);
  const [needValue, setNeedValue] = React.useState(10);
  const [otherWater, setOtherWater] = React.useState(0);
  const [consumptionValue, setConsumptionValue] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [showDatePicker, setShowPicker] = React.useState(false);
  const [selectedDate, setDate] = React.useState(props.route.params.date);
  let mealBulkSync = React.useRef(false).current;

  React.useEffect(() => {
    setNeedValue(
      hasCredit
        ? Math.min(
            15.5,
            parseFloat(
              (
                Math.round(
                  (parseFloat(specification[0].weightSize) * 41.6150228 * 2) /
                    240,
                ) / 2
              ).toFixed(1),
            ),
          )
        : 8,
    );
    getWater();
  }, [selectedDate]);

  const getWater = () => {
    getMealFromDB();
    if (app.networkConnectivity) {
      getFromServer();
      // syncMeal(selectedDate)
    } else {
      getFromDB();
    }
  };

  const getFromServer = () => {
    const url =
      urls.foodBaseUrl +
      urls.userTrackWater +
      `?StartDate=${selectedDate}&EndDate=${selectedDate}&userId=${user.id}`;
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

  const getSuccess = response => {
    console.log(response);
    let waterBulkSync = false;
    const SW = new SyncWaterDB();
    SW.syncWaterByLocal(
      waterDB,
      response.data.data,
      selectedDate,
      waterBulkSync,
      getFromDB,
    );
  };

  const getFailure = () => {};

  const getFromDB = () => {
    const reg = RegExp('^' + selectedDate, 'i');
    waterDB
      .find({
        selector: {insertDate: {$regex: reg}},
      })
      .then(records => {
        let water = 0;
        // records.docs.map(item=>{water+=parseFloat(item.value);})
        records.docs.map(item => {
          water = item.value;
        });
        setValue(water);
        setConsumptionValue(water + otherWater);
      });
  };

  const syncMeal = date => {
    const url =
      urls.foodBaseUrl +
      urls.userTrackFood +
      `UserMealsByDate?dateTime=${date}&userId=${user.id}`;
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
      res => getMealsSuccess(res, date),
      getMealsFailure,
      auth,
      onRefreshTokenSuccess,
      onRefreshTokenFailure,
    );
  };

  const getMealsSuccess = (response, selectedDate) => {
    console.log(response);

    const SP = new SyncMealDB();
    SP.syncMealsByLocal(
      mealDB,
      response.data.data,
      selectedDate,
      mealBulkSync,
      getMealFromDB,
    );
  };

  const getMealsFailure = () => {
    getMealFromDB(selectedDate);
  };

  const getMealFromDB = date => {
    const reg = RegExp('^' + moment(date).format('YYYY-MM-DD'), 'i');
    mealDB
      .find({
        selector: {insertDate: {$regex: reg}},
      })
      .then(records => {
        console.log('meal rec', records);
        let ow = 0;
        records.docs.map(item => {
          const foodNutrition =
            typeof item.foodNutrientValue === 'string'
              ? item.foodNutrientValue.split(',')
              : [...item.foodNutrientValue];
          if (!isNaN(parseFloat(foodNutrition[1]))) {
            ow += parseFloat(foodNutrition[1]);
          }
        });
        ow /= 240;
        console.log('ow', ow);
        setOtherWater(ow);
      });
  };

  const onDateSelected = newDate => {
    console.log(newDate);
    setDate(newDate);
    setShowPicker(false);
    setConsumptionValue(0);
  };

  const increase = () => {
    setValue(parseFloat(waterValue) + 0.5);
    // setConsumptionValue(parseFloat(consumptionValue) + 0.5)
  };

  const changeValue = text => {
    if (/^[0-9\.]+$/i.test(text) || text == '' || text == '.') {
      setValue(text);
    } else {
      Toast.show({
        type: 'error',
        props: {text2: lang.typeEN, style: {fontFamily: lang.font}},
        visibilityTime: 1000,
      });
    }
  };

  const decrease = () => {
    setValue(parseFloat(waterValue) >= 0.5 ? parseFloat(waterValue) - 0.5 : 0);
    // setConsumptionValue(parseFloat(parseFloat(consumptionValue) >= 0.5 ? parseFloat(consumptionValue) - 0.5 : 0))
  };

  const saveDB = data => {
    console.log('water', data);
    waterDB
      .put({...data})
      .then(() => getFromDB())
      .catch(error => console.log(error));
    setLoading(false);
    // setErrorContext(lang.successful)
    // setErrorVisible(true)
    analytics().logEvent('setWater');
    Toast.show({
      type: 'success',
      props: {text2: lang.successful, style: {fontFamily: lang.font}},
      visibilityTime: 800,
      onShow: props.navigation.goBack(),
    });
  };

  const saveServer = data => {
    const url = urls.foodBaseUrl + urls.userTrackWater;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };
    const params = {...data};

    if (app.networkConnectivity) {
      const RC = new RestController();
      RC.checkPrerequisites(
        'post',
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
      props.navigation.goBack();
    }
  };

  const onSuccess = response => {
    saveDB(response.data.data);
  };

  const onFailure = () => {};

  const onRefreshTokenSuccess = () => {};

  const onRefreshTokenFailure = () => {};

  const onConfirm = () => {
    if (parseFloat(waterValue) > 0 && !isLoading) {
      setLoading(true);

      const data = {
        _id: Date.now().toString(),
        userId: user.id,
        insertDate: selectedDate,
        value: parseFloat(waterValue).toFixed(1),
      };

      // console.log({data});

      if (app.networkConnectivity) {
        saveServer(data);
      } else {
        offlineDB
          .post({
            method: 'post',
            type: 'water',
            url: urls.foodBaseUrl + urls.userTrackWater,
            params: data,
            header: {
              headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
              },
            },
          })
          .then(res => {
            // console.log(res)
            saveDB(data);
          });
      }
    } else {
      // setErrorContext(lang.fillAllFild)
      // setErrorVisible(true)
      Toast.show({
        type: 'error',
        props: {text2: lang.fillAllFild, style: {fontFamily: lang.font}},
        visibilityTime: 1000,
      });
    }
  };

  let remainWater = hasCredit
    ? needValue - consumptionValue - otherWater
    : needValue - consumptionValue;
  if (remainWater < 0) remainWater = 0;
  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.saveWaterTitlePage}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}>
        <RowCenter>
          <Text style={[styles.text, {fontFamily: lang.font}]}>
            {lang.date}
          </Text>
          <CalendarDropDown
            style={styles.dateContainer}
            lang={lang}
            user={user}
            selectedDate={selectedDate}
            onPress={() => setShowPicker(true)}
          />
        </RowCenter>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.text2, {fontFamily: lang.font}]}>
              {remainWater.toFixed(1)}
            </Text>
            <Text
              style={{
                fontFamily: lang.font,
                fontSize: moderateScale(20),
                color: defaultTheme.blue,
              }}>
              {' '}
              {lang.glass}
            </Text>
          </View>

          <Text
            style={[
              styles.text,
              {fontFamily: lang.titleFont, marginBottom: moderateScale(16)},
            ]}>
            {lang.baghimande}
          </Text>

          <LottieView
            style={{
              width: dimensions.WINDOW_WIDTH * 0.24,
            }}
            source={require('../../../res/animations/glass.json')}
            autoPlay
            loop={false}
          />

          <RowCenter
            style={{
              marginTop: moderateScale(16),
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}>
            <TouchableOpacity onPress={decrease}>
              <View style={styles.circle}>
                <Image
                  source={require('../../../res/img/minus.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            <CustomInput
              lang={lang}
              style={styles.number}
              textStyle={[styles.textStyle, {fontFamily: lang.titleFont}]}
              // value={waterValue>0?waterValue.toString():""}
              // value={consumptionValue.toFixed(1)}
              value={waterValue > 0 ? waterValue.toString() : ''}
              onChangeText={changeValue}
              keyboardType="decimal-pad"
              placeholder={waterValue > 0 ? waterValue.toString() : '0'}
              // placeholder={consumptionValue.toString()}
              placeholderTextColor={defaultTheme.blue}
              maxLength={4}
            />
            <TouchableOpacity onPress={increase}>
              <View style={styles.circle}>
                <Image
                  source={require('../../../res/img/plus.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </RowCenter>
          <Text
            style={[
              styles.text1,
              {fontFamily: lang.titleFont, marginTop: moderateScale(8)},
            ]}>
            {lang.glass}
          </Text>
          {/* <RowCenter style={{ marginVertical: moderateScale(8) }}>
            <DoubleText
              lang={lang}
              seprator="-"
              text2={consumptionValue.toFixed(1)}
              text1={needValue}
              subText2={lang.drinkingWater}
              subText1={lang.waterDailyBudget}
            />
          </RowCenter> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: dimensions.WINDOW_WIDTH,
              marginVertical: moderateScale(50),
            }}>
            <View style={styles.circleHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {hasCredit ? (
                  <Text
                    style={[
                      styles.circleHeaderTxt,
                      {fontFamily: lang.titleFont},
                    ]}>
                    {hasCredit ? otherWater.toFixed(1) : ''}
                  </Text>
                ) : (
                  <Image
                    source={require('../../../res/img/lock.png')}
                    style={{
                      width: moderateScale(23),
                      height: moderateScale(23),
                      tintColor: defaultTheme.primaryColor,
                      resizeMode: 'contain',
                    }}
                  />
                )}

                <Text
                  style={{
                    color: defaultTheme.blue,
                    fontSize: moderateScale(17),
                    fontFamily: lang.titleFont,
                  }}>
                  {' '}
                  {lang.glass}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: lang.font,
                  fontSize: moderateScale(15),
                  marginTop: Platform.OS == 'ios' ? moderateScale(9) : 0,
                }}>
                {lang.drinkWaterOtherFood}
              </Text>
            </View>
            <View style={styles.circleHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.circleHeaderTxt,
                    {fontFamily: lang.titleFont},
                  ]}>
                  {consumptionValue.toFixed(1)}
                </Text>
                <Text
                  style={{
                    color: defaultTheme.blue,
                    fontSize: moderateScale(17),
                    fontFamily: lang.titleFont,
                  }}>
                  {' '}
                  {lang.glass}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: lang.font,
                  fontSize: moderateScale(15),
                  marginTop: Platform.OS == 'ios' ? moderateScale(9) : 0,
                }}>
                {lang.drinkingWater}
              </Text>
            </View>
            <View style={styles.circleHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.circleHeaderTxt,
                    {fontFamily: lang.titleFont},
                  ]}>
                  {needValue}
                </Text>
                <Text
                  style={{
                    color: defaultTheme.blue,
                    fontSize: moderateScale(17),
                    fontFamily: lang.titleFont,
                  }}>
                  {' '}
                  {lang.glass}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: lang.font,
                  fontSize: moderateScale(15),
                  marginTop: Platform.OS == 'ios' ? moderateScale(9) : 0,
                }}>
                {lang.dailyTarget}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.container2}>
          <RowWrapper>
            {
              !hasCredit &&
              <Image
                source={require("../../../res/img/lock.png")}
                style={{ width: moderateScale(30), height: moderateScale(30) }}
                resizeMode="contain"
              />

            }
            <Text style={[styles.text2, { fontFamily: lang.font, fontSize: moderateScale(18) }]}>
              {(hasCredit ? otherWater.toFixed(1) : "") + " " + lang.glass}
            </Text>

          </RowWrapper>
          <Text style={[styles.text, { fontFamily: lang.font }]}>
            {
              lang.getWaterOtherFood
            }
          </Text>
        </View> */}
      </ScrollView>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.gradientWrapper}>
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.saved}
          onPress={onConfirm}
          leftImage={require('../../../res/img/done.png')}
          isLoading={isLoading}
          textStyle={{fontSize: moderateScale(18)}}
        />
      </LinearGradient>

      {/* <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => errorContext === lang.successful ? props.navigation.goBack() : setErrorVisible(false)}
        lang={lang}
      /> */}
      <DatePicker
        lang={lang}
        user={user}
        visible={showDatePicker}
        onRequestClose={() => setShowPicker(false)}
        onDateSelected={onDateSelected}
        selectedDate={selectedDate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: moderateScale(30),
  },
  container2: {
    width: dimensions.WINDOW_WIDTH * 0.75,
    padding: moderateScale(10),
    alignItems: 'center',
    borderRadius: moderateScale(12),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(10),
    borderWidth: 1.2,
    borderColor: defaultTheme.border,
  },
  number: {
    width: moderateScale(80),
    height: moderateScale(48),
    borderRadius: moderateScale(10),
    paddingStart: moderateScale(3),
    paddingEnd: moderateScale(3),
    marginVertical: moderateScale(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    width: moderateScale(60),
    height: moderateScale(48),
    fontSize: moderateScale(25),
    color: defaultTheme.blue,
    marginTop: moderateScale(5),
    textAlign: 'center',
  },
  dateContainer: {
    width: moderateScale(130),
    borderColor: defaultTheme.green,
    borderWidth: 1.2,
    borderRadius: moderateScale(10),
  },
  dateText: {
    width: moderateScale(100),
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  text: {
    fontSize: moderateScale(18),
    color: defaultTheme.gray,
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  text1: {
    fontSize: moderateScale(17),
    color: defaultTheme.gray,
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  text2: {
    fontSize: moderateScale(28),
    color: defaultTheme.blue,
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    alignSelf: 'center',
    marginBottom: moderateScale(16),
  },
  circle: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: defaultTheme.blue,
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(20),
  },
  image: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: defaultTheme.lightBackground,
  },
  circleHeader: {
    width: dimensions.WINDOW_WIDTH * 0.3,
    height: dimensions.WINDOW_WIDTH * 0.3,
    backgroundColor: defaultTheme.lightBackground,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleHeaderTxt: {
    color: defaultTheme.blue,
    fontSize: moderateScale(20),
  },
  gradientWrapper: {
    backgroundColor: defaultTheme.transparent,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: dimensions.WINDOW_WIDTH,
  },
});

export default AddWaterScreen;
