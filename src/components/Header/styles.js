import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: moderateScale(50),

    backgroundColor: defaultTheme.primaryColor,
  },
  left: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 0.4,
    justifyContent: 'center',
  },
  styleTitle: {
    color: defaultTheme.lightText,
    fontSize: moderateScale(17),
  },
});
