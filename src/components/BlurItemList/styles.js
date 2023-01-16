import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import { defaultTheme } from '../../constants/theme';

export default StyleSheet.create({
  container: {
    paddingVertical: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureUnitText: {
    fontSize: moderateScale(17),
    color:defaultTheme.darkText
  },
});
