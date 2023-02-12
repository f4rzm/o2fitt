
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
import { Camera, useCameraDevices, } from 'react-native-vision-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { BarcodeFormat, useScanBarcodes ,} from 'vision-camera-code-scanner';

const BarcodeReader = props => {
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back
  // // console.warn(device.id)
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.CODE_39], {
    checkInverted: true,
    
  });
  
  return (


    <>
      {
        device &&
        <Camera
          style={styles.mainContainer}
          onBarCodeRead={props.onBarcodeRead}
          device={device}
          isActive={true}
          
          // frameProcessor={frameProcessor}
          // frameProcessorFps={5}
        >
          {/* {barcodes.map((barcode, idx) => (
            <Text key={idx} style={styles.barcodeTextURL}>
              {barcode.displayValue}
            </Text>
          ))} */}
          <BarcodeMask  />
        </Camera>
      }
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
})

export default memo(BarcodeReader)