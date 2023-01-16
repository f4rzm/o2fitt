import React from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  Text,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TwoOptionModal, SearchFoodRow , SearchNoResult , RowWrapper} from '../../components';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import moment from "moment"
import { moderateScale } from 'react-native-size-matters';

const item = {
    "foodId": 19,
    "name": "string1",
    "imageUri": null,
    "imageThumb": null,
}

const SearchRestaurantTab = props => {
    const lang = useSelector(state=>state.lang)
    const profile = useSelector(state=>state.profile) 
    const [optionalDialogVisible ,setOptionalDialogVisible] = React.useState(false)
    const pkExpireDate=moment(profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
    const today=moment()
    const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false

    React.useEffect(()=>{
        let backHandler = null
        const focusUnsubscribe = props.navigation.addListener('focus' , ()=>{
          backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{props.navigation.navigate("SearchMainTab"); return true})
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
    
    const meal = React.useRef({
        foodId: 0,
        foodMeal : props.mealId
    }).current

    const onFoodPressed = (food)=>{ 
        if(hasCredit){
            props.navigation.navigate("FoodDetailScreen" , {meal : {...meal , foodId : food.foodId , foodName : food.name} , food : {...food,foodName : food.name}})
        }
        else{
            goToPackages()
        }
    }

    const goToPackages = ()=>{
        setTimeout(()=>{
            props.navigation.navigate("PackagesScreen")
        },Platform.OS === "ios"?500:50)
    }

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
                    props.searchResult.filter(item=>item.foodType == 2).map(f=>(

                        <SearchFoodRow
                            lang={lang}
                            item={{...f,foodMeal : props.mealId}}
                            key={f.foodId.toString()}
                            onPress={onFoodPressed}
                        />
                    ))
                }
                {
                    (props.searchText != "" && props.searchResult.length === 0 && !props.isSearch ) &&
                    <SearchNoResult lang={lang}/>
                }   
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
            </ScrollView>
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
  text : {
      textAlign : "center",
      marginTop : "15%",
      fontSize : moderateScale(16)
  }
});

export default SearchRestaurantTab;
