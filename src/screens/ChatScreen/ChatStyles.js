import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenLeft: {
    padding: moderateScale(25),
  },
  rightIcon: {
    transform: [{rotate: '180deg'}],
  },
  containerChat: {
    alignItems: 'center',
    flex: 1,
  },
  contentList: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingBottom: 15,
  },
  imageHolder: {
    width: dimensions.WINDOW_WIDTH * 0.12,
    height: dimensions.WINDOW_WIDTH * 0.12,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  chatHolder: {
    backgroundColor: '#EDF8FE',
    padding: 10,
    borderRadius: 8,
    width: '67%',
    // maxWidth: '50%',
  },
  chatText: {
    color: defaultTheme.darkText,
    textAlign: 'left',
  },
  start: {
    alignItems: 'flex-start',
  },
  end: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  marginStart: {
    marginStart: 15,
  },
  marginEnd: {
    marginEnd: 15,
  },
  delete: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  wrapper: {
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 15,
    flex: 1,
    backgroundColor: 'yellow'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wrapperBlur :{
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});
