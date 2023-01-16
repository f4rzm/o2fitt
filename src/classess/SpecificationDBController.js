import moment from "moment"
import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find'

const specificationDB = new PouchDB('specification', { adapter: 'react-native-sqlite' })

export class SpecificationDBController {

  put = async(datas , callBack=()=>false)=>{
    let res = await specificationDB.allDocs({include_docs : true , limit : 30 , descending : true})
    console.log("res",res)
    res = res.rows.map(item=>item.doc)
   
    await datas.map(async(data , index)=>{  
      delete data["_rev"]
      console.log("SyncSpecificationDB",data)
      try{
        console.log("res2",res)
        let records = res.filter(item=>item.insertDate.includes(data.insertDate.split("T")[0]))        
       
        console.log("records",records)
        if(records.length===0){
          console.log("SyncSpecificationDB put1")
          console.log("data",data)
          specificationDB.put(data).then(()=>{
            console.log("SyncSpecificationDB put")
            if(index===(datas.length-1)){
              callBack()
            }
          }).catch(err=>{
            console.warn("err",err)
          })
        }
        else{
          const hasBigger = records.find(item=>item._id>=data._id)
          if(!hasBigger){
            const updatedRecs = records.map(item=>({...item,_deleted : true}))
            updatedRecs.push(data)
            console.log("data",data)
            await specificationDB.bulkDocs(updatedRecs)
            console.log("SyncSpecificationDB bulkDocs")
            if(index===(datas.length-1)){
              callBack()
            }
          }
          else{
            if(index===(datas.length-1)){
              callBack()
            }
          }
        }
      }
      catch(e){
        console.warn(e)
      }
     
    })
  }

  getLastTwo =  async ()=>{
    const recs = await specificationDB.allDocs({
      include_docs : true,
    })
    console.log("getLastTwo",recs)
    const records = recs.rows.map(item=>item.doc)
    console.log("before",records)
    records.sort(this.sortDesc)
    console.log("after",records)
    if(records.length > 1){
      return records.slice(0,2)
    }
    else if(records.length === 1)
    {
      return[
        records[0],
        {
          "weightSize": 0,
          "bustSize": null,
          "armSize": null,
          "waistSize": 0,
          "highHipSize": null,
          "hipSize": null,
          "thighSize": null,
          "neckSize": null,
          "shoulderSize": null,
          "wristSize": null,
          "insertDate": "0001-01-01T00:00:00",
          "userProfileId": 0,
          "userProfiles": null,
          "_id": null,
          "id": 0
        }
      ]
    }
    else{
      return[
        {
          "weightSize": 0,
          "bustSize": null,
          "armSize": null,
          "waistSize": 0,
          "highHipSize": null,
          "hipSize": null,
          "thighSize": null,
          "neckSize": null,
          "shoulderSize": null,
          "wristSize": null,
          "insertDate": "0001-01-01T00:00:00",
          "userProfileId": 0,
          "userProfiles": null,
          "_id": null,
          "id": 0
        },   
        {
          "weightSize": 0,
          "bustSize": null,
          "armSize": null,
          "waistSize": 0,
          "highHipSize": null,
          "hipSize": null,
          "thighSize": null,
          "neckSize": null,
          "shoulderSize": null,
          "wristSize": null,
          "insertDate": "0001-01-01T00:00:00",
          "userProfileId": 0,
          "userProfiles": null,
          "_id": null,
          "id": 0
        }
      ]
    }
  }

  getCertainDate = async(date)=>{
    const reg = RegExp("^"+ date , "i")
    const recs = await specificationDB.find({
      selector : {insertDate: {$regex: reg}},
      sort:[{_id : "desc"}]
    })
    const records = recs.docs
    console.log("getCertainDate",records)
    if(records.length===0){
      return{
        "weightSize": 0,
        "bustSize": 0,
        "armSize": 0,
        "waistSize": 0,
        "highHipSize": 0,
        "hipSize": 0,
        "thighSize": 0,
        "neckSize": 0,
        "shoulderSize": 0,
        "wristSize": 0,
        "insertDate": date,
      }
    }
    else{
      return records[0]
    }
  }

  getSevenSequenceDays = async(callback)=>{
    let m =moment()
    m.subtract(6,"days")
    let week = []
    const model = {
      "weightSize": 0,
      "bustSize": null,
      "armSize": null,
      "waistSize": 0,
      "highHipSize": null,
      "hipSize": null,
      "thighSize": null,
      "neckSize": null,
      "shoulderSize": null,
      "wristSize": null,
      "insertDate": "0001-01-01T00:00:00",
      "userProfileId": 0,
      "userProfiles": null,
      "_id": null,
      "id": 0
    }

    new Array(7).fill(model).map(async(item , index)=>{
      const date = m.format("YYYY-MM-DD")
      m=m.add(1,"day")
      const w = await this.getCertainDate(date)
      week.push(w)
      if(index === 6){
        callback(week)
      }
    })

  }

  getLastSeven = (setData)=>{
  
    specificationDB.allDocs({
      include_docs : true,
      limit : 30,
      descending : true
    }).then(recs=>{console.warn(recs)})

    specificationDB.allDocs({
      include_docs : true,
      limit : 30,
      descending : true
    }).then(recs=>{
      let records = [...recs.rows.map(item=>item.doc)]
      records.sort(this.sortAsc)
      
      console.log("records",records)
      if(records.length < 7){
        const firstData = {...records[0]}
        let fillArray = []
        new Array(7 - records.length).fill(0).map((item,index)=>{
          fillArray.push({
            ...firstData,
            insertDate : moment(firstData.insertDate).subtract(7 - records.length - index , "days").format("YYYY-MM-DDTHH:mm:ss")
          })
        })
        setData([...fillArray , ...records])
      }
      else{
        setData([...records.slice(records.length-7,records.length)])
      }

      console.log(records.slice(records.length-7,records.length))
       
    })
  }

  sortDesc = ( a, b ) => {
    if ( a.insertDate < b.insertDate ){
      return 1;
    }
    if ( a.insertDate > b.insertDate ){
      return -1;
    }
    return 0;
  }

  sortAsc = ( a, b ) => {
    if ( a.insertDate < b.insertDate ){
      return -1;
    }
    if ( a.insertDate > b.insertDate ){
      return 1;
    }
    return 0;
  }
}