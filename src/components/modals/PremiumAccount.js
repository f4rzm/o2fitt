
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import {useSelector} from "react-redux"
import { withModal } from '../hoc/withModal';
import { moderateScale } from 'react-native-size-matters';
import {RowSpaceBetween , ConfirmButton, ColumnWrapper} from '../../components';
import RowWrapper from '../layout/RowWrapper';


const PremiumAccount = props => {

  return (
      <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={{flexGrow: 1 , alignItems : "center" , width : dimensions.WINDOW_WIDTH}} keyboardShouldPersistTaps='always'>
            <TouchableOpacity style={styles.touchContainer} activeOpacity={1} onPress={()=>false}>
              <Image
                source={require("../../../res/img/lock.png")}
                style={styles.image}
                resizeMode="contain"
              />  
              <TouchableOpacity style={styles.crossContainer} onPress={props.onRequestClose}>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={styles.cross}
                    resizeMode="contain"
                />
              </TouchableOpacity>
              
              <RowSpaceBetween style={styles.buble}>
                  <Text style={[styles.bubleText , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.youDoUpLevel
                      }
                  </Text>

                  <ConfirmButton
                    lang={props.lang}
                    lang={props.lang}
                    style={styles.bubleButton}
                    textStyle={styles.buttonText}
                    title={props.lang.iBuy}
                    rightImage={require("../../../res/img/next.png")}
                    imageStyle={styles.icon}
                    rotate
                  />
                  <Text style={[styles.bubleText , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.downAdv
                      }
                  </Text>
              </RowSpaceBetween>
              
              
              <RowSpaceBetween
                style={styles.rowHeader}
              >
                  <Text style={[styles.text3 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                      props.lang.simple
                    }
                  </Text>
                  <Text style={[styles.text3 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                      props.lang.gold
                    }
                  </Text>
              </RowSpaceBetween>
             
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <RowSpaceBetween
                style={styles.row}
              >
                <Image
                    source={require("../../../res/img/done.png")}
                    style={[styles.tik , {tintColor : defaultTheme.green}]}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.text1 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                      {
                        props.lang.buy_account_17
                      }
                  </Text>
                </View>
                <Image
                    source={require("../../../res/img/cross.png")}
                    style={[styles.cross2 , {tintColor : defaultTheme.error}]}
                    resizeMode="contain"
                />
              </RowSpaceBetween>
              <View style={styles.seprator}/>
              
              <Text style={[styles.text2 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                    {
                      props.lang.textInexpensiveDoFitt_1 + " "
                    }
                    <Text style={[styles.text3 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                        {
                          props.lang.textInexpensiveDoFitt_2 + " "
                        }
                    </Text>
                    {
                      props.lang.textInexpensiveDoFitt_3
                    }
              </Text>

              <RowSpaceBetween>
                <View style={[styles.card,{backgroundColor : defaultTheme.primaryColor}]}>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                      مااااچ 
                      <Text style={[styles.text5 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                       (سه ماهه)
                      </Text>
                    </Text>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    مبلغ 42000 تومان
                    </Text>

                    <RowWrapper style={{marginVertical : 0}}>
                      <ConfirmButton
                        lang={props.lang}
                        style={styles.cardButton}
                        textStyle={styles.buttonText}
                        title={props.lang.iBuy}
                        rightImage={require("../../../res/img/next.png")}
                        imageStyle={styles.icon}
                        rotate
                      />
                      <ColumnWrapper style={{paddingVertical : 0}}>
                        <Text style={[styles.text7 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                          30%
                        </Text>
                        <Text style={[styles.text6 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                          {
                            props.lang.discount
                          }
                        </Text>
                      </ColumnWrapper>
                      
                    </RowWrapper>
                    
                </View>
                
                <View style={[styles.card,{backgroundColor : defaultTheme.green2}]}>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                      مااااچ 
                      <Text style={[styles.text5 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                       (سه ماهه)
                      </Text>
                    </Text>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    مبلغ 42000 تومان
                    </Text>

                    <RowWrapper style={{marginVertical : 0}}>
                      <ConfirmButton
                        lang={props.lang}
                        style={styles.cardButton}
                        textStyle={styles.buttonText}
                        title={props.lang.iBuy}
                        rightImage={require("../../../res/img/next.png")}
                        imageStyle={styles.icon}
                        rotate
                      />
                      <ColumnWrapper style={{paddingVertical : 0}}>
                        <Text style={[styles.text7 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                          30%
                        </Text>
                        <Text style={[styles.text6 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                          {
                            props.lang.discount
                          }
                        </Text>
                      </ColumnWrapper>
                      
                    </RowWrapper>
                    
                </View>
              </RowSpaceBetween>
              <RowSpaceBetween><View style={[styles.card,{backgroundColor : defaultTheme.green}]}>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                      مااااچ 
                      <Text style={[styles.text5 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                       (سه ماهه)
                      </Text>
                    </Text>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    مبلغ 42000 تومان
                    </Text>

                    <RowWrapper style={{marginVertical : 0}}>
                      <ConfirmButton
                        lang={props.lang}
                        style={styles.cardButton}
                        textStyle={styles.buttonText}
                        title={props.lang.iBuy}
                        rightImage={require("../../../res/img/next.png")}
                        imageStyle={styles.icon}
                        rotate
                      />
                      <ColumnWrapper style={{paddingVertical : 0}}>
                        <Text style={[styles.text7 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                          30%
                        </Text>
                        <Text style={[styles.text6 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                          {
                            props.lang.discount
                          }
                        </Text>
                      </ColumnWrapper>
                      
                    </RowWrapper>
                    
                </View>
                <View style={[styles.card,{backgroundColor : defaultTheme.error}]}>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                      مااااچ 
                      <Text style={[styles.text5 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                       (سه ماهه)
                      </Text>
                    </Text>
                    <Text style={[styles.text4 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                    مبلغ 42000 تومان
                    </Text>

                    <RowWrapper style={{marginVertical : 0}}>
                      <ConfirmButton
                        lang={props.lang}
                        style={styles.cardButton}
                        textStyle={styles.buttonText}
                        title={props.lang.iBuy}
                        rightImage={require("../../../res/img/next.png")}
                        imageStyle={styles.icon}
                        rotate
                      />
                      <ColumnWrapper style={{paddingVertical : 0}}>
                        <Text style={[styles.text7 , {fontFamily : props.lang.titleFont}]} allowFontScaling={false}>
                          30%
                        </Text>
                        <Text style={[styles.text6 , {fontFamily : props.lang.font}]} allowFontScaling={false}>
                          {
                            props.lang.discount
                          }
                        </Text>
                      </ColumnWrapper>
                      
                    </RowWrapper>
                    
                </View>
              </RowSpaceBetween>
         
              
              </TouchableOpacity>
          </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    width : dimensions.WINDOW_WIDTH,
    justifyContent : "flex-start",
    alignItems : "center",
    backgroundColor : defaultTheme.lightBackground
  },
  touchContainer :{
    width : dimensions.WINDOW_WIDTH,
    alignItems  :"center"
  },  
  image : {
      width : moderateScale(50),
      height : moderateScale(50),
      marginTop : moderateScale(20),
      marginBottom : moderateScale(20)
  },
  crossContainer : {
      position : "absolute",
      top : moderateScale(22),
      left : moderateScale(15),
      width : moderateScale(26),
      height : moderateScale(26),
      borderRadius : moderateScale(13),
      justifyContent : "center",
      alignItems : "center",
      borderWidth : 1.4,
      borderColor : defaultTheme.darkGray,
  },
  cross : {
      width : moderateScale(13),
      height : moderateScale(13),
      tintColor : defaultTheme.darkText
  },
  buble:{
    width : dimensions.WINDOW_WIDTH * 0.9,
    backgroundColor : defaultTheme.green2,
    borderRadius : moderateScale(20),
    padding : moderateScale(10),
    alignItems : "center",
    marginBottom : moderateScale(20)
  },
  bubleButton : {
    width : dimensions.WINDOW_WIDTH * 0.2,
    height : moderateScale(28),
    borderRadius : moderateScale(14),
    backgroundColor : defaultTheme.lightBackground,
  },
  bubleText :{
      width : dimensions.WINDOW_WIDTH *.33  ,
      color  :defaultTheme.lightText,
      fontSize : moderateScale(10),
      lineHeight : moderateScale(15),
      textAlign : "center"
  },
  rowHeader : {
      width : dimensions.WINDOW_WIDTH * 0.82,
  },
  row : {
      width : dimensions.WINDOW_WIDTH * 0.8,
      marginVertical : 0,
  },
  textContainer:{
    flex:1,
    alignItems : "center",
    justifyContent : "center",
    borderBottomWidth : 1.2 ,
    borderColor : defaultTheme.border, 
    paddingVertical : moderateScale(4),
  },
  text1 : {
      fontSize : moderateScale(13),
      color : defaultTheme.gray,
  },
  text2 : {
      fontSize : moderateScale(15),
      color : defaultTheme.gray,
  },
  text3 : {
      fontSize : moderateScale(18),
      color : defaultTheme.gray,
  },
  text4 : {
      fontSize : moderateScale(17),
      color : defaultTheme.lightText,
  },
  text5 : {
      fontSize : moderateScale(14),
      color : defaultTheme.lightText,
  },
  text6 : {
      fontSize : moderateScale(12),
      color : defaultTheme.lightText,
  },
  text7 : {
      fontSize : moderateScale(19),
      color : defaultTheme.lightText,
  },
  tik : {
      width : moderateScale(21),
      height : moderateScale(21)
  },
  cross2 : {
    width : moderateScale(18),
    height : moderateScale(18)
  },
  seprator : {
    width:dimensions.WINDOW_WIDTH * 0.8,
    height : 1.2,
    backgroundColor : defaultTheme.border,
    borderRadius : moderateScale(5),
    marginVertical : moderateScale(16)
  },
  card : {
    width : dimensions.WINDOW_WIDTH * 0.465,
    height : dimensions.WINDOW_WIDTH * 0.35,
    borderRadius : moderateScale(6),
    justifyContent : "space-around",
    alignItems : "center"
  },
  cardButton : {
    width : dimensions.WINDOW_WIDTH * 0.2,
    height : moderateScale(32),
    borderRadius : moderateScale(8),
    backgroundColor : defaultTheme.lightBackground,
  },
  buttonText :{
      color  :defaultTheme.gray,
      fontSize : moderateScale(14),
      textAlign : "center",
      marginHorizontal : moderateScale(3)
  },
  icon : {
    width : moderateScale(15),
    height : moderateScale(13),
    tintColor : defaultTheme.gray,
    marginRight : 0
  }
});

export default withModal(PremiumAccount);
