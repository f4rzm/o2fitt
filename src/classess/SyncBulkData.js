import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find'

PouchDB.plugin(pouchdbSearch)
const pdb = new PouchDB('water', { adapter: 'react-native-sqlite' })
export class SyncBulkData {
    syncData = (db , datas , searchKey, startDate)=>{
        console.log("datas",datas)
        console.log("searchKey",searchKey)
        console.log("startDate",startDate)
        db.find({
            selector : {
                [`${searchKey}`] : {$gte: startDate}
            }
        }).then(recs =>{
            console.log("recs",recs)
            let bulks = [...datas]
            let oldData = [...recs.docs]
            
            console.log("oldData",oldData)
            datas.map((data,index) =>{
              const i = recs.docs.findIndex(rec => rec._id === data._id)
              if(i > -1){
                bulks[index] = {...recs.docs[i] , ...data}
                oldData[i] = null
              }
            })

            db.bulkDocs(bulks).then(res=>{
                
                if(oldData.length > 0){
                    // console.log("ssssssssssss",oldData.filter(item=>item!=null))
                    db.bulkDocs(oldData.filter(item=>item!=null).map(item=>({...item , _deleted : true})))
                }
            })

            console.log("bulks",bulks)
            console.log("oldData",oldData)
        }).catch(error => console.log(error))
    }
}