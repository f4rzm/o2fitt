import { Dimensions, StyleSheet } from "react-native";
import { defaultTheme } from "../../../constants/theme";
const {width} = Dimensions.get('screen')
export default StyleSheet.create({
    container: {
        borderBottomWidth: .4,
        borderBottomColor: defaultTheme.gray,
        width : width + 70,
        flexDirection: 'row'
    },
    buttonRemove: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 50,
        backgroundColor: 'red',
        // paddingVertical: 10
    },
    foodName: {
        marginHorizontal: 10 
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,

    },
    delete: {
        width: 100,
        height: '100%',
      },
      padding: {

        paddingStart: 20
      }
})