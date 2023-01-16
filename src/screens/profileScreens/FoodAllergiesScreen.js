import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import {Information , FoodAlergy, Toolbar, ConfirmButton} from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector , useDispatch} from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import {urls} from "../../utils/urls"
import {RestController} from "../../classess/RestController"

import PouchDB from '../../../pouchdb'
import pouchdbSearch from 'pouchdb-find'

PouchDB.plugin(pouchdbSearch)
const alergyDB = new PouchDB('alergy', { adapter: 'react-native-sqlite' })
let foodsForRegister = []
const FoodAllergiesScreen = props => {

  const lang = useSelector(state=>state.lang)
  const user = useSelector(state=>state.user)
  const app = useSelector(state=>state.app)
  const auth = useSelector(state=>state.auth)
  const [name , setName]=React.useState("")
  const [newAlergyFood , setNewAlergyFood]=React.useState([])
  const [oldAlergyFood , setOldAlergyFood]=React.useState([])
  const [ingredients , setIngredients]=React.useState([])
  const [isLoading , setLoading]=React.useState(false)
  const [errorVisible , setErrorVisible] = React.useState(false)
  const [errorContext , setErrorContext] = React.useState("")
 
  React.useEffect(() => {
    if(app.networkConnectivity ){
      getAlergyFromServer()
    }
    else{
      getAlergyFromDB()
    }
  }, [])

  const getAlergyFromServer = ()=>{
    if(app.networkConnectivity ){
      const url = urls.foodBaseUrl + urls.UserFoodAlergy + "?UserId=" + user.id
      const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
      const params = {}

      const RC = new RestController()
      RC.checkPrerequisites("get" , url , params , header , getAlergySuccess , getAlergyFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
    }
    else{
      getAlergyFromDB()
    }
  }

  const getAlergySuccess = (response)=>{
    alergyDB.allDocs({include_docs: true}).then(allDocs => {
      return allDocs.rows.map(row => {
        return {_id: row.id, _rev: row.doc._rev, _deleted: true};
      });
    }).then(deleteDocs => {
      alergyDB.bulkDocs(deleteDocs).then(()=>{
        alergyDB.bulkDocs(response.data.data.map(
          item=>({...item , _id : Math.random().toString()}))
        ).then(()=>getAlergyFromDB()).
        catch(error=>console.log(error))
      })
    });
  }

  const getAlergyFailure = ()=>{

  }

  const getAlergyFromDB = ()=>{
    alergyDB.allDocs({include_docs:true}).
    then((rec)=>{
      setOldAlergyFood(rec.rows.map(item=>item.doc))
    })
  }

  const search = (text)=>{
    setName(text)
    if(app.networkConnectivity ){
        if(text != ""){
          const url = urls.foodBaseUrl + urls.ingredient  + urls.search + `?name=${encodeURI(text)}&Page=1&PageSize=10`
          const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
          const params = {}
  
          const RC = new RestController()
          RC.checkPrerequisites("get" , url , params , header , getSuccess , getFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
        }
    }
    else{
        setErrorContext(lang.noInternet)
        setErrorVisible(true)
    }
  }

  const getSuccess = (response)=>{
    console.log(response.data.items)
    setIngredients(response.data.data.items)
  }

  const getFailure = ()=>{
      setLoading(false)
      setErrorVisible(true)
      setErrorContext(lang.serverError)
  }


  const onIngredientPress = (selectedItem)=>{
    setName("")
    setIngredients([])
    if((oldAlergyFood.indexOf(item=>item.id === selectedItem.id))===-1){
      if((newAlergyFood.indexOf(item=>item.id === selectedItem.id))===-1){
        setNewAlergyFood([...newAlergyFood , selectedItem])
      }
    }
  }

  const onAddPressed = ()=>{
      if(ingredients.length === 1){
          setName("")
          setIngredients([])
          if((alergyFood.indexOf(item=>item.id === ingredients[0].id))===-1){
              setNewAlergyFood([...alergyFood , ingredients[0]])
          }
      }
  }

  const onConfirm = ()=>{
    foodsForRegister=[...newAlergyFood]
    setAlergy()
  }

  const setAlergy = ()=>{
    if(app.networkConnectivity ){ 
      foodsForRegister.map(item=>{
        const url = urls.foodBaseUrl + urls.UserFoodAlergy + urls.create
        const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
        const params = {
          id:0,
          userId : user.id,
          ingredientId : item.id,
          _id : Date.now().toString()
        }
  
        const RC = new RestController()
        RC.checkPrerequisites("post" , url , params , header , (res)=>setAlergySuccess(res,item) , setAlergyFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
      })
    }
    else{
        setErrorContext(lang.noInternet)
        setErrorVisible(true)
    }
  }

  const setAlergySuccess = (response , ingredient)=>{
    if(foodsForRegister.length > 0){
      console.log(ingredient.name)
      foodsForRegister.splice(0,1)
      console.log(foodsForRegister)
      setNewAlergyFood(foodsForRegister)
      let d = {...response.data.data , name : ingredient.name}
      delete d["ingredient"]
      oldAlergyFood.push(d)
      setOldAlergyFood([...oldAlergyFood])
    }
  }

  const setAlergyFailure = (error)=>{

  }

  const removeAlergy = (item)=>{
    if(app.networkConnectivity ){ 
        const url = urls.foodBaseUrl + urls.UserFoodAlergy + item.id
        const header = {headers : {Authorization : "Bearer " + auth.access_token , Language : lang.capitalName}}
        const params = {}
  
        const RC = new RestController()
        RC.checkPrerequisites("delete" , url , params , header , (res)=>removeAlergySuccess(res,item) , removeAlergyFailure , auth , onRefreshTokenSuccess , onRefreshTokenFailure)
      
    }
    else{
        setErrorContext(lang.noInternet)
        setErrorVisible(true)
    }
  }

  const removeAlergySuccess = (response , ingredient)=>{
    const index = oldAlergyFood.findIndex(item=>item.id === ingredient.id)
    if(index > -1){
      oldAlergyFood.splice(index,1)
      setOldAlergyFood([...oldAlergyFood])
    }
  }

  const removeAlergyFailure = (error)=>{
    
  }

  const onRefreshTokenSuccess = () =>{

  }

  const onRefreshTokenFailure = () =>{

  }
  return (
    <>
        <Toolbar
            lang={lang}
            title={lang.allergyFood}
            onBack={()=>props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{alignItems : "center"}}>
            <Text style={[styles.text , {fontFamily : lang.font}]} allowFontScaling={false}>
                {
                    lang.haveYouAllergy
                }
            </Text>

            <FoodAlergy
                lang={lang}
                name={name}
                onIngredientPress={onIngredientPress}
                onAddPressed={onAddPressed}
                search={search}
                ingredients={ingredients}
                alergyFood={[...oldAlergyFood,...newAlergyFood]}
                oldAlergyFood={[...oldAlergyFood]}
                newAlergyFood={[...newAlergyFood]}
                remove={removeAlergy}
            />

            <ConfirmButton
                lang={lang}
                style={styles.button}
                title={lang.saved}
                leftImage={require("../../../res/img/done.png")}
                onPress={onConfirm}
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
    fontSize : moderateScale(15),
    lineHeight : moderateScale(24),
    color : defaultTheme.gray,
    marginVertical : moderateScale(25)
  },
  text2 : {
    fontSize : moderateScale(13),
    color : defaultTheme.gray
  },
  button : {
      width : dimensions.WINDOW_WIDTH * 0.75,
      height : moderateScale(37),
      backgroundColor : defaultTheme.green,
      alignSelf : "center",
      marginTop : moderateScale(50)
  }
});

export default FoodAllergiesScreen;
