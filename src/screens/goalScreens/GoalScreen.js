import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { MainToolbar } from '../../components';
import { GoalTabs } from '../../navigation/tabs/GoalTabs';



const GoalScreen = props => {
  const onRecipePresse = () => {
    props.navigation.navigate("RecipeCatScreen")
  }

  const lang = useSelector(state => state.lang)
  const app = useSelector(state => state.app)
  const diet = useSelector(state => state.diet)
  const user = useSelector(state => state.user)
  return (
    <>
      <MainToolbar
        onMessagePressed={() => props.navigation.navigate("MessagesScreen")}
        unreadNum={app.unreadMessages}
        // showRecipe={user.countryId == 128 ? true : false}
        onRecipePresse={onRecipePresse}
      />
      <GoalTabs
        lang={lang}
        diet={diet}
      />
    </>
  );
};


export default GoalScreen;
