import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';
const {width} = Dimensions.get('screen');
export default StyleSheet.create({
  mainContainer: {
    width: width - 40,
    alignItems: 'center',
    marginVertical:moderateScale(40)
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: defaultTheme.gray,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: defaultTheme.gray,
  },
  minWeight: {
    position: 'absolute',
    right: '15%',
    top: -5,
    alignItems: 'center',
  },
  maxWeight: {
    position: 'absolute',
    left: '15%',
    top: -5,
    alignItems: 'center',
  },
  weightCircle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: defaultTheme.darkGray,
    backgroundColor: defaultTheme.primaryColor,
    borderRadius: 20,
  },
  number: {
    fontSize: moderateScale(16),
    marginTop: 5,
  },
  title: {
    fontSize: moderateScale(17),
    color: defaultTheme.green,
    marginBottom: 30,
  },
});
