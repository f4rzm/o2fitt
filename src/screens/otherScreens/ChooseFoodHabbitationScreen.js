
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager
} from 'react-native';
import { ConfirmButton, HabitationRow } from '../../components';
import { useSelector, useDispatch } from 'react-redux'
import { updateProfileLocaly } from "../../redux/actions"
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from "react-native-size-matters"
import analytics from '@react-native-firebase/analytics';

const ChooseFoodHabbitationScreen = props => {

  const lang = useSelector(state => state.lang)
  const profile = useSelector(state => state.profile)
  console.log("profile =>", profile)
  const [activeIndex, setActive] = React.useState(0)
  const dispatch = useDispatch()

  const onPress = (index) => {
    console.warn(index)
    setActive(index)
    onNext(index)
  }
  // const foodHabits = [
  //   { id: 0, name: lang.adi, image: require("../../../res/img/chicken.png") },
  //   { id: 1, name: lang.giah, image: require("../../../res/img/ordinary.png") },
  //   { id: 2, name: lang.kham, image: require("../../../res/img/vegan.png") },
  //   { id: 3, name: lang.pakGiahKhar, image: require("../../../res/img/vegan.png") },
  // ]

  const onNext = (id) => {
    console.warn(id)
    analytics().logEvent('foodHabitation', {
      id: activeIndex
    })
    dispatch(updateProfileLocaly({ foodHabit: id }))
    props.navigation.navigate("ChooseGenderScreen")
  }

  return (
    <View
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: lang.titleFont }]} allowFontScaling={false}>
          {lang.yourFoodHabbiteation}
        </Text>
      </View>
      <View style={styles.content}>

        {/* {
            foodHabits.map((item)=>{
             return <HabitationRow
              title={item.name}
              image={item.image}
              lang={lang}
              index={item.id}
              isSelected={activeIndex===item.id}
              onPress={()=>onPress(item.id)}
              />
            })
          } */}
        <HabitationRow
          title={lang.adi}
          image={require("../../../res/img/chicken.png")}
          lang={lang}
          index={0}
          isSelected={activeIndex === 0}
          onPress={onNext}
        />
        <HabitationRow
          title={lang.giah}
          image={require("../../../res/img/ordinary.png")}
          lang={lang}
          index={1}
          isSelected={activeIndex === 1}
          onPress={onNext}
        />
        <HabitationRow
          title={lang.kham}
          image={require("../../../res/img/vegan.png")}
          lang={lang}
          index={2}
          isSelected={activeIndex === 2}
          onPress={onNext}
        />
        <HabitationRow
          title={lang.pakGiahKhar}
          image={require("../../../res/img/vegan.png")}
          lang={lang}
          index={3}
          isSelected={activeIndex === 3}
          onPress={onNext}
        />
      </View>
      <View style={styles.bottomContainer}>
        <ConfirmButton
          title={lang.continuation}
          style={{ width: dimensions.WINDOW_WIDTH * 0.35, borderRadius: 20 }}
          lang={lang}
          onPress={() => onNext(activeIndex)}
          rightImage={require("../../../res/img/next.png")}
          rotate
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(40),
    marginBottom: moderateScale(30),
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  bottomContainer: {
    width: dimensions.WINDOW_WIDTH,
    marginTop: moderateScale(30),
    marginBottom: moderateScale(40),
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: defaultTheme.darkText,
    fontSize: moderateScale(19),
    alignSelf: "center",
    textAlign: "center",
    width: "85%"
  }
});

export default ChooseFoodHabbitationScreen;
