import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {defaultTheme} from '../../constants/theme';
const {width} = Dimensions.get('screen');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenLeft: {
    padding: moderateScale(15),
  },
  rightIcon: {
    transform: [{rotate: '180deg'}],
  },
  childrenRight: {
    alignItems: 'flex-end',
    padding: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(17),
    color: defaultTheme.darkText,
    paddingHorizontal: 15,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wrapper: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
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
  textUpload: {
    fontSize: moderateScale(12),
  },
  headerFlatList: {
    marginBottom: 20,
  },
  footerFlatList: {
    alignSelf: 'center',
    width: '45%',
    marginVertical: 40,
  },
  styleButton: {
    alignSelf: 'center'
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
