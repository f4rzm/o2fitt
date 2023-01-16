import moment from "moment"

export class SyncWaterDB {
    syncWaterByLocal = (db , datas , selectedDate , waterBulkSync , callBack)=>{
        const reg = RegExp("^"+moment(selectedDate).format("YYYY-MM-DD"), "i")
        db.find({
          selector: {insertDate: {$regex: reg}}
        }).then(recs=>{
          console.log("SyncWaterDB datas",datas)
          console.log("SyncWaterDB recs",recs)
          const records = recs.docs

          let newData = []
         
          datas.map(data=>{
            const i = records.findIndex(r=>r._id === data._id)
            console.log("i",i)
            if(i === -1) newData.push(data)
          })

          waterBulkSync=true

          console.log("SyncWaterDB records.length",records.length)
          if(newData.length>0){
            console.log("newData",newData)
            db.bulkDocs(newData).then(()=>{
                waterBulkSync=false
                callBack(selectedDate)
            }).catch(e=>console.log(e))
          }
          else{
              waterBulkSync=false
              callBack(selectedDate)
          }
        })

    }
}