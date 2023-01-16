import types from "../../../constants/actionTypes"

const INITIAL_STATE = [
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
      "insertDate": "0001-01-02T00:00:00",
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

export const specification = (state = INITIAL_STATE , action) => {
    console.log("specification reducer => action =>" , action)
    switch(action.type){
        case types.UPDATE_SPECIFICATION:
            if(action.data.length > 1){
                return{
                    ...action.data
                } 
            }
            const newState = {...state}
            newState[0]=action.data
            return{
                newState
            } 
    
        default : 
            return state
        
    }
}