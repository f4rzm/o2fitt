import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { defaultTheme } from "../../constants/theme";

export default StyleSheet.create({
    container: {
        width: '70%',
        backgroundColor: defaultTheme.lightText,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderRadius: 20,
        alignSelf: 'center'
    },
    closeButton: {
        paddingVertical: 10,
       width: 50,
       justifyContent: 'center',
       alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: moderateScale(18),
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 30
    },
    selectButton: {
        backgroundColor: '#F0EFF5',
        padding: 13,
        borderRadius: 8,
        
    },
    wrapperSelectButton: {
        alignItems: 'center',
    },
    textSelectButton: {
        fontSize: moderateScale(15),
        marginTop: 8
    }
})