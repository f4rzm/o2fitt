import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { NoteRow, ConfirmButton , Toolbar} from '../../components';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import PouchDB from '../../../pouchdb'

const noteDB = new PouchDB('note', { adapter: 'react-native-sqlite' })

const AddNoteScreen = props => {
    const lang = useSelector(state=>state.lang)
    const input = React.createRef()
    const [context , setContext] = React.useState("")
    const [loading , setLoading] = React.useState("")

    const onConfirm = ()=>{
      setLoading(true)
      if(context != ""){
        noteDB.put({
          _id : Date.now().toString(),
          context : context
        }).then(()=>{
          props.navigation.goBack()
        })
      }
      else{
        props.navigation.goBack()
      }
    }

    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.addNote}
                onBack={()=>props.navigation.goBack()}
            />
            <ScrollView contentContainerStyle={{alignItems : "center"}}>  
              <TouchableOpacity style={styles.inputContainer} onPress={()=>input.current.focus()}>
                <TextInput
                    ref={input}
                    style={[styles.input,{fontFamily : lang.font}]}
                    placeholder={lang.addNote}
                    placeholderTextColor={defaultTheme.lightGray}
                    multiline={true}
                    onChangeText={text => setContext(text)}
                />
              </TouchableOpacity>
              <ConfirmButton
                  style={styles.button1}
                  lang={lang}
                  title={lang.save}
                  leftImage={require("../../../res/img/done.png")}
                  imageStyle={styles.img}
                  textStyle={styles.buttonText}
                  onPress={onConfirm}
                  isLoading={loading}
                />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor: defaultTheme.green,
  },
  inputContainer :{
    width : dimensions.WINDOW_WIDTH * 0.92,
    minHeight : moderateScale(120),
    borderWidth : 1.2,
    borderRadius : moderateScale(8),
    borderColor : defaultTheme.border,
    alignItems : "center",
    marginTop : moderateScale(30)
  },
  input:{
    width : "95%",
    fontSize : moderateScale(14),
    textAlign : "right",
    height:dimensions.WINDOW_HEIGTH*0.2,
    
  },
  button1 : {
    width : dimensions.WINDOW_WIDTH * .4,
    height : moderateScale(45),
    backgroundColor : defaultTheme.green,
    borderRadius : moderateScale(6),
    marginTop : moderateScale(40)
  },
  buttonText : {
    fontSize : moderateScale(15),
    marginHorizontal : moderateScale(2)
  },
  img : {
    width : moderateScale(19),
    height : moderateScale(19),
    tintColor : defaultTheme.lightBackground
  },
});

export default AddNoteScreen;
