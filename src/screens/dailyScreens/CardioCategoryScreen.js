import React from 'react';
import {
  StyleSheet,
  FlatList,
  BackHandler,
  Text,
  Image
} from 'react-native';
import { SportRowHeader, WorkoutRow } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import cardios from "../../utils/cardios/cardios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';

let originData=[]
const CardioCategoryScreen = props => {
    const lang = useSelector(state=>state.lang)
    const user = useSelector(state=>state.user)
    const profile = useSelector(state=>state.profile)
    const [cardioCats,setCardioCats] = React.useState([])
    let cat = new Array(cardios.length).fill([])
    const [isLoading,setIsLoading] = React.useState(true)

    React.useEffect(()=>{
      prepareData()
  },[])

  React.useEffect(()=>{
    const filteredData =  originData.map(cat=>cat.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())))
    setCardioCats(filteredData.filter(item=>item.length > 0))
    console.log("filteredData",filteredData)
  },[props.searchText])
  
  React.useEffect(()=>{
    let backHandler = null
    const focusUnsubscribe = props.navigation.addListener('focus' , ()=>{
        backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{props.navigation.navigate("SportsTab"); return true})
    })

    const blurUnsubscribe = props.navigation.addListener('blur' , ()=>{
        backHandler && backHandler.remove()
    })

    return ()=> {
        backHandler && backHandler.remove()
        focusUnsubscribe()
        blurUnsubscribe()
    }
  },[])

  const prepareData = async()=>{
    const storedData = await AsyncStorage.getItem("genderCardioExercises")
    console.log("storedData",JSON.parse(storedData))
    if(storedData && JSON.parse(storedData).length > 1){
      originData = JSON.parse(storedData)
      setCardioCats(originData.map(cat=>cat.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))).filter(item =>item.length > 0))
      setIsLoading(false)
    }
    else{
        const cardioExercises = require("../../utils/cardios/cardioExcercises").default
        
        const genderCardioExercises = cardioExercises.filter(item=>
           (item.gender == profile.gender || item.gender == null)
        )
        genderCardioExercises.map(item=>{
        const arr = [...cat[item.cardioCategory-1]]
        arr.push(item)
        cat[item.cardioCategory-1] = arr
      })    
      AsyncStorage.setItem("genderCardioExercises",JSON.stringify(cat))
      originData = cat.filter(item=>item.length > 0)
      setCardioCats( originData.map(cat=>cat.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase()))))
      setIsLoading(false)
    }
  }

    console.log("sss",cardioCats)
    console.log("user",user)
    console.log("profile",profile)
    return (
      <FlatList
        data={cardioCats}
        extraData={cardioCats}
        keyExtractor={(item,index)=>index.toString()}
        ListEmptyComponent={()=>{
          if(props.searchText != "" && !isLoading){
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
          return null
        }}
        renderItem={({item , index})=>{
          return(
            <WorkoutRow
                key={item[0].cardioCategory.toString()}
                text1={item.length + " " + lang.movement}
                lang={lang}
                title={cardios.find(cardio=>cardio.id == item[0].cardioCategory)[lang.langName ]}
                logo={cardios.find(cardio=>cardio.id == item[0].cardioCategory)["img"]}
                onPress={()=>props.navigation.navigate("CardioTrainScreen",{
                  items : item , 
                  searchText : props.searchText ,
                })}
                showArrow
            />
          )
        }}
      />
    );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor: defaultTheme.green,
  }
});

export default CardioCategoryScreen;
