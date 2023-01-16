import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ActivityIndicator,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ConfirmButton,
  Information,
  DropDown,
  CountryPicker,
} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {defaultTheme} from '../../constants/theme';
import {dimensions} from '../../constants/Dimensions';
import {updateUserData} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import allCountries from '../../utils/countries';
import {moderateScale} from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import NativeSplashScreen from 'react-native-splash-screen';
import { BlurView } from '@react-native-community/blur';

let currentPosition = dimensions.WINDOW_HEIGTH;
const faAlphabet = [
  'آ',
  'ا',
  'ب',
  'پ',
  'ت',
  'ث',
  'ج',
  'چ',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'ژ',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ک',
  'گ',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'ی',
];
const arAlphabet = [
  'آ',
  'ا',
  'ب',
  'ت',
  'ث',
  'ج',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ک',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'ی',
];
const enAlphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

let originData = [];

const ChooseCountryScreen = (props) => {
  const lang = useSelector((state) => state.lang);
  const user = useSelector((state) => state.user);
  const redux = useSelector((state) => state);
  let data = React.useRef([
    {id: allCountries[0].id, name: allCountries[0][lang.langName]},
  ]).current;
  const dispatch = useDispatch();

  const [countries] = React.useState(allCountries);
  const [sortedData, setSortedData] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [countryId, setCountryId] = React.useState(allCountries[0].id);
  const [countryName, setCountryName] = React.useState(
    allCountries[0][lang.langName],
  );
  const [selectedCountry, setSelectedCountry] = React.useState(allCountries[0]);
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const canGoBack = React.useRef(props.navigation.canGoBack()).current;
  let ty = React.useRef(new Animated.Value(dimensions.WINDOW_HEIGTH)).current;

  React.useEffect(() => {
    NativeSplashScreen.hide();
    prepareData();
  }, []);

  React.useEffect(() => {
    ty.addListener((value) => (currentPosition = value.value));

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );
    return () => backHandler.remove();
  }, []);

  const goBack = () => {
    if (currentPosition === 0) {
      closePicker();
      return true;
    }
    return false;
  };

  const prepareData = async () => {
    if (lang.langName === 'persian') {
      sort(faAlphabet);
    } else if (lang.langName === 'english') {
      sort(enAlphabet);
    } else if (lang.langName === 'arabic') {
      sort(arAlphabet);
    }
  };

  const sort = (alphabet) => {
    const sortedData = [];

    alphabet.map((char) => {
      const title = char;
      let data = [];
      allCountries.map((country, index) => {
        if (
          country[lang.langName].charAt(0) === char &&
          country[lang.langName] != allCountries[0][lang.langName]
        ) {
          data.push({
            id: country.id,
            name: country[lang.langName],
            index: index,
          });
        }
      });
      sortedData.push({title, data});
    });

    console.log('sortedData', sortedData);
    originData = sortedData.filter((item) => item.data.length > 0);
    setSortedData(originData);
  };

  const countryChanged = (item, index) => {
    closePicker();
    setCountryId(item.id);
    setCountryName(item.name);
    setSelectedCountry(item);
  };

  const searchTextChanged = (searchText) => {
    setSearchText(searchText);
    let filteredData = [...originData];
    if (props.searchText != '') {
      filteredData = originData.map((cat) => ({
        title: cat.title,
        data: cat.data.filter((item) =>
          item.name.toUpperCase().includes(searchText.toUpperCase()),
        ),
      }));

      //  console.log("filteredData1",[...filteredData])
      console.log(
        'filteredData2',
        filteredData.filter((item) => item.data.length > 0),
      );
    }
    setSortedData([...filteredData.filter((item) => item.data.length > 0)]);
  };

  const openPicker = () => {
    Animated.timing(ty, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePicker = () => {
    Animated.timing(ty, {
      toValue: dimensions.WINDOW_HEIGTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onNext = () => {
    if (countryId > 0) {
      let newUser = {
        ...user,
        countryId: countryId,
        country: countryName,
      };

      dispatch(
        updateUserData({
          countryId: countryId,
          country: countryName,
        }),
      );

      if (countryId == 128 || countryId == 197) {
        dispatch(
          updateUserData({
            startOfWeek: 6,
          }),
        );

        newUser = {
          ...user,
          countryId: countryId,
          country: countryName,
          startOfWeek: 6,
        };
      }
      if(countryId==128){
        props.navigation.navigate('SignUpScreen');
      }else{
        props.navigation.navigate('LoginOrSignUpScreen');
      }

      AsyncStorage.setItem('user', JSON.stringify(newUser));
     
    } else {
      setErrorContext(lang.chooseCountry);
      setErrorVisible(true);
    }
  };

  const onPrevious = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
  };

  return (
    <>
      <View style={styles.logoContainer}>
        <LottieView
          style={{width: '80%'}}
          source={require('../../../res/animations/country.json')}
          autoPlay
          loop={false}
        />
      </View>
      <View style={styles.container}>
        {countries === null ? (
          <ActivityIndicator
            size="large"
            color={defaultTheme.primaryColor}
            style={{marginTop: '12%'}}
          />
        ) : (
          <View style={styles.topContainer}>
            <Text
              style={[styles.text, {fontFamily: lang.titleFont}]}
              allowFontScaling={false}>
              {lang.chooseCountry}
            </Text>
            <DropDown
              data={data}
              lang={lang}
              style={styles.dropDownContainer}
              onItemPressed={countryChanged}
              selectedItem={countryName}
              selectedTextStyle={{
                fontSize: moderateScale(16),
                maxWidth: dimensions.WINDOW_WIDTH * 0.62,
                fontFamily:lang.langName!=="english"?lang.font:lang.titleFont
              }}
              onOpen={openPicker}
              dateContainerStyle={{justifyContent: 'space-between'}}
            />
          </View>
        )}

        <View
          style={[
            styles.buttonContainer,
            {justifyContent: canGoBack ? 'space-between' : 'center'},
          ]}>
          {canGoBack && (
            <ConfirmButton
              style={styles.button}
              lang={lang}
              title={lang.perBtn}
              onPress={onPrevious}
              leftImage={require('../../../res/img/back.png')}
              rotate
            />
          )}
          <ConfirmButton
            style={styles.button}
            lang={lang}
            title={lang.continuation}
            onPress={onNext}
            rightImage={require('../../../res/img/next.png')}
            rotate
          />
        </View>
      </View>
      {errorVisible && (
        <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
          <View style={styles.wrapper}>
            <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
          </View>
        </TouchableWithoutFeedback>
      )}
      <Information
        visible={errorVisible}
        context={errorContext}
        onRequestClose={() => setErrorVisible(false)}
        lang={lang}
      />
      {sortedData && (
        <CountryPicker
          data={sortedData}
          lang={lang}
          ty={ty}
          closePicker={closePicker}
          searchTextChanged={searchTextChanged}
          searchText={searchText}
          countryChanged={countryChanged}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: dimensions.WINDOW_WIDTH * 0.9,
    marginBottom: dimensions.WINDOW_HEIGTH * 0.1,
  },
  logo: {
    width: dimensions.WINDOW_WIDTH * 0.65,
    height: dimensions.WINDOW_WIDTH * 0.4,
  },
  text: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText,
    marginBottom: 15,
  },
  dropDownText: {
    fontSize: moderateScale(15),
    color: defaultTheme.gray,
    marginVertical: 8,
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 25,
    backgroundColor: defaultTheme.primaryColor,
  },
  dropDownContainer: {
    height: moderateScale(48),
    justifyContent: 'center',
    width: dimensions.WINDOW_WIDTH * 0.8,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: defaultTheme.lightGray,
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

export default ChooseCountryScreen;
