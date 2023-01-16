
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import {useSelector} from "react-redux"
import Signal from "../../../res/img/signal.svg"
import { ConfirmButton } from '..';
import {NetworkManager} from "../../classess/NetworkManager"
import { withModal } from '../hoc/withModal';
import {en} from "../../utils/langs/english"


const NoInternet = props => {

  let [lang] = React.useState(props.lang.langId?props.lang:en)
  
  const [isChecking , setChecking] = React.useState(false)

  React.useEffect(()=>{
    if(props.networkConnectivity){
      props.callBack()
    }
  },[props.networkConnectivity])
  
  const onPress=()=>{
    setChecking(true)
    const NM = new NetworkManager()
    NM.getNetworkState((isConnected , type)=>{
      if(isConnected){
        props.callBack()
      }
      else{
         setChecking(false)
      }
    })
  }

  return (
      <View style={styles.mainContainer}>
          <Signal
            width={dimensions.WINDOW_WIDTH}
          />
          <Text style={[styles.title , {fontFamily : props.lang.font}]} allowFontScaling={false}>
            {lang.ohhhh}
          </Text>
          <Text style={[styles.context , {fontFamily : lang.font}]} allowFontScaling={false}>
            {lang.noInternet}
          </Text>
          {
            isChecking?
            <ActivityIndicator
              size="large"
              color={defaultTheme.primaryColor}
              style={{
                marginTop : 30
              }}
            />:
            <ConfirmButton
              lang={lang}
              title={lang.tryAgin}
              style={{
                width : dimensions.WINDOW_WIDTH * 0.7,
                height : 45,
                borderRadius : 25,
                marginTop : 30
              }}
              onPress={onPress}
            />
          }
      </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    width : dimensions.WINDOW_WIDTH,
    paddingTop : dimensions.WINDOW_HEIGTH * 0.12,
    justifyContent : "flex-start",
    alignItems : "center",
    backgroundColor : defaultTheme.lightBackground
  },
  title : {
    fontSize : 28,
    color : defaultTheme.gray,
    textAlign : "center",
  },
  context : {
    width : "85%",
    fontSize : 15,
    color : defaultTheme.gray,
    textAlign : "center",
  }
});

export default withModal(NoInternet);
