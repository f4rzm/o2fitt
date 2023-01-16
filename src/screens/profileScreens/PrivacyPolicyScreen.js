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

const PrivacyPolicyScreen = props => {

  const lang = useSelector(state=>state.lang)

  const data = React.useRef([
    lang.privacytitle,
    lang.privacytitleDesc,
    lang.privacydestitle1,
    lang.privacydestitle1des,
    lang.privacydestitle2 ,
    lang.privacydestitle2des,
    lang.privacydestitle3 ,
    lang.privacydestitle3des,
    lang.privacydestitle4 ,
    lang.privacydestitle4des,
    lang.privacydestitle5 ,
    lang.privacydestitle5des,
    lang.privacydestitle6 ,
    lang.privacydestitle6des,
    lang.privacydestitle7 ,
    lang.privacydestitle7des,
    lang.privacydestitle8 ,
    lang.privacydestitle8des,
    lang.privacydestitle9 ,
    lang.privacydestitle9des,
  ]).current

  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.privacy}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{alignItems : "center"}} showsVerticalScrollIndicator={false}>
            {
              data.map((item,index)=>{
                if(index%2===0)
                return (
                  <Text 
                    style={[styles.header,{fontFamily : lang.titleFont}]}
                    key={index.toString()}
                  >
                    {
                      item
                    }
                  </Text>
                )
                return (
                  <Text 
                    style={[styles.context,{fontFamily : lang.font}]}
                    key={index.toString()}
                  >
                    {
                      item
                    }
                  </Text>
                )
              })
            }
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
  header : {
    width : dimensions.WINDOW_WIDTH * 0.9,
    fontSize : moderateScale(18),
    lineHeight : moderateScale(27),
    textAlign : "left",
    color : defaultTheme.darkText,
    marginVertical : moderateScale(16)
  },
  context : {
    width : dimensions.WINDOW_WIDTH * 0.88,
    fontSize : moderateScale(16),
    lineHeight : moderateScale(27),
    textAlign : "left",
    color : defaultTheme.gray,
    marginBottom : moderateScale(25)
  },

});

export default PrivacyPolicyScreen;
