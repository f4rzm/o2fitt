import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from 'react-native';
import { ConfirmButton, ProfileHeader, DropDown, RowSpaceBetween, DatePicker, CalendarDropDown, Information, TwoOptionModal, CustomInput } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import moment from "moment-jalaali"
import allCountries from "../../utils/countries"
import ImagePicker from 'react-native-image-crop-picker';
import { RestController } from "../../classess/RestController"
import { urls } from "../../utils/urls"
import { updateProfileLocaly } from "../../redux/actions"
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import Toast from 'react-native-toast-message'
import { BlurView } from '@react-native-community/blur';

PouchDB.plugin(pouchdbSearch)
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' })

const EditProfileScreen = props => {

  const lang = useSelector(state => state.lang)
  const reduxUser = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const specification = useSelector(state => state.specification)
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const reduxProfile = useSelector(state => state.profile)
  const [user, setUser] = React.useState(reduxUser)
  const [profile, setProfile] = React.useState({ ...reduxProfile })
  const [showDatePicker, setShowPicker] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [ImagePickerVisible, setImagePickerVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  console.log("user", user)

  const activityRates = React.useRef([
    {
      id: 10,
      name: lang.bedRest
    },
    {
      id: 20,
      name: lang.veryLittleActivity
    },
    {
      id: 30,
      name: lang.littleActivity
    },
    {
      id: 40,
      name: lang.normalLife
    },
    {
      id: 50,
      name: lang.relativelyActivity
    },
    {
      id: 60,
      name: lang.veryActivity
    },
    {
      id: 70,
      name: lang.moreActivity
    }
  ]).current

  const foodHabitations = React.useRef(
    [
      {
        id: 0,
        name: lang.adi
      },
      {
        id: 1,
        name: lang.giah
      },
      {
        id: 2,
        name: lang.kham
      },
      {
        id: 3,
        name: lang.pakGiahKhar
      },

    ]).current

  const genders = React.useRef([
    {
      id: 0,
      name: lang.typeSexName_woman
    },
    {
      id: 1,
      name: lang.typeSexName_man
    }
  ]).current

  const activityRateChanged = item => {
    setProfile({ ...profile, dailyActivityRate: item.id })
  }

  const foodHabitChanged = item => {
    console.warn(item)
    setProfile({ ...profile, foodHabit: item.id })
  }

  const onDateSelected = (newDate) => {
    console.log(newDate)
    setShowPicker(false)
    setProfile({ ...profile, birthDate: newDate })
  }

  const openGallery = () => {
    setImagePickerVisible(false)
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        avoidEmptySpaceAroundImage: false,
        includeBase64: true,
        compressImageQuality: 0.8
      }).then(image => {
        console.log("choosed Image -> ", image);
        setProfile({
          ...profile,
          imageUri: image.path,
          base64: image.data
        })

      }).catch(error => {
        console.log("error in imagePicker -> ", error)
      })
    }, 700)

  }

  const openCamera = () => {
    setImagePickerVisible(false)
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: true,
        avoidEmptySpaceAroundImage: false,
        includeBase64: true,
        compressImageQuality: 0.8
      }).then(image => {
        console.log("choosed Image -> ", image);
        setProfile({
          ...profile,
          imageUri: image.path,
          base64: image.data
        })
      });
    }, 1000)
  }

  const onConfirm = () => {
    if (!isNaN(parseFloat(profile.heightSize))) {
      if (app.networkConnectivity) {
        setToServer()
      }
      else {
        const url = urls.userBaseUrl + urls.userProfiles + urls.updateProfile
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName, "Content-Type": "multipart/form-data" } }
        var params = new FormData();
        params.append('UserId', user.id);
        params.append('FullName', profile.fullName);
        params.append('Image', profile.base64 ? profile.base64 : "");
        params.append('HeightSize', profile.heightSize);
        params.append('FoodHabit', profile.foodHabit);
        params.append('Gender', profile.gender);
        params.append('BirthDate', profile.birthDate);
        params.append('DailyActivityRate', profile.dailyActivityRate);

        offlineDB.post({
          method: "post",
          type: "profile",
          url: url,
          params: params,
          header: header
        }).then(res => {
          console.log(res)
          console.warn({ ...profile })
          dispatch(updateProfileLocaly({ ...profile }))
          setLoading(false)
          setErrorContext(lang.successful)
          setErrorVisible(true)
        })
      }
    }
    else {
      setErrorContext(lang.typeEN)
      setErrorVisible(true)
    }
  }

  const setToServer = () => {
    console.log("p", profile)
    setLoading(true)
    const url = urls.userBaseUrl + urls.userProfiles + urls.updateProfile
    const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName, "Content-Type": "multipart/form-data" } }
    var params = new FormData();
    params.append('UserId', user.id);
    params.append('FullName', profile.fullName);
    params.append('Image', profile.base64 ? profile.base64 : "");
    params.append('HeightSize', profile.heightSize);
    params.append('FoodHabit', profile.foodHabit);
    params.append('Gender', profile.gender);
    params.append('BirthDate', profile.birthDate);
    params.append('DailyActivityRate', profile.dailyActivityRate);

    console.log(params)
    const RC = new RestController()
    RC.checkPrerequisites("post", url, params, header, onSuccess, onFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)
  }

  const onSuccess = (response) => {
    dispatch(updateProfileLocaly({ ...response.data.data, targetNutrient: response.data.data.targetNutrient.split(",") }))
    setLoading(false)
    //  setErrorContext(lang.successful)
    //  setErrorVisible(true)
    Toast.show({
      props: { text2: lang.successful, style: { fontFamily: lang.font } },
      visibilityTime: 800,
      onShow: props.navigation.goBack()
    })
  }

  const onFailure = () => {
    setLoading(false)
    setErrorContext(lang.serverError)
    setErrorVisible(true)
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  return (
    <>
      <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60} style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "none"}>
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            {errorVisible || ImagePickerVisible ? (
              <TouchableWithoutFeedback onPress={() => setErrorVisible(false)}>
                <View style={styles.wrapper}>
                  <BlurView style={styles.absolute} blurType="light" blurAmount={6} />
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            <ProfileHeader
              lang={lang}
              user={user}
              profile={profile}
              getImage={() => setImagePickerVisible(true)}
              showBack={true}
              onBackPressed={() => props.navigation.goBack()}
            />
            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.name}
              </Text>

              <CustomInput
                lang={lang}
                style={[styles.input, { width: dimensions.WINDOW_WIDTH * 0.6 }]}
                textStyle={{ textAlign: "center", fontSize: moderateScale(17), color: defaultTheme.lightGray2 }}
                value={profile.fullName}
                onChangeText={text => setProfile({ ...profile, fullName: text })}
                autoFocus={true}
              />
            </RowSpaceBetween>
            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.gender}
              </Text>
              <Text style={[styles.text1, { fontFamily: lang.font, margin: moderateScale(8) }]} allowFontScaling={false}>
                {genders.find(item => item.id === profile.gender)["name"]}
              </Text>
              {/* <DropDown
                    data={genders}
                    lang={lang}
                    style={styles.dropDownContainer2}
                    onItemPressed={genderChanged}
                    selectedItem={genders.find(item=>item.id===profile.gender)["name"]}
                    selectedTextStyle={{fontSize : moderateScale(13) , color : defaultTheme.gray}}
                /> */}
            </RowSpaceBetween>
            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.brithDate}
              </Text>
              <CalendarDropDown
                style={styles.dateContainer}
                lang={lang}
                user={user}
                selectedDate={profile.birthDate.toString().split("T")[0]}
                onPress={() => setShowPicker(true)}
                dateStyle={{ fontSize: moderateScale(16), color: defaultTheme.lightGray2 }}
              />
            </RowSpaceBetween>
            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.height}
              </Text>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <CustomInput
                  lang={lang}
                  style={styles.input}
                  textStyle={{ textAlign: "center", fontSize: moderateScale(17), color: defaultTheme.lightGray2 }}
                  value={profile.heightSize.toString()}
                  onChangeText={text => setProfile({ ...profile, heightSize: text })}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={{marginHorizontal:moderateScale(10)}}>cm</Text>
              </View>
            </RowSpaceBetween>

            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.rateActivity2}
              </Text>
              <DropDown
                data={activityRates}
                lang={lang}
                style={styles.dropDownContainer}
                onItemPressed={activityRateChanged}
                selectedItem={activityRates.find(item => item.id == profile.dailyActivityRate)["name"]}
                selectedTextStyle={{ fontSize: moderateScale(15), color: defaultTheme.lightGray2, minWidth: moderateScale(130) }}
              />
            </RowSpaceBetween>
            <RowSpaceBetween style={styles.row}>
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {lang.foodHabbiteation}
              </Text>
              <DropDown
                data={foodHabitations}
                lang={lang}
                style={styles.dropDownContainer}
                onItemPressed={foodHabitChanged}
                selectedItem={foodHabitations.find(item => item.id == profile.foodHabit)["name"]}
                selectedTextStyle={{ fontSize: moderateScale(15), color: defaultTheme.lightGray2, minWidth: moderateScale(130) }}
              />
            </RowSpaceBetween>
          </ScrollView>
          <View style={{ backgroundColor: defaultTheme.transparent, position: "absolute", bottom: 0, alignItems: "center", width: dimensions.WINDOW_WIDTH }}>
            <ConfirmButton
              lang={lang}
              style={styles.button}
              title={lang.saved}
              leftImage={require("../../../res/img/done.png")}
              onPress={onConfirm}
              isLoading={loading}
            />
          </View>
          <DatePicker
            lang={lang}
            user={user}
            visible={showDatePicker}
            onRequestClose={() => setShowPicker(false)}
            onDateSelected={onDateSelected}
            selectedDate={profile.birthDate.toString().split("T")[0]}
            current={profile.birthDate.toString().split("T")[0]}
          />
          <Information
            visible={errorVisible}
            context={errorContext}
            onRequestClose={() => errorContext === lang.successful ? props.navigation.goBack() : setErrorVisible(false)}
            lang={lang}
          />
          <TwoOptionModal
            lang={lang}
            visible={ImagePickerVisible}
            onRequestClose={() => setImagePickerVisible(false)}
            context={lang.addPhoto}
            button1={lang.camera}
            button2={lang.gallery}
            button1Pressed={openCamera}
            button2Pressed={openGallery}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginVertical: moderateScale(0),
    borderBottomWidth: 1.1,
    minHeight: moderateScale(40),
    paddingVertical: moderateScale(5)
  },
  dropDownContainer: {
    marginHorizontal: 0,
    width: moderateScale(145),

  },
  dropDownContainer2: {
    marginHorizontal: 0,
    minWidth: moderateScale(55)
  },
  text: {
    fontSize: moderateScale(15),
    color: defaultTheme.darkText,
    marginHorizontal: moderateScale(8),
  },
  text1: {
    fontSize: moderateScale(16),
    color: defaultTheme.lightGray2,
    marginHorizontal: moderateScale(8),
  },
  text2: {
    fontSize: moderateScale(12),
    minWidth: moderateScale(60),
    color: defaultTheme.gray
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    alignSelf: "center",
  },
  input: {
    width: null,
    minWidth: moderateScale(90),
    height: moderateScale(35),
    minHeight: moderateScale(30),
    borderWidth: 1.2,
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(10),
    marginVertical: 0,
    borderWidth: 1,
    paddingStart: 0,
    paddingEnd: 0,
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

export default EditProfileScreen;
