import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { DropDown, Toolbar, RowSpaceBetween, ConfirmButton, CustomInput, Information } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urls } from "../../utils/urls"
import { RestController } from "../../classess/RestController"
import moment from "moment"
import Toast from 'react-native-toast-message'


const SupportScreen = props => {

  const lang = useSelector(state => state.lang)
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const auth = useSelector(state => state.auth)
  const data = React.useRef([
    {
      id: 1,
      name: lang.msgCat1
    }, {
      id: 2,
      name: lang.msgCat2
    },
    {
      id: 3,
      name: lang.msgCat3
    },
    {
      id: 4,
      name: lang.msgCat4
    }
  ]).current

  const [loading, setLoading] = React.useState(false)
  const [subject, setSubject] = React.useState(props.route.params ? data[2] : data[0])
  const [message, setmessage] = React.useState("")
  const [title, setTitle] = React.useState(props.route.params ? props.route.params.title : "")
  const [errorVisible, setErrorVisible] = React.useState(false)
  const [errorContext, setErrorContext] = React.useState("")


  const subjectChanged = (item) => {
    setSubject(item)
  }

  const onSend = () => {
    if (app.networkConnectivity) {
      if (message != "") {
        setLoading(true)
        const url = urls.socialBaseUrl + urls.contactUs
        const header = { headers: { Authorization: "Bearer " + auth.access_token, Language: lang.capitalName } }
        const params = {
          "id": 0,
          "userId": user.id,
          "insertDate": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
          "message": message,
          "title": title,
          "classification": subject.id,
          "replyToMessage": 0,
        }

        const RC = new RestController()
        RC.checkPrerequisites("post", url, params, header, (res) => setMessageSuccess(res, params), setMessageFailure, auth, onRefreshTokenSuccess, onRefreshTokenFailure)

      }
      else {
        setErrorContext(lang.fillAllFild)
        setErrorVisible(true)
      }
    }
    else {
      setErrorContext(lang.noInternet)
      setErrorVisible(true)
    }
  }

  const setMessageSuccess = async (response, newMessage) => {
    setmessage("")
    setLoading(false)
    // setErrorContext(lang.successful)
    // setErrorVisible(true)
    Toast.show({
      type: "success",
      props: { text2: lang.successful, style: { fontFamily: lang.font } },
      onShow: props.navigation.goBack(),
      visibilityTime:800
    })

    const allMessage = JSON.parse(await AsyncStorage.getItem("messages"))
    allMessage.push(response.data.data)
    AsyncStorage.setItem("messages", JSON.stringify(allMessage))
  }

  const setMessageFailure = (error) => {
    setLoading(false)
  }

  const onRefreshTokenSuccess = () => {

  }

  const onRefreshTokenFailure = () => {

  }

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={dimensions.WINDOW_HEIGTH < 800 ? 30 : 60} style={{ }} behavior={Platform.OS == "ios" ? "position" : "position"}>
        <Toolbar
          lang={lang}
          title={lang.support}
          onBack={() => props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <Text style={[styles.text, { fontFamily: lang.font, margin: moderateScale(16) }]} allowFontScaling={false}>
            {
              lang.supportDescription
            }
          </Text>
          <RowSpaceBetween style={styles.row}>
            <Text style={[styles.text, { fontFamily: lang.font, marginLeft: moderateScale(10) }]} allowFontScaling={false}>
              {
                lang.selectDepartment
              }
            </Text>
            <DropDown
              data={data}
              lang={lang}
              style={styles.dropDownContainer}
              onItemPressed={subjectChanged}
              selectedItem={data.find(item => item.id === subject.id)["name"]}
              selectedTextStyle={{ fontSize: moderateScale(15), color: defaultTheme.gray }}
            />
          </RowSpaceBetween>
          <CustomInput
            lang={lang}
            style={styles.inputTitle}
            value={title}
            onChangeText={setTitle}
            placeholder={lang.messagesubject}
          />

          <CustomInput
            lang={lang}
            style={styles.input}
            multiline
            value={message}
            onChangeText={setmessage}
            placeholder={lang.writhYourTextForSupport}
          />
        </ScrollView>
        <ConfirmButton
          lang={lang}
          style={styles.button}
          title={lang.sendMsg}
          leftImage={require("../../../res/img/done.png")}
          onPress={onSend}
          isLoading={loading}
        />
        <Information
          visible={errorVisible}
          context={errorContext}
          onRequestClose={() => errorContext === lang.successful ? props.navigation.replace("MessagesScreen") : setErrorVisible(false)}
          lang={lang}
        />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(26),
    color: defaultTheme.darkText,
    textAlign:"left"
  },
  row: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    marginTop: moderateScale(30)
  },
  row2: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    borderRadius: moderateScale(12)
  },
  dropDownContainer: {
    marginHorizontal: 0,
    minWidth: moderateScale(120)
  },
  inputTitle: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    borderWidth: 1,
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    alignItems: "flex-start",
  },
  input: {
    width: dimensions.WINDOW_WIDTH * 0.95,
    borderWidth: 1,
    borderColor: defaultTheme.border,
    borderRadius: moderateScale(12),
    minHeight: moderateScale(80),
    maxHeight:moderateScale(120),
    padding: moderateScale(10),
    alignItems: "flex-start",
  },
  button: {
    width: dimensions.WINDOW_WIDTH * 0.45,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    alignSelf: "center",
    marginBottom: moderateScale(20)
  }
});

export default SupportScreen;
