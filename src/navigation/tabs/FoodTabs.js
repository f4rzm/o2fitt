import React from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  SearchRestaurantTab , 
  SearchMainTab , 
  SearchFavoritesTab,
  SearchCookingTab,
  SearchMarketTab,
} from "../../screens"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import {Image, Platform} from "react-native"
import moment from "moment"
import { dimensions } from "../../constants/Dimensions";


const Tab = createMaterialTopTabNavigator();

const FoodTabs = (props) => {
  const pkExpireDate=moment(props.profile.pkExpireDate , "YYYY-MM-DDTHH:mm:ss")
  const today=moment()
  const hasCredit=pkExpireDate.diff(today , "seconds") > 0?true : false
  const lang = props.lang
  return (
      <Tab.Navigator  
        sceneContainerStyle={{backgroundColor : null}}
        tabBarOptions={{
          scrollEnabled:true,
          activeTintColor : defaultTheme.primaryColor,
          inactiveTintColor : defaultTheme.mainText,
          labelStyle: { fontSize: lang.langName === "persian"?moderateScale(14):moderateScale(11) , fontFamily : lang.font , top : Platform.OS === "ios" ? moderateScale(5) : moderateScale(-3)} ,
          indicatorStyle : {backgroundColor : defaultTheme.primaryColor , height : moderateScale(1.5),alignSelf:"baseline"},
          style: { backgroundColor: defaultTheme.lightBackground , justifyContent : "center" ,height : moderateScale(42),elevation : 0 , borderBottomWidth : 1 , borderColor : defaultTheme.border,alignItems:"center",width:dimensions.WINDOW_WIDTH},
          showIcon: !hasCredit,
          tabStyle : {flexDirection : "row" , alignItems : "center" , justifyContent:"center" , height : moderateScale(42) , width : dimensions.WINDOW_WIDTH*0.33333},
          
        }}
        lazy={true}
      >
        <Tab.Screen 
          name="SearchMainTab"
          children={(nestedProps)=><SearchMainTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps}/>} 
          options={{ 
            tabBarLabel: lang.searchResult 
          }}
        />
        <Tab.Screen 
          name="SearchFavoritesTab"
          children={(nestedProps)=><SearchFavoritesTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps}/>} 
          options={{ 
            tabBarLabel: lang.myFavorit ,
          }}
        />
        <Tab.Screen 
          name="SearchCookingTab"  
          children={(nestedProps)=><SearchCookingTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps}/>} 
          options={{ 
            tabBarLabel: lang.myCoocking ,
            tabBarIcon:({tintColor , focused}) =>(
              <Image
                  source={focused?require("../../../res/img/lock.png") : require("../../../res/img/lock.png")}
                  style={{width : moderateScale(15) , height : moderateScale(18)}}
                  tintColor={tintColor}
                  resizeMode="contain"
              />
            )
          }}          
        />
        {/* <Tab.Screen 
          name="SearchMarketTab" 
          children={(nestedProps)=><SearchMarketTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps}/>} 
          options={{ 
            tabBarLabel: lang.market 
          }}
        /> */}
        {/* <Tab.Screen 
          name="SearchRestaurantTab"  
          children={(nestedProps)=><SearchRestaurantTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps}/>} 
          options={{ 
            tabBarLabel: lang.restaurant ,
            tabBarIcon:({tintColor , focused}) =>(
              <Image
                  source={focused?require("../../../res/img/lock.png") : require("../../../res/img/lock.png")}
                  style={{width : moderateScale(15) , height : moderateScale(18)}}
                  tintColor={tintColor}
                  resizeMode="contain"
              />
            )
          }}
        /> */}
      </Tab.Navigator>
  );
}

export {FoodTabs}
