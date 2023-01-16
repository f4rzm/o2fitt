import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 20,
    borderRadius: moderateScale(13),
    borderWidth: 1,
    borderColor: defaultTheme.border,
    height: moderateScale(40),
    // width: moderateScale(130),
    // maxWidth : moderateScale(160),
    // flexGrow: .1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 10
  },
  text: {
      fontSize : moderateScale(15),
      // marginStart: 10
  },
  icon: {
    paddingEnd: 10
  }
});
