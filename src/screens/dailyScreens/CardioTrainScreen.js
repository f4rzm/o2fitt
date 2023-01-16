import React from 'react';
import {
  StyleSheet,
  BackHandler,
  FlatList,
  Text,
  Platform,
  I18nManager,
  View
} from 'react-native';
import { ActivityPermission, BlurComponent, ConfirmButton, RowStart, WorkoutRow } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import moment from "moment"
import cardios from "../../utils/cardios/cardios"
import LottieView from 'lottie-react-native';
import { dimensions } from '../../constants/Dimensions';  
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cardioIndex = 0
let originData=[]
const CardioTrainScreen = props => {
    const lang = useSelector(state=>state.lang)
    const profile = useSelector(state=>state.profile)
    const [cardioData,setData] = React.useState([])
    const [isLoading,setIsLoading] = React.useState(true)

    const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
    const today=moment()
    const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
   
    React.useEffect(()=>{
      prepareData()
    },[])

    React.useEffect(()=>{
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        goBack
      );
      return () => backHandler.remove();
    },[])

    const goBack = ()=>{
      props.navigation.goBack()
      return true
    }

    const prepareData = async()=>{
      originData=[...props.route.params.items]
      setData([...props.route.params.items])
      setIsLoading(false)
    }

    const onPress = async(item) =>{
      const date=await AsyncStorage.getItem("homeDate")
      console.log(item)
      props.navigation.navigate("ActivityDetailsScreen",{
        activity : {
          workOutId : item.id,
          classification : item.classification
        },
        date:date
      })
    }
    const openPackage=()=>{
      props.navigation.navigate("PackagesScreen")
    }

    let finalData = []
    let filteredData = []
    if(!hasCredit){
      filteredData = cardioData.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
      if(cardioData && cardioData.length > 0 && cardioData[0].cardioCategory== 1){
        finalData = cardioData.filter((item , index)=> index < 2).filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
      }
    }
    else{
      filteredData = cardioData.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
      finalData = cardioData.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))
    }

    console.log("cardioData",cardioData)
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
        keyExtractor={(item,index)=>index.toString()}
        ListEmptyComponent={()=>{
          if(props.searchText != "" && !isLoading){
            if(filteredData.length === 0){
              return(
                <>
                  <LottieView 
                      style={{
                          width : dimensions.WINDOW_WIDTH * 0.45 ,
                          height : dimensions.WINDOW_WIDTH * 0.8, 
                          alignSelf : "center", 
                      }}
                      source={require('../../../res/animations/noresultexerise.json')} 
                      autoPlay 
                      loop={true}
                  />
                  <Text 
                      style={[{
                          fontFamily : lang.font , 
                          alignSelf : "center" , 
                          fontSize : moderateScale(15),
                          textAlign : "left"
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
            else{
              return(
                <BlurComponent
                  lang={lang}
                  buyPressed={()=>props.navigation.navigate("PackagesScreen")}
                  message={lang.subscribe1}
                />
              )
            }
          }
          return null
        }}
        ListFooterComponent={()=>{
          if(!hasCredit && props.searchText === "")
          return(
            <ActivityPermission
            lang={lang}
            onPressPermission={openPackage}
            />
          )
          return null
        }}
        renderItem={({item , index})=>{
          return(
            <WorkoutRow
                key={item.id.toString()}
                lang={lang}
                title={item.name[lang.langName]}
                logo={{uri : item.iconUri}}
                onPress={()=>onPress(item)}
                text1={cardios.find(cardios=>cardios.id == item.cardioCategory)[lang.langName]}
            />
          )
        }}
      />
      </>
    );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor: defaultTheme.green,
  },
  back : {
    backgroundColor : defaultTheme.transparent,
    width:moderateScale(80),
    height : moderateScale(30),
    marginHorizontal : moderateScale(25),
    marginVertical : moderateScale(12),
    alignSelf : "flex-start"
  },
  text : {
    color:defaultTheme.mainText,

  }
});

export default CardioTrainScreen;
