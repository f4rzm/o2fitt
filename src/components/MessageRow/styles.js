import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {dimensions} from '../../constants/Dimensions';
import {defaultTheme} from '../../constants/theme';

export default StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 0.3,
    borderColor: defaultTheme.gray,
    overflow: 'hidden',
    marginBottom: 15,
    flex: 1,
  },
  delete: {
    height: '100%',
    backgroundColor: 'red',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    flex: 1,
    borderRadius: 8,
    height: '100%',
    alignItems: 'flex-start',
  },
  button: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageHolder: {
    width: dimensions.WINDOW_WIDTH * 0.12,
    height: dimensions.WINDOW_WIDTH * 0.12,
    borderRadius: 300,
    marginEnd: 15,
  },
  left: {
    marginVertical: 10,
    marginHorizontal: 10,
    width: dimensions.WINDOW_WIDTH * 0.65,
  },
  title: {
    fontSize: moderateScale(16),
  },
  subTitle: {
    fontSize: moderateScale(14),
    textAlign: 'left'
  },
  description: {
    marginTop: verticalScale(15),
    textAlign:"left",
    lineHeight: verticalScale(22),
    fontSize: moderateScale(14),
  },
  moreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textMoreView: {
    fontSize: moderateScale(11),
  },
  arrowBack: {
    width: 30,
    height: 30,
    backgroundColor: defaultTheme.gray,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inherit: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
  // unRead: {
  //   width: 20,
  //   height: 20,
  //   borderRadius: 30,
  //   marginEnd: 5,
  //   backgroundColor: 'red',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  textUnread: {
    color: 'white',
    padding:moderateScale(1),
    backgroundColor:"red",
    borderRadius:32,
    paddingHorizontal:moderateScale(8),
    fontSize:moderateScale(14)
  }
});
