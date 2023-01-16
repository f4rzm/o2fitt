import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    width: '80%',
    backgroundColor: defaultTheme.lightText,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 20,
    alignSelf: 'center',
  },
  imageHolder: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textButton: {
    color: defaultTheme.lightText,
    paddingVertical: moderateScale(8),
  },
  button: {
    width: '40%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8
  },
});
