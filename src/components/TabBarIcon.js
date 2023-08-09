import { lang } from "moment";
import React , {memo} from "react"
import {View , Text , TouchableOpacity , StyleSheet, ActivityIndicator , Image} from "react-native"
import { moderateScale } from "react-native-size-matters";
import { defaultTheme } from "../constants/theme";

const TabBarIcon = ({ state, descriptors, navigation , route , index , image , name , font,svg}) => {
  
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
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.container}
        >
            {
              image?
              <Image
                source={image}
                style={[
                    styles.image,
                    {tintColor : isFocused?defaultTheme.primaryColor:defaultTheme.lightGray2}
                ]}
                resizeMode="contain"
            />:
            svg
            }
            <Text style={{ color: isFocused?defaultTheme.primaryColor:defaultTheme.lightGray2 , fontFamily : font}} allowFontScaling={false}>
                {
                  name
                }
            </Text>
        </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
      container:{
        flex : 1,
        justifyContent : "space-around",
        alignItems : "center",
        height : "100%",
      },
      image : {
          width : moderateScale(23),
          height : moderateScale(20)
      }
  })
  export default TabBarIcon