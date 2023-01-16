import { StyleSheet } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'
import { defaultTheme } from './theme'


export const universalStyles = StyleSheet.create({
    headersTextPersian: {
        fontSize: moderateScale(17),
        color: defaultTheme.darkText,
    },
    headersTextEnglish: {
        fontSize: moderateScale(18),
        color: defaultTheme.darkText
    },
    image: {
        width: moderateScale(150),
        height: moderateScale(150),
        resizeMode: "contain"
    },
    subHeaderTextPersian: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
        textAlign:"center",
        lineHeight:moderateScale(23)
    },
    subHeaderTextEnglish: {
        fontSize: moderateScale(15),
        color: defaultTheme.darkText,
    },
    homeScreenCards: {
        marginVertical: moderateScale(4),
        flexDirection: "row",
        height: moderateScale(110),
        width: "92%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderWidth: 0,
        backgroundColor: defaultTheme.lightBackground,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.27,
        elevation: 5,
        marginHorizontal: moderateScale(16),
        marginBottom: moderateScale(20),
        borderColor: defaultTheme.border,
        borderRadius: moderateScale(10),
        paddingVertical: moderateScale(4)
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    doubleBtn:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-around",
        marginVertical:moderateScale(15)
    }
})