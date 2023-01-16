import React from 'react';
import {
  StyleSheet,
  Share,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RowWrapper, ConfirmButton , Toolbar, RowCenter} from '../../components';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import { firebase } from '@react-native-firebase/analytics';

const InviteScreen = props => {
    const lang = useSelector(state=>state.lang)
    const user = useSelector(state=>state.user)
    console.log("user" , user)

    const shareCode = async()=>{
        
        firebase.analytics().logShare({item_id : "referralCode" , content_type : "referralCode" , method : "referralCode"})
        await Share.share({
            message : lang.sendCodeViaShare_ + "\n" + user.referreralCode + "\n\n" + lang.sendCodeViaShare_2
        })
    }
    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.shareForFriends}
                onBack={()=>props.navigation.goBack()}
            />
            <ScrollView contentContainerStyle={{alignItems : "center"}}>  
                <LottieView 
                    style={{width : "50%"}}
                    source={require('../../../res/animations/invite.json')} 
                    autoPlay 
                    loop={false}
                />
                <Text style={[styles.title , {fontFamily : lang.titleFont}]} allowFontScaling={false}>
                    {
                        lang.InviteTextTitle
                    }
                </Text>
                <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                    {
                        lang.InviteFriendsText
                    }
                </Text>

                <RowWrapper>
                    <TouchableOpacity
                        style={styles.imgContainer}
                        onPress={shareCode}
                    >
                        <Image
                            source={require("../../../res/img/share.png")}
                            style={styles.share}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={shareCode}
                    >
                        <RowCenter style={styles.container}>
                            <Text style={[styles.text2 , {fontFamily : lang.font}]} allowFontScaling={false}>
                                {lang.riferCode2}
                            </Text>
                            <Text style={[styles.text3 , {fontFamily : lang.titleFont}]} allowFontScaling={false}>
                            {user.referreralCode}
                            </Text>
                        </RowCenter>
                    </TouchableOpacity>
                </RowWrapper>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
 
  img : {
    width : dimensions.WINDOW_WIDTH * 0.5,
    height : dimensions.WINDOW_WIDTH * 0.5,
  },
  title : {
      width : dimensions.WINDOW_WIDTH * 0.8,
      margin : moderateScale(20),
      marginTop : moderateScale(35),
      fontSize : moderateScale(16),
      color : defaultTheme.darkText,
      lineHeight : moderateScale(24),
      textAlign : "center"
  }, 
  text : {
      width : dimensions.WINDOW_WIDTH * 0.8,
      margin : moderateScale(20),
      marginTop : moderateScale(10),
      fontSize : moderateScale(15),
      color : defaultTheme.lightGray2,
      lineHeight : moderateScale(24),
      textAlign : "center"
  }, 
  text2 : {
    fontSize : moderateScale(17),
    color : defaultTheme.darkText,
    marginHorizontal : moderateScale(16)
  }, 
  text3 : {
    fontSize : moderateScale(20),
    color : defaultTheme.darkText,
    marginHorizontal : moderateScale(16)
  }, 
  imgContainer : {
        width : moderateScale(50),
        height : moderateScale(40),
        backgroundColor : defaultTheme.primaryColor,
        borderRadius : moderateScale(6),
        justifyContent : "center",
        alignItems : "center"
  },
  share : {
      width : moderateScale(25),
      height : moderateScale(25)
  },
  container : {
      width : moderateScale(250),
      height : moderateScale(40),
      marginHorizontal : moderateScale(3),
      backgroundColor : defaultTheme.grayBackground,
      borderRadius : moderateScale(6),
      
  }
  
});

export default InviteScreen;
