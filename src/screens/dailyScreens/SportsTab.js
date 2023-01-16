import React from 'react';
import{
    SectionList,
    BackHandler,
    Text,
    Platform,
    I18nManager
}from"react-native"
import LottieView from 'lottie-react-native';
import { SportListContainer, SportRow , SportRowHeader } from '../../components';
import { useSelector , useDispatch} from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';


const faAlphabet = ["آ","ا", "ب", "پ", "ت", "ث", "ج","چ","ح","خ","د","ذ","ر","ز","ژ","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","گ","ل","م","ن","و","ه","ی"]
const arAlphabet = ["آ","ا", "ب", "ت", "ث", "ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","ل","م","ن","و","ه","ی"]
const enAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

let originData=[]

const SportsTab = props => {
    const lang = useSelector(state=>state.lang)
    const user = useSelector(state=>state.user)
    const [arrayData , setArrayData]=React.useState([])
    const [renderList , setReneder]=React.useState(false)

    React.useEffect(()=>{
        prepareData()
    },[])

    React.useEffect(()=>{
        console.log("originData",originData)
        let filteredData = [...originData]
        if(props.searchText != ""){
            filteredData =  originData.map(cat=>({title : cat.title , data : cat.data.filter(item=>item.name.toLowerCase().includes(props.searchText.toLowerCase()))}))
            
            //  console.log("filteredData1",[...filteredData])
            console.log("filteredData2",filteredData.filter(item=>item.data.length > 0))
        }
         setArrayData([...filteredData.filter(item=>item.data.length > 0)])
    },[props.searchText])
  
    React.useEffect(()=>{
      let backHandler = null
      const focusUnsubscribe = props.navigation.addListener('focus' , ()=>{
          backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{props.navigation.popToTop(); return true})
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
        const storedData = await AsyncStorage.getItem("SportsArray")
        console.log("storedData",storedData)
        if(storedData){
            JSON.parse(storedData)
            setImages(JSON.parse(storedData))
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

    const sort = (alphabet)=>{
       const {exercise} = require("../../utils/exercise.js");
    }

    const onPress = async(item) =>{
        const date=await AsyncStorage.getItem("homeDate")
        console.log(item)
        props.navigation.navigate("ActivityDetailsScreen",{
            activity : {
                workOutId : item.id,
                classification : 1
            },
            date:date
        })
    }

    const handleMessage = (msg)=>{
        console.log("msg",JSON.parse(msg.nativeEvent.data))
        const sortedData = JSON.parse(msg.nativeEvent.data)
        AsyncStorage.setItem("SportsArray" , JSON.stringify(sortedData))
        setImages(sortedData)
    }

    const setImages=(sortedData)=>{
        const {exercise} = require("../../utils/exercise.js");
        const d = sortedData.map(cat=>({
            title : cat.title,
            data : cat.data.map(item=>({...item , iconUri : exercise[item.index].iconUri}))
        }))
        const data = d.filter(item=>item.data.length > 0)
        console.log("d",d)
        console.log("sortedData",sortedData)
        console.log("exercise",exercise)
        console.log("data",data)
        setArrayData(data)
        originData =  [...data]
        setReneder(true)
    }

    console.log("arrayData",arrayData)
    console.log("renderList",renderList)
    if(renderList){
        if(arrayData.length > 0){
            return (
                <>
                 <SectionList
                     sections={arrayData}
                     extraData={arrayData}
                     keyExtractor={(item, index) => index.toString()}
                     showsVerticalScrollIndicator={false}
                     renderItem={({ item }) => {
                         return(
                             <SportRow
                                 lang={lang}
                                 title={item.name}
                                 logo={item.iconUri}
                                 onPress={()=>onPress(item)}
                             />
                         )
                     }}
                     renderSectionHeader={({ section: { title , data}})  => {
                        
                         return(
                            <SportRowHeader
                                lang={lang}
                                title={title}
                                style={{borderTopWidth : arrayData[0].title === title ? 0 : 1}}
                                onPress={()=>false}
                            />
                     )}}
                 />
                    
                </>
            );
        }
        return (
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
};


export default SportsTab;
