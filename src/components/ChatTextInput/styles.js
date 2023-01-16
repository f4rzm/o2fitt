import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F1F3',
    width: '100%',
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    fontSize:moderateScale(15),
    lineHeight:moderateScale(20),
    minHeight:moderateScale(35),
    maxHeight:moderateScale(90),
    textAlign:"right"
  },
  horizontal: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  buttonSend: {
    // width:moderateScale(35),
    // height:moderateScale(35),
    padding:moderateScale(7),
    borderRadius:moderateScale(50),
    alignItems:"center",
    justifyContent:"center",
    marginHorizontal:moderateScale(10),
    margin:moderateScale(5),
    backgroundColor:defaultTheme.primaryColor
  },
});
