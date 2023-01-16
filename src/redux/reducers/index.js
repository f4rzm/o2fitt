import { combineReducers } from "redux"
import { app } from "./app/app"
import { lang } from "./lang/lang"
import { user } from "./user/user"
import { auth } from "./auth/auth"
import { profile } from "./profile/profile"
import { specification } from "./specification/specification"
import { pedometer } from './pedometer/pedometer'
import { diet } from './regime/diet'
import { starRating } from "./starRating/StarRating"
import { syncedDate } from "./syncedDate/syncedDate"

export default combineReducers({
    app: app,
    lang: lang,
    auth: auth,
    user: user,
    profile: profile,
    specification: specification,
    pedometer: pedometer,
    diet: diet,
    starRating:starRating,
    syncedDate:syncedDate
})