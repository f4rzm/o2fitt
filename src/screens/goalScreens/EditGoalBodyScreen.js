
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  I18nManager,
  KeyboardAvoidingView
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { ConfirmButton, RowSpaceBetween, RowWrapper, Toolbar, CustomInput, Information } from '../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { updateTargetBody, updateProfileLocaly } from "../../redux/actions"
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message'

const EditGoalBodyScreen = props => {

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const auth = useSelector(state => state.auth)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()
  const [bottomMargin, setBottomMargin] = React.useState(0)

  const [errorContext, setErrorContext] = React.useState("")
  const [errorVisible, setErrorVisible] = React.useState(false)

  console.log("profile", profile)

  const [p, setProfile] = React.useState({ ...profile })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
    }
  }, [])

  const keyboardDidShow = (e) => {
    console.log(e)
    setBottomMargin(60)
  }

  const keyboardDidHide = (e) => {
    setBottomMargin(0)
  }

  const onConfirm = async () => {
    setLoading(true)
    dispatch(updateTargetBody({
      ...p,
      userId: user.id
    }, auth, app, user, onSuccess, onFailure))
  }

  const onSuccess = () => {
    updateProfileLocaly({ ...profile, ...p })
    setLoading(false)
    // setErrorContext(lang.successful)
    // setErrorVisible(true)
    Toast.show({
      type: 'success',
      props: { text2: lang.successful, style: { fontFamily: lang.font } },
      onShow: props.navigation.goBack(),
      visibilityTime:800
    })

    analytics().logEvent('editBodyGoal')
  }

  const onFailure = () => {

  }

  return (
    <KeyboardAvoidingView  keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 10 : 35}  style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "none"}>

      <View style={[styles.mainContainer]}>
        <Toolbar
          lang={lang}
          title={lang.golSizeLimbTitle}
          onBack={() => props.navigation.goBack()}
        />
        <RowSpaceBetween style={styles.titleContainer}>
          <Text style={[styles.title, { fontFamily: lang.font }]} allowFontScaling={false}>
            {lang.limbBody}
          </Text>
          <Text style={[styles.title, { fontFamily: lang.font, marginHorizontal: moderateScale(35) }]}>
            {lang.gol}
          </Text>
        </RowSpaceBetween>
        <ScrollView style={{ flexGrow: 1,marginBottom:moderateScale(60) }} contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfSine}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                autoFocus={true}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetBust && p.targetBust.toString()}
                onChangeText={text => setProfile({ ...p, targetBust: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfBazoo}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetArm && p.targetArm.toString()}
                onChangeText={text => setProfile({ ...p, targetArm: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfKamar}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetWaist && p.targetWaist.toString()}
                onChangeText={text => setProfile({ ...p, targetWaist: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfShekam}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetHighHip && p.targetHighHip.toString()}
                onChangeText={text => setProfile({ ...p, targetHighHip: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfBasan}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetHip && p.targetHip.toString()}
                onChangeText={text => setProfile({ ...p, targetHip: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfShane}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                textStyle={styles.inputText}
                lang={lang}
                style={styles.customInput}
                maxLength={6}
                placeholder="0"
                value={p.targetShoulder && p.targetShoulder.toString()}
                onChangeText={text => setProfile({ ...p, targetShoulder: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfRan}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                lang={lang}
                style={styles.customInput}
                textStyle={styles.inputText}
                maxLength={6}
                placeholder="0"
                value={p.targetThighSize && p.targetThighSize.toString()}
                onChangeText={text => setProfile({ ...p, targetThighSize: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfGardan}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                lang={lang}
                style={styles.customInput}
                textStyle={styles.inputText}
                maxLength={6}
                placeholder="0"
                value={p.targetNeckSize && p.targetNeckSize.toString()}
                onChangeText={text => setProfile({ ...p, targetNeckSize: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
              {lang.sizeOfMoche}
            </Text>
            <RowWrapper style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }}>
              <CustomInput
                lang={lang}
                style={styles.customInput}
                textStyle={styles.inputText}
                maxLength={6}
                placeholder="0"
                value={p.targetWrist && p.targetWrist.toString()}
                onChangeText={text => setProfile({ ...p, targetWrist: text })}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                cm
              </Text>
            </RowWrapper>
          </RowSpaceBetween>
          <View style={{ height: moderateScale(55) }}>

          </View>
        </ScrollView>

        <View style={{ position: "absolute", bottom: 0 }}>
          <ConfirmButton
            lang={lang}
            style={styles.button}
            title={lang.editorgangoal}
            leftImage={require("../../../res/img/edit.png")}
            isLoading={loading}
            onPress={onConfirm}
          />
        </View>
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => errorContext === lang.successful ? props.navigation.goBack() : setErrorVisible(false)}
          lang={lang}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: moderateScale(80),
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: defaultTheme.border
  },
  headerTab: {
    width: dimensions.WINDOW_WIDTH * 0.25,
    height: moderateScale(65),
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: defaultTheme.border,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  headerText: {
    fontSize: moderateScale(15),
    color: defaultTheme.gray
  },
  row: {
    borderBottomWidth: 1,
    borderColor: defaultTheme.border,
    paddingVertical: moderateScale(0),
    marginVertical: moderateScale(5)
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    margin: moderateScale(25)
  },
  title: {
    color: defaultTheme.darkGray,
    fontSize: moderateScale(17),
    marginHorizontal: moderateScale(10)
  },
  inputText: {
    color: defaultTheme.gray,
    fontSize: moderateScale(19),
    textAlign: "center"
  },
  text: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(10),
    textAlign: "center"
  },
  titleContainer: {
    backgroundColor: defaultTheme.grayBackground,
    marginVertical: 0,
    paddingVertical: moderateScale(8)
  },
  customInput: {
    maxWidth: moderateScale(90),
    height: moderateScale(40),
    minHeight: moderateScale(30),
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(10),
    borderWidth: 1,
  },
});

export default EditGoalBodyScreen;
