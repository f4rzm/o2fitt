import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import {DoubleInput, RowCenter, FoodToolbar , RowWrapper , RowSpaceBetween, ConfirmButton , DropDown, CustomInput} from '../../components';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-gesture-handler';



const PersonalActivityDetailsScreen = props => {

  const lang = useSelector(state=>state.lang)
  const [isFavorite , setFavorite] = React.useState(false)

  const onConfirm =()=>{
    props.navigation.goBack()
  }

  return (
      <>
        <FoodToolbar
            lang={lang}
            title={lang.buy_account_15}
            onConfirm={onConfirm}
            onBack={()=>props.navigation.goBack()}
            text={lang.saved}
        />
        <ScrollView >        
          <RowSpaceBetween
              style={styles.rowStyle}
          >
             <CustomInput
                lang={lang}
                style={styles.input}
                placeholder={lang.writeNameSport}
             />
          </RowSpaceBetween>
          <RowSpaceBetween
              style={styles.rowStyle}
          >
              <Text style={[styles.text1,{fontFamily : lang.font}]} allowFontScaling={false}>
                  {
                      lang.coloriesNumber
                  }
              </Text>
              <RowWrapper style={{marginVertical : 0 , paddingVertical : 0}}>
                <CustomInput
                    lang={lang}
                    style={styles.input2}
                    textStyle={{height : moderateScale(35) , fontSize : moderateScale(12)}}
                />
                <Text style={[styles.text1,{fontFamily : lang.font}]} allowFontScaling={false}>
                    {
                      lang.calories
                    }
                </Text>
              </RowWrapper>
          </RowSpaceBetween>
          <RowSpaceBetween
              style={styles.rowStyle}
          >
              <Text style={[styles.text1,{fontFamily : lang.font}]} allowFontScaling={false}>
                  {
                      lang.inTime
                  }
              </Text>
              <RowWrapper style={{marginVertical : 0 , paddingVertical : 0}}>
                <DropDown
                    lang={lang}
                />
                <Text style={[styles.text1,{fontFamily : lang.font}]} allowFontScaling={false}>
                    {
                      lang.min
                    }
                </Text>
              </RowWrapper>
          </RowSpaceBetween>
        </ScrollView>
        <View style={styles.buttonContainer}>
            <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.saved}
                leftImage={require("../../../res/img/done.png")}
                onPress={onConfirm}
            />
        </View>
      </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor: defaultTheme.error,
  },
  input : {
      borderWidth : 0,
      height : moderateScale(35),
      marginVertical : moderateScale(3),
      paddingStart : 5,
      borderRadius : moderateScale(10)
  },
  input2 : {
      borderWidth : 1,
      width : moderateScale(85),
      height : moderateScale(35),
      minHeight : moderateScale(30),
      marginVertical : moderateScale(3),
      marginHorizontal : moderateScale(15),
      borderRadius : moderateScale(10)
  },
  rowStyle:{
    borderBottomWidth : 1.2,
    padding : moderateScale(8),
    paddingStart : moderateScale(18),
    marginVertical : 0
  },
  mediaContainer : {
    width : "100%",
    height : dimensions.WINDOW_HEIGTH * 0.25,
    backgroundColor : "gold"
  },
  timeContainer  :{
      width : dimensions.WINDOW_WIDTH,
      backgroundColor : defaultTheme.grayBackground,
      padding : moderateScale(16),
      alignItems : "flex-start"
  },
  text1 : {
      fontSize: moderateScale(14),
      color : defaultTheme.gray,
  },
  text2 : {
      width : "100%",
      fontSize: moderateScale(40),
      color : defaultTheme.error,
      textAlign : "center"
  },
  text3 : {
      width : "100%",
      fontSize: moderateScale(20),
      color : defaultTheme.gray,
      textAlign : "center"
  },
  buttonContainer : {
    position : "absolute",
    bottom : "2%",
    left : (dimensions.WINDOW_WIDTH * 0.2) 
  },
  button : {
      width : dimensions.WINDOW_WIDTH * 0.6,
      height : moderateScale(35),
      backgroundColor : defaultTheme.green,
  },
});

export default PersonalActivityDetailsScreen;
