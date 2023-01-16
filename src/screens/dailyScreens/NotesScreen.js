import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NoteRow, ConfirmButton, Toolbar } from '../../components';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import LottieView from 'lottie-react-native';

PouchDB.plugin(pouchdbSearch)
const noteDB = new PouchDB('note', { adapter: 'react-native-sqlite' })

const NotesScreen = props => {
  const lang = useSelector(state => state.lang)
  const [notes, setNote] = React.useState([])

  React.useEffect(() => {
    noteDB.changes({ since: 'now', live: true }).on('change', getData)
    getData()
  }, [])

  const getData = () => {
    noteDB.allDocs({ include_docs: true }).then(res => {
      console.log(res)
      setNote(res.rows.map(item => item.doc))
    })



  }

  const deleteNote = (item) => {
    console.log(item)
    noteDB.put({
      ...item,
      _deleted: true
    })
  }

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.notes}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ alignItems: "center", }}>
        {
          notes.length > 0 ?
            notes.map(item => (
              <NoteRow
                lang={lang}
                item={item}
                key={item._id}
                deleteNote={deleteNote}
              />
            )) :
            <View style={{ height: dimensions.WINDOW_HEIGTH * 0.7, paddingTop: "30%" }}>
              <LottieView
                style={{
                  width: dimensions.WINDOW_WIDTH * 0.4,
                  height: dimensions.WINDOW_WIDTH * 0.5,
                  alignSelf: "center"
                }}
                source={require('../../../res/animations/note.json')}
                autoPlay
                loop={false}
              />
              <Text style={[styles.text, { fontFamily: lang.font }]} allowFontScaling={false}>
                {
                  lang.noInsertNoteText
                }
              </Text>
            </View>
        }
      </ScrollView>
      <ConfirmButton
        style={styles.button1}
        lang={lang}
        title={lang.addNote}
        leftImage={require("../../../res/img/plus.png")}
        imageStyle={styles.img}
        textStyle={styles.buttonText}
        onPress={() => props.navigation.navigate("AddNoteScreen")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: defaultTheme.green,
  },
  button1: {
    width: dimensions.WINDOW_WIDTH * .4,
    height: moderateScale(45),
    backgroundColor: defaultTheme.green,
    borderRadius: moderateScale(6),
    marginTop: moderateScale(10),
    alignSelf: "center",
    marginBottom: moderateScale(30),
  },
  buttonText: {
    fontSize: moderateScale(15),
    marginHorizontal: moderateScale(2)
  },
  img: {
    width: moderateScale(19),
    height: moderateScale(19),
    tintColor: defaultTheme.lightBackground
  },
  text: {
    fontSize: moderateScale(16),
    marginVertical: moderateScale(20)
  }
});

export default NotesScreen;
