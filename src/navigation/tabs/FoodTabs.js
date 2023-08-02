import React from "react"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  SearchRestaurantTab,
  SearchMainTab,
  SearchFavoritesTab,
  SearchCookingTab,
  SearchMarketTab,
} from "../../screens"
import { defaultTheme } from "../../constants/theme";
import { moderateScale } from "react-native-size-matters";
import { Animated, Image, Platform, TouchableOpacity, View } from "react-native"
import moment from "moment"
import { dimensions } from "../../constants/Dimensions";
import TabBarComp from "./TabBarComp";


const Tab = createMaterialTopTabNavigator();


const FoodTabs = (props) => {
  const pkExpireDate = moment(props.profile.pkExpireDate, "YYYY-MM-DDTHH:mm:ss")
  const today = moment()
  const hasCredit = pkExpireDate.diff(today, "seconds") > 0 ? true : false
  const lang = props.lang

  function MyTabBar({ state, descriptors, navigation, position }) {
    return (
      <View style={{ flexDirection: 'row-reverse' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });
          const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1.2 : 1)),
          });
  
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, borderBottomColor: defaultTheme.primaryColor, borderBottomWidth: opacity == 1 ? 1 : 0, paddingVertical: moderateScale(10), alignItems: "center" }}
            >
              <Animated.Text style={{ color: "black" ,fontFamily:lang.font,transform:[{scale:scale}],color:isFocused?defaultTheme.primaryColor:defaultTheme.mainText}}>
                {label}
              </Animated.Text>
              <Animated.View
                style={{ width: moderateScale(100), height: moderateScale(2), backgroundColor: defaultTheme.primaryColor, opacity,marginTop:moderateScale(4) }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: null }}
      screenOptions={{
 

      }}
      tabBar={props => <TabBarComp {...props} lang={lang} />}
      lazy={true}
      initialRouteName="SearchMainTab"
    >
      <Tab.Screen
        name="SearchCookingTab"
        children={(nestedProps) => <SearchCookingTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps} />}
        options={{
          tabBarLabel: lang.myCoocking,
          // tabBarIcon: ({ tintColor, focused }) => (
          //   <Image
          //   source={focused ? require("../../../res/img/lock.png") : require("../../../res/img/lock.png")}
          //   style={{ width: moderateScale(15), height: moderateScale(18) }}
          //   tintColor={tintColor}
          //   resizeMode="contain"
          //   />
          //   )
          }}
      />
          <Tab.Screen
            name="SearchFavoritesTab"
            children={(nestedProps) => <SearchFavoritesTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps} />}
            options={{
              tabBarLabel: lang.myFavorit,
            }}
          />
          <Tab.Screen
            name="SearchMainTab"
            children={(nestedProps) => <SearchMainTab mealId={props.mealId} isSearchOnline={props.isSearchOnline} isSearch={props.isSearch} searchText={props.searchText} isLastData={props.isLastData} moreResult={props.moreResult} searchResult={props.searchResult} setFoodType={props.setFoodType} {...nestedProps} />}
            options={{
              tabBarLabel: lang.searchResult
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

export { FoodTabs }
