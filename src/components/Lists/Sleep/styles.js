import {Dimensions, StyleSheet} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {defaultTheme} from '../../../constants/theme';
const {width} = Dimensions.get('screen');
export default StyleSheet.create({
  container: {
    borderBottomWidth: 0.4,
    borderBottomColor: defaultTheme.gray,
    width: width + 140,
    flexDirection: 'row',
  },
  buttonRemove: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 50,
    backgroundColor: 'tomato',
  },
  buttonEdit: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 50,
    backgroundColor: '#dbe344',
  },
  date: {
    marginHorizontal: 10,
    fontSize : moderateScale(14)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  delete: {
    width: 100,
    height: '100%',
  },
  padding: {
    paddingStart: 20,
  },
  duration: {
    flex: 1,
    marginHorizontal: 20,
    textAlign: 'right',
    fontSize : moderateScale(14)

  },
});
