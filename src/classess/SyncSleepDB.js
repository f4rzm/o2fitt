export class SyncSleepDB {
    syncSleeprByLocal = (db , datas , date ,callBack)=>{
    console.log("SyncSleepDB datas",datas)
    const newData = []
    if(datas.length > 0){
      datas.map((data,index)=>{
        data._id &&
        db.find({
          selector: {_id: data._id}
        }).then(recs=>{
          const records = recs.docs
          console.log("SyncSleepDB records",records)
          if(records.length === 0){
              newData.push(data)
          }
          else{
            newData.push({...records[0] , ...data})
          }
          if(index === (datas.length)-1){
            this.updateData(db,newData,date,callBack)
          }
        })
      })
    }
    else{
      callBack && callBack(date)
    }
  }

  updateData=(db , newData , date , callBack)=>{
    console.log("newData",newData)
    newData.length > 0 &&
    db.bulkDocs(newData).then(()=>callBack?callBack(date):true).catch(error=>console.log("SyncSleepDB error",error))
  }
}