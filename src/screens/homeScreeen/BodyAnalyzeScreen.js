import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Animated, FlatList, TouchableOpacity } from 'react-native'
import { ConfirmButton, Information, Toolbar, DietCaloriePayment } from '../../components'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../../constants/theme'
import { moderateScale } from 'react-native-size-matters'
import { dimensions } from '../../constants/Dimensions'
import LinearGradient from 'react-native-linear-gradient'
import BreakFast from '../../../res/img/breakfast.svg'
import ChangePackage from '../../../res/img/changePackage.svg'
import { Modal } from 'react-native-paper'
import Info from '../../../res/img/info5.svg'
import LottieView from 'lottie-react-native'

function BodyAnalyzeScreen(props) {
    const lang = useSelector(state => state.lang)
    const user = useSelector(state => state.user)
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const [autoFuces, setAutoFuces] = useState(false)
    const translateY = useRef(new Animated.Value(100)).current


    const data = [
        { id: 0, name: lang.walnut, measure: lang.twoMedium, caloire: 65 },
        { id: 1, name: lang.tea, measure: lang.oneCup, caloire: 2 },
        { id: 2, name: lang.risinBread, measure: lang.twoAndHalf, caloire: 197 },
        { id: 3, name: lang.cheese, measure: lang.twoBox, caloire: 122 },
    ]

    const RenderItem = (item) => {
        return (
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), justifyContent: 'center', borderBottomWidth: item.index == 3 ? 0 : 1, borderColor: defaultTheme.border }}>
                <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                    <View style={{}}>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{item.item.name}</Text>
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(12) }}>{item.item.measure}</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(18), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>{item.item.caloire}</Text>
                </View>
            </View>
        )
    }
    const renderHeader = () => {
        return (
            <View style={{ width: dimensions.WINDOW_WIDTH * 0.8, height: moderateScale(50), backgroundColor: defaultTheme.grayBackground, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1, borderColor: defaultTheme.border, justifyContent: 'center' }}>
                <View style={{ justifyContent: "space-between", width: "100%", flexDirection: "row", marginHorizontal: moderateScale(15) }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <BreakFast
                            width={moderateScale(30)}
                        />
                        <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), color: defaultTheme.darkText }}>{lang.breakfast}</Text>
                    </View>
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(25), color: defaultTheme.mainText }}>386 کالری</Text>
                </View>
            </View>
        )
    }
    const renderFooter = () => {
        return (
            <View style={{ justifyContent: "space-around", flexDirection: "row", padding: 15 }}>
                <View style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, backgroundColor: defaultTheme.primaryColor, alignItems: "center", padding: moderateScale(10) }}>
                    <Image
                        source={require('../../../res/img/done.png')}
                        style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "center" }}
                    />
                    <Text style={{ color: "white", fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>ثبت در روزانه</Text>
                </View>
                <View style={{ height: moderateScale(40), justifyContent: "center", flexDirection: "row", borderRadius: 10, alignItems: "center", padding: moderateScale(10), borderColor: defaultTheme.border, borderWidth: 1 }}>
                    <ChangePackage />
                    <Text style={{ fontFamily: lang.font, fontSize: moderateScale(15), marginHorizontal: moderateScale(5) }}>تعویض برنامه</Text>
                </View>

            </View>
        )
    }
    const showModal = () => {
        Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true
        }).start()
        setAutoFuces(true)
    }


    return (
        <>

            <Toolbar
                title={lang.golFittBoy}
                lang={lang}
                onBack={() => props.navigation.goBack()}
            />
            <ScrollView style={{ flexGrow: 1, }}>
                <View style={{backgroundColor:defaultTheme.primaryColor,height:moderateScale(30)}}/>
                <View style={{ height: moderateScale(280), alignItems: "center",marginTop:moderateScale(15),borderRadius:25,top:moderateScale(-40),backgroundColor:defaultTheme.lightBackground }}>
                    <LottieView
                        source={require("../../../res/animations/BodyA.json")}
                        width={dimensions.WINDOW_WIDTH}
                        height={moderateScale(300)}
                        autoPlay={true}
                        loop={true}
                        style={{top:moderateScale(5)}}
                    />
                </View>
                <Text style={[styles.text, { fontFamily: lang.titleFont, }]}>{lang.whatisBodyA}</Text>
                <Text style={[styles.text2, { fontFamily: lang.font, }]}>{lang.whatIsBodyAdes}</Text>
                <Text style={[styles.text, { fontFamily: lang.titleFont,marginBottom:0 }]}>{lang.bodyASample}</Text>
                <Image
                    source={require('../../../res/img/BodyA.jpg')}
                    style={{ width: dimensions.WINDOW_WIDTH, resizeMode: "contain" ,top:moderateScale(-10)}}
                />
            </ScrollView>

            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.buttonGradient}>
                <View style={{ height: moderateScale(60) }}>
                    <ConfirmButton
                        lang={lang}
                        style={styles.button}
                        title={lang.startIt}
                        leftImage={require('../../../res/img/done.png')}
                        onPress={()=>{
                            if(props.route.params.hasCredit==false){
                                props.navigation.navigate('PackagesScreen')
                            }else{
                                props.navigation.navigate('EditBodyScreen')
                            }
                            
                        
                        }}
                    />
                </View>
            </LinearGradient>
            
            
        </>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: moderateScale(18),
        marginHorizontal: moderateScale(20),
        marginVertical: moderateScale(14),
        color: defaultTheme.darkText,
        textAlign:"left"
    },
    text2: {
        width: dimensions.WINDOW_WIDTH * 0.9,
        marginHorizontal: moderateScale(20),
        fontSize: moderateScale(15),
        lineHeight: moderateScale(25),
        color: defaultTheme.lightGray2,
        textAlign:"left"

    },
    packages: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        alignSelf: "center",
        height: moderateScale(150),

    },
    buttonGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: moderateScale(50),
        paddingBottom: 50,
    },
    button: {
        backgroundColor: defaultTheme.green2
    },
    navigationText: {
        fontSize: moderateScale(15),
        padding: moderateScale(6)
    },
    flatList: {
        alignSelf: "center",
        borderWidth: 1,
        borderColor: defaultTheme.border, borderRadius: 10,
        marginBottom: moderateScale(70)
    },
    button2: {
        width: dimensions.WINDOW_WIDTH * 0.3,
    },
    button3: {
        width: dimensions.WINDOW_WIDTH * 0.3,
        backgroundColor: "white",
    },
    button4: {

        backgroundColor: defaultTheme.green,
    },
    AnimatedModal: {
        width: dimensions.WINDOW_WIDTH * 0.95,
        backgroundColor: "white",
        top: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: dimensions.WINDOW_WIDTH * 0.025,
        alignItems: "center",
        paddingBottom: moderateScale(15)
    },
});
export default BodyAnalyzeScreen;