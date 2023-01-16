import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import {BodyHelpRow, BodyInput, ConfirmButton} from '../../components';
import { moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Body from "../../../res/img/help_body.svg"


const BodyHelpScreen = props => {

  const lang = useSelector(state=>state.lang)
  const user = useSelector(state=>state.user)

  return (
        <LinearGradient
            style={styles.mainContainer}
            colors={[defaultTheme.primaryColor , defaultTheme.lightBackground]}
            start={{x:0,y:0}}
            end={{x:0,y:0.08}}
        > 
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfGardan}
                            number={1}
                            desc={lang.sizeOfGardanDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfShane}
                            number={2}
                            desc={lang.sizeOfShaneDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfSine}
                            number={3}
                            desc={lang.sizeOfSineDescription}
                        />
                        
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfBazoo}
                            number={4}
                            desc={lang.sizeOfBazooDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfKamar}
                            number={5}
                            desc={lang.sizeOfKamarDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfShekam}
                            number={6}
                            desc={lang.sizeOfShekamDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfBasan}
                            number={7}
                            desc={lang.sizeOfBasanDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfRan}
                            number={8}
                            desc={lang.sizeOfRanDescription}
                        />
                        <BodyHelpRow
                            lang={lang}
                            title={lang.sizeOfMoche}
                            number={9}
                            desc={lang.sizeOfMocheDescription}
                        />
                    </ScrollView>
                </View>
                <View style={[styles.subContainer , {paddingTop : moderateScale(30)}]}>
                    <Body
                        width={dimensions.WINDOW_WIDTH*0.49}
                    />
                </View>
            </View>
            <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.motevajeShodam}
                onPress={()=>props.navigation.goBack()}
                leftImage={require("../../../res/img/back.png")}
                rotate
            />
        </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  container : {
      flex : 1,
      flexDirection :"row",
      marginTop : dimensions.WINDOW_HEIGTH * 0.05,
  },
  subContainer : {
    flex : 1,
    alignItems : "center",
  },
  text : {
    width : dimensions.WINDOW_WIDTH * .85,
    fontSize : moderateScale(12),
    color:defaultTheme.gray
},
button : {
    width : dimensions.WINDOW_WIDTH * 0.8,
    height : moderateScale(35),
    backgroundColor : defaultTheme.green,
    alignSelf : "center",
    marginBottom : moderateScale(16)
}
});

export default BodyHelpScreen;
