
import React from 'react';
import {
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PremiumAccount, TwoOptionModal, SearchFoodRow , SearchNoResult , RowWrapper , ConfirmButton} from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import moment from "moment"
import { moderateScale } from 'react-native-size-matters';
import PouchDB from '../../../pouchdb'
import LottieView from 'lottie-react-native';
import { dimensions } from '../../constants/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const searchHistoryDB = new PouchDB('searchHistory', { adapter: 'react-native-sqlite' })

const SearchMarketTab = props => {
    const lang = useSelector(state=>state.lang)
    const profile = useSelector(state=>state.profile) 
    const app = useSelector(state=>state.app) 
    const [showPremium , setShowPremium] = React.useState(false)
    const [optionalDialogVisible ,setOptionalDialogVisible] = React.useState(false)
    const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
    const today=moment()
    const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
    
    const meal = React.useRef({
        foodId: 0,
        foodMeal : props.mealId
    }).current

    React.useEffect(()=>{
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus' , ()=>{
            backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{props.navigation.navigate("SearchMainTab"); return true})
            props.setFoodType(3)
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

    const onFoodPressed = async(food)=>{
        const date = await AsyncStorage.getItem("homeDate")
        props.navigation.navigate("FoodDetailScreen" , {meal : {...meal , foodId : food.foodId , foodName : food.name} , food : {...food,foodName : food.name} , date : date})
        searchHistoryDB.put({...food,_id:food.foodId.toString()})
    }

    const goToPackages = ()=>{
        setOptionalDialogVisible(false)
        setTimeout(()=>{
            props.navigation.navigate("PackagesScreen")
        },Platform.OS === "ios"?500:50)
    }
    const filterdData = props.searchResult.filter(item=>item.foodType == 3)
    return (
        <>
            {
                props.isSearchOnline && 
                <RowWrapper style={{alignSelf : "center" , marginVertical : moderateScale(25)}}>
                    <ActivityIndicator
                        size="large"
                        color={defaultTheme.green}
                        style={{marginHorizontal : moderateScale(16)}}
                    />
                    <Text style={[{fontFamily : lang.font}]} allowFontScaling={false}>
                        {
                            lang.onlineSearch
                        }
                    </Text>
                </RowWrapper>
            }
            <ScrollView keyboardShouldPersistTaps="handled">
                
                {
                    filterdData.length > 0 ?
                    filterdData.map(f=>(

                        <SearchFoodRow
                            lang={lang}
                            item={{...f,foodMeal : props.mealId}}
                            key={f.foodId.toString()}
                            onPress={onFoodPressed}
                        />
                    )):
                    (props.searchText != "" || filterdData.length > 0 || props.isSearch || props.isSearchOnline)?
                    null:
                    <>
                        <LottieView 
                            style={{
                                width : dimensions.WINDOW_WIDTH * 0.53,
                                marginVertical : moderateScale(25),
                                alignSelf : "center",
                            }}
                            source={require('../../../res/animations/barcode_search.json')} 
                            autoPlay 
                            loop={false}
                        />
                        <Text style={[styles.text , {fontFamily : lang.font}]}>
                            {lang.writeYourFood2}
                        </Text>
                    </>
                }
                
                {
                    (props.searchText != "" && !props.isLastData && filterdData.length > 0 && !props.isSearch && (!props.isSearchOnline && app.networkConnectivity)) &&
                    <ConfirmButton
                        lang={lang}
                        style={styles.moreBtn}
                        title={lang.moreView}
                        onPress={props.moreResult}
                    />
                }
                
                {
                    (props.searchText != "" && filterdData.length === 0 && !props.isSearch && !props.isSearchOnline) &&
                    <SearchNoResult lang={lang}/>
                }
            </ScrollView>
            
            <PremiumAccount
                visible={showPremium}
                onRequestClose={()=>setShowPremium(false)}
                lang={lang}
            />
            <TwoOptionModal
                lang={lang}
                visible={optionalDialogVisible}
                onRequestClose={()=>setOptionalDialogVisible(false)}
                context={lang.subscribe1}
                button1={lang.iBuy}
                button2={lang.motevajeShodam}
                button1Pressed={goToPackages}
                button2Pressed={()=>setOptionalDialogVisible(false)}
            />
            <TouchableOpacity 
                style={styles.barcode}
                onPress={()=>props.navigation.navigate("BarcodeScreen" , {foodMeal : props.mealId})}
            > 
                <LottieView 
                    style={{
                        width : moderateScale(65),
                        height : moderateScale(65),
                        alignSelf : "center",
                    }}
                    source={require('../../../res/animations/barcode.json')} 
                    autoPlay 
                    loop={false}
                />
            </TouchableOpacity>
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
  barcode : {
      position : "absolute",
      bottom : "5%",
      right : "5%",
      zIndex : 1,
      justifyContent :"center",
      alignItems : "center"
  },
  text : {
      marginTop : moderateScale(25),
      fontSize : moderateScale(13),
      textAlign : "center",
      color : defaultTheme.gray,
      marginHorizontal : "12%",
      lineHeight : moderateScale(25)
  },
  moreBtn : {
      width : moderateScale(130),
      height : moderateScale(37),
      backgroundColor : defaultTheme.green,
      margin : moderateScale(25),
      marginHorizontal : moderateScale(20),
      alignSelf : "center"
  },
});

export default SearchMarketTab;
