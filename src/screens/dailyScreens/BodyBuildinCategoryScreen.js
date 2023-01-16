import React from 'react';
import {
  StyleSheet,
  FlatList,
  BackHandler,
  Text,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SportRowHeader, WorkoutRow } from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import allMuscles from "../../utils/allMuscles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';

let originData=[]
const BodyBuildinCategoryScreen = props => {
    const lang = useSelector(state=>state.lang)
    const profile = useSelector(state=>state.profile )
    const [bodyBuildingsCat,setBodyCat] = React.useState([])
    let cat = new Array(allMuscles.length).fill([])
    const [isLoading,setIsLoading] = React.useState(true)

    React.useEffect(()=>{
        prepareData()
    },[])

    React.useEffect(()=>{
      const filteredData =  originData.map(cat=>cat.filter(item=>item.name[lang.langName].toLowerCase().includes(props.searchText.toLowerCase())))
      setBodyCat(filteredData.filter(item=>item.length > 0))
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
      const storedData = await AsyncStorage.getItem("genderBodyBuildingExercises")
      console.log("storedData",JSON.parse(storedData))
      if(storedData && JSON.parse(storedData).length > 1){
        originData = JSON.parse(storedData)
        setBodyCat(originData.map(cat=>cat.filter(item=>item.name[lang.langName].includes(props.searchText.toLowerCase()))).filter(item =>item.length > 0))
        setIsLoading(false)
      }
      else{
        const bodyBuildingExcercises =  require("../../utils/bodyBuildingExcercises").default
      
        const genderBodyBuildingExercises = bodyBuildingExcercises.filter(item=>
            (item.gender === profile.gender || item.gender === null)
        )
        
        genderBodyBuildingExercises.map(item=>{
          const arr = ([...cat[item.targetMuscle-1]])
          arr.push(item)
          cat[item.targetMuscle-1] = arr
        })    
        console.log("cat",cat)  
        setBodyCat(cat.filter(item=>item.length > 0))
        AsyncStorage.setItem("genderBodyBuildingExercises",JSON.stringify(cat))
        originData = cat.filter(item=>item.length > 0) 
        setIsLoading(false)
      }
    }
    console.log("bodyBuildingsCat",bodyBuildingsCat)
    return (        
      <FlatList
        data={bodyBuildingsCat}
        extraData={bodyBuildingsCat}
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
                <Text style={[{fontFamily : lang.font , alignSelf : "center" , fontSize : moderateScale(15)}]} allowFontScaling={false}>
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
                key={item[0].targetMuscle.toString()}
                text1={item.length + " " + lang.movement}
                lang={lang}
                title={allMuscles.find(muscle=>muscle.id == item[0].targetMuscle)[lang.langName ]}
                logo={allMuscles.find(muscle=>muscle.id == item[0].targetMuscle)["img"]}
                onPress={()=>props.navigation.navigate("BodyBuildinTrainScreen",{
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

export default BodyBuildinCategoryScreen;
