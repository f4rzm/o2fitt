import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default StyleSheet.create({
    container: {
        
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: moderateScale(8),
        borderColor: '#ccc',
        borderWidth: .5,
        paddingHorizontal: moderateScale(5),
        borderRadius: 5,
        marginBottom: moderateScale(8)
    },
    fixRow: {
        flexDirection: 'row'
    },
    title: {
        fontSize : moderateScale(16)
    },
    number: {
        fontSize : moderateScale(16)
    }
})