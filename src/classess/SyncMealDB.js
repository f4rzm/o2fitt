export class SyncMealDB {
  syncMealsByLocal = (db , datas , selectedDate , mealBulkSync , callBack)=>{
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

      mealBulkSync=true
      
      if(newRec.length>0){
        console.log("bulks",newRec)
        db.bulkDocs([...newRec]).then((res)=>{
           this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , mealBulkSync , callBack)
        }).catch((error)=>{
          console.log("bulk error",error)
          this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , mealBulkSync , callBack)
        })
      }
      else{
        this.deleteExtraSteps(db , selectedDate , deletedItems.filter(item=>item!=null) , mealBulkSync , callBack)
      }
    })
  }

  deleteExtraSteps = (db , selectedDate , deletedItems , mealBulkSync , callBack)=>{
      console.log("deletedItems",deletedItems)
      if(deletedItems.length>0){
          db.bulkDocs(deletedItems).then((res)=>{
          console.log("delete bulk res",res)
          mealBulkSync=false
          callBack(selectedDate)
        }).catch((error)=>{
          console.log("delete bulk error",error)
          mealBulkSync=false
          callBack(selectedDate)
        })
      }
      else{
        mealBulkSync=false
        callBack(selectedDate)
      }
  }
}