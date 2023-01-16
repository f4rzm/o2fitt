import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { dimensions } from "../../constants/Dimensions";
import { defaultTheme } from "../../constants/theme";

export default StyleSheet.create({
    container: {
        width: dimensions.WINDOW_WIDTH * 0.8,
        backgroundColor: defaultTheme.lightText,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 152,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10
      },
      row: {
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
      },
      textAlert: {
          fontSize : moderateScale(15),
          textAlign: 'justify',
          marginBottom: 25,
          lineHeight: 23
      },
      button: {
          width: '40%',
          // flexShrink: 1,
          // maxWidth: '40%',
          paddingVertical: moderateScale(15),
        //   paddingHorizontal : moderateScale(25),
          borderRadius: 8,
      },
      textButton: {
          color: defaultTheme.lightText,
          fontSize : moderateScale(15),
          textAlign: 'center',

      }
})