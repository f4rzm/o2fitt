import {Dimensions, StyleSheet} from 'react-native';
const {width} = Dimensions.get('screen');
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width,
    paddingHorizontal: 20,
    justifyContent:"space-around"
  },
  title: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: moderateScale(15),
  },
  holderGoalWeight: {
    width: '45%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  spacer: {
    width: 4,
    height: 1,
  },
  right: {
      
  }
});
