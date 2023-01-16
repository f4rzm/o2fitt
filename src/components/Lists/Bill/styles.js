import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  }
});
