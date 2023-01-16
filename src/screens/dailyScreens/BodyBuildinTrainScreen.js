import React from 'react';
import {
  StyleSheet,
  BackHandler,
  FlatList,
  Text
} from 'react-native';
import { BlurComponent, WorkoutRow, ConfirmButton, ActivityPermission } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"
import LottieView from 'lottie-react-native';
import { dimensions } from '../../constants/Dimensions';
import allMuscles from "../../utils/allMuscles"
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

let bodyIndex = 0
let originData = []
const BodyBuildinTrainScreen = props => {
  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  const [bodyData, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const pkExpireDate = moment(profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false

  React.useEffect(() => {
    prepareData()
  }, [])

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack
    );
    return () => backHandler.remove();
  }, [])

  const goBack = () => {
    props.navigation.goBack()
    return true
  }

  const prepareData = async () => {
    originData = props.route.params.items
    setData([...props.route.params.items])
    setIsLoading(false)
  }

  const onPress = async (item) => {
    const date = await AsyncStorage.getItem("homeDate")
    props.navigation.navigate("ActivityDetailsScreen", {
      activity: {
        workOutId: item.id,
        classification: item.classification
      },
      date: date
    })
  }

  console.log("bodyData", bodyData)
  let finalData = []
  let filteredData = []
  if (!hasCredit) {
    filteredData = bodyData.filter(item => item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
    if (bodyData && bodyData.length > 0 && bodyData[0].targetMuscle == 1) {
      finalData = bodyData.filter((item, index) => index < 2).filter(item => item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
    }
  }
  else {
    filteredData = bodyData.filter(item => item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
    finalData = bodyData.filter(item => item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
  }
  console.log("filteredData", filteredData)
  const openPackage=()=>{
    props.navigation.navigate("PackagesScreen")
  }


  return (
    <>
      <ConfirmButton
          lang={lang}
          title={lang.back}
          style={styles.back}
          onPress={goBack}
          textStyle={styles.text}
          rotate
          leftImage={require("../../../res/img/back1.png")}
          imageStyle={{tintColor:defaultTheme.gray}}
        />
      <FlatList
        data={finalData}
        extraData={finalData}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => {
          if (props.searchText != "" && !isLoading) {
            if (filteredData.length === 0) {
              return (
                <>
                  <LottieView
                    style={{
                      width: dimensions.WINDOW_WIDTH * 0.45,
                      height: dimensions.WINDOW_WIDTH * 0.8,
                      alignSelf: "center",
                    }}
                    source={require('../../../res/animations/noresultexerise.json')}
                    autoPlay
                    loop={true}
                  />
                  <Text
                    style={[{
                      fontFamily: lang.font,
                      alignSelf: "center",
                      fontSize: moderateScale(15),
                      textAlign: "left"
                    }]}
                    allowFontScaling={false}
                  >
                    {
                      lang.noMatchedExercise
                    }
                  </Text>
                </>
              )
            }
            else {
              return (
                <ActivityPermission
                lang={lang}
                onPressPermission={openPackage}
              />
              )
            }
          }
          return null
        }}
        ListFooterComponent={() => {
          if (!hasCredit && props.searchText === "")
            return (
              <ActivityPermission
                lang={lang}
                onPressPermission={openPackage}
              />
            )
          return null
        }}
        renderItem={({ item, index }) => {
          return (
            <WorkoutRow
              key={item.id.toString()}
              lang={lang}
              title={item.name[lang.langName]}
              logo={{ uri: item.iconUri }}
              onPress={() => onPress(item)}
              text1={allMuscles.find(muscle => muscle.id == item.targetMuscle)[lang.langName]}
            />
          )
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: defaultTheme.green,
  },
  back: {
    backgroundColor: defaultTheme.green,
    width: moderateScale(90),
    height: moderateScale(30),
    margin: moderateScale(25),
    alignSelf: "flex-end",
  },
  back: {
    backgroundColor: defaultTheme.transparent,
    width: moderateScale(80),
    height: moderateScale(30),
    marginHorizontal: moderateScale(25),
    marginVertical: moderateScale(12),
    alignSelf: "flex-start"
  },
  text: {
    color: defaultTheme.gray,
  }
});

export default BodyBuildinTrainScreen;
