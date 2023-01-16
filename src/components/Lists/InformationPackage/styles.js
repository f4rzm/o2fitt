import {StyleSheet} from 'react-native';
import { dimensions } from '../../../constants/Dimensions';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'flex-start',
    marginBottom: 15,
    marginTop: 2
  },
  title: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginVertical: 8,
  },
  textHolder: {
    // flex: 1,
    alignItems: 'flex-start',
    marginStart: 28
  },
  titleItem: {
    fontSize: 16,
  },
  subTitleItem: {
    fontSize: 15,
  },
  iconHolder: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginEnd: 10
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  full: {
    flex: 1
  }
});
