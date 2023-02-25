import * as React from 'react';

import { Animated, PixelRatio, StyleSheet, Text, View } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { moderateScale } from 'react-native-size-matters';


const SquareFromCoord = ({ barcode }) => {
  let bottom;
  let left;
  let right;
  let top;
  let topAxis;

  const pixelRatio = PixelRatio.get();

  const xArray = barcode.cornerPoints.map(corner => parseFloat(corner.x));
  const yArray = barcode.cornerPoints.map(corner => parseFloat(corner.y));

  left = Math.min(...xArray) / pixelRatio;
  right = Math.max(...xArray) / pixelRatio;
  bottom = Math.max(...yArray) / pixelRatio;
  top = (Math.min(...yArray) / pixelRatio);
  topAxis = (Math.min(...yArray) / pixelRatio) + moderateScale(150);


  return (
    <View
      style={{
        backgroundColor: '#ff8000',
        borderRadius: 3,
        height: bottom - top + 20,
        opacity: 0.4,
        width: right - left + 30,
        position: 'absolute',
        left: right,
        top: topAxis,
      }}
    />
  );
};

export default function BarcodeReader(props) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const [barcodeRead, setBarcodeRead] = React.useState(false)
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.EAN_13], {
    checkInverted: true,
  });

  // Alternatively you can use the underlying function:
  //
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //   runOnJS(setBarcodes)(detectedBarcodes);
  // }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    if (barcodes.length > 0 && barcodeRead == false) {
      console.warn(barcodes);
      setBarcodeRead(true)
      props.onBarcodeRead(barcodes[0].displayValue)

      // console.warn(barcodes.join());
    }
  }, [barcodes])


  return (
    // <>

    // {
    device != null &&
    hasPermission && (
      <View style={{ flex: 1 }}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={60}
          // video={true}
          focusable={true}
          fps={60}
        />

        {barcodes.map((barcode, idx) => (
          <SquareFromCoord key={idx} barcode={barcode} />
        ))}


      </View>
    )

    // </>
  );
}

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 50,
    color: 'black',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1
  }
});