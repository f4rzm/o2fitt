
import React, { memo } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
  Animated,
  I18nManager, 
  Platform
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { dimensions } from '../constants/Dimensions';
import RNFS from 'react-native-fs';


const dir = Platform.OS === "android"? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath

const VideoPlayerFullScreen = props => {
    const [rederVideo , setRenderVideo] = React.useState(true)
    const [videoPath , setVideoPath] = React.useState(null)
    const [pause , setPause] = React.useState(false)
    const [fullScreen , setFullScreen] = React.useState(false)
    const f = props.url.substring(props.url.lastIndexOf("/") + 1)
    let [opacity] = React.useState(new Animated.Value(1))
    const videoRef=React.useRef(null)
    let progress=React.useRef(0)

    const onShow = ()=>{
        if(videoRef.current && !isNaN(parseFloat(props.seek))){
            console.log(parseFloat(props.seek))
            videoRef.current.seek(parseFloat(props.seek))
        }
    }

    const onPlay =async ()=>{
        play()
    }
  
    const play = ()=>{
        if(pause){
            setVideoPath("file://" + dir + "/" + f )
            setPause(false)
            setTimeout(()=>{
                setRenderVideo(true)
                runAnimate()
            },0)
        }
        else{
            onPause()
        }
    }

    const onPause=()=>{
        setPause(true)
        opacity.setValue(1)
    }

    const runAnimate=()=>{
        console.log("runAnimated")
        Animated.timing(opacity,{
            delay : 1000,
            toValue : 0,
            duration : 500,
            useNativeDriver : true
        }).start()
    }

    const onBackLayoutPress=()=>{
        opacity.setValue(1)
        runAnimate()
    }

    const onRequestClose=()=>{
        props.onRequestClose(pause , progress)
    }

    const onEnd = ()=>{
        setRenderVideo(false)
        setPause(true)
        props.onEnd()
        setTimeout(()=>{
            setRenderVideo(true)
        },1)
    }

    return(
        <Modal
            visible={props.visible}
            onRequestClose={onRequestClose}
            onShow={onShow}
        >
            <TouchableOpacity
                style={styles.mediaContainerFull}
                activeOpacity={1}
                onPress={onBackLayoutPress}
            >

                <TouchableOpacity 
                    style={styles.playContainer}
                    onPress={onPlay}
                >   
                    <Animated.View style={{opacity:opacity}}>
                        {
                            !pause?
                            <Icon
                                name="pause"
                                size={moderateScale(30)}
                                color={defaultTheme.primaryColor}
                                style={{
                                    transform:[
                                        {
                                            rotate : "90deg"
                                        }
                                    ]
                                }}
                            />:
                            <Icon
                                name="play"
                                size={moderateScale(30)}
                                color={defaultTheme.primaryColor}
                                style={{
                                    transform:[
                                        {
                                            rotate : "90deg"
                                        }
                                    ]
                                }}
                            />
                        }
                    </Animated.View>
                </TouchableOpacity>
            
                <TouchableOpacity 
                    style={styles.fullScreenIcon}
                    onPress={onRequestClose}
                >   
                    {
                        <Animated.View style={{opacity:opacity}}>
                            <Icon2
                                name="close-fullscreen"
                                size={moderateScale(22)}
                                color={defaultTheme.primaryColor}
                                style={{
                                    transform:[
                                        {
                                            rotate : "90deg"
                                        }
                                    ]
                                }}
                            />
                        </Animated.View>
                    }
                
                </TouchableOpacity>
     
                {
                    rederVideo &&
                    <Video  
                        ref={videoRef}
                        source={{uri: "file://" + dir + "/" + f }} 
                        onLoadStart={()=>opacity.setValue(0)}
                        paused={pause}
                        onEnd={onEnd}     
                        style={styles.fullScreen} 
                        resizeMode="contain"
                        onProgress={e=>progress=e.currentTime}
                    />
                }

            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
  mediaContainerFull : {
    width : dimensions.WINDOW_WIDTH,
    height : dimensions.WINDOW_HEIGTH,
    backgroundColor : defaultTheme.darkText
  },
  fullScreen : {
    width:dimensions.WINDOW_HEIGTH,
    height:dimensions.WINDOW_WIDTH,
    backgroundColor : defaultTheme.darkText,
    transform:[
        {
            translateY : (dimensions.WINDOW_HEIGTH - dimensions.WINDOW_WIDTH) * 0.5,
        },
        {
            translateX : I18nManager.isRTL?((dimensions.WINDOW_HEIGTH - dimensions.WINDOW_WIDTH) * 0.5):-((dimensions.WINDOW_HEIGTH - dimensions.WINDOW_WIDTH) * 0.5),
        },
        {
            rotate : "90deg"
        }
    ]
  },
  playContainer : {
      position:"absolute",
      top : "45%",
      left : "45%",
      width:moderateScale(40),
      height:moderateScale(40),
      justifyContent : "center",
      alignItems : "center",
      zIndex : 1,
  },
  fullScreenIcon : {
    position:"absolute",
    bottom : "3%",
    left : I18nManager.isRTL?"85%":"5%",
    width:moderateScale(40),
    height:moderateScale(40),
    justifyContent : "center",
    alignItems : "center",
    zIndex : 1
  }
})

export default memo(VideoPlayerFullScreen)