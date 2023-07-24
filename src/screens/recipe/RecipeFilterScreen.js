import { Alert, Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import MainToolbarWithTopCurve from '../../components/ScreentTemplate/MainToolbarWithTopCurve'
import ToolbarWithCurve from '../../components/ScreentTemplate/ToolBarWithTopCurve'
import { RowCenter, ToolBarWithTopCurve } from '../../components'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { defaultTheme } from '../../constants/theme'
import RecipeFilterRow from '../../components/Recipe/SliderFilterRow'
import SliderFilterRow from '../../components/Recipe/SliderFilterRow'
import FilterItemsRow from '../../components/FilterItemsRow'
import { bakingType } from '../../utils/bakingType'

const RecipeFilterScreen = () => {
  const lang = useSelector((state) => state.lang);
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const app = useSelector((state) => state.app);
  const profile = useSelector((state) => state.profile);
  const recipes = require('../../utils/recipe/recipe.json')
  const sheetRef = useRef();
  const [recipeFilter, setRecipeFilter] = useState({
    calorie: [0, 700],
    bakingTime: [0, 1000],
    bakingType: [5, 6],
    category:[]
  })


  const modal = useRef(new Animated.Value(0)).current
  const translateYModal = modal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -dimensions.WINDOW_HEIGTH]
  })

  // variables
  const data = useMemo(
    () =>
      Array(100)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const snapPoints = useMemo(() => ["50%", "80%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const onPressBakingType = (item) => {
    if (recipeFilter.bakingType.includes(item.bakingType)) {
      let bakingCopy = recipeFilter.bakingType
      let filter = bakingCopy.filter(el => el !== item.bakingType)

      setRecipeFilter({ ...recipeFilter, bakingType: filter })
    } else {
      setRecipeFilter({ ...recipeFilter, bakingType: [...recipeFilter.bakingType, item.bakingType] })
    }
  }
  const onPressCategoryType = (item) => {
    if (recipeFilter.category.includes(item.id)) {
      let categoryCopy = recipeFilter.category
      let filter = categoryCopy.filter(el => el !== item.id)

      setRecipeFilter({ ...recipeFilter, category: filter })
    } else {
      setRecipeFilter({ ...recipeFilter, category: [...recipeFilter.category, item.id] })
    }
  }
  const recipeCategory = [
    { id: 1, persian: "غذای اصلی" },
    { id: 2, persian: "پیش غذا" },
    { id: 3, persian: "دسر" },
    { id: 4, persian: "نوشیدنی" },
    { id: 6, persian: "گیاه خواری" },
    { id: 9, persian: "کتو" },
    { id: 7, persian: "شیرینی" },
  ]
  return (
    <>
      <ToolBarWithTopCurve
        lang={lang}
        title={'فیلتر دستور پخت'}
      >
        <Button onPress={handleSnapPress} title='ascb' />
      </ToolBarWithTopCurve>
      {/* <Animated.View style={[styles.bottomModal, { transform: [{ translateY: translateYModal }] }]}>
                <Text>ashpciuabicaubp</Text>
                <Text>ashpciuabicaubp</Text>
                <Text>ashpciuabicaubp</Text>
               
            </Animated.View> */}
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backgroundStyle={{ backgroundColor: defaultTheme.dialogGray }}
      >
        <BottomSheetScrollView>
          <SliderFilterRow
            header={lang.calories}
            lang={lang}
            minVal={0}
            maxVal={700}
            onValueChange={useCallback((val) => {
              setRecipeFilter({ ...recipeFilter, calorie: val })
            }, [recipeFilter])}
            valueType={lang.calories}
            selectedValue={recipeFilter.calorie}
          />
          <SliderFilterRow
            header={lang.timeCoocking}
            lang={lang}
            minVal={0}
            maxVal={360}
            onValueChange={useCallback((val) => {
              setRecipeFilter({ ...recipeFilter, bakingTime: val })
            }, [recipeFilter])}
            valueType={"دقیقه"}
            selectedValue={recipeFilter.bakingTime}
          />
          <Text style={[styles.header, { fontFamily: lang.font }]}>{lang.bakingType}</Text>
          <View style={styles.bakingTypeContainer}>
            {
              bakingType.map((item, index) => {
                return <FilterItemsRow
                  isSelected={recipeFilter.bakingType.indexOf(item.bakingType) == -1 ? false : true}
                  item={item}
                  lang={lang}
                  onPressItem={onPressBakingType}
                />
              })
            }
          </View>
          <Text style={[styles.header, { fontFamily: lang.font }]}>دسته بندی غذایی</Text>
          <View style={styles.bakingTypeContainer}>
            {
              recipeCategory.map((item, index) => {
                return <FilterItemsRow
                  isSelected={recipeFilter.category.indexOf(item.id) == -1 ? false : true}
                  item={item}
                  lang={lang}
                  onPressItem={onPressCategoryType}
                />
              })
            }
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}

export default RecipeFilterScreen

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "red",
  },
  filterContent: {
    alignItems: "center"
  },
  bottomModal: {
    position: "absolute",
    bottom: 0,
    width: dimensions.WINDOW_WIDTH,
    maxHeight: moderateScale(100),
    backgroundColor: "red"
  },
  bakingTypeContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  header: {
    fontSize: moderateScale(18),
    paddingHorizontal: moderateScale(10),
    textAlign: "left",
    marginVertical: moderateScale(25)
  }
})