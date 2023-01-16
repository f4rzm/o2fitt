import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: moderateScale(15),
    flex: 0.35,
  },
  textInput: {
    borderWidth: 1,
    borderColor: defaultTheme.gray,
    marginStart: 20,
    borderRadius: 10,
    flex: 1,
    maxWidth: 300,
    paddingVertical: 10,
    color: defaultTheme.darkText,
    paddingHorizontal: 10,
    fontSize:moderateScale(17)
  },
  barcode: {
    borderWidth: 1,
    borderColor: defaultTheme.gray,
    opacity: 0.6,
    marginStart: 20,
    borderRadius: 10,
    flex: 1,
    maxWidth: 300,
    paddingVertical: 10,
    color: defaultTheme.gray,
    paddingHorizontal: 10,
    fontSize:moderateScale(18)

  },
});
