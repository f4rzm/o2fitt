export class SyncActivityDB {
    syncActivitiesByLocal = (db , datas , selectedDate , activityBulkSync , callBack)=>{
      const reg = RegExp("^"+selectedDate, "i")
      db.find({
        selector: {insertDate: {$regex: reg}}
      }).then(recs=>{
        console.log("recs",recs)
        const records = recs.docs
        let newRec = []
        let deletedItems = [...records].map(item=>({...item,_deleted : true}))
        
        datas.map(data=>{
          const index = records.findIndex(rec=>rec._id === data._id)
          if(index >= 0){
              newRec.push({...records[index] , ...data})
              deletedItems[index]=null
          }
          else{
              newRec.push(data)
          }
        })
  
        activityBulkSync=true
        if(newRec.length>0){
          console.log("bulks",newRec)
          db.bulkDocs([...newRec]).then((res)=>{
             this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , activityBulkSync , callBack)
          }).catch((error)=>{
            console.log("bulk error",error)
            this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , activityBulkSync , callBack)
          })
        }
        else{
          this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , activityBulkSync , callBack)
        }
      })
    }
  
    deleteExtraSteps = (db , selectedDate , deletedItems , activityBulkSync , callBack)=>{
        console.log("deletedItems",deletedItems)
        if(deletedItems.length>0){
            db.bulkDocs(deletedItems).then((res)=>{
            console.log("delete bulk res",res)
            activityBulkSync=false
            callBack(selectedDate)
          }).catch((error)=>{
            console.log("delete bulk error",error)
            activityBulkSync=false
            callBack(selectedDate)
          })
        }
        else{
          activityBulkSync=false
          callBack(selectedDate)
        }
    }
  }