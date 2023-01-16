import React from 'react';
import {
  StyleSheet,
  ScrollView
} from 'react-native';
import {MessagesRow2, Toolbar, ReplyMessage , Information} from "../../components"
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {urls} from "../../utils/urls"
import {RestController} from "../../classess/RestController"
import moment from "moment"
import { setUnreadMessageNumber } from '../../redux/actions';

const MessageDetailScreen = props => {

  const lang = useSelector(state=>state.lang)
  const user = useSelector(state=>state.user)
  const app = useSelector(state=>state.app)
  const auth = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const [messages,setMessages]=React.useState([{...props.route.params.message}])
  const [replyText,setReplyText]=React.useState("")
  const [loading,setLoading]=React.useState(false)
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [errorContext , setErrorContext] = React.useState("")

  const days = React.useRef([
    lang["1sh"],
    lang["2sh"],
    lang["3sh"],
    lang["4sh"],
    lang["5sh"],
    lang["jome2"],
    lang["sh"]
  ]).current

  React.useEffect(() => {
    getMessagesLocaly()
  }, [])
 
  const getMessagesLocaly = async()=>{
    const m = JSON.parse(await AsyncStorage.getItem("messages"))

    setMessages([{...props.route.params.message} , ...m.filter(item=>item.replyToMessage === props.route.params.message.id)])

    setRead([{...props.route.params.message} , ...m.filter(item=>item.replyToMessage === props.route.params.message.id)])
  }

  const setRead= async(readMessage)=>{
    const allMessages = JSON.parse(await AsyncStorage.getItem("messages"))
    const m = allMessages.map(item=>{
        if((readMessage.find((rm)=>rm.id===item.id))!=undefined){
            return{...item,isRead:true}
        }
        return {...item}
    })

    const newReadMsg = allMessages.map(item=>{
      if(item.replyToMessage === props.route.params.message.id){
          return{...item,isRead:true}
      }
      return {...item}
    })

    AsyncStorage.setItem("messages",JSON.stringify(newReadMsg))

    console.log("m",m)
    let unread = 0
    m.map(item => (!item.isRead && !item.isGeneral) && unread++)
    dispatch(setUnreadMessageNumber(unread))
    setReadToServer(readMessage)
  }

  const setReadToServer=(readMessage)=>{

    if(app.networkConnectivity ){ 
        readMessage.map(message=>{
            const url = urls.socialBaseUrl + urls.contactUs + urls.readMessage + `?Id=${message.id}`
            const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
            const params = {}
            
            const RC = new RestController()
            RC.checkPrerequisites("put" , url , params , header , (res)=>false , (res)=>false , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
        })
    }
  }
    
  const onSend = ()=>{
    if(app.networkConnectivity ){ 
      if(replyText != ""){
        setLoading(true)
        const url = urls.socialBaseUrl + urls.contactUs + "Admin"
        const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
        const params = {
            "id": 0,
            "userId": user.id,
            "insertDate": moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            "message": replyText,
            "isRead": true,
            "adminId": 0,
            "toAdmin": true,
            "isGeneral": false,
            "title": "",
            "isForce": true,
            "classification": props.route.params.message.classification,
            "isReadAdmin": true,
            "replyToMessage": props.route.params.message.id,
            "canReply": true
        }
        
        const RC = new RestController()
        RC.checkPrerequisites("post" , url , params , header , (res)=>setMessageSuccess(res,params) , setMessageFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
    
      }
      else{
        setErrorContext(lang.fillAllFild)
        setErrorVisible(true)
      }
    }
    else{
        setErrorContext(lang.noInternet)
        setErrorVisible(true)
    }
  }

  const setMessageSuccess = async (response , newMessage)=>{  
    console.log("newMessage",newMessage) 
    const allMessage = JSON.parse(await AsyncStorage.getItem("messages"))
    allMessage.push(newMessage)
    console.log("allMessage",allMessage) 

    AsyncStorage.setItem("messages",JSON.stringify(allMessage))
    setMessages([...messages , {...response.data.data}])
    setReplyText("")
    setLoading(false)
  } 

  const setMessageFailure = (error)=>{
    setLoading(false)
  }

  const onRefreshTokenSuccess = () =>{

  }

  const onRefreshTokenFailure = () =>{

  }

  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.pm}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView>
            {
              messages.map(item=>(
                <MessagesRow2
                  key={item.id.toString()}
                  item={item}
                  lang={lang}
                  user={user}
                  days={days}
                  onPress={()=>false}
                />
              ))
            }
            <ReplyMessage
                lang={lang}
                onChangeText={text=>setReplyText(text)}
                onPress={onSend}
                isLoading={loading}
                replyText={replyText}
            />
        </ScrollView>
        <Information
            visible={errorVisible}
            context={errorContext}
            onRequestClose={()=>setErrorVisible(false)}
            lang={lang}
        />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
  },
  text : {
    fontSize : moderateScale(18),
    color : defaultTheme.gray
  },
  text2 : {
    fontSize : moderateScale(13),
    color : defaultTheme.gray
  }
});

export default MessageDetailScreen;
