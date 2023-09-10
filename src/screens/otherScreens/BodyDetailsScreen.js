import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  I18nManager,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {
  ConfirmButton,
  CustomInput,
  PageIndicator,
  Information,
  DropDown,
  ColumnStart,
} from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';
import {
  updateProfileLocaly,
  updateSpecificationLocaly,
} from '../../redux/actions';
import moment from 'moment-jalaali';
import { SpecificationDBController } from '../../classess/SpecificationDBController';
import { BlurView } from '@react-native-community/blur';
import CustomDropDown from '../../components/CustomDropDown';
import BlurItemList from '../../components/BlurItemList';
import { useRef } from 'react';
import Toast from 'react-native-toast-message';
// import Orientation from 'react-native-orientation-locker';
import { WheelPicker } from 'react-native-wheel-picker-android';

const days = Array.from({ length: 31 }, (x, i) => (i + 1).toString());
const months = Array.from({ length: 12 }, (x, i) => (i + 1).toString());
const yearsFa = Array.from({ length: 81 }, (x, i) => (i + 1306).toString());
const yearsEn = Array.from({ length: 81 }, (x, i) => (i + 1927).toString());

const BodyDetailsScreen = (props) => {
  const profile = useSelector((state) => state.profile);

  // Orientation.lockToPortrait()
  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // const [height, setHeight] = React.useState('');
  // const [weight, setWeight] = React.useState('');
  const [wrist, setWrist] = React.useState('');
  const [day, setDay] = React.useState('1');
  const [month, setMonth] = React.useState('1');
  const [showBlur, setShowBlur] = useState(false);
  const [index, setIndex] = useState(0);
  const [indexMonth, setIndexMonth] = useState(0);
  const [indexYear, setIndexYear] = useState(0);
  const [arrayData, setArrayData] = useState([]);
  const [eachData, setEachData] = useState(0);
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);
  const [selectedHeight, setSelectedHeight] = useState(1);
  const [selectedWeight, setselectedWeight] = useState(1);
  // const [BMI, setBMI] = React.useState(20);
  // const [max, setMax] = React.useState(20);
  // const [min, setMin] = React.useState(20);
  const [ideal, setIdeal] = React.useState(20);
  const [tx, setTx] = React.useState(0);

  const height = Array.from({ length: 76 }, (x, i) => (i + 140).toString());
  const weight = Array.from({ length: 126 }, (x, i) => (i + 35).toString());
  let flatListRef = useRef();

  const arrayDay = days.map((item, index) => ({ id: item, name: item }));

  const arrayMonth = months.map((item, index) => ({ id: item, name: item }));

  try {
    if (lang.langName == "persian") {
      I18nManager.allowRTL(true)
      I18nManager.forceRTL(true)
      I18nManager.swapLeftAndRightInRTL(true);
    }

  } catch (e) {
    console.error(e)
  }

  const arrayYear =
    user.countryId != 128
      ? yearsEn.map((item, index) => ({ id: item, name: item }))
      : yearsFa.map((item, index) => ({ id: item, name: item }));

  const [year, setYear] = React.useState(
    user.countryId != 128 ? '1995' : '1370',
  );
  let birthDate =
    user.countryId != 128
      ? moment(`${year}-${month}-${day}`, 'YYYY-M-D').format('YYYY-MM-DD')
      : moment(`${year}-${month}-${day}`, 'jYYYY-jM-jD').format('YYYY-MM-DD');
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setSelectedHeight(35);
      setselectedWeight(62);
    }, 100);
  }, []);
  React.useEffect(() => {
    birthDate =
      user.countryId != 128
        ? moment(`${year}-${month}-${day}`, 'YYYY-M-D').format('YYYY-MM-DD')
        : moment(`${year}-${month}-${day}`, 'jYYYY-jM-jD').format('YYYY-MM-DD');
  }, [year, month, day]);

  const calculateBMI = () => {
    const BMI = (
      weight[selectedWeight] / Math.pow(height[selectedHeight] / 100, 2)
    ).toFixed(1);
    //  const Max=((Math.pow(height[selectedHeight] / 100, 2) * 25.0).toFixed(1));
    //  const Min=((Math.pow(height[selectedHeight] / 100, 2) * 18.5).toFixed(1));

    if (profile.gender == 1) {
      //man
      if (height[selectedHeight] < 152) {
        setIdeal('56.2');
      } else {
        // setIdeal((56.2 + (((height - 152)/2.54)*1.41)).toFixed(1))
        setIdeal(
          (56.2 + ((height[selectedHeight] - 152) / 2.54) * 1.61).toFixed(1),
        );
      }
    } else {
      if (height[selectedHeight] < 152) {
        setIdeal('53.1');
      } else {
        // setIdeal((53.1 + (((height - 152)/2.54)*1.36)).toFixed(1))
        setIdeal(
          (53.1 + ((height[selectedHeight] - 152) / 2.54) * 1.46).toFixed(1),
        );
      }
    }

    const perSlotWidth = (dimensions.WINDOW_WIDTH * 0.55) / 4;
    if (BMI >= 14 && BMI <= 50) {
      if (BMI >= 14 && BMI <= 18.5) {
        setTx(((BMI - 16) / 2.5) * perSlotWidth);
        dispatchUpdateProfile();
      } else if (BMI > 18.5 && BMI <= 25) {
        setTx(((BMI - 18.5) / 6.5) * perSlotWidth + perSlotWidth);
        dispatchUpdateProfile();
      } else if (BMI > 25 && BMI <= 30) {
        setTx(((BMI - 25) / 5) * perSlotWidth + 2 * perSlotWidth);
        dispatchUpdateProfile();
      } else if (BMI > 30 && BMI <= 50) {
        setTx(((BMI - 30) / 10) * perSlotWidth + 3 * perSlotWidth);
        dispatchUpdateProfile();
      }
    } else if (BMI > 40 || BMI < 14) {
      setTx(dimensions.WINDOW_WIDTH * 0.55);
      setErrorContext(lang.wrongPersonalDetails);
      setErrorVisible(true);
    } else {
      setTx(0);
    }
  };

  const onNext = async () => {
    if (isNaN(parseFloat(height)) || isNaN(parseFloat(weight))) {
      // setErrorContext(lang.fillAllFild);
      // setErrorVisible(true);
      Toast.show({
        type: 'error',
        props: { text2: lang.fillAllFild, style: { fontFamily: lang.font } },
        visibilityTime: 2000,
      });
    } else {
      if (birthDate < moment().subtract(15, 'years')) {
        Toast.show({
          type: 'error',
          props: { text2: lang.wrongAge, style: { fontFamily: lang.font } },
          visibilityTime: 2000,
        });
      } else {
        calculateBMI();
      }
    }
  };

  const dispatchUpdateProfile = async () => {
    dispatch(
      updateProfileLocaly({
        heightSize: parseFloat(height[selectedHeight]),
        birthDate: birthDate,
      }),
    );
    const SCDB = new SpecificationDBController();
    const spec = await SCDB.getLastTwo();
    dispatch(
      updateSpecificationLocaly([
        {
          ...spec[0],
          weightSize: parseFloat(weight[selectedWeight]),
          wristSize: parseFloat(wrist),
        },
        {
          ...spec[1],
        },
      ]),
    );
    props.navigation.navigate('BMIScreen');
  };

  const onBack = () => {
    props.navigation.goBack();
  };

  const pressCustomDropDown = (data) => {
    if (JSON.stringify(data) === JSON.stringify(arrayDay)) {
      setEachData(1);
      setInitialScrollIndex(0);
    } else if (JSON.stringify(data) === JSON.stringify(arrayMonth)) {
      setEachData(2);
      setInitialScrollIndex(0);
    } else if (JSON.stringify(data) === JSON.stringify(arrayYear)) {
      setEachData(3);
      setInitialScrollIndex(65);
    }

    setShowBlur(true);
    setArrayData(data);
  };

  const closeBlur = () => {
    setShowBlur(false);
  };

  const renderItem = (items) => (
    <BlurItemList {...{ items, selectMeasureUnit }} />
  );

  const keyExtractor = (item, index) => `item-${index}-measureUnit`;

  const selectMeasureUnit = (index) => {
    if (eachData === 1) {
      setDay(arrayDay[index].name);
      setIndex(index);
    } else if (eachData === 2) {
      setMonth(arrayMonth[index].name);
      setIndexMonth(index);
    } else if (eachData === 3) {
      setYear(arrayYear[index].name);
      setIndexYear(index);
    }

    setShowBlur(false);
  };

  useEffect(() => {
    if (flatListRef.current && eachData === 3) {
      flatListRef.current.scrollToIndex({ animated: true, index: 50 });
    }
  }, []);

  const getItemLayout = (data, index) => {
    return { length: 40, offset: 40 * index, index };
  };

  const onWeightSelected = useCallback(
    (selectedItem) => {
      setselectedWeight(selectedItem);
    },
    [selectedWeight],
  );
  const onHeightSelected = (selectedItem) => {
    setSelectedHeight(selectedItem);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title2, { fontFamily: lang.titleFont }]}
          allowFontScaling={false}>
          {lang.setYourPhicicalInfo}
        </Text>
      </View>
      <View style={{ alignItems: 'center', top: moderateScale(-25) }}>
        <View style={styles.subContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 50,
            }}>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont,
                  fontSize: moderateScale(18),
                  color: defaultTheme.darkText,
                }}>
                {lang.heightCm}
              </Text>
              <WheelPicker
                selectedItem={selectedHeight}
                data={height}
                onItemSelected={onHeightSelected}
                itemTextFontFamily={lang.titleFont}
                selectedItemTextFontFamily={lang.titleFont}
                itemTextSize={moderateScale(20)}
                selectedItemTextSize={moderateScale(24)}
                indicatorWidth={1}
                indicatorColor="gray"
                selectedItemTextColor={defaultTheme.green}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont,
                  fontSize: moderateScale(18),
                  color: defaultTheme.darkText,
                }}>
                {lang.weightKg}
              </Text>
              <WheelPicker
                selectedItem={selectedWeight}
                data={weight}
                onItemSelected={onWeightSelected}
                itemTextFontFamily={lang.titleFont}
                selectedItemTextFontFamily={lang.titleFont}
                itemTextSize={moderateScale(20)}
                selectedItemTextSize={moderateScale(24)}
                indicatorWidth={1}
                indicatorColor="gray"
                selectedItemTextColor={defaultTheme.green}
              />
            </View>
          </View>
          {/* <CustomInput
          value={height}
          keyboardType="decimal-pad"
          style={{
            borderColor: defaultTheme.green,
            borderWidth: 1,
            borderRadius: 15,
            width: moderateScale(90),
            marginHorizontal: 15,
            color: defaultTheme.gray,
            fontSize: moderateScale(14),
            paddingStart: moderateScale(0),
            paddingEnd: moderateScale(0),
            justifyContent: 'center',
          }}
          textStyle={{
            textAlign: 'center',
            color: defaultTheme.gray,
            fontSize: moderateScale(17),
            padding: 0,
            marginHorizontal: 0,
            marginVertical: 2,
          }}
          placeholder={lang.height}
          lang={lang}
          onChangeText={text => setHeight(text)}
          maxLength={5}
        /> */}
        </View>
        <View
          style={[styles.subContainer, { marginVertical: moderateScale(-10) }]}>
          {/* <CustomInput
          value={weight}
          keyboardType="decimal-pad"
          style={{
            borderColor: defaultTheme.green,
            borderWidth: 1,
            borderRadius: 15,
            width: moderateScale(90),
            marginHorizontal: 15,
            color: defaultTheme.gray,
            fontSize: moderateScale(14),
            paddingStart: moderateScale(0),
            paddingEnd: moderateScale(0),
            justifyContent: 'center',
          }}
          textStyle={{
            textAlign: 'center',
            color: defaultTheme.gray,
            fontSize: moderateScale(17),
            padding: 0,
            marginVertical: 2,
          }}
          placeholder={lang.weight}
          lang={lang}
          onChangeText={text => setWeight(text)}
          maxLength={5}
        /> */}
        </View>

        <View style={styles.subContainer2}>
          <Text
            style={[styles.title, { fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont }]}
            allowFontScaling={false}>
            {lang.birth}
          </Text>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16) }}>{lang.day}</Text>
            <CustomDropDown
              {...{
                pressCustomDropDown,
                data: arrayDay,
                index,
                styleContainer: styles.dropDown,
              }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16) }}>{lang.month}</Text>
            <CustomDropDown
              {...{
                pressCustomDropDown,
                data: arrayMonth,
                index: indexMonth,
                styleContainer: styles.dropDown,
              }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: lang.font, fontSize: moderateScale(16) }}>{lang.year}</Text>
            <CustomDropDown
              {...{
                pressCustomDropDown,
                data: arrayYear,
                index: indexYear,
                styleContainer: styles.dropDown,
              }}
            />
          </View>
          <Image
            style={styles.image}
            source={require('../../../res/img/candel.png')}
            resizeMode="contain"
          />
        </View>
        <View
          style={[
            styles.subContainer,
            { paddingEnd: moderateScale(35), top: moderateScale(20) },
          ]}>
          <Image
            style={styles.image}
            source={require('../../../res/img/wrist.png')}
            resizeMode="contain"
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: lang.langName !== "english" ? lang.font : lang.titleFont, fontSize: moderateScale(16), color: defaultTheme.darkText }}>
              {lang.wristCm}
            </Text>
            <CustomInput
              value={wrist}
              keyboardType="decimal-pad"
              style={{
                borderColor: defaultTheme.green,
                borderWidth: 1,
                borderRadius: 15,
                width: moderateScale(180),
                marginHorizontal: 15,
                paddingStart: moderateScale(0),
                paddingEnd: moderateScale(0),
                justifyContent: 'center',
              }}
              textStyle={{
                textAlign: 'center',
                color: defaultTheme.darkText,
                fontSize: moderateScale(17),
                padding: 0,
                marginVertical: 2,

              }}
              placeholder={`(${lang.optional})`}
              lang={lang}
              onChangeText={(text) => setWrist(text)}
              maxLength={4}
            />
          </View>
        </View>
      </View>

      <ColumnStart>
        <Text
          style={[
            styles.title,
            {
              fontFamily: lang.font,
              alignSelf: 'flex-start',
              color: defaultTheme.error,
              marginHorizontal: moderateScale(12),
            },
          ]}
          allowFontScaling={false}>
          {lang.descriptionBank}
        </Text>
        <Text
          style={[
            {
              fontFamily: lang.font,
              color: defaultTheme.darkText,
              fontSize: moderateScale(13),
              marginHorizontal: 16,
              lineHeight: moderateScale(20),
              textAlign: "left"
            },
          ]}
          allowFontScaling={false}>
          {lang.personalInfo}
        </Text>
      </ColumnStart>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <ConfirmButton
            title={lang.perBtn}
            style={styles.confirmButton}
            lang={lang}
            onPress={onBack}
            leftImage={require('../../../res/img/back.png')}
            rotate
          />
          <ConfirmButton
            title={lang.continuation}
            style={styles.confirmButton}
            lang={lang}
            onPress={onNext}
            rightImage={require('../../../res/img/next.png')}
            rotate
          />
        </View>
        <PageIndicator pages={new Array(6).fill(1)} activeIndex={1} />
      </View>
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />

      {/* BlurView */}
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />

      {showBlur && (
        <TouchableWithoutFeedback onPress={closeBlur}>
          <View style={styles.wrapper}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={6}
              reducedTransparencyFallbackColor="white"
            />
            <FlatList
              ref={flatListRef}
              data={arrayData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              style={styles.list}
              contentContainerStyle={styles.contentList}
              initialScrollIndex={0}
              getItemLayout={getItemLayout}
              initialNumToRender={100}

            />
          </View>
        </TouchableWithoutFeedback>
      )}
      {errorVisible ? (
        <TouchableWithoutFeedback onPress={() => setCloseDialogVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(20),
    marginBottom: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: dimensions.WINDOW_WIDTH,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: moderateScale(75),

    marginBottom: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subContainer2: {
    width: dimensions.WINDOW_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    marginTop: moderateScale(25),
  },
  title: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(19),
    marginRight: moderateScale(8),
  },
  title2: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(19),
    alignSelf: 'center',
    textAlign: 'center',
    width: '85%',
  },
  genderContainer: {
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: defaultTheme.green,
  },
  confirmButton: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
  },
  image: {
    width: moderateScale(33),
    height: moderateScale(42),
    // marginHorizontal: moderateScale(3),
  },
  dropDownContainer: {
    borderColor: defaultTheme.green,
    borderWidth: 1,
    borderRadius: 15,
    width: moderateScale(73),
    alignItems: 'center',
    marginHorizontal: moderateScale(0),
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
  list: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 250,
    flexGrow: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    borderWidth: 0.5,
    borderColor: defaultTheme.lightGray,
    elevation: 9,
    maxHeight: dimensions.WINDOW_HEIGTH * 0.7,
    minHeight: moderateScale(50),
  },
  contentList: {},
  dropDown: {
    width: moderateScale(65),
    paddingHorizontal: '2%',
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

export default BodyDetailsScreen;
