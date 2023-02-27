
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  I18nManager 
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

const BarcodeReader = props => {
   

    return(
        <RNCamera
            style={styles.mainContainer}
            onBarCodeRead={props.onBarcodeRead}
            captureAudio={false}
        >
            <BarcodeMask/>
        </RNCamera>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex : 1,
      justifyContent : "center",
      alignItems : "center",
    }
})

export default memo(BarcodeReader)