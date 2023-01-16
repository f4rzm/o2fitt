import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

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
      holderActivity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      contentList: {
          paddingHorizontal: 20,
      },
      emptyBill: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:moderateScale(90)
      },
      enyItem: {
        fontSize : moderateScale(18),
      }
})