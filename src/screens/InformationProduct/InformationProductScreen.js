import React, { useState, useRef, useEffect } from 'react';
import {
  I18nManager,
  PermissionsAndroid,
  ScrollView,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import { useSelector } from 'react-redux';
import styles from './InformationProductStyles';
import Close from '../../../res/img/close.svg';
import ArrowBack from '../../../res/img/arrowBack.svg';
import CommonText from '../../components/CommonText';
import InformationProduct from '../../components/InformationProduct';
import { BlurView } from '@react-native-community/blur';
import PopupUploadImage from '../../components/PopupUploadImage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Camera from '../../../res/img/camera.svg';
import FastImage from 'react-native-fast-image';
import Remove from '../../../res/img/remove.svg';
import Toast from 'react-native-toast-message';
import { urls } from '../../utils/urls';
import { RestController } from '../../classess/RestController';
import UploadImageProduct from '../../components/UploadImageProduct';
import { ConfirmButton, MainToolbar, Toolbar } from '../../components';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';
import Done from '../../../res/img/done.png'
import {useNavigation} from "@react-navigation/native"

const InformationProductScreen = ({ navigation, route }) => {
  //=======================VARIABLES=======================
  const auth = useSelector(state => state.auth);
  const lang = useSelector(state => state.lang);
  const barcode = route.params.barcode;
  const [showPopupWrapper, setShowPopupWrapper] = useState(false);
  const [index, setIndex] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const [valueImage, setValueImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false)
  const textInput = React.createRef();
  const [textInputText, setTextInputText] = useState();
  const options = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: true,
  };
  const url = urls.foodBaseUrl + 'UserReportedFoods';
  const header = {
    headers: {
      Authorization: 'Bearer ' + auth.access_token,
      'Content-Type': 'application/json',
    },
  };

  const title = lang.sendInformationProduct;
  const childrenLeft = (
    <TouchableOpacity
      style={styles.childrenLeft}
      onPress={() => navigation.navigate('DailyScreen')}>
      <Close />
    </TouchableOpacity>
  );

  const childrenRight = (
    <TouchableOpacity
      style={styles.childrenRight}
      disabled={disabled}
      onPress={() => { setDisabled(true); navigation.goBack() }}>
      <ArrowBack style={I18nManager.isRTL ? null : styles.rightIcon} />
    </TouchableOpacity>
  );

  const dataHeader = {
    title,
    childrenLeft,
    childrenRight,
  };

  //====================FUNCTION============================
  const renderItem = items => {
    const { item, index } = items;
    if (index === 0 && valueImage) {
      return renderImage(valueImage, index);
    }
    if (index === 1 && mainImage) {
      return renderImage(mainImage, index);
    }
    return (
      <TouchableOpacity
        disabled={loading}
        style={styles.upload}
        activeOpacity={0.8}
        onPress={requestCameraPermission.bind('null', index)}>
        <Camera />
        <CommonText text={item.text} styleText={styles.textUpload} />
      </TouchableOpacity>
    );
  };

  const renderImage = (image, index) => {
    // console.log({image});
    return (
      <View style={styles.imageHolder}>
        <FastImage
          source={{ uri: image.path }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={removeImage.bind('null', index)}>
          <Remove />
        </TouchableOpacity>
      </View>
    );
  };

  const removeImage = index => {
    if (index) {
      setMainImage(null);
    } else {
      setValueImage(null);
    }
  };

  const requestCameraPermission = async index => {
    setShowPopupWrapper(true)
    setIndex(index)
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'O2Fit needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIndex(index);
        pressUpload();
      } else {
        // console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const pressUpload = () => {
    setShowPopupWrapper(true);
  };

  const onClosePopup = () => {
    setShowPopupWrapper(false);
  };

  const cropImage = response => {
    ImageCropPicker.openCropper({
      path: response.assets[0].uri,
      width: 600,
      height: 800,
      includeBase64: true,
    }).then(image => {
      if (index) {
        setMainImage(image);
      } else {
        setValueImage(image);
      }
    });
  };

  const openCamera = () => {
    launchCamera(options, response => {
      if (response.didCancel) {
        return '';
      } else {
        setShowPopupWrapper(false);
        cropImage(response);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return '';
      } else {
        setShowPopupWrapper(false);
        cropImage(response);
      }
    });
  };

  const sendInfo = () => {
    console.warn(valueImage, mainImage)
    if (
      textInputText
    ) {
      if (valueImage || mainImage) {
        setLoading(true);
        const params = {
          name: textInputText,
          barcode,
          firstImage: valueImage ? `${valueImage.data}` : '',
          secendImage: mainImage ? `${mainImage.data}` : '',
        };
        console.log({ params });
        const RC = new RestController();
        RC.post(url, params, header, ReportFoodSuccess, reportFoodFailure);

      } else {
        Toast.show({
          type: 'error',
          props: { text2: lang.addImage, style: { fontFamily: lang.font } },
          visibilityTime: 2000,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        props: { text2: lang.enterNameProduct, style: { fontFamily: lang.font } },
        visibilityTime: 1000,
      });
    }
  };

  const ReportFoodSuccess = response => {
    Toast.show({
      type: 'success',
      props: { text2: lang.thanksForSend, style: { fontFamily: lang.font } },
      visibilityTime: 800,
      onShow: navigation.pop(2)
    });
    setLoading(false);
  };

  const reportFoodFailure = response => {
    console.log('response failureeeee',response);
    setLoading(false);
    Toast.show({
      type: 'error',
      props: { text2: response.data.message, style: { fontFamily: lang.font } },
      visibilityTime: 800,
    });
  };
  const onChangeText = (text) => {
    setTextInputText(text)
  }
  return (
    <View style={styles.container}>
      <Toolbar lang={lang} onBack={() => navigation.pop(2)} />

      <Text style={styles.title}>{lang.informationProduct}</Text>

      <InformationProduct lang={lang} barcode={barcode} textInput={textInput} onChangeText={onChangeText} />

      <UploadImageProduct {...{ lang, requestCameraPermission, mainImage, valueImage, removeImage }} />

      {/* <Button
          text={lang.send}
          styleButton={styles.styleButton}
          onPress={sendInfo}
          loading={loading}
        /> */}
      <View style={{ width: "90%", borderColor: defaultTheme.green, borderWidth: 1, borderRadius: moderateScale(15), alignSelf: "center" }}>
        <Text style={{ textAlign: "left", padding: moderateScale(15), color: defaultTheme.darkText, fontFamily: lang.font, lineHeight: moderateScale(25), fontSize: moderateScale(15) }}>
          {lang.thanksForFeedBack}
        </Text>
      </View>
      <View style={{ width: "100%", alignItems: "center", position: 'absolute', bottom: moderateScale(30) }}>
        <ConfirmButton
          style={{ width: moderateScale(200), backgroundColor: defaultTheme.green }}
          lang={lang}
          title={lang.addProduct}
          textStyle={styles.buttonText}
          onPress={sendInfo}
          isLoading={loading}
          leftImage={require("../../../res/img/done.png")}
          imageStyle={{ color: "red", width: moderateScale(25), height: moderateScale(25) }}
        />
      </View>

      {showPopupWrapper && (
        <View style={styles.wrapper}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <PopupUploadImage
            {...{ lang, onClosePopup, openCamera, openGallery }}
          />
        </View>
      )}
    </View>
  );
};

export default InformationProductScreen;
