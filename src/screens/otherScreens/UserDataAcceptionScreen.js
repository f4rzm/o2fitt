import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {dimensions} from '../../constants/Dimensions';
import {ConfirmButton, Information, UserData} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';
import {urls} from '../../utils/urls';
import {RestController} from '../../classess/RestController';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import {updateProfileLocaly, updateSpecification} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CommonActions } from '@react-navigation/native';

export default function UserDataAcceptionScreen(props) {
  const [goalinWeek, setGoalinWeek] = useState();
  const [isShowingweekly, setIsShowingweekly] = useState(true);
  const [gender, setGender] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [activityRate, setActivityRate] = useState();
  const [goal, setGoal] = useState();
  const [foodHabit, setFoodHabit] = useState();
  const [errorContext, setErrorContext] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);
  const lang = useSelector(state => state.lang);
  const profile = useSelector(state => state.profile);
  const user = useSelector(state => state.user);
  const app = useSelector(state => state.app);
  const auth = useSelector(state => state.auth);
  const specification = useSelector(state => state.specification);
  const dispatch = useDispatch();
  useEffect(() => {
    if (profile.gender == 0) {
      setGender(lang.typeSexName_woman);
    } else {
      setGender(lang.typeSexName_man);
    }
    switch (profile.dailyActivityRate) {
      case 10: {
        setActivityRate(lang.bedRest.split('*')[0]);
        break;
      }
      case 20: {
        setActivityRate(lang.veryLittleActivity.split('*')[0]);
        break;
      }
      case 30: {
        setActivityRate(lang.littleActivity.split('*')[0]);
        break;
      }
      case 40: {
        setActivityRate(lang.normalLife.split('*')[0]);
        break;
      }
      case 50: {
        setActivityRate(lang.relativelyActivity.split('*')[0]);
        break;
      }
      case 60: {
        setActivityRate(lang.veryActivity.split('*')[0]);
        break;
      }
      case 70: {
        setActivityRate(lang.moreActivity.split('*')[0]);
        break;
      }
      default:
        null;
    }
    if (specification[0].weightSize < profile.targetWeight) {
      setGoal(lang.weightGain);
    } else if (specification[0].weightSize > profile.targetWeight) {
      setGoal(lang.weightLoss);
    } else if (specification[0].weightSize == profile.targetWeight) {
      setGoal(lang.weightStability);
    }

    switch (profile.foodHabit) {
      case 0: {
        setFoodHabit(lang.adi);
        break;
      }
      case 1: {
        setFoodHabit(lang.giah);
        break;
      }
      case 2: {
        setFoodHabit(lang.kham);
        break;
      }
      case 3: {
        setFoodHabit(lang.pakGiahKhar);
        break;
      }
      default:
        null;
    }
    if (specification[0].weightSize == profile.targetWeight) {
      setIsShowingweekly(false);
    }
    if (specification[0].weightSize > profile.targetWeight) {
      setGoalinWeek(lang.weightLossRate);
    }
    if (specification[0].weightSize < profile.targetWeight) {
      setGoalinWeek(lang.weightGainRate);
    }
  }, []);
  const onBack = () => {
    props.navigation.goBack();
  };

  const onNext = () => {
    setIsLoading(true);
    const url = urls.userBaseUrl + urls.userProfiles + urls.register;
    const params = {
      ...profile,
      userId: user.id,
      targetStep: 5000,
      insertDate: moment().format('YYYY-MM-DD'),
    };
    analytics().logEvent('user_target', {
      userId: user.id,
      gender: profile.gender,
      targetStep: 5000,
      targetWeight: profile.targetWeight,
      weightChangeRate: profile.dailyActivityRate,
      currentWeight: specification[0].weightSize,
    });
    const header = {};
    // console.log('params => ', params);
    const RC = new RestController();
    RC.post(url, params, header, onSetProfileSuccess, onSetProfileFailure);
  };
  const onSetProfileSuccess = response => {
    dispatch(
      updateProfileLocaly({
        ...response.data.data,
        targetNutrient: response.data.data.targetNutrient.split(','),
      }),
    );
    if (app.networkConnectivity) {
      dispatch(
        updateSpecification(
          {
            ...specification[0],
            userProfileId: response.data.data.id,
            insertDate: moment().format('YYYY-MM-DD'),
          },
          auth,
          app,
          user,
        ),
      );
    }

    setIsLoading(false);
    AsyncStorage.setItem('welcomeRoute', 'false');
    // props.navigation.navigate('Tabs')
    props.navigation.dispatch(
      CommonActions.reset({index: 0, routes: [{name: 'Tabs'}]}),
    );
  };

  const onSetProfileFailure = error => {
    console.warn(error);
    setErrorContext(lang.serverError);
    setErrorVisible(true);
    setIsLoading(false);
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, {fontFamily: lang.titleFont}]}>
            {lang.dataConfirmationHeader}
          </Text>
        </View>
        <UserData lang={lang} title={lang.foodHabbiteation} data={foodHabit} />
        <UserData lang={lang} title={lang.gender} data={gender} />
        <UserData lang={lang} title={lang.height} data={profile.heightSize} />
        <UserData
          lang={lang}
          title={lang.weight}
          data={specification[0].weightSize}
        />
        <UserData lang={lang} title={lang.rateActivity2} data={activityRate} />
        {isShowingweekly && (
          <UserData
            lang={lang}
            title={lang.golWeight}
            data={profile.targetWeight}
          />
        )}
        {isShowingweekly && (
          <UserData
            lang={lang}
            title={goalinWeek}
            data={profile.weightChangeRate}
          />
        )}
        <UserData
          lang={lang}
          title={lang.mainGoal}
          data={goal}
          contaierStyle={{borderBottomWidth: 0}}
        />
        <View style={{height: moderateScale(50)}} />
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => setErrorVisible(false)}
          lang={lang}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={defaultTheme.primaryColor} />
        ) : (
          <View style={styles.buttonContainer}>
            <ConfirmButton
              title={lang.no}
              style={styles.confirmButtonNo}
              lang={lang}
              onPress={onBack}
              leftImage={require('../../../res/img/back.png')}
              rotate
            />
            <ConfirmButton
              title={lang.yes}
              style={styles.confirmButtonYes}
              lang={lang}
              onPress={onNext}
              rightImage={require('../../../res/img/next.png')}
              rotate
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
  },
  headerContainer: {
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: moderateScale(20),
    padding: moderateScale(20),
    color: defaultTheme.darkText,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: dimensions.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  confirmButtonYes: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
    backgroundColor: defaultTheme.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonNo: {
    width: dimensions.WINDOW_WIDTH * 0.35,
    borderRadius: 20,
    backgroundColor: defaultTheme.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    height: moderateScale(75),
    marginBottom: moderateScale(0),
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: moderateScale(0),
  },
});
