import React, {useEffect, useState} from 'react';
import {FlatList, I18nManager, Pressable, Text, View,TouchableOpacity,Image} from 'react-native';
import Header from '../../components/Header';
import styles from './BillStyles';
import ArrowBack from '../../../res/img/arrowBack.svg';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
import {urls} from '../../utils/urls';
import {RestController} from '../../classess/RestController';
import BillList from '../../components/Lists/Bill';
import CommonText from '../../components/CommonText';
import Lottie from "lottie-react-native"
import { defaultTheme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';
import { dimensions } from '../../constants/Dimensions';

const BillScreen = ({navigation}) => {
  //==================VARIABLES============
  const lang = useSelector(state => state.lang);
  const profile = useSelector(state => state.profile);
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
const [disabled, setDisabled] = useState(false);
  const [billList, setBillList] = useState([]);
  const title = lang.bills;
  const childrenLeft = (
    <TouchableOpacity
    disabled={disabled}
      style={styles.childrenLeft}
      activeOpacity={1}
      onPress={() => {setDisabled(true);navigation.goBack() }}>
      <Image
      source={require("../../../res/img/back.png")}
      style={{width:moderateScale(20),height:moderateScale(18),resizeMode:"contain",transform:[{rotate:I18nManager.isRTL ? "180deg" : "180deg"}]}}
      />
    </TouchableOpacity>
  );

  const dataHeader = {
    title,
    childrenLeft,
    lang,
  };

  //==================EFFECT================

  useEffect(() => {
    const url = `${urls.orderBaseUrl + urls.order}GetOrdersByUserId?UserId=${
      profile.userId
    }`;
    const header = {
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        Language: lang.capitalName,
      },
    };

    // console.log({url});

    const RC = new RestController();
    RC.get(url, header, onSuccess, onFailure);
  }, []);

  //==================FUNCTION==================

  const onSuccess = response => {
    setBillList(response.data.data);
    setLoading(false);
  };

  const onFailure = response => {
    // console.log({response});
  };

  const renderItem = items => <BillList {...{items, lang}} />;

  const keyExtractor = (_, index) => `item_${index}_bill`;

  if (loading) {
    return (
      <View style={styles.container}>
        <Header {...{data: dataHeader}} />
        <View style={styles.holderActivity}>
          <ActivityIndicator size={"large"} color={defaultTheme.gold} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header {...{data: dataHeader}} />
      {billList.length > 0? (
        <FlatList
          data={billList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          contentContainerStyle={styles.contentList}
        />
      ) : (
        <View style={styles.emptyBill}>
          <Lottie
          source={require("../../../res/animations/noresulat.json")}
          loop={true}
          autoPlay
          style={{width:dimensions.WINDOW_WIDTH*0.7}}
          />
          <CommonText
            text={lang.enyItem}
            styleText={[styles.enyItem, {fontFamily: lang.titleFont}]}
          />
       
        </View>
      )}
    </View>
  );
};

export default BillScreen;
