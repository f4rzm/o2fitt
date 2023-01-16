import React, { memo } from "react"
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform, I18nManager } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { dimensions } from "../constants/Dimensions";
import { TextInput } from "react-native-gesture-handler";
// import Voice from '@react-native-community/voice';
import LottieView from 'lottie-react-native';

const SearchToolbar = props => {

    // const [renderVoice, setRenderVoice] = React.useState(false)
    // const[isRecording , setIsRecording] = React.useState(false)

    // React.useEffect(() => {

    //     Voice.isAvailable().then(res =>{
    //         setRenderVoice((Platform.OS === "ios" && props.lang.langLocale === "fa")?false:res)
    //     })

    //     Voice.onSpeechStart = onSpeechStart;
    //     Voice.onSpeechRecognized = onSpeechRecognized;
    //     Voice.onSpeechEnd = onSpeechEnd;
    //     Voice.onSpeechError = onSpeechError;
    //     Voice.onSpeechResults = onSpeechResults;
    //     Voice.onSpeechPartialResults = onSpeechPartialResults;
    //     Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    //     return removeListeners;
    // },[])


    // const voiceStrart = ()=>{
    //     Voice.isAvailable().then(res => console.log(res)) 
    //      Voice.start(props.lang.langLocale).then(res=>{
    //         console.log(res)
    //         setIsRecording(true)
    //      }).catch(error=>{console.log(error);setIsRecording(false)})
    // }

    // const onSpeechStart = (e) => {
    //     console.log('onSpeechStart: ', e);  
    // };

    // const onSpeechRecognized = (e) => {
    //     console.log('onSpeechRecognized: ', e);

    // };

    // const onSpeechEnd = (e) => {
    //     console.log('onSpeechEnd: ', e);
    // };

    // const onSpeechError = (e) => {
    //     console.log('onSpeechError: ', e);
    //     setIsRecording(false)
    // };

    // const onSpeechResults = (e) => {
    //     setIsRecording(false)
    //     console.log('onSpeechResults: ', e);
    //     if(e.value.length > 0){
    //         props.onVoice(e.value[0])
    //     }

    // };

    // const onSpeechPartialResults = e =>{
    //     console.log('onSpeechPartialResults: ', e);
    // }

    // const onSpeechVolumeChanged = e =>{
    //     // console.log('onSpeechVolumeChanged: ', e);
    // }

    // const removeListeners = ()=>{
    //     Voice.destroy().then(Voice.removeAllListeners)
    // }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <View style={styles.leftContainer}>
                    <TouchableOpacity
                        hitSlop={{
                            top: 15,
                            bottom: 15,
                            left: 15,
                            right: 15
                        }}
                        onPress={props.goBack}
                    >
                        <Image
                            source={require("../../res/img/cross.png")}
                            style={styles.cross}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.centerContainer}>
                    <Text style={[styles.title, { fontFamily: props.lang.titleFont }]} allowFontScaling={false}>
                        {
                            props.title
                        }
                    </Text>
                </View>

                <View style={styles.rightContainer} />

            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.SearchContainer}>
                    <TouchableOpacity>
                        <Image
                            source={require("../../res/img/search.png")}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, { fontFamily: props.lang.font }]}
                        placeholder={props.placeholder}
                        numberOfLines={1}
                        allowFontScaling={false}
                        onChangeText={props.onChangeText}
                        underlineColorAndroid={'transparent'}
                        selectTextOnFocus={true}
                        value={props.value}
                        autoFocus={props.autoFocusDisable ? false : true}

                    />

                    {
                        props.value?
                        <TouchableOpacity onPress={() => props.setTextEmpty()}>
                            <Image
                                source={require("../../res/img/cross.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        :null
                        }

                    {/* {
                        renderVoice ?
                        isRecording?
                        
                        <LottieView 
                            style={{
                                width : moderateScale(25),
                                transform:[{scale:1.33}],
                                marginBottom : moderateScale(3)
                            }}
                            source={require('../../res/animations/mic.json')} 
                            autoPlay 
                            loop={true}
                        />:
                        <TouchableOpacity onPress={voiceStrart}>
                            <Image
                                source={require("../../res/img/speaker.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>:
                        <View style={styles.image}/>
                    } */}
                </View>
            </View>
            <View style={{ width: dimensions.WINDOW_WIDTH, height: moderateScale(30), backgroundColor: "white", borderRadius: 15, marginBottom: moderateScale(-15) }} />


        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        height: moderateScale(100),
        width: dimensions.WINDOW_WIDTH,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: defaultTheme.primaryColor
    },
    topContainer: {
        flexDirection: "row",
        width: "100%",
        height: moderateScale(40)
    },
    bottomContainer: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    leftContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    centerContainer: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",

    },
    rightContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    title: {
        fontSize: moderateScale(20),
        color: defaultTheme.lightText
    },
    cross: {
        width: moderateScale(17),
        height: moderateScale(17),
        tintColor: defaultTheme.lightBackground
    },
    SearchContainer: {
        width: "90%",
        height: moderateScale(37),
        flexDirection: "row",
        backgroundColor: defaultTheme.lightBackground,
        borderRadius: moderateScale(6),
        alignItems: "center",
        paddingHorizontal: moderateScale(10)
    },
    image: {
        width: moderateScale(22),
        height: moderateScale(15),
        tintColor: defaultTheme.darkGray,
        resizeMode: "contain"
    },
    input: {
        width: "85%",
        textAlign: I18nManager.isRTL ? "right" : "left",
        height: moderateScale(45),
        color: defaultTheme.mainText,
        borderBottomColor: 'transparent',
        fontSize: moderateScale(15)
    }

})

export default memo(SearchToolbar)