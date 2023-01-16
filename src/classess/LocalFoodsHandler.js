
import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import {fileSelector} from "../utils/foods"
import DeviceInfo from "react-native-device-info"
import AsyncStorage from '@react-native-async-storage/async-storage'

PouchDB.plugin(pouchdbSearch)

export class LocalFoodsHandler {
    EACH_FILE_RECORDS = 1000
    done = new Array(3).fill(false)
    startFrom = 1

    constructor(langName = 'persian' , onFinish){
        this.langName = langName
        this.foodDB = new PouchDB('food', { adapter: 'react-native-sqlite' })
        this.barcodeGs1DB = new PouchDB('barcodeGs1', { adapter: 'react-native-sqlite' })
        this.barcodeNationalDB = new PouchDB('barcodeNational', { adapter: 'react-native-sqlite' })
        // this.foodDB.destroy()
        this.onFinish = onFinish
    }

    hasUnsavedData = async(callback)=>{
        const appVersion =  DeviceInfo.getVersion()
        const olderLocalDatabaseVersion = await AsyncStorage.getItem("LocalDatabaseVersion")
        
        if(appVersion != olderLocalDatabaseVersion){
            callback(true , 1)
        }else{
            callback(false)
        }
    }

    startStoring = async (startFrom)=>{
        await this.foodDB.destroy()
        this.foodDB = new PouchDB('food', { adapter: 'react-native-sqlite'})
        let fileName = startFrom
        this.loadFile(fileName)
    }

    loadFile = async(fileName)=>{
        const file = fileSelector(fileName)
        if(file){
            let f = []

            file.map(item=>{
                f.push({...item,_id:item.name[this.langName]+"_"+item._id,name:item.name[this.langName]})
            })
            
            this.putFile(f, fileName)
          
        }
        else{
            AsyncStorage.setItem("LocalDatabaseVersion",DeviceInfo.getVersion())
            this.onFinish()
            await this.foodDB.createIndex({
                index: {
                    fields: ['foodId']
                }
            })
            this.testIndex()
        }
    }

    testIndex = ()=>{
        this.foodDB.find({
            selector : {foodId : {$eq : "0"}}
        }).then(res=>{
            console.log("ddddddd");
        }).catch(function (err) {
            console.error(err);
        });
    }

    putFile =(file , fileName)=>{
        this.foodDB.bulkDocs(file).then(res=>{
            console.log("putFile fileName",fileName)
            console.log("putFile done",res)
            this.loadFile(++fileName) 
        }).catch(error =>{
            console.log("putFile fileName",fileName)
            console.log("putFile error",error)
            this.loadFile(++fileName) 
        })
    }

    putUpdateFiles = async(data , callback)=>{
        let newFoods = []
        let updatedFoods = []
        data.map(f =>{
            f.isUpdate?
            updatedFoods.push({...f,_id:f.name[this.langName]+"_"+f._id,name:f.name[this.langName]}):
            newFoods.push({...f,_id:f.name[this.langName]+"_"+f._id,name:f.name[this.langName]})
        })
        console.log("updatedFoods",updatedFoods)
        console.log("newFoods",newFoods)
        const res = await this.foodDB.bulkDocs(newFoods)
        
        console.log("putUpdateFiles res",res)
        const conflictFile = newFoods.filter((item,index)=>res[index].error)
        console.log("conflictFile",conflictFile)
        if(conflictFile.length > 0){
            this.handleConflicts(conflictFile , 0 , callback , updatedFoods)
        }   
        else if(updatedFoods.length > 0) {
            this.handleUpdatedName(updatedFoods , 0 , callback)
        } 
        else{
            callback()
        }
    }

    handleConflicts=async(conflicts , index , callback , updatedFoods)=>{
        console.log("conflict",(conflicts))
        console.log("index",(index))
        try{
            await this.foodDB.createIndex({
                index: {
                  fields: ['foodId']
                }
            })
        }catch(e){
            console.log("eeeeeeeeeeeeeeee",e);
        }
        const res = await this.foodDB.get(conflicts[index]._id)
        const res2 = await this.foodDB.put({...res,...conflicts[index]})
        console.log("eeeeeeeeeeeeeeee",res);
        console.log("eeeeeeeeeeeeeeee",res2);
        console.log("updatedFoods",updatedFoods);
        
        if(index < (conflicts.length - 1)){
            index++
            this.handleConflicts(conflicts,index, callback , updatedFoods)
        }else{
            if(updatedFoods.length > 0){
                this.handleUpdatedName(updatedFoods , index , callback)
            }
            else{
                callback()
            } 
        }
    }

    handleUpdatedName=async(updatedFiles , index , callback)=>{
        console.log("updatedFiles",updatedFiles)
        console.log("index",(index))
        await this.foodDB.createIndex({
            index: {
              fields: ['foodId']
            }
        })
        const res = await this.foodDB.find({
            selector : {foodId : {$eq : updatedFiles[index].foodId}}
        })

        console.log("eeeeeeeeeeeeeeee",res);
        if(res.docs && res.docs.length > 0){
            const res2 = await this.foodDB.put({...res.docs[0],_deleted : true})
            const res3 = await this.foodDB.put({...updatedFiles[index]})
            console.log("eeeeeeeeeeeeeeee",res2);
            console.log("eeeeeeeeeeeeeeee",res3);
        }
        
        if(index < (updatedFiles.length - 1)){
            index++
            this.handleUpdatedName(updatedFiles,index,callback)
        } 
        else{
            callback()
        }
    }

    putBarcodeGs1 =(file , fileName)=>{
        this.barcodeGs1DB.bulkDocs(file.barcodeGs1).then(res=>{
            console.log("putBarcodeGs1 fileName",fileName)
            console.log("putBarcodeGs1 done",res)
            this.putBarcodeNational(file , fileName)
        }).catch(error =>{
            console.log("putBarcodeGs1 fileName",fileName)
            console.log("putBarcodeGs1 error",error)
            this.putBarcodeNational(file , fileName)
        })
    }

    putBarcodeNational =(file , fileName)=>{
        this.barcodeNationalDB.bulkDocs(file.barcodeNational).then(res=>{
            console.log("barcodeNational fileName",fileName)
            console.log("putBarcodeNational done",res)
            this.loadFile(++fileName) 
        }).catch(error =>{
            console.log("barcodeNational fileName",fileName)
            console.log("putBarcodeNational error",error)
            this.loadFile(++fileName) 
        })
    }

    updateBarcodeGs1 = (data , callback)=>{
        this.barcodeNationalDB.bulkDocs(data).then((res)=>{
            console.log("barcodeNationalDB res",res)
            callback()
        }).catch(err=>callback())
    }

    myMapFunction = (doc) => {
        doc.forEach(function (name) {
          emit(equipment.type);
        });
    }
}