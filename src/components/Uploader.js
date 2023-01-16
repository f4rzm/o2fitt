
import React, { memo } from 'react';
import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import { View, StyleSheet } from 'react-native';
import { RestController } from "../classess/RestController"
import { updateProfileLocaly } from "../redux/actions"
import { useDispatch } from 'react-redux'

PouchDB.plugin(pouchdbSearch)
const offlineDB = new PouchDB('offline', { adapter: 'react-native-sqlite' })
const pedoDB = new PouchDB('pedo', { adapter: 'react-native-sqlite' })
const mealDB = new PouchDB('meal', { adapter: 'react-native-sqlite' })
const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' })
const waterDB = new PouchDB('water', { adapter: 'react-native-sqlite' })
const activityDB = new PouchDB('activity', { adapter: 'react-native-sqlite' })
const activipersonalActivityDBtyDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })

const Uploader = props => {
    const dispatch = useDispatch()
    const apis = React.useRef([]).current
    const RC = React.useRef(new RestController()).current
    const auth = props.auth
    let apiIndex = React.useRef(0).current

    React.useEffect(() => {
        if (props.app.networkConnectivity) {
            uploadController()
            apiIndex = 0
        }
    }, [props.app.networkConnectivity])

    function compare( a, b ) {
        if ( a.doc.index < b.doc.index ){
          return -1;
        }
        if ( a.doc.index > b.doc.index ){
          return 1;
        }
        return 0;
      }

    const uploadController = () => {
        offlineDB.allDocs({ include_docs: true}).then(unsendApis => {
        
            console.log("apiIndex =>", apiIndex)
            console.log("unsendApis =>", unsendApis)
            const revertUnsendAPIs=unsendApis.rows.sort(compare)
            console.log("unsendApis =>", revertUnsendAPIs)
            if (revertUnsendAPIs.length > 0) {
                if (apiIndex < revertUnsendAPIs.length) {
                    upload(revertUnsendAPIs[apiIndex].doc, 0)
                }
            }
        }).catch(error => {
            console.log("unsendApis error =>", error)
        })
    }

    const upload = (item, index) => {
        console.log("in upload", item)
        if (item.header.headers["Content-Type"] === "multipart/form-data") {
            var newParams = new FormData();
            item.params["_parts"].map(p => {
                newParams.append(p[0], p[1])
            })

            console.log("newParams", newParams)
            item.params = newParams
        }
        RC.checkPrerequisites(item.method, item.url, item.params, { headers: { ...item.header.headers, Authorization: "Bearer " + auth.access_token } }, (res) => onSuccess(res, item), (error) => onFailure(error, item), auth, onRefreshTokenSuccess, onRefreshTokenFailure)
    }

    const onSuccess = (response, offlineItem) => {
        console.log("onSuccess", response)
        console.log("onSuccess offlineItem", offlineItem)
        switch (offlineItem.type) {
            case "water":
                waterSync(response.data.data, offlineItem)
                break
            case "sleep":
                sleepSync(response.data.data, offlineItem)
                break
            case "meal":
                mealSync(response.data.data, offlineItem)
                break
            case "activity":
                activitySync(response.data.data, offlineItem)
                break
            case "personalActivitySync":
                personalActivitySync(response.data.data, offlineItem)
                break
            case "profile":
                profileSync(response.data.data, offlineItem)
                break

            default: {
                offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => { console.log("offlineDB", e); onFailure() })
                console.error(response.data.data);
            }
                break
        }
    }

    const onFailure = (error, offlineItem) => {
        apiIndex++
        uploadController()
        console.log("onFailure error", error)
        console.log("onFailure offlineItem", offlineItem)
    }

    const onRefreshTokenSuccess = () => {

    }

    const onRefreshTokenFailure = () => {

    }

    const waterSync = (response, offlineItem) => {
        console.log("waterSync", response)
        console.log("offlineItem", offlineItem)
        waterDB.find({
            selector: { _id: response._id }
        }).then(rec => {
            if (rec.docs.length > 0) {
                waterDB.put({ ...rec.docs[0], ...response })
            }
            else {
                waterDB.put(response)
            }
        })
        offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => console.log("offlineDB", e))
    }

    const sleepSync = (response, offlineItem) => {
        console.log("sleepSync", response)
        console.log("offlineItem", offlineItem)
        sleepDB.find({
            selector: { _id: response._id }
        }).then(rec => {
            if (rec.docs.length > 0) {
                sleepDB.put({ ...rec.docs[0], ...response })
            }
            else {
                sleepDB.put(response)
            }
        })

        offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => console.log("offlineDB", e))
    }

    const mealSync = (response, offlineItem) => {
        console.log("mealSync", response)
        console.log("offlineItem", offlineItem)
        // mealDB.find({
        //     selector: { _id: response._id }
        // }).then(rec => {
        //     if (offlineItem.method === "delete") {
        //         if (rec.docs.length > 0) {
        //             mealDB.put({ ...rec.docs[0], _deleted: true })
        //         }
        //     }
        //     else {
        //         if (rec.docs.length > 0) {
        //             mealDB.put({ ...rec.docs[0], ...response })
        //         }
        //         else {
        //             mealDB.put(response)
        //         }
        //     }
            offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => console.log("offlineDB", e))
        // })
    }

    const activitySync = (response, offlineItem) => {
        console.log("activitySync", response)
        console.log("offlineItem", offlineItem)
        activityDB.find({
            selector: { _id: response._id }
        }).then(rec => {
            if (offlineItem.method === "delete") {
                if (rec.docs.length > 0) {
                    activityDB.put({ ...rec.docs[0], _deleted: true })
                }
            }
            else {
                if (rec.docs.length > 0) {
                    activityDB.put({ ...rec.docs[0], ...response })
                }
                else {
                    activityDB.put(response)
                }
            }
            offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => console.log("offlineDB", e))
        })

    }

    const personalActivitySync = (response, offlineItem) => {
        console.log("mealSync", response)
        console.log("offlineItem", offlineItem)
        activipersonalActivityDBtyDB.find({
            selector: { _id: response._id }
        }).then(rec => {
            if (offlineItem.method === "delete") {
                if (rec.docs.length > 0) {
                    activipersonalActivityDBtyDB.put({ ...rec.docs[0], _deleted: true })
                }
            }
            else {
                if (rec.docs.length > 0) {
                    activipersonalActivityDBtyDB.put({ ...rec.docs[0], ...response })
                }
                else {
                    activipersonalActivityDBtyDB.put(response)
                }
            }

        })
    }

    const profileSync = (response, offlineItem) => {
        console.log("gGGG", response)
        dispatch(updateProfileLocaly(response))
        offlineDB.put({ ...offlineItem, _deleted: true }).then(() => uploadController()).catch((e) => console.log("offlineDB", e))
    }

    return <View style={style.container} />
}

const style = StyleSheet.create({
    container: {
        position: "absolute",
        left: -100,
        width: 0,
        height: 0
    }
})

export default (Uploader)