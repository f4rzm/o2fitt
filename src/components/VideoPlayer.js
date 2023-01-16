import React, { memo } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Animated,
  I18nManager, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { defaultTheme } from '../constants/theme';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { dimensions } from '../constants/Dimensions';
import RNFS from 'react-native-fs';
import VideoPlayerFullScreen from './VideoPlayerFullScreen';

let progressTime = 0
const dir = Platform.OS === "android"? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath
const VideoPlayer = props => {
    const [renderVideo , setRenderVideo] = React.useState(false)
    const [videoPath , setVideoPath] = React.useState(null)
    const [isDownolding , setIsDownloading] = React.useState(false)
    const [pause , setPause] = React.useState(true)
    const [fullScreenSeek , setFullScreenSeek] = React.useState(0)
    const [fullScreen , setFullScreen] = React.useState(false)
    const f = props.url.substring(props.url.lastIndexOf("/") + 1)
    let [opacity] = React.useState(new Animated.Value(1))
    const videoRef=React.useRef(null)
  
    const onPlay =async ()=>{
        if(await checkPermission()){
            
           
            if(await checkCache()){
                play()
            }
            else{
                download()
            }
        }
        else{
            if(Platform.OS === "android"){
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        
                if(granted === "granted"){
                    if(await checkCache()){
                        play()
                    }
                    else{
                        download()
                    }
                }
            }
            else{
                if(await checkCache()){
                    play()
                }
                else{
                    download()
                }
            }
            
        }
    }

    const checkCache = async()=>{
        return await RNFS.exists(dir + "/" + f)
    }

    const download = ()=>{
        setIsDownloading(true)
        RNFS.downloadFile({
            fromUrl : encodeURI(props.url),
            toFile : dir + "/" + f 
        }).promise.then(res=>{
            console.log(res)
            play()
        }).catch(error=>console.log(error))
    }
  
    const play = ()=>{
        if(pause){
            setIsDownloading(false)
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
  
    const checkPermission = async ()=>{
        if(Platform.OS === "android")
         return  await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
         return true
    }

    const runAnimate=()=>{
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

    const onFullScreen=()=>{
        setFullScreen(true)
        setPause(true)
        console.log(progressTime)
        if(!isNaN(parseFloat(progressTime))){
            setFullScreenSeek(parseFloat(progressTime))
        }
    }

    const exitFullScreen = (paused , progressTimeF) =>{
    
        console.log(progressTimeF)
        setFullScreen(false)
        if(!paused){
            setPause(false)
        }
        if(videoRef.current && !isNaN(parseFloat(progressTimeF))){
            console.log(parseFloat(progressTimeF))
            videoRef.current.seek(parseFloat(progressTimeF))
        }
    }

    const onEnd = ()=>{
        setRenderVideo(false)
        setPause(true)
        setFullScreen(false)
       
    }

    return(
        <TouchableOpacity
            style={fullScreen?styles.mediaContainerFull:styles.mediaContainer} 
            activeOpacity={1}
            onPress={onBackLayoutPress}
        >
            {
                renderVideo ? 
                <Video  
                    ref={videoRef}
                    source={{uri: videoPath}} 
                    onLoadStart={()=>opacity.setValue(0)}
                    paused={pause}
                    onEnd={onEnd}     
                    style={styles.mediaContainer} 
                    resizeMode="contain"
                    onProgress={e=>{progressTime = e.currentTime; console.log(e)}}
                    poster={props.poster}
                />:
                <Image
                    source={{uri:props.poster}}
                    style={styles.mediaContainer}
                    resizeMode="contain"
                />
            }
            <TouchableOpacity 
                style={styles.playContainer}
                onPress={onPlay}
            >   
            {
                isDownolding?
                <ActivityIndicator
                    size="large"
                    color={defaultTheme.primaryColor}
                />:
                <Animated.View style={{opacity:opacity}}>
                    {
                        !pause?
                        <Icon
                            name="pause"
                            size={moderateScale(30)}
                            color={defaultTheme.primaryColor}
                        />:
                        <Icon
                            name="play"
                            size={moderateScale(30)}
                            color={defaultTheme.primaryColor}
                        />
                    }
                </Animated.View>
            }
            </TouchableOpacity>

            {
                renderVideo &&
                <TouchableOpacity 
                    style={styles.fullScreenIcon}
                    onPress={onFullScreen}
                >   
                    {
                        fullScreen?
                        <Icon2
                            name="close-fullscreen"
                            size={moderateScale(22)}
                            color={defaultTheme.primaryColor}
                        />:
                        <Icon2
                            name="open-in-full"
                            size={moderateScale(22)}
                            color={defaultTheme.primaryColor}
                        />
                    }
                
                </TouchableOpacity>
            }            
            {
                fullScreen && 
                <VideoPlayerFullScreen
                    visible={true}
                    onRequestClose={exitFullScreen}
                    url={props.url}
                    seek={fullScreenSeek}
                    onEnd={onEnd}
                />
            }
           
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  mediaContainer : {
    width : dimensions.WINDOW_WIDTH,
    height : dimensions.WINDOW_HEIGTH * 0.35,
    backgroundColor : defaultTheme.darkText
  },
  mediaContainerFull : {
    position : "absolute",
    top: 0,
    bottom : 0,
    zIndex : 1000,
    width : dimensions.WINDOW_WIDTH,
    height : dimensions.WINDOW_HEIGTH,
    backgroundColor : defaultTheme.darkText,
    elevation : 1,
  },
  playContainer : {
      position:"absolute",
      top : dimensions.WINDOW_HEIGTH * 0.175 - moderateScale(20),
      left : dimensions.WINDOW_WIDTH * 0.5 - moderateScale(20),
      width:moderateScale(40),
      height:moderateScale(40),
      justifyContent : "center",
      alignItems : "center",
  },
  fullScreenIcon : {
    position:"absolute",
    bottom : "3%",
    left : I18nManager.isRTL?"5%":"87%",
    width:moderateScale(40),
    height:moderateScale(40),
    justifyContent : "center",
    alignItems : "center"
  }
})

export default memo(VideoPlayer)