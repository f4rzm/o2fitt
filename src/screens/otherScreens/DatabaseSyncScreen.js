import React from 'react';
import {
  StyleSheet,
  Share,
  TouchableOpacity,
  Text,
  BackHandler,
  ActivityIndicator,
  Modal
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RowWrapper, ConfirmButton , Toolbar, RowCenter} from '../../components';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import {LocalFoodsHandler} from "../../classess/LocalFoodsHandler"
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { WebView } from 'react-native-webview'

const faAlphabet = ["آ","ا", "ب", "پ", "ت", "ث", "ج","چ","ح","خ","د","ذ","ر","ز","ژ","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","گ","ل","م","ن","و","ه","ی"]
const arAlphabet = ["آ","ا", "ب", "ت", "ث", "ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","ل","م","ن","و","ه","ی"]
const enAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

const DatabaseSyncScreen = props => {
    const lang = useSelector(state=>state.lang)
    const user = useSelector(state=>state.user)
    const app = useSelector(state=>state.app)
    const profile = useSelector(state=>state.profile)

    const [showModal,setShowModal] = React.useState(true)
    console.log("user" , user)

    React.useEffect(()=>{
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        goBack
      );
     
      if(props.route.params && props.route.params.newFoods){
        const LFH = new LocalFoodsHandler(lang.langName)
        LFH.putUpdateFiles(props.route.params.newFoods , onUpdateFinish)
      }
      else{
        prepareSportData()
      }
      
      return () => backHandler.remove();
  },[])

  const prepareSportData = async()=>{
    const storedData = await AsyncStorage.getItem("SportsArray")
    console.log("storedData",storedData)
    if(storedData){
       getStartFile()
     
    }
    else{
      setTimeout(()=>{
          if(lang.langName === "persian"){
              sort(faAlphabet)
          }
          else if(lang.langName === "english"){
              sort(enAlphabet)
          }
          else if(lang.langName === "arabic"){
              sort(arAlphabet)
          }
      },100)
    }
  }

  const sort = async(alphabet)=>{
    const {exercise} = require("../../utils/exercise.js");
    const sortedData=[]
    alphabet.map( char=>{
        const title = char
        let data = []
        exercise.map( (train , index)=>{
            if(train.name[lang.langName].charAt(0)===char){
                data.push({
                    id : train.id,
                    iconUri : train.iconUri,
                    name : train.name[lang.langName],
                    index : index
                })
            }
        })
        sortedData.push({title,data})
    });   
    console.log("sortedData",sortedData)
    await AsyncStorage.setItem("SportsArray" , JSON.stringify(sortedData))
    prepareBodyBuilding()
   
  }

  const prepareBodyBuilding = ()=>{
    const bodyBuildingExcercises =  require("../../utils/bodyBuildingExcercises").default
    const allMuscles = require("../../utils/allMuscles").default
    console.log("allMuscles",allMuscles)
    console.log("profile.gender",profile.gender)
    console.log("bodyBuildingExcercises",bodyBuildingExcercises)
    let cat = new Array(allMuscles.length).fill([])
    const genderBodyBuildingExercises = bodyBuildingExcercises.filter(item=>
        (item.gender == profile.gender || item.gender == null)
    )

    
    console.log("cat",cat)
    console.log("genderBodyBuildingExercises",genderBodyBuildingExercises)
    genderBodyBuildingExercises.map(item=>{
      const arr = ([...cat[parseInt(item.targetMuscle)-1]])
      arr.push(item)
      cat[parseInt(item.targetMuscle)-1] = arr
    })    
     
    console.log("prepareBodyBuilding",cat)
    AsyncStorage.setItem("genderBodyBuildingExercises",JSON.stringify(cat.filter(item=>item.length > 0)))
    prepareCardioExercises()
  }

  const prepareCardioExercises = ()=>{
    try{
      const cardioExercises =   require("../../utils/cardios/cardioExcercises").default
      const cardios = require("../../utils/cardios/cardios").default
      let cat = new Array(cardios.length).fill([])
      const genderCardioExercises = cardioExercises.filter(item=>
          (item.gender === profile.gender || item.gender === null)
      )
      genderCardioExercises.filter(item=>item.name[lang.langName]).map(item=>{
      const arr = ([...cat[item.cardioCategory-1]])
      arr.push(item)
      cat[item.cardioCategory-1] = arr
      })    
  
      console.log("prepareCardioExercises",cat)
      AsyncStorage.setItem("genderCardioExercises",JSON.stringify(cat.filter(item=>item.length>0)))
      getStartFile()
    }catch(e){
      console.warn("prepareCardioExercises",e)
    }
  }

  const goBack = ()=>{
    return true
  }

  const getStartFile = ()=>{
    const LFH = new LocalFoodsHandler(lang.langName)
    LFH.hasUnsavedData(saveData)
  }

  const saveData = (hasUnsaved,startFrom)=>{
    if(hasUnsaved){
      const LFH = new LocalFoodsHandler(lang.langName , onFinish)
      LFH.startStoring(startFrom)
    }
    else{
      onFinish()
    }
    
  }

  const onUpdateFinish = ()=>{
    AsyncStorage.setItem("foodDatabaseVersion",props.route.params.version.toString())
    setShowModal(false)
    props.route.params.callBack()
    props.navigation.goBack()
  }

  const onFinish = ()=>{
    AsyncStorage.setItem("foodDatabaseVersion",app.foodDataBaseVersion.toString())
    setShowModal(false)
    props.route.params.callBack()
    props.navigation.goBack()
  }

  return (
      <Modal
        visible={showModal}
      >
          <ScrollView contentContainerStyle={{alignItems : "center" , paddingTop : moderateScale(50) , width:dimensions.WINDOW_WIDTH,height:dimensions.WINDOW_HEIGTH}}>  
              <LottieView 
                  style={{width : "90%"}}
                  source={require('../../../res/animations/data_transfer.json')} 
                  autoPlay 
                  loop={true}
              />
              <Text style={[styles.text1 , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {
                      lang.updatingDatabase
                  }
              </Text>
              <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                  {
                      lang.loding_text
                  }
              </Text>
              <ActivityIndicator
                size="large"
                color={defaultTheme.primaryColor}
                style={{margin : "15%"}}
              />
          </ScrollView>
          {/* <WebView
            style={{width:1,height:1}}
            ref={webView}
            source={{html: `
            <script>
                document.addEventListener("message", function(data) {
                    const exercise = JSON.parse(data.data).exercise
                    const alphabet = JSON.parse(data.data).alphabet
                    const lang = JSON.parse(data.data).lang
                
                    const sortedData=[]
                    alphabet.map( char=>{
                         const title = char
                         let data = []
                         exercise.map( (train , index)=>{
                             if(train.name[lang.langName].charAt(0)===char){
                                 data.push({
                                     id : train.id,
                                     iconUri : train.iconUri,
                                     name : train.name[lang.langName],
                                     index : index
                                 })
                             }
                         })
                         sortedData.push({title,data})
                        
                     });
                     window.ReactNativeWebView.postMessage(JSON.stringify(sortedData));
                });
                
            </script>
           `}}
            onMessage={handleMessage}
            javaScriptEnabled={true}
          /> */}
      </Modal>
  );
};

const styles = StyleSheet.create({
 
  img : {
    width : dimensions.WINDOW_WIDTH * 0.5,
    height : dimensions.WINDOW_WIDTH * 0.5,
  },
  text : {
      width : dimensions.WINDOW_WIDTH * 0.8,
      fontSize : moderateScale(14),
      color : defaultTheme.mainText,
      lineHeight : moderateScale(24),
      textAlign : "center"
  }, 
  text1 : {
    fontSize : moderateScale(17),
    color : defaultTheme.darkText,
    lineHeight : moderateScale(25),
    textAlign : "center",
    margin : moderateScale(30)
  }, 
  imgContainer : {
        width : moderateScale(50),
        height : moderateScale(40),
        backgroundColor : defaultTheme.primaryColor,
        borderRadius : moderateScale(6),
        justifyContent : "center",
        alignItems : "center"
  },
  share : {
      width : moderateScale(25),
      height : moderateScale(25)
  },
  container : {
      width : moderateScale(250),
      height : moderateScale(40),
      marginHorizontal : moderateScale(3),
      backgroundColor : defaultTheme.grayBackground,
      borderRadius : moderateScale(6),
      
  }
  
});

export default DatabaseSyncScreen;
