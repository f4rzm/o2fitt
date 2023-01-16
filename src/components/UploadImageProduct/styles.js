import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';
const {width} = Dimensions.get('screen');
export default StyleSheet.create({
  container: {
    width,
    flexDirection: 'row',
    marginVertical: 30,
    paddingHorizontal: 20,
  },

  upload: {
    width: width * 0.4,
    height: width * 0.4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: defaultTheme.blue,
    marginBottom: 20,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    marginEnd: (width - width * 0.8) / 2,
  },
  textUpload: {
    fontSize: moderateScale(12),
  },
  imageHolder: {
    width: width * 0.4,
    height: width * 0.4,
    overflow: 'visible'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  removeButton: {
    position: 'absolute',
    left: -10,
    top: -30,
    padding: 20,
    // backgroundColor: 'green'
  },
});
