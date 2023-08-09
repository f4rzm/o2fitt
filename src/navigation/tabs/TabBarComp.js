import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
export default function TabBarComp({ state, descriptors, navigation, position, lang }) {

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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
          
              <Animated.Text style={{ color: "black", fontFamily: lang.font, transform: [{ scale: scale }], color: defaultTheme.darkText, marginHorizontal: moderateScale(10) }}>
                {label}
              </Animated.Text>
              <Animated.Text style={{ position: "absolute", opacity: opacity, color: "black", fontFamily: lang.font, transform: [{ scale: scale }], color: defaultTheme.primaryColor, marginHorizontal: moderateScale(10) }}>
                {label}
              </Animated.Text>
              <View style={{ alignItems: "flex-end",marginHorizontal:moderateScale(10) }}>
                {
                  options.tabBarIcon &&
                  <Animated.Image
                    source={options.tabBarIcon}
                    style={{ tintColor: defaultTheme.mainText, width: moderateScale(19), height: moderateScale(19), transform: [{ scale: scale }], resizeMode: "contain", position: "absolute" }}
                  />
                }
                {
                  options.tabBarIcon &&
                  <Animated.Image
                    source={options.tabBarIcon}
                    style={{ tintColor: defaultTheme.primaryColor, width: moderateScale(19), height: moderateScale(19), transform: [{ scale: scale }], resizeMode: "contain", opacity: opacity }}
                  />
                }
              </View>
            </View>
            <Animated.View
              style={{ width: moderateScale(100), height: moderateScale(2), backgroundColor: defaultTheme.primaryColor, opacity, marginTop: moderateScale(6) }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  textAnimation: {
    color: "black",
    color: defaultTheme.darkText,
    marginHorizontal: moderateScale(10)
  }
})