import {StyleSheet} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  imageHolder: {
    width: dimensions.WINDOW_WIDTH * 0.12,
    height: dimensions.WINDOW_WIDTH * 0.12,
    borderRadius: 200,
    overflow:"visible",
    
  },
  chatHolder: {
    padding: 10,
    backgroundColor:"#fcdab6",
    // width: '67%',
    maxWidth: '79%',
    borderBottomRightRadius:0,
    borderRadius:20,
    borderBottomLeftRadius:20,
  },
  chatText: {
    color: defaultTheme.darkText,
    textAlign: 'left',
    lineHeight: 24,
    // width: '90%',
    fontSize : moderateScale(15)
  },
  start: {
    alignItems: 'flex-start',
  },
  end: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  marginStart: {
    marginStart: 15,
  },
  marginEnd: {
    marginEnd: 15,
  },
  delete: {
    width: 55,
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flex: 1,
  },
  containerChat: {
    alignItems: 'center',
    flex: 1,
    // marginStart: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
  link: {
    color: '#AB0000',
    fontSize: moderateScale(15),
    textDecorationLine: 'underline'
  }
});
