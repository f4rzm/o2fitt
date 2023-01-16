import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import { Toolbar } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';

const GuideScreen = props => {

  const lang = useSelector(state=>state.lang)

  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.guide}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{alignItems : "center"}} showsVerticalScrollIndicator={false}>
            <Text style={[styles.text , {fontFamily : lang.font , margin : moderateScale (16)}]} allowFontScaling={false}>
                {
                    lang.privateText
                }
            </Text>
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  text : {
    width : dimensions.WINDOW_WIDTH * 0.9,
    fontSize : moderateScale(13),
    lineHeight : moderateScale(26),
    textAlign : "auto",
    color : defaultTheme.gray
  },
});

export default GuideScreen;
